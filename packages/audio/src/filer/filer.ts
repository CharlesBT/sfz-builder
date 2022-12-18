import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import AdmZip from 'adm-zip'
import filenamify from 'filenamify'
import fsExtra from 'fs-extra'
import unzipper from 'unzipper'

const errorMessage = {
  FileNotFound: 'File not found',
  MissingFileExtensionInArgs: 'file extension missing in args',
  UnzipFailed: 'Unzip failed',
}

export class filer {
  static isExt(file: string, ext: string) {
    const e = path.parse(file).ext.toLowerCase()
    return e === '.' + ext.toLowerCase() ? true : false
  }

  static writeJsonSync(file: string, object: object) {
    fsExtra.writeJsonSync(file, object)
  }

  static async writeJson(file: string, object: object) {
    await fsExtra.writeJson(file, object)
  }

  static readJsonSync(file: string) {
    if (!this.existsSync(file)) throw new Error(errorMessage.FileNotFound)
    const r = fsExtra.readJsonSync(file)
    return r
  }

  static async readJson(file: string) {
    if (!this.existsSync(file)) throw new Error(errorMessage.FileNotFound)
    const r = await fsExtra.readJson(file)
    return r
  }

  static moveSync(path: string, newpath: string, options?: fsExtra.MoveOptions | undefined) {
    if (!this.existsSync(path)) throw new Error(errorMessage.FileNotFound)
    if (options) {
      fsExtra.moveSync(path, newpath, options)
    } else {
      fsExtra.moveSync(path, newpath, { overwrite: true })
    }
  }

  static async move(path: string, newpath: string, options?: fsExtra.MoveOptions | undefined) {
    if (!this.existsSync(path)) throw new Error(errorMessage.FileNotFound)
    if (options) {
      await fsExtra.move(path, newpath, options)
    } else {
      await fsExtra.move(path, newpath, { overwrite: true })
    }
  }

  static copySync(src: string, dest: string) {
    if (!this.existsSync(src)) throw new Error(errorMessage.FileNotFound)
    fsExtra.copySync(src, dest, { overwrite: true })
  }

  static async copy(src: string, dest: string) {
    if (!this.existsSync(src)) throw new Error(errorMessage.FileNotFound)
    await fsExtra.copy(src, dest, { overwrite: true })
  }

  static deleteSync(path: string) {
    if (!this.existsSync(path)) throw new Error(errorMessage.FileNotFound)
    fsExtra.removeSync(path)
  }

  static async delete(path: string) {
    if (!this.existsSync(path)) throw new Error(errorMessage.FileNotFound)
    await fsExtra.remove(path)
  }

  static existsSync(path: string) {
    const r = fsExtra.pathExistsSync(path)
    return r
  }

  static async exists(path: string) {
    const r = await fsExtra.pathExists(path)
    return r
  }

  static createDirSync(path: string) {
    fsExtra.ensureDirSync(path)
  }

  static async createDir(path: string) {
    await fsExtra.ensureDir(path)
  }

  // returns array of files with given extension in single folder
  static async getFilesInFolder(folderPath: string, fileExtension: string) {
    if (typeof fileExtension !== 'string') {
      throw new Error(errorMessage.MissingFileExtensionInArgs)
    }
    const files = []
    const dir = path.resolve(folderPath)
    const directoryContent = await fsExtra.promises.readdir(dir, { withFileTypes: true })
    const fileNames = directoryContent.filter((elt) => elt.isFile()).map((elt) => elt.name)
    for (const value of fileNames.values()) {
      const file = path.join(dir, value)
      if (this.isExt(file, fileExtension)) {
        files.push(file)
      }
    }
    return files
  }

  // returns array of files with given extension in subfolders
  static async getFilesInSubFolders(folderPath: string, fileExtension: string) {
    if (typeof fileExtension !== 'string') {
      throw new Error(errorMessage.MissingFileExtensionInArgs)
    }
    let files: string[] = []
    const dir = path.resolve(folderPath)
    const directoryContent = await fsExtra.promises.readdir(dir, { withFileTypes: true })
    const directoryNames = directoryContent
      .filter((elt) => elt.isDirectory())
      .map((elt) => elt.name)
    const results = await this.getFilesInFolder(folderPath, fileExtension)
    files = files.concat(results)
    for (const value of directoryNames.values()) {
      const folder = path.join(dir, value)
      // eslint-disable-next-line no-await-in-loop
      const results = await this.getFilesInSubFolders(folder, fileExtension)
      files = files.concat(results)
    }
    return files
  }

  static async lowerCaseFileExt(file: string, ext: string) {
    if (typeof ext !== 'string') {
      throw new Error(errorMessage.MissingFileExtensionInArgs)
    }
    ext = ext.toLowerCase()
    const newFile = path.join(
      path.parse(file).dir,
      path.parse(file).name + path.parse(file).ext.toLowerCase(),
    )
    if (file !== newFile) {
      await this.move(file, newFile)
    }
  }

  static sanitizeName(filename: string) {
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

  /**
   * unzip a zip file synchronously (using adm-zip)
   * @param file - zip file
   * @param dest - unzip path
   */
  static unZipSync(file: string, dest: string) {
    try {
      fsExtra.ensureDirSync(dest)
      const zip = new AdmZip(file)
      zip.extractAllTo(/*target path*/ dest, /*overwrite*/ true)
    } catch (err) {
      console.error((<Error>err).message, import.meta.url)
      throw new Error(errorMessage.UnzipFailed)
    }
  }

  /**
   * unzip a zip file asynchronously (using unzipper)
   * @param file - zip file
   * @param dest - unzio path
   */
  static async unZipAsync(file: string, dest: string) {
    async function folderExists(path: string) {
      try {
        const result = await fs.promises.stat(path)
        return !result ? result : result.isDirectory()
      } catch (err) {
        if ((<NodeJS.ErrnoException>err).code === 'ENOENT') {
          // not found
          return false
        }
        throw err
      }
    }

    try {
      const zip = fs.createReadStream(file).pipe(unzipper.Parse({ forceStream: true }))
      for await (const entry of zip) {
        const fileName = entry.path
        const dir = path.dirname(fileName)
        const targetPath = path.join(dest, dir)
        const _folderExists = await folderExists(targetPath)
        if (!_folderExists) {
          await fs.promises.mkdir(targetPath, { recursive: true })
        }
        entry.pipe(fs.createWriteStream(path.join(dest, fileName)))
      }
    } catch (err) {
      throw new Error((<Error>err).message)
    }
  }
}
