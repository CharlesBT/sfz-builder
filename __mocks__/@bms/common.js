/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import {
  // config, // mocked
  Debug,
  dotenvConfig,
  filer,
  httpLogger,
  jsUtils,
  logger,
  pkgRoot,
  readConfigFromFile,
  readConfigFromPackage,
  systemUtils,
  uuid,
} from '@bms/common'

const config = readConfigFromPackage(import.meta.url) // mock

export {
  config,
  Debug,
  dotenvConfig,
  filer,
  httpLogger,
  jsUtils,
  logger,
  pkgRoot,
  readConfigFromFile,
  readConfigFromPackage,
  systemUtils,
  uuid,
}
