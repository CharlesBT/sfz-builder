/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import fs from 'node:fs'
import path from 'node:path'
import { filer } from '../filer/filer.js'
import { errorMessages } from './errorMessages.js'
import { parseSfzSection } from './sfzParser.js'
import { sfzPatch } from './sfzPatch.js'
import { sfzRegion } from './sfzRegion.js'
import type { IWavInfo } from '../types/audio.js'

export class sfzUtils {
  // returns JSON formated document from sfz file
  static async getSfzParsedJson(file: string) {
    try {
      const sfz = await fs.promises.readFile(file, 'utf8')
      return parseSfzSection(sfz)
    } catch (err) {
      throw new Error(`${errorMessages.InvalidSfzFile}: ${file}`)
    }
  }

  // save sfz file
  static async saveSfzFile(folderPath: string, patch: sfzPatch) {
    // check if patch has at least 1 group and 1 region
    try {
      patch.groups[0].regions[0]
    } catch {
      console.info(`WARNING : no sample in patch`)
      return
    }

    const data = patch.build()
    const dir = path.resolve(folderPath)
    const filename = filer.sanitizeName(<string>patch.name)
    const file = path.join(dir, `${filename}.sfz`)
    await fs.promises.writeFile(file, data, {
      encoding: 'utf8',
    })
    console.info(`Patch saved: ${file}`)
  }

  // delete all sfz files within a folder and its subfolders
  static async deleteAllSfzFiles(folderPath: string) {
    const dir = path.resolve(folderPath)
    const directoryContent = await fs.promises.readdir(dir, { withFileTypes: true })
    const fileNames = directoryContent.filter((elt) => elt.isFile()).map((elt) => elt.name)
    const directoryNames = directoryContent
      .filter((elt) => elt.isDirectory())
      .map((elt) => elt.name)
    for (const value of fileNames.values()) {
      const ext = path.parse(value).ext.toLowerCase()
      if (ext === '.sfz') {
        const file = path.join(dir, value)
        await filer.delete(file)
        console.info(`Deleted: ${file}`)
      }
    }
    for (const value of directoryNames.values()) {
      const folder = path.join(dir, value)
      await sfzUtils.deleteAllSfzFiles(folder)
    }
  }

  // move all sfz files to upper folder, applies to folderPath and its subfolders
  static async moveSfzPatchToParentFolder(folderPath: string) {
    const dir = path.resolve(folderPath)
    const directoryContent = await fs.promises.readdir(dir, { withFileTypes: true })
    const fileNames = directoryContent.filter((elt) => elt.isFile()).map((elt) => elt.name)
    const directoryNames = directoryContent
      .filter((elt) => elt.isDirectory())
      .map((elt) => elt.name)
    for (const value of fileNames.values()) {
      const ext = path.parse(value).ext.toLowerCase()
      const parentPath = path.normalize(path.join(dir, '..'))
      if (ext === '.sfz') {
        const sfzSource = path.join(dir, value)
        const sfzDest = path.join(parentPath, value)
        await filer.move(sfzSource, sfzDest, { overwrite: false })
      }
      if (ext === '.wav') {
        const wavSource = path.join(dir, value)
        const wavDest = path.normalize(path.join(parentPath, '../samples', value))
        await filer.move(wavSource, wavDest, { overwrite: false })
      }
    }
    for (const value of directoryNames.values()) {
      const folder = path.join(dir, value)
      await sfzUtils.moveSfzPatchToParentFolder(folder)
    }
  }

  // rename sfz file with the parent foldername, applies to folderPath and its subfolders
  static async renameSFzFileWithParentFolderName(folderPath: string) {
    console.info(folderPath)
    const dir = path.resolve(folderPath)
    const directoryContent = await fs.promises.readdir(dir, { withFileTypes: true })
    const fileNames = directoryContent.filter((elt) => elt.isFile()).map((elt) => elt.name)
    const directoryNames = directoryContent
      .filter((elt) => elt.isDirectory())
      .map((elt) => elt.name)
    for (const value of fileNames.values()) {
      const ext = path.parse(value).ext.toLowerCase()
      if (ext === '.sfz') {
        const source = path.join(dir, value)
        const dest = path.join(dir, `${path.basename(dir)}.sfz`)
        if (source !== dest) {
          await filer.move(source, dest)
        }
      }
    }
    for (const value of directoryNames.values()) {
      const folder = path.join(dir, value)
      await sfzUtils.renameSFzFileWithParentFolderName(folder)
    }
  }

