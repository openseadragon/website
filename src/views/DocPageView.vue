<template>
  <div>
    <NavBar />

    <section class="section-tight" style="padding-top: 56px;">
      <div class="container">
        <div class="doc-layout">

          <!-- LEFT SIDEBAR -->
          <aside class="doc-side">
            <div v-for="group in DOC_NAV" :key="group.label" class="doc-group">
              <h6>{{ group.label }}</h6>
              <template v-for="item in group.items" :key="item.title">
                <a
                  v-if="item.href"
                  :href="item.href"
                  target="_blank"
                  rel="noopener noreferrer"
                >{{ item.title }}</a>
                <RouterLink
                  v-else
                  :to="item.path"
                  :class="{ active: isActive(item.path) }"
                >{{ item.title }}</RouterLink>
              </template>
            </div>
          </aside>

          <!-- MAIN CONTENT -->
          <article class="doc-body" v-if="page">
            <div class="crumbs">
              <RouterLink to="/docs">Docs</RouterLink>
              <span>/</span>
              <span style="color:var(--paper-dim);">{{ page.category }}</span>
              <span>/</span>
              <span style="color:var(--paper-dim);">{{ page.title }}</span>
            </div>

            <h1>{{ page.title }}</h1>
            <p class="doc-lede">{{ page.lede }}</p>

            <template v-for="section in page.sections" :key="section.id">
              <h2 :id="section.id" style="scroll-margin-top: 80px;">{{ section.heading }}</h2>

              <template v-for="(block, bi) in section.blocks" :key="bi">
                <p
                  v-if="block.type === 'p'"
                  v-html="block.html"
                ></p>

                <ul v-else-if="block.type === 'ul'" style="margin: 0 0 18px; padding-left: 22px; color: var(--paper-dim); line-height: 1.7;">
                  <li
                    v-for="(item, ii) in block.items"
                    :key="ii"
                    v-html="item"
                    style="margin-bottom: 6px;"
                  ></li>
                </ul>

                <div v-else-if="block.type === 'code'" class="codeblock" style="margin-bottom: 22px;">
                  <header>
                    <div class="stage-dots"><span></span><span></span><span></span></div>
                    <span class="fname">{{ block.filename }}</span>
                  </header>
                  <pre>{{ block.code }}</pre>
                </div>

                <div v-else-if="block.type === 'callout'" class="callout">
                  <b>{{ block.title }}</b>
                  <span v-html="block.html"></span>
                </div>

                <h3
                  v-else-if="block.type === 'h3'"
                  style="font-size: 17px; font-weight: 500; color: var(--paper); margin: 28px 0 10px;"
                >{{ block.text }}</h3>
              </template>
            </template>

            <div style="margin-top: 64px; padding-top: 24px; border-top: 1px solid var(--line); display: flex; gap: 16px; flex-wrap: wrap;">
              <a
                :href="`https://openseadragon.github.io/examples/${slug}/`"
                target="_blank"
                rel="noopener noreferrer"
                style="color: var(--accent); font-size: 14px;"
              >View on openseadragon.github.io ↗</a>
            </div>
          </article>

          <!-- 404 state -->
          <article class="doc-body" v-else>
            <div class="crumbs">
              <RouterLink to="/docs">Docs</RouterLink> <span>/</span>
              <span style="color:var(--paper-dim);">{{ slug }}</span>
            </div>
            <h1>Page not found</h1>
            <p class="doc-lede">This doc page doesn't exist yet. Check back soon or browse the sidebar.</p>
            <RouterLink to="/docs" style="color: var(--accent);">← Back to Quickstart</RouterLink>
          </article>

          <!-- RIGHT TOC -->
          <aside class="doc-toc" v-if="page">
            <h6>On this page</h6>
            <a
              v-for="section in page.sections"
              :key="section.id"
              :href="`#${section.id}`"
              :class="{ active: tocActive === section.id }"
              @click.prevent="scrollTo(section.id)"
            >{{ section.heading }}</a>

            <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--line-soft); display: flex; flex-direction: column; gap: 8px;">
              <h6 style="margin-bottom: 4px;">Help us</h6>
              <a
                :href="`https://openseadragon.github.io/examples/${slug}/`"
                target="_blank"
                rel="noopener noreferrer"
                style="color: var(--paper-dim);"
              >View original</a>
              <a
                href="https://github.com/openseadragon/openseadragon/issues/new"
                target="_blank"
                rel="noopener noreferrer"
                style="color: var(--paper-dim);"
              >Report an issue</a>
              <a
                href="https://github.com/openseadragon/openseadragon/discussions"
                target="_blank"
                rel="noopener noreferrer"
                style="color: var(--paper-dim);"
              >Discuss on GitHub</a>
            </div>
          </aside>

        </div>
      </div>
    </section>

    <SiteFooter />

    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio label="Mode" v-model="tweaks.theme" :options="['dark', 'light']" />
      <TweakColor label="Accent" v-model="tweaks.accent" :options="accentOptions" />
    </TweaksPanel>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import TweaksPanel from '@/components/TweaksPanel.vue'
import { TweakSection, TweakRadio, TweakColor } from '@/components/tweaks/TweakControls.vue'
import { DOC_NAV, DOCS_PAGES } from '@/data/docs.js'

const route = useRoute()
const slug = computed(() => route.params.slug)
const page = computed(() => DOCS_PAGES[slug.value] || null)

function isActive(path) {
  if (path === '/docs') return false
  return route.path === path || `#${route.path}` === path
}

// TOC active tracking
const tocActive = ref('')

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  tocActive.value = id
}

// Theme / accent wiring (mirrors DocsView)
const ACCENT_OPTIONS = [
  ['#67d6ee', '#0f1922', '#f3fbfd'],
  ['#ec8761', '#180f0c', '#fbf4f0'],
  ['#c9ee5e', '#0f1a08', '#f6fbed'],
  ['#b59afd', '#120e1c', '#f5f1fb'],
]
const ACCENT_NAME_MAP = {
  '#67d6ee': 'aqua', '#ec8761': 'coral',
  '#c9ee5e': 'lime',  '#b59afd': 'violet',
}
const ACCENT_COLOR_MAP = {
  aqua: ACCENT_OPTIONS[0], coral: ACCENT_OPTIONS[1],
  lime: ACCENT_OPTIONS[2], violet: ACCENT_OPTIONS[3],
}

const html = document.documentElement
const savedTheme = localStorage.getItem('osd-theme') || html.getAttribute('data-theme') || 'dark'
const savedAccent = html.getAttribute('data-accent') || 'aqua'

const tweaks = reactive({
  theme: savedTheme,
  accent: savedAccent,
  _accentArr: ACCENT_COLOR_MAP[savedAccent] || ACCENT_OPTIONS[0],
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
watch(() => tweaks.accent, (v) => {
  html.setAttribute('data-accent', v)
  tweaks._accentArr = ACCENT_COLOR_MAP[v] || ACCENT_OPTIONS[0]
})

watch(page, (p) => {
  if (p) document.title = `${p.title} — OpenSeadragon`
}, { immediate: true })

// Set first section active on mount
onMounted(() => {
  if (page.value?.sections?.length) {
    tocActive.value = page.value.sections[0].id
  }
})
</script>
