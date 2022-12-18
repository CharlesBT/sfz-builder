import { ipcMain } from 'electron'

// ipcMain.handle = ipcMain.on & ipcMain.invoke = ipcMain.send
ipcMain.handle('test', (event, ...args) => 'IPC OK')
ipcMain.handle('submitVideo', (event, ...args) => {
  console.info(...args)
})
