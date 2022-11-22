/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import _ from 'lodash'

export class systemUtils {
  static getMemoryUsageInMB(valueInBytes: number): number {
    // # bytes / KB / MB / GB
    const gbNow = valueInBytes / 1024 / 1024
    return _.round(gbNow, 2)
  }

  // get node memory usage to console
  static getNodeMemoryUsageInMB() {
    const r: { [key: string]: number } = {}
    for (const [key, value] of Object.entries(process.memoryUsage())) {
      r[key] = systemUtils.getMemoryUsageInMB(value)
    }
    return r
  }
}
