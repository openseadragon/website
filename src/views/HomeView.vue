<template>
  <div>
    <NavBar />

    <!-- HERO -->
    <header class="hero" data-screen-label="02 Hero">
      <svg class="hero-wires" aria-hidden="true" viewBox="0 0 1280 720" preserveAspectRatio="none">
        <defs>
          <pattern id="wires-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.18"/>
          </pattern>
        </defs>
        <rect width="1280" height="720" fill="url(#wires-grid)"/>
        <g class="wires-marks" stroke="currentColor" stroke-width="0.6" fill="none" stroke-opacity="0.5">
          <circle cx="200" cy="180" r="36" stroke-dasharray="2 4"/>
          <circle cx="200" cy="180" r="3" fill="currentColor"/>
          <path d="M200 144 L200 100 M200 216 L200 260 M164 180 L120 180 M236 180 L280 180"/>
          <path d="M1040 540 l40 0 l0 -40" stroke-dasharray="3 3"/>
          <path d="M1100 100 l60 0 l0 60" stroke-dasharray="3 3"/>
        </g>
      </svg>

      <div class="container">
        <div class="eyebrow"><span class="dot"></span> {{ tag }} · New BSD · zero dependencies</div>
        <div class="hero-grid" style="margin-top: 8px;">
          <div class="hero-copy">
            <h1 class="hero-brand">OpenSeadragon</h1>
            <p class="hero-subtitle">Deep zoom for <em>massive</em> images.</p>
            <p class="lede">A JavaScript viewer for high-resolution tiled images — maps, microscopy, manuscripts, anything that doesn't fit on a screen. Smooth at any scale. Yours to extend.</p>
            <div class="hero-cta">
              <RouterLink to="/docs" class="btn btn-primary">
                Get started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </RouterLink>
              <span class="copy-snippet">
                <span class="muted">$</span>
                <code>npm install openseadragon</code>
                <button class="copy-btn" data-copy="npm install openseadragon" aria-label="Copy command">
                  <svg class="ic-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                  <svg class="ic-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l4.5 4.5L19 6.5"/></svg>
                </button>
              </span>
            </div>
          </div>
        </div>

      </div>
    </header>

    <!-- CODE + LIVE -->
    <section class="section-tight" data-screen-label="05 Code">
      <div class="container">
        <div class="section-head">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>SIX LINES</span>
            <h2 class="h-section">Same code as the demo on the right.</h2>
            <p class="sub">Drop one element. Point at a tile source. You're done. Everything else is opt-in.</p>
          </div>
        </div>
        <div class="split">
          <div class="codeblock">
            <header>
              <div class="stage-dots"><span></span><span></span><span></span></div>
              <span class="fname">viewer.html</span>
              <span style="margin-left:auto;">esm · 18 kB</span>
            </header>
            <pre><span class="tok-com">// 1. include the script</span>
<span class="tok-pun">&lt;</span><span class="tok-fn">script</span> <span class="tok-key">src</span><span class="tok-pun">=</span><span class="tok-str">"openseadragon.min.js"</span><span class="tok-pun">&gt;&lt;/</span><span class="tok-fn">script</span><span class="tok-pun">&gt;</span>

<span class="tok-com">// 2. drop a container</span>
<span class="tok-pun">&lt;</span><span class="tok-fn">div</span> <span class="tok-key">id</span><span class="tok-pun">=</span><span class="tok-str">"viewer"</span> <span class="tok-key">style</span><span class="tok-pun">=</span><span class="tok-str">"width:100%; height:600px"</span><span class="tok-pun">&gt;&lt;/</span><span class="tok-fn">div</span><span class="tok-pun">&gt;</span>

