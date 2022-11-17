/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import path from 'node:path'

import fsExtra from 'fs-extra'
import { describe, expect, it } from 'vitest'

import { readConfigFromPackage } from '../config/configProvider.js'
import { pkgRoot } from '../utils/pkgRoot.js'
import { uuid } from '../uuid/uuid.js'
import { filer } from './filer.js'

const __pkgRoot = pkgRoot(import.meta.url)
const config = readConfigFromPackage(import.meta.url)

// path to tests ressources
const testdir = path.join(__pkgRoot, config.folders.test, 'filer')
const testtmp = path.join(__pkgRoot, config.folders.temp, '.test', 'filer')

// Sync functions
describe.concurrent('file and folder sync functions', () => {
  it('writeJsonSync(file, object)', () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    fsExtra.ensureDirSync(tmpdir)
    const file = path.join(tmpdir, 'test1.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    filer.writeJsonSync(file, obj)
    const actual = fsExtra.pathExistsSync(file)
    expect(actual).toEqual(true)
    fsExtra.removeSync(tmpdir)
  })

  it('readJsonSync(file)', () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    fsExtra.ensureDirSync(tmpdir)
    const file = path.join(tmpdir, 'test1.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    filer.writeJsonSync(file, obj)
    const actual = filer.readJsonSync(file)
    expect(actual).toEqual(obj)
    fsExtra.removeSync(tmpdir)
  })

  it('moveSync(file, newpath, options)', () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    fsExtra.ensureDirSync(tmpdir)
    const file1 = path.join(tmpdir, 'test1.json')
    const file2 = path.join(tmpdir, 'test2.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    fsExtra.writeJsonSync(file1, obj)
    filer.moveSync(file1, file2)
    const actual = fsExtra.pathExistsSync(file2)
    expect(actual).toEqual(true)
    fsExtra.removeSync(tmpdir)
  })

  it('moveSync(folder, newpath, options)', () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    fsExtra.ensureDirSync(tmpdir)
    const tmpdir1 = path.join(tmpdir, 'dir1')
    const tmpdir2 = path.join(tmpdir, 'dir2')
    fsExtra.ensureDirSync(tmpdir1)
    filer.moveSync(tmpdir1, tmpdir2)
    const actual = fsExtra.pathExistsSync(tmpdir2)
    expect(actual).toEqual(true)
    fsExtra.removeSync(tmpdir)
  })

  it('copySync(file, dest)', () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    fsExtra.ensureDirSync(tmpdir)
    const file1 = path.join(tmpdir, 'test1.json')
    const file2 = path.join(tmpdir, 'test2.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    fsExtra.writeJsonSync(file1, obj)
    filer.copySync(file1, file2)
    const actual = fsExtra.pathExistsSync(file2)
    expect(actual).toEqual(true)
    fsExtra.removeSync(tmpdir)
  })

  it('copySync(folder, dest)', () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    fsExtra.ensureDirSync(tmpdir)
    const tmpdir1 = path.join(tmpdir, 'dir1')
    const tmpdir2 = path.join(tmpdir, 'dir2')
    fsExtra.ensureDirSync(tmpdir1)
    filer.copySync(tmpdir1, tmpdir2)
    const actual = fsExtra.pathExistsSync(tmpdir1)
    expect(actual).toEqual(true)
    fsExtra.removeSync(tmpdir)
  })

  it('deleteSync(file)', () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    fsExtra.ensureDirSync(tmpdir)
    const file = path.join(tmpdir, 'test1.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    fsExtra.writeJsonSync(file, obj)
    filer.deleteSync(file)
    const actual = fsExtra.pathExistsSync(file)
    expect(actual).toEqual(false)
    fsExtra.removeSync(tmpdir)
  })

  it('deleteSync(folder)', () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    fsExtra.ensureDirSync(tmpdir)
    const tmpdir1 = path.join(tmpdir, 'dir1')
    fsExtra.ensureDirSync(tmpdir1)
    filer.deleteSync(tmpdir1)
    const actual = fsExtra.pathExistsSync(tmpdir1)
    expect(actual).toEqual(false)
    fsExtra.removeSync(tmpdir)
  })

  it('existsSync(file)', () => {
    const file = path.join(testdir, 'instrument.zip')
    const actual = filer.existsSync(file)
    expect(actual).toEqual(true)
  })

  it('existsSync(folder)', () => {
    const actual = filer.existsSync(testdir)
    expect(actual).toEqual(true)
  })

  it('createDirSync(path)', () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    filer.createDirSync(tmpdir)
    const actual = fsExtra.pathExistsSync(tmpdir)
    expect(actual).toEqual(true)
    fsExtra.removeSync(tmpdir)
  })
})

