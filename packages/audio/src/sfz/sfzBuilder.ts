/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import fs from 'node:fs'
import path from 'node:path'
import { config } from '../config/configProvider.js'
import { filer } from '../filer/filer.js'
import { v4 as uuid } from 'uuid'
import fsExtra from 'fs-extra'
import _ from 'lodash'
import { wavUtils } from '../audio/wavUtils.js'
import { errorMessages } from './errorMessages.js'
import { midiKeyMap } from './midiKeyMap.js'
import { sfzGroup } from './sfzGroup.js'
import { sfzPatch } from './sfzPatch.js'
import { sfzRegion } from './sfzRegion.js'
import { sfzUtils } from './sfzUtils.js'
import type { sfzPatchOptions } from './sfzPatch.js'

const HEADROOM = Math.abs(config.encoder.headroom)

export interface sfzOptions {
  process?: sfzProcessOptions
  patch?: sfzPatchOptions
}

export interface sfzProcessOptions {
  [key: string]: number | string | boolean | Map<string, number> | VelocityTransformer | undefined
  update_sfzfile: boolean
  recursive: boolean
  remove_empty_wavfile: boolean
  autorename_wavfile: boolean
  patchname_from: string
  wav_regexp?: string
  midikeymap: Map<string, number>
  velocitytransformer?: VelocityTransformer
  lowercase_extension: boolean
  jsoninfo: boolean
  convert_samplerate: boolean
  convert_bitdepth: boolean
  volume_reference: string
  volume: number
  trim: boolean
  fadeout: boolean
}
export type VelocityTransformer = (value: number) => number
export type PatchProcessingFunction = (patchFileName: string, options: sfzOptions) => Promise<void>

export class sfzBuilder {
  // process all patches in inputPath folder
  static async processAllPatches(inputPath: string, options: sfzOptions = {}) {
    _.defaults(options, { process: {} as sfzProcessOptions, patch: {} as sfzPatchOptions })
    _.defaults(options.process as sfzProcessOptions, {
      update_sfzfile: true, // update initial sfz files
      recursive: false, // true for processing subfolders
      remove_empty_wavfile: false, // delete empty wave files
      autorename_wavfile: false, // auto rename wav file from folder name
      patchname_from: 'sfz', // select sfz as source for gathering patches
      wav_regexp: undefined, // insert wav_regexp in options
      midikeymap: midiKeyMap, // insert midiKeyMap in options
      velocitytransformer: undefined,
      lowercase_extension: true,
      jsoninfo: true,
      convert_samplerate: true,
      convert_bitdepth: true,
      volume_reference: 'patch', // 'patch' (default) | 'sample', select volume reference mode based on overall patch level or independante reference for each sample
      volume: 24, // increase volume level in dB
      trim: true,
      fadeout: true,
    })

    const job_start = Date.now()
    console.info(`Processing folder: ${inputPath} | STARTED`)

    // auto rename wav file from folder name
    ;(options.process?.autorename_wavfile as boolean)
      ? await sfzBuilder.autoRenameFolder(inputPath, options)
      : null

    let patchFileNames: string[] | undefined = undefined
    let patchProcessingFunction: PatchProcessingFunction | undefined = undefined
    switch (options.process?.patchname_from as string) {
      case 'sfz':
        patchFileNames = await sfzBuilder.getPatchNamesFromSfzFiles(inputPath, options) // detect patches names in inputPath
        patchProcessingFunction = sfzBuilder.processPatchFromSfz
        break
      case 'wav':
        patchFileNames = await sfzBuilder.getPatchNamesFromWavFiles(inputPath, options) // detect patches names in inputPath
        patchProcessingFunction = sfzBuilder.processPatchFromWav
        break
      case 'folder':
        patchFileNames = await sfzBuilder.getPatchNamesFromFolderNames(inputPath) // detect patches names in inputPath
        patchProcessingFunction = sfzBuilder.processPatchFromFolderName
        break
    }

    if (typeof patchFileNames !== 'undefined' && typeof patchProcessingFunction !== 'undefined') {
      // process patches sequentially
      if (config.sfz.processing === undefined || config.sfz.processing === 'sequential') {
        for (const patchFileName of patchFileNames) {
          await patchProcessingFunction(patchFileName, options)
        }
      }

      // process patches in parallel
      if (config.sfz.processing === 'parallel') {
        // array of promises (pending tasks) to resolve with Promise.all()
        const tasks = patchFileNames.map(async (patchFileName) => {
          if (typeof patchProcessingFunction !== 'undefined') {
            await patchProcessingFunction(patchFileName, options)
          }
        })
        await Promise.all(tasks)
      }
    }

    const job_duration = _.round((Date.now() - job_start) / 1000, 2)
    console.info(`Processing folder: ${inputPath} | ENDED, completed in ${job_duration} sec`)
  }

