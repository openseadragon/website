<template>
  <div class="pg-page">
    <NavBar />

    <div class="pg-arena">
    <div class="pg-workspace">

      <!-- ── Sidebar ── -->
      <aside class="pg-sidebar" aria-label="Viewer configuration">

        <!-- Display Mode -->
        <div class="pg-sect-hd">Display Mode</div>
        <div class="pg-mode-grid">
          <button
            v-for="mode in DISPLAY_MODES" :key="mode.key"
            :class="['pg-mode-opt', { active: opts.displayMode === mode.key }]"
            @click="opts.displayMode = mode.key"
          >
            <div class="pg-mode-icon" v-html="mode.icon"></div>
            <div class="pg-mode-info">
              <span class="pg-mode-name">{{ mode.label }}</span>
              <span class="pg-mode-desc">{{ mode.desc }}</span>
            </div>
          </button>
        </div>

        <!-- Sequence-specific options -->
        <template v-if="opts.displayMode === 'sequence'">
          <div class="pg-toggle-row">
            <span class="pg-mono">showReferenceStrip</span>
            <button type="button" class="pg-tog" :data-on="opts.showReferenceStrip ? '1' : '0'"
              role="switch" :aria-checked="opts.showReferenceStrip"
              @click="opts.showReferenceStrip = !opts.showReferenceStrip"><i /></button>
          </div>
          <div class="pg-toggle-row">
            <span class="pg-mono">showSequenceControl</span>
            <button type="button" class="pg-tog" :data-on="opts.showSequenceControl ? '1' : '0'"
              role="switch" :aria-checked="opts.showSequenceControl"
              @click="opts.showSequenceControl = !opts.showSequenceControl"><i /></button>
          </div>
        </template>

        <!-- Collection-specific options -->
        <template v-if="opts.displayMode === 'collection'">
          <div class="pg-row">
            <div class="pg-row-hd">
              <span class="pg-mono">collectionRows</span>
              <span class="pg-badge">{{ opts.collectionRows }}</span>
            </div>
            <input type="range" class="pg-slider" min="1" max="3" step="1" v-model.number="opts.collectionRows" />
          </div>
          <div class="pg-row">
            <div class="pg-row-hd">
              <span class="pg-mono">collectionTileMargin</span>
              <span class="pg-badge">{{ opts.collectionTileMargin }}px</span>
            </div>
            <input type="range" class="pg-slider" min="0" max="80" step="4" v-model.number="opts.collectionTileMargin" />
          </div>
        </template>

        <!-- Side-by-side-specific options -->
        <template v-if="opts.displayMode === 'sidebyside'">
          <div class="pg-row">
            <div class="pg-row-hd">
              <span class="pg-mono">image spacing</span>
              <span class="pg-badge">{{ opts.sideSpacing.toFixed(2) }}</span>
            </div>
            <input type="range" class="pg-slider" min="1.0" max="1.5" step="0.01" v-model.number="opts.sideSpacing" />
          </div>
        </template>

        <!-- Animation -->
        <div class="pg-sect-hd">Animation</div>
        <div class="pg-row">
          <div class="pg-row-hd">
            <span class="pg-mono">animationTime</span>
            <span class="pg-badge">{{ opts.animationTime.toFixed(1) }}s</span>
          </div>
          <input type="range" class="pg-slider" min="0" max="3" step="0.1" v-model.number="opts.animationTime" />
        </div>
        <div class="pg-row">
          <div class="pg-row-hd">
            <span class="pg-mono">blendTime</span>
            <span class="pg-badge">{{ opts.blendTime.toFixed(2) }}s</span>
          </div>
          <input type="range" class="pg-slider" min="0" max="1" step="0.05" v-model.number="opts.blendTime" />
        </div>
        <div class="pg-row">
          <div class="pg-row-hd">
            <span class="pg-mono">springStiffness</span>
            <span class="pg-badge">{{ opts.springStiffness.toFixed(1) }}</span>
          </div>
          <input type="range" class="pg-slider" min="1" max="20" step="0.5" v-model.number="opts.springStiffness" />
        </div>

        <!-- Zoom -->
        <div class="pg-sect-hd">Zoom</div>
        <div class="pg-row">
          <div class="pg-row-hd">
            <span class="pg-mono">zoomPerClick</span>
            <span class="pg-badge">{{ opts.zoomPerClick.toFixed(1) }}×</span>
          </div>
          <input type="range" class="pg-slider" min="1.1" max="4" step="0.1" v-model.number="opts.zoomPerClick" />
        </div>
        <div class="pg-row">
          <div class="pg-row-hd">
            <span class="pg-mono">zoomPerScroll</span>
            <span class="pg-badge">{{ opts.zoomPerScroll.toFixed(2) }}×</span>
          </div>
          <input type="range" class="pg-slider" min="1.05" max="3" step="0.05" v-model.number="opts.zoomPerScroll" />
        </div>
        <div class="pg-row">
          <div class="pg-row-hd">
            <span class="pg-mono">maxZoomPixelRatio</span>
            <span class="pg-badge">{{ opts.maxZoomPixelRatio.toFixed(1) }}</span>
          </div>
          <input type="range" class="pg-slider" min="1" max="20" step="0.5" v-model.number="opts.maxZoomPixelRatio" />
        </div>
        <div class="pg-row">
          <div class="pg-row-hd">
            <span class="pg-mono">minZoomImageRatio</span>
            <span class="pg-badge">{{ opts.minZoomImageRatio.toFixed(1) }}</span>
          </div>
          <input type="range" class="pg-slider" min="0.1" max="2" step="0.1" v-model.number="opts.minZoomImageRatio" />
        </div>

        <!-- Navigation -->
        <div class="pg-sect-hd">Navigation</div>
        <div class="pg-toggle-row">
          <span class="pg-mono">showNavigator</span>
          <button type="button" class="pg-tog" :data-on="opts.showNavigator ? '1' : '0'"
            role="switch" :aria-checked="opts.showNavigator"
            @click="opts.showNavigator = !opts.showNavigator"><i /></button>
        </div>
        <div class="pg-row" v-if="opts.showNavigator">
          <div class="pg-row-hd"><span class="pg-mono">navigatorPosition</span></div>
          <select class="pg-select" v-model="opts.navigatorPosition">
            <option value="TOP_LEFT">Top Left</option>
            <option value="TOP_RIGHT">Top Right</option>
            <option value="BOTTOM_LEFT">Bottom Left</option>
            <option value="BOTTOM_RIGHT">Bottom Right</option>
          </select>
        </div>

        <!-- Controls -->
        <div class="pg-sect-hd">Controls</div>
        <div class="pg-toggle-row">
          <span class="pg-mono">showZoomControl</span>
          <button type="button" class="pg-tog" :data-on="opts.showZoomControl ? '1' : '0'"
            role="switch" :aria-checked="opts.showZoomControl"
            @click="opts.showZoomControl = !opts.showZoomControl"><i /></button>
        </div>
        <div class="pg-toggle-row">
          <span class="pg-mono">showHomeControl</span>
          <button type="button" class="pg-tog" :data-on="opts.showHomeControl ? '1' : '0'"
            role="switch" :aria-checked="opts.showHomeControl"
            @click="opts.showHomeControl = !opts.showHomeControl"><i /></button>
        </div>
        <div class="pg-toggle-row">
          <span class="pg-mono">showFullPageControl</span>
          <button type="button" class="pg-tog" :data-on="opts.showFullPageControl ? '1' : '0'"
            role="switch" :aria-checked="opts.showFullPageControl"
            @click="opts.showFullPageControl = !opts.showFullPageControl"><i /></button>
        </div>
        <div class="pg-toggle-row">
          <span class="pg-mono">showRotationControl</span>
          <button type="button" class="pg-tog" :data-on="opts.showRotationControl ? '1' : '0'"
            role="switch" :aria-checked="opts.showRotationControl"
            @click="opts.showRotationControl = !opts.showRotationControl"><i /></button>
        </div>

        <!-- Viewer -->
        <div class="pg-sect-hd">Viewer</div>
        <div class="pg-row">
          <div class="pg-row-hd">
            <span class="pg-mono">degrees</span>
            <span class="pg-badge">{{ opts.degrees }}°</span>
          </div>
          <input type="range" class="pg-slider" min="0" max="360" step="1" v-model.number="opts.degrees" />
        </div>
        <div class="pg-toggle-row">
          <span class="pg-mono">constrainDuringPan</span>
          <button type="button" class="pg-tog" :data-on="opts.constrainDuringPan ? '1' : '0'"
            role="switch" :aria-checked="opts.constrainDuringPan"
            @click="opts.constrainDuringPan = !opts.constrainDuringPan"><i /></button>
        </div>
        <div class="pg-toggle-row">
          <span class="pg-mono">immediateRender</span>
          <button type="button" class="pg-tog" :data-on="opts.immediateRender ? '1' : '0'"
            role="switch" :aria-checked="opts.immediateRender"
            @click="opts.immediateRender = !opts.immediateRender"><i /></button>
        </div>
        <div class="pg-toggle-row" style="align-items:flex-start;padding-top:2px;">
          <span class="pg-mono" style="line-height:28px;">background</span>
          <div class="pg-swatches">
            <button
              v-for="bg in BG_OPTIONS" :key="bg.value"
              :class="['pg-swatch', { active: opts.background === bg.value }]"
              :style="bg.style"
              :title="bg.label"
              :aria-label="bg.label"
              @click="opts.background = bg.value"
            ></button>
          </div>
        </div>

        <!-- Footer -->
        <div class="pg-sidebar-foot">
          <button class="pg-reset-btn" @click="resetOpts">↺ Reset to defaults</button>
        </div>
      </aside>

      <!-- ── Main: viewer + code ── -->
      <div class="pg-main">

        <!-- Viewer card -->
        <div class="pg-viewer-card">
          <div class="stage-chrome">
            <div class="stage-dots"><span></span><span></span><span></span></div>
            <span>playground.html</span>
            <div class="stage-meta">
              <span class="pg-mode-pill">
                <span class="dot" style="color:var(--accent)"></span>
                {{ DISPLAY_MODE_MAP[opts.displayMode].label }}
              </span>
              <span>zoom: <b>{{ zoomDisplay }}</b></span>
              <span v-if="loading" class="pg-loading-chip"><span class="dot live"></span>loading</span>
            </div>
          </div>
          <div class="pg-viewer-body" :style="{ background: opts.background === 'transparent' ? 'transparent' : opts.background }">
            <div ref="osdMount" class="pg-osd"></div>
            <div v-if="error" class="pg-error-overlay">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>
              {{ error }}
            </div>
          </div>
        </div>

        <!-- Code card -->
        <div class="pg-code-card">
          <div class="pg-code-toolbar">
            <span class="eyebrow" style="font-size:10px;letter-spacing:.07em;">
              <span class="dot"></span>GENERATED CODE
            </span>
            <button class="pg-copy-btn" @click="copyCode">
              <svg v-if="!copied" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
              <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.4"><path d="M5 12l4.5 4.5L19 6.5"/></svg>
              <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
            </button>
          </div>
          <pre class="pg-code"><code class="language-javascript" v-html="highlightedCode"></code></pre>
        </div>

      </div>
    </div>
    </div>

    <SiteFooter />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import { useOSDVersion } from '../composables/useOSDVersion.js'

