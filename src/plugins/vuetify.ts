import '@mdi/font/css/materialdesignicons.css'
import { createVuetify, type ThemeDefinition } from 'vuetify'
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
    back: '#f2f2f2',
    'alert-back': '#f2f2f2',
  },
}

const Darktheme: ThemeDefinition = {
  dark: true,
  colors: {
    primary: '#673ab7',
    secondary: '#ff9800',
    info: '#03c9d7',
    success: '#05b187',
    accent: '#fc4b6c',
    warning: '#fec90f',
    error: '#fc4b6c',
    back: '#0d0d0d',
    'alert-back': '#f2f2f2',
  },
}

export const vuetify = createVuetify({
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
