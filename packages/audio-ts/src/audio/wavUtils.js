/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import fs from 'node:fs'
import path from 'node:path'

import { config, filer } from '@bms/common'
import { WaveFile } from '@bms/wavefile'
import _ from 'lodash'

import { audioEncoder } from './audioEncoder.js'
import { errorMessages } from './errorMessages.js'
import { ffmpeg } from './ffmpeg.js'

const MAX_SAMPLERATE = config.encoder.maxsamplerate
const MAX_BITDEPTH = config.encoder.maxbitdepth
const WAV_MAXSAMPLERATE_SUFFIX = `${Math.round(MAX_SAMPLERATE / 1000)}k`
const WAV_MAXBITDEPTH_SUFFIX = `${MAX_BITDEPTH}bits`
const FADEOUT_RATIO = config.encoder.fadeoutratio

const FFMPEG_WAV_VOLUME = config.encoder.ffmpeg.wav_volume
const FFMPEG_WAV_FADEOUT = config.encoder.ffmpeg.wav_fadeout
const FFMPEG_WAV_SILENCE = config.encoder.ffmpeg.wav_silence
const LOW_VOLUME_THRESHOLD = config.encoder.lowvolumethreshold

export class wavUtils {
  // write Json file for WAV files containing loop points, keep historic of previous processings
  static async writeJsonInfo(file) {
    // backup previous process historic
    let prev_info = undefined

    try {
      prev_info = await wavUtils.getJsonInfo(file)
    } catch {}

    await ffmpeg.writeJsonInfo(file)
    const info = await wavUtils.getJsonInfo(file)

    // remove prgram entry if exists
    if (info.programs) {
      delete info.programs
    }

    // add loop section for loop points identification
    const loop = {}
    const samplerate = parseInt(info.streams[0].sample_rate, 10)
    const wav = new WaveFile(await fs.promises.readFile(file))
    const wavloop = wav.smpl.loops[0]
    if (wavloop !== undefined) {
      loop.start_sample = wavloop.dwStart
      loop.end_sample = wavloop.dwEnd
      loop.start_time = _.round(loop.start_sample / samplerate, 10)
      loop.end_time = _.round(loop.end_sample / samplerate, 10)
    }
    info.loop = loop

    /////////////////////////////////////////////////////////////
    //  manage specific cases

    // case: empty/no sample file
    if (info.streams[0].nb_samples === 0) {
      console.info(`File: ${file} | ${errorMessages.EmptyWavFile}`)
    }

    // case: low volume level
    if (info.streams[0].mean_volume < LOW_VOLUME_THRESHOLD) {
      console.info(
        `File: ${file} | ${errorMessages.LowVolumeLevelExceeded.replace(
          '<value>',
          LOW_VOLUME_THRESHOLD,
        )}`,
      )
    }
    /////////////////////////////////////////////////////////////

    // set previous process historic
    if (prev_info) {
      info.processing = prev_info.processing
    }

    await fs.promises.writeFile(file + '.json', JSON.stringify(info))
  }

  // update Json file with info
  static async updateJsonInfo(file, info) {
    await fs.promises.writeFile(file + '.json', JSON.stringify(info))
  }

  // get Json file info from WAV files containing loop points
  static async getJsonInfo(file) {
    const data = await fs.promises.readFile(file + '.json', 'utf8')
    return JSON.parse(data)
  }

  static async addProcessToJsonInfo(file, processname) {
    const info = await wavUtils.getJsonInfo(file)
    if (info.processing) {
      info.processing.push(processname)
    } else {
      const processing = []
      processing.push(processname)
      info.processing = processing
    }
    await wavUtils.updateJsonInfo(file, info)
  }

  // returns TRUE when Json file contains sample loop points (info.loop)
  static async jsonHasLoop(file) {
    const info = await wavUtils.getJsonInfo(file)
    const loop = info.loop
    if (loop.start_sample === undefined || loop.end_sample === undefined) {
      return false
    } else {
      return true
    }
  }

  // returns TRUE when wav file contains sample loop points (smpl.loop)
  static async wavHasLoop(file) {
    const wav = new WaveFile(await fs.promises.readFile(file))
    const sampleloop = wav.smpl.loops[0]
    if (sampleloop === undefined) {
      return false
    } else {
      return true
    }
  }