const { prefixUrl } = useOSDVersion()

const TILE_SOURCES = [
  {
    key: 'art',
    label: 'Highsmith Archive',
    sub: 'DZI · 7026×9221 px',
    thumb: '/img/demo-art.jpg',
    src: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi',
  },
  {
    key: 'micro',
    label: 'Medical Slide',
    sub: 'IIIF · whole-slide',
    thumb: '/img/demo-micro.jpg',
    src: 'https://iiif.wellcomecollection.org/image/B0009508/info.json',
  },
  {
    key: 'maps',
    label: 'Survey Map',
    sub: 'IIIF · historical',
    thumb: '/img/demo-maps.jpg',
    src: 'https://iiif.wellcomecollection.org/image/L0072917/info.json',
  },
  {
    key: 'simple',
    label: 'Local Image',
    sub: 'JPEG · static file',
    thumb: '/img/demo-art.jpg',
    src: { type: 'image', url: '/img/demo-art.jpg' },
  },
]

const DISPLAY_MODES = [
  {
    key: 'sequence',
    label: 'Sequence',
    desc: 'One image at a time — prev/next navigation',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 12h8M15 9l3 3-3 3"/></svg>`,
  },
  {
    key: 'collection',
    label: 'Collection',
    desc: 'Grid layout — all images visible at once',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/></svg>`,
  },
  {
    key: 'sidebyside',
    label: 'Side by Side',
    desc: 'All images in a shared viewport',
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="2" y="5" width="9" height="14" rx="1.5"/><rect x="13" y="5" width="9" height="14" rx="1.5"/></svg>`,
  },
]
const DISPLAY_MODE_MAP = Object.fromEntries(DISPLAY_MODES.map(m => [m.key, m]))

