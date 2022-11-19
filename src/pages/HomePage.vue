<template>
  <v-card>
    <v-card-text class="pa-5">
      <h3 class="title text-h6">{{ currentPageTitle?.toUpperCase() }}</h3>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text class="pa-5">
      <v-row>
        <v-col>
          {{ welcomeMsg }}
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNavigation } from '@/composables/useNavigation'
const { currentPageTitle } = useNavigation()

const welcomeMsg = ref('')
welcomeMsg.value = 'waiting from mainWindow ...'

onMounted(() => {
  window.ipc.handleWelcomeFromMainWindow((event, value) => {
    welcomeMsg.value = value
    event.sender.send('welcome', 'Thanks !')
  })
})
</script>
