<template>
  <div>
    <NavBar />

    <section class="section-tight" style="padding-top: 56px;">
      <div class="container">
        <div class="doc-layout">

          <!-- LEFT SIDEBAR -->
          <aside class="doc-side">
            <div class="doc-group">
              <h6>Getting started</h6>
              <a href="#getting-started" class="active">Quickstart</a>
              <a href="#">Installation</a>
              <a href="#">Your first viewer</a>
              <a href="#">Creating tiles</a>
              <a href="#">Common pitfalls</a>
            </div>
            <div class="doc-group">
              <h6>Guides</h6>
              <a href="#">Basic configuration</a>
              <a href="#">Tile sources</a>
              <a href="#">Viewport &amp; coordinates</a>
              <a href="#">Overlays</a>
              <a href="#">Controls &amp; UI</a>
              <a href="#">Multi-image worlds</a>
              <a href="#">Events</a>
            </div>
            <div class="doc-group">
              <h6>Frameworks</h6>
              <a href="#">Vanilla JS</a>
              <a href="#">React</a>
              <a href="#">Vue</a>
              <a href="#">Svelte</a>
              <a href="#">Solid</a>
              <a href="#">Lit / Web Components</a>
              <a href="#">Angular</a>
              <a href="#">Electron</a>
              <a href="#">Tauri</a>
              <a href="#">Qt WebEngine</a>
            </div>
            <div class="doc-group">
              <h6>API</h6>
              <a href="#api">Viewer</a>
              <a href="#">Viewport</a>
              <a href="#">World</a>
              <a href="#">TiledImage</a>
              <a href="#">TileSource</a>
              <a href="#">Overlay</a>
              <a href="#">MouseTracker</a>
              <a href="#">Events</a>
              <a href="#">Options</a>
            </div>
            <div class="doc-group">
              <h6>Migration</h6>
              <a href="#">v5 → v6</a>
              <a href="#">v3 → v4</a>
              <a href="#">v2 → v3</a>
            </div>
          </aside>

          <!-- MAIN CONTENT -->
          <article class="doc-body" id="getting-started">
            <div class="crumbs">
              <a href="#">Docs</a> <span>/</span> <a href="#">Getting started</a> <span>/</span>
              <span style="color:var(--paper-dim);">Quickstart</span>
            </div>
            <h1>Quickstart</h1>
            <p class="doc-lede">A working deep-zoom viewer in five minutes. Drop in a script tag,
              add a container, point at a tile source — that's the whole shape.</p>

            <h2>1. Install</h2>
            <p>Use the package manager you already use. OpenSeadragon ships as an ESM module,
              a UMD bundle, and a single-file IIFE for plain HTML.</p>

            <div class="codeblock" style="margin-bottom: 22px;">
              <header>
                <div class="stage-dots"><span></span><span></span><span></span></div>
                <span class="fname">terminal</span>
              </header>
              <pre><span class="tok-com"># bun</span>
<span class="tok-pun">$</span> bun add openseadragon

<span class="tok-com"># or grab the CDN build</span>
<span class="tok-pun">&lt;</span><span class="tok-fn">script</span> <span class="tok-key">src</span><span class="tok-pun">=</span><span class="tok-str">"https://cdn.jsdelivr.net/npm/openseadragon@6/build/openseadragon/openseadragon.min.js"</span><span class="tok-pun">&gt;&lt;/</span><span class="tok-fn">script</span><span class="tok-pun">&gt;</span></pre>
            </div>

            <h2>2. Add a sized container</h2>
            <p>The container <code>div</code> must have a width and a height before initialization.
              This is the single most common gotcha — an empty <code>div</code> renders nothing.</p>

            <div class="codeblock" style="margin-bottom: 22px;">
              <header>
                <div class="stage-dots"><span></span><span></span><span></span></div>
                <span class="fname">index.html</span>
              </header>
              <pre><span class="tok-pun">&lt;</span><span class="tok-fn">div</span>
  <span class="tok-key">id</span><span class="tok-pun">=</span><span class="tok-str">"viewer"</span>
  <span class="tok-key">style</span><span class="tok-pun">=</span><span class="tok-str">"width:100%; height:600px"</span>
