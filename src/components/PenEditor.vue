<template>
  <Teleport to="body">
    <Transition name="pe-fade">
      <div v-if="pen" class="pe-overlay" @click.self="$emit('close')" role="dialog" aria-modal="true" :aria-label="pen.title">

        <div class="pe-panel">
          <!-- ── Header ── -->
          <div class="pe-header">
            <div class="pe-header-left">
              <button class="pe-close" @click="$emit('close')" aria-label="Close editor">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
              <span class="pe-cat">{{ pen.cat }}</span>
              <span class="pe-title">{{ pen.title }}</span>
            </div>
            <div class="pe-header-right">
              <a :href="`https://codepen.io/iangilman/pen/${pen.id}`" target="_blank" rel="noopener noreferrer" class="pe-cp-link">
                CodePen ↗
              </a>
            </div>
          </div>

          <!-- ── Body ── -->
          <div class="pe-body">
            <!-- Code panel -->
            <div class="pe-code-panel">
              <!-- Tab + language row -->
              <div class="pe-tab-bar">
                <div class="pe-tabs" role="tablist">
                  <button
                    v-for="tab in TABS"
                    :key="tab"
                    role="tab"
                    :aria-selected="activeTab === tab"
                    :class="['pe-tab', { active: activeTab === tab }, `pe-tab-${tab.toLowerCase()}`]"
                    @click="activeTab = tab"
                  >{{ tab }}</button>
                </div>
              </div>

              <div class="pe-editor-wrap">
                <!-- Line numbers -->
                <div class="pe-line-nums" ref="lineNumsEl" aria-hidden="true">
                  <span v-for="n in lineCount" :key="n">{{ n }}</span>
                </div>
                <!-- Highlight + textarea overlay -->
                <div class="pe-code-area">
                  <pre
                    ref="highlightEl"
                    class="pe-highlight"
                    aria-hidden="true"
                    v-html="highlightedCode"
                  ></pre>
                  <textarea
                    ref="textareaEl"
                    class="pe-textarea"
                    v-model="code[activeTab.toLowerCase()]"
                    spellcheck="false"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    @input="onInput"
                    @scroll="syncScroll"
                    @keydown="handleKeydown"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Preview panel -->
            <div class="pe-preview-panel">
              <div class="pe-preview-bar">
                <span>Result</span>
              </div>
              <iframe
                ref="iframeEl"
                class="pe-preview"
                sandbox="allow-scripts"
                title="Live preview"
              ></iframe>
            </div>
          </div>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, reactive, watch, computed, nextTick, onMounted, onUnmounted } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-javascript'

const props = defineProps({
  pen: { type: Object, default: null }
})
const emit = defineEmits(['close'])

// ── Language config ─────────────────────────────────────────
const TABS = ['HTML', 'CSS', 'JS']

const TAB_LANG = { HTML: 'markup', CSS: 'css', JS: 'javascript' }

const CDN_OSD = 'https://cdn.jsdelivr.net/npm/openseadragon@6/build/openseadragon/openseadragon.min.js'

// ── State ────────────────────────────────────────────────────
const activeTab  = ref('JS')
const code       = reactive({ html: '', css: '', js: '' })
const iframeEl   = ref(null)
const textareaEl = ref(null)
const highlightEl = ref(null)
const lineNumsEl  = ref(null)
let debounceTimer = null

// ── Computed ─────────────────────────────────────────────────
const highlightedCode = computed(() => {
  const src  = code[activeTab.value.toLowerCase()] || ''
  const lang = TAB_LANG[activeTab.value]
  const grammar = Prism.languages[lang]
  return grammar
    ? Prism.highlight(src + '\n', grammar, lang)
    : escapeHtml(src + '\n')
})

const lineCount = computed(() => {
  const src = code[activeTab.value.toLowerCase()] || ''
  return Math.max(1, src.split('\n').length)
})

// ── Helpers ───────────────────────────────────────────────────
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function syncScroll() {
  const ta   = textareaEl.value
  const pre  = highlightEl.value
  const nums = lineNumsEl.value
  if (!ta || !pre) return
  pre.scrollTop  = ta.scrollTop
  pre.scrollLeft = ta.scrollLeft
  if (nums) nums.scrollTop = ta.scrollTop
}