<span class="tok-com">// 3. point at a tile source</span>
<span class="tok-key">const</span> viewer <span class="tok-pun">=</span> <span class="tok-fn">OpenSeadragon</span><span class="tok-pun">({</span>
  <span class="tok-key">id</span>: <span class="tok-str">"viewer"</span>,
  <span class="tok-key">tileSources</span>: <span class="tok-str">"/tiles/painting.dzi"</span>,
  <span class="tok-key">showNavigator</span>: <span class="tok-num">true</span>,
  <span class="tok-key">zoomPerScroll</span>: <span class="tok-num">1.4</span>
<span class="tok-pun">});</span></pre>
          </div>
          <div class="live-stage">
            <div id="osd-secondary" class="osd-mount"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- QUICK LINKS -->
    <section class="section-tight" data-screen-label="02b Quick Links">
      <div class="container">
        <div class="quick-links">
          <div class="ql-group">
            <h3 class="ql-heading">Documentation</h3>
            <ul class="ql-list">
              <li><RouterLink to="/docs">Getting started</RouterLink></li>
              <li><RouterLink to="/docs/tilesource-dzi">DZI tile source</RouterLink></li>
              <li><RouterLink to="/docs/tilesource-iiif">IIIF tile source</RouterLink></li>
              <li><RouterLink to="/docs/viewport-coordinates">Viewport &amp; coordinates</RouterLink></li>
              <li><RouterLink to="/docs/ui-overlays">Overlays</RouterLink></li>
              <li><RouterLink to="/docs/creating-zooming-images">Creating zooming images</RouterLink></li>
            </ul>
          </div>
          <div class="ql-group">
            <h3 class="ql-heading">Try it</h3>
            <ul class="ql-list">
              <li><RouterLink to="/examples">Examples gallery</RouterLink></li>
              <li><RouterLink to="/playground">Live playground</RouterLink></li>
              <li><RouterLink to="/demos">CodePen demos</RouterLink></li>
              <li><RouterLink to="/in-the-wild">In the wild</RouterLink></li>
            </ul>
          </div>
          <div class="ql-group">
            <h3 class="ql-heading">Ecosystem</h3>
            <ul class="ql-list">
              <li><RouterLink to="/plugins">Plugin directory</RouterLink></li>
              <li><RouterLink to="/docs/api/OpenSeadragon">API reference</RouterLink></li>
              <li><RouterLink to="/docs/migration-v6">Migrating from v5</RouterLink></li>
              <li><a href="https://github.com/openseadragon/openseadragon" target="_blank" rel="noopener noreferrer">GitHub →</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- USE CASES -->
    <section class="section" data-screen-label="03 Use cases">
      <div class="container">
        <div class="section-head" style="margin-bottom: 16px;">
          <div class="left" style="max-width: 100%; width: 100%;">
            <span class="eyebrow"><span class="dot"></span>BUILT FOR</span>
            <h2 class="h-section">Wherever an image is too big to fit on screen.</h2>
            <RouterLink to="/examples" style="align-self: flex-end; color: var(--paper-dim); font-size: 14px;">See more in the gallery →</RouterLink>
          </div>
        </div>
        <div class="cases">
          <article class="case-card" data-case-theme="art">
            <div class="case-image">
              <div class="case-osd" id="osd-case-art" data-theme="art"></div>
              <div class="case-osd-frame" aria-hidden="true"><span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span></div>
              <div class="case-chip"><span class="dot live"></span> LIVE · auto-touring</div>
            </div>
            <div class="case-body">
              <span class="num">01 / Museums & archives</span>
              <h3 class="h-card">Read every brushstroke.</h3>
              <p>Power deep-zoom galleries for paintings, manuscripts, maps and rare-book collections. IIIF-native, multi-image friendly.</p>
            </div>
          </article>
          <article class="case-card" data-case-theme="micro">
            <div class="case-image">
              <div class="case-osd" id="osd-case-micro" data-theme="micro"></div>
              <div class="case-osd-frame" aria-hidden="true"><span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span></div>
              <div class="case-chip"><span class="dot live"></span> LIVE · auto-touring</div>
            </div>
            <div class="case-body">
              <span class="num">02 / Medical & microscopy</span>
              <h3 class="h-card">Cell to slide, in one gesture.</h3>
              <p>Render whole-slide pathology, electron microscopy, and astronomical composites with annotation overlays and measurements.</p>
            </div>
          </article>
          <article class="case-card" data-case-theme="maps">
            <div class="case-image">
              <div class="case-osd" id="osd-case-maps" data-theme="maps"></div>
              <div class="case-osd-frame" aria-hidden="true"><span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span></div>
              <div class="case-chip"><span class="dot live"></span> LIVE · auto-touring</div>
            </div>
            <div class="case-body">
              <span class="num">03 / Maps & geospatial</span>
              <h3 class="h-card">Custom tile sources, your way.</h3>
              <p>Bring your own DZI, IIIF, Zoomify, or write a TileSource in 20 lines. Overlay anything in pixel or image coordinates.</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- MARQUEE -->
    <section class="marquee-wrap" data-screen-label="03b Trusted by" aria-label="Trusted by">
      <div class="marquee-label"><span class="eyebrow"><span class="dot"></span>IN PRODUCTION AT</span></div>
      <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
          <span>Smithsonian</span><span class="sep">·</span><span>British Library</span><span class="sep">·</span>
          <span>National Gallery</span><span class="sep">·</span><span>NASA JPL</span><span class="sep">·</span>
          <span>e-codices</span><span class="sep">·</span><span>Rijksmuseum</span><span class="sep">·</span>
          <span>Library of Congress</span><span class="sep">·</span><span>Bodleian</span><span class="sep">·</span>
          <span>OpenSlide</span><span class="sep">·</span><span>Cambridge Digital</span><span class="sep">·</span>
          <span>Wellcome Collection</span><span class="sep">·</span><span>The Met</span><span class="sep">·</span>
          <span>Vatican Library</span><span class="sep">·</span><span>Internet Archive</span><span class="sep">·</span>
          <span>Smithsonian</span><span class="sep">·</span><span>British Library</span><span class="sep">·</span>
          <span>National Gallery</span><span class="sep">·</span><span>NASA JPL</span><span class="sep">·</span>
          <span>e-codices</span><span class="sep">·</span><span>Rijksmuseum</span><span class="sep">·</span>
          <span>Library of Congress</span><span class="sep">·</span><span>Bodleian</span><span class="sep">·</span>
          <span>OpenSlide</span><span class="sep">·</span><span>Cambridge Digital</span><span class="sep">·</span>
          <span>Wellcome Collection</span><span class="sep">·</span><span>The Met</span><span class="sep">·</span>
          <span>Vatican Library</span><span class="sep">·</span><span>Internet Archive</span><span class="sep">·</span>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section-tight" data-screen-label="04 Features">
      <div class="container">
        <div class="section-head">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>BUILT IN</span>
            <h2 class="h-section">{{ yearsActive }} years of details, ready out of the box.</h2>
            <p class="sub">No gradient compromises. No "but only if you also load…". The full set, tested across every browser that matters.</p>
          </div>
        </div>
        <div class="features">
          <div class="feature"><svg class="feature-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="4" width="10" height="10"/><rect x="18" y="4" width="10" height="10"/><rect x="4" y="18" width="10" height="10"/><rect x="18" y="18" width="10" height="10"/></svg><h4>Tile sources</h4><p>DZI, IIIF, OSM-style, Zoomify, Legacy, or your own subclass. Multi-resolution pyramids load on demand.</p></div>
          <div class="feature"><svg class="feature-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="3" fill="currentColor"/><path d="M16 2v6M16 24v6M2 16h6M24 16h6"/></svg><h4>Overlays</h4><p>Anchor DOM, SVG, or canvas elements in image coordinates. They track the user's pan, zoom and rotation perfectly.</p></div>
          <div class="feature"><svg class="feature-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="26" height="20" rx="2"/><rect x="18" y="14" width="8" height="6" fill="currentColor" stroke="none" opacity=".25"/><rect x="18" y="14" width="8" height="6"/></svg><h4>Navigator</h4><p>A minimap that mirrors the main view. Configurable, draggable, and aware of multi-image worlds.</p></div>
          <div class="feature"><svg class="feature-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M25 12a10 10 0 1 1-3-7"/><path d="M25 4v8h-8"/></svg><h4>Rotation</h4><p>Free rotation by degree, with flip and constrained-axis modes. Animates with the same easing the viewport uses.</p></div>
          <div class="feature"><svg class="feature-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="6" width="18" height="14"/><rect x="11" y="12" width="18" height="14"/></svg><h4>Multi-image</h4><p>Tile any number of images in one world. Compose collections, stitch composites, or wire sequence-mode for slideshows.</p></div>
          <div class="feature"><svg class="feature-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6h10v10H6zM16 16h10v10H16z"/><path d="M16 6l10 10M6 16l10 10" opacity=".4"/></svg><h4>Plugin ecosystem</h4><p>Filters, annotations, scalebar, screenshots, fabric.js, SVG overlay, GeoJSON — drop them in.</p></div>
          <div class="feature"><svg class="feature-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 22V8l8 5 8-9 8 11"/><path d="M4 26h24"/></svg><h4>WebGL drawer</h4><p>Opt-in WebGL rendering for smoother filters, blend modes, and large compositions on capable hardware.</p></div>
          <div class="feature"><svg class="feature-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="9" y="3" width="14" height="26" rx="3"/><circle cx="16" cy="25" r="1" fill="currentColor"/></svg><h4>Mobile gestures</h4><p>Pinch, double-tap, two-finger pan, momentum. Tuned for touch first; keyboard-accessible second.</p></div>
        </div>
      </div>
    </section>

    <!-- LEARN -->
    <section class="section-tight" id="learn" data-screen-label="05b Learn">
      <div class="container">
        <div class="section-head">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>LEARN</span>
            <h2 class="h-section">Go from beginner to builder.</h2>
            <p class="sub">The official course covers setup, coordinate systems, animation, and the full API &mdash; taught by Ian Gilman, creator and maintainer of OpenSeadragon.</p>
          </div>
        </div>
        <a class="course-card" href="https://www.newline.co/courses/openseadragon-deep-dive" target="_blank" rel="noopener noreferrer">
          <div class="course-card-body">
            <div class="course-badge">Newline &middot; Official Course</div>
            <h3 class="course-title">OpenSeadragon Deep Dive</h3>
            <p class="course-instructor">Ian Gilman &middot; creator &amp; maintainer</p>
            <ul class="course-topics">
              <li>Basic concepts &amp; setup</li>
              <li>Coordinate systems</li>
              <li>Animation</li>
              <li>Full API walkthrough</li>
            </ul>
          </div>
          <div class="course-card-cta">
            <span class="btn btn-primary">Enroll now &rarr;</span>
          </div>
        </a>
      </div>
    </section>

    <!-- EXAMPLES -->
    <section class="section-tight" id="examples" data-screen-label="06 Examples">
      <div class="container">
        <div class="section-head">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>EXAMPLES</span>
            <h2 class="h-section">Live demos, edit in the browser.</h2>
            <p class="sub">Click any card to open the live editor — tweak the code and see it update in real time.</p>
          </div>
          <div class="right"><RouterLink to="/examples">All {{ CODEPENS.length }} demos →</RouterLink></div>
        </div>
        <div class="home-demos-grid">
          <button
            v-for="pen in CODEPENS.slice(0, 6)"
            :key="pen.id"
            class="home-demo-card"
            :style="{ '--hue': pen.hue }"
            @click="activePen = pen"
            :aria-label="`Open ${pen.title} in editor`"
          >
            <div class="home-demo-thumb">
              <img
                :src="`https://codepen.io/iangilman/pen/${pen.id}/image/large.png`"
                :alt="pen.title"
                class="home-demo-img"
                loading="lazy"
                @error="e => e.target.style.display = 'none'"
              />
              <div class="home-demo-bg"></div>
              <div class="home-demo-play">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              </div>
            </div>
            <div class="home-demo-meta">
              <span class="home-demo-cat">{{ pen.cat }}</span>
              <b>{{ pen.title }}</b>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- PLUGINS MAP -->
    <section class="section-tight" id="plugins" data-screen-label="07 Plugins">
      <div class="container">
        <div class="section-head">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>EXTEND</span>
            <h2 class="h-section">A plugin for almost anything.</h2>
            <p class="sub">Filters, annotations, screenshots, scalebars, SVG overlays, fabric.js, GeoJSON, image-comparison sliders — community-built and battle-tested.</p>
          </div>
          <div class="right"><RouterLink to="/plugins">Browse all plugins →</RouterLink></div>
        </div>
        <div class="plugins-map" id="plugins-map">
          <canvas class="plugins-map-canvas" id="plugins-map-canvas" aria-hidden="true"></canvas>
          <div class="pl-hub">
            <span class="pl-hub-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linejoin="round" rx="1.5"/><rect x="8" y="8" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-opacity="0.55" rx="1.5"/><rect x="11" y="11" width="3" height="3" fill="currentColor"/></svg></span>
            <span class="pl-hub-title">openseadragon</span>
            <span class="pl-hub-sub">core viewer</span>
          </div>
          <RouterLink class="pl-node" to="/plugins"><span class="pl-mark">An</span><span class="pl-name">Annotorious</span></RouterLink>
          <RouterLink class="pl-node" to="/plugins"><span class="pl-mark">Sc</span><span class="pl-name">Scalebar</span></RouterLink>
          <RouterLink class="pl-node" to="/plugins"><span class="pl-mark">Fa</span><span class="pl-name">Fabric overlay</span></RouterLink>
          <RouterLink class="pl-node" to="/plugins"><span class="pl-mark">Sv</span><span class="pl-name">SVG overlay</span></RouterLink>
          <RouterLink class="pl-node" to="/plugins"><span class="pl-mark">Sh</span><span class="pl-name">Screenshot</span></RouterLink>
          <RouterLink class="pl-node" to="/plugins"><span class="pl-mark">Fi</span><span class="pl-name">Filtering</span></RouterLink>
          <RouterLink class="pl-node" to="/plugins"><span class="pl-mark">Le</span><span class="pl-name">Leaflet bridge</span></RouterLink>
          <RouterLink class="pl-node" to="/plugins"><span class="pl-mark">Ge</span><span class="pl-name">GeoJSON</span></RouterLink>
          <RouterLink class="pl-node" to="/plugins"><span class="pl-mark">Cu</span><span class="pl-name">Curtain</span></RouterLink>
        </div>
      </div>
    </section>

    <!-- COMMUNITY -->
    <section class="section-tight" id="community" data-screen-label="08 Community">
      <div class="container">
        <div class="section-head">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>COMMUNITY</span>
            <h2 class="h-section">Active. Patient. Open.</h2>
            <p class="sub">{{ yearsActive }} years in, still maintained by the people who use it.</p>
          </div>
        </div>
        <div class="community">
          <a class="community-card" href="https://github.com/openseadragon/openseadragon/discussions" target="_blank" rel="noopener noreferrer"><b>GitHub Discussions</b><p>Architecture questions, feature debate, and the long tail of release notes.</p><span class="more">github.com/openseadragon →</span></a>
          <a class="community-card" href="https://stackoverflow.com/questions/tagged/openseadragon" target="_blank" rel="noopener noreferrer"><b>Stack Overflow</b><p>1,400+ tagged questions. Common gotchas already answered.</p><span class="more">tag · openseadragon →</span></a>
          <a class="community-card" href="https://github.com/openseadragon/openseadragon/discussions" target="_blank" rel="noopener noreferrer"><b>Discord</b><p>Real-time chat with maintainers and users. IIIF interop, museum implementations, custom tile servers.</p><span class="more">join the server →</span></a>
          <a class="community-card" href="https://opencollective.com/openseadragon" target="_blank" rel="noopener noreferrer"><b>Sponsor</b><p>Underwrite maintainer time. Logo on the homepage, gratitude in the changelog.</p><span class="more">open collective →</span></a>
        </div>
      </div>
    </section>

    <PenEditor :pen="activePen" @close="activePen = null" />

    <SiteFooter />

    <!-- Tweaks panel -->
    <TweaksPanel title="Tweaks">
      <div class="twk-sect">Theme</div>
      <TweakRadio label="Mode" v-model="tweaks.theme" :options="['dark', 'light']" />
      <TweakColor label="Accent" v-model="tweaks._accentArr" :options="ACCENT_OPTIONS" />
    </TweaksPanel>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import PenEditor from '../components/PenEditor.vue'
