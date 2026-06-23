import { ref, computed } from 'vue'

const release = ref(null)
const loading = ref(false)
let fetched = false

export function useOSDVersion() {
  if (!fetched) {
    fetched = true
    loading.value = true

    // Try build-time cache first, fall back to live API
    const cacheUrl = import.meta.env.BASE_URL + 'data/github-cache.json'
    fetch(cacheUrl)
      .then(r => r.ok ? r.json() : null)
      .then(cache => {
        if (cache?.latestRelease) {
          release.value = cache.latestRelease
          loading.value = false
          return
        }
        return fetch('https://api.github.com/repos/openseadragon/openseadragon/releases/latest')
          .then(r => r.json())
          .then(data => { release.value = data })
      })
      .catch(() => {})
      .finally(() => { loading.value = false })
  }

  const version = computed(() => {
    if (release.value?.tag_name) return release.value.tag_name.replace(/^v/, '')
    return window.OpenSeadragon?.version?.versionStr ?? null
  })

  const tag = computed(() => version.value ? `v${version.value}` : null)

  const prefixUrl = computed(() => {
    const v = window.OpenSeadragon?.version?.versionStr ?? version.value
    return `https://cdn.jsdelivr.net/npm/openseadragon@${v ?? 'latest'}/build/openseadragon/images/`
  })

  return { version, tag, prefixUrl, loading }
}
