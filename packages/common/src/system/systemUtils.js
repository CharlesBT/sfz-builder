/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import _ from 'lodash'

export class systemUtils {
  static getMemoryUsageInMB(valueInBytes) {
    // # bytes / KB / MB / GB
    const gbNow = valueInBytes / 1024 / 1024
    return _.round(gbNow, 2)
  }

  // get node memroy usage to console
  static getNodeMemoryUsageInMB() {
    const mu = process.memoryUsage()
    const r = {}
    for (const [key, value] of Object.entries(mu)) {
      r[key] = systemUtils.getMemoryUsageInMB(value)
    }
    return r
  }
}
