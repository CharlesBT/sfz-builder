/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import crypto from 'crypto'

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = []

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1))
}

const rnds8Pool = new Uint8Array(256) // # of random values to pre-allocate
let poolPtr = rnds8Pool.length

export class uuid {
  static validate(uuid) {
    const REGEX =
      /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
    return typeof uuid === 'string' && REGEX.test(uuid)
  }

  static unsafeStringify(arr, offset = 0) {
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    return (
      byteToHex[arr[offset + 0]] +
      byteToHex[arr[offset + 1]] +
      byteToHex[arr[offset + 2]] +
      byteToHex[arr[offset + 3]] +
      '-' +
      byteToHex[arr[offset + 4]] +
      byteToHex[arr[offset + 5]] +
      '-' +
      byteToHex[arr[offset + 6]] +
      byteToHex[arr[offset + 7]] +
      '-' +
      byteToHex[arr[offset + 8]] +
      byteToHex[arr[offset + 9]] +
      '-' +
      byteToHex[arr[offset + 10]] +
      byteToHex[arr[offset + 11]] +
      byteToHex[arr[offset + 12]] +
      byteToHex[arr[offset + 13]] +
      byteToHex[arr[offset + 14]] +
      byteToHex[arr[offset + 15]]
    ).toLowerCase()
  }

  static rng() {
    if (poolPtr > rnds8Pool.length - 16) {
      crypto.randomFillSync(rnds8Pool)
      poolPtr = 0
    }
    return rnds8Pool.slice(poolPtr, (poolPtr += 16))
  }

  static v4(options, buf, offset) {
    if (crypto.randomUUID && !buf && !options) {
      return crypto.randomUUID()
    }

    options = options || {}

    const rnds = options.random || (options.rng || uuid.rng)()

    // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = (rnds[6] & 0x0f) | 0x40
    rnds[8] = (rnds[8] & 0x3f) | 0x80

    // Copy bytes to buffer, if provided
    if (buf) {
      offset = offset || 0

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = rnds[i]
      }

      return buf
    }

    return uuid.unsafeStringify(rnds)
  }
}
