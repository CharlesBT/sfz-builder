/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'

import vitetestBaseConfig from '../../vitest.config'

export default mergeConfig(
  vitetestBaseConfig,
  defineConfig({
    test: {},
  }),
)
