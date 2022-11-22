/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { packageDirectorySync } from 'pkg-dir'

function pkgRoot(import_meta_url?: string): string | undefined {
  let __pkgRoot: string | undefined
  if (typeof import_meta_url === 'string') {
    const __filename = fileURLToPath(import_meta_url)
    const __dirname = dirname(__filename)
    __pkgRoot = packageDirectorySync({ cwd: __dirname })
  } else {
    __pkgRoot = packageDirectorySync()
  }
  return __pkgRoot
}

export { pkgRoot }
