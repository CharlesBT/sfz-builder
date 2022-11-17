/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
import { contextBridge, ipcRenderer } from 'electron'
import config from '../config.json'

// recommended: use ipcRenderer.invoke for bidirectionnal ipc (main<->rendered), returns a promise no need to use ipcRenderer.on
// recommended: use ipcRenderer.on for unidirectionnal ipc (main->rendered)
// not recommended: use ipcRenderer.send for bidirectionnal ipc, needs ipcRenderer.on in rendered to manage the response
contextBridge.exposeInMainWorld('ipc', {
  versions: {
    node: () => `node: ${process.versions.node}`,
    chrome: () => `chrome: ${process.versions.chrome}`,
    electron: () => `electron: ${process.versions.electron}`,
  },
  config: {
    electron: config,
  },

  // bidirectional main <-> rendered
  test: () => ipcRenderer.invoke('test'),
  submitVideo: (path: string) => ipcRenderer.invoke('submitVideo', path),

  // unidirectionnal ipc main-> rendered
  handleWelcomeFromMainWindow: (callback: ipcRendererOnCallback) =>
    ipcRenderer.on('welcome', callback),
})
