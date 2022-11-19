<template>
  <v-card>
    <v-card-text class="pa-5">
      <h3 class="title text-h6">{{ currentPageTitle?.toUpperCase() }}</h3>
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
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation'
const { currentPageTitle } = useNavigation()
</script>
