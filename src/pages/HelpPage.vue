<template>
  <v-row>
    <v-col cols="12">
      <CardGeneralForm />
      <CardDefaultForm />
      <CardSampleForm />
      <CardDefaultBasicForm />
      <CardInputGroupForm />
      <CardInputStateForm />
      <CardDisabledForm />
      <CardSimpleForm />
    </v-col>
    <v-col cols="12" sm="6">
      <CardSampleFormwithIcons />
    </v-col>
    <v-col cols="12" sm="6">
      <CardSampleFormwithRightIcons />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import CardDefaultBasicForm from '@/components/forms/CardDefaultBasicForm.vue'
import CardDefaultForm from '@/components/forms/CardDefaultForm.vue'
import CardDisabledForm from '@/components/forms/CardDisabledForm.vue'
import CardGeneralForm from '@/components/forms/CardGeneralForm.vue'
import CardInputGroupForm from '@/components/forms/CardInputGroupForm.vue'
import CardInputStateForm from '@/components/forms/CardInputStateForm.vue'
import CardSampleForm from '@/components/forms/CardSampleForm.vue'
import CardSampleFormwithIcons from '@/components/forms/CardSampleFormwithIcons.vue'
import CardSampleFormwithRightIcons from '@/components/forms/CardSampleFormwithRightIcons.vue'
import CardSimpleForm from '@/components/forms/CardSimpleForm.vue'
</script>
