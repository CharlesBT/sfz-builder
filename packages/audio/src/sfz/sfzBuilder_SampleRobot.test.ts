/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import path from 'node:path'
import { config } from '../config/configProvider.js'
import { filer } from '../filer/filer.js'
import { packageDirectorySync } from 'pkg-dir'
import { v4 as uuid } from 'uuid'
import fsExtra from 'fs-extra'
import { describe, expect, it } from 'vitest'
import { sfzBuilder_SampleRobot } from './sfzBuilder_SampleRobot.js'
import { sfzUtils } from './sfzUtils.js'
import type { sfzOptions, sfzProcessOptions } from './sfzBuilder.js'
import type { sfzPatchOptions } from './sfzPatch.js'

const __pkgRoot = packageDirectorySync() as string

// path to tests ressources
const testdir = path.join(__pkgRoot, config.folders.test, 'audio/sfz/sfzBuilder_SampleRobot')
const testtmp = path.join(
  __pkgRoot,
  config.folders.temp,
  '.test',
  'audio/sfz/sfzBuilder_SampleRobot',
)

// disable console.info out
console.info = () => null

// Async functions
describe('sfzBuilder_SampleRobot: should create sfz patch file for nolooped and non looped samples', () => {
  it('process(inputPath, options)', async () => {
    const patchName = 'sin_looped'
    const tmpdir = path.join(testtmp, uuid())
    await filer.copy(path.join(testdir, patchName), path.join(tmpdir, patchName))

    const OPTIONS: sfzOptions = {
      process: {
        recursive: false, // true for processing subfolders
        lowercase_extension: true,
        jsoninfo: true,
        convert_samplerate: false,
        convert_bitdepth: false,
        volume: 0,
        trim: false,
        fadeout: false,
      } as sfzProcessOptions,
      patch: {
        type: 'pad', // drumkit | instrument | piano | key | bass | guitar | pad | string | brass
        multi_velocity_layer: true,
        default_path: './samples/',
      } as sfzPatchOptions,
    }
    const source = path.join(tmpdir, patchName)
    await sfzBuilder_SampleRobot.process(source, OPTIONS)

    const ref = path.join(testdir, patchName, patchName + '.out')
    const out = path.join(source, patchName + '.sfz')

    expect(fsExtra.readFileSync(out)).toEqual(fsExtra.readFileSync(ref))

    // check that all samples path provided by the sfz file are complete
    const checkSamples = await sfzUtils.checkAllSamplePath(out)
    expect(checkSamples.every((elt) => elt.result === true)).toEqual(true)

    await fsExtra.remove(tmpdir)
  })
})
