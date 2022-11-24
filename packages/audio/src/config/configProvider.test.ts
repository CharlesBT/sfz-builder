/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { describe, expect, it } from 'vitest'
import { config } from './configProvider.js'

describe.concurrent('configProvider', () => {
  it(`should read appname attribute from config file`, () => {
    let actual = false
    typeof config.folders !== 'undefined' ? (actual = true) : (actual = false)
    expect(actual).toEqual(true)
  })
})
