import { config } from '../config/configProvider.js'

function buildHeader() {
  let r = ''
  for (const line of config.sfz.header.values()) {
    r += `${line}\n`
  }
  return `${r}`
}

export const sfzHeader = buildHeader()
