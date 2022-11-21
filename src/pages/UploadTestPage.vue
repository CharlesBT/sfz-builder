<template>
  <v-card>
    <v-card-text class="pa-5">
      <h3 class="title text-h6">{{ currentPageTitle?.toUpperCase() }}</h3>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="pa-5">
      <WebkitDirectory />
      <IpcAudioFile />
      <h3 class="title text-h6 mb-5">DropZone</h3>
      <DropZone />
      <v-btn color="primary" class="mt-5 mr-2">{{ t('dialog.submit') }}</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNavigation } from '@/composables/useNavigation'

import WebkitDirectory from '@/components/forms/inputfile/WebkitDirectory.vue'
import IpcAudioFile from '@/components/forms/inputfile/IpcAudioFile.vue'
import DropZone from '@/components/forms/inputfile/DropZone.vue'

const { t } = useI18n()
const { currentPageTitle } = useNavigation()
</script>
