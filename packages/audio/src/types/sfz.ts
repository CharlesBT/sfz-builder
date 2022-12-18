export interface sfzPatchOptions {
  [key: string]: number | string | boolean | object | undefined
}

export interface sfzPatchProps {
  [key: string]: number | string | boolean | object | undefined
  control?: { default_path?: string }
  global?: {
    [key: string]: number | string | undefined
    global_label?: string
    volume?: number
    polyphony?: number
    loop_mode?: string
    trigger?: string
    amp_veltrack?: number
    bend_up?: number
    bend_down?: number
    ampeg_attack?: number
    ampeg_decay?: number
    ampeg_sustain?: number
    ampeg_release?: number
  }
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

export interface sfzRegionProps {
  [key: string]: number | string | boolean | undefined
  pitch_keycenter?: number
  lokey?: number
  hikey?: number
  loop_type?: string
  loop_start?: number
  loop_end?: number
  sample?: string
}

export interface sfzGroupProps {
  [key: string]: number | string | boolean | undefined
  group_label?: string
  lovel?: number
  hivel?: number
}

export interface sfzParsedProps {
  [key: string]: number | string | boolean
}

export interface sfzParsedSection {
  section: string
  props: sfzParsedProps
}

export type VelocityTransformer = (value: number) => number

export interface sfzProcessOptions {
  [key: string]: number | string | boolean | Map<string, number> | VelocityTransformer | undefined
  update_sfzfile: boolean
  recursive: boolean
  remove_empty_wavfile: boolean
  autorename_wavfile: boolean
  patchname_from: string
  wav_regexp?: string
  midikeymap: Map<string, number>
  velocitytransformer?: VelocityTransformer
  lowercase_extension: boolean
  jsoninfo: boolean
  convert_samplerate: boolean
  convert_bitdepth: boolean
  volume_reference: string
  volume: number
  trim: boolean
  fadeout: boolean
}

export interface sfzOptions {
  process?: sfzProcessOptions
  patch?: sfzPatchOptions
}

export type PatchProcessingFunction = (patchFileName: string, options: sfzOptions) => Promise<void>
