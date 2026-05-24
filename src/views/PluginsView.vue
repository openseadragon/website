<template>
  <div>
    <NavBar />

    <!-- HERO -->
    <header class="page-hero">
      <canvas id="tile-particles" class="tile-particles" aria-hidden="true"></canvas>
      <div class="cursor-spot" id="cursor-spot" aria-hidden="true"></div>
      <svg class="hero-wires" aria-hidden="true" viewBox="0 0 1280 480" preserveAspectRatio="none">
        <defs>
          <pattern id="phwires-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.18"/>
          </pattern>
        </defs>
        <rect width="1280" height="480" fill="url(#phwires-grid)"/>
      </svg>
      <div class="container">
        <span class="eyebrow"><span class="dot"></span>EXTEND · COMMUNITY-MAINTAINED · BSD-3</span>
        <h1 class="h-display" style="margin-top:18px;">A plugin for<br/><em>almost</em> anything.</h1>
        <p class="lede" style="margin-top:20px;">Filters, annotations, screenshots, scalebars, SVG overlays, Fabric.js,
          GeoJSON, image-comparison sliders — community-built and battle-tested.
          Drop them in and keep going.</p>

        <div class="hero-stats">
          <div><b>{{ PLUGINS_DATA.length }}</b><span>plugins</span></div>
          <div><b>{{ categoryCount }}</b><span>categories</span></div>
          <div><b>9.2M</b><span>downloads / yr</span></div>
          <div><b>BSD-3</b><span>open license</span></div>
        </div>
      </div>
    </header>

    <!-- MINDMAP -->
    <section class="section-tight">
      <div class="container">
        <div class="section-head">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>CORE + ORBIT</span>
            <h2 class="h-section">One viewer. Many companions.</h2>
            <p class="sub">Each plugin attaches to the running viewer at a well-defined seam —
              tile source, overlay layer, drawer hook, or input chain.</p>
          </div>
        </div>

        <div class="plugins-map" id="plugins-map">
          <canvas class="plugins-map-canvas" id="plugins-map-canvas" aria-hidden="true"></canvas>
          <div class="pl-hub">
            <span class="pl-hub-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linejoin="round" rx="1.5"/>
                <rect x="8" y="8" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-opacity="0.55" rx="1.5"/>
                <rect x="11" y="11" width="3" height="3" fill="currentColor"/>
              </svg>
            </span>
            <span class="pl-hub-title">openseadragon</span>
            <span class="pl-hub-sub">core viewer</span>
          </div>
          <a v-for="node in PLUGIN_NODES" :key="node.mark" class="pl-node" href="#">
            <span class="pl-mark">{{ node.mark }}</span>
            <span class="pl-name">{{ node.name }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- BROWSE BY CATEGORY -->
    <section class="section-tight" id="browse">
      <div class="container">
        <div class="section-head" style="margin-bottom: 24px;">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>BROWSE</span>
            <h2 class="h-section">Find a plugin by what it does.</h2>
          </div>
        </div>

        <div class="filter-pills" role="tablist" aria-label="Plugin categories">
          <button
            v-for="cat in ['All', ...categories]"
            :key="cat"
            role="tab"
            :aria-selected="activeFilter === cat"
            :class="['pill', { active: activeFilter === cat }]"
            @click="activeFilter = cat"
          >{{ cat }}</button>
        </div>

        <div class="plugin-grid">
          <div v-for="plugin in filteredPlugins" :key="plugin.name" class="plugin-card">
            <div class="plugin-card-head">
              <span class="plugin-card-mark">{{ plugin.mark }}</span>
              <div class="plugin-card-title">
                <div class="plugin-card-name">{{ plugin.name }}</div>
                <div class="plugin-card-cat">{{ plugin.cat }}</div>
              </div>
              <span
                v-if="plugin.compat"
                :class="['plugin-compat', plugin.compat === 'v5+' ? 'plugin-compat-modern' : 'plugin-compat-legacy']"
              >{{ plugin.compat }}</span>
            </div>

            <p class="plugin-card-desc">{{ plugin.desc }}</p>

            <div class="plugin-card-meta">
              <a
                v-if="plugin.repo"
                :href="`https://github.com/${plugin.repo}`"
                target="_blank"
                rel="noopener noreferrer"
              >GitHub ↗</a>
              <a
                v-else-if="plugin.url"
                :href="plugin.url"
                target="_blank"
                rel="noopener noreferrer"
              >Repository ↗</a>
              <span v-else></span>

              <a
                v-if="plugin.repo"
                :href="`https://github.com/${plugin.repo}/stargazers`"
                target="_blank"
                rel="noopener noreferrer"
                class="plugin-card-stars-link"
              >★ {{ getStars(plugin) }}</a>
            </div>

            <div v-if="plugin.repo" class="plugin-card-updated">
              {{ getUpdated(plugin) }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BUILD YOUR OWN -->
    <section class="section-tight">
      <div class="container">
        <div class="section-head">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>EXTEND IT YOURSELF</span>
            <h2 class="h-section">Write your own in under 30 lines.</h2>
            <p class="sub">A plugin is any object that takes a viewer and returns a destroy function.
              The seams: <code>tile-loaded</code>, <code>animation</code>, <code>canvas-click</code>,
              and the <code>drawer</code> hook chain.</p>
          </div>
          <div class="right"><RouterLink to="/docs">Read the plugin guide →</RouterLink></div>
        </div>

        <div class="codeblock">
          <header>
            <div class="stage-dots"><span></span><span></span><span></span></div>
            <span class="fname">my-scalebar-plugin.js</span>
            <span style="margin-left:auto;">esm</span>
          </header>
          <pre><span class="tok-key">export function</span> <span class="tok-fn">scalebar</span><span class="tok-pun">(</span>viewer<span class="tok-pun">,</span> opts <span class="tok-pun">=</span> <span class="tok-pun">{}) {</span>
  <span class="tok-key">const</span> el <span class="tok-pun">=</span> <span class="tok-fn">document</span>.<span class="tok-fn">createElement</span><span class="tok-pun">(</span><span class="tok-str">"div"</span><span class="tok-pun">);</span>
  el.<span class="tok-fn">className</span> <span class="tok-pun">=</span> <span class="tok-str">"scalebar"</span><span class="tok-pun">;</span>
  viewer.<span class="tok-fn">canvas</span>.<span class="tok-fn">appendChild</span><span class="tok-pun">(</span>el<span class="tok-pun">);</span>

  <span class="tok-key">const</span> redraw <span class="tok-pun">=</span> <span class="tok-pun">() =&gt; {</span>
    <span class="tok-key">const</span> mpp <span class="tok-pun">=</span> opts.<span class="tok-fn">micronsPerPixel</span><span class="tok-pun">;</span>
    <span class="tok-key">const</span> px <span class="tok-pun">=</span> viewer.viewport.<span class="tok-fn">deltaPixelsFromPoints</span><span class="tok-pun">(</span><span class="tok-key">new</span> OpenSeadragon.<span class="tok-fn">Point</span><span class="tok-pun">(</span><span class="tok-num">1</span><span class="tok-pun">,</span> <span class="tok-num">0</span><span class="tok-pun">)).</span>x<span class="tok-pun">;</span>
    el.<span class="tok-fn">textContent</span> <span class="tok-pun">=</span> <span class="tok-pun">(</span>px <span class="tok-pun">*</span> mpp<span class="tok-pun">).</span><span class="tok-fn">toFixed</span><span class="tok-pun">(</span><span class="tok-num">1</span><span class="tok-pun">)</span> <span class="tok-pun">+</span> <span class="tok-str">" µm"</span><span class="tok-pun">;</span>
  <span class="tok-pun">};</span>

  viewer.<span class="tok-fn">addHandler</span><span class="tok-pun">(</span><span class="tok-str">"animation"</span><span class="tok-pun">,</span> redraw<span class="tok-pun">);</span>
  <span class="tok-fn">redraw</span><span class="tok-pun">();</span>

  <span class="tok-key">return</span> <span class="tok-pun">() =&gt; {</span>
    viewer.<span class="tok-fn">removeHandler</span><span class="tok-pun">(</span><span class="tok-str">"animation"</span><span class="tok-pun">,</span> redraw<span class="tok-pun">);</span>
    el.<span class="tok-fn">remove</span><span class="tok-pun">();</span>
  <span class="tok-pun">};</span>
<span class="tok-pun">}</span></pre>
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
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TweaksPanel from '@/components/TweaksPanel.vue'
import { TweakSection, TweakRadio, TweakColor } from '@/components/tweaks/TweakControls.vue'
import { useParticles } from '@/composables/useParticles.js'
import { usePluginsMap } from '@/composables/usePluginsMap.js'
import { useAnimations, useCursorSpot } from '@/composables/useAnimations.js'
import { useGitHubPluginData } from '@/composables/useGitHubPluginData.js'
import { PLUGINS_DATA, PLUGIN_NODES } from '@/data/plugins.js'

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

const categories = computed(() => [...new Set(PLUGINS_DATA.map(p => p.cat))])
const categoryCount = computed(() => categories.value.length)

const filteredPlugins = computed(() =>
  activeFilter.value === 'All'
    ? PLUGINS_DATA
    : PLUGINS_DATA.filter(p => p.cat === activeFilter.value)
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

// ── Live GitHub data ──────────────────────────────────────────────────────────

const { ghData, loading } = useGitHubPluginData(PLUGINS_DATA)

function relativeTime(dateStr) {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
  if (days === 0) return 'today'
  if (days < 2) return '1d ago'
  if (days < 7) return `${days}d ago`
  if (days < 14) return '1w ago'
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 60) return '1mo ago'
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

function getStars(plugin) {
  if (!plugin.repo) return '—'
  const d = ghData[plugin.repo]
  if (!d) return loading.value ? '…' : '—'
  if (d.stars == null) return '—'
  return d.stars >= 1000 ? `${(d.stars / 1000).toFixed(1)}k` : String(d.stars)
}

function getUpdated(plugin) {
  if (!plugin.repo) return '—'
  const d = ghData[plugin.repo]
  if (!d) return loading.value ? 'Loading…' : '—'
  const prefix = d.version || 'Commit'
  const date = d.updatedAt ? relativeTime(d.updatedAt) : '—'
  return `${prefix} · ${date}`
}

// ─────────────────────────────────────────────────────────────────────────────

useParticles('tile-particles', '.page-hero')
usePluginsMap()
useAnimations()
useCursorSpot()

onMounted(() => {
  document.title = 'Plugins — OpenSeadragon'
})
</script>
