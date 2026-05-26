<template>
  <div>
    <div class="cursor-spot" id="cursor-spot" aria-hidden="true"></div>
    <NavBar />

    <!-- HERO -->
    <header class="hero" data-screen-label="02 Hero">
      <canvas id="tile-particles" class="tile-particles" aria-hidden="true"></canvas>
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
        <div class="eyebrow"><span class="dot"></span> {{ tag }} just shipped · MIT open source · zero dependencies</div>
        <div class="hero-grid" style="margin-top: 28px;">
          <div class="hero-copy">
            <h1 class="h-display">Deep zoom for<br/><em>massive</em> images.</h1>
            <p class="lede">A JavaScript viewer for high-resolution tiled images — maps, microscopy, manuscripts, anything that doesn't fit on a screen. Smooth at any scale. Yours to extend.</p>
            <div class="hero-cta">
              <RouterLink to="/docs" class="btn btn-primary">
                Get started
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </RouterLink>
              <span class="copy-snippet">
                <span class="muted">$</span>
                <code>bun add openseadragon</code>
                <button class="copy-btn" data-copy="bun add openseadragon" aria-label="Copy command">
                  <svg class="ic-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>
                  <svg class="ic-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12l4.5 4.5L19 6.5"/></svg>
                </button>
              </span>
            </div>
          </div>
        </div>

        <!-- INTERACTIVE STAGE -->
        <div class="hero-stage" id="hero-stage">
          <div class="stage-chrome">
            <div class="stage-dots"><span></span><span></span><span></span></div>
            <span>viewer.html — <span style="color:var(--paper-dim);">live</span></span>
            <div class="stage-meta">
              <span><b id="src-name">{{ srcName }}</b></span>
              <span>tiles loaded: <b>{{ tileCount }}</b></span>
              <span>zoom: <b>{{ zoomReadout }}</b></span>
            </div>
          </div>

          <div class="viewer-shell">
            <div id="osd-hero" class="osd-mount"></div>
            <svg class="viewer-wires" id="viewer-wires" aria-hidden="true" viewBox="0 0 800 450" preserveAspectRatio="none">
              <g stroke="currentColor" fill="none" stroke-width="0.6" vector-effect="non-scaling-stroke">
                <path d="M0 56 H800 M0 112 H800 M0 168 H800 M0 225 H800 M0 281 H800 M0 337 H800 M0 393 H800" class="wire-line"/>
                <path d="M100 0 V450 M200 0 V450 M300 0 V450 M400 0 V450 M500 0 V450 M600 0 V450 M700 0 V450" class="wire-line"/>
                <rect x="300" y="168" width="200" height="113" stroke-width="1.2" class="wire-focus"/>
                <path d="M400 168 V281 M300 225 H500" stroke-dasharray="2 4" class="wire-cross"/>
                <circle cx="400" cy="225" r="5" class="wire-dot" fill="currentColor"/>
                <path d="M20 20 H50 M20 20 V50 M780 20 H750 M780 20 V50 M20 430 H50 M20 430 V400 M780 430 H750 M780 430 V400" stroke-width="1" class="wire-ticks"/>
              </g>
              <g class="wire-labels" font-family="ui-monospace, monospace" font-size="9" fill="currentColor" opacity="0.7">
                <text x="28" y="34">L8 · 256²</text>
                <text x="700" y="34" text-anchor="end">7026 × 9221</text>
                <text x="28" y="424">tiles cached 0/—</text>
                <text x="700" y="424" text-anchor="end">zoom 1.00×</text>
              </g>
            </svg>
            <div class="scanline" aria-hidden="true"></div>
            <div class="viewer-overlay">
              <div class="ovl-tl"><span class="chip"><span class="dot"></span>LIVE · drag, scroll, pinch</span></div>
              <div class="ovl-cr" style="width:48px;height:196px">
                <div class="zoom-controls" aria-label="Zoom controls" style="width:48px;border-width:1px;justify-content:flex-start">
                  <button class="zc-btn zc-pri" id="zoom-in" aria-label="Zoom in">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
                  </button>
                  <div class="zc-rail-wrap" aria-hidden="true">
                    <div class="zc-rail" id="zc-rail">
                      <span class="zc-tick"></span><span class="zc-tick"></span><span class="zc-tick"></span><span class="zc-tick"></span><span class="zc-tick"></span>
                      <span class="zc-fill" id="zc-fill"></span>
                      <span class="zc-thumb" id="zc-thumb" tabindex="0" role="slider" aria-label="Zoom level" aria-valuemin="1" aria-valuemax="10" aria-valuenow="1">
                        <span class="zc-thumb-label" id="zc-thumb-label">1.0×</span>
                      </span>
                    </div>
                  </div>
                  <button class="zc-btn zc-pri" id="zoom-out" aria-label="Zoom out">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 12h14"/></svg>
                  </button>
                  <div class="zc-utils">
                    <button class="zc-btn zc-sec" id="zoom-home" aria-label="Reset view">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="5" width="14" height="14" rx="2"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/></svg>
                    </button>
                  </div>
                </div>
              </div>
              <div class="ovl-bl"><div class="scale-bar"><span>200 px</span><span class="bar"></span></div></div>
              <div class="ovl-bc"><span class="chip" id="hint-chip">SCROLL TO ZOOM · DOUBLE-CLICK TO DIVE</span></div>
              <div class="ovl-br"><div class="navigator-mini"><span class="nav-label">Navigator</span><div id="osd-hero-navigator"></div></div></div>
            </div>
          </div>

          <div class="container" style="padding-bottom:28px;padding-top:22px;">
            <div class="hero-strip">
              <div>SOURCE<br/><b id="strip-source">{{ stripSource }}</b></div>
              <div>TILES<br/><b>tiled image pyramid</b></div>
              <div>MEMORY<br/><b>only visible tiles in RAM</b></div>
              <div>RENDERER<br/><b>canvas2d · webgl optional</b></div>
            </div>
          </div>
        </div>
      </div>
    </header>

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
            <h2 class="h-section">Sixteen years of details, ready out of the box.</h2>
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

    <!-- EXAMPLES -->
    <section class="section-tight" id="examples" data-screen-label="06 Examples">
      <div class="container">
        <div class="section-head">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>EXAMPLES</span>
            <h2 class="h-section">Hover. Watch each card zoom into itself.</h2>
            <p class="sub">A live catalog of patterns — every example is a working HTML page with annotated source.</p>
          </div>
          <div class="right"><RouterLink to="/examples">All 38 examples →</RouterLink></div>
        </div>
        <div class="examples-grid" id="examples-grid"></div>
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
          <a class="pl-node" href="#"><span class="pl-mark">An</span><span class="pl-name">Annotorious</span></a>
          <a class="pl-node" href="#"><span class="pl-mark">Sc</span><span class="pl-name">Scalebar</span></a>
          <a class="pl-node" href="#"><span class="pl-mark">Fa</span><span class="pl-name">Fabric overlay</span></a>
          <a class="pl-node" href="#"><span class="pl-mark">Sv</span><span class="pl-name">SVG overlay</span></a>
          <a class="pl-node" href="#"><span class="pl-mark">Sh</span><span class="pl-name">Screenshot</span></a>
          <a class="pl-node" href="#"><span class="pl-mark">Fi</span><span class="pl-name">Filtering</span></a>
          <a class="pl-node" href="#"><span class="pl-mark">Le</span><span class="pl-name">Leaflet bridge</span></a>
          <a class="pl-node" href="#"><span class="pl-mark">Ge</span><span class="pl-name">GeoJSON</span></a>
          <a class="pl-node" href="#"><span class="pl-mark">Cu</span><span class="pl-name">Curtain</span></a>
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
            <p class="sub">Sixteen years in, still maintained by the people who use it.</p>
          </div>
        </div>
        <div class="community">
          <a class="community-card" href="#"><b>GitHub Discussions</b><p>Architecture questions, feature debate, and the long tail of release notes.</p><span class="more">github.com/openseadragon →</span></a>
          <a class="community-card" href="#"><b>Stack Overflow</b><p>1,400+ tagged questions. Common gotchas already answered.</p><span class="more">tag · openseadragon →</span></a>
          <a class="community-card" href="#"><b>Discord</b><p>Real-time chat with maintainers and users. IIIF interop, museum implementations, custom tile servers.</p><span class="more">join the server →</span></a>
          <a class="community-card" href="#"><b>Sponsor</b><p>Underwrite maintainer time. Logo on the homepage, gratitude in the changelog.</p><span class="more">open collective →</span></a>
        </div>
      </div>
    </section>

    <SiteFooter />

    <!-- Tweaks panel -->
    <TweaksPanel title="Tweaks">
      <div class="twk-sect">Theme</div>
      <TweakRadio label="Mode" v-model="tweaks.theme" :options="['dark', 'light']" />
      <TweakColor label="Accent" v-model="tweaks.accent"
        :options="[['#67d6ee','#0f1922','#f3fbfd'],['#ec8761','#180f0c','#fbf4f0'],['#c9ee5e','#0f1a08','#f6fbed'],['#b59afd','#120e1c','#f5f1fb']]"
      />
      <div class="twk-sect">Demo image</div>
      <TweakRadio label="Use case" v-model="tweaks.frame" :options="['art', 'micro', 'maps']" />
      <div class="twk-sect">Hero</div>
      <TweakRadio label="Layout" v-model="tweaks.heroLayout" :options="['left', 'centered']" />
    </TweaksPanel>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import NavBar from '../components/NavBar.vue'
