/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import 'dotenv/config'

import path from 'node:path'

import AdmZip from 'adm-zip'
import filenamify from 'filenamify'
import fsExtra from 'fs-extra'

// import { Debug } from '../logger/logger.js'

// const debug = Debug(import.meta.url)
const errorMessage = {
  FileNotFound: 'File not found',
  MissingFileExtensionInArgs: 'file extension missing in args',
}

export class filer {
  static isExt(file, ext) {
    const e = path.parse(file).ext.toLowerCase()
    return e === '.' + ext.toLowerCase() ? true : false
  }

  static writeJsonSync(file, object) {
    fsExtra.writeJsonSync(file, object)
  }

  static async writeJson(file, object) {
    await fsExtra.writeJson(file, object)
  }

  static readJsonSync(file) {
    if (!filer.existsSync(file)) throw new Error(errorMessage.FileNotFound)
    const r = fsExtra.readJsonSync(file)
    return r
  }

  static async readJson(file) {
    if (!filer.existsSync(file)) throw new Error(errorMessage.FileNotFound)
    const r = await fsExtra.readJson(file)
    return r
  }

  static moveSync(path, newpath, options) {
    if (!filer.existsSync(path)) throw new Error(errorMessage.FileNotFound)
    if (options) {
      fsExtra.moveSync(path, newpath, options)
    } else {
      fsExtra.moveSync(path, newpath, { overwrite: true })
    }
  }

  static async move(path, newpath, options) {
    if (!filer.existsSync(path)) throw new Error(errorMessage.FileNotFound)
    if (options) {
      await fsExtra.move(path, newpath, options)
    } else {
      await fsExtra.move(path, newpath, { overwrite: true })
    }
  }

  static copySync(src, dest) {
    if (!filer.existsSync(src)) throw new Error(errorMessage.FileNotFound)
    fsExtra.copySync(src, dest, { overwrite: true })
  }

  static async copy(src, dest) {
    if (!filer.existsSync(src)) throw new Error(errorMessage.FileNotFound)
    await fsExtra.copy(src, dest, { overwrite: true })
  }

  static deleteSync(path) {
    if (!filer.existsSync(path)) throw new Error(errorMessage.FileNotFound)
    fsExtra.removeSync(path)
  }

  static async delete(path) {
    if (!filer.existsSync(path)) throw new Error(errorMessage.FileNotFound)
    await fsExtra.remove(path)
  }

  static existsSync(path) {
    const r = fsExtra.pathExistsSync(path)
    return r
  }

  static async exists(path) {
    const r = await fsExtra.pathExists(path)
    return r
  }

  static createDirSync(path) {
    fsExtra.ensureDirSync(path)
  }

  static async createDir(path) {
    await fsExtra.ensureDir(path)
  }

  // returns array of files with given extension in single folder
  static async getFilesInFolder(folderPath, fileExtension) {
    if (typeof fileExtension !== 'string') {
      throw new Error(errorMessage.MissingFileExtensionInArgs)
    }
    const files = []
    const dir = path.resolve(folderPath)
    const directoryContent = await fsExtra.promises.readdir(dir, { withFileTypes: true })
    const fileNames = directoryContent.filter((elt) => elt.isFile()).map((elt) => elt.name)
    for (const value of fileNames.values()) {
      const file = path.join(dir, value)
      if (filer.isExt(file, fileExtension)) {
        files.push(file)
      }
    }
    return files
  }

  // returns array of files with given extension in subfolders
  static async getFilesInSubFolders(folderPath, fileExtension) {
    if (typeof fileExtension !== 'string') {
      throw new Error(errorMessage.MissingFileExtensionInArgs)
    }
    let files = []
    const dir = path.resolve(folderPath)
    const directoryContent = await fsExtra.promises.readdir(dir, { withFileTypes: true })
    const directoryNames = directoryContent
      .filter((elt) => elt.isDirectory())
      .map((elt) => elt.name)
    const results = await filer.getFilesInFolder(folderPath, fileExtension)
    files = files.concat(results)
    for (const value of directoryNames.values()) {
      const folder = path.join(dir, value)
      const results = await filer.getFilesInSubFolders(folder, fileExtension)
      files = files.concat(results)
    }
    return files
  }

  static async lowerCaseFileExt(file, ext) {
    if (typeof ext !== 'string') {
      throw new Error(errorMessage.MissingFileExtensionInArgs)
    }
    ext = ext.toLowerCase()
    const newFile = path.join(
      path.parse(file).dir,
      path.parse(file).name + path.parse(file).ext.toLowerCase(),
    )
    if (file !== newFile) {
      await filer.move(file, newFile)
    }
  }

  static sanitizeName(filename) {
    const charToRemove = [
      "'",
      '`',
      '"',
      '~',
      ':',
      '\\',
      '/',
      '|',
      '<',
      '>',
      '*',
      '?',
      '@',
      '!',
      '$',
      '&',
      '^',
      '{',
      '}',
      '[',
      ']',
      ',',
      ';',
      '+',
      '=',
      '%',
    ]

    for (const item of charToRemove) {
      filename = filename.replaceAll(item, '')
    }
    filename = filename.replace(/  +/g, ' ') // replace long whitespaces by a single white space
    filename = filename.replace(/ /g, '__') // replace whitespaces by underscore
    filename = filenamify(filename)
    return filename
  }

  static unZipFile(file, dest) {
    return new Promise((resolve, reject) => {
      try {
        // const _debug = debug.extend('unZipFile')
        // _debug(`start unzipping: ${file}`, import.meta.url)
        fsExtra.ensureDirSync(dest)
        const zip = new AdmZip(file)
        zip.extractAllTo(/*target path*/ dest, /*overwrite*/ true)
        // _debug(`unzipped: ${file}`, import.meta.url)
        resolve('FILE_UNZIPPED')
      } catch (err) {
        console.error(err, import.meta.url)
        reject('UNZIP_FILE_FAILURE')
      }
    })
  }
}