import TweaksPanel from '../components/TweaksPanel.vue'
import { TweakRadio, TweakColor } from '../components/tweaks/TweakControls.vue'
import { usePluginsMap } from '../composables/usePluginsMap.js'
import { useAnimations, useCopyButtons } from '../composables/useAnimations.js'
import { useOSDVersion } from '../composables/useOSDVersion.js'
import { CODEPENS } from '../data/codepens.js'
import { yearsActive } from '../utils/osdMeta.js'

// ── Accent options ──
const ACCENT_OPTIONS = [
  ['#67d6ee','#0f1922','#f3fbfd'],
  ['#ec8761','#180f0c','#fbf4f0'],
  ['#c9ee5e','#0f1a08','#f6fbed'],
  ['#b59afd','#120e1c','#f5f1fb']
]
const ACCENT_NAME_MAP = { '#67d6ee': 'aqua', '#ec8761': 'coral', '#c9ee5e': 'lime', '#b59afd': 'violet' }

// ── Reactive state ──
const activePen = ref(null)
const tweaks = reactive({ theme: 'dark', accent: 'aqua', _accentArr: ACCENT_OPTIONS[0] })

watch(() => tweaks.theme, val => document.documentElement.setAttribute('data-theme', val))
watch(() => tweaks._accentArr, (v) => {
  const name = ACCENT_NAME_MAP[v[0]] || 'aqua'
  tweaks.accent = name
  document.documentElement.setAttribute('data-accent', name)
})

