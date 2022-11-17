/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
import logger from 'electron-log'
import unhandled from 'electron-unhandled'

export function initLogger(): void {
  // configure log for debugging
  // Set log level for writing to file
  logger.transports.file.level = 'info'

  // Catch unhandled errors and promise rejections, log them instead of crashing
  unhandled({
    logger: (err) => logger.error(err),
    showDialog: false,
  })
}
