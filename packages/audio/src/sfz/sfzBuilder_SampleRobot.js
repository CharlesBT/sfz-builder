/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { config } from '@bms/common'
import _ from 'lodash'

// import { midiKeyMap } from './midiKeyMap_SampleRobot.js' // not needed since we parse sfz file, no need to rebuild from wav filename
import { sfzBuilder } from './sfzBuilder.js'

export class sfzBuilder_SampleRobot {
  static async process(inputPath, options = { process: {}, patch: {} }) {
    _.defaults(options, { process: {}, patch: {} })
    _.defaults(options.process, {
      update_sfzfile: true, // update initial sfz files
      recursive: true, // true for processing subfolders
      patchname_from: 'sfz', // select sfz as source for gathering patches
      wav_regexp: config.sfz.wav_regexp.samplerobot, // catch patchname | rootkey | velocity
    })
    await sfzBuilder.processAllPatches(inputPath, options)
  }
}
