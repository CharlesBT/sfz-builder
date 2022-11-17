/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
import { createI18n } from 'vue-i18n'

const locales = '../locales'
const messages = Object.fromEntries(
  Object.entries(import.meta.glob<{ default: any }>('../locales/*.y(a)?ml', { eager: true })).map(
    ([key, value]) => {
      const yaml = key.endsWith('.yaml')
      return [key.slice(locales.length + 1, yaml ? -5 : -4), value.default]
    },
  ),
)

const i18n = createI18n({
  legacy: false,
  locale: navigator.language.slice(0, 2) || 'en',
  fallbackLocale: 'en',
  messages: messages,
})

export default i18n