import SiteFooter from '../components/SiteFooter.vue'
import TweaksPanel from '../components/TweaksPanel.vue'
import { TweakRadio, TweakColor } from '../components/tweaks/TweakControls.vue'
import { useParticles } from '../composables/useParticles.js'
import { usePluginsMap } from '../composables/usePluginsMap.js'
import { useAnimations, useCursorSpot, useCopyButtons, useCommunityTilt } from '../composables/useAnimations.js'
import { useOSDVersion } from '../composables/useOSDVersion.js'

// ── Reactive display state ──
const tileCount = ref('—')
const zoomReadout = ref('1.00×')
const srcName = ref('Highsmith Archive · Library of Congress')
const stripSource = ref('7,026 × 9,221 px · DZI pyramid')

// ── Tweaks state ──
const tweaks = reactive({ theme: 'dark', accent: 'aqua', frame: 'art', heroLayout: 'left' })

watch(() => tweaks.theme, val => document.documentElement.setAttribute('data-theme', val))
watch(() => tweaks.accent, val => document.documentElement.setAttribute('data-accent', val))
watch(() => tweaks.heroLayout, val => document.body.classList.toggle('hero-centered', val === 'centered'))
watch(() => tweaks.frame, val => { rebuildViewersForTheme(val) })

// ── Composables ──
const { tag, prefixUrl } = useOSDVersion()
useParticles('tile-particles', '.hero')
usePluginsMap()
useAnimations()
useCursorSpot()
useCopyButtons()
useCommunityTilt()