<span class="tok-pun">&gt;&lt;/</span><span class="tok-fn">div</span><span class="tok-pun">&gt;</span></pre>
            </div>

            <div class="callout">
              <b>Heads up</b>
              If you're inside a flex parent, set the container's height explicitly or give the
              parent a defined height. <code>100%</code> with no anchor will collapse to zero.
            </div>

            <h2>3. Mount the viewer</h2>
            <p>Pass a <code>tileSources</code> URL — DZI, IIIF info.json, or a custom source.
              Everything else has sensible defaults; tweak as you go.</p>

            <div class="codeblock" style="margin-bottom: 22px;">
              <header>
                <div class="stage-dots"><span></span><span></span><span></span></div>
                <span class="fname">main.js</span>
                <span style="margin-left:auto;">esm · 18 kB</span>
              </header>
              <pre><span class="tok-key">import</span> OpenSeadragon <span class="tok-key">from</span> <span class="tok-str">"openseadragon"</span><span class="tok-pun">;</span>

<span class="tok-key">const</span> viewer <span class="tok-pun">=</span> <span class="tok-fn">OpenSeadragon</span><span class="tok-pun">({</span>
  <span class="tok-key">id</span>: <span class="tok-str">"viewer"</span>,
  <span class="tok-key">tileSources</span>: <span class="tok-str">"/tiles/painting.dzi"</span>,
  <span class="tok-key">prefixUrl</span>: <span class="tok-str">"/openseadragon/images/"</span>,
  <span class="tok-key">showNavigator</span>: <span class="tok-num">true</span>,
  <span class="tok-key">zoomPerScroll</span>: <span class="tok-num">1.4</span>,
  <span class="tok-key">gestureSettingsMouse</span>: <span class="tok-pun">{</span> <span class="tok-key">clickToZoom</span>: <span class="tok-num">false</span> <span class="tok-pun">}</span>
<span class="tok-pun">});</span>

