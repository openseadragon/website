<template>
  <div>
    <NavBar />

    <!-- HERO -->
    <header class="page-hero">
      <canvas id="tile-particles" class="tile-particles" aria-hidden="true"></canvas>
      <div class="cursor-spot" id="cursor-spot" aria-hidden="true"></div>
      <svg class="hero-wires" aria-hidden="true" viewBox="0 0 1280 480" preserveAspectRatio="none">
        <defs>
          <pattern id="cmwires-grid" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.18"/>
          </pattern>
        </defs>
        <rect width="1280" height="480" fill="url(#cmwires-grid)"/>
      </svg>
      <div class="container">
        <span class="eyebrow"><span class="dot"></span>SIXTEEN YEARS · STILL SHIPPING · STILL OPEN</span>
        <h1 class="h-display" style="margin-top:18px;">Active.<br/>Patient. <em>Open.</em></h1>
        <p class="lede" style="margin-top:20px;">The same handful of people who started OpenSeadragon in 2010 are
          still maintaining it. Sponsor their time, file a thoughtful issue, or
          ship the thing you've been building — there's room here.</p>
      </div>
    </header>

    <!-- STATS -->
    <section class="section-tight" style="padding-top:0;padding-bottom:20px;">
      <div class="container">
        <div class="big-stats">
          <div class="big-stat">
            <span>GitHub stars</span>
            <b ref="starsEl">{{ displayStats.stars }}</b>
            <small>+128 this month</small>
          </div>
          <div class="big-stat">
            <span>Contributors</span>
            <b ref="contribEl">{{ displayStats.contrib }}</b>
            <small>across 16 years</small>
          </div>
          <div class="big-stat">
            <span>npm downloads / month</span>
            <b ref="dlEl">{{ displayStats.dl }}</b>
            <small>steady since 2022</small>
          </div>
          <div class="big-stat">
            <span>Issues closed</span>
            <b ref="issuesEl">{{ displayStats.issues }}</b>
            <small>median 4 days</small>
          </div>
        </div>
      </div>
    </section>

    <!-- IN THE WILD -->
    <section class="section-tight">
      <div class="container">
        <div class="section-head" style="margin-bottom: 28px;">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>IN THE WILD</span>
            <h2 class="h-section">Shipping in production at…</h2>
            <p class="sub">A few highlights from the maintainer-curated list — museums, hospitals, mapping agencies, and game communities.</p>
          </div>
          <div class="right"><RouterLink to="/in-the-wild">See all projects →</RouterLink></div>
        </div>

        <div class="show-tell">
          <a class="show-tell-card" style="--card-accent: oklch(0.78 0.15 80);" href="http://www.loc.gov/maps" target="_blank" rel="noopener">
            <span class="st-chip">MAPS · HISTORICAL</span>
            <div class="show-tell-body">
              <span class="org">Library of Congress</span>
              <b>Map Division digital collection</b>
              <p>America's national library serves its digitized map collection via OSD — from Civil War surveys to panoramic city views.</p>
              <div class="stats"><span><b>Geography</b> division</span><span><b>300 DPI</b> scans</span><span><b>multi-era</b></span></div>
            </div>
          </a>
          <a class="show-tell-card" style="--card-accent: oklch(0.76 0.14 170);" href="http://cancer.digitalslidearchive.net/" target="_blank" rel="noopener">
            <span class="st-chip">WHOLE-SLIDE · PATHOLOGY</span>
            <div class="show-tell-body">
              <span class="org">Digital Slide Archive</span>
              <b>Cancer pathology slide viewer</b>
              <p>Whole-slide pathology images from TCGA cancer studies. Pan/zoom across H&amp;E-stained tissue at cellular resolution.</p>
              <div class="stats"><span><b>TCGA</b> data</span><span><b>H&amp;E</b> stain</span><span><b>multi-cancer</b></span></div>
            </div>
          </a>
          <a class="show-tell-card" style="--card-accent: oklch(0.76 0.17 295);" href="http://www.proteinatlas.org/" target="_blank" rel="noopener">
            <span class="st-chip">SCIENTIFIC · MICROSCOPY</span>
            <div class="show-tell-body">
              <span class="org">Human Protein Atlas</span>
              <b>Protein expression image browser</b>
              <p>A comprehensive map of all human proteins in cells, tissues and organs — IHC microscopy images at full resolution.</p>
              <div class="stats"><span><b>26K</b> proteins</span><span><b>IHC</b> staining</span><span><b>44</b> tissue types</span></div>
            </div>
          </a>
          <a class="show-tell-card" style="--card-accent: oklch(0.78 0.16 35);" href="https://www.artic.edu/" target="_blank" rel="noopener">
            <span class="st-chip">ART · HIGH-RES</span>
            <div class="show-tell-body">
              <span class="org">Art Institute of Chicago</span>
              <b>Online collection viewer</b>
              <p>One of the largest art museums in the US, delivering deep-zoom views of artworks for remote inspection and scholarship.</p>
              <div class="stats"><span><b>300K+</b> objects</span><span><b>open access</b></span><span><b>CC0</b> images</span></div>
            </div>
          </a>
          <a class="show-tell-card" style="--card-accent: oklch(0.78 0.18 135);" href="http://map.projectzomboid.com/" target="_blank" rel="noopener">
            <span class="st-chip">GAMING · TILE MAP</span>
            <div class="show-tell-body">
              <span class="org">Project Zomboid Community</span>
              <b>Interactive world map</b>
              <p>Community-built tile map viewer for the survival game. OSD handles pan/zoom across the entire hand-crafted game world.</p>
              <div class="stats"><span><b>open-world</b></span><span><b>tile-based</b></span><span><b>community</b></span></div>
            </div>
          </a>
          <a class="show-tell-card" style="--card-accent: oklch(0.76 0.14 235);" href="https://wellcomecollection.org/works" target="_blank" rel="noopener">
            <span class="st-chip">HERITAGE · IIIF</span>
            <div class="show-tell-body">
              <span class="org">Wellcome Collection</span>
              <b>Digital library browser</b>
              <p>London's free museum and library for the history of medicine. Hundreds of thousands of images spanning five centuries.</p>
              <div class="stats"><span><b>45K+</b> works</span><span><b>IIIF</b> 3.0</span><span><b>5 centuries</b></span></div>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- ACTIVITY FEED -->
    <section class="section-tight">
      <div class="container">
        <div class="section-head" style="margin-bottom: 24px;">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>RECENTLY</span>
            <h2 class="h-section">What's happening, this week.</h2>
          </div>
          <div class="right"><a href="#">Full activity on GitHub →</a></div>
        </div>

        <div class="activity-feed">
          <div class="activity-col">
            <h4>Commits &amp; releases</h4>
            <ul class="activity-list">
              <li class="activity-item">
                <span class="when">3 days ago</span>
                <span class="what"><span class="who">iangilman</span> released <code>{{ tag }}</code> — bug fixes for WebGL drawer on Safari + tile-loaded memory leak</span>
                <span class="tag release">release</span>
              </li>
              <li class="activity-item">
                <span class="when">5 days ago</span>
                <span class="what"><span class="who">msalsbery</span> merged <code>#2891</code> — async event handlers can now return Promises</span>
                <span class="tag commit">commit</span>
              </li>
              <li class="activity-item">
                <span class="when">1w ago</span>
                <span class="what"><span class="who">pearcetm</span> committed cache-record SimpleCache for tile data persistence across drawer swaps</span>
                <span class="tag commit">commit</span>
              </li>
              <li class="activity-item">
                <span class="when">2w ago</span>
                <span class="what"><span class="who">woodchuck</span> fixed navigator cleanup when in custom location</span>
                <span class="tag commit">commit</span>
              </li>
              <li class="activity-item">
                <span class="when">3w ago</span>
                <span class="what"><span class="who">iangilman</span> released <code>v6.0.1</code> — patch for the IIIF 3.0 image profile shim</span>
                <span class="tag release">release</span>
              </li>
              <li class="activity-item">
                <span class="when">1mo ago</span>
                <span class="what"><span class="who">JoFrMueller</span> improved destruction cleanup to avoid memory leaks on hot-reload</span>
                <span class="tag commit">commit</span>
              </li>
            </ul>
          </div>
          <div class="activity-col">
            <h4>Open issues &amp; PRs</h4>
            <ul class="activity-list">
              <li class="activity-item">
                <span class="when">today</span>
                <span class="what"><span class="who">dao251</span> opened <code>#2906</code> — proposal: native annotation primitives</span>
                <span class="tag pr">enhancement</span>
              </li>
              <li class="activity-item">
                <span class="when">2 days ago</span>
                <span class="what"><span class="who">jeffschuler</span> asked <code>#2897</code> — how to coordinate OSD inside React Strict Mode</span>
                <span class="tag issue">question</span>
              </li>
              <li class="activity-item">
                <span class="when">1w ago</span>
                <span class="what"><span class="who">community</span> opened PR <code>#2901</code> — improve a11y for keyboard-only navigation</span>
                <span class="tag pr">PR</span>
              </li>
              <li class="activity-item">
                <span class="when">2w ago</span>
                <span class="what"><span class="who">Aiosa</span> asked <code>#2864</code> — multi-image worlds + custom drawer interaction</span>
                <span class="tag issue">question</span>
              </li>
              <li class="activity-item">
                <span class="when">3w ago</span>
                <span class="what"><span class="who">acdamiani</span> reported <code>#2836</code> — Safari pinch-zoom regression on iPad mini</span>
                <span class="tag issue">bug</span>
              </li>
              <li class="activity-item">
                <span class="when">1mo ago</span>
                <span class="what"><span class="who">mathiasstocker</span> proposed <code>#2830</code> — exposing tile prefetch policy</span>
                <span class="tag pr">enhancement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CHANNELS -->
    <section class="section-tight">
      <div class="container">
        <div class="section-head" style="margin-bottom: 24px;">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>CHANNELS</span>
            <h2 class="h-section">Reach the people who know.</h2>
          </div>
        </div>
        <div class="community">
          <a class="community-card" href="https://github.com/openseadragon/openseadragon/discussions" target="_blank" rel="noopener">
            <b>GitHub Discussions</b>
            <p>Architecture questions, feature debate, and the long tail of release notes.</p>
            <span class="more">github.com/openseadragon →</span>
          </a>
          <a class="community-card" href="https://stackoverflow.com/questions/tagged/openseadragon" target="_blank" rel="noopener">
            <b>Stack Overflow</b>
            <p>1,400+ tagged questions. Common gotchas already answered.</p>
            <span class="more">tag · openseadragon →</span>
          </a>
          <a class="community-card" href="https://discord.gg/Ygwap8UrGC" target="_blank" rel="noopener">
            <b>Discord</b>
            <p>Real-time chat with maintainers and users — IIIF interop, museum implementations, custom tile servers.</p>
            <span class="more">join the server →</span>
          </a>
          <a class="community-card" href="https://twitter.com/openseadragon" target="_blank" rel="noopener">
            <b>Twitter / X</b>
            <p>Announcements, release highlights, and the occasional deep-zoom curiosity.</p>
            <span class="more">@openseadragon →</span>
          </a>
          <a class="community-card" href="https://bsky.app/profile/openseadragon.bsky.social" target="_blank" rel="noopener">
            <b>Bluesky</b>
            <p>The newer home for OSD updates and community conversation on the open web.</p>
            <span class="more">@openseadragon.bsky.social →</span>
          </a>
          <a class="community-card" href="https://www.reddit.com/r/openseadragon/" target="_blank" rel="noopener">
            <b>Reddit</b>
            <p>Community posts, project showcases, and long-form how-to threads.</p>
            <span class="more">r/openseadragon →</span>
          </a>
          <a class="community-card" href="https://www.newline.co/" target="_blank" rel="noopener">
            <b>Newline course</b>
            <p>The official deep-dive by Ian Gilman. Coordinate systems, animation, plugins.</p>
            <span class="more">newline.co →</span>
          </a>
          <a class="community-card" href="https://iangilman.com/openseadragonizer/" target="_blank" rel="noopener">
            <b>Browser Extension</b>
            <p>OpenSeadragonizer turns any image on any webpage into an OSD viewer. Available for Chrome, Firefox, or use the web version.</p>
            <span class="more">openseadragonizer →</span>
          </a>
        </div>
      </div>
    </section>

    <!-- SPONSORS -->
    <section class="section-tight" id="sponsor">
      <div class="container">
        <div class="section-head" style="margin-bottom: 24px;">
          <div class="left">
            <span class="eyebrow"><span class="dot"></span>UNDERWRITE</span>
            <h2 class="h-section">Sponsor maintainer time.</h2>
            <p class="sub">Logo on the homepage. Gratitude in the changelog. Sustained progress on the
              issues you care about.</p>
          </div>
          <div class="right"><a href="#">Open Collective →</a></div>
        </div>

        <div class="sponsor-tiers">
          <div class="sponsor-tier">
            <span class="tier-name">Supporter</span>
            <div class="tier-amount">$25<span> / month</span></div>
            <ul>
              <li>Name in the contributors file</li>
              <li>Sticker pack</li>
              <li>Quarterly maintainer update</li>
            </ul>
            <div class="tier-cta"><a href="#" class="btn btn-ghost">Become a Supporter</a></div>
          </div>
          <div class="sponsor-tier featured">
            <span class="tier-name">Institution</span>
            <div class="tier-amount">$500<span> / month</span></div>
            <ul>
              <li>Logo on the homepage + docs</li>
              <li>Priority issue triage</li>
              <li>One office-hours call / quarter</li>
              <li>Mention in release notes</li>
            </ul>
            <div class="tier-cta"><a href="#" class="btn btn-primary">Sponsor as Institution</a></div>
          </div>
          <div class="sponsor-tier">
            <span class="tier-name">Underwriter</span>
            <div class="tier-amount">$2,500<span> / month</span></div>
            <ul>
              <li>Everything above</li>
              <li>Roadmap voting rights</li>
              <li>Custom feature scoping</li>
              <li>Direct line to maintainers</li>
            </ul>
            <div class="tier-cta"><a href="#" class="btn btn-ghost">Get in touch</a></div>
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
import { reactive, ref, watch, onMounted } from 'vue'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { useOSDVersion } from '@/composables/useOSDVersion.js'
import TweaksPanel from '@/components/TweaksPanel.vue'
import { TweakSection, TweakRadio, TweakColor } from '@/components/tweaks/TweakControls.vue'
import { useParticles } from '@/composables/useParticles.js'
import { useAnimations, useCursorSpot, useCommunityTilt } from '@/composables/useAnimations.js'

