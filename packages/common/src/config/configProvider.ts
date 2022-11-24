/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import fs from 'node:fs'
import { join } from 'node:path'

import JSON5 from 'json5'

import { pkgRoot } from '../utils/pkgRoot.js'

export interface IConfig {
  [key: string]: number | string | boolean | object | undefined
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

function readConfigFromFile(file: string): IConfig {
  try {
    const data = fs.readFileSync(file)
    const config = JSON5.parse(data.toString())
    return config as IConfig
  } catch {
    return {} as IConfig
  }
}

function readConfigFromPackage(import_meta_url?: string) {
  let __pkgRoot
  if (typeof import_meta_url !== 'undefined') {
    __pkgRoot = pkgRoot(import_meta_url)
  } else {
    __pkgRoot = pkgRoot()
  }
  if (typeof __pkgRoot !== 'undefined') {
    const configFile = join(__pkgRoot, 'config/app.config.json5')
    const config: IConfig = readConfigFromFile(configFile)
    return config
  }
  return {} as IConfig
}

const config = readConfigFromPackage()
export { config, readConfigFromFile, readConfigFromPackage }
