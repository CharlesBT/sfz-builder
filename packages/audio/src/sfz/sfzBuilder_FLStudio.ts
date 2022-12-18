import _ from 'lodash'
import { config } from '../config/configProvider.js'
import type { sfzPatchOptions, sfzOptions, sfzProcessOptions } from '../types/sfz.js'
import { midiKeyMap } from './midiKeyMap_FLStudio.js'
import { sfzBuilder } from './sfzBuilder.js'

// const midiVelocityMap = new Map([
//     [1, [127]],
//     [2, [64, 127]],
//     [4, [32, 64, 96, 127]],
//     [8, [16, 32, 48, 64, 80, 96, 112, 127]],
//     [16, [8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 96, 104, 112, 120, 127]],
// ])

export class sfzBuilder_FLStudio {
  static async process(
    inputPath: string,
    options: sfzOptions = { process: {} as sfzProcessOptions, patch: {} as sfzPatchOptions },
  ): Promise<void> {
    _.defaults(options, { process: {}, patch: {} })
    _.defaults(options.process, {
      recursive: true, // true for processing subfolders
      remove_empty_wavfile: true, // delete empty wave files
      patchname_from: 'wav', // select wav as source for gathering patches
      wav_regexp: config.sfz.wav_regexp.flstudio, // catch patchname | rootkey | velocity
      midikeymap: midiKeyMap, // insert midiKeyMap in options
    })
    await sfzBuilder.processAllPatches(inputPath, options)
  }
}
