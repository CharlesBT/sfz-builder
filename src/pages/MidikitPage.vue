<template>
  <v-card>
    <v-card-text class="pa-5">
      <h3 class="title text-h6">{{ t('page.midikit.title')?.toUpperCase() }}</h3>
      <h6 class="text-subtitle-1 text-grey-darken-1">{{ t('page.midikit.subtitle') }}</h6>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="pa-5">
      <v-row>
        <v-col>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae minus vel quia impedit
          eveniet odit, perspiciatis, soluta saepe ad omnis totam eius quasi repudiandae
          voluptatibus velit aperiam qui veritatis nesciunt!
        </v-col>
      </v-row>
      <v-btn color="primary" class="mt-5 mr-2">{{ t('dialog.create') }}</v-btn>
      <v-btn color="black" class="mt-5 mr-2">{{ t('dialog.cancel') }}</v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useNavigation } from '@/composables/useNavigation'
const { t } = useI18n()
const { currentPageTitle } = useNavigation()
</script>
