<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import pkg from '../package.json'

import LocaleChanger from '@/components/LocaleChanger.vue'

const route = useRoute()
const router = useRouter()
const { t, availableLocales, locale } = useI18n()

const items = computed(() => [
  { title: t('menu.home'), icon: 'mdi-home', to: '/' },
  { title: t('menu.drumkit'), icon: 'mdi-apps', to: '/drumkit' },
  { title: t('menu.instrument'), icon: 'mdi-piano', to: '/instrument' },
  { title: t('menu.loops'), icon: 'mdi-autorenew', to: '/loops' },
  { title: t('menu.help'), icon: 'mdi-help-box', to: '/help' },
  { title: t('menu.about'), icon: 'mdi-information', to: '/about' },
  { title: t('dialog.upload'), icon: 'mdi-information', to: '/upload' },
])

const currentPageTitle = computed(() => {
  const item = items.value.find((e) => e.to === route.path)
  return item?.title
})

const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

onMounted(() => {
  router.push('/') // workarouns to fix electron blank start page
})
</script>

<template>
  <v-app>
    <v-navigation-drawer app permanent width="200" class="text-center">
      <v-list-item class="topbar">
        <v-list-item-title class="text-h6"> SFZ-BUILDER </v-list-item-title>
        <v-list-item-subtitle> {{ t('app.subtitle') }} </v-list-item-subtitle>
      </v-list-item>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-icon>{{ item.icon }}</v-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app class="">
      <v-app-bar-title> > {{ currentPageTitle?.toUpperCase() }} </v-app-bar-title>

      <v-switch
        @click="toggleTheme"
        class="d-flex"
        append-icon="mdi-weather-sunny"
        prepend-icon="mdi-weather-night"
      ></v-switch>
      <div style="margin-right: 20px">
        <LocaleChanger />
      </div>
    </v-app-bar>

    <!--  Main -->
    <v-main class="bg-back">
      <v-container fluid class="page-wrapper">
        <RouterView />
      </v-container>
    </v-main>

    <!--  TheFooter -->
    <v-footer app color="primary" class="pa-1">
      <span class="w-100 text-center text-caption">
        &#169; {{ new Date(Date.now()).getFullYear() }} - build {{ pkg.version }}</span
      >
    </v-footer>
  </v-app>
</template>
