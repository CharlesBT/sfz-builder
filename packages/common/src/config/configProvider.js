/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import fs from 'node:fs'
import { join } from 'node:path'

import JSON5 from 'json5'

import { pkgRoot } from '../utils/pkgRoot.js'

function readConfigFromFile(file) {
  try {
    const data = fs.readFileSync(file)
    const config = JSON5.parse(data.toString())
    return config
  } catch {
    // console.warn(`config file not found: ${file}`)
  }
}

function readConfigFromPackage(import_meta_url) {
  const __pkgRoot = pkgRoot(import_meta_url)
  const configFile = join(__pkgRoot, 'config/app.config.jsonc')
  const config = readConfigFromFile(configFile)
  return config
}

const config = readConfigFromPackage()
export { config, readConfigFromFile, readConfigFromPackage }