  // write sample loop points to wav file, (loopstart and loopend in samples)
  static async writeLoopPoints(file, loopstart, loopend) {
    const ext = 'loop.wav'

    // load input wave
    let waveData = await fs.promises.readFile(file)

    // get sample rate of wave file
    // let sampleRateIndex
    // for (let i = 0; i < waveData.length - 4; i++) {
    //   if (waveData.toString('utf8', i, i + 4) === 'fmt ') {
    //     // look for fmt chunk - which contains sample rate among other things - per wave format specification
    //     sampleRateIndex = i + 4 + 4 + 2 + 2 // sample rate is 12 bytes after loopstart of 'fmt ' chunk id
    //     break
    //   }
    // }
    // if (sampleRateIndex === undefined) return
    // const sampleRate = waveData.readUInt32LE(sampleRateIndex)

    // convert seconds to samples
    // loopstart = Math.floor(sampleRate * loopstart)
    // loopend = Math.floor(sampleRate * loopend)

    // find index (byte offset) of smpl chunk if it exists
    let smplIndex
    for (
      let i = waveData.length - 4 - 1;
      i >= 0;
      i-- // loopstart search from loopend of file going backward, since the smpl chunk is typically written after the actual waveform data
    ) {
      if (waveData.toString('utf8', i, i + 4) === 'smpl') {
        smplIndex = i // loopstart of smpl chunk id
        break
      }
    }

    // if the smpl chunk already exists, remove it
    if (smplIndex !== undefined) {
      const smplChunkSize = waveData.readUInt32LE(smplIndex + 4) + 8 // smpl chunk size is specified 4 bytes after loopstart of smpl chunk id. add 8 bytes to include size of smpl chunk header itself
      waveData = Buffer.concat([
        waveData.slice(0, smplIndex),
        waveData.slice(smplIndex + smplChunkSize),
      ]) // splice smpl chunk from wave file data
    }

    // make new buffer to replace smpl chunk
    const smplChunk = Buffer.alloc(68) // the default smpl chunk written here is 60 bytes long. add 8 bytes to include size of smpl chunk header itself
    // all bytes other than the ones specified below default to 0 and represent default values for the smpl chunk properties
    smplChunk.write('smpl', 0, 4)
    smplChunk.writeUInt32LE(60, 4) // the default smpl chunk written here is 60 bytes long
    smplChunk.writeUInt32LE(60, 20) // middle C is MIDI note 60, therefore make MIDI unity note 60
    smplChunk.writeUInt32LE(1, 36) // write at byte offset 36 that there is one loop cue info in the file
    smplChunk.writeUInt32LE(loopstart, 52) // write loop loopstart point at byte offset 52
    smplChunk.writeUInt32LE(loopend, 56) // write loop loopend point at byte offset 56

    // apploopend new smpl chunk to wave file
    waveData = Buffer.concat([waveData, smplChunk])

    // change wave file main header data to increase the file size to include smpl chunk (loop points)
    let fileSizeIndex
    for (let i = 0; i < waveData.length - 4; i++) {
      if (waveData.toString('utf8', i, i + 4) === 'RIFF') {
        // look for RIFF chunk (should always be at the very beginning of file)
        fileSizeIndex = i + 4 // file size is 4 bytes after loopstart of RIFF chunk id
        break
      }
    }
    if (fileSizeIndex === undefined) return
    const fileSize = waveData.length - 8 // get final length of wave file, minus 8 bytes to not include the RIFF chunk header itself
    waveData.writeUInt32LE(fileSize, fileSizeIndex) // write new file length

    // write new wave file
    const parsed = path.parse(file)
    const fileDestination = path.join(parsed.dir, parsed.name + '.' + ext)
    await fs.promises.writeFile(fileDestination, waveData)
    await filer.move(fileDestination, file)
  }

  // edit WAV file and remove all loopint points in smpl.loops
  static async removeLoops(file) {
    const wav = new WaveFile(await fs.promises.readFile(file))
    wav.smpl.dwNumSampleLoops = 0 // remove loops
    await fs.promises.writeFile(file, wav.toBuffer())
  }

  // Must be to be invoked after each wav processing, write loop point in new wav file, record process entry in Json info
  static async processAppliedToWav(file, info, processname) {
    // write loop points
    if (info.loop.start_sample !== undefined && info.loop.end_sample !== undefined) {
      await wavUtils.writeLoopPoints(file, info.loop.start_sample, info.loop.end_sample)
    }
    await wavUtils.addProcessToJsonInfo(file, processname)
    await wavUtils.writeJsonInfo(file)
  }

