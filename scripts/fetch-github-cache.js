#!/usr/bin/env node
/**
 * Fetches GitHub data at build time and writes public/data/github-cache.json.
 * Run via: node scripts/fetch-github-cache.js
 * Runs automatically as "prebuild" in package.json.
 *
 * Produces a single JSON file consumed by three composables:
 *   useOSDVersion        → cache.latestRelease
 *   useGitHubActivity    → cache.activity
 *   useGitHubPluginData  → cache.plugins
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const OUT  = resolve(ROOT, 'public', 'data', 'github-cache.json')

const BASE = 'https://api.github.com/repos/openseadragon/openseadragon'
const HEADERS = {
  'User-Agent': 'osd-website-build',
  'Accept': 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

async function get(url) {
  const res = await fetch(url, { headers: HEADERS })
  const remaining = res.headers.get('x-ratelimit-remaining')
  if (!res.ok) {
    console.warn(`  ✗ ${url} → ${res.status} (remaining: ${remaining})`)
    return null
  }
  console.log(`  ✓ ${url} (remaining: ${remaining})`)
  return res.json()
}

// ── Load plugin repos from source data ───────────────────────────────────────
function loadPluginRepos() {
  const src = readFileSync(resolve(ROOT, 'src', 'data', 'plugins.js'), 'utf-8')
  const repos = []
  for (const m of src.matchAll(/repo:\s*['"]([^'"]+)['"]/g)) {
    repos.push(m[1])
  }
  return [...new Set(repos)]
}

// ── Fetch ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n[github-cache] Starting fetch...')

  // 1. Latest OSD release
  console.log('\n[github-cache] Fetching OSD release...')
  const latestRelease = await get(`${BASE}/releases/latest`)

  // 2. Activity feed (commits + releases + issues)
  console.log('\n[github-cache] Fetching activity feed...')
  const [commits, releases, issues] = await Promise.all([
    get(`${BASE}/commits?per_page=20`),
    get(`${BASE}/releases?per_page=10`),
    get(`${BASE}/issues?state=open&per_page=10&sort=updated&direction=desc`),
  ])

  // 3. Plugin data — repo info in parallel, then releases
  console.log('\n[github-cache] Fetching plugin repo info...')
  const pluginRepos = loadPluginRepos()
  const repoInfos = await Promise.all(
    pluginRepos.map(r => get(`https://api.github.com/repos/${r}`))
  )

  const pluginsPhase1 = {}
  pluginRepos.forEach((repo, i) => {
    const d = repoInfos[i]
    pluginsPhase1[repo] = d
      ? { stars: d.stargazers_count ?? null, updatedAt: d.pushed_at ?? null, version: null }
      : { stars: null, updatedAt: null, version: null }
  })

  console.log('\n[github-cache] Fetching plugin latest releases...')
  const validRepos = pluginRepos.filter((_, i) => repoInfos[i] !== null)
  const releaseInfos = await Promise.all(
    validRepos.map(r => get(`https://api.github.com/repos/${r}/releases/latest`))
  )

  const plugins = { ...pluginsPhase1 }
  validRepos.forEach((repo, i) => {
    const d = releaseInfos[i]
    if (d?.tag_name) {
      plugins[repo] = {
        ...plugins[repo],
        version: d.tag_name,
        updatedAt: d.published_at ?? plugins[repo]?.updatedAt,
      }
    }
  })

  // ── Write output ─────────────────────────────────────────────────────────────
  const cache = {
    generatedAt: new Date().toISOString(),
    latestRelease: latestRelease ?? null,
    activity: { commits: commits ?? [], releases: releases ?? [], issues: issues ?? [] },
    plugins,
  }

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, JSON.stringify(cache, null, 2))
  console.log(`\n[github-cache] Written to ${OUT}`)
  console.log(`[github-cache] Plugins cached: ${Object.keys(plugins).length}`)
}

main().catch(err => {
  console.error('[github-cache] Error:', err.message)
  // Don't fail the build if GitHub is unreachable — serve from whatever cache exists
  process.exit(0)
})
