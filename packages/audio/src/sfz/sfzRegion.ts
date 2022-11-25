/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

export interface sfzRegionProps {
  [key: string]: number | string | boolean | undefined
  pitch_keycenter?: number
  lokey?: number
  hikey?: number
  loop_type?: string
  loop_start?: number
  loop_end?: number
  sample?: string
}

export class sfzRegion {
  sfzProps: sfzRegionProps = {
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
    this.sfzProps[key] = value
  }

  get(key: string) {
    return this.sfzProps[key]
  }

  build() {
    let r = `\r<region>`
    for (const key of Object.keys(this.sfzProps)) {
      r += this.writeSfzAttribute(this.sfzProps, key)
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