// Async functions
describe.concurrent('file and folder async functions', () => {
  it('writeJson(file, object)', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const file = path.join(tmpdir, 'test1.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    await filer.writeJson(file, obj)
    await expect(fsExtra.pathExists(file)).resolves.toEqual(true)
    await fsExtra.remove(tmpdir)
  })

  it('readJson(file)', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const file = path.join(tmpdir, 'test1.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    await filer.writeJson(file, obj)
    await expect(filer.readJson(file)).resolves.toEqual(obj)
    await fsExtra.remove(tmpdir)
  })

  it('move(file, newpath, options)', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const file1 = path.join(tmpdir, 'test1.json')
    const file2 = path.join(tmpdir, 'test2.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    await fsExtra.writeJson(file1, obj)
    await filer.move(file1, file2)
    await expect(fsExtra.pathExists(file2)).resolves.toEqual(true)
    await fsExtra.remove(tmpdir)
  })

  it('move(folder, newpath, options)', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const tmpdir1 = path.join(tmpdir, 'dir1')
    const tmpdir2 = path.join(tmpdir, 'dir2')
    await fsExtra.ensureDir(tmpdir1)
    await filer.move(tmpdir1, tmpdir2)
    await expect(fsExtra.pathExists(tmpdir2)).resolves.toEqual(true)
    await fsExtra.remove(tmpdir)
  })

  it('copy(file, dest)', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const file1 = path.join(tmpdir, 'test1.json')
    const file2 = path.join(tmpdir, 'test2.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    await fsExtra.writeJson(file1, obj)
    filer.copySync(file1, file2)
    await expect(fsExtra.pathExists(file2)).resolves.toEqual(true)
    await fsExtra.remove(tmpdir)
  })

  it('copy(folder, dest)', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const tmpdir1 = path.join(tmpdir, 'dir1')
    const tmpdir2 = path.join(tmpdir, 'dir2')
    await fsExtra.ensureDir(tmpdir1)
    await filer.copy(tmpdir1, tmpdir2)
    await expect(fsExtra.pathExists(tmpdir1)).resolves.toEqual(true)
    await fsExtra.remove(tmpdir)
  })

  it('delete(file)', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const file = path.join(tmpdir, 'test1.json')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    await fsExtra.writeJson(file, obj)
    await filer.delete(file)
    await expect(fsExtra.pathExists(file)).resolves.toEqual(false)
    await fsExtra.remove(tmpdir)
  })

  it('delete(folder)', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const tmpdir1 = path.join(tmpdir, 'dir1')
    await fsExtra.ensureDir(tmpdir1)
    await filer.delete(tmpdir1)
    await expect(fsExtra.pathExists(tmpdir1)).resolves.toEqual(false)
    await fsExtra.remove(tmpdir)
  })

  it('exists(file)', async () => {
    const file = path.join(testdir, 'instrument.zip')
    await expect(filer.exists(file)).resolves.toEqual(true)
  })

  it('exists(folder)', async () => {
    await expect(filer.exists(testdir)).resolves.toEqual(true)
  })

  it('createDir(path)', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await filer.createDir(tmpdir)
    await expect(fsExtra.pathExists(tmpdir)).resolves.toEqual(true)
    await fsExtra.remove(tmpdir)
  })
})

// Additional functions
describe.concurrent('Additional functions', () => {
  it('isExt(file, ext): should return true if given file extension matches', () => {
    const zip = path.join(testdir, 'instrument.zip')
    const actual = filer.isExt(zip, 'zip')
    expect(actual).toEqual(true)
  })

  it('getFilesInFolder(folderPath, fileExtension): should return a list of files with fileExtension from within folderPath, no recursivity', async () => {
    const folderPath = path.join(testdir, 'recursive-folders')
    const files = await filer.getFilesInFolder(folderPath, 'txt')
    const filenames = []
    for (const file of files) {
      filenames.push(path.parse(file).base)
    }
    const expected = ['file1.txt', 'file2.txt', 'file3.txt']
    expect(filenames).toEqual(expected)
  })

  it('getFilesInSubFolders(folderPath, fileExtension): should return a list of files with fileExtension from all subfolders contained in folderPath, recursive', async () => {
    const folderPath = path.join(testdir, 'recursive-folders')
    const files = await filer.getFilesInSubFolders(folderPath, 'txt')
    const filenames = []
    for (const file of files) {
      const dir = path.parse(file).dir
      const filename = path.parse(file).base
      const relativePath = path.join(path.relative(folderPath, dir), filename)
      const posixPath = relativePath.split(path.sep).join(path.posix.sep)
      filenames.push(posixPath)
    }
    const expected = [
      'file1.txt',
      'file2.txt',
      'file3.txt',
      'subfolder1/file1.txt',
      'subfolder1/file2.txt',
      'subfolder1/file3.txt',
      'subfolder2/file1.txt',
      'subfolder2/file2.txt',
      'subfolder2/file3.txt',
      'subfolder3/file1.txt',
      'subfolder3/file2.txt',
      'subfolder3/file3.txt',
    ]
    expect(filenames).toEqual(expected)
  })

  it('lowerCaseFileExt(file, ext): should rename file with lowercase extension file', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const file = path.join(tmpdir, 'test1.JSON')
    const obj = { name: 'Dupond', firstname: 'Michel' }
    await fsExtra.writeJson(file, obj)
    await filer.lowerCaseFileExt(file, 'json')
    const files = []
    const dir = path.resolve(tmpdir)
    const directoryContent = await fsExtra.promises.readdir(dir, {
      withFileTypes: true,
    })
    const fileNames = directoryContent.filter((elt) => elt.isFile()).map((elt) => elt.name)
    for (const value of fileNames.values()) {
      const file = value
      files.push(file)
    }
    expect(files).toEqual(['test1.json'])
    await fsExtra.remove(tmpdir)
  })

  it('sanitizeName(filename): should sanitize filename to space__filename.wav', () => {
    const actual = filer.sanitizeName('\'`"~:\\/|<>*?@!$&^{}[],;+=%space filename.wav')
    expect(actual).toEqual('space__filename.wav')
  })

  it('unZipFile(file, dest): should unzip file', async () => {
    const tmpdir = path.join(testtmp, uuid.v4())
    await fsExtra.ensureDir(tmpdir)
    const zip = path.join(testdir, 'instrument.zip')
    const zippedFiles = ['instrument.sfz', 'sample-1.wav', 'sample-2.wav']
    await filer.unZipFile(zip, tmpdir)
    for (const file of zippedFiles) {
      expect(fsExtra.existsSync(path.join(tmpdir, file))).toBe(true)
    }
    await fsExtra.remove(tmpdir)
  })
})