<span class="tok-com">// listen for events whenever you're ready</span>
viewer.<span class="tok-fn">addHandler</span><span class="tok-pun">(</span><span class="tok-str">"zoom"</span>, <span class="tok-pun">(</span>e<span class="tok-pun">)</span> <span class="tok-pun">=&gt;</span> <span class="tok-pun">{</span>
  <span class="tok-fn">console</span>.<span class="tok-fn">log</span><span class="tok-pun">(</span>viewer.viewport.<span class="tok-fn">getZoom</span><span class="tok-pun">());</span>
<span class="tok-pun">});</span></pre>
            </div>

            <h2>4. Next steps</h2>
            <ul>
              <li>Read the <a href="#" style="color:var(--accent);">Viewport &amp; coordinates</a> guide — it unlocks overlays.</li>
              <li>Try <a href="#" style="color:var(--accent);">multi-image worlds</a> if you have more than one image.</li>
              <li>Browse the <RouterLink to="/examples" style="color:var(--accent);">examples gallery</RouterLink> for working starting points.</li>
              <li>If your tile pyramid doesn't exist yet, see <a href="#" style="color:var(--accent);">Creating tiles</a>.</li>
            </ul>

            <!-- API SECTION -->
            <h2 id="api" style="margin-top: 64px;">Viewer · selected API</h2>
            <p>The most-reached-for methods on the <code>Viewer</code> instance. Full reference under
              <a href="#" style="color:var(--accent);">API → Viewer</a>.</p>

            <div class="api-table">
              <div class="api-row"><span>Name</span><span>Returns</span><span>Summary</span></div>
              <div class="api-row"><span class="name">.open(source)</span><span class="type">void</span><span>Load a tile source (DZI, IIIF, custom). Re-callable.</span></div>
              <div class="api-row"><span class="name">.viewport.zoomTo(z, point?)</span><span class="type">Viewport</span><span>Animate zoom to <code>z</code>. Optional pivot point in image coords.</span></div>
              <div class="api-row"><span class="name">.viewport.panTo(point)</span><span class="type">Viewport</span><span>Animate pan to a normalized viewport point.</span></div>
              <div class="api-row"><span class="name">.addOverlay(el, location)</span><span class="type">void</span><span>Anchor a DOM element in image space. Tracks pan/zoom/rotation.</span></div>
              <div class="api-row"><span class="name">.world.addItem(tiledImage)</span><span class="type">void</span><span>Append another image to the world. Use for multi-image.</span></div>
              <div class="api-row"><span class="name">.setFullScreen(bool)</span><span class="type">void</span><span>Enter or exit fullscreen mode.</span></div>
              <div class="api-row"><span class="name">.addHandler(event, fn)</span><span class="type">void</span><span>Subscribe to a viewer event. See Events.</span></div>
              <div class="api-row"><span class="name">.destroy()</span><span class="type">void</span><span>Tear down listeners and DOM. Call before re-mounting.</span></div>
            </div>

            <h3>Common events</h3>
            <div class="api-table">
              <div class="api-row"><span>Event</span><span>Payload</span><span>Fires when…</span></div>
              <div class="api-row"><span class="name">open</span><span class="type">{ source }</span><span>A tile source has loaded and is ready.</span></div>
              <div class="api-row"><span class="name">zoom</span><span class="type">{ zoom }</span><span>Viewport zoom changes. Throttle for UI.</span></div>
              <div class="api-row"><span class="name">pan</span><span class="type">{ center }</span><span>Viewport center changes.</span></div>
              <div class="api-row"><span class="name">tile-loaded</span><span class="type">{ tile }</span><span>A tile image has decoded and entered the world.</span></div>
              <div class="api-row"><span class="name">canvas-click</span><span class="type">{ position }</span><span>Pointer event in canvas coordinates.</span></div>
              <div class="api-row"><span class="name">animation</span><span class="type">{ }</span><span>Per-frame while the viewport is animating.</span></div>
            </div>

            <h2 id="migration" style="margin-top: 64px;">Migrating from v5</h2>
            <p>Most v4 code runs unchanged on v5. The breaking surface is small and scoped.
              The full table is in the <a href="#" style="color:var(--accent);">v5 → v6 guide</a>.</p>
            <ul>
              <li>The default drawer is still <code>canvas</code>. Opt into <code>webgl</code> via <code>drawer: "webgl"</code>.</li>
              <li><code>useCanvas</code> was removed (it's been the default for a decade).</li>
              <li>Plugin lifecycle now expects an explicit <code>destroy()</code>; old plugins may leak listeners on hot-reload.</li>
              <li>IIIF 3.0 image profiles are recognized without the legacy shim.</li>
            </ul>

            <div class="callout">
              <b>Upgrade in one minute</b>
              <code>bun add openseadragon@latest</code> — your existing viewer config is
              almost certainly fine. Read the migration page only if you wrote a custom drawer
              or a plugin that touches internal tile state.
            </div>

            <!-- WHAT'S NEW -->
            <h2 style="margin-top: 64px;">Recent releases</h2>
            <div class="whatsnew">
              <a href="#">
                <span class="v">v6.0.2 · 3 days ago</span>
                <b>WebGL drawer, stable</b>
                <p>Smoother filters and blend modes. Opt-in, drop-out — canvas remains the default.</p>
              </a>
              <a href="#">
                <span class="v">v5.0 · 8 months ago</span>
                <b>Sequence-mode performance</b>
                <p>Pre-fetch logic rewritten; transitions stay 60fps on long sequences.</p>
              </a>
              <a href="#">
                <span class="v">v4.1 · 18 months ago</span>
                <b>New plugin lifecycle</b>
                <p>Explicit <code>create / destroy</code>. SSR-friendly. Predictable on hot reload.</p>
              </a>
            </div>
          </article>

          <!-- RIGHT TOC -->
          <aside class="doc-toc">
            <h6>On this page</h6>
            <a href="#" :class="{ active: tocActive === 'install' }" @click.prevent="scrollTo('install')">Install</a>
            <a href="#" :class="{ active: tocActive === 'container' }" @click.prevent="scrollTo('container')">Add a container</a>
            <a href="#" :class="{ active: tocActive === 'mount' }" @click.prevent="scrollTo('mount')">Mount the viewer</a>
            <a href="#" :class="{ active: tocActive === 'next' }" @click.prevent="scrollTo('next')">Next steps</a>
            <a href="#api" :class="{ active: tocActive === 'api' }">API surface</a>
            <a href="#" :class="{ active: tocActive === 'events' }" @click.prevent="scrollTo('events')">Common events</a>
            <a href="#migration" :class="{ active: tocActive === 'migration' }">Migrating from v5</a>
            <a href="#" :class="{ active: tocActive === 'releases' }" @click.prevent="scrollTo('releases')">Recent releases</a>
            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--line-soft);">
              <h6 style="margin-bottom: 12px;">Help us</h6>
              <a href="#" style="color: var(--paper-dim);">Edit this page</a>
              <a href="#" style="color: var(--paper-dim);">Report an issue</a>
              <a href="#" style="color: var(--paper-dim);">Discuss in GitHub</a>
            </div>
          </aside>

        </div>
      </div>
    </section>

    <SiteFooter />

    <!-- TWEAKS PANEL -->
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio
        label="Mode"
        v-model="tweaks.theme"
        :options="['dark', 'light']"
      />
      <TweakColor
        label="Accent"
        v-model="tweaks.accent"
        :options="accentOptions"
      />
      <div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.08);font-size:11px;font-family:ui-monospace,monospace;color:rgba(255,255,255,0.45);line-height:1.5">
        Settings sync to the homepage too.
      </div>
    </TweaksPanel>
  </div>
