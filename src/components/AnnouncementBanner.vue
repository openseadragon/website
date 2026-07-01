<template>
  <div v-if="visible" class="announcement-banner" role="banner">
    <span class="announcement-text">
      <span class="announcement-star" aria-hidden="true">★</span>
      New &middot; <strong>OpenSeadragon Deep Dive</strong> &mdash; the official course by Ian Gilman is now live
    </span>
    <a
      href="https://www.newline.co/courses/openseadragon-deep-dive"
      target="_blank"
      rel="noopener noreferrer"
      class="announcement-link"
    >Enroll &rarr;</a>
    <button class="announcement-dismiss" aria-label="Dismiss announcement" @click="dismiss">&times;</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'osd-banner-dismissed'
const visible = ref(false)

onMounted(() => {
  try { visible.value = !localStorage.getItem(STORAGE_KEY) } catch (_) { visible.value = true }
})

function dismiss() {
  try { localStorage.setItem(STORAGE_KEY, '1') } catch (_) {}
  visible.value = false
}
</script>
