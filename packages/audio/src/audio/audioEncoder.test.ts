import { join } from 'node:path'
import { packageDirectorySync } from 'pkg-dir'
import { v4 as uuid } from 'uuid'
import fsExtra from 'fs-extra'
import { describe, expect, it } from 'vitest'
import { config } from '../config/configProvider.js'
import { audioEncoder } from './audioEncoder.js'

const __pkgRoot = <string>packageDirectorySync()

const MAX_SAMPLERATE = config.encoder.maxsamplerate
const MAX_BITDEPTH = config.encoder.maxbitdepth
const WAV_MAXSAMPLERATE_SUFFIX = `${Math.round(MAX_SAMPLERATE / 1000)}k`
const WAV_MAXBITDEPTH_SUFFIX = `${MAX_BITDEPTH}bits`

// path to tests ressources
const testdir = join(__pkgRoot, config.folders.test, 'audio/audioEncoder')
const testtmp = join(__pkgRoot, config.folders.temp, '.test', 'audio/audioEncoder')

describe.concurrent('audioEncoder', () => {
  it('BULK_ENCODE_WAV2FLAC(file): should launch FFmpeg to encode WAV file to FLAC format', async () => {
    const inFilename = 'audioEncoder_1s.wav'
    const outFilename = 'audioEncoder_1s.flac'
    const tmpdir = join(testtmp, uuid())
    fsExtra.ensureDirSync(tmpdir)
    fsExtra.copySync(join(testdir, inFilename), join(tmpdir, inFilename))
    await audioEncoder.BULK_ENCODE_WAV2FLAC([join(tmpdir, inFilename)])
    expect(fsExtra.existsSync(join(tmpdir, outFilename))).toBe(true)
    fsExtra.removeSync(tmpdir)
  })

  it('BULK_ENCODE_WAV2OGG(file): should launch FFmpeg to encode WAV file to OGG Vorbis format', async () => {
    const inFilename = 'audioEncoder_1s_ogg.wav'
    const outFilename = 'audioEncoder_1s_ogg.ogg'
    const tmpdir = join(testtmp, uuid())
    fsExtra.ensureDirSync(tmpdir)
    fsExtra.copySync(join(testdir, inFilename), join(tmpdir, inFilename))
    await audioEncoder.BULK_ENCODE_WAV2OGG([join(tmpdir, inFilename)])
    const actual = fsExtra.pathExistsSync(join(tmpdir, outFilename))
    expect(actual).toEqual(true)
    fsExtra.removeSync(tmpdir)
  })

  it('BULK_ENCODE_WAV_MAX_SAMPLERATE(file): should launch FFmpeg to encode WAV file to 48kHz format', async () => {
    const inFilename = 'audioEncoder_1s.wav'
    const outFilename = 'audioEncoder_1s.' + WAV_MAXSAMPLERATE_SUFFIX + '.wav'
    const tmpdir = join(testtmp, uuid())
    fsExtra.ensureDirSync(tmpdir)
    fsExtra.copySync(join(testdir, inFilename), join(tmpdir, inFilename))
    await audioEncoder.BULK_ENCODE_WAV_MAX_SAMPLERATE([join(tmpdir, inFilename)])
    expect(fsExtra.existsSync(join(tmpdir, outFilename))).toBe(true)
    fsExtra.removeSync(tmpdir)
  })

  it('BULK_ENCODE_WAV_MAX_BITDEPTH(file): should launch FFmpeg to encode WAV file to 24bits format', async () => {
    const inFilename = 'audioEncoder_1s.wav'
    const outFilename = 'audioEncoder_1s.' + WAV_MAXBITDEPTH_SUFFIX + '.wav'
    const tmpdir = join(testtmp, uuid())
    fsExtra.ensureDirSync(tmpdir)
    fsExtra.copySync(join(testdir, inFilename), join(tmpdir, inFilename))
    await audioEncoder.BULK_ENCODE_WAV_MAX_BITDEPTH([join(tmpdir, inFilename)])
    expect(fsExtra.existsSync(join(tmpdir, outFilename))).toBe(true)
    fsExtra.removeSync(tmpdir)
  })
})