  // extract patchnames from SFZ files and returns an array of patches to process
  static async getPatchNamesFromSfzFiles(inputPath: string, options: sfzOptions = {}) {
    let patchFiles: string[] = []
    if (typeof options.process?.recursive === 'boolean') {
      options.process?.recursive
        ? (patchFiles = await filer.getFilesInSubFolders(inputPath, 'sfz'))
        : (patchFiles = await filer.getFilesInFolder(inputPath, 'sfz'))
    }

    console.info(`${patchFiles.length} SFZ file(s) detected`)
    return patchFiles.sort((a, b) => a.localeCompare(b))
  }

  // extract patchnames from WAV files and returns an array of patches to process
  static async getPatchNamesFromWavFiles(inputPath: string, options: sfzOptions = {}) {
    let files: string[] = []
    if (typeof options.process?.recursive === 'boolean') {
      options.process.recursive
        ? (files = await filer.getFilesInSubFolders(inputPath, 'wav'))
        : (files = await filer.getFilesInFolder(inputPath, 'wav'))
    }
    const patchFiles: string[] = []
    for (const file of files) {
      const filename = path.parse(file).base
      try {
        const [[, patchName]] = [
          ...filename.matchAll(new RegExp(options.process?.wav_regexp as string, 'g')),
        ]
        const patchFile = path.join(path.parse(file).dir, patchName)
        if (patchFiles.find((elt) => elt === patchFile) === undefined) patchFiles.push(patchFile)
      } catch (err) {
        throw new Error(errorMessages.WrongWavFilename)
      }
    }
    return patchFiles.sort((a, b) => a.localeCompare(b))
  }

  // process a patch from sfz files input
  static async processPatchFromSfz(patchFileName: string, options: sfzOptions = {}) {
    console.info(`Processing patch: ${patchFileName}`)

    const patchName = path.parse(patchFileName).name
    const inputPath = path.parse(patchFileName).dir

    // check that all samples path provided by the sfz file are complete
    const checkSamples = await sfzUtils.checkAllSamplePath(patchFileName)

    if (checkSamples.length < 1) {
      throw new Error(`${errorMessages.NoSampleInPatch}: ${patchFileName}`)
    }

    if (!checkSamples.every((elt) => elt.result === true)) {
      const fails = checkSamples.filter((elt) => elt.result === false)
      let msg = ''
      fails.forEach((elt) => (msg += `> MISSING: ${elt.file}\n`))
      msg = `${errorMessages.MissingSampleInPatch}: ${patchFileName}\n${msg}${errorMessages.ProcessAborted}`
      throw new Error(msg)
    }

    // process patch wav samples
    let samples = checkSamples.map((elt) => elt.file)
    samples = await sfzBuilder.getProcessPatchSamples(samples, options)
    // samples = samples.map((wav) => filer.sanitizeName(path.parse(wav).base))

    // create patch from provided options
    const patch = new sfzPatch(options.patch)
    patch.name = patchName

    // process sfz files
    if (options.process?.update_sfzfile) {
      // parse SFZ input file generated by sampleRobot
      const sfz = await sfzUtils.getSfzParsedJson(patchFileName)
      const default_path = await sfzUtils.getDefaultSamplePath(patchFileName)

      // read and import existing SFZ data
      for (const elt of sfz) {
        switch (elt.section) {
          case 'control':
          case 'global':
            for (const [key, value] of Object.entries(elt.property)) {
              patch.set(key, value as string)
            }
            break
          case 'group':
            {
              const group = new sfzGroup(`Layer_${patch.groups.length + 1}`)
              for (const [key, value] of Object.entries(elt.property)) {
                group.set(key, value as string)
              }
              patch.groups.push(group)
            }
            break
          case 'region':
            {
              const wav = filer.sanitizeName(elt.property.sample as string)
              const region = new sfzRegion(wav)

              // get loop points from wav.json file if available
              const info = await wavUtils.getJsonInfo(path.join(inputPath, default_path, wav))
              sfzUtils.setSfzLoopPoints(patch, region, info)

              // get region data from initial sfz file
              for (const [key, value] of Object.entries(elt.property)) {
                key !== 'sample' ? region.set(key, <string | number>value) : null
              }
              patch.groups[patch.groups.length - 1].regions.push(region)
            }
            break
        }
      }

      // move samples to default_path folder
      await sfzBuilder.movePatchSamplesToDefaultPath(samples, inputPath, patch)

      // remove old sfz file
      await filer.delete(patchFileName)

      // save SFZ patch
      await sfzUtils.saveSfzFile(inputPath, patch)
    }
  }

