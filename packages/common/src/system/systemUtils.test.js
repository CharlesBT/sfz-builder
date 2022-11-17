/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { describe, expect, it } from 'vitest'

import { systemUtils } from './systemUtils.js'

describe.concurrent('systemUtils', () => {
  it('getMemoryUsageInMB(valueInBytes): should return value in megabytes', () => {
    expect(systemUtils.getMemoryUsageInMB(1024 * 1024)).toEqual(1)
  })

  it('getNodeMemoryUsageInMB(): should display memory usage used by node process in mega bytes', () => {
    expect(systemUtils.getNodeMemoryUsageInMB()).toBeDefined()
  })
})
