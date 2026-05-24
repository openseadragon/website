<template>
  <nav class="nav" data-screen-label="01 Nav">
    <div class="nav-inner">
      <RouterLink to="/" class="brand">
        <span class="brand-mark" aria-hidden="true">
          <svg class="brand-glyph" viewBox="0 0 24 24" fill="none">
            <rect class="bg-outer" x="3" y="3" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linejoin="round" rx="1.5"/>
            <rect class="bg-inner" x="8" y="8" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-opacity="0.55" rx="1.5"/>
            <rect class="bg-dot" x="11" y="11" width="3" height="3" fill="currentColor"/>
          </svg>
        </span>
        <span>OpenSeadragon</span>
        <span class="mono" style="font-size:11px;color:var(--paper-mute);margin-left:6px;">v6.0.2</span>
      </RouterLink>

      <div class="nav-links">
        <RouterLink class="nav-link" to="/" :aria-current="route.path === '/' ? 'page' : undefined">Home</RouterLink>
        <RouterLink class="nav-link" to="/docs" :aria-current="route.path === '/docs' ? 'page' : undefined">Docs</RouterLink>
        <RouterLink class="nav-link" to="/examples" :aria-current="route.path === '/examples' ? 'page' : undefined">Examples</RouterLink>
        <RouterLink class="nav-link" to="/plugins" :aria-current="route.path === '/plugins' ? 'page' : undefined">Plugins</RouterLink>
        <RouterLink class="nav-link" to="/community" :aria-current="route.path === '/community' ? 'page' : undefined">Community</RouterLink>
      </div>

      <div class="nav-spacer"></div>

      <button class="nav-search" aria-label="Search docs">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
        <span>Search the docs</span>
        <span class="kbd">⌘ K</span>
      </button>

      <a href="#" class="gh-pill" aria-label="GitHub">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.55v-2.06c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.07 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.6.23 2.78.11 3.07.74.81 1.19 1.83 1.19 3.09 0 4.43-2.69 5.4-5.25 5.68.41.36.78 1.07.78 2.16v3.2c0 .31.21.66.8.55C20.21 21.38 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5Z"/></svg>
        <span class="gh-stars">{{ ghStars }}</span>
        <span class="star">★</span>
      </a>

      <button class="theme-toggle" aria-label="Toggle theme" @click="toggle">
        <svg class="ic-sun" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        <svg class="ic-moon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme.js'

const route = useRoute()
const { toggle } = useTheme()

const ghStars = ref('3.4k')

onMounted(() => {
  if (!window.anime) return
  const el = document.querySelector('.gh-stars')
  if (!el) return
  const counter = { v: 0 }
  window.anime({ targets: counter, v: 3400, duration: 1800, delay: 600, easing: 'easeOutCubic',
    update: () => { el.textContent = (counter.v / 1000).toFixed(1) + 'k' } })
})
</script>
