<template>
  <div>
    <NavBar />

    <section class="section-tight" style="padding-top: 56px;">
      <div class="container">
        <div class="doc-layout">

          <!-- LEFT SIDEBAR -->
          <aside class="doc-side">
            <!-- Guide nav -->
            <div v-for="group in DOC_NAV" :key="group.label" class="doc-group">
              <h6>{{ group.label }}</h6>
              <template v-for="item in group.items" :key="item.title">
                <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer">{{ item.title }}</a>
                <RouterLink v-else :to="item.path">{{ item.title }}</RouterLink>
              </template>
            </div>
            <!-- API nav -->
            <div v-for="group in API_NAV" :key="'api-' + group.label" class="doc-group">
              <h6>{{ group.label }}</h6>
              <RouterLink
                v-for="item in group.items"
                :key="item.title"
                :to="item.path"
                :class="{ active: item.path === currentPath }"
              >{{ item.title }}</RouterLink>
            </div>
          </aside>

          <!-- MAIN CONTENT -->
          <article class="doc-body" v-if="cls">
            <div class="crumbs">
              <RouterLink to="/docs">Docs</RouterLink>
              <span>/</span>
              <span style="color:var(--paper-dim)">API Reference</span>
              <span>/</span>
              <span style="color:var(--paper-dim)">{{ cls.name }}</span>
            </div>

            <div style="display:flex; align-items:baseline; gap:12px; flex-wrap:wrap;">
              <h1 style="margin-bottom:0">{{ cls.name }}</h1>
              <span v-if="cls.extends" class="eyebrow" style="color:var(--paper-dim); letter-spacing:0">
                extends
                <RouterLink :to="`/docs/api/${cls.extends}`" style="color:var(--accent)">{{ cls.extends }}</RouterLink>
              </span>
              <span v-if="cls.isTypeDef" class="eyebrow" style="color:var(--paper-dim)">type definition</span>
              <span v-if="cls.stub" class="eyebrow" style="background:var(--ink-2); padding:2px 8px; border-radius:4px; color:var(--paper-dim)">stub — full detail coming soon</span>
            </div>

            <p class="doc-lede" v-html="cls.description"></p>

            <!-- CONSTRUCTOR -->
            <template v-if="cls.constructorParams?.length">
              <h2 id="constructor" style="scroll-margin-top:80px">Constructor</h2>
              <div class="codeblock" style="margin-bottom:20px">
                <header>
                  <div class="stage-dots"><span></span><span></span><span></span></div>
                  <span class="fname">signature</span>
                </header>
                <pre>new OpenSeadragon.{{ cls.name }}({{ constructorSig }})</pre>
              </div>
              <div class="api-table" style="margin-bottom:32px">
                <div class="api-row" style="font-weight:500">
                  <span>Parameter</span><span>Type</span><span>Description</span>
                </div>
                <div
                  v-for="p in cls.constructorParams"
                  :key="p.name"
                  class="api-row"
                >
                  <span>
                    <span class="name">{{ p.name }}</span>
                    <span v-if="p.optional" class="eyebrow" style="font-size:10px;margin-left:4px;opacity:.6">opt</span>
                  </span>
                  <span class="type">{{ p.type }}</span>
                  <span>
                    {{ p.description }}
                    <span v-if="p.default" style="color:var(--paper-dim);font-size:12px"> Default: <code>{{ p.default }}</code></span>
                  </span>
                </div>
              </div>
            </template>

            <!-- MEMBERS -->
            <template v-if="cls.members?.length">
              <h2 id="members" style="scroll-margin-top:80px">Members</h2>
              <div class="api-table" style="margin-bottom:32px">
                <div class="api-row" style="font-weight:500"><span>Name</span><span>Type</span><span>Description</span></div>
                <div v-for="m in cls.members" :key="m.name" class="api-row">
                  <span class="name">{{ m.name }}</span>
                  <span class="type">{{ m.type }}</span>
                  <span>{{ m.description }}</span>
                </div>
              </div>
            </template>

            <!-- OPTIONS TYPE DEF SECTIONS -->
            <template v-if="cls.isTypeDef && cls.sections">
              <template v-for="sec in cls.sections" :key="sec.heading">
                <h2 :id="slugify(sec.heading)" style="scroll-margin-top:80px">{{ sec.heading }}</h2>
                <div class="api-table" style="margin-bottom:32px">
                  <div class="api-row" style="font-weight:500"><span>Property</span><span>Type / Default</span><span>Description</span></div>
                  <div v-for="m in sec.members" :key="m.name" class="api-row">
                    <span class="name">{{ m.name }}</span>
                    <span class="type">
                      {{ m.type }}
                      <span v-if="m.default" style="display:block;font-size:11px;opacity:.7">{{ m.default }}</span>
                    </span>
                    <span>{{ m.description }}</span>
                  </div>
                </div>
              </template>
            </template>

            <!-- METHODS -->
            <template v-if="cls.methods?.length">
              <h2 id="methods" style="scroll-margin-top:80px">Methods</h2>

              <div class="api-methods-list">
                <div v-for="method in cls.methods" :key="method.name" class="api-method" :id="'method-' + method.name">

                  <!-- Syntax-colored signature -->
                  <div class="api-sig">
                    <span class="api-sig-fn">{{ method.name }}</span>
                    <span class="api-sig-paren">(</span>
                    <template v-for="(p, i) in (method.params || [])" :key="p.name">
                      <span :class="['api-sig-param', { 'is-opt': p.optional }]">{{ p.name }}{{ p.optional ? '?' : '' }}</span>
                      <span class="api-sig-colon">: </span>
                      <span class="api-sig-type">{{ p.type }}</span>
                      <span v-if="i < (method.params?.length ?? 0) - 1" class="api-sig-comma">, </span>
                    </template>
                    <span class="api-sig-paren">)</span>
                    <span v-if="method.returns" class="api-sig-arrow"> → </span>
                    <span v-if="method.returns" class="api-sig-ret">{{ method.returns }}</span>
                  </div>

                  <!-- Description -->
                  <p class="api-method-desc">{{ method.description }}</p>

                  <!-- Parameters -->
                  <div v-if="method.params?.length" class="api-params">
                    <div v-for="p in method.params" :key="p.name" class="api-param">
                      <div class="api-param-lhs">
                        <code class="api-param-name">{{ p.name }}</code>
                        <span v-if="p.optional" class="api-param-opt">opt</span>
                      </div>
                      <div class="api-param-type">{{ p.type }}</div>
                      <div class="api-param-desc">
                        {{ p.description }}
                        <span v-if="p.default" class="api-param-default"> · default: <code>{{ p.default }}</code></span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </template>

            <!-- EVENTS -->
            <template v-if="cls.events?.length">
              <h2 id="events" style="scroll-margin-top:80px">Events</h2>
              <div class="api-table">
                <div class="api-row" style="font-weight:500"><span>Event</span><span>Payload</span><span>Description</span></div>
                <div v-for="ev in cls.events" :key="ev.name" class="api-row">
                  <span class="name">{{ ev.name }}</span>
                  <span class="type" style="font-size:12px; word-break:break-all">{{ ev.payload || '{}' }}</span>
                  <span>{{ ev.description }}</span>
                </div>
              </div>
            </template>

            <div style="margin-top:48px; padding-top:20px; border-top:1px solid var(--line); font-size:13px; color:var(--paper-dim)">
              OpenSeadragon {{ version || '6.0.2' }} · MIT License
            </div>
          </article>

          <!-- 404 -->
          <article class="doc-body" v-else>
            <div class="crumbs">
              <RouterLink to="/docs">Docs</RouterLink>
              <span>/</span> <span style="color:var(--paper-dim)">API Reference</span>
              <span>/</span> <span style="color:var(--paper-dim)">{{ className }}</span>
            </div>
            <h1>Class not found</h1>
            <p class="doc-lede">No API documentation for <code>{{ className }}</code> yet.</p>
            <RouterLink to="/docs" style="color:var(--accent)">← Back to Docs</RouterLink>
          </article>

          <!-- RIGHT TOC -->
          <aside class="doc-toc" v-if="cls">
            <h6>On this page</h6>
            <a v-if="cls.constructorParams?.length" href="#" @click.prevent="scrollTo('constructor')" :class="{ active: tocActive === 'constructor' }">Constructor</a>
            <a v-if="cls.members?.length" href="#" @click.prevent="scrollTo('members')" :class="{ active: tocActive === 'members' }">Members</a>
            <template v-if="cls.isTypeDef && cls.sections">
              <a v-for="sec in cls.sections" :key="sec.heading" href="#" @click.prevent="scrollTo(slugify(sec.heading))" :class="{ active: tocActive === slugify(sec.heading) }">{{ sec.heading }}</a>
            </template>
            <a v-if="cls.methods?.length" href="#" @click.prevent="scrollTo('methods')" :class="{ active: tocActive === 'methods' }">Methods</a>
            <a v-if="cls.events?.length" href="#" @click.prevent="scrollTo('events')" :class="{ active: tocActive === 'events' }">Events</a>
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
import { DOC_NAV } from '@/data/docs.js'
import { API_NAV, API_CLASSES } from '@/data/api.js'

