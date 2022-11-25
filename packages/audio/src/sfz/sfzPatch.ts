/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import _ from 'lodash'
import { config } from '../config/configProvider.js'
import { sfzHeader } from './sfzHeader.js'
import type { sfzGroup } from './sfzGroup.js'
import type { sfzDefaultPatchSettings, sfzPatchTemplateSettings } from './sfzSettings.js'

const sfzDefault = config.sfz.default.patch as sfzDefaultPatchSettings
const sfzTemplates = config.sfz.global_templates as sfzPatchTemplateSettings

export interface sfzPatchOptions {
  [key: string]: number | string | boolean | object | undefined
}

export class sfzPatch {
  name?: string
  type?: string
  multi_velocity_layer?: boolean

  sfz: {
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
  } = {
    control: { default_path: undefined },
    global: {
      global_label: undefined,
      volume: undefined,
      polyphony: undefined,
      loop_mode: undefined,
      trigger: undefined,
      amp_veltrack: undefined,
      bend_up: undefined,
      bend_down: undefined,
      ampeg_attack: undefined,
      ampeg_decay: undefined,
      ampeg_sustain: undefined,
      ampeg_release: undefined,
    },
  }

  groups: sfzGroup[] = []

  constructor(options: sfzPatchOptions = {}) {
    _.defaults(options, {
      name: undefined,
      type: sfzDefault.type, // see global_templates in config file
      multi_velocity_layer: sfzDefault.multi_velocity_layer,
      default_path: sfzDefault.control.default_path,
      volume: sfzDefault.global.volume,
      polyphony: sfzDefault.global.polyphony,
      loop_mode: sfzDefault.global.loop_mode, // no_loop (default) | one_shot | loop_continuous | loop_sustain
      trigger: sfzDefault.global.trigger,
      amp_veltrack: sfzDefault.single_velocity_layer__amp_veltrack,
      bend_up: sfzDefault.global.bend_up,
      bend_down: sfzDefault.global.bend_down,
      ampeg_attack: sfzDefault.global.ampeg_attack,
      ampeg_decay: sfzDefault.global.ampeg_decay,
      ampeg_sustain: sfzDefault.global.ampeg_sustain,
      ampeg_release: sfzDefault.global.ampeg_release,
    })

    for (const key of Object.keys(options)) {
      this.setObjectValue(this.sfz, key, options[key])
    }

    this.setName(options.name as string)
    this.setType(options.type as string) // update patch setting according to instrument type
    this.setMultiVelocityLayer(options.multi_velocity_layer as boolean)
  }

  set(key: string, value: string | number | boolean) {
    this.setObjectValue(this.sfz, key, value)
  }

  get(key: string) {
    return this.getObjectValue(this.sfz, key)
  }

  getObjectValue(object: sfzPatchOptions, key: string): sfzPatchOptions['key'] {
    const self = this as sfzPatch // Get a reference to your object.
    let value
    Object.keys(object).some(function (k) {
      if (k === key) {
        value = object[k]
        return true
      }
      if (object[k] && typeof object[k] === 'object') {
        value = self.getObjectValue(object[k] as sfzPatchOptions, key)
        return value !== undefined
      }
    })
    return value
  }

  setObjectValue(object: sfzPatchOptions, key: string, value: sfzPatchOptions['key']) {
    const self = this as sfzPatch // Get a reference to your object.
    Object.keys(object).some(function (k) {
      if (k === key) {
        object[k] = value
        return true
      }
      if (object[k] && typeof object[k] === 'object') {
        self.setObjectValue(object[k] as sfzPatchOptions, key, value)
      }
    })
  }

  setName(name: string) {
    this.name = name
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.sfz.global!.global_label = name
  }

  setType(type: string) {
    this.type = type.toString().toLowerCase()
    const template = sfzTemplates[type]
    for (const [key, value] of Object.entries(template)) {
      if (value?.toString().toLowerCase() === 'global.default') {
        // process default sfz value from config file
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.sfz.global![key] = sfzDefault.global[key]
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.sfz.global![key] = value
      }
    }
  }

  // set single / multi velocity layer patch : adapt amp_veltrack accordingly
  setMultiVelocityLayer(bool: boolean) {
    this.multi_velocity_layer = bool
    if (bool) {
      // multi velocity layer
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.sfz.global!.amp_veltrack = sfzDefault.multi_velocity_layer__amp_veltrack
    } else {
      // single velocity layer
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.sfz.global!.amp_veltrack = sfzDefault.single_velocity_layer__amp_veltrack
    }
  }

  build() {
    // pre process data if needed
    let path = this.sfz.control?.default_path
    if (typeof path !== 'undefined') {
      path.lastIndexOf('/') !== path.length - 1 ? (path += '/') : null
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.sfz.global!.global_label = this.name

    // build sfz output
    let r = sfzHeader

    // control
    r += this.buildSection('control')

    // global
    r += this.buildSection('global')

    // groups
    for (const group of this.groups) {
      r += group.build()
    }
    return r
  }

  buildSection(section: string) {
    let r = ''
    const node = this.sfz[section]
    if (typeof node !== 'undefined') {
      r += `\r\r<${section}>\r`
      for (const key of Object.keys(node)) {
        r += this.writeSfzAttribute(node, key)
      }
    }
    return r
  }

  writeSfzAttribute<S, A>(section: S, attribute: A) {
    const t = section[attribute as keyof S]
    if (typeof t !== 'undefined') {
      return ` ${attribute}=${t}`
    } else {
      return ''
    }
  }
}
