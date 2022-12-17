<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import pkg from '../package.json'
import { useNavigation } from '@/composables/useNavigation'

import LocaleChanger from '@/components/LocaleChanger.vue'

const router = useRouter()
const { t } = useI18n()
const { items, currentPageTitle } = useNavigation()

const theme = useTheme()
function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

onMounted(() => {
  router.push('/instrument') // workarouns to fix electron blank start page
})
</script>

<template>
  <v-app>
    <v-navigation-drawer app permanent class="text-center">
      <div style="display: flex; align-items: center; justify-content: center">
        <div>
          <img src="/app.png" height="50" style="display: block" />
        </div>
        <div>
          <v-list-item class="text-left">
            <v-list-item-title class="text-h6"> SFZ-BUILDER </v-list-item-title>
            <v-list-item-subtitle>{{ t('app.subtitle') }}</v-list-item-subtitle>
          </v-list-item>
        </div>
      </div>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
          <v-icon>{{ item.icon }}</v-icon>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app class="">
      <v-app-bar-title></v-app-bar-title>
      <v-switch
        class="d-flex"
        append-icon="mdi-weather-sunny"
        prepend-icon="mdi-weather-night"
        @click="toggleTheme"
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