  static async processConvertToMaxSampleRate(file, info) {
    const samplerate = parseInt(info.streams[0].sample_rate, 10)
    if (samplerate > MAX_SAMPLERATE) {
      await audioEncoder.WAV_MAX_SAMPLERATE(file)
      const dir = path.parse(file).dir
      const filename = path.parse(file).name + '.' + WAV_MAXSAMPLERATE_SUFFIX + '.wav'
      await filer.move(path.join(dir, filename), file)

      // update and write new loop points
      if (info.loop.start_sample !== undefined && info.loop.end_sample !== undefined) {
        const factor = MAX_SAMPLERATE / samplerate
        const new_start_sample = Math.round(info.loop.start_sample * factor)
        const new_end_sample = Math.round(info.loop.end_sample * factor)
        await wavUtils.writeLoopPoints(file, new_start_sample, new_end_sample)
      }

      // update wav loop point and Json file
      await wavUtils.processAppliedToWav(file, info, `resample:${MAX_SAMPLERATE}`)
      console.info(
        `File: ${file} | convert samplerate ${Math.round(samplerate / 1000)}kHz > ${Math.round(
          MAX_SAMPLERATE / 1000,
        )}kHz`,
      )
    }
  }

  static async processConvertToMaxBitDepth(file, info) {
    const bitdepth = parseInt(info.streams[0].bits_per_sample, 10)
    if (bitdepth > MAX_BITDEPTH) {
      await audioEncoder.WAV_MAX_BITDEPTH(file)
      const dir = path.parse(file).dir
      const filename = path.parse(file).name + '.' + WAV_MAXBITDEPTH_SUFFIX + '.wav'
      await filer.move(path.join(dir, filename), file)

      // update wav loop point and Json file
      await wavUtils.processAppliedToWav(file, info, `bitdepth:${MAX_BITDEPTH}`)
      console.info(`File: ${file} | convert bitdepth ${bitdepth}bits > ${MAX_BITDEPTH}bits`)
    }
  }

  // increase volume in dB, avoid
  static async processVolume(file, volume) {
    const ext = 'vol.wav'
    const info = await wavUtils.getJsonInfo(file)

    let encodingOptions = FFMPEG_WAV_VOLUME
    encodingOptions = encodingOptions.replace('<volume>', volume)

    const ffmpegCmd = ffmpeg.getFFmpegCmd(file, ext, encodingOptions)
    await ffmpeg.execCmd(ffmpegCmd)
    await filer.move(path.join(path.parse(file).dir, path.parse(file).name + '.' + ext), file)

    // update wav loop point and Json file
    await wavUtils.processAppliedToWav(file, info, `volume:${volume}`)
    console.info(`File: ${file} | volume ${volume} dB`)
  }

  // process fadeout on wav file, avoid if wav file contains loop points
  static async processFadeOut(file) {
    // return if json file contains loop points
    if (await wavUtils.jsonHasLoop(file)) {
      return
    }

    const ext = 'fade.wav'
    const info = await wavUtils.getJsonInfo(file)
    const numSamples = info.streams[0].duration_ts
    const sampleRate = info.streams[0].sample_rate
    const sampleDuration = numSamples / sampleRate // in seconds : 1s contains samplerate samples
    const fadeDuration = _.round(FADEOUT_RATIO * sampleDuration, 2)
    const ffStartTime = _.round(sampleDuration - fadeDuration, 2)

    let encodingOptions = FFMPEG_WAV_FADEOUT
    encodingOptions = encodingOptions.replace('<start>', ffStartTime)
    encodingOptions = encodingOptions.replace('<duration>', fadeDuration)

    const ffmpegCmd = ffmpeg.getFFmpegCmd(file, ext, encodingOptions)
    await ffmpeg.execCmd(ffmpegCmd)
    await filer.move(path.join(path.parse(file).dir, path.parse(file).name + '.' + ext), file)

    // update wav loop point and Json file
    await wavUtils.processAppliedToWav(file, info, `fadeout:${fadeDuration}`)
    console.info(`File: ${file} | fadeout ${fadeDuration} sec`)
  }

  // remove silence at the beginning and the end of wav file, avoid if wav file contains loop points
  static async processRemoveSilence(file) {
    // return if json file contains loop points
    if (await wavUtils.jsonHasLoop(file)) {
      return
    }

    const ext = 'trim.wav'
    const info = await wavUtils.getJsonInfo(file)

    const encodingOptions = FFMPEG_WAV_SILENCE
    const ffmpegCmd = ffmpeg.getFFmpegCmd(file, ext, encodingOptions)
    await ffmpeg.execCmd(ffmpegCmd)
    await filer.move(path.join(path.parse(file).dir, path.parse(file).name + '.' + ext), file)

    // update wav loop point and Json file
    await wavUtils.processAppliedToWav(file, info, `remove-silence`)
    console.info(`File: ${file} | remove silence`)
  }
}
