<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

const { t } = useI18n()
const theme = useTheme()

const dropZoneItem = ref('')
const active = ref(false)

const toggleActive = () => {
  active.value = !active.value
}

function onDropItem(e) {
  dropZoneItem.value = e.dataTransfer.files[0]
}

const onSelectItem = () => {
  dropZoneItem.value = document.querySelector('.dropZoneItem').files[0]
}

onMounted(() => {
  const c = theme.current.value.colors.primary
  console.log(c)
})

// console.log((theme.current.colors as Colors).primary)
</script>

<template>
  <div
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive(), onDropItem($event)"
    @change="onSelectItem"
    :class="{ 'active-dropzone': active }"
    class="dropzone"
  >
    <v-icon icon="mdi-folder-arrow-left" size="50" />

    <span>{{ t('dropzone.drag-drop-folder') }}</span>
    <span>{{ t('generic.or') }}</span>
    <v-label for="dropZoneItem" clickable>{{ t('dropzone.select-folder') }}</v-label>
    <input type="file" id="dropZoneItem" class="dropZoneItem" />
    <span>
      <span class="file-info">{{ t('dialog.file(s)') }}: {{ dropZoneItem.name }}</span>
      <span><v-icon icon="mdi-close-circle" /></span
    ></span>
  </div>
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

  input {
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
