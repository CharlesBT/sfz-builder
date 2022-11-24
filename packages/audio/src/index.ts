/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

// export objects
export { config } from './config/configProvider.js'
export { filer } from './filer/filer.js'
export { audioEncoder } from './audio/audioEncoder.js'
export { ffmpeg } from './audio/ffmpeg.js'
export { wavUtils } from './audio/wavUtils.js'
export { sfzBuilder } from './sfz/sfzBuilder.js'
export { sfzBuilder_AudioLayer } from './sfz/sfzBuilder_AudioLayer.js'
export { sfzBuilder_Bliss } from './sfz/sfzBuilder_Bliss.js'
export { sfzBuilder_FLStudio } from './sfz/sfzBuilder_FLStudio.js'
export { sfzBuilder_Logic } from './sfz/sfzBuilder_Logic.js'
export { sfzBuilder_OneShots } from './sfz/sfzBuilder_OneShots.js'
export { sfzBuilder_SampleRobot } from './sfz/sfzBuilder_SampleRobot.js'
export { sfzGroup } from './sfz/sfzGroup.js'
export { parseSfzSection } from './sfz/sfzParser.js'
export { sfzPatch } from './sfz/sfzPatch.js'
export { sfzRegion } from './sfz/sfzRegion.js'
export { sfzUtils } from './sfz/sfzUtils.js'
export { regExpUtils } from './utils/regExpUtils.js'

// export types
export type {
  IAudioEncoderOptions,
  IBulkEncodeResult,
  EncoderFunction,
} from './audio/audioEncoder.js'
export type { IWavInfo, IWavInfoLoopPoint, LoopPoint, smpl } from './audio/wavUtils.js'
export type { IConfig } from './config/configProvider.js'
export type {
  sfzOptions,
  sfzProcessOptions,
  VelocityTransformer,
  PatchProcessingFunction,
} from './sfz/sfzBuilder.js'
export type { sfzParserSection, sfzParserProperties } from './sfz/sfzParser.js'
export type { sfzPatchOptions } from './sfz/sfzPatch.js'
export type {
  sfzSettings,
  sfzDefaultPatchSettings,
  sfzPatchTemplateSettings,
} from './sfz/sfzSettings.js'
