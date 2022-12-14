import _ from 'lodash'
import type { sfzPatchOptions, sfzOptions, sfzProcessOptions } from '../types/sfz.js'
import { midiKeyMap } from './midiKeyMap.js'
import { sfzBuilder } from './sfzBuilder.js'

export class sfzBuilder_OneShots {
  static async process(
    inputPath: string,
    options: sfzOptions = {
      process: <sfzProcessOptions>{},
      patch: <sfzPatchOptions>{},
    },
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