const BG_OPTIONS = [
  { value: '#000000', label: 'Black', style: { background: '#000' } },
  { value: '#1a1a2e', label: 'Dark blue', style: { background: '#1a1a2e' } },
  { value: '#ffffff', label: 'White', style: { background: '#fff', boxShadow: 'inset 0 0 0 1px var(--line)' } },
  { value: 'transparent', label: 'Transparent', style: { background: 'conic-gradient(#666 25%, #444 25%, #444 50%, #666 50%, #666 75%, #444 75%) 0 0 / 8px 8px' } },
]

const DEFAULT_OPTS = {
  displayMode: 'sequence',
  // Sequence
  showReferenceStrip: true,
  showSequenceControl: true,
  // Collection
  collectionRows: 2,
  collectionTileMargin: 20,
  // Side by side
  sideSpacing: 1.05,
  // Animation
  animationTime: 1.2,
  blendTime: 0.1,
  springStiffness: 6.5,
  // Zoom
  zoomPerClick: 2.0,
  zoomPerScroll: 1.2,
  maxZoomPixelRatio: 8,
  minZoomImageRatio: 0.7,
  // Navigation
  showNavigator: true,
  navigatorPosition: 'TOP_RIGHT',
  // Controls
  showZoomControl: true,
  showHomeControl: true,
  showFullPageControl: false,
  showRotationControl: false,
  // Viewer
  degrees: 0,
  constrainDuringPan: true,
  immediateRender: false,
  background: '#000000',
}

