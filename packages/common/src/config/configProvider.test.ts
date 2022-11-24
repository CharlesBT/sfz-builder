/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { pkgRoot } from '../utils/pkgRoot.js'
import { readConfigFromFile, readConfigFromPackage } from './configProvider.js'

const __pkgRoot = pkgRoot(import.meta.url)
const configFile = __pkgRoot ? join(__pkgRoot, '/config/app.config.json5') : undefined

describe.concurrent('configProvider', () => {
  it(`readConfigFromFile(file): should read config file from (${configFile})`, () => {
    let actual = false
    if (typeof configFile !== 'undefined') {
      const config = readConfigFromFile(configFile)
      typeof config === 'object' && config !== null ? (actual = true) : (actual = false)
    }
    expect(actual).toEqual(true)
  })

  it(`should read appname attribute from (${configFile})`, () => {
    let actual = false
    if (typeof configFile !== 'undefined') {
      const config = readConfigFromFile(configFile)
      config.appname && config.appname === 'CONFIG' ? (actual = true) : (actual = false)
    }
    expect(actual).toEqual(true)
  })

  it(`readConfigFromPackage(import_meta_url): should read config file for current package (${__pkgRoot})`, () => {
    let actual = false
    const config = readConfigFromPackage(import.meta.url)
    config && typeof config === 'object' && config !== null ? (actual = true) : (actual = false)
    expect(actual).toEqual(true)
  })

  it(`should read appname attribute for current package (${__pkgRoot})`, () => {
    let actual = false
    const config = readConfigFromPackage(import.meta.url)
    if (typeof config !== 'undefined') {
      config.appname && config.appname === 'CONFIG' ? (actual = true) : (actual = false)
    }
    expect(actual).toEqual(true)
  })
})
