import { ref, computed } from 'vue'

const BASE = 'https://api.github.com/repos/openseadragon/openseadragon'

const commitsFeed = ref(null)
const issuesFeed = ref(null)
let fetched = false

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const day = 864e5
  if (diff < day) return 'today'
  if (diff < 2 * day) return '1 day ago'
  if (diff < 7 * day) return `${Math.floor(diff / day)} days ago`
  if (diff < 14 * day) return '1w ago'
  if (diff < 30 * day) return `${Math.floor(diff / (7 * day))}w ago`
  if (diff < 60 * day) return '1mo ago'
  return `${Math.floor(diff / (30 * day))}mo ago`
}

function parseMergeCommit(message) {
  const m = message.match(/^Merge pull request #(\d+) from [^\n]+\n+(.*)/s)
  if (m) return { pr: m[1], body: m[2].split('\n')[0].trim() }
  return null
}

function buildFeedsFromCache(cache) {
  const { commits = [], releases = [], issues = [] } = cache.activity ?? {}

  const commitItems = (Array.isArray(commits) ? commits : [])
    .filter(c => c?.commit?.author?.date)
    .map(c => {
      const msg = c.commit.message
      const merge = parseMergeCommit(msg)
      return {
        type: 'commit',
        who: c.author?.login || c.commit.author.name,
        date: c.commit.author.date,
        pr: merge?.pr || null,
        message: (merge?.body || msg.split('\n')[0]).slice(0, 90),
        url: c.html_url,
      }
    })

  const releaseItems = (Array.isArray(releases) ? releases : []).map(r => {
    const firstLine = (r.body || '')
      .split('\n')
      .map(l => l.trim())
      .find(l => l && !l.startsWith('#') && !l.startsWith('<!--')) || r.name || r.tag_name
    return {
      type: 'release',
      who: r.author?.login || 'maintainer',
      date: r.published_at,
      tag: r.tag_name,
      message: firstLine.replace(/\*\*/g, '').slice(0, 90),
      url: r.html_url,
    }
  })

  commitsFeed.value = [...commitItems, ...releaseItems]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)

  issuesFeed.value = (Array.isArray(issues) ? issues : []).slice(0, 6).map(issue => {
    const isPR = !!issue.pull_request
    const labelNames = issue.labels.map(l => l.name)
    const knownLabel = labelNames.find(l => ['bug', 'enhancement', 'question'].includes(l))
    return {
      type: isPR ? 'pr' : 'issue',
      who: issue.user?.login || 'someone',
      date: isPR ? (issue.updated_at || issue.created_at) : issue.created_at,
      number: issue.number,
      title: issue.title.slice(0, 90),
      url: issue.html_url,
      tag: isPR ? 'PR' : (knownLabel || 'issue'),
      isPR,
    }
  })
}

function fetchLive() {
  Promise.all([
    fetch(`${BASE}/commits?per_page=20`).then(r => r.ok ? r.json() : []),
    fetch(`${BASE}/releases?per_page=10`).then(r => r.ok ? r.json() : []),
  ]).then(([commits, releases]) => {
    buildFeedsFromCache({ activity: { commits, releases, issues: [] } })
  }).catch(() => { commitsFeed.value = [] })

  fetch(`${BASE}/issues?state=open&per_page=10&sort=updated&direction=desc`)
    .then(r => r.ok ? r.json() : [])
    .then(issues => {
      if (issuesFeed.value === null) buildFeedsFromCache({ activity: { commits: [], releases: [], issues } })
      else {
        issuesFeed.value = (Array.isArray(issues) ? issues : []).slice(0, 6).map(issue => {
          const isPR = !!issue.pull_request
          const labelNames = issue.labels.map(l => l.name)
          const knownLabel = labelNames.find(l => ['bug', 'enhancement', 'question'].includes(l))
          return {
            type: isPR ? 'pr' : 'issue',
            who: issue.user?.login || 'someone',
            date: isPR ? (issue.updated_at || issue.created_at) : issue.created_at,
            number: issue.number,
            title: issue.title.slice(0, 90),
            url: issue.html_url,
            tag: isPR ? 'PR' : (knownLabel || 'issue'),
            isPR,
          }
        })
      }
    }).catch(() => { issuesFeed.value = [] })
}

export function useGitHubActivity() {
  if (!fetched) {
    fetched = true

    const cacheUrl = import.meta.env.BASE_URL + 'data/github-cache.json'
    fetch(cacheUrl)
      .then(r => r.ok ? r.json() : null)
      .then(cache => {
        if (cache?.activity) {
          buildFeedsFromCache(cache)
        } else {
          fetchLive()
        }
      })
      .catch(() => fetchLive())
  }

  const loading = computed(() => commitsFeed.value === null || issuesFeed.value === null)

  return { commitsFeed, issuesFeed, loading, relativeTime }
}
