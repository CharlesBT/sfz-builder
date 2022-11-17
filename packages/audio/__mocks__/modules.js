/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { vi } from 'vitest'

vi.mock('@bms/common', async () => {
  const mod = await vi.importActual('@bms/common')
  return {
    ...mod,
    config: mod.readConfigFromPackage(import.meta.url),
  }
})
