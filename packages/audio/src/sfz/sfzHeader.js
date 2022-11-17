/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { config } from '@bms/common'

function buildHeader() {
  let r = ''
  for (const line of config.sfz.header.values()) {
    r += `${line}\n`
  }
  return `${r}`
}

export const sfzHeader = buildHeader()
