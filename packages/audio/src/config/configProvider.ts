/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import fs from 'node:fs'
import { join } from 'node:path'
import JSON5 from 'json5'
import { packageDirectorySync } from 'pkg-dir'

export interface IConfig {
  [key: string]: any
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

function readConfig() {
  const configFile = join(<string>packageDirectorySync(), 'config/module.config.json5')
  return readConfigFromFile(configFile)
}

const config = readConfig()
export { config }
