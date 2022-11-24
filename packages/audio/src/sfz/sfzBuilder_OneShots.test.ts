/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import path from 'node:path'
import { config } from '../config/configProvider.js'
import { filer } from '../filer/filer.js'
import { packageDirectorySync } from 'pkg-dir'
import { v4 as uuid } from 'uuid'
import fsExtra from 'fs-extra'
import { describe, expect, it } from 'vitest'
import { sfzBuilder_OneShots } from './sfzBuilder_OneShots.js'
import { sfzUtils } from './sfzUtils.js'
import type { sfzOptions, sfzProcessOptions } from './sfzBuilder.js'
import type { sfzPatchOptions } from './sfzPatch.js'

const __pkgRoot = packageDirectorySync() as string

// path to tests ressources
const testdir = path.join(__pkgRoot, config.folders.test, 'audio/sfz/sfzBuilder_OneShots')
const testtmp = path.join(__pkgRoot, config.folders.temp, '.test', 'audio/sfz/sfzBuilder_OneShots')

// disable console.info out
console.info = () => null

// Async functions
describe('sfzBuilder_OneShots: should create sfz patch file for oneshots samples', () => {
  it('process(inputPath, options)', async () => {
    const patchName = 'oneshots'
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
        type: 'fx',
        default_path: './samples/',
      } as sfzPatchOptions,
    }
    const source = path.join(tmpdir, patchName)
    await sfzBuilder_OneShots.process(source, OPTIONS)

    const ref = path.join(testdir, patchName, patchName + '.out')
    const out = path.join(source, patchName + '.sfz')

    expect(fsExtra.readFileSync(out)).toEqual(fsExtra.readFileSync(ref))

    // check that all samples path provided by the sfz file are complete
    const checkSamples = await sfzUtils.checkAllSamplePath(out)
    expect(checkSamples.every((elt) => elt.result === true)).toEqual(true)

    await fsExtra.remove(tmpdir)
  })
})