  // process a patch from wav files input
  static async processPatchFromWav(patchFileName: string, options: sfzOptions = {}) {
    console.info(`Processing patch: ${patchFileName}`)

    const patchName = path.parse(patchFileName).name
    const inputPath = path.parse(patchFileName).dir
    const midiKeyMap = options.process?.midikeymap as Map<string, number>
    const patch = new sfzPatch(options.patch)
    patch.name = patchName

    // process patch wav samples
    let samples = await sfzBuilder.getPatchSamples(patchFileName, options)
    samples = await sfzBuilder.getProcessPatchSamples(samples, options)

    // detect keys create key map
    const keyIntervals = sfzBuilder.getKeyIntervalsFromFiles(samples, options)
    // check that key intervals are constant :
    if (
      (options.patch?.type as string) !== 'drumkit' &&
      !keyIntervals?.every((elt) => elt === keyIntervals[0])
    ) {
      console.info(errorMessages.KeyIntervalNotConstant)
    }

    // detect layers and create groups
    const velocityMap = sfzBuilder.getVelocityMapFromFiles(samples, options)
    patch.groups = sfzBuilder.getGroupsFromVelocityMap(velocityMap)

    // process each files
    for (const wav of samples) {
      const filename = path.parse(wav).base
      const [[, , rootkey, velocity]] = [
        ...filename.matchAll(new RegExp(options.process?.wav_regexp as string, 'g')),
      ]
      let layer = parseInt(velocity, 10)
      const region = new sfzRegion(filename)
      region.set('pitch_keycenter', midiKeyMap.get(rootkey) as number)
      // set lokey and hikey
      switch (keyIntervals[0]) {
        case 1:
          region.set('lokey', region.get('pitch_keycenter') as number)
          region.set('hikey', region.get('pitch_keycenter') as number)
          break
        case 3:
          region.set('lokey', (region.get('pitch_keycenter') as number) - 1)
          region.set('hikey', (region.get('pitch_keycenter') as number) + 1)
          break
        case 6:
          region.set('lokey', (region.get('pitch_keycenter') as number) - 2)
          region.set('hikey', (region.get('pitch_keycenter') as number) + 3)
          break
        case 12:
          region.set('lokey', (region.get('pitch_keycenter') as number) - 5)
          region.set('hikey', (region.get('pitch_keycenter') as number) + 6)
          break
        default:
          region.set('lokey', region.get('pitch_keycenter') as number)
          region.set('hikey', region.get('pitch_keycenter') as number)
      }

      // get loop points from wav.json file if available
      const info = await wavUtils.getJsonInfo(wav)
      sfzUtils.setSfzLoopPoints(patch, region, info)

      // add region to group
      const velocityTransformer = options.process?.velocitytransformer
      if (typeof velocityTransformer === 'function') {
        layer = velocityTransformer(layer)
      }
      const group = patch.groups.find((elt) => elt.get('hivel') === layer)
      group?.regions.push(region)
    }

    // move samples to default_path folder
    await sfzBuilder.movePatchSamplesToDefaultPath(samples, inputPath, patch)

    // save patch
    await sfzUtils.saveSfzFile(inputPath, patch)
  }

  //  extract patchnames from foldernames files and returns an array of patches to process
  static async getPatchNamesFromFolderNames(inputPath: string) {
    const files = await filer.getFilesInSubFolders(inputPath, 'wav')
    const patchFiles = []
    for (const file of files) {
      const patchFile = path.parse(file).dir
      if (patchFiles.find((elt) => elt === patchFile) === undefined) patchFiles.push(patchFile)
    }
    return patchFiles.sort((a, b) => a.localeCompare(b))
  }

