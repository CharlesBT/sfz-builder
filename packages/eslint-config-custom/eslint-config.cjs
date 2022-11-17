/* Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  // parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    // extraFileExtensions: ['.vue'],
  },

  env: {
    browser: true,
    node: true,
    es6: true,
    es2022: true,
    // 'cypress/globals': true,
  },

  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:promise/recommended',
    'plugin:eslint-comments/recommended',
    // "plugin:jsdoc/recommended",
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:prettier/recommended', // must be the last one
  ],

  ignorePatterns: [
    '*.min.*',
    '*.d.ts',
    'CHANGELOG.md',
    'dist',
    'LICENSE*',
    'output',
    'coverage',
    'public',
    'temp',
    'package-lock.json',
    'pnpm-lock.yaml',
    'yarn.lock',
    '__snapshots__',
    '!.github',
    '!.vitepress',
    '!.vscode',
  ],

  plugins: [
    'prettier',
    '@typescript-eslint',
    'header',
    'import',
    'promise',
    'eslint-comments',
    // "jsdoc",
    // 'cypress',
  ],

  rules: {
    /*
      "off" or 0 - turn the rule off
      "warn" or 1 - turn the rule on as a warning (doesn't affect exit code)
      "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
    */

    // prettier
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'lf',
      },
    ],

    // base
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'no-empty': ['error', { allowEmptyCatch: true }],

    // import
    'import/no-unresolved': 'error',
    // "import/default": "off",
    // 'import/no-named-as-default': 'off',
    // 'import/no-named-as-default-member': 'off',

    //promise
    'promise/catch-or-return': 'warn',
    'promise/always-return': 'warn',
    'require-await': 'warn',
    // "no-await-in-loop": "warn", // point for optimization with Promise.all https://eslint.org/docs/rules/no-await-in-loop

    // vue
    // 'vue/require-default-prop': 'off',
    // 'vue/multi-word-component-names': 'off',

    // header
    'header/header': [
      2,
      'block',
      [
        ' Copyright (c) BMS Corp. All rights reserved. Licensed under the MIT License. See License.txt in the project root for license information. ',
      ],
    ],
  },

  overrides: [
    // enable the rule specifically for JavaScript files
    {
      files: ['*.js', '*.mjs', '*.cjs', '*.jsx'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'require-await': 'off',
      },
    },

    // enable the rule specifically for TypeScript files
    {
      files: ['*.ts', '*.mts', '*.cts', '*.tsx'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        // '@typescript-eslint/no-explicit-any': 'off',
        // '@typescript-eslint/explicit-module-boundary-types': 'error',
      },
    },

    // enable the rule specifically for Vue files
    {
      files: '*.vue',
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.vue'],
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true,
        },
      },
      extends: [
        'plugin:vue/vue3-essential',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier',
      ],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'no-undef': 'off',
        'header/header': 'off',
      },
    },

    // enable the rule specifically for Cypress files
    // {
    //   files: ['cypress/e2e/**.{cy,spec}.{js,ts,jsx,tsx}'],
    //   extends: ['plugin:cypress/recommended'],
    // },

    // enable the rule specifically for JSDoc
    // {
    //   files: ['*.{js,mjs,cjs,ts,mts,cts,tsx}'],
    //   extends: ['plugin:jsdoc/recommended'],
    //   rules: {
    //     "jsdoc/no-types": "off",
    //   },
    // },
  ],

  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.mts', '.tsx', '.d.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.mjs', '.jsx', '.ts', '.mts', '.tsx', '.d.ts'],
        moduleDirectory: ['src', 'node_modules'],
      },
      typescript: {},
      // typescript: {
      //   alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      //   project: ['tsconfig.json', 'apps/*/tsconfig.json', 'packages/*/tsconfig.json'], // use an array of glob patterns
      // },
    },
  },
}
