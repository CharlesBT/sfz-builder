<template>
  <v-menu>
    <template #activator="{ props }">
      <v-card v-bind="props" flat>
        <v-icon>mdi-earth</v-icon>
        {{ locale.toLocaleUpperCase() }}
      </v-card>
    </template>
    <v-list>
      <v-list-item
        v-for="(item, index) in langs"
        :key="`Lang${index}`"
        :value="item.lang"
        @click="switchLocale(item.lang)"
      >
        <v-list-item-title class="ml-1">
          <i :class="['mr-2', 'em', item.class]"></i>{{ item.lang.toUpperCase() }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

const langs = [
  {
    lang: 'en',
    class: 'em-gb',
  },
  {
    lang: 'fr',
    class: 'em-fr',
  },
  // {
  //   lang: 'es',
  //   class: 'em-es',
  // },
  // {
  //   lang: 'de',
  //   class: 'em-de',
  // },
]

function switchLocale(lang: string) {
  locale.value = lang
}
</script>

<style scoped>
.v-list-item {
  min-width: 100px !important;
}

/*
  flags and styles from from https://emoji-css.afeld.me/emoji.css
*/

.em,
.em-svg {
  height: 1.5em;
  width: 1.5em;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  display: inline-block;
  vertical-align: middle;
}

.em-gb,
.em-uk,
.em-flag-gb {
  background-image: url(@/assets/flags/en.svg);
}

.em-fr,
.em-flag-fr {
  background-image: url(@/assets/flags/fr.svg);
}

.em-es,
.em-flag-es {
  background-image: url(@/assets/flags/es.svg);
}

.em-de,
.em-flag-de {
  background-image: url(@/assets/flags/de.svg);
}
</style>