// ── Composables ──
const { tag, prefixUrl } = useOSDVersion()
usePluginsMap()
useAnimations()
useCopyButtons()

// ── OSD viewer state ──
let secondaryViewer = null
let miniViewers = []

const DEMO_TILE_SOURCES = {
  art:   'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi',
  micro: 'https://iiif.wellcomecollection.org/image/B0009508/info.json',
  maps:  'https://iiif.wellcomecollection.org/image/L0072917/info.json'
}

function runTour(v) {
  const points = [
    { x: 0.32, y: 0.35, z: 2.4 }, { x: 0.65, y: 0.48, z: 3.6 },
    { x: 0.5, y: 0.7, z: 2.0 },   { x: 0.42, y: 0.22, z: 4.2 },
    { x: 0.75, y: 0.65, z: 1.6 }, { x: 0.5, y: 0.5, z: 1.0 }
  ]
  let i = 0
  function next() {
    if (!v || !v.viewport || v.isDestroyed) return
    if (v._osdPaused) { setTimeout(next, 800); return }
    const p = points[i++ % points.length]
    try { v.viewport.zoomTo(p.z, null, false); v.viewport.panTo(new window.OpenSeadragon.Point(p.x, p.y), false) } catch {}
    setTimeout(next, 5200)
  }
  setTimeout(next, 400 + Math.random() * 1200)
}