const opts = reactive({ ...DEFAULT_OPTS })
const osdMount = ref(null)
let viewer = null
const zoomDisplay = ref('1.00×')
const loading = ref(false)
const error = ref('')
const copied = ref(false)

let rebuildTimer = null
let copyTimer = null

function buildCommonOpts() {
  const anyControl = opts.showZoomControl || opts.showHomeControl || opts.showFullPageControl || opts.showRotationControl
  return {
    element: osdMount.value,
    prefixUrl: prefixUrl.value,
    animationTime: opts.animationTime,
    blendTime: opts.blendTime,
    springStiffness: opts.springStiffness,
    zoomPerClick: opts.zoomPerClick,
    zoomPerScroll: opts.zoomPerScroll,
    maxZoomPixelRatio: opts.maxZoomPixelRatio,
    minZoomImageRatio: opts.minZoomImageRatio,
    visibilityRatio: 0.5,
    showNavigator: opts.showNavigator,
    navigatorPosition: opts.navigatorPosition,
    navigatorBackground: 'rgba(0,0,0,0.6)',
    navigatorBorderColor: 'transparent',
    navigatorDisplayRegionColor: 'var(--accent)',
    showNavigationControl: anyControl,
    showZoomControl: opts.showZoomControl,
    showHomeControl: opts.showHomeControl,
    showFullPageControl: opts.showFullPageControl,
    showRotationControl: opts.showRotationControl,
    degrees: opts.degrees,
    constrainDuringPan: opts.constrainDuringPan,
    immediateRender: opts.immediateRender,
    background: opts.background === 'transparent' ? '' : opts.background,
    crossOriginPolicy: 'Anonymous',
  }
}

function initViewer() {
  if (!osdMount.value || !window.OpenSeadragon) {
    error.value = 'OpenSeadragon is not loaded yet.'
    return
  }
  if (viewer) {
    try { viewer.destroy() } catch {}
    viewer = null
  }

  error.value = ''
  loading.value = true
  zoomDisplay.value = '1.00×'

  const allSrcs = TILE_SOURCES.map(ts => ts.src)
  const common = buildCommonOpts()

  if (opts.displayMode === 'sequence') {
    viewer = window.OpenSeadragon({
      ...common,
      tileSources: allSrcs,
      sequenceMode: true,
      showReferenceStrip: opts.showReferenceStrip,
      showSequenceControl: opts.showSequenceControl,
    })
  } else if (opts.displayMode === 'collection') {
    viewer = window.OpenSeadragon({
      ...common,
      tileSources: allSrcs,
      collectionMode: true,
      collectionRows: opts.collectionRows,
      collectionTileSize: 1024,
      collectionTileMargin: opts.collectionTileMargin,
    })
  } else {
    // side by side — use tileSources array with position objects
    const positioned = allSrcs.map((src, i) => ({
      tileSource: src,
      x: i * opts.sideSpacing,
      y: 0,
      width: 1,
    }))
    viewer = window.OpenSeadragon({
      ...common,
      tileSources: positioned,
    })
  }

  viewer.addHandler('open', () => { loading.value = false })
  viewer.addHandler('open-failed', () => {
    loading.value = false
    error.value = 'Failed to load one or more tile sources.'
  })
  viewer.addHandler('zoom', () => {
    if (viewer?.viewport) {
      zoomDisplay.value = viewer.viewport.getZoom(true).toFixed(2) + '×'
    }
  })
}

