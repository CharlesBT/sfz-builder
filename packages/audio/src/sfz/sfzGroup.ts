/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { sfzRegion } from './sfzRegion.js'
import type { sfzGroupProps } from '../types/sfz.js'

export class sfzGroup {
  sfzProps: sfzGroupProps = {
    group_label: 'Layer 1',
    lovel: 0,
    hivel: 127,
  }

  regions: sfzRegion[] = []

  constructor(label: string) {
    this.set('group_label', label)
  }

  set(key: string, value: string | number) {
    this.sfzProps[key] = value
  }

  get(key: string) {
    return this.sfzProps[key]
  }

  build() {
    let r = `\r\r<group>`
    for (const key of Object.keys(this.sfzProps)) {
      key !== 'regions' ? (r += this.writeSfzAttribute(this.sfzProps, key)) : null
    }

    // regions
    for (const region of this.regions) {
      r += region.build()
    }
    return r
  }

  writeSfzAttribute<S, A>(section: S, attribute: A) {
    const t = section[<keyof S>attribute]
    if (typeof t !== 'undefined') {
      return ` ${attribute}=${t}`
    } else {
      return ''
    }
  }
}
