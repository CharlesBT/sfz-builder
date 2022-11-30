/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

export interface IWavInfo {
  [key: string]: any
}

export interface IWavInfoLoopPoint {
  start_sample: number
  end_sample: number
  start_time: number
  end_time: number
}

export type LoopPoint = { dwStart: number; dwEnd: number }

export type smpl = { loops: LoopPoint[]; dwNumSampleLoops?: number }

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