function scheduleRebuild() {
  clearTimeout(rebuildTimer)
  rebuildTimer = setTimeout(initViewer, 280)
}

function resetOpts() {
  Object.assign(opts, DEFAULT_OPTS)
}

async function copyCode() {
  try {
    await navigator.clipboard.writeText(rawCode.value)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 2000)
  } catch {}
}

const rawCode = computed(() => {
  const allSrcs = TILE_SOURCES.map(ts => ts.src)
  const srcLines = allSrcs.map(s =>
    typeof s === 'string'
      ? `    "${s}",`
      : `    { type: "${s.type}", url: "${s.url}" },`
  ).join('\n')

  const common = [
    `  prefixUrl: "${prefixUrl.value}",`,
    ``,
    `  // Animation`,
    `  animationTime: ${opts.animationTime},`,
    `  blendTime: ${opts.blendTime},`,
    `  springStiffness: ${opts.springStiffness},`,
    ``,
    `  // Zoom`,
    `  zoomPerClick: ${opts.zoomPerClick},`,
    `  zoomPerScroll: ${opts.zoomPerScroll},`,
    `  maxZoomPixelRatio: ${opts.maxZoomPixelRatio},`,
    `  minZoomImageRatio: ${opts.minZoomImageRatio},`,
    ``,
    `  // Navigation`,
    `  showNavigator: ${opts.showNavigator},`,
    ...(opts.showNavigator ? [`  navigatorPosition: "${opts.navigatorPosition}",`] : []),
    ``,
    `  // Controls`,
    `  showZoomControl: ${opts.showZoomControl},`,
    `  showHomeControl: ${opts.showHomeControl},`,
    `  showFullPageControl: ${opts.showFullPageControl},`,
    `  showRotationControl: ${opts.showRotationControl},`,
    ``,
    `  // Viewer`,
    `  degrees: ${opts.degrees},`,
    `  constrainDuringPan: ${opts.constrainDuringPan},`,
    `  immediateRender: ${opts.immediateRender},`,
    `  background: "${opts.background}",`,
  ].join('\n')

  if (opts.displayMode === 'sequence') {
    return [
      `const viewer = OpenSeadragon({`,
      `  id: "osd-viewer",`,
      `${common}`,
      ``,
      `  // Sequence mode`,
      `  tileSources: [`,
      srcLines,
      `  ],`,
      `  sequenceMode: true,`,
      `  showReferenceStrip: ${opts.showReferenceStrip},`,
      `  showSequenceControl: ${opts.showSequenceControl},`,
      `});`,
    ].join('\n')
  }

  if (opts.displayMode === 'collection') {
    return [
      `const viewer = OpenSeadragon({`,
      `  id: "osd-viewer",`,
      `${common}`,
      ``,
      `  // Collection mode`,
      `  tileSources: [`,
      srcLines,
      `  ],`,
      `  collectionMode: true,`,
      `  collectionRows: ${opts.collectionRows},`,
      `  collectionTileSize: 1024,`,
      `  collectionTileMargin: ${opts.collectionTileMargin},`,
      `});`,
    ].join('\n')
  }

  // side by side
  const posLines = allSrcs.map((s, i) => {
    const src = typeof s === 'string' ? `"${s}"` : `{ type: "${s.type}", url: "${s.url}" }`
    return `    { tileSource: ${src}, x: ${(i * opts.sideSpacing).toFixed(2)}, y: 0, width: 1 },`
  }).join('\n')

  return [
    `const viewer = OpenSeadragon({`,
    `  id: "osd-viewer",`,
    `${common}`,
    ``,
    `  // Side by side — each image placed at its own x position`,
    `  tileSources: [`,
    posLines,
    `  ],`,
    `});`,
  ].join('\n')
})

