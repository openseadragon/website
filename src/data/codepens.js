export const CODEPENS = [
  {
    id: 'bdgWBz',
    title: 'Basic OpenSeadragon example',
    cat: 'Basics',
    desc: 'The minimal setup — a div, a tile source, done. The right place to start.',
    hue: 200,
    html: `<div id="viewer"></div>`,
    css: `body { margin: 0; background: #111; }
#viewer { width: 100vw; height: 100vh; }`,
    js: `const viewer = OpenSeadragon({
  id: 'viewer',
  prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
  tileSources: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi',
  animationTime: 0.5,
  blendTime: 0.1,
  constrainDuringPan: true,
  maxZoomPixelRatio: 2,
  showNavigator: true,
  navigatorPosition: 'BOTTOM_RIGHT'
});`,
  },
  {
    id: 'vyWabR',
    title: 'Basic example with Overlay',
    cat: 'Overlays',
    desc: 'Anchor an HTML element in image space. Tracks pan, zoom, and rotation.',
    hue: 260,
    html: `<div id="viewer">
  <div id="overlay">📍 Overlay</div>
</div>`,
    css: `body { margin: 0; background: #111; }
#viewer { width: 100vw; height: 100vh; }
#overlay {
  background: rgba(255, 100, 100, 0.85);
  color: white;
  font-family: sans-serif;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}`,
    js: `const viewer = OpenSeadragon({
  id: 'viewer',
  prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
  tileSources: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi'
});

viewer.addHandler('open', () => {
  viewer.addOverlay({
    element: document.getElementById('overlay'),
    location: new OpenSeadragon.Rect(0.25, 0.2, 0.3, 0.08)
  });
});`,
  },
  {
    id: 'PoqpqmL',
    title: 'Annotations + SVG Overlay',
    cat: 'Overlays',
    desc: 'Draw SVG annotation shapes directly over a zoomable image.',
    hue: 140,
    html: `<div id="viewer">
  <!-- SVG elements work as overlays too -->
  <svg id="ann-a" xmlns="http://www.w3.org/2000/svg"
       width="200" height="120" style="pointer-events:none">
    <rect width="200" height="120" rx="4"
          fill="rgba(255,140,0,0.35)" stroke="orange" stroke-width="3"/>
    <text x="10" y="22" fill="white" font-size="14" font-family="sans-serif"
          font-weight="600">Region A</text>
  </svg>
  <svg id="ann-b" xmlns="http://www.w3.org/2000/svg"
       width="140" height="140" style="pointer-events:none">
    <circle cx="70" cy="70" r="66"
            fill="rgba(100,200,255,0.3)" stroke="#67d6ee" stroke-width="3"/>
    <text x="70" y="76" fill="white" font-size="14" font-family="sans-serif"
          font-weight="600" text-anchor="middle">Region B</text>
  </svg>
</div>`,
    css: `body { margin: 0; background: #111; }
#viewer { width: 100vw; height: 100vh; }`,
    js: `const viewer = OpenSeadragon({
  id: 'viewer',
  prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
  tileSources: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi'
});

viewer.addHandler('open', () => {
  viewer.addOverlay({
    element: document.getElementById('ann-a'),
    location: new OpenSeadragon.Rect(0.08, 0.1, 0.28, 0.17),
    rotationMode: OpenSeadragon.OverlayRotationMode.EXACT
  });

  viewer.addOverlay({
    element: document.getElementById('ann-b'),
    location: new OpenSeadragon.Rect(0.6, 0.55, 0.22, 0.22),
    rotationMode: OpenSeadragon.OverlayRotationMode.EXACT
  });
});`,
  },
  {
    id: 'mEZKaY',
    title: 'Overlay click',
    cat: 'Overlays',
    desc: 'Handle click events on overlaid DOM elements in image coordinates.',
    hue: 280,
    html: `<div id="viewer">
  <button id="hotspot">Click me!</button>
</div>
<div id="log">Click the hotspot above.</div>`,
    css: `body { margin: 0; background: #111; color: #eee; font-family: sans-serif; }
#viewer { width: 100vw; height: calc(100vh - 44px); }
#hotspot {
  background: rgba(103, 214, 238, 0.9);
  color: #0a1a22;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
}
#hotspot:hover { background: rgba(103, 214, 238, 1); }
#log {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  border-top: 1px solid #333;
}`,
    js: `const viewer = OpenSeadragon({
  id: 'viewer',
  prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
  tileSources: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi'
});

viewer.addHandler('open', () => {
  const btn = document.getElementById('hotspot');

  viewer.addOverlay({
    element: btn,
    location: new OpenSeadragon.Point(0.5, 0.4)
  });

  const tracker = new OpenSeadragon.MouseTracker({
    element: btn,
    clickHandler(e) {
      const vp = viewer.viewport.pointFromPixel(e.position);
      document.getElementById('log').textContent =
        \`Clicked at image coords: x=\${vp.x.toFixed(4)}, y=\${vp.y.toFixed(4)}\`;
    }
  });
  tracker.setTracking(true);
});`,
  },
  {
    id: 'poeqovO',
    title: 'Center on click',
    cat: 'Navigation',
    desc: 'Click anywhere to smoothly pan and center the viewport on that point.',
    hue: 220,
    html: `<div id="viewer"></div>
<div id="log">Click anywhere on the image to pan there.</div>`,
    css: `body { margin: 0; background: #111; color: #eee; font-family: sans-serif; }
#viewer { width: 100vw; height: calc(100vh - 44px); cursor: crosshair; }
#log {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  border-top: 1px solid #333;
}`,
    js: `const viewer = OpenSeadragon({
  id: 'viewer',
  prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
  tileSources: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi'
});

viewer.addHandler('canvas-click', e => {
  if (!e.quick) return; // ignore drags
  const point = viewer.viewport.pointFromPixel(e.position);
  viewer.viewport.panTo(point);
  document.getElementById('log').textContent =
    \`Panned to image coords: x=\${point.x.toFixed(4)}, y=\${point.y.toFixed(4)}\`;
});`,
  },
  {
    id: 'oVWNxJ',
    title: 'Collection Next/Previous',
    cat: 'Navigation',
    desc: 'Step through a collection of images with next/previous controls.',
    hue: 180,
    html: `<div id="viewer"></div>
<div id="controls">
  <button id="prev">← Prev</button>
  <span id="idx">1 / 3</span>
  <button id="next">Next →</button>
</div>`,
    css: `body { margin: 0; background: #111; color: #eee; font-family: sans-serif; }
#viewer { width: 100vw; height: calc(100vh - 52px); }
#controls {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  border-top: 1px solid #333;
}
button {
  background: #222;
  color: #eee;
  border: 1px solid #444;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}
button:hover { background: #333; }
#idx { font-size: 13px; color: rgba(255,255,255,0.5); min-width: 48px; text-align: center; }`,
    js: `const sources = [
  'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi',
  'https://openseadragon.github.io/example-images/duomo/duomo.dzi',
  'https://openseadragon.github.io/example-images/pnp/pnp.dzi'
];

const viewer = OpenSeadragon({
  id: 'viewer',
  prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
  tileSources: sources,
  sequenceMode: true,
  showSequenceControl: false
});

function updateIdx() {
  document.getElementById('idx').textContent =
    (viewer.currentPage() + 1) + ' / ' + sources.length;
}

document.getElementById('prev').onclick = () => {
  viewer.goToPreviousPage();
  setTimeout(updateIdx, 100);
};
document.getElementById('next').onclick = () => {
  viewer.goToNextPage();
  setTimeout(updateIdx, 100);
};`,
  },
  {
    id: 'wvVaXwd',
    title: 'Canvas drawer',
    cat: 'Advanced',
    desc: 'Render tiles using a custom canvas-based drawer and post-process with 2D context.',
    hue: 30,
    html: `<div id="viewer"></div>
<div id="controls">
  <label>Effect:
    <select id="effect">
      <option value="none">None</option>
      <option value="sepia">Sepia</option>
      <option value="invert">Invert</option>
      <option value="grayscale">Grayscale</option>
    </select>
  </label>
</div>`,
    css: `body { margin: 0; background: #111; color: #eee; font-family: sans-serif; }
#viewer { width: 100vw; height: calc(100vh - 52px); }
#controls {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-top: 1px solid #333;
  font-size: 13px;
}
select {
  background: #222;
  color: #eee;
  border: 1px solid #444;
  padding: 4px 8px;
  border-radius: 4px;
  margin-left: 8px;
}`,
    js: `const viewer = OpenSeadragon({
  id: 'viewer',
  prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
  tileSources: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi',
  drawer: 'canvas'
});

const select = document.getElementById('effect');

viewer.addHandler('update-viewport', () => {
  const canvas = viewer.drawer.canvas;
  if (!canvas) return;
  // CSS filters are the simplest way to post-process the canvas output
  canvas.style.filter = {
    none:      '',
    sepia:     'sepia(1)',
    invert:    'invert(1)',
    grayscale: 'grayscale(1)'
  }[select.value] || '';
});`,
  },
  {
    id: 'qBdabGM',
    title: 'Selection Rectangle',
    cat: 'Advanced',
    desc: 'Interactive selection rectangle that reports coordinates in image space.',
    hue: 0,
    html: `<div id="viewer"></div>
<div id="log">Drag on the image to select a region.</div>`,
    css: `body { margin: 0; background: #111; color: #eee; font-family: sans-serif; }
#viewer { width: 100vw; height: calc(100vh - 44px); cursor: crosshair; user-select: none; }
#sel {
  position: absolute;
  border: 2px solid #67d6ee;
  background: rgba(103, 214, 238, 0.12);
  pointer-events: none;
  box-shadow: 0 0 0 1px rgba(103, 214, 238, 0.3);
}
#log {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  border-top: 1px solid #333;
}`,
    js: `const viewer = OpenSeadragon({
  id: 'viewer',
  prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
  tileSources: 'https://openseadragon.github.io/example-images/highsmith/highsmith.dzi'
});

// Inject the selection div into OSD's canvas wrapper
viewer.addHandler('open', () => {
  const sel = document.createElement('div');
  sel.id = 'sel';
  sel.style.display = 'none';
  viewer.canvas.appendChild(sel);
});

let start = null;

viewer.addHandler('canvas-press', e => {
  start = e.position.clone();
  const sel = document.getElementById('sel');
  if (sel) { sel.style.display = 'block'; sel.style.width = sel.style.height = '0'; }
});

viewer.addHandler('canvas-drag', e => {
  if (!start) return;
  const sel = document.getElementById('sel');
  if (!sel) return;
  const x = Math.min(start.x, e.position.x);
  const y = Math.min(start.y, e.position.y);
  sel.style.left   = x + 'px';
  sel.style.top    = y + 'px';
  sel.style.width  = Math.abs(e.position.x - start.x) + 'px';
  sel.style.height = Math.abs(e.position.y - start.y) + 'px';
  e.preventDefaultAction = true; // stop OSD from panning
});

viewer.addHandler('canvas-release', e => {
  if (!start) return;
  const p1 = viewer.viewport.pointFromPixel(start);
  const p2 = viewer.viewport.pointFromPixel(e.position);
  const x = Math.min(p1.x, p2.x), y = Math.min(p1.y, p2.y);
  const w = Math.abs(p1.x - p2.x), h = Math.abs(p1.y - p2.y);
  document.getElementById('log').textContent =
    \`x=\${x.toFixed(4)} y=\${y.toFixed(4)} w=\${w.toFixed(4)} h=\${h.toFixed(4)}\`;
  start = null;
});`,
  },
]

export const FEATURED_CODEPENS = CODEPENS.slice(0, 3)