function initCaseViewer(mountId, theme) {
  const mount = document.getElementById(mountId)
  if (!mount || !window.OpenSeadragon) return null
  const v = window.OpenSeadragon({
    element: mount,
    prefixUrl: prefixUrl.value,
    tileSources: DEMO_TILE_SOURCES[theme] || DEMO_TILE_SOURCES.art,
    showNavigator: false, showNavigationControl: false, mouseNavEnabled: false,
    gestureSettingsMouse: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
    gestureSettingsTouch: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
    gestureSettingsPen: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
    gestureSettingsUnknown: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
    animationTime: 4.5, springStiffness: 4.5, blendTime: 0.2, immediateRender: false,
    minZoomImageRatio: 0.8, maxZoomPixelRatio: 6, visibilityRatio: 1, constrainDuringPan: true, background: '#000'
  })
  v.addHandler('open', () => runTour(v))
  const card = mount.closest('.case-card')
  if (card && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => { entries.forEach(e => { v._osdPaused = !e.isIntersecting }) }, { threshold: 0.1 })
    io.observe(card)
  }
  return v
}

function initSecondaryViewer() {
  const mount = document.getElementById('osd-secondary')
  if (!mount || !window.OpenSeadragon) return
  secondaryViewer = window.OpenSeadragon({
    element: mount,
    prefixUrl: prefixUrl.value,
    tileSources: DEMO_TILE_SOURCES.art,
    showNavigator: true, navigatorPosition: 'TOP_RIGHT', navigatorHeight: '60px', navigatorWidth: '100px',
    crossOriginPolicy: 'Anonymous',
    showNavigationControl: false, animationTime: 0.9, zoomPerScroll: 1.4, background: '#000',
    minZoomImageRatio: 0.8, visibilityRatio: 0.8, constrainDuringPan: true
  })
  secondaryViewer.addHandler('open', () => {
    secondaryViewer.viewport.goHome(true)
    if (secondaryViewer.navigator) {
      setTimeout(() => {
        secondaryViewer.navigator.updateSize()
        secondaryViewer.navigator.viewport.goHome(true)
      }, 150)
    }
  })
}



onMounted(() => {
  initSecondaryViewer()
  miniViewers.push(initCaseViewer('osd-case-art', 'art'))
  miniViewers.push(initCaseViewer('osd-case-micro', 'micro'))
  miniViewers.push(initCaseViewer('osd-case-maps', 'maps'))
})

onUnmounted(() => {
  if (secondaryViewer) { secondaryViewer.destroy(); secondaryViewer = null }
  miniViewers.forEach(v => { if (v) v.destroy() })
  miniViewers = []
})
</script>
