export {} // at least one export seems mandatory for the file declarations to be taken into account

// extends window renderer DOM object with electron contextBridge.exposeInMainWorld channels
declare interface IElectronAPI {
  versions: {
    node: () => string
    chrome: () => string
    electron: () => string
  }
  config: {
    electron: object
  }
  test: () => Promise<void>
  submitVideo: (path: string) => Promise<void>
  handleWelcomeFromMainWindow: (callback: ipcRendererOnCallback) => void
}

declare global {
  interface Window {
    ipc: IElectronAPI
  }
}
