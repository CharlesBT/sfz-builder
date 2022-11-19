<template>
  <v-card>
    <v-card-text class="pa-5">
      <h3 class="title text-h6">{{ t('page.instrument.title')?.toUpperCase() }}</h3>
      <h6 class="text-subtitle-1 text-grey-darken-1">{{ t('page.instrument.subtitle') }}</h6>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="pa-5">
      <v-row>
        <v-col cols="12" sm="2" class="d-flex">
          <label class="font-weight-medium text-subtitle-1">{{ t('dialog.import-from') }}</label>
        </v-col>
        <v-col cols="12" sm="10">
          <v-radio-group inline hide-details v-model="fSource">
            <v-radio label="FLStudio" value="flstudio"></v-radio>
            <v-radio label="Logic" value="logic"></v-radio>
            <v-radio label="AudioLayer" value="audiolayer"></v-radio>
            <v-radio label="SampleRobot" value="samplerobot"></v-radio>
          </v-radio-group>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="2" class="d-flex">
          <label class="font-weight-medium text-subtitle-1">{{ t('instrument.samples') }}</label>
        </v-col>
        <v-col cols="12" sm="10">
          <DropZone />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="2" class="d-flex">
          <label class="font-weight-medium text-subtitle-1">{{ t('generic.name') }}</label>
        </v-col>
        <v-col cols="12" sm="10">
          <v-text-field
            v-model="fName"
            hide-details
            background-color="transparent"
            filled
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="2" class="d-flex">
          <label class="font-weight-medium text-subtitle-1">{{ t('instrument.category') }}</label>
        </v-col>
        <v-col cols="12" sm="10">
          <InstrumentCategories />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="2" class="d-flex">
          <label class="font-weight-medium text-subtitle-1">{{
            t('instrument.articulations')
          }}</label>
        </v-col>
        <v-col cols="12" sm="10">
          <v-item-group multiple selected-class="bg-primary">
            <v-item
              v-for="e in _.sortBy(articulations, ['name'])"
              :key="e._id.$oid"
              v-slot="{ selectedClass, toggle }"
            >
              <v-chip :class="selectedClass" @click="toggle" size="small">
                {{ e.name }}
              </v-chip>
            </v-item>
          </v-item-group>
        </v-col>
      </v-row>

      <v-btn prepend-icon="mdi-content-save-cog-outline" color="primary" class="mt-5 mr-2">
        {{ t('dialog.build') }} SFZ
      </v-btn>
      <v-btn prepend-icon="mdi-cloud-upload " color="primary" class="mt-5 mr-2">
        {{ t('dialog.upload') }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'

import InstrumentCategories from '@/components/forms/InstrumentCategories.vue'
import DropZone from '@/components/forms/inputfile/DropZone.vue'

// JSON data
import articulations from '@/data/cat_articulations.json'
import attributes from '@/data/cat_attributes.json'
import formats from '@/data/cat_formats.json'
import styles from '@/data/cat_styles.json'
import timbres from '@/data/cat_timbres.json'
import tags from '@/data/cat_tags.json'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

const fSource = ref('flstudio')
const fName = ref(null)

const select = ref(null)

const fArticulations = ref(null)
</script>