  // process a patch from foldername input
  static async processPatchFromFolderName(patchFileName: string, options: sfzOptions = {}) {
    console.info(`Processing patch: ${patchFileName}`)

    const patchName = path.parse(patchFileName).name
    const inputPath = path.parse(patchFileName).dir
    const midiKeyMap = options.process?.midikeymap as Map<string, number>

    // process patch wav samples
    let samples = await filer.getFilesInFolder(patchFileName, 'wav')
    samples = await sfzBuilder.getProcessPatchSamples(samples, options)

    // process each files
    let startkeyInit: number, startkey: number
    options.patch?.startkey
      ? (startkeyInit = <number>midiKeyMap.get(options.patch?.startkey as string))
      : (startkeyInit = 0)

    const slicedSamples = _.chunk(samples, 128 - startkeyInit)
    let i = 0

    for (const slice of slicedSamples) {
      const patch = new sfzPatch(options.patch)
      patch.groups.push(new sfzGroup('OneShots'))
      startkey = startkeyInit
      slicedSamples.length <= 1
        ? (patch.name = patchName)
        : (patch.name = `${patchName}_${sfzBuilder.format4Digits(++i)}`)
      for (const wav of slice) {
        const region = new sfzRegion(path.parse(wav).base)
        region.set('pitch_keycenter', startkey++)
        region.set('lokey', region.get('pitch_keycenter') as number)
        region.set('hikey', region.get('pitch_keycenter') as number)

        // get loop points from wav.json file if available
        const info = await wavUtils.getJsonInfo(wav)
        sfzUtils.setSfzLoopPoints(patch, region, info)

        patch.groups[0].regions.push(region)
      }

      // move samples to default_path folder
      await sfzBuilder.movePatchSamplesToDefaultPath(slice, patchFileName, patch)

      // save patch
      await sfzUtils.saveSfzFile(patchFileName, patch)
    }

    // rename folder
    const source = path.join(inputPath, patchName)
    const dest = path.join(inputPath, filer.sanitizeName(patchName))
    source !== dest ? await filer.move(source, dest) : null
  }

  // move samples to default_path folder
  static async movePatchSamplesToDefaultPath(
    samples: string[],
    patchFileName: string,
    patch: sfzPatch,
  ) {
    const sampleFolderPath = path.join(patchFileName, patch.get('default_path') as string)
    const patchPath = path.normalize(path.join(patchFileName, './'))
    const samplePath = path.normalize(path.join(sampleFolderPath, './'))
    if (patchPath !== samplePath) {
      for (const sample of samples) {
        const source = sample
        const dest = path.join(samplePath, path.parse(sample).base)
        if (source !== dest) {
          await filer.move(source, dest)
          await filer.move(source + '.json', dest + '.json')
        }
      }
    }
  }

