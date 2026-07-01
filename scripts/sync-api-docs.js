#!/usr/bin/env node
/**
 * Syncs OSD JSDoc from the GitHub source tree into src/data/api.js.
 *
 * Usage:
 *   node scripts/sync-api-docs.js            # dry-run: print diff report
 *   node scripts/sync-api-docs.js --write    # write src/data/api-generated.js
 *   GITHUB_TOKEN=ghp_... node scripts/sync-api-docs.js
 *
 * The script fetches raw source files from openseadragon/openseadragon@main,
 * parses JSDoc blocks, and compares extracted methods against the current
 * API_CLASSES in src/data/api.js, reporting additions, removals, and changed
 * signatures. Pass --write to output a generated file for human review.
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const WRITE = process.argv.includes('--write')

const GH_RAW  = 'https://raw.githubusercontent.com/openseadragon/openseadragon/master'
const GH_API  = 'https://api.github.com/repos/openseadragon/openseadragon'
const HEADERS = {
  'User-Agent': 'osd-website-sync',
  'Accept': 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN ? { 'Authorization': `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
}

// ── Class name → source file mapping ─────────────────────────────────────────
// Derived from OSD's src/ directory naming conventions.
const CLASS_SOURCE_MAP = {
  OpenSeadragon:      'src/openseadragon.js',
  Viewer:             'src/viewer.js',
  Viewport:           'src/viewport.js',
  TiledImage:         'src/tiledimage.js',
  World:              'src/world.js',
  TileSource:         'src/tilesource.js',
  DziTileSource:      'src/dzitilesource.js',
  IIIFTileSource:     'src/iiiftilesource.js',
  IIPTileSource:      'src/iiptilesource.js',
  IrisTileSource:     'src/iristilesource.js',
  ImageTileSource:    'src/imagetilesource.js',
  OsmTileSource:      'src/osmtilesource.js',
  TmsTileSource:      'src/tmstilesource.js',
  ZoomifyTileSource:  'src/zoomifytilesource.js',
  LegacyTileSource:   'src/legacytilesource.js',
  DrawerBase:         'src/drawerbase.js',
  CanvasDrawer:       'src/canvasdrawer.js',
  WebGLDrawer:        'src/webgldrawer.js',
  HTMLDrawer:         'src/htmldrawer.js',
  Tile:               'src/tile.js',
  TileCache:          'src/tilecache.js',
  CacheRecord:        'src/tilecache.js',
  Overlay:            'src/overlay.js',
  MouseTracker:       'src/mousetracker.js',
  Navigator:          'src/navigator.js',
  ReferenceStrip:     'src/referencestrip.js',
  Button:             'src/button.js',
  ButtonGroup:        'src/buttongroup.js',
  Control:            'src/control.js',
  ControlDock:        'src/controldock.js',
  Point:              'src/point.js',
  Rect:               'src/rectangle.js',
  Spring:             'src/spring.js',
  DisplayRect:        'src/displayrectangle.js',
  Mat3:               'src/matrix3.js',
  EventSource:        'src/eventsource.js',
  DataTypeConverter:  'src/datatypeconverter.js',
  ImageLoader:        'src/imageloader.js',
  ImageJob:           'src/imageloader.js',
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────
async function fetchText(url) {
  const res = await fetch(url, { headers: HEADERS })
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${url}`)
  return res.text()
}

// ── JSDoc parser ──────────────────────────────────────────────────────────────
function parseJSDocBlocks(source, className) {
  const methods = []
  const members = []

  // Match each /** ... */ block followed by the next line (for context)
  const blockRe = /\/\*\*([\s\S]*?)\*\/\s*\n([^\n]*)/g
  let m
  while ((m = blockRe.exec(source)) !== null) {
    const block = m[1]
    const nextLine = m[2].trim()

    // Extract tags
    const tags = {}
    const paramList = []

    // @memberof OpenSeadragon.ClassName  →  which class this belongs to
    const memberofM = block.match(/@memberof\s+([\w.]+)/)
    const memberof = memberofM ? memberofM[1].replace('OpenSeadragon.', '') : null

    // @function / @method name
    const fnM = block.match(/@(?:function|method)\s+(\w+)/)
    const fnName = fnM ? fnM[1] : null

    // @param {Type} [name] description
    const paramRe = /@param\s+\{([^}]+)\}\s+(?:\[)?(\w+)(?:\])?\s*(.*)/g
    let pM
    while ((pM = paramRe.exec(block)) !== null) {
      const optional = block.includes(`[${pM[2]}]`)
      paramList.push({
        name: pM[2],
        type: normalizeType(pM[1]),
        ...(optional ? { optional: true } : {}),
        description: pM[3].replace(/\s*-\s*/, '').trim(),
      })
    }

    // @returns / @return {Type} description
    const retM = block.match(/@returns?\s+\{([^}]+)\}\s*(.*)/)
    const returns = retM ? normalizeType(retM[1]) : null

    // @description (multi-line until next tag)
    const descM = block.match(/@description\s+([\s\S]*?)(?=\s*@|\s*$)/)
    let description = descM
      ? descM[1].replace(/\s*\*\s*/g, ' ').trim()
      : extractLeadDescription(block)

    // @type for members
    const typeM = block.match(/@type\s+\{([^}]+)\}/)
    const memberType = typeM ? normalizeType(typeM[1]) : null

    // @member / @var  →  instance member
    const isMember = /@(?:member|var|property)\b/.test(block) || (memberType && !fnName)

    // Determine name: explicit tag, or infer from next line
    const name = fnName || inferName(nextLine)
    if (!name) continue

    // Only include items that belong to this class (or have no explicit memberof)
    if (memberof && memberof !== className) continue

    if (isMember && memberType) {
      members.push({ name, type: memberType, description: description || '' })
    } else if (!isMember && (fnName || looksLikeMethod(nextLine))) {
      const entry = { name, returns: returns || 'void', description: description || '' }
      if (paramList.length) entry.params = paramList
      methods.push(entry)
    }
  }

  return { methods, members }
}

