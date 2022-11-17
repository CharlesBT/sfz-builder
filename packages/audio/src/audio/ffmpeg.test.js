/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import '../../__mocks__/modules.js'

import { join } from 'node:path'

import { config, pkgRoot, uuid } from '@bms/common'
import fsExtra from 'fs-extra'
import { describe, expect, it } from 'vitest'

import { ffmpeg } from './ffmpeg.js'

const __pkgRoot = pkgRoot(import.meta.url)

// path to tests ressources
const testdir = join(__pkgRoot, config.folders.test, 'audio/audioEncoder')
const testtmp = join(__pkgRoot, config.folders.temp, '.test', 'audio/audioEncoder')

describe.concurrent('ffmpeg', () => {
  it('writeJsonInfo(file): should extract data from wav file and write JSON file info', async () => {
    const inFilename = 'audioEncoder_1s.wav'
    const outFilename = 'audioEncoder_1s.wav.json'
    const tmpdir = join(testtmp, uuid.v4())
    fsExtra.ensureDirSync(tmpdir)
    fsExtra.copySync(join(testdir, inFilename), join(tmpdir, inFilename))
    await ffmpeg.writeJsonInfo(join(tmpdir, inFilename))
    expect(fsExtra.readFileSync(join(tmpdir, outFilename))).toEqual(
      fsExtra.readFileSync(join(testdir, outFilename)),
    )
    fsExtra.removeSync(tmpdir)
  })
})