  // patch samples processing function
  static async getProcessPatchSamples(
    inputFiles: string[],
    options: sfzOptions = {
      process: {} as sfzProcessOptions,
      patch: {} as sfzPatchOptions,
    },
  ) {
    // create temp folder
    const inputFolder = path.parse(inputFiles[0]).dir
    const tmpFolder = path.resolve(path.join(config.folders.temp, uuid()))

    let tasks = [] // array of promises (pending tasks) to resolve with Promise.all()

    // import wav and json files to local temp folder
    tasks = inputFiles.map(async (wav) => {
      // rename extension to lowercase
      options.process?.lowercase_extension ? await filer.lowerCaseFileExt(wav, 'wav') : null
      const lowerwav = path.parse(wav).name + path.parse(wav).ext.toLocaleLowerCase()

      wav = path.join(path.parse(wav).dir, lowerwav)
      const tmpwav = path.join(tmpFolder, path.parse(wav).base)
      await filer.copy(wav, tmpwav)

      try {
        await filer.copy(wav + '.json', tmpwav + '.json')
      } catch {}
    })
    await Promise.all(tasks)

    // rename samples filenames if needed
    tasks = inputFiles.map(async (wav) => {
      const filename = path.parse(wav).name
      const ext = path.parse(wav).ext.toLocaleLowerCase()
      const newfilename = filer.sanitizeName(filename)
      if (newfilename !== filename) {
        await filer.move(
          path.join(tmpFolder, filename + ext),
          path.join(tmpFolder, newfilename + ext),
        )
      }
    })
    await Promise.all(tasks)

    let files = await filer.getFilesInFolder(tmpFolder, 'wav')

    // extract sample properties and write json files
    console.info(`Analyzing samples files | extracting metadata (building JSON files) ...`)
    tasks = files.map(async (file) => {
      options.process?.jsoninfo ? await wavUtils.writeJsonInfo(file) : null
    })
    await Promise.all(tasks)

    // remove empty wav files
    files = await sfzBuilder.removeEmptyFiles(files, options)

    // convert to 48kHz samplerate if above
    tasks = files.map(async (file) => {
      options.process?.convert_samplerate
        ? await wavUtils.processConvertToMaxSampleRate(file, await wavUtils.getJsonInfo(file))
        : null
    })
    await Promise.all(tasks)

    // convert to 24bits depth if above
    tasks = files.map(async (file) => {
      options.process?.convert_bitdepth
        ? await wavUtils.processConvertToMaxBitDepth(file, await wavUtils.getJsonInfo(file))
        : null
    })
    await Promise.all(tasks)

    // compute some post processing options

    // post processing

    // trim
    tasks = files.map(async (file) => {
      options.process?.trim ? await wavUtils.processRemoveSilence(file) : null
    })
    await Promise.all(tasks)

    // remove empty wav files
    files = await sfzBuilder.removeEmptyFiles(files, options)

    // volume, select volume reference
    let volume = options.process?.volume
    if (volume) {
      switch (options.process?.volume_reference) {
        case 'patch':
          {
            const max_files_volume = await sfzBuilder.getMaxVolume(files)
            const peak = max_files_volume + volume
            peak > -HEADROOM ? (volume = Math.abs(max_files_volume) - Math.abs(HEADROOM)) : null
            tasks = files.map(async (file) => {
              await wavUtils.processVolume(file, volume as number)
            })
            await Promise.all(tasks)
          }
          break
        case 'sample':
          {
            tasks = files.map(async (file) => {
              const info = await wavUtils.getJsonInfo(file)
              const max_file_volume = info.streams[0].max_volume
              const peak = max_file_volume + volume
              peak > -HEADROOM ? (volume = Math.abs(max_file_volume) - Math.abs(HEADROOM)) : null
              await wavUtils.processVolume(file, volume as number)
            })
            await Promise.all(tasks)
          }
          break
      }
    }

    // fadeout
    tasks = files.map(async (file) => {
      options.process?.fadeout ? await wavUtils.processFadeOut(file) : null
    })
    await Promise.all(tasks)

    // remove older wav files
    tasks = inputFiles.map(async (wav) => {
      await filer.delete(wav)
    })
    await Promise.all(tasks)

    // export processed wav file and json
    tasks = files.map(async (file) => {
      const out = path.join(inputFolder, path.parse(file).base)
      await filer.move(file, out)
      await filer.move(file + '.json', out + '.json')
    })
    await Promise.all(tasks)

    // delete temp folder
    await filer.delete(tmpFolder)

    return files.map((file) => path.join(inputFolder, path.parse(file).base))
  }

  // get an array list of all patch samples
  static async getPatchSamples(patchFileName: string, options: sfzOptions) {
    const patchName = path.parse(patchFileName).name
    const dir = path.parse(patchFileName).dir
    const directoryContent = await fs.promises.readdir(dir, { withFileTypes: true })
    const fileNames = directoryContent.filter((elt) => elt.isFile()).map((elt) => elt.name)
    const files = fileNames.filter((elt) => {
      if (typeof options.process?.wav_regexp === 'string') {
        const regex = new RegExp(options.process.wav_regexp.replace('(.*)', patchName), 'g')
        const r = filer.isExt(elt, 'wav') && regex.test(elt)
        return r
      }
    })
    return files.map((elt) => path.join(dir, elt))
  }

  // get patch max sample volume
  static async getMaxVolume(files: string[]) {
    let max_volume = undefined
    for (const file of files) {
      const info = await wavUtils.getJsonInfo(file)
      const volume = info.streams[0].max_volume
      max_volume === undefined || volume > max_volume ? (max_volume = volume) : null
    }
    return max_volume
  }

