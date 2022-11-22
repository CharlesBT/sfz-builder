/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

export class sfzGroup {
  sfz = {
    group: {
      group_label: 'Layer 1',
      lovel: 0,
      hivel: 127,
    },
  }

  regions = []

  constructor(label) {
    if (label) {
      this.set('group_label', label)
    }
  }

  set(key, value) {
    this.sfz.group[key] = value
  }

  get(key) {
    return this.sfz.group[key]
  }

  build() {
    let r = `\r\r<group>`
    for (const key of Object.keys(this.sfz.group)) {
      key !== 'regions' ? (r += this.writeSfzAttribute(this.sfz.group, key)) : null
    }

    // regions
    for (const region of this.regions) {
      r += region.build()
    }
    return r
  }

  writeSfzAttribute(section, attribute) {
    if (section[attribute] !== undefined) {
      return ` ${attribute}=${section[attribute]}`
    } else {
      return ''
    }
  }
}