const highlightedCode = computed(() => {
  return Prism.highlight(rawCode.value, Prism.languages.javascript, 'javascript')
})

watch(opts, scheduleRebuild, { deep: true })

onMounted(() => {
  initViewer()
})

onUnmounted(() => {
  clearTimeout(rebuildTimer)
  clearTimeout(copyTimer)
  if (viewer) {
    try { viewer.destroy() } catch {}
    viewer = null
  }
})
</script>

<style scoped>
/* ── Workspace layout ── */
.pg-arena {
  position: relative;
}
.pg-arena::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right,  currentColor 1px, transparent 1px),
    linear-gradient(to bottom, currentColor 1px, transparent 1px);
  background-size: 80px 80px;
  color: var(--accent);
  opacity: 0.07;
  pointer-events: none;
  mask-image: radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 80%);
}
.pg-workspace {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  max-width: var(--container);
  margin: 0 auto;
  padding: 14px var(--pad) 80px;
}

/* ── Sidebar ── */
.pg-sidebar {
  width: 272px;
  flex-shrink: 0;
  position: sticky;
  top: 68px;
  max-height: calc(100vh - 80px);
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius-l);
  background: var(--ink-1);
  padding: 14px 14px 0;
  scrollbar-width: none;
}
.pg-sidebar::-webkit-scrollbar { display: none; }

.pg-sect-hd {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: .07em;
  text-transform: uppercase;
  color: var(--paper-mute);
  padding: 14px 0 8px;
  border-top: 1px solid var(--line-soft);
  margin-top: 4px;
}
.pg-sect-hd:first-child {
  padding-top: 0;
  border-top: none;
  margin-top: 0;
}

/* ── Display Mode picker ── */
.pg-mode-grid {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-bottom: 4px;
}
.pg-mode-opt {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  background: transparent;
  cursor: default;
  text-align: left;
  transition: border-color .12s, background .12s;
}
.pg-mode-opt:hover { border-color: var(--line); background: var(--ink-2); }
.pg-mode-opt.active {
  border-color: var(--accent);
  background: color-mix(in oklch, var(--accent) 8%, var(--ink-1));
}
.pg-mode-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-s);
  background: var(--ink-2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--paper-mute);
  transition: background .12s, color .12s;
}
.pg-mode-opt.active .pg-mode-icon {
  background: color-mix(in oklch, var(--accent) 15%, var(--ink-2));
  color: var(--accent);
}
.pg-mode-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.pg-mode-name {
  font-size: 12px;
  font-weight: 500;
  color: var(--paper-dim);
}
.pg-mode-opt.active .pg-mode-name { color: var(--paper); }
.pg-mode-desc {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--paper-mute);
  line-height: 1.4;
}

/* Slider rows */
.pg-row {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 2px 0 6px;
}
.pg-row-hd {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.pg-mono {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--paper-dim);
}
.pg-badge {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--accent);
  background: color-mix(in oklch, var(--accent) 10%, transparent);
  padding: 1px 5px;
  border-radius: 4px;
  font-variant-numeric: tabular-nums;
}
.pg-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: var(--ink-3);
  outline: none;
  cursor: default;
}
.pg-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--accent) 20%, transparent);
  transition: box-shadow .12s;
}
.pg-slider::-moz-range-thumb {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: var(--accent);
  border: none;
  box-shadow: 0 0 0 2px color-mix(in oklch, var(--accent) 20%, transparent);
}

/* Toggle rows */
.pg-toggle-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 3px 0;
}
.pg-tog {
  position: relative;
  width: 32px;
  height: 18px;
  border-radius: 999px;
  background: var(--ink-3);
  transition: background .15s;
  flex-shrink: 0;
  padding: 0;
}
.pg-tog[data-on="1"] { background: var(--accent); }
.pg-tog i {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: var(--paper-mute);
  box-shadow: 0 1px 2px rgba(0,0,0,.4);
  transition: transform .15s, background .15s;
  display: block;
}
.pg-tog[data-on="1"] i {
  transform: translateX(14px);
  background: var(--ink);
}

