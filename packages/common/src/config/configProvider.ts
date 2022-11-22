/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import fs from 'node:fs'
import { join } from 'node:path'

import JSON5 from 'json5'

import { pkgRoot } from '@/utils/pkgRoot.js'

export interface Config {
  appname: string
  folders: {
    temp: string
    logs: string
    src: string
    test: string
  }
  server: {
    logger: boolean
  }
}

function readConfigFromFile(file: string): Config {
  try {
    const data = fs.readFileSync(file)
    const config = JSON5.parse(data.toString())
    return config as Config
  } catch {
    return {} as Config
  }
}

function readConfigFromPackage(import_meta_url?: string): Config | undefined {
  if (typeof import_meta_url !== 'undefined') {
    const __pkgRoot = pkgRoot(import_meta_url)
    if (typeof __pkgRoot !== 'undefined') {
      const configFile = join(__pkgRoot, 'config/app.config.jsonc')
      const config: Config = readConfigFromFile(configFile)
      return config
    }
    return undefined
  }
}

const config = readConfigFromPackage()
export { config, readConfigFromFile, readConfigFromPackage }
