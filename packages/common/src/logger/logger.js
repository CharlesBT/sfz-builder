/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import 'dotenv/config'

import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import util from 'node:util'

import debug from 'debug' // needs also import 'dotenv/config'
import { createLogger, format, transports } from 'winston'

import { config } from '../config/configProvider.js'
import { dotenvConfig } from '../config/dotenvConfig.js'
import { pkgRoot } from '../utils/pkgRoot.js'

const __pkgRoot = pkgRoot()

let httpLogger = undefined
let logger = undefined

function Debug(module) {
  return debug(getNamespace(module))
}

// extract namespace from given module = import.meta.url
function getNamespace(import_meta_url) {
  const filename = fileURLToPath(import_meta_url)
  let namespace = filename.split(__pkgRoot).pop().replace(/\\/g, ':')
  namespace = namespace.replace(/\.[^.]*$/, '')
  return namespace.substring(1)
}

function formatModule(import_meta) {
  let r = undefined
  typeof import_meta === 'string' ? (r = { module: getNamespace(import_meta) }) : null
  return r
}

function redirectConsoleOutputs() {
  // console.log = (...args) => logger.info(util.format(...args)) // removed to keep standard console.log behaviour
  console.info = (msg, module, ...args) =>
    logger.info(msg, formatModule(module), util.format(...args))
  console.warn = (msg, module, ...args) =>
    logger.warn(msg, formatModule(module), util.format(...args))
  console.error = (msg, module, ...args) => {
    if (typeof msg === 'string') {
      return logger.error(msg, formatModule(module), util.format(...args))
    }
    return logger.error(util.format(msg), formatModule(module), util.format(...args))
  }
  // console.debug = (msg, module, ...args) => logger.debug(msg, formatModule(module), util.format(...args))
}

try {
  if (config.server.logger) {
    // httpLogger config
    httpLogger = createLogger({
      exitOnError: false,
      level: 'http',
      transports: [
        new transports.File({
          handleExceptions: false,
          format: format.json(),
          filename: join(__pkgRoot, config.folders.logs, 'server.log'),
        }),
      ],
    })

    // logger config
    logger = createLogger({
      level: process.env.LOG_LEVEL || 'debug',
      exitOnError: false,
      defaultMeta: { service: config.appname },
      format: format.json(),
      transports: [
        new transports.File({
          level: 'error',
          handleExceptions: false,
          filename: join(__pkgRoot, config.folders.logs, 'error.log'),
        }),
      ],
      exceptionHandlers: [
        new transports.File({
          level: 'error',
          handleExceptions: true,
          filename: join(__pkgRoot, config.folders.logs, 'exceptions.log'),
        }),
      ],
    })

    // logger config for production & test
    if (dotenvConfig.isProduction() || dotenvConfig.isTest()) {
      logger.add(
        new transports.Console({
          level: 'debug',
          handleExceptions: true,
          format: format.json(),
        }),
      )
      logger.add(
        new transports.File({
          level: 'debug',
          handleExceptions: false,
          format: format.json(),
          filename: join(__pkgRoot, config.folders.logs, 'debug.log'),
        }),
      )
    }

    // logger config for development
    if (dotenvConfig.isDevelopment()) {
      logger.add(
        new transports.Console({
          level: 'debug',
          handleExceptions: true,
          format: format.cli(),
        }),
      )
      logger.add(
        // for testing debug.log can be bypassed
        new transports.File({
          level: 'debug',
          handleExceptions: false,
          format: format.json(),
          filename: join(__pkgRoot, config.folders.logs, 'debug.log'),
        }),
      )
    }

    debug.log = (msg, module, ...args) =>
      logger.debug(msg, formatModule(module), util.format(...args)) // debug config : wrap debug calls to winston logger
  }
} catch {}

export { Debug, httpLogger, logger, redirectConsoleOutputs }
