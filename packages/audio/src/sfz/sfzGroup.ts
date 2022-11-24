/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
import type { sfzRegion } from './sfzRegion.js'

export class sfzGroup {
  sfz: {
    [key: string]: number | string | boolean | undefined
    group_label?: string
    lovel?: number
    hivel?: number
  } = {
    group_label: 'Layer 1',
    lovel: 0,
    hivel: 127,
  }

  regions: sfzRegion[] = []

  constructor(label: string) {
    this.set('group_label', label)
  }

  set(key: string, value: string | number) {
    this.sfz[key] = value
  }

  get(key: string) {
    return this.sfz[key]
  }

  build() {
    let r = `\r\r<group>`
    for (const key of Object.keys(this.sfz)) {
      key !== 'regions' ? (r += this.writeSfzAttribute(this.sfz, key)) : null
    }

    // regions
    for (const region of this.regions) {
      r += region.build()
    }
    return r
  }

  writeSfzAttribute<S, A>(section: S, attribute: A) {
    const t = section[attribute as keyof S]
    if (typeof t !== 'undefined') {
      return ` ${attribute}=${t}`
    } else {
      return ''
    }
  }
}
