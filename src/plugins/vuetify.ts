/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import '@mdi/font/css/materialdesignicons.css'

import type { ThemeDefinition } from 'vuetify'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import colors from 'vuetify/lib/util/colors'

const Lighttheme: ThemeDefinition = {
  dark: false,
  variables: {},
  colors: {
    primary: '#673ab7',
    secondary: '#ff9800',
    accent: '#2196f3',
    error: '#f44336',
    warning: '#607d8b',
    info: '#795548',
    success: '#4caf50',
    back: '#f4f6f9',
  },
}

const Darktheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#1879cd',
    info: '#03c9d7',
    success: '#05b187',
    accent: '#fc4b6c',
    warning: '#fec90f',
    error: '#fc4b6c',
    secondary: '#0cb9c5',
    back: '#243042',
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    themes: {
      light: Lighttheme,
      dark: Darktheme,
    },
    // variations: {
    //   colors: ['primary', 'secondary'],
    //   lighten: 5,
    //   darken: 5,
    // },
  },
  defaults: {
    VBtn: {
      color: 'primary',
      rounded: 'md',
      flat: true,
      fontWeight: '400',
      letterSpacing: '0',
      elevation: 4,
    },
    // VCard: {
    //   flat: true,
    //   elevation: 0,
    // },
  },
})
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