const route = useRoute()
const className = computed(() => route.params.class)
const currentPath = computed(() => route.path)
const cls = computed(() => API_CLASSES[className.value] || null)

// Build constructor signature string
const constructorSig = computed(() => {
  if (!cls.value?.constructorParams?.length) return ''
  return cls.value.constructorParams.map(p => p.optional ? `${p.name}?` : p.name).join(', ')
})

function methodSig(method) {
  if (!method.params?.length) return ''
  return method.params.map(p => p.optional ? `${p.name}?` : p.name).join(', ')
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const tocActive = ref('')

function scrollTo(id) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
  tocActive.value = id
}

onMounted(() => {
  if (cls.value?.constructorParams?.length) tocActive.value = 'constructor'
  else if (cls.value?.members?.length) tocActive.value = 'members'
  else if (cls.value?.methods?.length) tocActive.value = 'methods'
})

// Theme/accent
const ACCENT_OPTIONS = [
  ['#67d6ee', '#0f1922', '#f3fbfd'],
  ['#ec8761', '#180f0c', '#fbf4f0'],
  ['#c9ee5e', '#0f1a08', '#f6fbed'],
  ['#b59afd', '#120e1c', '#f5f1fb'],
]
const ACCENT_NAME_MAP = { '#67d6ee': 'aqua', '#ec8761': 'coral', '#c9ee5e': 'lime', '#b59afd': 'violet' }
const ACCENT_COLOR_MAP = { aqua: ACCENT_OPTIONS[0], coral: ACCENT_OPTIONS[1], lime: ACCENT_OPTIONS[2], violet: ACCENT_OPTIONS[3] }

