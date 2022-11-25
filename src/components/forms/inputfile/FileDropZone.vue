<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { useDropzone } from 'vue3-dropzone'
import type { FileUploadOptions, FileRejectReason } from 'vue3-dropzone'
const { t } = useI18n()
const theme = useTheme()

interface VState {
  files: File[]
  isErrorMsgDisplayed: boolean
  errorMsg: string
}

const vstate: VState = reactive({
  files: [],
  isErrorMsgDisplayed: false,
  errorMsg: '',
})

const emit = defineEmits(['files-dropped'])

const options: Partial<FileUploadOptions> = {
  multiple: true,
  maxSize: 500000000, // 500 Mb
  minSize: 1,
  accept: '.wav',
  onDrop: onDrop,
}

const { getRootProps, getInputProps, isDragActive } = useDropzone(options)

function onDrop(acceptedFiles: File[], rejectedReason: FileRejectReason[]) {
  console.log('onDrop:')
  reset()
  if (hasSubfolder(acceptedFiles)) {
    displayError('dropzone.errors.subfolders-not-allowed')
    return
  }
  if (!isSingleFolder(acceptedFiles)) {
    displayError('dropzone.errors.single-folder-only')
    return
  }
  if (!isWavFormat(acceptedFiles)) {
    displayError('dropzone.errors.wave-files-only')
    return
  }

  if (rejectedReason.length > 0) {
    const error = rejectedReason[0].errors[0]
    if (typeof error === 'object') {
      if (error?.code === 'file-invalid-type') {
        displayError('dropzone.errors.wave-files-only')
      } else {
        vstate.isErrorMsgDisplayed = true
        vstate.errorMsg = error?.message as string
      }
    }
    return
  }
  if (acceptedFiles.length > 0) {
    vstate.files = acceptedFiles
    emit('files-dropped', vstate.files)
  }
}

// reset vstate
function reset() {
  vstate.files = []
  vstate.isErrorMsgDisplayed = false
  vstate.errorMsg = ''
}

// display error message
function displayError(msg: string) {
  vstate.isErrorMsgDisplayed = true
  vstate.errorMsg = t(msg)
}

// validators
function hasSubfolder(files: File[]) {
  const clone: { name: string; path: string }[] = []
  for (const file of files) {
    clone.push({ name: file.name, path: file.path.replaceAll('\\', '/') })
  }
  clone.forEach((elt) => {
    elt.path = elt.path.substring(0, elt.path.indexOf(elt.name))
  })
  const hasSubfolder = !clone.every((elt) => elt.path.length === clone[0].path.length)
  return hasSubfolder
}

function isSingleFolder(files: File[]) {
  const clone: { name: string; path: string }[] = []
  for (const file of files) {
    clone.push({ name: file.name, path: file.path.replaceAll('\\', '/') })
  }
  clone.forEach((elt) => {
    elt.path = elt.path.substring(0, elt.path.indexOf(elt.name))
  })
  const isSingleFolder = clone.every((elt) => elt.path === clone[0].path)
  return isSingleFolder
}

function isWavFormat(files: File[]) {
  const isWavFile = files.every((elt) => {
    const fileExt = elt.name.split('.').pop()
    return fileExt?.toLocaleLowerCase() === 'wav' ? true : false
  })
  return isWavFile
}
</script>

<template>
  <div
    id="dropzone"
    v-bind="getRootProps()"
    class="dropzone"
    :class="{
      'active-dropzone': isDragActive,
      'disable-dropzone-click': vstate.isErrorMsgDisplayed,
    }"
  >
    <v-alert
      v-if="vstate.isErrorMsgDisplayed"
      @click.stop="reset"
      type="error"
      prominent
      variant="text"
      closable
      elevation="4"
      class="alert-box"
    >
      {{ vstate.errorMsg }}
    </v-alert>
    <input type="file" v-bind="getInputProps()" webkitdirectory />
    <v-icon icon="mdi-folder-arrow-left" size="50" />
    <p>{{ t('dropzone.drag-drop-here') }}</p>
    <p v-if="vstate.files.length > 0">
      <span class="file-info">{{ t('dialog.file(s)') }}: {{ vstate.files.length }}</span>
      <span
        ><v-icon
          @click.stop="reset"
          icon="mdi-close-circle"
          :title="t('dropzone.remove')"
          size="24"
          color="red"
          class="ml-1"
      /></span>
    </p>
  </div>
</template>

<style scoped>
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px 10px;
  padding: 10px;
  row-gap: 16px;
  border: 2px dashed #aaa;
  border-radius: 15px;
  transition: 0.3s ease all;
  cursor: pointer;
}

.file-info {
  vertical-align: middle;
}

.alert-box {
  z-index: 2;
  position: absolute;
  background-color: rgb(var(--v-theme-alert-back));
  pointer-events: auto;
}

.active-dropzone {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.5);
}

.disable-dropzone-click {
  pointer-events: none;
}
</style>
