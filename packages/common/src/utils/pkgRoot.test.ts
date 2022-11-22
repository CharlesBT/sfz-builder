/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
import { describe, expect, it } from 'vitest'
import path from 'node:path'
import { pkgRoot } from './pkgRoot.js'
import { fileURLToPath } from 'node:url'

describe.concurrent('pkgRoot', () => {
  it('pkgRoot(import.meta.url): should return "utils" folder ', () => {
    const expected = path.parse(path.parse(fileURLToPath(import.meta.url)).dir).base
    let actual = pkgRoot(import.meta.url)
    if (typeof actual !== 'undefined') {
      actual = path.parse(actual).base
    }
    expect(actual).toBe(expected)
  })

  it('pkgRoot(): should return package root folder ', () => {
    let expected = path.parse(fileURLToPath(import.meta.url)).dir
    expected = path.normalize(expected + '/../..')
    const actual = pkgRoot()
    expect(actual).toBe(expected)
  })
})