// ── Preview build ────────────────────────────────────────────
function buildDoc() {
  const errBanner = `
var _eb=document.createElement('div');
_eb.style.cssText='position:fixed;bottom:0;left:0;right:0;background:#c0392b;color:#fff;font:12px/1.6 monospace;padding:8px 12px;z-index:9999;white-space:pre-wrap;';
_eb.textContent='Error: '+e.message;
document.body.appendChild(_eb);`

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>
document.addEventListener('keydown', function(e){
  if (e.key === 'Escape') window.parent.postMessage('pe:escape', '*');
});
<\/script>
<style>
*{box-sizing:border-box}
::-webkit-scrollbar{width:6px;height:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.18);border-radius:99px}
::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,0.35)}
::-webkit-scrollbar-corner{background:transparent}
*{scrollbar-width:thin;scrollbar-color:rgba(255,255,255,0.18) transparent}
</style>
<style>
${code.css}
</style>
</head>
<body>
${code.html}
<script src="${CDN_OSD}"><\/script>
<script>
(function(){try{
${code.js}
}catch(e){${errBanner}}})();
<\/script>
</body>
</html>`
}

// ── Run ──────────────────────────────────────────────────────
function runNow() {
  clearTimeout(debounceTimer)
  const doc = buildDoc()
  if (iframeEl.value) iframeEl.value.srcdoc = doc
}

function scheduleRun() {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(runNow, 700)
}

function onInput() { scheduleRun() }

// ── Keyboard ─────────────────────────────────────────────────
function handleKeydown(e) {
  if (e.key === 'Tab') {
    e.preventDefault()
    const ta    = e.target
    const start = ta.selectionStart
    const end   = ta.selectionEnd
    ta.value    = ta.value.substring(0, start) + '  ' + ta.value.substring(end)
    ta.selectionStart = ta.selectionEnd = start + 2
    ta.dispatchEvent(new Event('input'))
  }

}

function onGlobalKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

function onMessage(e) {
  if (e.data === 'pe:escape') emit('close')
}

// ── Reset when pen changes ────────────────────────────────────
watch(() => props.pen, (pen) => {
  if (!pen) return
  code.html = pen.html || ''
  code.css  = pen.css  || ''
  code.js   = pen.js   || ''
  activeTab.value = 'JS'
  nextTick(runNow)
}, { immediate: true })

onMounted(() => {
  document.addEventListener('keydown', onGlobalKeydown)
  window.addEventListener('message', onMessage)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onGlobalKeydown)
  window.removeEventListener('message', onMessage)
  clearTimeout(debounceTimer)
})
</script>

<style>
/* ── Prism token colors (Material Dark palette) ─────────────── */
.pe-highlight .token.comment,
.pe-highlight .token.prolog,
.pe-highlight .token.doctype,
.pe-highlight .token.cdata         { color: #546e7a; font-style: italic; }
.pe-highlight .token.punctuation   { color: #89ddff; }
.pe-highlight .token.operator      { color: #89ddff; }
.pe-highlight .token.namespace     { opacity: .7; }
.pe-highlight .token.tag           { color: #f07178; }
.pe-highlight .token.attr-name     { color: #ffcb6b; }
.pe-highlight .token.attr-value,
.pe-highlight .token.string,
.pe-highlight .token.char          { color: #c3e88d; }
/* builtin = built-in types/objects (teal), distinct from string literals */
.pe-highlight .token.builtin       { color: #80cbc4; }
.pe-highlight .token.keyword,
.pe-highlight .token.module,
.pe-highlight .token.rule,
.pe-highlight .token.atrule        { color: #c792ea; }
.pe-highlight .token.boolean,
.pe-highlight .token.number,
.pe-highlight .token.unit          { color: #f78c6c; }
.pe-highlight .token.function,
.pe-highlight .token.function-variable { color: #82aaff; }
.pe-highlight .token.property,
.pe-highlight .token.variable      { color: #ffcb6b; }
.pe-highlight .token.class-name,
.pe-highlight .token.maybe-class-name,
.pe-highlight .token.known-class-name { color: #ffcb6b; }
.pe-highlight .token.decorator     { color: #f07178; }
.pe-highlight .token.type-annotation,
.pe-highlight .token.builtin-name  { color: #80cbc4; }
.pe-highlight .token.selector      { color: #c3e88d; }
.pe-highlight .token.important     { color: #f07178; font-weight: bold; }
.pe-highlight .token.deleted       { color: #f07178; }
.pe-highlight .token.inserted      { color: #c3e88d; }
.pe-highlight .token.entity        { cursor: help; }
</style>

<style scoped>
/* ── Overlay ─────────────────────────────────────────────────── */
.pe-overlay {
  position: fixed; inset: 0; z-index: 9000;
  background: rgba(0,0,0,0.72);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
}

/* ── Panel ─────────────────────────────────────────────────── */
.pe-panel {
  width: 100%; max-width: 1280px;
  height: 100%; max-height: 860px;
  background: #0d0d0f;
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: 0 32px 96px rgba(0,0,0,0.8);
}

/* ── Header ─────────────────────────────────────────────────── */
.pe-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 16px; height: 46px; min-height: 46px;
  background: #111113;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  gap: 12px;
}
.pe-header-left  { display: flex; align-items: center; gap: 10px; min-width: 0; }
.pe-header-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }

.pe-close {
  display: flex; align-items: center; justify-content: center;
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(255,255,255,0.07); border: none;
  color: rgba(255,255,255,0.55); cursor: pointer;
  transition: background 150ms, color 150ms;
}
.pe-close:hover { background: rgba(255,255,255,0.14); color: #fff; }

.pe-cat {
  font-family: var(--font-mono, monospace); font-size: 10px;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--accent, #67d6ee);
  background: oklch(from var(--accent, #67d6ee) l c h / 0.12);
  padding: 2px 8px; border-radius: 99px;
}
.pe-title {
  font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.75);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.pe-cp-link {
  font-size: 12px; color: rgba(255,255,255,0.4);
  text-decoration: none; transition: color 150ms;
}
.pe-cp-link:hover { color: rgba(255,255,255,0.8); }

/* ── Body ─────────────────────────────────────────────────── */
.pe-body { display: flex; flex: 1; min-height: 0; }

/* ── Code panel ──────────────────────────────────────────── */
.pe-code-panel {
  width: 50%; display: flex; flex-direction: column;
  border-right: 1px solid rgba(255,255,255,0.07);
}

.pe-tab-bar {
  background: #111113;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}

.pe-tabs { display: flex; }
.pe-tab {
  display: flex; align-items: center; gap: 5px;
  padding: 8px 16px;
  font-family: var(--font-mono, monospace); font-size: 11px; letter-spacing: 0.06em;
  background: transparent; border: none; color: rgba(255,255,255,0.38); cursor: pointer;
  transition: color 150ms; border-bottom: 2px solid transparent; margin-bottom: -1px;
}
.pe-tab:hover { color: rgba(255,255,255,0.65); }
.pe-tab.active { color: rgba(255,255,255,0.92); }
.pe-tab-html.active { border-color: #e34c26; }
.pe-tab-css.active  { border-color: #264de4; }
.pe-tab-js.active   { border-color: #f7df1e; }
/* ── Editor area ──────────────────────────────────────────── */
.pe-editor-wrap {
  display: flex; flex: 1; min-height: 0;
  overflow: hidden; background: #0d0d0f;
}

.pe-line-nums {
  display: flex; flex-direction: column; align-items: flex-end;
  padding: 16px 10px 16px 12px;
  color: rgba(255,255,255,0.18);
  font-family: 'Fira Code', 'Consolas', 'Menlo', monospace;
  font-size: 13px; line-height: 1.6;
  user-select: none; pointer-events: none;
  min-width: 42px; flex-shrink: 0; overflow: hidden;
}
.pe-line-nums span { display: block; }

.pe-code-area { position: relative; flex: 1; overflow: hidden; }

/* Both pre and textarea must have identical font metrics */
.pe-highlight,
.pe-textarea {
  font-family: 'Fira Code', 'Consolas', 'Menlo', monospace;
  font-size: 13px; line-height: 1.6;
  padding: 16px 14px;
  tab-size: 2; white-space: pre;
  overflow-wrap: normal; word-break: normal;
  margin: 0; border: none;
}

.pe-highlight {
  position: absolute; inset: 0;
  overflow: auto; pointer-events: none;
  background: #0d0d0f; color: #abb2bf;
  scrollbar-width: none;
}
.pe-highlight::-webkit-scrollbar { display: none; }

.pe-textarea {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  background: transparent; color: transparent;
  caret-color: var(--accent, #67d6ee);
  outline: none; resize: none; overflow: auto;
  z-index: 1; box-shadow: none;
  -webkit-text-fill-color: transparent;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.12) transparent;
}
.pe-textarea::-webkit-scrollbar { width: 6px; height: 6px; }
.pe-textarea::-webkit-scrollbar-track { background: transparent; }
.pe-textarea::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.12);
  border-radius: 99px;
  transition: background 150ms;
}
.pe-textarea::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.28); }
.pe-textarea::-webkit-scrollbar-corner { background: transparent; }

/* ── Preview panel ──────────────────────────────────────────── */
.pe-preview-panel { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.pe-preview-bar {
  height: 36px; min-height: 36px;
  background: #111113; border-bottom: 1px solid rgba(255,255,255,0.07);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 14px;
  font-family: var(--font-mono, monospace); font-size: 11px; letter-spacing: 0.06em;
  color: rgba(255,255,255,0.38);
}
.pe-preview { flex: 1; width: 100%; border: none; background: #111; }

/* ── Transition ─────────────────────────────────────────────── */
.pe-fade-enter-active, .pe-fade-leave-active { transition: opacity 180ms ease; }
.pe-fade-enter-active .pe-panel, .pe-fade-leave-active .pe-panel { transition: transform 180ms ease, opacity 180ms ease; }
.pe-fade-enter-from, .pe-fade-leave-to { opacity: 0; }
.pe-fade-enter-from .pe-panel { transform: scale(0.97); opacity: 0; }
.pe-fade-leave-to .pe-panel   { transform: scale(0.97); opacity: 0; }

/* ── Mobile ─────────────────────────────────────────────────── */
@media (max-width: 720px) {
  .pe-overlay { padding: 0; }
  .pe-panel { border-radius: 0; max-height: 100%; }
  .pe-body { flex-direction: column; }
  .pe-code-panel { width: 100%; height: 50%; border-right: none; border-bottom: 1px solid rgba(255,255,255,0.07); }
  .pe-title { display: none; }
}
</style>
