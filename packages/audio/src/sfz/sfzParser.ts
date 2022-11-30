/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import type { sfzParsedSection, sfzParsedProps } from '../types/sfz.js'

export function parseSfzSection(sfzText: string): sfzParsedSection[] {
  // remove comments
  sfzText = sfzText.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '').trim() // remove inline/block comments from code files
  /* combination of the followings :
    sfzText = sfzText.replace(/\/\/.*$/gm, '') // remove inline comments
    sfzText = sfzText.replace(/\/\*[\s]*.*[\s]*\*\//gm, '') // remove block comments
    */

  // workaround for sample filename containing spaces
  const filenames = sfzText.match(/sample=(.*).(wav|flac|ogg|aif|aiff|mp3)/gim)
  if (filenames) {
    for (const filename of filenames) {
      sfzText = sfzText.replaceAll(filename, filename.replaceAll(' ', '*'))
    }
  }
  sfzText = sfzText + '\r\n<region>' // workaround fix to retrieve the last region
  const matchesArray = [...sfzText.matchAll(/<(.*?)>([\s\S]*?)((?=<)|\\Z)/gm)]

  return matchesArray.map(function (res) {
    const section = res[1].toLowerCase()
    const kvs = [...res[2].matchAll(/(.*?)=(.*?)($|\s(?=.*?=))/gm)]
    const prop: sfzParsedProps = {}
    kvs.forEach(function (kv) {
      const attribute = kv[1].replace(/\s/gm, '')
      const value = kv[2]
      prop[attribute] = /^\d*$/g.test(value) ? Number(value) : value
      switch (attribute.toLowerCase()) {
        case 'sample':
          prop[attribute] = value.replaceAll('*', ' ')
          break
        case 'key':
        case 'pitch_keycenter':
          if (/^[a-gA-G]#?\d$/.test(value)) prop[attribute] = name2num(value)
          break
      }
    })

    if (prop.sample) prop.sample = (<string>prop.sample).replace(/\\/g, '/')
    return <sfzParsedSection>{
      section: section,
      props: prop,
    }
  })
}

function name2num(name: string) {
  const tmp = name.match(/^([a-gA-G])(#?)(\d)$/)
  if (!tmp) return -1
  const d = tmp[1].toLowerCase()
  const s = tmp[2]
  const o = Number(tmp[3])
  const res = (o + 1) * 12 + (s === '#' ? 1 : 0)
  switch (d) {
    case 'c':
      return res
    case 'd':
      return res + 2
    case 'e':
      return res + 4
    case 'f':
      return res + 5
    case 'g':
      return res + 7
    case 'a':
      return res + 9
    case 'b':
      return res + 11
    default:
      return -1
  }
}
