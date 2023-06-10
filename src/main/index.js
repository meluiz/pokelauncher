import os from 'os'
import path, { join } from 'path'
import axios from 'axios'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp as Electron, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png'

import { Launch, Microsoft, Mojang } from 'minecraft-java-core'
import launcher from '../renderer/src/data/laucher'

import { pino } from 'pino'

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
})

const datadir =
  process.env.APPDATA ||
  (process.platform == 'darwin'
    ? `${process.env.HOME}/Library/Application Support`
    : process.env.HOME)

let Win = null
let game = new Launch()
let tried = 0

const options = {
  title: launcher.name,
  width: 400,
  height: 500,
  show: false,
  resizable: false,
  transparent: os.platform() === 'win32',
  frame: os.platform() !== 'win32',
  ...(process.platform === 'linux' ? icon : {}),
  icon: `./resources/icon.${os.platform() === 'win32' ? 'ico' : 'png'}`,
  webPreferences: {
    allowRunningInsecureContent: true,
    preload: path.join(__dirname, '../preload/index.js'),
    sandbox: false
  }
}

function destroy() {
  if (!Win) {
    return
  }

  logger.info('Destroying window')

  Win.close()

  game = null
  Win = null
}

function tryCatch(sender, channel, args) {
  try {
    sender.send(channel, args)
  } catch (_) {
    // ignore
  }
}

function CreateWindow() {
  destroy()

  console.clear()
  logger.info('Creating window')
  Win = new BrowserWindow(options)
  Win.setMenuBarVisibility(false)

  Win.on('ready-to-show', () => {
    logger.info('Window ready to show')
    Win.show()
  })

  Win.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    Win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    Win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  logger.info(`Launching ${launcher.name}`)
}

ipcMain.on('update-window-dev-tools', () => Win.getWindow().webContents.openDevTools())
ipcMain.on('main-window-open', function () {
  Win.setSize(1280, 720)
  Win.setResizable(true)
  Win.setMinimumSize(980, 552)
  Win.center()
})

ipcMain.on('main-window-show', () => Win.show())
ipcMain.on('main-window-hide', () => Win.hide())
ipcMain.on('main-window-close', () => destroy())
ipcMain.on('main-window-minimize', () => Win.minimize())
ipcMain.on('main-window-progress', (_, d) => Win.setProgressBar(d.DL / d.totDL))
ipcMain.on('main-window-progress-reset', () => Win.setProgressBar(0))

ipcMain.handle('update-laucher', () => {
  return new Promise((resolve) => {
    autoUpdater
      .checkForUpdates()
      .then(() => {
        resolve()
      })
      .catch((error) => {
        resolve({
          error: true,
          message: error
        })
      })
  })
})

autoUpdater.autoDownload = false

autoUpdater.on('update-available', () => {
  Win.webContents.send('update-available')
})

ipcMain.on('start-update', () => {
  autoUpdater.downloadUpdate()
})

autoUpdater.on('update-not-available', () => {
  Win.webContents.send('update-not-available')
})

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

autoUpdater.on('download-progress', (progress) => {
  Win.webContents.send('download-progress', progress)
})

ipcMain.handle('system-memory', () => {
  return {
    hostname: os.hostname(),
    loadavg: os.loadavg(),
    uptime: os.uptime(),
    freemem: os.freemem(),
    totalmem: os.totalmem(),
    cpus: os.cpus(),
    platform: os.platform(),
    release: os.release(),
    version: os.version(),
    arch: os.arch(),
    type: os.type()
  }
})

ipcMain.handle('auth-offline', async (ev, client) => {
  const session = await Mojang.login(client)
  return session
})

ipcMain.handle('auth-microsoft', async (ev, client) => {
  return await new Microsoft(client).getAuth()
})

ipcMain.handle('launch-game', async (ev, client) => {
  logger.info('Starting download')

  const memory = {
    min: client.memory ? client.memory[0] : 512,
    max: client.memory ? client.memory[1] : 4000
  }

  const response = await axios.get(launcher.config)
  const config = response.data

  const options = {
    java: true,
    timeout: 10000,
    detached: false,
    downloadFileMultiple: 6,
    authenticator: client.user,
    loader: config.loader,
    verify: config.verify,
    version: config.game_version,
    ignored: ['loader', ...config.ignored],
    url: launcher.files,
    size: launcher.files,
    path: `${datadir}/${config.dataDirectory}`,
    memory: {
      min: `${memory.min}M`,
      max: `${memory.max}M`
    }
  }

  game.Launch(options)

  game.on('progress', (downloaded, totalSize, patch) =>
    tryCatch(ev.sender, 'game-progress', { downloaded, totalSize, patch })
  )

  game.on('check', (checked, totalSize, patch) =>
    tryCatch(ev.sender, 'game-progress', { checked, totalSize, patch })
  )

  game.on('extract', (extract) => tryCatch(ev.sender, 'game-progress', { extract }))
  game.on('estimated', (time) => tryCatch(ev.sender, 'game-estimated', { time }))
  game.on('speed', (time) => tryCatch(ev.sender, 'game-speed', { time, tried }))
  game.on('patch', (patch) => tryCatch(ev.sender, 'game-patch', { patch }))
  game.on('close', (code) => tryCatch(ev.sender, 'game-close', { code }))
  game.on('error', (error) => tryCatch(ev.sender, 'game-error', { error }))
  game.on('data', (data) => tryCatch(ev.sender, 'game-data', { data }))
})

app.whenReady().then(() => {
  Electron.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  CreateWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) CreateWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