  static getKeyIntervalsFromFiles(files: string[], options: sfzOptions) {
    const wavRegExp = new RegExp(options.process?.wav_regexp as string, 'g')
    const midiKeyMap = options.process?.midikeymap as Map<string, number>
    const keyMap: number[] = []
    for (const file of files) {
      const filename = path.parse(file).base
      const [[, , rootkey]] = [...filename.matchAll(_.clone(wavRegExp))]
      const key = midiKeyMap.get(rootkey)
      if (typeof key !== 'undefined') {
        if (keyMap.indexOf(key) === -1) keyMap.push(key)
      }
    }
    keyMap.sort((a, b) => a - b)

    const keyIntervals = []
    for (const index of keyMap.keys()) {
      if (index > 0) {
        keyIntervals.push(keyMap[index] - keyMap[index - 1])
      }
    }
    return keyIntervals
  }

  static getVelocityMapFromFiles(files: string[], options: sfzOptions) {
    const wavRegExp = new RegExp(options.process?.wav_regexp as string, 'g')
    const velocityTransformer = options.process?.velocitytransformer
    const velocityMap = []
    for (const file of files) {
      const filename = path.parse(file).base
      const [[, , , velocity]] = [...filename.matchAll(_.clone(wavRegExp))]
      let layer = parseInt(velocity, 10)
      if (typeof velocityTransformer === 'function') {
        layer = velocityTransformer(layer)
      }
      if (velocityMap.indexOf(layer) === -1) velocityMap.push(layer)
    }
    return velocityMap.sort((a, b) => a - b)
  }

  static getGroupsFromVelocityMap(velocityMap: number[]) {
    const groups = []
    for (const [index, value] of velocityMap.entries()) {
      const group = new sfzGroup(`Layer_${value}`)
      group.set('lovel', index > 0 ? velocityMap[index - 1] - 1 : 0)
      group.set('hivel', value)
      groups.push(group)
    }
    return groups
  }

  static async removeEmptyFiles(files: string[], options: sfzOptions) {
    if (options.process?.remove_empty_wavfile as boolean) {
      // detect files to remove
      const filesToDelete: string[] = []
      let tasks = files.map(async (file) => {
        const info = await wavUtils.getJsonInfo(file)
        info.streams[0].nb_samples === 0 ? filesToDelete.push(file) : null
      })
      await Promise.all(tasks)

      // remove files
      tasks = filesToDelete.map(async (file) => {
        files = _.pull(files, file) // update files
        await filer.delete(file)
        await filer.delete(file + '.json')
        console.info(`File: ${file} | ${errorMessages.EmptyWavFileDeleted}`)
      })
      await Promise.all(tasks)
    }
    return files
  }

  static async autoRenameFolder(inputPath: string, options: sfzOptions) {
    if (options.process?.autorename_wavfile as boolean) {
      // auto rename folders
      const directoryContent = await fsExtra.promises.readdir(inputPath, {
        withFileTypes: true,
      })
      const directoryNames = directoryContent
        .filter((elt) => elt.isDirectory())
        .map((elt) => elt.name)
      for (const value of directoryNames.values()) {
        const source = path.join(inputPath, value)
        const dest = path.join(inputPath, filer.sanitizeName(value))
        source !== dest ? await filer.move(source, dest) : null
        await sfzBuilder.autoRenameWavFiles(dest, options)
        await sfzBuilder.autoRenameFolder(dest, options)
      }
    }
  }

  static async autoRenameWavFiles(inputPath: string, options: sfzOptions) {
    if (options.process?.autorename_wavfile as boolean) {
      // auto rename files
      const directoryContent = await fsExtra.promises.readdir(inputPath, {
        withFileTypes: true,
      })
      const fileNames = directoryContent.filter((elt) => elt.isFile()).map((elt) => elt.name)
      let i = 0
      for (const value of fileNames.values()) {
        const source = path.join(inputPath, value)
        const filename = `${path.basename(inputPath)}_${sfzBuilder.format4Digits(++i)}`
        const dest = path.join(inputPath, filer.sanitizeName(filename) + '.wav')
        source !== dest ? await filer.move(source, dest) : null
      }
    }
  }

  static format4Digits(value: number) {
    let r = value.toString()
    value < 1000 ? (r = `0${value}`) : null
    value < 100 ? (r = `00${value}`) : null
    value < 10 ? (r = `000${value}`) : null
    return `${r}`
  }
}
