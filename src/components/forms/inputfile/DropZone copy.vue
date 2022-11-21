<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { fromEvent } from 'file-selector'
const { t } = useI18n()
const theme = useTheme()

const props = defineProps<{
  files: File[]
}>()

const filesCount = ref<number>(0)
const emit = defineEmits(['files-dropped'])

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
const zoneActive = ref<boolean>(false)
const toggleZoneActive = () => {
  zoneActive.value = !zoneActive.value
}

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

async function onDropItem(e: DragEvent) {
  console.log(e.dataTransfer?.files)
  debugger
  const items = e.dataTransfer?.items as DataTransferItemList
  // debugger
  if (await isValidatedDroppedItems(items)) {
    // debugger
    const files = await getDroppedFilesAsync(items)
    console.log(files)
    filesCount.value = files.length
  }
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
  const dropZone = document.getElementById('dropZone') as HTMLElement
  dropZone.addEventListener('drop', async function (e) {
    e.preventDefault()
    // const files = await fromEvent(e)
    // console.log(files)

    // const items = { ...(e.dataTransfer?.items as DataTransferItemList) } as DataTransferItemList
    // const items = structuredClone(e.dataTransfer?.items as DataTransferItemList)
    // debugger
    const items = e.dataTransfer?.items as DataTransferItemList
    // if (await isValidatedDroppedItems(items)) {
    const files = await getDroppedFilesAsync(items)
    console.log(files)
    //   filesCount.value = files.length
    // }
  })
})

// onUnmounted(() => {
//   const dropZone = document.getElementById('dropZone') as HTMLElement
//   dropZone.removeEventListener('drop', function (e) {
//     e.preventDefault()
//   })
// })

/*
    @drop.prevent="toggleZoneActive, onDropItem($event)"
*/
</script>

<template>
  <div
    id="dropZone"
    @dragenter.prevent="toggleZoneActive"
    @dragleave.prevent="toggleZoneActive"
    @dragover.prevent
    @drop.prevent="toggleZoneActive"
    @change="onSelectItem"
    :class="{ 'active-dropzone': zoneActive }"
    class="dropzone"
  >
    <v-icon icon="mdi-folder-arrow-left" size="50" />

    <span>{{ t('dropzone.drag-drop-folder') }}</span>
    <span>{{ t('generic.or') }}</span>
    <v-label for="itemPicker" clickable>{{ t('dropzone.select-folder') }}</v-label>
    <input type="file" id="itemPicker" webkitdirectory />
    <span v-if="filesCount > 0">
      <span class="file-info">{{ t('dialog.file(s)') }}: {{ filesCount }}</span>
      <span><v-icon icon="mdi-close-circle" /></span
    ></span>
  </div>
  <v-alert v-if="isErrorMsgDisplayed" type="error" closable elevation="4">{{ errorMsg }}</v-alert>
</template>

<style scoped lang="scss">
.dropzone {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
</style>
