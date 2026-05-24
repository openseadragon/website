<template>
  <Teleport to="body">
    <Transition name="search-fade">
      <div v-if="isOpen" class="search-backdrop" @click.self="close" @keydown="onKeydown">
        <div class="search-modal" role="dialog" aria-modal="true" aria-label="Search">

          <div class="search-input-row">
            <svg class="search-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
            <input
              ref="inputRef"
              v-model="query"
              class="search-input"
              placeholder="Search docs, examples, plugins…"
              autocomplete="off"
              spellcheck="false"
              @keydown="onKeydown"
            />
            <kbd class="kbd" @click="close">Esc</kbd>
          </div>

          <div class="search-divider"></div>

          <div class="search-results" ref="listRef">
            <div v-if="!query" class="search-hint">
              Type to search docs, examples, and plugins
            </div>
            <div v-else-if="results.length === 0" class="search-empty">
              No results for "<strong>{{ query }}</strong>"
            </div>
            <template v-else>
              <div v-for="(group, gi) in groupedResults" :key="group.type">
                <div class="search-group-label">{{ group.label }}</div>
                <button
                  v-for="(item, ii) in group.items"
                  :key="item.item.id"
                  class="search-result-item"
                  :class="{ active: flatIndex(gi, ii) === activeIndex }"
                  @click="select(item)"
                  @mouseenter="activeIndex = flatIndex(gi, ii)"
                >
                  <span class="sri-icon" :data-type="item.item.type">
                    <svg v-if="item.item.type === 'doc'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    <svg v-else-if="item.item.type === 'example'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
                  </span>
                  <span class="sri-content">
                    <span class="sri-title" v-html="highlight(item, 'title')"></span>
                    <span class="sri-sub">{{ item.item.subtitle }}</span>
                  </span>
                  <span v-if="item.item.tag" class="sri-tag">{{ item.item.tag }}</span>
                  <svg class="sri-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            </template>
          </div>

          <div class="search-footer">
            <span><kbd class="kbd">↑↓</kbd> navigate</span>
            <span><kbd class="kbd">↵</kbd> open</span>
            <span><kbd class="kbd">Esc</kbd> close</span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useSearch } from '../composables/useSearch.js'

const { isOpen, query, results, activeIndex, close } = useSearch()
const router = useRouter()
const inputRef = ref(null)
const listRef = ref(null)

watch(isOpen, async (val) => {
  if (val) {
    await nextTick()
    inputRef.value?.focus()
  }
})

let savedOverflow = ''
watch(isOpen, (val) => {
  if (val) {
    savedOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = savedOverflow
  }
})

const groupedResults = computed(() => {
  const groups = { doc: [], example: [], plugin: [] }
  for (const r of results.value) {
    if (groups[r.item.type]) groups[r.item.type].push(r)
  }
  return [
    { type: 'doc',     label: 'Documentation', items: groups.doc },
    { type: 'example', label: 'Examples',       items: groups.example },
    { type: 'plugin',  label: 'Plugins',        items: groups.plugin },
  ].filter(g => g.items.length > 0)
})

function flatIndex(gi, ii) {
  let idx = 0
  for (let g = 0; g < gi; g++) idx += groupedResults.value[g].items.length
  return idx + ii
}

const flatCount = computed(() =>
  groupedResults.value.reduce((sum, g) => sum + g.items.length, 0)
)

function onKeydown(e) {
  if (e.key === 'Escape')    { close(); return }
  if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex.value = Math.min(activeIndex.value + 1, flatCount.value - 1); scrollActive() }
  if (e.key === 'ArrowUp')   { e.preventDefault(); activeIndex.value = Math.max(activeIndex.value - 1, 0); scrollActive() }
  if (e.key === 'Enter')     { e.preventDefault(); selectByFlatIndex(activeIndex.value) }
}

function scrollActive() {
  nextTick(() => {
    listRef.value?.querySelector('.search-result-item.active')?.scrollIntoView({ block: 'nearest' })
  })
}

function select(fuseResult) {
  const doc = fuseResult.item
  router.push({ path: doc.route, hash: doc.hash || '' })
  close()
}

function selectByFlatIndex(idx) {
  let count = 0
  for (const group of groupedResults.value) {
    for (const item of group.items) {
      if (count === idx) { select(item); return }
      count++
    }
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function mergeRanges(ranges) {
  if (!ranges.length) return []
  const sorted = [...ranges].sort((a, b) => a[0] - b[0])
  const merged = [sorted[0].slice()]
  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1]
    if (sorted[i][0] <= last[1] + 1) {
      last[1] = Math.max(last[1], sorted[i][1])
    } else {
      merged.push(sorted[i].slice())
    }
  }
  return merged
}

function highlight(fuseResult, field) {
  const text = fuseResult.item[field] ?? ''
  const match = fuseResult.matches?.find(m => m.key === field)
  if (!match || !match.indices.length) return escapeHtml(text)
  const ranges = mergeRanges(match.indices)
  let out = '', lastIdx = 0
  for (const [s, e] of ranges) {
    out += escapeHtml(text.slice(lastIdx, s))
    out += `<mark>${escapeHtml(text.slice(s, e + 1))}</mark>`
    lastIdx = e + 1
  }
  out += escapeHtml(text.slice(lastIdx))
  return out
}
</script>
