<template>
  <AnnouncementBanner />
  <RouterView />
</template>

<script setup>
import { RouterView } from 'vue-router'
import AnnouncementBanner from './components/AnnouncementBanner.vue'
</script>
