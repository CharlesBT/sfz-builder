/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { describe, expect, it } from 'vitest'

import { uuid } from './uuid.js'

describe('uuid', () => {
  it('uuid.v4() and uuid.validate(uuid): should generate UUDI v4 and validate it', () => {
    const _uuid = uuid.v4()
    const actual = uuid.validate(_uuid)
    expect(actual).toEqual(true)
  })
})
