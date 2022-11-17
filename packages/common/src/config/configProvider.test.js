/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

import { pkgRoot } from '../utils/pkgRoot.js'
import { readConfigFromFile, readConfigFromPackage } from './configProvider.js'

const __pkgRoot = pkgRoot(import.meta.url)
const configFile = join(__pkgRoot, '/config/app.config.jsonc')

describe.concurrent('configProvider', () => {
  it(`readConfigFromFile(file): should read config file from (${configFile})`, () => {
    const config = readConfigFromFile(configFile)
    let actual
    config && typeof config === 'object' && config !== null ? (actual = true) : (actual = false)
    const expected = true
    expect(actual).toEqual(expected)
  })

  it(`should read appname attribute from (${configFile})`, () => {
    const config = readConfigFromFile(configFile)
    let actual
    config.appname && config.appname === 'CONFIG' ? (actual = true) : (actual = false)
    const expected = true
    expect(actual).toEqual(expected)
  })

  it(`readConfigFromPackage(import_meta_url): should read config file for current package (${__pkgRoot})`, () => {
    const config = readConfigFromPackage(import.meta.url)
    let actual
    config && typeof config === 'object' && config !== null ? (actual = true) : (actual = false)
    const expected = true
    expect(actual).toEqual(expected)
  })

  it(`should read appname attribute for current package (${__pkgRoot})`, () => {
    const config = readConfigFromPackage(import.meta.url)
    let actual
    config.appname && config.appname === 'CONFIG' ? (actual = true) : (actual = false)
    const expected = true
    expect(actual).toEqual(expected)
  })
})
