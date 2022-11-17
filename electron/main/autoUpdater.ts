/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
import { dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import { is } from 'electron-util'
import logger from 'electron-log'
import config from '@electron/config.json'

autoUpdater.logger = logger

// check for and apply any available updates
export default async function updateApp() {
  // Skip update in MAS build (updates are handled by App Store)
  if (!is.macAppStore) {
    try {
      // Check for update (GH Releases)
      await autoUpdater.checkForUpdates()
      // await autoUpdater.checkForUpdatesAndNotify()

      if (config.app.silentUpdater) {
        autoUpdater.autoDownload = true // enable auto downloading of updates
      } else {
        autoUpdater.autoDownload = false // disable auto downloading of updates

        // Listen for update available
        autoUpdater.on('update-available', async () => {
          logger.info('Update available')
          // prompt user to start download
          const diag = await dialog.showMessageBox({
            type: 'info',
            title: 'Update available',
            message: 'A new version is available. Do you want to download it now ?',
            buttons: ['Download', 'No'],
          })
          if (diag.response === 0) autoUpdater.downloadUpdate()
        })

        autoUpdater.on('update-downloaded', async () => {
          // prompt user to install and restart
          const diag = await dialog.showMessageBox({
            type: 'info',
            title: 'Install update',
            message: 'Update ready to be installed.\nInstall and restart ?',
            buttons: ['Yes', 'Later'],
          })
          if (diag.response === 0) autoUpdater.quitAndInstall(false, true)
        })
      }
    } catch (err) {
      // Ignore errors thrown because user is not connected to internet
      if (err instanceof Error) if (err.message !== 'net::ERR_INTERNET_DISCONNECTED') throw err
    }
  }
}
