/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

export class sfzRegion {
  sfz = {
    region: {
      pitch_keycenter: undefined,
      lokey: undefined,
      hikey: undefined,
      loop_type: undefined, // forward | backward | alternate
      loop_start: undefined,
      loop_end: undefined,
      sample: undefined,
    },
  }

  constructor(sampleFilePath) {
    if (sampleFilePath) {
      this.set('sample', sampleFilePath)
    }
  }

  set(key, value) {
    this.sfz.region[key] = value
  }

  get(key) {
    return this.sfz.region[key]
  }

  build() {
    let r = `\r<region>`
    for (const key of Object.keys(this.sfz.region)) {
      r += this.writeSfzAttribute(this.sfz.region, key)
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
