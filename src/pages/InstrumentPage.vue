<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'

import InstrumentCategories from '@/components/forms/InstrumentCategories.vue'

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

const select = ref(null)
const fName = ref(null)
const fArticulations = ref(null)
</script>

<template>
  <v-card class="mb-7">
    <v-card-text class="pa-5 border-bottom">
      <h3 class="text-h6">{{ t('instrument.title') }}</h3>
      <h6 class="text-subtitle-1 text-grey-darken-1">{{ t('instrument.subtitle') }}</h6>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="pa-5">
      <v-row>
        <v-col cols="12" sm="2" class="align-center d-flex">
          <label class="font-weight-medium text-subtitle-1">{{ t('instrument.name') }}</label>
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
        <v-col cols="12" sm="2" class="align-center d-flex">
          <label class="font-weight-medium text-subtitle-1">{{ t('instrument.category') }}</label>
        </v-col>
        <v-col cols="12" sm="10">
          <InstrumentCategories />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" sm="2" class="align-center d-flex">
          <label class="font-weight-medium text-subtitle-1">{{
            t('instrument.articulations')
          }}</label>
        </v-col>
        <v-col cols="12" sm="10">
          <v-item-group multiple selected-class="bg-purple">
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

      <v-row>
        <v-col cols="12" sm="2" class="align-center d-flex">
          <label class="font-weight-medium text-subtitle-1">{{ t('dialog.files') }}</label>
        </v-col>
        <v-col cols="12" sm="10">
          <v-file-input multiple show-size hide-details></v-file-input>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>

  <div class="text-h6">Select instrument samples or folder :</div>

  <div class="text-h6">Options :</div>
  <v-divider></v-divider>
  <div class="text-h6">Name :</div>
  <v-text-field></v-text-field>
  <div class="text-h6">Metadata :</div>

  <v-divider></v-divider>
  <br />
  <v-btn prepend-icon="mdi-content-save-cog-outline" color="primary"> BUILD SFZ </v-btn>
  &nbsp;
  <v-btn prepend-icon="mdi-upload" color="primary"> BUILD SFZ & UPLOAD </v-btn>
</template>
