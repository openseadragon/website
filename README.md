# OpenSeadragon Website

Marketing and documentation site for [OpenSeadragon](https://openseadragon.github.io) — a JavaScript library for deep-zoom of high-resolution tiled images.

Built with Vue 3 + Vite. Demonstrates the library by embedding live OSD viewers throughout.

## Tech Stack

- **Vue 3** with Composition API
- **Vue Router 4** (hash history)
- **Vite 6**
- **Fuse.js** — fuzzy search
- **PrismJS** — code highlighting
- **OpenSeadragon 6** — live viewers embedded in-page
- **anime.js 3** — scroll animations, counters, typewriter effects

## Getting Started

```bash
npm install
npm run dev      # dev server at http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build
```

## Project Structure

```
src/
  views/          # page-level components (one per route)
  components/     # shared UI (NavBar, SiteFooter, TweaksPanel, …)
  composables/    # reusable logic (useTheme, useSearch, useParticles, …)
  data/           # static data (docs, examples, plugins, API reference)
  router/         # Vue Router config
```

## Pages

| Route | View | Description |
|---|---|---|
| `/` | `HomeView.vue` | Hero, use cases, features, examples preview, community |
| `/docs` | `DocsView.vue` | Quickstart, guides, framework integrations |
| `/docs/:slug` | `DocPageView.vue` | Individual doc page |
| `/docs/api/:class` | `ApiPageView.vue` | API reference |
| `/examples` | `ExamplesView.vue` | Filterable gallery of working examples |
| `/plugins` | `PluginsView.vue` | Plugin ecosystem directory |
| `/demos` | `DemosView.vue` | Embedded CodePen demos |
| `/playground` | `PlaygroundView.vue` | Live code playground |
| `/community` | `CommunityView.vue` | GitHub, Discord, Stack Overflow, sponsor |
| `/in-the-wild` | `InTheWildView.vue` | Community-curated projects using OSD |

## Design System

CSS custom properties defined in `src/App.vue` / global styles:

- **Colors:** `--ink` scale (dark bg), `--paper` scale (text), `--accent` (default: aqua)
- **Accents:** aqua, coral, lime, violet — set via `data-accent` on `<html>`
- **Themes:** dark (default), light — toggled via `data-theme`, persisted in `localStorage`
- **Fonts:** Geist (sans), Geist Mono
- **Tweaks panel:** floating dev panel for switching theme/accent/demo image during design work

## Key Composables

| File | Purpose |
|---|---|
| `useTheme.js` | Theme + accent toggle, localStorage persistence |
| `useSearch.js` | Fuse.js-powered fuzzy search across docs/examples/API |
| `useParticles.js` | Canvas tile-particle field (hero background) |
| `usePluginsMap.js` | Hub-and-spoke plugin mindmap canvas |
| `useGitHubActivity.js` | Live GitHub commits + issues feed |
| `useGitHubPluginData.js` | Fetches plugin metadata from GitHub |
| `useOSDVersion.js` | Resolves latest OSD version from npm |
| `useAnimations.js` | Scroll-triggered anime.js reveal animations |
