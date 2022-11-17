/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { config } from '@bms/common'
import _ from 'lodash'

import { midiKeyMap } from './midiKeyMap.js'
import { sfzBuilder } from './sfzBuilder.js'

// const midiVelocityMap = new Map([
//     [1, [63]],
//     [2, [31, 95]],
//     [4, [15, 47, 79, 111]],
//     [8, [7, 23, 39, 55, 71, 87, 103, 119]],
//     [16, [3, 11, 19, 27, 35, 43, 51, 59, 67, 75, 83, 91, 99, 107, 115, 123]],
// ])

export class sfzBuilder_AudioLayer {
  static async process(inputPath, options = { process: {}, patch: {} }) {
    _.defaults(options, { process: {}, patch: {} })
    _.defaults(options.process, {
      recursive: true, // true for processing subfolders
      remove_empty_wavfile: true, // delete empty wave files
      patchname_from: 'wav', // select wav as source for gathering patches
      wav_regexp: config.sfz.wav_regexp.audiolayer, // catch patchname | rootkey | velocity
      midikeymap: midiKeyMap, // insert midiKeyMap in options
      velocitytransformer: sfzBuilder_AudioLayer.getVelocityReference,
    })
    await sfzBuilder.processAllPatches(inputPath, options)
  }

  static getVelocityReference(value) {
    const velocityRef = [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 127]
    const v = value * 2
    const r = velocityRef.reduce((a, b) => {
      return Math.abs(b - v) < Math.abs(a - v) ? b : a
    })
    return r
  }
}
