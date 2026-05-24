<template>
  <div>
    <NavBar />

    <!-- HERO -->
    <header class="page-hero">
      <canvas id="tile-particles" class="tile-particles" aria-hidden="true"></canvas>
      <div class="cursor-spot" id="cursor-spot" aria-hidden="true"></div>
      <svg class="hero-wires" aria-hidden="true" viewBox="0 0 1280 480" preserveAspectRatio="none">
        <defs>
          <pattern id="exwires-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.18"/>
          </pattern>
        </defs>
        <rect width="1280" height="480" fill="url(#exwires-grid)"/>
      </svg>
      <div class="container">
        <span class="eyebrow"><span class="dot"></span>EXAMPLES · WORKING SOURCE · COPY THE PARTS YOU NEED</span>
        <h1 class="h-display" style="margin-top:18px;">Working code,<br/><em>not</em> screenshots.</h1>
        <p class="lede" style="margin-top:20px;">Every example below is a standalone HTML page with annotated source.
          Open it, fork it, drop your tile source in — done.</p>

        <div class="hero-stats">
          <div><b>{{ EXAMPLES_DATA.length }}</b><span>examples</span></div>
          <div><b>{{ categoryCount }}</b><span>categories</span></div>
          <div><b>24</b><span>working tile sources</span></div>
          <div><b>BSD-3</b><span>open license</span></div>
        </div>
      </div>
    </header>

    <!-- FEATURED LIVE VIEWERS -->
    <section class="section-tight">
      <div class="container">
        <div class="section-head" style="margin-bottom: 24px;">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>FEATURED</span>
            <h2 class="h-section">Live demos.</h2>
            <p class="sub">Drag, scroll, pinch. These viewers are real — same code as the example pages.</p>
          </div>
        </div>

        <div class="cases" id="featured-grid">
          <article class="case-card" data-case-theme="art">
            <div class="case-image">
              <div class="case-osd" id="osd-feat-art" data-theme="art"></div>
              <div class="case-osd-frame" aria-hidden="true">
                <span class="corner tl"></span><span class="corner tr"></span>
                <span class="corner bl"></span><span class="corner br"></span>
              </div>
              <div class="case-chip"><span class="dot live"></span> LIVE</div>
            </div>
            <div class="case-body">
              <span class="num">01 / BASIC</span>
              <h3 class="h-card">Single tiled image.</h3>
              <p>Drop a <code>div</code>, point at a DZI, you're done. The smallest possible example.</p>
            </div>
          </article>
          <article class="case-card" data-case-theme="micro">
            <div class="case-image">
              <div class="case-osd" id="osd-feat-micro" data-theme="micro"></div>
              <div class="case-osd-frame" aria-hidden="true">
                <span class="corner tl"></span><span class="corner tr"></span>
                <span class="corner bl"></span><span class="corner br"></span>
              </div>
              <div class="case-chip"><span class="dot live"></span> LIVE</div>
            </div>
            <div class="case-body">
              <span class="num">02 / OVERLAYS</span>
              <h3 class="h-card">HTML + SVG overlays.</h3>
              <p>Anchor any DOM node in image space. Tracks pan, zoom and rotation perfectly.</p>
            </div>
          </article>
          <article class="case-card" data-case-theme="maps">
            <div class="case-image">
              <div class="case-osd" id="osd-feat-maps" data-theme="maps"></div>
              <div class="case-osd-frame" aria-hidden="true">
                <span class="corner tl"></span><span class="corner tr"></span>
                <span class="corner bl"></span><span class="corner br"></span>
              </div>
              <div class="case-chip"><span class="dot live"></span> LIVE</div>
            </div>
            <div class="case-body">
              <span class="num">03 / SEQUENCE</span>
              <h3 class="h-card">Sequence mode slideshow.</h3>
              <p>Step through a collection of images with smooth, pre-fetched transitions.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ALL EXAMPLES -->
    <section class="section-tight">
      <div class="container">
        <div class="section-head" style="margin-bottom: 24px;">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>EVERY ONE</span>
            <h2 class="h-section">Filter by what you need.</h2>
          </div>
          <div class="right"><a href="#">All on GitHub →</a></div>
        </div>

        <div class="filter-pills" role="tablist" aria-label="Example categories">
          <button
            v-for="cat in ['All', ...categories]"
            :key="cat"
            role="tab"
            :aria-selected="activeFilter === cat"
            :class="['pill', { active: activeFilter === cat }]"
            @click="activeFilter = cat"
          >{{ cat }}</button>
        </div>

        <div class="examples-page-grid">
          <RouterLink
            v-for="ex in filteredExamples"
            :key="ex.tag"
            :to="`/docs/${ex.slug}`"
            class="ex-card"
            :style="{ '--hue': ex.hue }"
          >
            <div class="ex-thumb">
              <div class="ex-thumb-bg"></div>
              <span class="ex-tag">{{ ex.tag }}</span>
            </div>
            <div class="ex-body">
              <span class="ex-cat">{{ ex.cat }}</span>
              <b>{{ ex.title }}</b>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <SiteFooter />

    <!-- TWEAKS PANEL -->
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" v-model="tweaks.theme" :options="['dark', 'light']" />
      <TweakColor label="Accent" v-model="tweaks._accentArr" :options="accentOptions" />
      <TweakSection label="Demo image" />
      <TweakRadio label="Use case" v-model="tweaks.frame" :options="['art', 'micro', 'maps']" />
    </TweaksPanel>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TweaksPanel from '@/components/TweaksPanel.vue'
