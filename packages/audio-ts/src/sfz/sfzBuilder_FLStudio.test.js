/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import '../../__mocks__/modules.js'

import path from 'node:path'

import { config, filer, pkgRoot, uuid } from '@bms/common'
import fsExtra from 'fs-extra'
import { describe, expect, it } from 'vitest'

import { sfzBuilder_FLStudio } from './sfzBuilder_FLStudio.js'
import { sfzUtils } from './sfzUtils.js'

const __pkgRoot = pkgRoot(import.meta.url)

// path to tests ressources
const testdir = path.join(__pkgRoot, config.folders.test, 'audio/sfz/sfzBuilder_FLStudio')
const testtmp = path.join(__pkgRoot, config.folders.temp, '.test', 'audio/sfz/sfzBuilder_FLStudio')

// disable console.info out
console.info = () => null

// Async functions
describe('sfzBuilder_FLStudio: should create sfz patch file for nolooped and non looped samples', () => {
  it('process(inputPath, options)', async () => {
    const patchName = 'sin_looped'
    const tmpdir = path.join(testtmp, uuid.v4())
    await filer.copy(path.join(testdir, patchName), path.join(tmpdir, patchName))

    const OPTIONS = {
      process: {
        recursive: false, // true for processing subfolders
        lowercase_extension: true,
        jsoninfo: true,
        convert_samplerate: false,
        convert_bitdepth: false,
        volume: 0,
        trim: false,
        fadeout: false,
      },
      patch: {
        type: 'pad', // drumkit | instrument | piano | key | bass | guitar | pad | string | brass
        multi_velocity_layer: true,
        default_path: './samples/',
      },
    }
    const source = path.join(tmpdir, patchName)
    await sfzBuilder_FLStudio.process(source, OPTIONS)

    const ref = path.join(testdir, patchName, patchName + '.out')
    const out = path.join(source, patchName + '.sfz')

    expect(fsExtra.readFileSync(out)).toEqual(fsExtra.readFileSync(ref))

    // check that all samples path provided by the sfz file are complete
    const checkSamples = await sfzUtils.checkAllSamplePath(out)
    expect(checkSamples.every((elt) => elt.result === true)).toEqual(true)

    await fsExtra.remove(tmpdir)
  })
})