</template>

<script setup>
import { reactive, watch, ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TweaksPanel from '@/components/TweaksPanel.vue'
import { TweakSection, TweakRadio, TweakColor } from '@/components/tweaks/TweakControls.vue'
import { useAnimations } from '@/composables/useAnimations.js'

const ACCENT_OPTIONS = [
  ['#67d6ee', '#0f1922', '#f3fbfd'],
  ['#ec8761', '#180f0c', '#fbf4f0'],
  ['#c9ee5e', '#0f1a08', '#f6fbed'],
  ['#b59afd', '#120e1c', '#f5f1fb']
]

const ACCENT_NAME_MAP = {
  '#67d6ee': 'aqua',
  '#ec8761': 'coral',
  '#c9ee5e': 'lime',
  '#b59afd': 'violet'
}

const ACCENT_COLOR_MAP = {
  aqua: ACCENT_OPTIONS[0],
  coral: ACCENT_OPTIONS[1],
  lime: ACCENT_OPTIONS[2],
  violet: ACCENT_OPTIONS[3]
}

const html = document.documentElement
const savedTheme = localStorage.getItem('osd-theme') || html.getAttribute('data-theme') || 'dark'
const savedAccent = html.getAttribute('data-accent') || 'aqua'

const tweaks = reactive({
  theme: savedTheme,
  accent: savedAccent,
  _accentArr: ACCENT_COLOR_MAP[savedAccent] || ACCENT_OPTIONS[0]
})

const accentOptions = ACCENT_OPTIONS

const tocActive = ref('install')

watch(() => tweaks.theme, (v) => {
  html.setAttribute('data-theme', v)
  try { localStorage.setItem('osd-theme', v) } catch (_) {}
})

watch(() => tweaks._accentArr, (v) => {
  const name = ACCENT_NAME_MAP[v[0]] || 'aqua'
  tweaks.accent = name
  html.setAttribute('data-accent', name)
})

watch(() => tweaks.accent, (v) => {
  html.setAttribute('data-accent', v)
  tweaks._accentArr = ACCENT_COLOR_MAP[v] || ACCENT_OPTIONS[0]
})

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

useAnimations()

onMounted(() => {
  document.title = 'Docs — OpenSeadragon'
})
</script>
