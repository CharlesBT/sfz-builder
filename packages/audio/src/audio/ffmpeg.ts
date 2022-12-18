import childProcess from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import util from 'node:util'
import { packageDirectorySync } from 'pkg-dir'
import _ from 'lodash'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ffmpegBin from 'ffmpeg-static-electron'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ffprobeBin from 'ffprobe-static-electron'
import { shellEscape } from '../utils/shellEscape.js'
import { config } from '../config/configProvider.js'

const __pkgRoot = <string>packageDirectorySync()

const FFMPEG_POSIX_RELATIVEPATH = path
  .relative(__pkgRoot, ffmpegBin.path)
  .split(path.sep)
  .join(path.posix.sep)
const FFPROBE_POSIX_RELATIVEPATH = path
  .relative(__pkgRoot, ffprobeBin.path)
  .split(path.sep)
  .join(path.posix.sep)

const ENCODER_TIMEOUT = config.encoder.timeout
const FFMPEG_WAV_GETVOLUME = config.encoder.ffmpeg.wav_getvolume
const FFPROBE_INFO = config.encoder.ffprobe.info

const nbsamplesRegex = /n_samples:(.*)$/gm // ctach number of samples

const maxvolRegex = /max_volume:(.*)dB$/gm // catch volume
const meanvolRegex = /mean_volume:(.*)dB$/gm // catch volume

export class ffmpeg {
  static async execCmd(cmd: string) {
    try {
      const exec = util.promisify(childProcess.exec)
      const { stdout, stderr } = await exec(cmd, { timeout: ENCODER_TIMEOUT })
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message)
      }
    }
  }

  static getFFmpegCmd(inputFile: string, outputExt: string, encodingOptions: string) {
    const relativePosixInputFilepath = path
      .relative(__pkgRoot, inputFile)
      .split(path.sep)
      .join(path.posix.sep)
    const parsed = path.parse(relativePosixInputFilepath)
    const relativePosixOutputFilepath = path
      .join(parsed.dir, parsed.name + '.' + outputExt)
      .split(path.sep)
      .join(path.posix.sep)
    let cmd = `${shellEscape(FFMPEG_POSIX_RELATIVEPATH)} ${encodingOptions}`
    cmd = cmd.replace('<inputfile>', shellEscape(relativePosixInputFilepath))
    cmd = cmd.replace('<outputfile>', shellEscape(relativePosixOutputFilepath))
    return cmd
  }

  static async writeJsonInfo(file: string) {
    const relativePosixInputFilepath = path
      .relative(__pkgRoot, file)
      .split(path.sep)
      .join(path.posix.sep)

    // const filename = path.parse(file).base
    let cmd = `${shellEscape(FFPROBE_POSIX_RELATIVEPATH)} ${FFPROBE_INFO} > ${shellEscape(
      relativePosixInputFilepath + '.json',
    )}`
    cmd = cmd.replace('<inputfile>', shellEscape(relativePosixInputFilepath))
    await ffmpeg.execCmd(cmd)

    // add max volume to json info
    await ffmpeg.writeNbSamplesAndMaxVolume(file)
  }

  // write wav file max volume to Json info
  static async writeNbSamplesAndMaxVolume(file: string) {
    const relativePosixInputFilepath = path
      .relative(__pkgRoot, file)
      .split(path.sep)
      .join(path.posix.sep)

    const ext = '.vol.txt'
    let cmd = `${shellEscape(FFMPEG_POSIX_RELATIVEPATH)} ${FFMPEG_WAV_GETVOLUME} 2> ${shellEscape(
      relativePosixInputFilepath + ext,
    )}`
    cmd = cmd.replace('<inputfile>', shellEscape(relativePosixInputFilepath))
    await ffmpeg.execCmd(cmd)
    const txt = await fs.promises.readFile(relativePosixInputFilepath + ext, 'utf8')
    const info = JSON.parse(
      await fs.promises.readFile(relativePosixInputFilepath + '.json', 'utf8'),
    )
    const [[, nb_samplesRe]] = [...txt.matchAll(_.clone(_.clone(nbsamplesRegex)))]
    const nb_samples = parseInt(nb_samplesRe.trim(), 10)
    info.streams[0].nb_samples = nb_samples

    if (nb_samples > 0) {
      const [[, maxvolRe]] = [...txt.matchAll(_.clone(_.clone(maxvolRegex)))]
      const maxvolume = parseInt(maxvolRe.trim(), 10)
      const [[, meanvolRe]] = [...txt.matchAll(_.clone(_.clone(meanvolRegex)))]
      const meanvolume = parseInt(meanvolRe.trim(), 10)
      info.streams[0].max_volume = maxvolume
      info.streams[0].mean_volume = meanvolume
    }

    await fs.promises.writeFile(relativePosixInputFilepath + '.json', JSON.stringify(info))
    // delete temp file
    await fs.promises.unlink(relativePosixInputFilepath + ext)
  }
}