/* Select */
.pg-select {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 28px;
  padding: 0 26px 0 8px;
  border: 1px solid var(--line);
  border-radius: var(--radius-s);
  background: var(--ink-2);
  color: var(--paper-dim);
  font: inherit;
  font-family: var(--font-mono);
  font-size: 11.5px;
  outline: none;
  cursor: default;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(120,120,140,.7)' d='M0 0h10L5 6z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 8px center;
}
.pg-select:focus { border-color: var(--accent); }

/* Background swatches */
.pg-swatches { display: flex; gap: 6px; }
.pg-swatch {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-s);
  border: 2px solid transparent;
  padding: 0;
  cursor: default;
  transition: border-color .12s;
}
.pg-swatch.active { border-color: var(--accent); }
.pg-swatch:hover:not(.active) { border-color: var(--line); }

/* Sidebar footer */
.pg-sidebar-foot {
  padding: 14px 0 14px;
  border-top: 1px solid var(--line-soft);
  margin-top: 8px;
}
.pg-reset-btn {
  width: 100%;
  height: 30px;
  border: 1px solid var(--line);
  border-radius: var(--radius-s);
  background: transparent;
  color: var(--paper-mute);
  font-family: var(--font-mono);
  font-size: 11px;
  cursor: default;
  transition: border-color .12s, color .12s, background .12s;
}
.pg-reset-btn:hover {
  border-color: var(--line);
  color: var(--paper-dim);
  background: var(--ink-2);
}

/* ── Main area ── */
.pg-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Viewer card */
.pg-viewer-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-l);
  overflow: hidden;
  background: var(--ink-1);
}
.pg-viewer-body {
  position: relative;
  aspect-ratio: 16 / 9;
  min-height: 320px;
}
.pg-osd {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.pg-mode-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.pg-loading-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--paper-mute);
}
.pg-error-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: color-mix(in oklch, var(--ink) 85%, transparent);
  color: var(--paper-mute);
  font-size: 13px;
  font-family: var(--font-mono);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  padding: 20px;
  text-align: center;
}

/* Code card */
.pg-code-card {
  border: 1px solid var(--line);
  border-radius: var(--radius-l);
  overflow: hidden;
  background: var(--ink-1);
}
.pg-code-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--line-soft);
}
.pg-copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--paper-mute);
  border: 1px solid var(--line);
  border-radius: var(--radius-s);
  padding: 3px 10px 3px 8px;
  background: transparent;
  cursor: default;
  transition: border-color .12s, color .12s;
}
.pg-copy-btn:hover { border-color: var(--line); color: var(--paper-dim); }
.pg-code {
  margin: 0;
  padding: 16px 20px;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.7;
  color: var(--paper-dim);
  overflow-x: auto;
  max-height: 340px;
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}
.pg-code::-webkit-scrollbar { width: 6px; height: 6px; }
.pg-code::-webkit-scrollbar-thumb { background: var(--line); border-radius: 3px; }

/* Prism token colors — material dark palette */
:deep(.token.comment),
:deep(.token.prolog),
:deep(.token.doctype),
:deep(.token.cdata) { color: #7c8fa1; font-style: italic; }
:deep(.token.punctuation) { color: #89929b; }
:deep(.token.property),
:deep(.token.tag),
:deep(.token.boolean),
:deep(.token.number),
:deep(.token.constant),
:deep(.token.symbol) { color: #e5c07b; }
:deep(.token.selector),
:deep(.token.attr-name),
:deep(.token.string),
:deep(.token.char),
:deep(.token.builtin) { color: #98c379; }
:deep(.token.operator),
:deep(.token.entity),
:deep(.token.url),
:deep(.language-css .token.string),
:deep(.token.variable),
:deep(.token.inserted) { color: var(--accent); }
:deep(.token.atrule),
:deep(.token.attr-value),
:deep(.token.keyword) { color: #c678dd; }
:deep(.token.function),
:deep(.token.class-name) { color: #61afef; }
:deep(.token.regex),
:deep(.token.important) { color: #e5c07b; }
:deep(.token.deleted) { color: #e06c75; }

/* ── Responsive ── */
@media (max-width: 900px) {
  .pg-workspace {
    flex-direction: column;
    padding-top: 16px;
  }
  .pg-sidebar {
    width: 100%;
    position: static;
    max-height: none;
  }
  .pg-viewer-body {
    aspect-ratio: 4 / 3;
    min-height: 260px;
  }
}
</style>
