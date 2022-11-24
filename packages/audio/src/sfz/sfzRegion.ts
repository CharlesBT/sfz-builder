/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

export class sfzRegion {
  sfz: {
    [key: string]: number | string | boolean | undefined
    pitch_keycenter?: number
    lokey?: number
    hikey?: number
    loop_type?: string
    loop_start?: number
    loop_end?: number
    sample?: string
  } = {
    pitch_keycenter: undefined,
    lokey: undefined,
    hikey: undefined,
    loop_type: undefined, // forward | backward | alternate
    loop_start: undefined,
    loop_end: undefined,
    sample: undefined,
  }

  constructor(sampleFilePath?: string) {
    if (typeof sampleFilePath !== 'undefined') {
      this.set('sample', sampleFilePath)
    }
  }

  set(key: string, value: string | number) {
    this.sfz[key] = value
  }

  get(key: string) {
    return this.sfz[key]
  }

  build() {
    let r = `\r<region>`
    for (const key of Object.keys(this.sfz)) {
      r += this.writeSfzAttribute(this.sfz, key)
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
