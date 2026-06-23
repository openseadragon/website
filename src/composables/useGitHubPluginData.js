import { reactive, ref } from 'vue'

// Stable key — only change if the stored data shape changes incompatibly.
// Do NOT bump this just to force a refresh during development.
const CACHE_KEY = 'osd-plugin-gh-2'
const TTL_OK   = 24 * 60 * 60 * 1000 // 24 h — when we have real data
const TTL_FAIL =      60 * 60 * 1000  //  1 h — when rate-limited (matches reset window)

// In dev mode skip the cache so hot-reloads always show current fetch behaviour
const IS_DEV = typeof import.meta !== 'undefined' && import.meta.env?.DEV === true

async function ghFetch(url) {
  try {
    const res = await fetch(url)
    const remaining = parseInt(res.headers.get('x-ratelimit-remaining') ?? '-1', 10)
    if (!res.ok) return { ok: false, status: res.status, data: null, remaining }
    return { ok: true, status: res.status, data: await res.json(), remaining }
  } catch (_) {
    return { ok: false, status: 0, data: null, remaining: -1 }
  }
}

export function useGitHubPluginData(plugins) {
  const ghData = reactive({})
  const loading = ref(true)

  async function load() {
    // ── 1. Try cache ────────────────────────────────────────────────────────
    if (!IS_DEV) {
      try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (raw) {
          const { ts, ttl, data } = JSON.parse(raw)
          if (Date.now() - ts < (ttl ?? TTL_OK)) {
            Object.entries(data).forEach(([k, v]) => { ghData[k] = v })
            loading.value = false
            return
          }
        }
      } catch (_) {}
    }

    const toFetch = plugins.filter(p => p.repo)

    // ── 2. Phase 1: repo info ───────────────────────────────────────────────
    // 1 request per plugin. With 41 plugins this stays under the 60/hr
    // unauthenticated rate limit on a fresh session. Gives us stars + pushed_at.
    const repoResults = await Promise.allSettled(
      toFetch.map(p => ghFetch(`https://api.github.com/repos/${p.repo}`))
    )

    toFetch.forEach((p, i) => {
      const r = repoResults[i].status === 'fulfilled' ? repoResults[i].value : null
      ghData[p.repo] = r?.ok && r.data
        ? { stars: r.data.stargazers_count ?? null, updatedAt: r.data.pushed_at ?? null, version: null }
        : { stars: null, updatedAt: null, version: null }
    })

    // Flip loading now — all plugins immediately show stars + commit date (or —)
    loading.value = false

    // ── 3. Phase 2: latest release ──────────────────────────────────────────
    // Only fetch releases for plugins that returned data in Phase 1, and cap
    // the batch to the remaining rate-limit budget (keep a 5-request reserve).
    const remainingAfterPhase1 = repoResults.reduce((min, r) => {
      const rem = r.status === 'fulfilled' ? (r.value.remaining ?? -1) : -1
      return rem >= 0 ? Math.min(min, rem) : min
    }, Infinity)
    const phase2Budget = remainingAfterPhase1 === Infinity ? 10 : Math.max(0, remainingAfterPhase1 - 5)
    const phase2Candidates = toFetch.filter((_, i) => {
      const r = repoResults[i]
      return r.status === 'fulfilled' && r.value.ok
    }).slice(0, phase2Budget)

    await new Promise(r => setTimeout(r, 150))

    const releaseResults = await Promise.allSettled(
      phase2Candidates.map(p => ghFetch(`https://api.github.com/repos/${p.repo}/releases/latest`))
    )

    releaseResults.forEach((res, i) => {
      const r = res.status === 'fulfilled' ? res.value : null
      if (r?.ok && r.data?.tag_name) {
        const p = phase2Candidates[i]
        ghData[p.repo] = {
          ...ghData[p.repo],
          version: r.data.tag_name,
          updatedAt: r.data.published_at ?? ghData[p.repo]?.updatedAt,
        }
      }
    })

    // ── 4. Persist ──────────────────────────────────────────────────────────
    if (!IS_DEV) {
      try {
        const snapshot = {}
        Object.entries(ghData).forEach(([k, v]) => { snapshot[k] = { ...v } })
        // If every plugin failed (rate-limited), use a short TTL so we retry
        // as soon as the rate limit window resets (~1 h).
        const anyData = Object.values(snapshot).some(v => v.stars != null || v.updatedAt != null)
        const ttl = anyData ? TTL_OK : TTL_FAIL
        localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), ttl, data: snapshot }))
      } catch (_) {}
    }
  }

  load()

  return { ghData, loading }
}
