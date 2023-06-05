import os from 'os'
import path, { join } from 'path'
import axios from 'axios'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp as Electron, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png'

import { Launch, Microsoft, Mojang } from 'minecraft-java-core'
import launcher from '../renderer/src/data/laucher'

import logger from 'log-beautify'

logger.trace('Trace')

const datadir =
  process.env.APPDATA ||
  (process.platform == 'darwin'
    ? `${process.env.HOME}/Library/Application Support`
    : process.env.HOME)

let Win = null
let game = new Launch()

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

  Win.close()
  game = null
  Win = null
}

function CreateWindow() {
  destroy()

  Win = new BrowserWindow(options)
  Win.setMenuBarVisibility(false)
  Win.on('ready-to-show', () => {
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

ipcMain.on('main-window-close', () => destroy())
ipcMain.on('main-window-minimize', () => Win.minimize())
ipcMain.on('main-window-progress', (ev, d) => Win.setProgressBar(d.DL / d.totDL))
ipcMain.on('main-window-progress-reset', () => Win.setProgressBar(0))

autoUpdater.autoDownload = false

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
  const memory = {
    min: client.memory ? client.memory[0] : 512,
    max: client.memory ? client.memory[1] : 4000
  }

  const response = await axios.get(launcher.config)
  const config = response.data

  logger.info_(client)

  const options = {
    java: true,
    timeout: 10000,
    detached: true,
    downloadFileMultiple: 6,
    memory: {
      min: `${memory.min * 1024}G`,
      Gax: `${memory.max * 1024}G`
    },
    authenticator: client.user,
    loader: config.loader,
    verify: config.verify,
    version: config.game_version,
    ignored: ['loader', ...config.ignored],
    url: config.game_url ? launcher.files : config.game_url,
    size: config.game_url ? launcher.files : config.game_url,
    path: `${datadir}/${config.dataDirectory}`
  }

  game.Launch(options)

  game.on('extract', console.log)

  game.on('check', (progress, size) => {
    try {
      logger.info_('Minecraft is checking', `${((progress / size) * 100).toFixed(0)}%`)
      ev.sender.send('game-check', { progress, size })
    } catch (e) {
      console.log(e)
    }
  })

  game.on('estimated', (data) => {
    try {
      let hh = Math.floor(data / 3600)
      let mm = Math.floor((data - hh * 3600) / 60)
      let ss = Math.floor(data - hh * 3600 - mm * 60)

      logger.info_('Minecraft files is estimated to download in ', `${hh}h ${mm}m ${ss}s`)
      ev.sender.send('game-estimated', data)
    } catch (e) {
      console.log(e)
    }
  })

  game.on('speed', (speed) => {
    try {
      logger.info_(`Download speed is `, `${(speed / 1067008).toFixed(2)} Mb/s`)
      ev.sender.send('game-speed', speed)
    } catch (e) {
      console.log(e)
    }
  })

  game.on('patch', (patch) => {
    try {
      ev.sender.send('game-patch', patch)
    } catch (e) {
      console.log(e)
    }
  })

  game.on('data', (data) => {
    logger.info_('Minecraft launched', data)
    ev.sender.send('main-window-progress-reset')
  })

  game.on('close', (patch) => {
    try {
      logger.info('Launcher')
      ev.sender.send('game-close', patch)
    } catch (e) {
      console.log(e)
    }
  })

  game.on('error', (error) => {
    try {
      ev.sender.send('game-error', error)
    } catch (e) {
      console.log(e)
    }
  })

  game.on('progress', (progress, size) => {
    try {
      ev.sender.send('game-progress', { progress, size })
    } catch (e) {
      console.log(e)
    }
  })
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
