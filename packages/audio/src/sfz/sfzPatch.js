/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { config } from '@bms/common'
import _ from 'lodash'

import { sfzHeader } from './sfzHeader.js'

const sfzDefault = config.sfz.default.patch
const sfzTemplates = config.sfz.global_templates

export class sfzPatch {
  name
  type
  multi_velocity_layer

  sfz = {
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

  groups = []

  constructor(options = {}) {
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
      this.setObjectValue(this, key, options[key])
    }

    this.setName(options.name)
    this.setType(options.type) // update patch setting according to instrument type
    this.setMultiVelocityLayer(options.multi_velocity_layer)
  }

  set(key, value) {
    this.setObjectValue(this, key, value)
  }

  get(key) {
    return this.getObjectValue(this, key)
  }

  getObjectValue(object, key) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this // Get a reference to your object.
    let value
    Object.keys(object).some(function (k) {
      if (k === key) {
        value = object[k]
        return true
      }
      if (object[k] && typeof object[k] === 'object') {
        value = self.getObjectValue(object[k], key)
        return value !== undefined
      }
    })
    return value
  }

  setObjectValue(object, key, value) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this // Get a reference to your object.
    Object.keys(object).some(function (k) {
      if (k === key) {
        object[k] = value
        return true
      }
      if (object[k] && typeof object[k] === 'object') {
        self.setObjectValue(object[k], key, value)
      }
    })
  }

  setName(name) {
    this.name = this.sfz.global.global_label = name
  }

  setType(type) {
    this.type = type.toString().toLowerCase()
    const template = sfzTemplates[this.type]
    for (const [key, value] of Object.entries(template)) {
      if (value.toString().toLowerCase() === 'global.default') {
        // process default sfz value from config file
        this.sfz.global[key] = sfzDefault.global[key]
      } else {
        this.sfz.global[key] = value
      }
    }
  }

  // set single / multi velocity layer patch : adapt amp_veltrack accordingly
  setMultiVelocityLayer(bool) {
    this.multi_velocity_layer = bool
    if (bool) {
      // multi velocity layer
      this.sfz.global.amp_veltrack = sfzDefault.multi_velocity_layer__amp_veltrack
    } else {
      // single velocity layer
      this.sfz.global.amp_veltrack = sfzDefault.single_velocity_layer__amp_veltrack
    }
  }

  build() {
    // pre process data if needed
    this.sfz.control.default_path.lastIndexOf('/') !== this.sfz.control.default_path.length - 1
      ? (this.sfz.control.default_path += '/')
      : null
    this.sfz.global.global_label = this.name

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

  buildSection(section) {
    let r = ''
    r += `\r\r<${section}>\r`
    for (const key of Object.keys(this.sfz[section])) {
      r += this.writeSfzAttribute(this.sfz[section], key)
    }
    return r
  }

  writeSfzAttribute(section, attribute) {
    if (section[attribute] !== undefined) {
      return ` ${attribute}=${section[attribute]}`
    } else {
      return ''
    }
  }
}
