<template>
  <div>
    <NavBar />

    <!-- HERO -->
    <header class="page-hero">
      <svg class="hero-wires" aria-hidden="true" viewBox="0 0 1280 480" preserveAspectRatio="none">
        <defs>
          <pattern id="exwires-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.18"/>
          </pattern>
        </defs>
        <rect width="1280" height="480" fill="url(#exwires-grid)"/>
      </svg>
      <div class="container">
        <span class="eyebrow"><span class="dot"></span>EXAMPLES · LIVE EDITOR · EDIT AND RUN INSTANTLY</span>
        <h1 class="h-display" style="margin-top:18px;">Live demos,<br/><em>edit</em> in the browser.</h1>
        <p class="lede" style="margin-top:20px;">Click any card to open the live editor — tweak the code and see it update in real time.</p>

        <div class="hero-stats">
          <div><b>{{ CODEPENS.length }}</b><span>demos</span></div>
          <div><b>{{ categoryCount }}</b><span>categories</span></div>
          <div><b>Ian</b><span>Gilman, creator</span></div>
          <div><b>BSD-3</b><span>open license</span></div>
        </div>
      </div>
    </header>

    <!-- ALL DEMOS -->
    <section class="section-tight">
      <div class="container">
        <div class="section-head" style="margin-bottom: 24px;">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>ALL DEMOS</span>
            <h2 class="h-section">Filter by technique.</h2>
            <p class="sub">Click any card to open the live editor — edit the code and see it run instantly.</p>
          </div>
          <div class="right">
            <a href="https://codepen.io/iangilman/pens/showcase" target="_blank" rel="noopener noreferrer">
              Full showcase on CodePen →
            </a>
          </div>
        </div>

        <div class="filter-pills" role="tablist" aria-label="Demo categories">
          <button
            v-for="cat in ['All', ...categories]"
            :key="cat"
            role="tab"
            :aria-selected="activeFilter === cat"
            :class="['pill', { active: activeFilter === cat }]"
            @click="activeFilter = cat"
          >{{ cat }}</button>
        </div>

        <div class="demos-grid">
          <button
            v-for="pen in filteredPens"
            :key="pen.id"
            class="demo-thumb-card"
            :style="{ '--hue': pen.hue }"
            @click="activePen = pen"
            :aria-label="`Open ${pen.title} in editor`"
          >
            <div class="demo-thumb">
              <img
                :src="`https://codepen.io/iangilman/pen/${pen.id}/image/large.png`"
                :alt="pen.title"
                class="demo-thumb-img"
                loading="lazy"
                @error="e => e.target.style.display = 'none'"
              />
              <div class="demo-thumb-bg"></div>
              <div class="demo-thumb-play">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            <div class="demo-meta">
              <div class="demo-meta-top">
                <span class="demo-cat">{{ pen.cat }}</span>
                <a
                  :href="`https://codepen.io/iangilman/pen/${pen.id}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="pen-ext-link"
                  :aria-label="`Open ${pen.title} on CodePen`"
                  @click.stop
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
              <h3 class="h-card" style="margin:0">{{ pen.title }}</h3>
              <p style="margin:0;color:var(--paper-dim);font-size:14px;line-height:1.5">{{ pen.desc }}</p>
            </div>
          </button>
        </div>
      </div>
    </section>

    <SiteFooter />

    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" v-model="tweaks.theme" :options="['dark', 'light']" />
      <TweakColor label="Accent" v-model="tweaks._accentArr" :options="accentOptions" />
    </TweaksPanel>

    <PenEditor :pen="activePen" @close="activePen = null" />
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TweaksPanel from '@/components/TweaksPanel.vue'
import PenEditor from '@/components/PenEditor.vue'
import { TweakSection, TweakRadio, TweakColor } from '@/components/tweaks/TweakControls.vue'
import { useAnimations } from '@/composables/useAnimations.js'
import { CODEPENS } from '@/data/codepens.js'

const ACCENT_OPTIONS = [
  ['#67d6ee', '#0f1922', '#f3fbfd'],
  ['#ec8761', '#180f0c', '#fbf4f0'],
  ['#c9ee5e', '#0f1a08', '#f6fbed'],
  ['#b59afd', '#120e1c', '#f5f1fb']
]
const ACCENT_NAME_MAP = { '#67d6ee': 'aqua', '#ec8761': 'coral', '#c9ee5e': 'lime', '#b59afd': 'violet' }
const ACCENT_COLOR_MAP = { aqua: ACCENT_OPTIONS[0], coral: ACCENT_OPTIONS[1], lime: ACCENT_OPTIONS[2], violet: ACCENT_OPTIONS[3] }

const html = document.documentElement
let savedTheme; try { savedTheme = localStorage.getItem('osd-theme') } catch (_) {}
savedTheme = savedTheme || html.getAttribute('data-theme') || 'dark'
const savedAccent = html.getAttribute('data-accent') || 'aqua'

const tweaks = reactive({
  theme: savedTheme,
  accent: savedAccent,
  _accentArr: ACCENT_COLOR_MAP[savedAccent] || ACCENT_OPTIONS[0]
})

const accentOptions = ACCENT_OPTIONS
const activeFilter = ref('All')
const activePen = ref(null)

const categories = computed(() => [...new Set(CODEPENS.map(p => p.cat))])
const categoryCount = computed(() => categories.value.length)
const filteredPens = computed(() =>
  activeFilter.value === 'All' ? CODEPENS : CODEPENS.filter(p => p.cat === activeFilter.value)
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

useAnimations()

onMounted(() => {
  document.title = 'Examples — OpenSeadragon'
})
</script>

<style scoped>
.demos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 32px;
}

.demo-thumb-card {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--ink-2);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  text-align: left;
  padding: 0;
  transition: transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease;
}
.demo-thumb-card:hover {
  transform: translateY(-3px);
  border-color: var(--accent);
  box-shadow: 0 8px 32px oklch(from var(--accent, #67d6ee) l c h / 0.15);
}

.demo-thumb {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: oklch(0.14 0.03 calc(var(--hue, 200)));
}
.demo-thumb-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 40%, oklch(0.35 0.12 calc(var(--hue, 200))) 0%, transparent 65%),
    oklch(0.12 0.02 calc(var(--hue, 200)));
  opacity: 0.8;
}
.demo-thumb-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  transition: transform 300ms ease;
}
.demo-thumb-card:hover .demo-thumb-img { transform: scale(1.03); }

.demo-thumb-play {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  background: rgba(0, 0, 0, 0.45);
  transition: opacity 200ms ease;
  color: #fff;
}
.demo-thumb-play svg {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));
}
.demo-thumb-card:hover .demo-thumb-play { opacity: 1; }

.demo-meta {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--line);
}
.demo-meta-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.demo-cat {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}
.pen-ext-link {
  display: inline-flex;
  align-items: center;
  color: var(--paper-mute);
  text-decoration: none;
  padding: 3px;
  border-radius: 3px;
  transition: color 150ms ease;
}
.pen-ext-link:hover { color: var(--accent); }

@media (max-width: 960px) {
  .demos-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 580px) {
  .demos-grid { grid-template-columns: 1fr; }
}
</style>
