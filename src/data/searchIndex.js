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
  { title: 'Getting started',           subtitle: 'Guides',       tag: 'GUIDE',  hash: '#getting-started' },
  { title: 'Installation',              subtitle: 'Guides',       tag: 'GUIDE',  hash: '#installation' },
  { title: 'Your first viewer',         subtitle: 'Guides',       tag: 'GUIDE',  hash: '#first-viewer' },
  { title: 'Basic configuration',       subtitle: 'Guides',       tag: 'GUIDE',  hash: '#configuration' },
  { title: 'Tile sources',              subtitle: 'Guides',       tag: 'GUIDE',  hash: '#tile-sources' },
  { title: 'Creating tiles',            subtitle: 'Guides',       tag: 'GUIDE',  hash: '#creating-tiles' },
  { title: 'Viewport & coordinates',   subtitle: 'Guides',       tag: 'GUIDE',  hash: '#viewport' },
  { title: 'Overlays',                  subtitle: 'Guides',       tag: 'GUIDE',  hash: '#overlays' },
  { title: 'Controls & UI',             subtitle: 'Guides',       tag: 'GUIDE',  hash: '#controls' },
  { title: 'Multi-image worlds',        subtitle: 'Guides',       tag: 'GUIDE',  hash: '#multi-image' },
  { title: 'Events',                    subtitle: 'Guides',       tag: 'GUIDE',  hash: '#events' },
  { title: 'Viewer',                    subtitle: 'API reference', tag: 'API',   hash: '#api-viewer' },
  { title: 'Viewport',                  subtitle: 'API reference', tag: 'API',   hash: '#api-viewport' },
  { title: 'World',                     subtitle: 'API reference', tag: 'API',   hash: '#api-world' },
  { title: 'TiledImage',                subtitle: 'API reference', tag: 'API',   hash: '#api-tiledimage' },
  { title: 'TileSource',                subtitle: 'API reference', tag: 'API',   hash: '#api-tilesource' },
  { title: 'Overlay',                   subtitle: 'API reference', tag: 'API',   hash: '#api-overlay' },
  { title: 'MouseTracker',              subtitle: 'API reference', tag: 'API',   hash: '#api-mousetracker' },
  { title: 'Migration guide',           subtitle: 'Guides',       tag: 'GUIDE',  hash: '#migration' },
].map((doc, i) => ({
  id: `doc-${i}`,
  type: 'doc',
  title: doc.title,
  subtitle: doc.subtitle,
  tag: doc.tag,
  body: '',
  route: '/docs',
  hash: doc.hash,
}))

export const ALL_DOCS = [...docDocs, ...exampleDocs, ...pluginDocs]