  // transpose root key in the wav file name of 2 octaves up, applies to folderPath and its subfolders
  static async transposeWavFilesOf2OctavesUp(folderPath: string) {
    const dir = path.resolve(folderPath)
    const directoryContent = await fs.promises.readdir(dir, { withFileTypes: true })
    const fileNames = directoryContent.filter((elt) => elt.isFile()).map((elt) => elt.name)
    const directoryNames = directoryContent
      .filter((elt) => elt.isDirectory())
      .map((elt) => elt.name)
    for (const value of fileNames.values()) {
      const ext = path.parse(value).ext.toLowerCase()
      if (ext === '.wav') {
        const name = path.parse(value).name
        const fileInfo = name.split('_')
        let note = ''
        let octave = ''
        if (fileInfo[1].indexOf('#') > 0) {
          note = fileInfo[1].substring(0, 2)
          octave = fileInfo[1].substring(3, fileInfo[1].length - 1)
          // console.info([note, octave])
        } else {
          note = fileInfo[1].substring(0, 1)
          octave = fileInfo[1].substring(2, fileInfo[1].length - 1)
          // console.info([note, octave])
        }
        let transposedOctave = 0
        if (octave === '') {
          transposedOctave = 1
        } else {
          transposedOctave = parseInt(octave, 10) + 2
        }
        const new_name = fileInfo[0] + '_' + note + transposedOctave + '_' + fileInfo[2]
        const source = path.join(dir, value)
        const dest = path.join(dir, 'export', `${new_name}.wav`)
        if (source !== dest) {
          await filer.move(source, dest)
        }
      }
    }
    for (const value of directoryNames.values()) {
      const folder = path.join(dir, value)
      await sfzUtils.transposeWavFilesOf2OctavesUp(folder)
    }
  }

  // check path for each samples contained in sfz patch and returns an array of [{file, result}]
  static async checkAllSamplePath(sfzFile: string) {
    // get default_path if available
    const default_path = await sfzUtils.getDefaultSamplePath(sfzFile)
    // parse SFZ file generated by sampleRobot
    const sfz = await sfzUtils.getSfzParsedJson(sfzFile)
    const dir = path.parse(sfzFile).dir
    const results = []
    for (const elt of sfz) {
      switch (elt.section) {
        case 'region':
          {
            for (const [key, value] of Object.entries(elt.props)) {
              if (key.toLowerCase() === 'sample') {
                const file = path.join(dir, default_path, <string>value)
                try {
                  await fs.promises.access(file)
                  results.push({ file: file, result: true })
                } catch {
                  results.push({ file: file, result: false })
                }
              }
            }
          }
          break
      }
    }
    return results
  }

  // returns 'default_path' value from and sfz file
  static async getDefaultSamplePath(sfzFile: string): Promise<string> {
    // parse SFZ file generated by sampleRobot
    const sfz = await sfzUtils.getSfzParsedJson(sfzFile)
    // search for some default_path= under <control> section
    for (const elt of sfz) {
      switch (elt.section) {
        case 'control':
          for (const [key, value] of Object.entries(elt.props)) {
            if (key.toLowerCase() === 'default_path') {
              return <string>value
            }
          }
          break
        default:
          return ''
      }
    }
    return ''
  }

  // set loop points from wav.json file if available
  static setSfzLoopPoints(patch: sfzPatch, region: sfzRegion, info: IWavInfo) {
    if (info.loop) {
      const loop = info.loop
      if (loop.start_sample && loop.end_sample) {
        patch.set('loop_mode', 'loop_sustain')
        region.set('loop_start', loop.start_sample)
        region.set('loop_end', loop.end_sample)
      }
    }
  }

  // TODO
  // zip sfz patch dependents samples
  // static async zipPatch(sfzFile) {}
}