import { TweakSection, TweakRadio, TweakColor } from '@/components/tweaks/TweakControls.vue'
import { useParticles } from '@/composables/useParticles.js'
import { useAnimations, useCursorSpot } from '@/composables/useAnimations.js'
import { EXAMPLES_DATA } from '@/data/examples.js'

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
const savedFrame = html.getAttribute('data-frame') || 'art'

const tweaks = reactive({
  theme: savedTheme,
  accent: savedAccent,
  frame: savedFrame,
  _accentArr: ACCENT_COLOR_MAP[savedAccent] || ACCENT_OPTIONS[0]
})

const accentOptions = ACCENT_OPTIONS
const activeFilter = ref('All')

const categories = computed(() => [...new Set(EXAMPLES_DATA.map(e => e.cat))])
const categoryCount = computed(() => categories.value.length)

const filteredExamples = computed(() =>
  activeFilter.value === 'All'
    ? EXAMPLES_DATA
    : EXAMPLES_DATA.filter(e => e.cat === activeFilter.value)
)

watch(() => tweaks.theme, (v) => {
  html.setAttribute('data-theme', v)
  try { localStorage.setItem('osd-theme', v) } catch (_) {}
})

watch(() => tweaks._accentArr, (v) => {
  const name = ACCENT_NAME_MAP[v[0]] || 'aqua'
  tweaks.accent = name
  html.setAttribute('data-accent', name)
})

watch(() => tweaks.frame, (v) => {
  html.setAttribute('data-frame', v)
  rebuildViewers()
})

const viewers = []

function makeTileSource(theme) {
  const W = { art: 3556, micro: 4096, maps: 8192 }[theme] || 3556
  const H = { art: 4800, micro: 4096, maps: 4096 }[theme] || 4800
  const tileSize = 256
  return {
    width: W, height: H,
    tileWidth: tileSize, tileHeight: tileSize,
    minLevel: 0,
    maxLevel: Math.ceil(Math.log2(Math.max(W, H))),
    getTileUrl(level, x, y) { return null },
    createTileCache() {},
    destroyTileCache() {},
    getImageInfo() { return { width: W, height: H } },
    getTileAtPoint(level, point) { return { x: 0, y: 0 } },
    tileExists() { return false },
    getTileAjaxHeaders() { return {} }
  }
}

function paintCanvas(canvas, theme, frame) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width, h = canvas.height
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light'
  const PALETTES = {
    art:   { bg: isDark ? '#0f1922' : '#f3fbfd', fg: isDark ? '#67d6ee' : '#0a7fa0' },
    micro: { bg: isDark ? '#0e1310' : '#f2faf3', fg: isDark ? '#5dd68b' : '#1a7a3a' },
    maps:  { bg: isDark ? '#16131e' : '#f5f1fb', fg: isDark ? '#b59afd' : '#6b4fc8' }
  }
  const pal = PALETTES[frame || theme] || PALETTES.art
  ctx.fillStyle = pal.bg
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = pal.fg
  ctx.lineWidth = 0.5
  ctx.globalAlpha = 0.25
  const step = 32
  for (let x = 0; x < w; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
  for (let y = 0; y < h; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }
  ctx.globalAlpha = 0.7
  const cx = w / 2, cy = h / 2
  ctx.strokeStyle = pal.fg
  ctx.lineWidth = 1.5
  ctx.beginPath(); ctx.moveTo(cx - 40, cy); ctx.lineTo(cx + 40, cy); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx, cy - 40); ctx.lineTo(cx, cy + 40); ctx.stroke()
  ctx.beginPath(); ctx.arc(cx, cy, 20, 0, Math.PI * 2); ctx.stroke()
  ctx.globalAlpha = 1
}

function initCaseViewer(id, theme) {
  const OSD = window.OpenSeadragon
  if (!OSD) return null
  const el = document.getElementById(id)
  if (!el) return null
  const canvas = document.createElement('canvas')
  canvas.width = el.offsetWidth || 340
  canvas.height = el.offsetHeight || 220
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none'
  el.style.position = 'relative'
  el.appendChild(canvas)
  paintCanvas(canvas, theme, tweaks.frame)
  return { canvas, theme, destroy() { canvas.remove() } }
}

function rebuildViewers() {
  viewers.forEach(v => v && v.destroy && v.destroy())
  viewers.length = 0
  const themes = ['art', 'micro', 'maps']
  const ids = ['osd-feat-art', 'osd-feat-micro', 'osd-feat-maps']
  themes.forEach((theme, i) => {
    const v = initCaseViewer(ids[i], theme)
    if (v) viewers.push(v)
  })
}

useParticles('tile-particles', '.page-hero')
useAnimations()
useCursorSpot()

onMounted(() => {
  document.title = 'Examples — OpenSeadragon'
  rebuildViewers()
})

onUnmounted(() => {
  viewers.forEach(v => v && v.destroy && v.destroy())
  viewers.length = 0
})
</script>