const { tag } = useOSDVersion()

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

const displayStats = reactive({ stars: '0', contrib: '0', dl: '0', issues: '0' })

const TARGETS = { stars: 3400, contrib: 142, dl: 760000, issues: 2847 }

function countUp() {
  const dur = 1800
  const start = performance.now()
  function fmt(n, key) {
    if (key === 'dl') return (n >= 1000 ? (n / 1000).toFixed(0) + 'k' : String(Math.round(n)))
    return String(Math.round(n))
  }
  function tick(now) {
    const t = Math.min(1, (now - start) / dur)
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
    displayStats.stars = fmt(ease * TARGETS.stars, 'stars')
    displayStats.contrib = fmt(ease * TARGETS.contrib, 'contrib')
    displayStats.dl = fmt(ease * TARGETS.dl, 'dl')
    displayStats.issues = fmt(ease * TARGETS.issues, 'issues')
    if (t < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

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
useCommunityTilt()

onMounted(() => {
  document.title = 'Community — OpenSeadragon'

  if (typeof IntersectionObserver !== 'undefined') {
    const showTellEl = document.querySelector('.show-tell')
    if (showTellEl) {
      const stObs = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) { showTellEl.classList.add('is-visible'); stObs.disconnect() }
      }, { threshold: 0.1 })
      stObs.observe(showTellEl)
    }
  }

  const statsEl = document.querySelector('.big-stats')
  if (statsEl && typeof IntersectionObserver !== 'undefined') {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { countUp(); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(statsEl)
  } else {
    countUp()
  }
})
</script>
