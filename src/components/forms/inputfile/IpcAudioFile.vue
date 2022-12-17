<template>
  <h3 class="title text-h6 mb-5">IpcAudioFile</h3>
  audio file:
  <input id="single-audiofile" type="file" accept="audio/wav" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
onMounted(() => {
  document.querySelector('form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('single-audiofile') as HTMLInputElement
    const { path } = (input.files as FileList)[0]
    window.ipc.submitVideo(path)
  })

  // debugger // breakpoint in chrome
  console.info(window.ipc.versions.chrome())
  console.info(window.ipc.config.electron)

  const func = async () => {
    const response = await window.ipc.test()
    console.info(response)
  }

  func()
})
</script>

<style scoped></style>
