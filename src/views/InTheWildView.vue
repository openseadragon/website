<template>
  <div>
    <NavBar />

    <!-- HERO -->
    <header class="page-hero">
      <canvas id="tile-particles" class="tile-particles" aria-hidden="true"></canvas>
      <div class="cursor-spot" id="cursor-spot" aria-hidden="true"></div>
      <svg class="hero-wires" aria-hidden="true" viewBox="0 0 1280 480" preserveAspectRatio="none">
        <defs>
          <pattern id="itwires-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.18"/>
          </pattern>
        </defs>
        <rect width="1280" height="480" fill="url(#itwires-grid)"/>
      </svg>
      <div class="container">
        <span class="eyebrow"><span class="dot"></span>IN THE WILD · COMMUNITY-CURATED</span>
        <h1 class="h-display" style="margin-top:18px;">In the<br/><em>wild.</em></h1>
        <p class="lede" style="margin-top:20px;">Museums, hospitals, mapping agencies, game communities, national
          libraries — and a few astrophotographers. Every one running OpenSeadragon in production.</p>
        <div style="margin-top:28px;">
          <a class="btn btn-ghost" href="https://openseadragon.github.io/examples/in-the-wild/" target="_blank" rel="noopener">Submit your project →</a>
        </div>
      </div>
    </header>

    <!-- PROJECT GROUPS -->
    <section class="section-tight">
      <div class="container">
        <div class="wild-groups">
          <div v-for="group in wildProjects" :key="group.category" class="wild-group">
            <h3 class="wild-cat">
              {{ group.category }}
              <span class="wild-count">{{ group.projects.length }}</span>
            </h3>
            <div class="wild-grid">
              <a
                v-for="p in group.projects"
                :key="p.url"
                class="wild-card"
                :href="p.url"
                target="_blank"
                rel="noopener"
              >
                <b>{{ p.name }}</b>
                <span v-if="p.org">{{ p.org }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <SiteFooter />

    <!-- TWEAKS PANEL -->
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" v-model="tweaks.theme" :options="['dark', 'light']" />
      <TweakColor label="Accent" v-model="tweaks._accentArr" :options="accentOptions" />
    </TweaksPanel>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TweaksPanel from '@/components/TweaksPanel.vue'
import { TweakSection, TweakRadio, TweakColor } from '@/components/tweaks/TweakControls.vue'
import { useParticles } from '@/composables/useParticles.js'
import { useAnimations, useCursorSpot } from '@/composables/useAnimations.js'
import { wildProjects } from '@/data/wild.js'

const ACCENT_OPTIONS = [
  ['#67d6ee', '#0f1922', '#f3fbfd'],
  ['#ec8761', '#180f0c', '#fbf4f0'],
  ['#c9ee5e', '#0f1a08', '#f6fbed'],
  ['#b59afd', '#120e1c', '#f5f1fb']
]
const ACCENT_NAME_MAP = { '#67d6ee': 'aqua', '#ec8761': 'coral', '#c9ee5e': 'lime', '#b59afd': 'violet' }
const ACCENT_COLOR_MAP = { aqua: ACCENT_OPTIONS[0], coral: ACCENT_OPTIONS[1], lime: ACCENT_OPTIONS[2], violet: ACCENT_OPTIONS[3] }

const html = document.documentElement
const savedTheme = localStorage.getItem('osd-theme') || html.getAttribute('data-theme') || 'dark'
const savedAccent = html.getAttribute('data-accent') || 'aqua'

const tweaks = reactive({
  theme: savedTheme,
  accent: savedAccent,
  _accentArr: ACCENT_COLOR_MAP[savedAccent] || ACCENT_OPTIONS[0]
})

const accentOptions = ACCENT_OPTIONS

watch(() => tweaks.theme, (v) => {
  html.setAttribute('data-theme', v)
  try { localStorage.setItem('osd-theme', v) } catch (_) {}
})

watch(() => tweaks._accentArr, (v) => {
  const name = ACCENT_NAME_MAP[v[0]] || 'aqua'
  tweaks.accent = name
  html.setAttribute('data-accent', name)
})

useParticles('tile-particles', '.page-hero')
useAnimations()
useCursorSpot()

onMounted(() => {
  document.title = 'In the Wild — OpenSeadragon'
})
</script>