const html = document.documentElement
const savedTheme = localStorage.getItem('osd-theme') || html.getAttribute('data-theme') || 'dark'
const savedAccent = html.getAttribute('data-accent') || 'aqua'
const tweaks = reactive({ theme: savedTheme, accent: savedAccent, _accentArr: ACCENT_COLOR_MAP[savedAccent] || ACCENT_OPTIONS[0] })
const accentOptions = ACCENT_OPTIONS

watch(() => tweaks.theme, v => { html.setAttribute('data-theme', v); try { localStorage.setItem('osd-theme', v) } catch (_) {} })
watch(() => tweaks._accentArr, v => { tweaks.accent = ACCENT_NAME_MAP[v[0]] || 'aqua'; html.setAttribute('data-accent', tweaks.accent) })
watch(() => tweaks.accent, v => { html.setAttribute('data-accent', v); tweaks._accentArr = ACCENT_COLOR_MAP[v] || ACCENT_OPTIONS[0] })

watch(cls, c => {
  document.title = c ? `${c.name} — OpenSeadragon API` : 'API — OpenSeadragon'
}, { immediate: true })
</script>

<style scoped>
/* ── Methods list ─────────────────────────────────── */
.api-methods-list {
  margin-bottom: 32px;
  border-left: 2px solid var(--accent);
  padding-left: 0;
}

.api-method {
  padding: 20px 0 20px 24px;
  position: relative;
}

.api-method + .api-method {
  border-top: 1px solid var(--line);
}

/* Accent dot on the left rail */
.api-method::before {
  content: '';
  position: absolute;
  left: -5px;
  top: 26px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 2px var(--ink);
}

/* ── Signature ────────────────────────────────────── */
.api-sig {
  font-family: var(--font-mono);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0;
}

.api-sig-fn {
  color: var(--accent);
  font-size: 15px;
  font-weight: 600;
}

.api-sig-paren {
  color: var(--paper-dim);
  opacity: 0.6;
}

.api-sig-param {
  color: var(--paper);
}

.api-sig-param.is-opt {
  color: var(--paper-dim);
}

.api-sig-colon {
  color: var(--paper-dim);
  opacity: 0.5;
  margin: 0 1px;
}

.api-sig-type {
  color: var(--paper);
  opacity: 0.55;
  font-size: 13px;
}

.api-sig-comma {
  color: var(--paper-dim);
  opacity: 0.5;
  margin-right: 5px;
}

.api-sig-arrow {
  color: var(--paper-dim);
  opacity: 0.4;
  margin: 0 3px;
}

.api-sig-ret {
  color: var(--accent);
  opacity: 0.65;
  font-size: 13px;
}

/* ── Description ──────────────────────────────────── */
.api-method-desc {
  margin: 0 0 12px;
  color: var(--paper-dim);
  font-size: 14px;
  line-height: 1.65;
}

/* ── Parameter rows ───────────────────────────────── */
.api-params {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  overflow: hidden;
}

.api-param {
  display: grid;
  grid-template-columns: minmax(120px, 160px) minmax(80px, 130px) 1fr;
  gap: 0 16px;
  padding: 7px 14px;
  font-size: 13px;
  align-items: baseline;
}

.api-param + .api-param {
  border-top: 1px solid var(--line);
}

.api-param:first-child {
  background: color-mix(in srgb, var(--accent) 4%, transparent);
  border-bottom: 1px solid var(--line);
}

.api-param-lhs {
  display: flex;
  align-items: center;
  gap: 5px;
}

.api-param-name {
  font-family: var(--font-mono);
  color: var(--paper);
  background: none;
  padding: 0;
  font-size: 13px;
}

.api-param-opt {
  font-size: 9px;
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0.4;
  color: var(--paper);
  margin-top: 1px;
}

.api-param-type {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent);
  opacity: 0.6;
}

.api-param-desc {
  color: var(--paper-dim);
  font-size: 13px;
  line-height: 1.55;
}

.api-param-default {
  opacity: 0.65;
}

.api-param-default code {
  font-size: 11px;
}
</style>
