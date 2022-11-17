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

  document.querySelector('form')?.addEventListener('submit', (event) => {
    event.preventDefault()
    const input = document.getElementById('single-audiofile') as HTMLInputElement
    const { path } = (input.files as FileList)[0]
    window.ipc.submitVideo(path)
  })

  // debugger // breakpoint in chrome
  console.log(window.ipc.versions.chrome())
  console.log(window.ipc.config.electron)

  const func = async () => {
    const response = await window.ipc.test()
    console.log(response)
  }

  func()
})
</script>

<template>
  <form>
    <div>
      MDN HTMLInputElement.webkitdirectory
      <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory"
        >source</a
      >
      <input type="file" id="filepicker" name="fileList" webkitdirectory multiple />
      <ul id="listing"></ul>
    </div>
    <hr />
    <div>
      audio file:
      <input id="single-audiofile" type="file" accept="audio/wav" />
    </div>
    <hr />
    <div>
      directory 1 :
      <input type="file" webkitdirectory directory multiple />
    </div>
    <hr />
    <div>
      directory 2 :
      <input directory="" webkitdirectory="" type="file" />
    </div>
    <button type="submit">SUBMIT</button>
  </form>
</template>
