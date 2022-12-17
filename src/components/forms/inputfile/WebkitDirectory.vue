<template>
  <h3 class="title text-h6 mb-5">WebkitDirectory</h3>
  <input id="filepicker" type="file" name="fileList" webkitdirectory multiple />
  <ul id="listing"></ul>
  MDN HTMLInputElement.webkitdirectory
  <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory"
    >source</a
  >
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
onMounted(() => {
  document.getElementById('filepicker')?.addEventListener(
    'change',
    (event) => {
      const output = document.getElementById('listing')
      const target = event.target as HTMLInputElement
      const files = target.files as FileList
      for (const file of files) {
        const item = document.createElement('li')
        item.textContent = file.webkitRelativePath
        output?.appendChild(item)
      }
    },
    false,
  )
})
</script>

<style scoped></style>
