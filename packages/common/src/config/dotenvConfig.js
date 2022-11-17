/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

export class dotenvConfig {
  // dotenv enums
  static ENV_DEVELOPMENT = 'development'
  static ENV_TEST = 'test'
  static ENV_PRODUCTION = 'production'

  static getEnv() {
    return process.env.NODE_ENV
  }

  static isDevelopment() {
    return process.env.NODE_ENV === dotenvConfig.ENV_DEVELOPMENT ? true : false
  }

  static isTest() {
    return process.env.NODE_ENV === dotenvConfig.ENV_TEST ? true : false
  }

  static isProduction() {
    return process.env.NODE_ENV === dotenvConfig.ENV_PRODUCTION ? true : false
  }

  static setDevelopment() {
    process.env.NODE_ENV = dotenvConfig.ENV_DEVELOPMENT
  }

  static setTest() {
    process.env.NODE_ENV = dotenvConfig.ENV_TEST
  }

  static setProduction() {
    process.env.NODE_ENV = dotenvConfig.ENV_PRODUCTION
  }
}
