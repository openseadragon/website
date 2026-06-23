import { createRouter, createWebHistory } from 'vue-router'

// ── Legacy URL redirects (openseadragon.github.io old paths) ─────────────────
const LEGACY_REDIRECTS = {
  '/docs.html':         '/docs',
  '/getting-started':   '/docs',
  '/getting-started/':  '/docs',
  '/help':              '/docs',
  '/help/':             '/docs',
  '/examples/':         '/examples',
  '/plugins.html':      '/plugins',
  '/api':               '/docs/api/OpenSeadragon',
  '/api/':              '/docs/api/OpenSeadragon',
  '/jsdoc':             '/docs/api/OpenSeadragon',
  '/jsdoc/':            '/docs/api/OpenSeadragon',
}

const LEGACY_EXTERNAL = {
  '/license':   'https://github.com/openseadragon/openseadragon/blob/master/LICENSE.txt',
  '/license/':  'https://github.com/openseadragon/openseadragon/blob/master/LICENSE.txt',
}

const routes = [
  {
    path: '/',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'OSD — Deep zoom for the web' }
  },
  {
    path: '/docs',
    component: () => import('../views/DocsView.vue'),
    meta: { title: 'Docs — OpenSeadragon' }
  },
  {
    path: '/docs/:slug',
    component: () => import('../views/DocPageView.vue'),
    meta: { title: 'Docs — OpenSeadragon' }
  },
  {
    path: '/docs/api/:class',
    component: () => import('../views/ApiPageView.vue'),
    meta: { title: 'API — OpenSeadragon' }
  },
  {
    path: '/examples',
    component: () => import('../views/ExamplesView.vue'),
    meta: { title: 'Examples — OpenSeadragon' }
  },
  {
    path: '/plugins',
    component: () => import('../views/PluginsView.vue'),
    meta: { title: 'Plugins — OpenSeadragon' }
  },
  {
    path: '/demos',
    component: () => import('../views/DemosView.vue'),
    meta: { title: 'Demos — OpenSeadragon' }
  },
  {
    path: '/playground',
    component: () => import('../views/PlaygroundView.vue'),
    meta: { title: 'Playground — OpenSeadragon' }
  },
  {
    path: '/community',
    component: () => import('../views/CommunityView.vue'),
    meta: { title: 'Community — OpenSeadragon' }
  },
  {
    path: '/in-the-wild',
    component: () => import('../views/InTheWildView.vue'),
    meta: { title: 'In the Wild — OpenSeadragon' }
  },
  // Catch-all — 404
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: 'Not Found — OpenSeadragon' }
  }
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.beforeEach((to, _from, next) => {
  // External legacy redirects
  const ext = LEGACY_EXTERNAL[to.path]
  if (ext) { window.location.replace(ext); return }

  // Internal legacy redirects
  const leg = LEGACY_REDIRECTS[to.path]
  if (leg) { next(leg); return }

  next()
})

router.afterEach((to) => {
  document.title = to.meta.title || 'OpenSeadragon'
})
