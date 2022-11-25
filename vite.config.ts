/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */

import fs from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import electron from 'vite-electron-plugin'
import { alias, copy, customStart, loadViteEnv } from 'vite-electron-plugin/plugin'
// import renderer from 'vite-plugin-electron-renderer'
// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vite-plugin
import vuetify from 'vite-plugin-vuetify'

fs.rmSync('dist-electron', { recursive: true, force: true })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
    VueI18nPlugin({
      defaultSFCLang: 'yml',
      compositionOnly: true,
      runtimeOnly: true, // Whether or not to automatically use Vue I18n runtime-only in production build
      include: resolve(dirname(fileURLToPath(import.meta.url)), './src/locales/**'), // locale messages resource pre-compile option
    }),
    electron({
      include: ['electron'], // The Electron source codes directory
      transformOptions: {
        sourcemap: !!process.env.VSCODE_DEBUG,
      },
      plugins: [
        /*
        alias([
          // `replacement` is recommented to use absolute path,
          // it will be automatically calculated as relative path.
          { find: '@electron', replacement: fileURLToPath(new URL('./electron', import.meta.url)) },
        ]),
        */
        copy([{ from: 'electron/**/*.json', to: 'dist-electron' }]),
        ...(process.env.VSCODE_DEBUG
          ? [
              // Will start Electron via VSCode Debug
              customStart(
                debounce(() =>
                  console.log(/* For `.vscode/.debug.script.mjs` */ '[startup] Electron App'),
                ),
              ),
            ]
          : []),
        // Allow use `import.meta.env.VITE_SOME_KEY` in Electron-Main
        loadViteEnv(),
      ],
    }),
    // Use Node.js API in the Renderer-process
    // renderer({
    //   nodeIntegration: true,
    // }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    sourcemap: true,
  },

  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: { charset: false },
      css: { charset: false },
    },
  },

  server: process.env.VSCODE_DEBUG
    ? {
        host: process.env.VITE_DEV_SERVER_HOST
          ? String(process.env.VITE_DEV_SERVER_HOST)
          : undefined,
        port: process.env.VITE_DEV_SERVER_PORT
          ? Number(process.env.VITE_DEV_SERVER_PORT)
          : undefined,
      }
    : undefined,
})

function debounce<Fn extends (...args: any[]) => void>(fn: Fn, delay = 299) {
  let t: NodeJS.Timeout
  return ((...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }) as Fn
}
