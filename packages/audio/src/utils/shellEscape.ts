/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

// taken from https://github.com/boazy/any-shell-escape/blob/master/shell-escape.js

type escapeFunction = (path: string) => string

function escapePathSh(path: string) {
  if (!/^[A-Za-z0-9_\/-]+$/.test(path))
    return ("'" + path.replace(/'/g, "'\"'\"'") + "'").replace(/''/g, '')
  else return path
}

function escapePathWin(path: string) {
  if (!/^[A-Za-z0-9_\/-]+$/.test(path)) return '"' + path.replace(/"/g, '""') + '"'
  else return path
}

let escapePath: escapeFunction
const winCmd = /^win/.test(process.platform)
if (winCmd) {
  escapePath = escapePathWin
} else {
  escapePath = escapePathSh
}

export function shellEscape(stringOrArray: string | string[]) {
  const ret: string[] = []

  if (typeof stringOrArray == 'string') {
    return escapePath(stringOrArray)
  } else {
    stringOrArray.forEach(function (member) {
      ret.push(escapePath(member))
    })
    return ret.join(' ')
  }
}
