# 🎹 SFZ-BUILDER Project 🎶

## Description

SFZ-Builder is a toolset to automate creation of multisampled SFZ instruments.

support SFZ instrument creation from the following DAWs / Apps :

- FLStudio
- SampleRobot
- BLISS
- AudioLayer

features :

- multi velocity layer
- automatic volume adjustment to scale overall instrument volume level, dynamic is preserved (no compression used)
- templates for several types of instruments (drumkits, bass, strings, pads ...)
- support of WAV, FLAC, OGG encodings
- sample loop point support
- headroom preservation
- wav properties extracted to json files by ffprobe
- all wave file processing is managed by ffmpeg

- wav processes :
  - filename sanitization to be compliant on all operating systems
  - json info file generation
  - encoding samples to 24Bits / 48kHz
  - trim
  - fadeout
  - volume

## Configuration

## Folder structure

```
PROJECT
├── _DEV // development todos, fixes, resources and archives
├── .temp // folder dedicated to temporary storage
├── .vscode // VSCode project settings
│   ├── extensions.json // recommended VSCode extension for this project
│   ├── launch.json // debugger config
│   ├── settings.json // VSCode project settings
│   └── tasks.json // VSCode tasks
├── __mocks__ // mocks for test mocks
├── config
│   └── app.config.json5 // application configuration file
├── doc // directory to store all documentation
├── logs // log file storage
├── packages // custom dependencies symlinked to /node_modules
├── src // source code
│   ├── modules
│   ├── services
│   └── utils
└── test // assets used for running tests
```

## The built directory structure

```
├─┬ dist-electron
│ ├─┬ main
│ │ └── index.js > Electron-Main
│ └─┬ preload
│ └── index.js > Preload-Scripts
├─┬ dist
│ └── index.html > Electron-Renderer
```

---

## electron-vite-vue template

<https://github.com/electron-vite/electron-vite-vue>

---

## Publishing new releases

1. Turn off devTools to false in electron/config.json for security
2. Update package.json version
3. Commit & Push to GitHub on master branch
4. GitHub Actions pipeline is launched "on push" and handles all the steps :
   1. build
   2. sign & notarize
   3. create packages : MacOS (DMG, PKG, ZIP), Windows (NSIS/EXE), Linux (AppImage, Snap)
   4. publishing on SnapCraft (Linux) <https://snapcraft.io/sfz-builder/releases>
5. Upload to Apple App Store must be done manually via App Store Connect <https://appstoreconnect.apple.com/apps>

---

## Troubleshooting using logs

Location of application logs created by electron-log :

- on Linux: ~/.config/{app name}/logs/{process type}.log
- on macOS: ~/Library/Logs/{app name}/{process type}.log
- on Windows: %USERPROFILE%\AppData\Roaming\{app name}\logs\{process type}.log

---

## Electron Auto Updater

- Electron Auto Updater is supported on Windows (EXE), Macos (DMG), Ubuntu (AppImage, Snap).
- See application logs for me details

---

## electron-vite plugins

<https://github.com/electron-vite/vite-electron-plugin/issues/17>

### vite-electron-plugin design principle is consistent with tsc! i.e. input as many files as you want and output as many files as you want

1. Convert with esbuild
2. Supports plugins, refer to Vite's plugin design, 4 hooks in total
3. The tsc-like behavior means no-bundling, which is very important and consistent with Vite's no-bundling philosophy, therefore it's very fast

### vite-plugin-electron uses Vite to build all code, main process, Preload-Scripts

It can be understood as being no different from the Webpack solution

### vite-plugin-electron-renderer provides two features

1. It allows the usage of Node.js and its APIs in the rendering process
2. It modifies some of the default Vite configuration to be compatible with Electron

---

## Known issues

### Ubuntu snap GitHub build fails

- Ubuntu snap GitHub build fails when using `"name": "@/bms/sfz-builder"` in package.json, it seems that npm workspace is not supported, use instead `"name": "sfz-builder"`

### Build fails with style written in SCSS and compiled with SASS

- workaround SASS removed and style stick to standard CSS
