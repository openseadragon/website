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

    <!-- FEATURED AUTHOR DEMOS -->
    <section class="section-tight">
      <div class="container">
        <div class="section-head" style="margin-bottom: 24px;">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>AUTHOR DEMOS</span>
            <h2 class="h-section">Live demos.</h2>
            <p class="sub">Built by Ian Gilman, OSD's creator. Click inside each frame to interact.</p>
          </div>
          <div class="right">
            <RouterLink to="/demos">All {{ CODEPENS.length }} demos →</RouterLink>
          </div>
        </div>

        <div class="cases" id="featured-demos">
          <button
            v-for="pen in FEATURED_CODEPENS"
            :key="pen.id"
            class="case-card feat-thumb-card"
            :style="{ '--hue': pen.hue }"
            @click="activePen = pen"
            :aria-label="`Open ${pen.title} in editor`"
          >
            <div class="case-image feat-thumb">
              <img
                :src="`https://codepen.io/iangilman/pen/${pen.id}/image/large.png`"
                :alt="pen.title"
                class="feat-thumb-img"
                loading="lazy"
                @error="e => e.target.style.display = 'none'"
              />
              <div class="feat-thumb-bg"></div>
              <div class="feat-thumb-play">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
              <div class="case-chip">
                <span class="dot live" style="background:var(--accent)"></span> EDIT
              </div>
            </div>
            <div class="case-body">
              <span class="num">{{ pen.cat.toUpperCase() }}</span>
              <h3 class="h-card">{{ pen.title }}</h3>
              <p>{{ pen.desc }}</p>
            </div>
          </button>
        </div>

        <div class="demos-cta">
          <RouterLink to="/demos" class="btn btn-ghost">View all {{ CODEPENS.length }} author demos →</RouterLink>
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

    <!-- PEN EDITOR -->
    <PenEditor :pen="activePen" @close="activePen = null" />

    <!-- TWEAKS PANEL -->
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" v-model="tweaks.theme" :options="['dark', 'light']" />
      <TweakColor label="Accent" v-model="tweaks._accentArr" :options="accentOptions" />
    </TweaksPanel>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TweaksPanel from '@/components/TweaksPanel.vue'
import PenEditor from '@/components/PenEditor.vue'
import { TweakSection, TweakRadio, TweakColor } from '@/components/tweaks/TweakControls.vue'
import { useParticles } from '@/composables/useParticles.js'
import { useAnimations, useCursorSpot } from '@/composables/useAnimations.js'
import { EXAMPLES_DATA } from '@/data/examples.js'
import { CODEPENS, FEATURED_CODEPENS } from '@/data/codepens.js'

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
const activeFilter = ref('All')
const activePen = ref(null)

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

useParticles('tile-particles', '.page-hero')
useAnimations()
useCursorSpot()

onMounted(() => {
  document.title = 'Examples — OpenSeadragon'
})
</script>

<style scoped>
.feat-thumb-card {
  cursor: pointer;
  text-align: left;
  padding: 0;
  background: var(--ink-2);
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.feat-thumb-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: 0 8px 32px oklch(from var(--accent, #67d6ee) l c h / 0.15);
}

.feat-thumb {
  position: relative;
  background: oklch(0.14 0.03 calc(var(--hue, 200)));
  min-height: 220px;
}
.feat-thumb-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 40%, oklch(0.35 0.12 calc(var(--hue, 200))) 0%, transparent 65%),
    oklch(0.12 0.02 calc(var(--hue, 200)));
  opacity: 0.8;
}
.feat-thumb-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  transition: transform 300ms ease;
}
.feat-thumb-card:hover .feat-thumb-img { transform: scale(1.04); }

.feat-thumb-play {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  background: rgba(0, 0, 0, 0.4);
  transition: opacity 200ms ease;
  color: #fff;
}
.feat-thumb-card:hover .feat-thumb-play { opacity: 1; }

.demos-cta {
  display: flex;
  justify-content: center;
  margin-top: 32px;
}
</style>
