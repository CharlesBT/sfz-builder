import path from 'node:path'
import fsExtra from 'fs-extra'
import { packageDirectorySync } from 'pkg-dir'
import { v4 as uuid } from 'uuid'
import { describe, expect, it } from 'vitest'
import { config } from '../config/configProvider.js'
import { filer } from '../filer/filer.js'
import type { sfzPatchOptions, sfzOptions, sfzProcessOptions } from '../types/sfz.js'
import { sfzBuilder_AudioLayer } from './sfzBuilder_AudioLayer.js'
import { sfzUtils } from './sfzUtils.js'

const __pkgRoot = <string>packageDirectorySync()

// path to tests ressources
const testdir = path.join(__pkgRoot, config.folders.test, 'audio/sfz/sfzBuilder_AudioLayer')
const testtmp = path.join(
  __pkgRoot,
  config.folders.temp,
  '.test',
  'audio/sfz/sfzBuilder_AudioLayer',
)

// disable console.info out
console.info = () => null

// Async functions
describe('sfzBuilder_AudioLayer: should create sfz patch file for nolooped and non looped samples', () => {
  it('process(inputPath, options)', async () => {
    const patchName = 'sin_looped'
    const tmpdir = path.join(testtmp, uuid())
    await filer.copy(path.join(testdir, patchName), path.join(tmpdir, patchName))

    const OPTIONS: sfzOptions = {
      process: <sfzProcessOptions>{
        recursive: false, // true for processing subfolders
        lowercase_extension: true,
        jsoninfo: true,
        convert_samplerate: false,
        convert_bitdepth: false,
        volume: 0,
        trim: false,
        fadeout: false,
      },
      patch: <sfzPatchOptions>{
        type: 'pad', // drumkit | instrument | piano | key | bass | guitar | pad | string | brass
        multi_velocity_layer: true,
        default_path: './samples/',
      },
    }
    const source = path.join(tmpdir, patchName)
    await sfzBuilder_AudioLayer.process(source, OPTIONS)

    const ref = path.join(testdir, patchName, patchName + '.out')
    const out = path.join(source, patchName + '.sfz')

    expect(fsExtra.readFileSync(out)).toEqual(fsExtra.readFileSync(ref))

    // check that all samples path provided by the sfz file are complete
    const checkSamples = await sfzUtils.checkAllSamplePath(out)
    expect(checkSamples.every((elt) => elt.result === true)).toEqual(true)

    await fsExtra.remove(tmpdir)
  })
})
