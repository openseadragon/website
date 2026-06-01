<template>
  <WIPBanner />
  <AnnouncementBanner />
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import WIPBanner from './components/WIPBanner.vue'
import AnnouncementBanner from './components/AnnouncementBanner.vue'
</script>
