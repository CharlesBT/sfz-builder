/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { describe, expect, it } from 'vitest'

import { jsUtils } from './jsUtils.js'

describe.concurrent('jsUtils', () => {
  it('upperCaseFirstLetter(string)', () => {
    expect(jsUtils.upperCaseFirstLetter('hello world')).toEqual('Hello World')
  })

  it('splitArrayBySize(array, size)', () => {
    const array = ['Jan', 'March', 'April', 'June']
    const actual = jsUtils.splitArrayBySize(array, 3)
    const expected = [['Jan', 'March', 'April'], ['June']]
    expect(actual).toEqual(expected)
  })

  it('findClosestValueInArray(array, value)', () => {
    const array = [4, 9, 15, 6, 2]
    const actual = jsUtils.findClosestValueInArray(array, 1)
    expect(actual).toEqual(2)
  })

  it('sleep(ms)', async () => {
    await jsUtils.sleep(1)
    expect(true).toBe(true)
  })
})
