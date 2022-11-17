/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { config, filer } from '@bms/common'

import { ffmpeg } from './ffmpeg.js'

const errorMessage = {
  isNotWavFile: 'Wrong file extension for FFmpeg encoding, wav file expected',
  LowVolumeLevelExceeded: 'WARNING: very low volume level < <value>dB',
  EmptyWavFile: 'WARNING: empty file, constains no sample',
}

const MAX_SAMPLERATE = config.encoder.maxsamplerate
const MAX_BITDEPTH = config.encoder.maxbitdepth
const WAV_MAXSAMPLERATE_SUFFIX = `${Math.round(MAX_SAMPLERATE / 1000)}k`
const WAV_MAXBITDEPTH_SUFFIX = `${MAX_BITDEPTH}bits`

const FFMPEG_FLAC_OPTS = config.encoder.ffmpeg.flac
const FFMPEG_OGG_OPTS = config.encoder.ffmpeg.ogg
const FFMPEG_WAV_MAXSAMPLERATE_OPTS = config.encoder.ffmpeg.wav_maxsamplerate
const FFMPEG_WAV_MAXBITDEPTH_OPTS = config.encoder.ffmpeg.wav_maxbitdepth

export class audioEncoder {
  static async BULK_ENCODE_WAV2FLAC(files) {
    await audioEncoder.BULK_ENCODE(files, await audioEncoder.WAV2FLAC)
  }

  static async BULK_ENCODE_WAV2OGG(files) {
    await audioEncoder.BULK_ENCODE(files, await audioEncoder.WAV2OGG)
  }

  static async BULK_ENCODE_WAV_MAX_SAMPLERATE(files) {
    await audioEncoder.BULK_ENCODE(files, await audioEncoder.WAV_MAX_SAMPLERATE)
  }

  static async BULK_ENCODE_WAV_MAX_BITDEPTH(files) {
    await audioEncoder.BULK_ENCODE(files, await audioEncoder.WAV_MAX_BITDEPTH)
  }

  static async BULK_ENCODE(files, fileEncodeFunction) {
    const results = []
    const start = Date.now()
    if (Array.isArray(files)) {
      for (const file of files) {
        const result = await fileEncodeFunction(file)
        results.push({ file: file, result: result })
      }
    } else {
      const result = await fileEncodeFunction(files)
      results.push({ file: files, result: result })
    }
    const time = Math.round((Date.now() - start) / 1000) // return execution time in seconds
    const r = {
      count: files.length,
      success: results.filter((elt) => elt.result === true).length,
      fail: results.filter((elt) => elt.result === false).length,
      time: time, // execution time in seconds
      result: results.every((elt) => elt.result === true) ? true : false,
    }
    return r
  }

  static async WAV2FLAC(file) {
    if (!filer.isExt(file, 'wav')) throw new Error(errorMessage.isNotWavFile)
    let cmd = ffmpeg.getFFmpegCmd(file, 'flac', FFMPEG_FLAC_OPTS)
    cmd = cmd.replace('<samplerate>', MAX_SAMPLERATE)
    await ffmpeg.execCmd(cmd)
  }

  static async WAV2OGG(file) {
    if (!filer.isExt(file, 'wav')) throw new Error(errorMessage.isNotWavFile)
    let cmd = ffmpeg.getFFmpegCmd(file, 'ogg', FFMPEG_OGG_OPTS)
    cmd = cmd.replace('<samplerate>', MAX_SAMPLERATE)
    await ffmpeg.execCmd(cmd)
  }

  static async WAV_MAX_SAMPLERATE(file) {
    if (!filer.isExt(file, 'wav')) throw new Error(errorMessage.isNotWavFile)
    let cmd = ffmpeg.getFFmpegCmd(
      file,
      WAV_MAXSAMPLERATE_SUFFIX + '.wav',
      FFMPEG_WAV_MAXSAMPLERATE_OPTS,
    )
    cmd = cmd.replace('<samplerate>', MAX_SAMPLERATE)
    await ffmpeg.execCmd(cmd)
  }

  static async WAV_MAX_BITDEPTH(file) {
    if (!filer.isExt(file, 'wav')) throw new Error(errorMessage.isNotWavFile)
    let cmd = ffmpeg.getFFmpegCmd(
      file,
      WAV_MAXBITDEPTH_SUFFIX + '.wav',
      FFMPEG_WAV_MAXBITDEPTH_OPTS,
    )
    cmd = cmd.replace('<samplerate>', MAX_SAMPLERATE)
    await ffmpeg.execCmd(cmd)
  }
}
