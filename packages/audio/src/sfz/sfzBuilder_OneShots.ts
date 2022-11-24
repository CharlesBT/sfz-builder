/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import _ from 'lodash'
import { midiKeyMap } from './midiKeyMap.js'
import { sfzBuilder } from './sfzBuilder.js'
import type { sfzOptions, sfzProcessOptions } from './sfzBuilder.js'
import type { sfzPatchOptions } from './sfzPatch.js'

export class sfzBuilder_OneShots {
  static async process(
    inputPath: string,
    options: sfzOptions = { process: {} as sfzProcessOptions, patch: {} as sfzPatchOptions },
  ) {
    _.defaults(options, { process: {}, patch: {} })
    _.defaults(options.process, {
      remove_empty_wavfile: true, // delete empty wave files
      autorename_wavfile: true, // auto rename wav file from folder name
      patchname_from: 'folder', // select foldername as source for gathering patches
      volume_reference: 'sample', // 'patch' (default) | 'sample', select volume reference mode based on overall patch level or independante reference for each sample
      midikeymap: midiKeyMap, // insert midiKeyMap in options
    })
    _.defaults(options.patch, {
      startkey: 'C-2', // key from hich to strat sample assignment, C-2 (default) | C6
      type: 'fx',
    })

    await sfzBuilder.processAllPatches(inputPath, options)
  }
}
