/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
import { ipcMain } from 'electron'

// ipcMain.handle = ipcMain.on & ipcMain.invoke = ipcMain.send
ipcMain.handle('test', (event, ...args) => 'IPC OK')
ipcMain.handle('submitVideo', (event, ...args) => {
  console.log(...args)
})
