/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { join } from 'node:path'
import { config } from '../config/configProvider.js'
import { packageDirectorySync } from 'pkg-dir'
import { v4 as uuid } from 'uuid'
import fsExtra from 'fs-extra'
import { describe, expect, it } from 'vitest'
import { wavUtils } from './wavUtils.js'

const __pkgRoot = <string>packageDirectorySync()

// path to tests ressources
const testdir = join(__pkgRoot, config.folders.test, 'audio/wavUtils')
const testtmp = join(__pkgRoot, config.folders.temp, '.test', 'audio/wavUtils')

describe.concurrent('wavUtils', () => {
  it('writeJsonInfo(file): should extract data from wav file containing loop points and write JSON file info', async () => {
    const inFilename = 'wavUtils-looped-writeJsonInfo.wav'
    const outFilename = 'wavUtils-looped-writeJsonInfo.wav.json'
    const tmpdir = join(testtmp, uuid())
    fsExtra.ensureDirSync(tmpdir)
    fsExtra.copySync(join(testdir, inFilename), join(tmpdir, inFilename))
    await wavUtils.writeJsonInfo(join(tmpdir, inFilename))
    expect(fsExtra.readFileSync(join(tmpdir, outFilename))).toEqual(
      fsExtra.readFileSync(join(testdir, outFilename)),
    )
    fsExtra.removeSync(tmpdir)
  })

  it('updateJsonInfo(file): should update .json data from wav file', async () => {
    const inFilename = 'wavUtils-looped-writeJsonInfo.wav'
    const outFilename = 'wavUtils_looped-updateJsonInfo.wav'
    const tmpdir = join(testtmp, uuid())
    fsExtra.ensureDirSync(tmpdir)
    fsExtra.copySync(join(testdir, inFilename + '.json'), join(tmpdir, inFilename + '.json'))
    const info = await wavUtils.getJsonInfo(join(tmpdir, inFilename))
    info.streams[0].max_volume = 0
    await wavUtils.updateJsonInfo(join(tmpdir, outFilename), info)
    expect(fsExtra.readFileSync(join(tmpdir, outFilename + '.json'))).toEqual(
      fsExtra.readFileSync(join(testdir, outFilename + '.json')),
    )
    fsExtra.removeSync(tmpdir)
  })

  it('getJsonInfo(file): should read .json data from wav file', async () => {
    const expected = {
      streams: [
        {
          codec_name: 'pcm_s24le',
          sample_rate: '48000',
          channels: 2,
          bits_per_sample: 24,
          duration_ts: 14302,
          duration: '0.297958',
          nb_samples: 28604,
          max_volume: -1,
          mean_volume: -13,
        },
      ],
      format: { format_name: 'wav', duration: '0.297958', size: '86004' },
      loop: {
        start_sample: 6660,
        end_sample: 14301,
        start_time: 0.13875,
        end_time: 0.2979375,
      },
    }

    await expect(
      wavUtils.getJsonInfo(join(testdir, 'wavUtils-looped-writeJsonInfo.wav')),
    ).resolves.toEqual(expected)
  })
})