function normalizeType(raw) {
  return raw
    .replace(/OpenSeadragon\./g, '')
    .replace(/\|/g, '|')
    .trim()
}

function extractLeadDescription(block) {
  // First line(s) of the JSDoc block before the first @ tag
  const lines = block.split('\n')
  const desc = []
  for (const line of lines) {
    const clean = line.replace(/^\s*\*\s?/, '').trim()
    if (clean.startsWith('@')) break
    if (clean) desc.push(clean)
  }
  return desc.join(' ').trim()
}

function inferName(line) {
  // prototype method: Foo.prototype.bar = function
  const protoM = line.match(/\.prototype\.(\w+)\s*=\s*function/)
  if (protoM) return protoM[1]
  // direct assignment: $.bar = function
  const dollarM = line.match(/\$\.(\w+)\s*=\s*function/)
  if (dollarM) return dollarM[1]
  // ES6 method shorthand in object/class: bar(
  const methodM = line.match(/^\s*(\w+)\s*\(/)
  if (methodM && !['if', 'for', 'while', 'switch', 'function'].includes(methodM[1])) return methodM[1]
  return null
}

function looksLikeMethod(line) {
  return /\bfunction\b|\.prototype\.|^\s*\w+\s*\(/.test(line)
}

// ── Load current api.js entries for diffing ───────────────────────────────────
function loadCurrentAPI() {
  const src = readFileSync(resolve(ROOT, 'src', 'data', 'api.js'), 'utf-8')
  // Extract method names per class using regex (avoids a full JS parse)
  const result = {}
  const classRe = /'(\w+)':\s*\{[\s\S]*?(?=^\s*'|\Z)/gm
  const methodNameRe = /\{\s*name:\s*'(\w+)'/g
  let cm
  while ((cm = classRe.exec(src)) !== null) {
    const className = cm[1]
    const block = cm[0]
    result[className] = new Set()
    let mm
    while ((mm = methodNameRe.exec(block)) !== null) {
      result[className].add(mm[1])
    }
    methodNameRe.lastIndex = 0
  }
  return result
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n[sync-api-docs] Fetching OSD source files from GitHub...\n')

  const currentAPI = loadCurrentAPI()
  const report = { added: [], removed: [], unchanged: [], errors: [] }
  const generated = {}

  const uniqueFiles = [...new Set(Object.values(CLASS_SOURCE_MAP))]
  const fileCache = {}

  // Download all unique source files
  await Promise.all(
    uniqueFiles.map(async (file) => {
      try {
        fileCache[file] = await fetchText(`${GH_RAW}/${file}`)
        process.stdout.write(`  ✓ ${file}\n`)
      } catch (e) {
        process.stdout.write(`  ✗ ${file} — ${e.message}\n`)
        report.errors.push(file)
      }
    })
  )

  // Parse each class
  for (const [className, file] of Object.entries(CLASS_SOURCE_MAP)) {
    const source = fileCache[file]
    if (!source) continue

    const { methods, members } = parseJSDocBlocks(source, className)
    generated[className] = { methods, members }

    const current = currentAPI[className] || new Set()
    const extracted = new Set(methods.map(m => m.name))

    const added   = [...extracted].filter(n => !current.has(n))
    const removed = [...current  ].filter(n => !extracted.has(n))

    if (added.length)   report.added.push({ className, methods: added })
    if (removed.length) report.removed.push({ className, methods: removed })
    if (!added.length && !removed.length) report.unchanged.push(className)
  }

  // ── Print report ────────────────────────────────────────────────────────────
  console.log('\n── SYNC REPORT ───────────────────────────────────────────────\n')

  if (report.added.length) {
    console.log('METHODS FOUND IN SOURCE but NOT in api.js (candidates to add):')
    for (const { className, methods } of report.added) {
      console.log(`  ${className}: ${methods.join(', ')}`)
    }
    console.log()
  }

  if (report.removed.length) {
    console.log('METHODS IN api.js NOT FOUND in source (candidates to remove or renamed):')
    for (const { className, methods } of report.removed) {
      console.log(`  ${className}: ${methods.join(', ')}`)
    }
    console.log()
  }

  console.log(`Unchanged classes: ${report.unchanged.join(', ') || 'none'}`)
  if (report.errors.length) console.log(`\nFetch errors: ${report.errors.join(', ')}`)

  // ── Write generated file ────────────────────────────────────────────────────
  if (WRITE) {
    const lines = [
      '// AUTO-GENERATED by scripts/sync-api-docs.js — review before merging into api.js',
      `// Generated: ${new Date().toISOString()}`,
      '',
      'export const API_CLASSES_GENERATED = {',
    ]

    for (const [className, { methods, members }] of Object.entries(generated)) {
      lines.push(`  '${className}': {`)
      lines.push(`    name: '${className}',`)
      if (members.length) {
        lines.push('    members: [')
        for (const m of members) {
          lines.push(`      { name: '${m.name}', type: '${m.type}', description: ${JSON.stringify(m.description)} },`)
        }
        lines.push('    ],')
      }
      lines.push('    methods: [')
      for (const m of methods) {
        const params = m.params?.length
          ? `, params: [${m.params.map(p => `{ name: '${p.name}', type: '${p.type}'${p.optional ? ', optional: true' : ''}, description: ${JSON.stringify(p.description)} }`).join(', ')}]`
          : ''
        lines.push(`      { name: '${m.name}', returns: '${m.returns}'${params}, description: ${JSON.stringify(m.description)} },`)
      }
      lines.push('    ],')
      lines.push('  },')
    }

    lines.push('}')

    const outPath = resolve(ROOT, 'src', 'data', 'api-generated.js')
    writeFileSync(outPath, lines.join('\n'))
    console.log(`\n[sync-api-docs] Written to ${outPath}`)
    console.log('[sync-api-docs] Review the file and manually merge changes into api.js')
  } else {
    console.log('\nRun with --write to output src/data/api-generated.js for review.')
  }
}

main().catch(err => {
  console.error('[sync-api-docs] Error:', err.message)
  process.exit(1)
})
