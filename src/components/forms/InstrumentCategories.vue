<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import _ from 'lodash'
import { getAssetUrl } from '@/composables/getAssetUrl'
import categories from '@/data/cat_categories.json'

const { t } = useI18n()

function getCategoryIcon2(category: string | undefined) {
  if (category) return getAssetUrl(`instrument-categories/${category.toLowerCase()}.png`) as string
  else return ''
}

_.sortBy(categories, ['name'])
const iCategories = [{ name: `- ${t('dialog.default')} -`, id: '', icon: '' }]
categories.forEach((e) => {
  iCategories.push({
    name: e.name,
    id: e._id.$oid,
    icon: getCategoryIcon2(e.name),
  })
})

const select = ref(null)
</script>

<template>
  <v-select
    v-model="select"
    :items="iCategories"
    item-title="name"
    item-value="value"
    :label="t('dialog.select')"
    single-line
    hide-details
    background-color="transparent"
  >
    <template #selection="{ item }">
      <img
        v-if="item.raw.icon !== ''"
        :src="item.raw.icon"
        height="22"
        style="padding-right: 20px; vertical-align: middle"
      />
      <span class="font-weight-medium text-subtitle-1">{{ item.title }}</span>
    </template>
    <template #item="{ item, props }">
      <v-list-item v-bind="props">
        <template #title>
          <img
            v-if="item.raw.icon !== ''"
            :src="item.raw.icon"
            height="22"
            style="padding-right: 20px; vertical-align: middle"
          />
          <span class="font-weight-medium text-subtitle-2">{{ item.title }}</span>
        </template>
      </v-list-item>
    </template>
  </v-select>
</template>
