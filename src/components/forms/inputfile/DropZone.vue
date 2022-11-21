<script setup lang="ts">
// TODO : rename component to FileUploadDropZone
import { ref, reactive, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
// FIX : vue3-dropzone v2.0.1 with missing InputFile export fix https://github.com/Yaxian/vue3-dropzone/issues/18
import { useDropzone } from '@bms/vue3-dropzone-fixed'
import type { FileUploadOptions, InputFile, FileRejectReason } from '@bms/vue3-dropzone-fixed'
const { t } = useI18n()
const theme = useTheme()

const filesRef = ref<File[]>([])

interface State {
  files: File[]
}

const state: State = reactive({
  files: [],
})

const options: Partial<FileUploadOptions> = {
  multiple: true,
  // onDrop: onDrop,
  onDropAccepted: onDropAccepted,
  onDropRejected: onDropRejected,
  accept: '.wav',
}

const { getRootProps, getInputProps, isDragActive } = useDropzone(options)

// function onDrop(acceptedFiles: File[], rejectReasons: FileRejectReason[]) {
//   console.log('acceptedFiles', acceptedFiles)
//   console.log('rejectReasons', rejectReasons)
//   filesRef.value = acceptedFiles
// }

function onDropAccepted(acceptedFiles: InputFile[]) {
  filesRef.value = acceptedFiles as File[]
  state.files = acceptedFiles as File[]
  console.log('acceptedFiles', acceptedFiles)
  // console.log('acceptedFiles:filesRef', filesRef.value)
  // console.log('acceptedFiles:state.files', state.files)
}

function onDropRejected(rejectReasons: FileRejectReason[]) {
  console.log('rejectReasons', rejectReasons)
}

watch(filesRef, () => {
  // console.log('filesRef', filesRef.value)
})

const props = defineProps<{
  files: File[]
}>()

// display error messgage
const isErrorMsgDisplayed = ref<boolean>(false)
const errorMsg = ref<string>('')
function displayError(msg: string) {
  isErrorMsgDisplayed.value = true
  errorMsg.value = t(msg)
}

// validation
function isValid(files: FileList) {
  if (files.length === 0) {
    isErrorMsgDisplayed.value = true
    errorMsg.value = t('dropzone.empty-folder')
    return false
  }
  return true
}

// Select items
const onSelectItem = () => {
  const input = document.getElementById('itemPicker') as HTMLInputElement
  const files = input.files as FileList
  if (isValid(files)) {
    const { path } = files[0]
  }
}

// Drag & Drop items

async function isValidatedDroppedItems(DataTransferItems: DataTransferItemList) {
  if (DataTransferItems.length > 1) {
    // dragging several elements
    for (const item of DataTransferItems) {
      if (item.kind === 'file') {
        if (typeof item.webkitGetAsEntry === 'function') {
          const entry = item.webkitGetAsEntry() as FileSystemEntry
          if (!(entry.isFile && item.type === 'audio/wav')) {
            displayError('dropzone.errors.subfolders-not-allowed')
            return false
          }
        }
      }
    }
  } else {
    // dragging 1 elements: raise error if not a directory
    const item = DataTransferItems[0]
    if (item.kind === 'file') {
      if (typeof item.webkitGetAsEntry === 'function') {
        const entry = item.webkitGetAsEntry() as FileSystemEntry
        if (!entry.isDirectory) {
          displayError('dropzone.errors.single-folder-only')
          return false
        } else {
          const reader = (entry as FileSystemDirectoryEntry).createReader()
          const entries = await readEntriesAsync(reader)

          // report error if subfolder is found
          for (const entry of entries) {
            if (!entry.isFile) {
              displayError('dropzone.errors.subfolders-not-allowed')
              return false
            }
          }

          // report error if a file is not audio/wav
          const filePromises: Promise<File>[] = []
          for (const entry of entries) {
            filePromises.push(getFileAsync(entry as FileSystemFileEntry))
          }
          const files = await Promise.all(filePromises)
          if (!files.every((file) => file.type === 'audio/wav')) {
            displayError('dropzone.errors.wave-files-only')
            return false
          }
          // const subEntries = await readEntriesAsync(reader)

          // reader.readEntries((entries) => {
          //   entries.forEach(async (entry) => {
          //     // look for sub directories an raise error if exists
          //     if (!entry.isFile) {
          //       displayError('dropzone.errors.subfolders-not-allowed')
          //       return false
          //     } else {
          //       const file = await getFileAsync(entry as FileSystemFileEntry)
          //       if (file.type !== 'audio/wav') {
          //         displayError('dropzone.errors.wave-files-only')
          //         return false
          //       }
          //     }
          //   })
          // })
        }
      }
    }
  }
  return true
}

async function getDroppedFilesAsync(DataTransferItems: DataTransferItemList) {
  const files: File[] = []
  const filePromises: Promise<File>[] = [] // array of promises to resolve with Promise.all()
  const directoryPromises: Promise<File[]>[] = [] // array of promises to resolve with Promise.all()
  for (const item of DataTransferItems) {
    if (item.kind === 'file') {
      if (typeof item.webkitGetAsEntry === 'function') {
        const entry = item.webkitGetAsEntry() as FileSystemEntry
        if (entry.isDirectory) {
          directoryPromises.push(readDirectoryEntryAsync(entry))
        }
        if (entry.isFile) {
          filePromises.push(getFileAsync(entry as FileSystemFileEntry))
        }
      }
    }
  }
  // push directory content
  const directories = await Promise.all(directoryPromises)
  directories.forEach((item) => files.push(...item))
  // push files
  files.push(...(await Promise.all(filePromises)))
  return files
}

// Returns a promise with all the files of the directory hierarchy
async function readDirectoryEntryAsync(entry: FileSystemEntry) {
  const files: File[] = []
  if (entry.isFile) {
    const file = await getFileAsync(entry as FileSystemFileEntry)
    files.push(file)
  } else if (entry.isDirectory) {
    const DirectoryEntry = entry as FileSystemDirectoryEntry
    const entries = await readEntriesAsync(DirectoryEntry.createReader())
    const directoryPromises: Promise<File[]>[] = [] // array of promises to resolve with Promise.all()
    for (const entry of entries) {
      directoryPromises.push(readDirectoryEntryAsync(entry))
    }
    const directories = await Promise.all(directoryPromises)
    directories.forEach((item) => files.push(...item))
  }
  return files
}

// Returns a promise with all directory entries
function readEntriesAsync(DirectoryReader: FileSystemDirectoryReader): Promise<FileSystemEntry[]> {
  return new Promise((resolve, reject) => {
    DirectoryReader.readEntries(resolve, reject)
  })
}

// Returns a promise with file entry
function getFileAsync(FileEntry: FileSystemFileEntry): Promise<File> {
  return new Promise((resolve, reject) => {
    FileEntry.file(resolve, reject)
  })
}

onMounted(() => {
  const dropzone = document.getElementById('dropzone')
  dropzone?.addEventListener('drop', async (e: DragEvent) => {
    e.preventDefault()
    const items = e.dataTransfer?.items as DataTransferItemList
    if (await isValidatedDroppedItems(items)) {
      console.log('files are valid')
      const files = await getDroppedFilesAsync(items)
      console.log(files)
    }
  })
})
</script>

<template>
  <div
    id="dropzone"
    v-bind="getRootProps()"
    class="dropzone"
    :class="{ 'active-dropzone': isDragActive }"
  >
    <input v-bind="getInputProps()" />
    <v-icon icon="mdi-folder-arrow-left" size="50" />
    <p>{{ t('dropzone.drag-drop-here') }}</p>
    <p v-if="filesRef.length > 0">
      <span class="file-info">{{ t('dialog.file(s)') }}: {{ filesRef.length }}</span>
      <span><v-icon icon="mdi-close-circle" /></span>
    </p>
  </div>
  <v-alert v-if="isErrorMsgDisplayed" type="error" closable elevation="4">{{ errorMsg }}</v-alert>
  <!-- <div
    id="dropZone"
    @dragenter.prevent="toggleZoneActive"
    @dragleave.prevent="toggleZoneActive"
    @dragover.prevent
    @drop.prevent="toggleZoneActive, onDropItem($event)"
    @change="onSelectItem"
    :class="{ 'active-dropzone': zoneActive }"
    class="dropzone"
  >
    <input type="file" id="itemPicker" webkitdirectory />
  </div>
--></template>

<style scoped lang="scss">
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

  .file-info {
    vertical-align: middle;
  }
}

.active-dropzone {
  border-color: rgb(var(--v-theme-primary));
  background-color: rgba(var(--v-theme-primary), 0.5);
}

/*
.dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 20px;
  row-gap: 16px;
  border: 3px dashed rgba(var(--v-theme-primary), 0.5);
  border-radius: 20px;
  transition: 0.3s ease all;

  label {
    padding: 8px 12px;
    border-radius: 4px;
    background-color: rgba(var(--v-theme-primary), 0.3);
  }

  #itemPicker {
    display: none;
  }

  .file-info {
    vertical-align: middle;
  }
}

.active-dropzone {
  // color: #fff;
  // border: solid;
  border-color: rgba(var(--v-theme-back), 0.5);
  background-color: rgba(var(--v-theme-primary), 0.5);

  label {
    // background-color: rgba(var(--v-theme-primary), 0.5);
    // color: v-bind('theme.current.value.colors.primary');
  }
}
*/
</style>