// ── OSD viewer state ──
let heroViewer = null
let secondaryViewer = null
let miniViewers = []
let currentTheme = 'art'

const DEMO_TILE_SOURCES = {
  art:   'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi',
  micro: 'https://iiif.wellcomecollection.org/image/B0009508/info.json',
  maps:  'https://iiif.wellcomecollection.org/image/L0072917/info.json'
}
function getDemoTileSource(theme) { return DEMO_TILE_SOURCES[theme] || DEMO_TILE_SOURCES.art }

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
    tileSources: getDemoTileSource(theme),
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

function initHeroViewer() {
  const mount = document.getElementById('osd-hero')
  if (!mount || !window.OpenSeadragon) return
  heroViewer = window.OpenSeadragon({
    element: mount,
    prefixUrl: prefixUrl.value,
    tileSources: getDemoTileSource(currentTheme),
    showNavigator: true, navigatorId: 'osd-hero-navigator',
    navigatorBackground: '#1a1a1a', navigatorBorderColor: 'transparent', navigatorDisplayRegionColor: '#7adff5',
    crossOriginPolicy: 'Anonymous',
    showNavigationControl: false, showZoomControl: false, showHomeControl: false, showFullPageControl: false,
    animationTime: 0.9, springStiffness: 6.5, blendTime: 0.1, immediateRender: false,
    zoomPerScroll: 1.5, minZoomImageRatio: 0.7, maxZoomPixelRatio: 8, visibilityRatio: 0.7, constrainDuringPan: true,
    gestureSettingsMouse: { scrollToZoom: true, clickToZoom: false, dblClickToZoom: true, flickEnabled: true },
    background: '#000'
  })
  let tilesLoaded = 0
  const zcThumb = document.getElementById('zc-thumb')
  const zcThumbLabel = document.getElementById('zc-thumb-label')
  const zcFill = document.getElementById('zc-fill')
  const zcRailWrap = document.querySelector('.zc-rail-wrap')

  function updateThumb() {
    if (!heroViewer || !heroViewer.viewport) return
    const z = heroViewer.viewport.getZoom(true)
    const minZ = heroViewer.viewport.getMinZoom(), maxZ = heroViewer.viewport.getMaxZoom()
    const t = Math.log(Math.max(z, minZ * 1.0001) / minZ) / Math.log(maxZ / minZ)
    const tc = Math.max(0, Math.min(1, t))
    if (zcThumb) { zcThumb.style.bottom = (tc * 100) + '%'; zcThumb.setAttribute('aria-valuenow', z.toFixed(2)) }
    if (zcThumbLabel) zcThumbLabel.textContent = z.toFixed(1) + '×'
    if (zcFill) zcFill.style.height = (tc * 100) + '%'
  }

  heroViewer.addHandler('open', () => {
    heroViewer.viewport.zoomTo(2.6, null, true)
    heroViewer.viewport.panTo(new window.OpenSeadragon.Point(0.45, 0.4), true)
    const wires = document.getElementById('viewer-wires')
    if (wires) { wires.classList.remove('show'); void wires.offsetWidth; wires.classList.add('show') }
    updateThumb()
    if (heroViewer.navigator) {
      setTimeout(() => {
        heroViewer.navigator.updateSize()
        heroViewer.navigator.viewport.goHome(true)
        heroViewer.navigator.update(heroViewer.viewport)
      }, 150)
    }
  })
  heroViewer.addHandler('zoom', () => { zoomReadout.value = heroViewer.viewport.getZoom(true).toFixed(2) + '×'; updateThumb() })
  heroViewer.addHandler('tile-loaded', () => { tilesLoaded++; tileCount.value = tilesLoaded.toLocaleString() })

  const zIn = document.getElementById('zoom-in'), zOut = document.getElementById('zoom-out')
  const zHm = document.getElementById('zoom-home')
  if (zIn)  zIn.addEventListener('click', () => heroViewer.viewport.zoomBy(1.5).applyConstraints())
  if (zOut) zOut.addEventListener('click', () => heroViewer.viewport.zoomBy(1/1.5).applyConstraints())
  if (zHm)  zHm.addEventListener('click', () => heroViewer.viewport.goHome())

  if (zcThumb && zcRailWrap) {
    const rail = zcRailWrap.querySelector('.zc-rail')
    function setZoomFromClientY(clientY) {
      const r = rail.getBoundingClientRect()
      const tc = 1 - Math.max(0, Math.min(1, (clientY - r.top) / r.height))
      const minZ = heroViewer.viewport.getMinZoom(), maxZ = heroViewer.viewport.getMaxZoom()
      heroViewer.viewport.zoomTo(minZ * Math.pow(maxZ / minZ, tc), null, false)
    }
    let dragging = false
    zcThumb.addEventListener('pointerdown', (e) => {
      dragging = true; zcThumb.classList.add('dragging')
      window.addEventListener('pointermove', onMove); window.addEventListener('pointerup', onUp); e.preventDefault()
    })
    function onMove(e) { if (!dragging) return; e.preventDefault(); setZoomFromClientY(e.clientY) }
    function onUp() { if (!dragging) return; dragging = false; zcThumb.classList.remove('dragging'); window.removeEventListener('pointermove', onMove); window.removeEventListener('pointerup', onUp) }
    zcRailWrap.addEventListener('click', (e) => { if (e.target === zcThumb || zcThumb.contains(e.target)) return; setZoomFromClientY(e.clientY) })
    zcThumb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp')   { heroViewer.viewport.zoomBy(1.2).applyConstraints(); e.preventDefault() }
      if (e.key === 'ArrowDown') { heroViewer.viewport.zoomBy(1/1.2).applyConstraints(); e.preventDefault() }
      if (e.key === 'Home')      { heroViewer.viewport.goHome(); e.preventDefault() }
    })
  }
  const hint = document.getElementById('hint-chip')
  if (hint) {
    const dismiss = () => { hint.style.transition = 'opacity 400ms'; hint.style.opacity = '0'; setTimeout(() => hint.remove(), 500) }
    heroViewer.addOnceHandler('canvas-drag', dismiss); heroViewer.addOnceHandler('canvas-scroll', dismiss)
  }
}

