/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
import { release } from 'node:os'
import { join } from 'node:path'
import { app, BrowserWindow, shell, ipcMain } from 'electron'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import config from '../config.json'
import { initLogger } from './logger'
import autoUpdater from './autoUpdater'
import './ipcApi'

process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = app.isPackaged
  ? process.env.DIST
  : join(process.env.DIST_ELECTRON, '../public')

// FIX: fix for linux AppImage 'APPIMAGE env is not defined' https://stackoverflow.com/questions/52442650/electron-builder-linux-updates-appimage-env-is-not-defined
if (process.env.NODE_ENV === 'development') {
  process.env.APPIMAGE = join(__dirname, 'dist', `sfz-builder-${app.getVersion()}.AppImage`)
}

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

initLogger()

let mainWindow: BrowserWindow | null = null

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    title: config.app.title,
    icon: join(process.env.PUBLIC, config.app.icon),
    width: config.app.width,
    minWidth: config.app.minWidth,
    height: config.app.height,
    minHeight: config.app.minHeight,
    backgroundColor: config.app.backgroundColor,
    autoHideMenuBar: config.app.autoHideMenuBar,
    webPreferences: {
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: true, // must be false for using vite-plugin-electron-renderer
      spellcheck: config.app.spellcheck,
      devTools: config.app.devTools,
      preload,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    // electron-vite-vue#298
    await mainWindow.loadURL(url)
    // Open devTool if the app is not packaged
    mainWindow.webContents.openDevTools()
  } else {
    await mainWindow.loadFile(indexHtml)
    // mainWindow.webContents.openDevTools() // TODO: for testing > to be removed
  }

  // Test actively push message to the Electron-Renderer
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
  return
}

;(async () => {
  try {
    // Wait for Electron to be initialized
    await app.whenReady()
    await createWindow()
    setTimeout(autoUpdater, 3000) // check for app updates after 3 seconds
    installExtension(VUEJS3_DEVTOOLS)
      .then((name) => console.info(`Added Extension:  ${name}`))
      .catch((err) => console.info('An error occurred: ', err))

    // TODO: for testing ipc only, send event to the renderer process, comment for production
    testIpcOnStart()
  } catch (err) {
    console.error('An error occurred: ', err)
  }
})()

app.on('window-all-closed', () => {
  mainWindow = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (mainWindow) {
    // Focus on the main window if the user tried to open another
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: true,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}#${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
})

function testIpcOnStart() {
  setTimeout(() => {
    mainWindow?.webContents.send('welcome', 'Welcome from mainWindow !')
  }, 5000)
  ipcMain.on('welcome', (event, value) => {
    console.info(value)
  })
}
