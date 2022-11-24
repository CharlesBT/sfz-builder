/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { config } from '../config/configProvider.js'
import { filer } from '../filer/filer.js'
import { ffmpeg } from './ffmpeg.js'

export interface IAudioEncoderOptions {
  timeout: number
  maxsamplerate: number
  maxbitdepth: number
  fadeoutratio: number
  headroom: number
  lowvolumethreshold: number
  ffmpeg: {
    flac: string
    ogg: string
    wav_getvolume: string
    wav_maxsamplerate: string
    wav_maxbitdepth: string
    wav_volume: string
    wav_fadeout: string
    wav_silence: string
  }
  ffprobe: {
    info: string
  }
}
export interface IBulkEncodeResult {
  count: number
  success: number
  fail: number
  time: number
  result: boolean
}
export type EncoderFunction = (file: string) => void

const encoderOptions = config.encoder as IAudioEncoderOptions
const errorMessage = {
  isNotWavFile: 'Wrong file extension for FFmpeg encoding, wav file expected',
  LowVolumeLevelExceeded: 'WARNING: very low volume level < <value>dB',
  EmptyWavFile: 'WARNING: empty file, constains no sample',
}

const MAX_SAMPLERATE = encoderOptions.maxsamplerate
const MAX_BITDEPTH = encoderOptions.maxbitdepth
const WAV_MAXSAMPLERATE_SUFFIX = `${Math.round(MAX_SAMPLERATE / 1000)}k`
const WAV_MAXBITDEPTH_SUFFIX = `${MAX_BITDEPTH}bits`

const FFMPEG_FLAC_OPTS = encoderOptions.ffmpeg.flac
const FFMPEG_OGG_OPTS = encoderOptions.ffmpeg.ogg
const FFMPEG_WAV_MAXSAMPLERATE_OPTS = encoderOptions.ffmpeg.wav_maxsamplerate
const FFMPEG_WAV_MAXBITDEPTH_OPTS = encoderOptions.ffmpeg.wav_maxbitdepth

export class audioEncoder {
  static async BULK_ENCODE_WAV2FLAC(files: string[]) {
    await audioEncoder.BULK_ENCODE(files, await audioEncoder.WAV2FLAC)
  }

  static async BULK_ENCODE_WAV2OGG(files: string[]) {
    await audioEncoder.BULK_ENCODE(files, await audioEncoder.WAV2OGG)
  }

  static async BULK_ENCODE_WAV_MAX_SAMPLERATE(files: string[]) {
    await audioEncoder.BULK_ENCODE(files, await audioEncoder.WAV_MAX_SAMPLERATE)
  }

  static async BULK_ENCODE_WAV_MAX_BITDEPTH(files: string[]) {
    await audioEncoder.BULK_ENCODE(files, await audioEncoder.WAV_MAX_BITDEPTH)
  }

  static async BULK_ENCODE(files: string[], fileEncodeFunction: EncoderFunction) {
    const results = []
    const start = Date.now()
    if (Array.isArray(files)) {
      for (const file of files) {
        try {
          await fileEncodeFunction(file)
          results.push({ file: file, result: true })
        } catch (error) {
          if (error instanceof Error) {
            results.push({
              file: file,
              result: false,
              errormsg: error.message,
            })
          }
        }
      }
    } else {
      try {
        await fileEncodeFunction(files)
        results.push({ file: files, result: true })
      } catch (error) {
        if (error instanceof Error) {
          results.push({ file: files, result: false, errormessage: error.message })
        }
      }
    }
    const time = Math.round((Date.now() - start) / 1000) // return execution time in seconds
    return {
      count: files.length,
      success: results.filter((elt) => elt.result === true).length,
      fail: results.filter((elt) => elt.result === false).length,
      time: time, // execution time in seconds
      result: results.every((elt) => elt.result === true) ? true : false,
    } as IBulkEncodeResult
  }

  static async WAV2FLAC(file: string): Promise<void> {
    if (!filer.isExt(file, 'wav')) throw new Error(errorMessage.isNotWavFile)
    let cmd = ffmpeg.getFFmpegCmd(file, 'flac', FFMPEG_FLAC_OPTS)
    cmd = cmd.replace('<samplerate>', MAX_SAMPLERATE.toString())
    await ffmpeg.execCmd(cmd)
  }

  static async WAV2OGG(file: string): Promise<void> {
    if (!filer.isExt(file, 'wav')) throw new Error(errorMessage.isNotWavFile)
    let cmd = ffmpeg.getFFmpegCmd(file, 'ogg', FFMPEG_OGG_OPTS)
    cmd = cmd.replace('<samplerate>', MAX_SAMPLERATE.toString())
    await ffmpeg.execCmd(cmd)
  }

  static async WAV_MAX_SAMPLERATE(file: string): Promise<void> {
    if (!filer.isExt(file, 'wav')) throw new Error(errorMessage.isNotWavFile)
    let cmd = ffmpeg.getFFmpegCmd(
      file,
      WAV_MAXSAMPLERATE_SUFFIX + '.wav',
      FFMPEG_WAV_MAXSAMPLERATE_OPTS,
    )
    cmd = cmd.replace('<samplerate>', MAX_SAMPLERATE.toString())
    await ffmpeg.execCmd(cmd)
  }

  static async WAV_MAX_BITDEPTH(file: string): Promise<void> {
    if (!filer.isExt(file, 'wav')) throw new Error(errorMessage.isNotWavFile)
    let cmd = ffmpeg.getFFmpegCmd(
      file,
      WAV_MAXBITDEPTH_SUFFIX + '.wav',
      FFMPEG_WAV_MAXBITDEPTH_OPTS,
    )
    cmd = cmd.replace('<samplerate>', MAX_SAMPLERATE.toString())
    await ffmpeg.execCmd(cmd)
  }
}
