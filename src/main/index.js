import os from 'os'
import path, { join } from 'path'
import axios from 'axios'
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { electronApp as Electron, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png'

import { Launch, Microsoft, Mojang } from 'minecraft-java-core'
import laucher from '../renderer/src/data/laucher'

const datadir =
  process.env.APPDATA ||
  (process.platform == 'darwin'
    ? `${process.env.HOME}/Library/Application Support`
    : process.env.HOME)

let Win = null
let game = new Launch()

const options = {
  title: laucher.name,
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
    min: client.memory[0] || 512,
    max: client.memory[1] || 4000
  }

  const response = await axios.get(laucher.config)
  const config = response.data

  const options = {
    java: true,
    timeout: 10000,
    detached: true,
    downloadFileMultiple: 30,
    memory,
    authenticator: client.user,
    loader: config.loader,
    verify: config.verify,
    version: config.version,
    ignored: ['loader', ...config.ignored],
    url: config.game_url ? config.files : config.game_url,
    path: `${datadir}/${
      process.platform == 'darwin' ? config.dataDirectory : `.${config.dataDirectory}`
    }`
  }

  game.Launch(options)

  game.on('extract', console.log)

  game.on('check', (progress, size) => {
    try {
      ev.sender.send('game-check', { progress, size })
    } catch (e) {
      console.log(e)
    }
  })

  game.on('estimated', (data) => {
    try {
      ev.sender.send('game-estimated', data)
    } catch (e) {
      console.log(e)
    }
  })

  game.on('speed', (speed) => {
    try {
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

  game.on('data', () => ev.sender.send('main-window-progress-reset'))
  game.on('close', (patch) => {
    try {
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
