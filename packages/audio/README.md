## Description

Package containing toolset to automate creation of multisampled SFZ instruments.

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

Default setting for encoding, instruments templates and SFZ default values are defined in `./config/module.config.jsonc`

## sfzBuilder_FLStudio

usage :

```js
const OPTIONS = {
  process: {
    lowercase_extension: true,
    jsoninfo: true,
    convert_samplerate: true,
    convert_bitdepth: true,
    volume: 12,
    trim: true,
    fadeout: true,
  },
  patch: {
    type: 'piano', // drumkit | instrument | piano | key | bass | guitar | pad | string | brass
    multi_velocity_layer: true,
    // default_path: './samples/',
    // volume: 0,
    // polyphony: 32,
    // loop_mode: 'no_loop'', // no_loop (default) | one_shot | loop_continuous | loop_sustain
    // amp_veltrack: 0, // 100 | 75 | 50 | 0
    // bend_up: 200,
    // bend_down: -200,
    // ampeg_attack: 0,
    // ampeg_decay: 0,
    // ampeg_sustain: 100,
    // ampeg_release: 1.0 // 0.5 | 1.0 | 1.2 | 1.5}
  },
}

await sfzBuilder_FLStudio.process(FLSTUDIO_DIR, OPTIONS)
```

regex to extract patch name from WAV files :

processing steps :

`/(.*)_([A-G]#?\d)_([0-9]{1,3}).wav/g`

## sfzBuilder_SampleRobot

regex to extract patch name from WAV files :

`/(.*)-[0-9]{3}-[0-9]{3}-[a-h]#?\d.wav/g`

## sfzBuilder_AudioLayer

regex to extract patch name from WAV files :

`/(.*)_([A-G]#?-?\d)_([0-9]{1,3}).wav/g`

## sfzBuilder_Logic

## Folder structure

```
    PACKAGE
    ├── .temp // folder dedicated to temporary storage
    ├── .vscode // VSCode project settings
    │   ├── extensions.json // recommended VSCode extension for this project
    │   ├── launch.json // debugger config
    │   ├── settings.json // VSCode project settings
    │   └── tasks.json // VSCode tasks
    ├── config
    │   └── module.config.json5 // module configuration file
    ├── docs // directory to store all documentation
    ├── src // source code
    │   ├── audio
    │   ├── config
    │   ├── filer
    │   ├── sfz
    │   ├── types
    │   └── utils
    └── test // assets used for running tests
```
