import { createRouter, createWebHashHistory } from 'vue-router'

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
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title || 'OpenSeadragon'
})
