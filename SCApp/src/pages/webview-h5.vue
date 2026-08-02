<template>
  <web-view :src="webViewUrl"></web-view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const webViewUrl = ref('')

onLoad((options) => {
  if (options && options.url) {
    webViewUrl.value = decodeURIComponent(options.url)
  }
})
</script>