function initSecondaryViewer() {
  const mount = document.getElementById('osd-secondary')
  if (!mount || !window.OpenSeadragon) return
  secondaryViewer = window.OpenSeadragon({
    element: mount,
    prefixUrl: prefixUrl.value,
    tileSources: getDemoTileSource(currentTheme),
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

function paintExampleThumb(canvas, hue, level) {
  const w = canvas.width = 480, h = canvas.height = 360
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = `oklch(0.18 0.02 240)`; ctx.fillRect(0, 0, w, h)
  const cx = w * 0.55, cy = h * 0.5, r = w * 0.5
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
  grad.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.9)`)
  grad.addColorStop(0.4, `hsla(${(hue+30)%360}, 60%, 32%, 0.7)`)
  grad.addColorStop(1, `hsla(${hue}, 50%, 10%, 0.2)`)
  ctx.fillStyle = grad; ctx.fillRect(0, 0, w, h)
  ctx.lineCap = 'round'
  for (let i = 0; i < 24 + level*4; i++) {
    const s = (i * 9301 + level * 7919) % 233280 / 233280
    const s2 = ((i + 7) * 49297) % 233280 / 233280
    ctx.strokeStyle = `hsla(${(hue + i*8) % 360}, ${60 + s*30}%, ${30 + s2*40}%, ${0.3 + s*0.5})`
    ctx.lineWidth = 1 + s2 * 5; ctx.beginPath()
    ctx.moveTo(s * w, s2 * h); ctx.bezierCurveTo(s*w+80, s2*h-40, s2*w-60, s*h+70, s2*w, s*h); ctx.stroke()
  }
}

function buildExamples() {
  const grid = document.getElementById('examples-grid')
  if (!grid) return
  const items = [
    { tag: 'BASIC', title: 'Single tiled image', live: 'art' },
    { tag: 'IIIF', title: 'IIIF image service' },
    { tag: 'OVERLAYS', title: 'HTML & SVG overlays', live: 'maps' },
    { tag: 'SEQUENCE', title: 'Sequence mode slideshow' },
    { tag: 'COLLECTION', title: 'Collection mode grid' },
    { tag: 'CUSTOM CTRLS', title: 'Custom controls UI' },
    { tag: 'ANNOTATE', title: 'Annotation overlay' },
    { tag: 'COMPARE', title: 'Before / after curtain' },
    { tag: 'WEBGL', title: 'WebGL drawer + filters' }
  ]
  grid.innerHTML = items.map((it, i) => {
    const hue = (i * 41 + 200) % 360
    if (it.live) {
      return `<a class="example-card example-card-live" href="#"><div class="example-thumb"><div class="example-osd" id="osd-ex-${i}" data-theme="${it.live}"></div><div class="case-osd-frame" aria-hidden="true"><span class="corner tl"></span><span class="corner tr"></span><span class="corner bl"></span><span class="corner br"></span></div><div class="example-chip"><span class="dot live"></span> LIVE</div></div><div class="example-meta"><b>${it.title}</b><span class="tag">${it.tag}</span></div></a>`
    }
    return `<a class="example-card" href="#"><div class="example-thumb"><div class="img"><canvas data-hue="${hue}" data-level="${i}" style="width:100%;height:100%;display:block"></canvas></div><div class="reticle"><svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="22" cy="22" r="14"/><path d="M22 4v6M22 34v6M4 22h6M34 22h6"/><path d="M22 18v8M18 22h8"/></svg></div></div><div class="example-meta"><b>${it.title}</b><span class="tag">${it.tag}</span></div></a>`
  }).join('')
  grid.querySelectorAll('canvas[data-hue]').forEach(c => paintExampleThumb(c, +c.dataset.hue, +c.dataset.level))
  items.forEach((it, i) => {
    if (!it.live) return
    const mount = document.getElementById(`osd-ex-${i}`)
    if (!mount || !window.OpenSeadragon) return
    const v = window.OpenSeadragon({
      element: mount,
      prefixUrl: prefixUrl.value,
      tileSources: getDemoTileSource(it.live),
      showNavigator: false, showNavigationControl: false, mouseNavEnabled: false,
      gestureSettingsMouse: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
      gestureSettingsTouch: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
      gestureSettingsPen: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
      gestureSettingsUnknown: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
      animationTime: 6, springStiffness: 4, blendTime: 0.2, immediateRender: false,
      minZoomImageRatio: 0.8, maxZoomPixelRatio: 5, visibilityRatio: 1, constrainDuringPan: true, background: '#000'
    })
    v.addHandler('open', () => runTour(v))
    miniViewers.push(v)
    const card = mount.closest('.example-card')
    if (card && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => { entries.forEach(e => { v._osdPaused = !e.isIntersecting }) }, { threshold: 0.1 })
      io.observe(card)
    }
  })
}

function rebuildViewersForTheme(theme) {
  currentTheme = theme
  if (heroViewer) { heroViewer.destroy(); heroViewer = null }
  if (secondaryViewer) { secondaryViewer.destroy(); secondaryViewer = null }
  initHeroViewer(); initSecondaryViewer()
  if (theme === 'art')   { srcName.value = 'Highsmith Archive · Library of Congress'; stripSource.value = '7,026 × 9,221 px · DZI · 7 zoom levels' }
  if (theme === 'micro') { srcName.value = 'Skin tissue · fluorescence microscopy (Wellcome)'; stripSource.value = '4,792 × 3,654 px · IIIF level 2 · 6 zoom levels' }
  if (theme === 'maps')  { srcName.value = 'John Snow\'s Cholera Map, 1854 (Wellcome)'; stripSource.value = '4,757 × 4,418 px · IIIF level 2 · 7 zoom levels' }
}

onMounted(() => {
  buildExamples()
  initHeroViewer()
  initSecondaryViewer()
  miniViewers.push(initCaseViewer('osd-case-art', 'art'))
  miniViewers.push(initCaseViewer('osd-case-micro', 'micro'))
  miniViewers.push(initCaseViewer('osd-case-maps', 'maps'))
})

onUnmounted(() => {
  if (heroViewer) { heroViewer.destroy(); heroViewer = null }
  if (secondaryViewer) { secondaryViewer.destroy(); secondaryViewer = null }
  miniViewers.forEach(v => { if (v) v.destroy() })
  miniViewers = []
  document.body.classList.remove('hero-centered')
})
</script>
