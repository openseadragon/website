import { ref, watch } from 'vue'
import Fuse from 'fuse.js'
import { ALL_DOCS } from '../data/searchIndex.js'

const fuse = new Fuse(ALL_DOCS, {
  keys: [
    { name: 'title',    weight: 3 },
    { name: 'tag',      weight: 2 },
    { name: 'subtitle', weight: 1.5 },
    { name: 'body',     weight: 1 },
  ],
  threshold: 0.35,
  includeMatches: true,
  minMatchCharLength: 2,
  ignoreLocation: true,
})

const isOpen     = ref(false)
const query      = ref('')
const results    = ref([])
const activeIndex = ref(0)

watch(query, (q) => {
  results.value = q.length >= 2 ? fuse.search(q, { limit: 20 }) : []
  activeIndex.value = 0
})

export function useSearch() {
  function open()  { isOpen.value = true }
  function close() { isOpen.value = false; query.value = ''; activeIndex.value = 0 }
  return { isOpen, query, results, activeIndex, open, close }
}
