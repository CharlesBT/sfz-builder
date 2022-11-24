/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
export interface sfzSettings {
  default: sfzDefaultPatchSettings
  global_templates: sfzPatchTemplateSettings[]
  processing: string
  wav_regexp: {
    samplerobot: string
    flstudio: string
    audiolayer: string
  }
  header: string[]
}

export interface sfzDefaultPatchSettings {
  type: string
  multi_velocity_layer: boolean
  single_velocity_layer__amp_veltrack: number
  multi_velocity_layer__amp_veltrack: number
  control: {
    default_path: string
  }
  global: {
    [key: string]: number | string | undefined
    volume: number
    polyphony: number
    loop_mode: string
    trigger: string
    bend_up: number
    bend_down: number
    ampeg_attack: number
    ampeg_sustain: number
    ampeg_release: number
  }
}

export interface sfzPatchTemplateSettings {
  [key: string]: {
    [key: string]: number | string | undefined
    volume?: number
    polyphony?: number
    loop_mode?: string
    trigger?: string
    bend_up?: number
    bend_down?: number
    ampeg_attack?: number
    ampeg_decay?: number
    ampeg_sustain?: number
    ampeg_release?: number
  }
}
