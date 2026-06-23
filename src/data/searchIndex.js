import { EXAMPLES_DATA } from './examples.js'
import { PLUGINS_DATA } from './plugins.js'

const exampleDocs = EXAMPLES_DATA.map((ex, i) => ({
  id: `example-${i}`,
  type: 'example',
  title: ex.title,
  subtitle: ex.cat,
  tag: ex.tag,
  body: '',
  route: '/examples',
  hash: '',
}))

const pluginDocs = PLUGINS_DATA.map((pl, i) => ({
  id: `plugin-${i}`,
  type: 'plugin',
  title: pl.name,
  subtitle: pl.cat,
  tag: pl.cat,
  body: pl.desc,
  route: '/plugins',
  hash: '',
}))

const docDocs = [
  { title: 'Getting started',           subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#getting-started' },
  { title: 'Installation',              subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#install' },
  { title: 'Your first viewer',         subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#mount' },
  { title: 'Basic configuration',       subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#api' },
  { title: 'Tile sources',              subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#getting-started' },
  { title: 'Creating tiles',            subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#getting-started' },
  { title: 'Viewport & coordinates',    subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#getting-started' },
  { title: 'Overlays',                  subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#getting-started' },
  { title: 'Controls & UI',             subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#getting-started' },
  { title: 'Multi-image worlds',        subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#getting-started' },
  { title: 'Events',                    subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#events' },
  { title: 'Viewer',                    subtitle: 'API reference',  tag: 'API',  route: '/docs/api/Viewer',   hash: '' },
  { title: 'Viewport',                  subtitle: 'API reference',  tag: 'API',  route: '/docs/api/Viewport', hash: '' },
  { title: 'World',                     subtitle: 'API reference',  tag: 'API',  route: '/docs/api/World',    hash: '' },
  { title: 'TiledImage',                subtitle: 'API reference',  tag: 'API',  route: '/docs/api/TiledImage', hash: '' },
  { title: 'TileSource',                subtitle: 'API reference',  tag: 'API',  route: '/docs/api/TileSource', hash: '' },
  { title: 'Overlay',                   subtitle: 'API reference',  tag: 'API',  route: '/docs/api/Overlay',  hash: '' },
  { title: 'MouseTracker',              subtitle: 'API reference',  tag: 'API',  route: '/docs/api/MouseTracker', hash: '' },
  { title: 'Migration guide',           subtitle: 'Guides',        tag: 'GUIDE', route: '/docs',              hash: '#migration' },
].map((doc, i) => ({
  id: `doc-${i}`,
  type: 'doc',
  title: doc.title,
  subtitle: doc.subtitle,
  tag: doc.tag,
  body: '',
  route: doc.route,
  hash: doc.hash,
}))

export const ALL_DOCS = [...docDocs, ...exampleDocs, ...pluginDocs]
