// Navigation sidebar structure — drives both DocsView and DocPageView sidebars
export const DOC_NAV = [
  {
    label: 'Getting Started',
    items: [
      { title: 'Quickstart', path: '/docs' },
      { title: 'Creating zooming images', path: '/docs/creating-zooming-images' },
      { title: 'Viewport & coordinates', path: '/docs/viewport-coordinates' },
    ],
  },
  {
    label: 'Tile Sources',
    items: [
      { title: 'Image', path: '/docs/tilesource-image' },
      { title: 'DZI', path: '/docs/tilesource-dzi' },
      { title: 'IIIF', path: '/docs/tilesource-iiif' },
      { title: 'OpenStreetMap', path: '/docs/tilesource-osm' },
      { title: 'Zoomify', path: '/docs/tilesource-zoomify' },
      { title: 'TMS', path: '/docs/tilesource-tms' },
      { title: 'IIP', path: '/docs/tilesource-iip' },
      { title: 'Legacy', path: '/docs/tilesource-legacy' },
      { title: 'Custom', path: '/docs/tilesource-custom' },
      { title: 'Custom (advanced)', path: '/docs/tilesource-custom-advanced' },
    ],
  },
  {
    label: 'UI & Controls',
    items: [
      { title: 'Zoom & pan', path: '/docs/ui-zoom-and-pan' },
      { title: 'Overlays', path: '/docs/ui-overlays' },
      { title: 'Viewport navigator', path: '/docs/ui-viewport-navigator' },
      { title: 'Rotation', path: '/docs/ui-rotation' },
      { title: 'Toolbar', path: '/docs/ui-toolbar' },
      { title: 'Custom buttons', path: '/docs/ui-binding-custom-buttons' },
      { title: 'Keyboard navigation', path: '/docs/ui-keyboard-navigation' },
      { title: 'Customize tooltips', path: '/docs/ui-customize-tooltips' },
      { title: 'Polygon cropping', path: '/docs/ui-tiledimage-polygon-cropping' },
    ],
  },
  {
    label: 'Multi-Image',
    items: [
      { title: 'Sequence mode', path: '/docs/tilesource-sequence' },
      { title: 'Reference strip', path: '/docs/ui-reference-strip' },
      { title: 'Collection mode', path: '/docs/tilesource-collection' },
      { title: 'Multi-image worlds', path: '/docs/multi-image' },
    ],
  },
  {
    label: 'Data',
    items: [
      { title: 'Data modifications', path: '/docs/data-modifications' },
      { title: 'Data types', path: '/docs/data-types' },
      { title: 'Drawer design', path: '/docs/drawer-design' },
    ],
  },
  {
    label: 'Developer Tools',
    items: [
      { title: 'Debug mode', path: '/docs/developer-debug-mode' },
    ],
  },
  {
    label: 'Frameworks',
    items: [
      { title: 'Web frameworks', path: '/docs/framework-web' },
      { title: 'Desktop apps', path: '/docs/framework-desktop' },
    ],
  },
  {
    label: 'Migration',
    items: [
      { title: 'v5 → v6', path: '/docs/migration-v6' },
      { title: 'v4 → v5', path: '/docs/migration-v5' },
    ],
  },
  {
    label: 'API Reference',
    items: [
      { title: 'OpenSeadragon', path: '/docs/api/OpenSeadragon' },
      { title: 'Viewer', path: '/docs/api/Viewer' },
      { title: 'Options', path: '/docs/api/Options' },
      { title: 'Viewport', path: '/docs/api/Viewport' },
      { title: 'TiledImage', path: '/docs/api/TiledImage' },
      { title: 'World', path: '/docs/api/World' },
      { title: 'TileSource', path: '/docs/api/TileSource' },
      { title: 'MouseTracker', path: '/docs/api/MouseTracker' },
      { title: 'Overlay', path: '/docs/api/Overlay' },
      { title: 'Point', path: '/docs/api/Point' },
      { title: 'Rect', path: '/docs/api/Rect' },
      { title: 'DrawerBase', path: '/docs/api/DrawerBase' },
      { title: 'EventSource', path: '/docs/api/EventSource' },
    ],
  },
]

// Block types used in sections:
//   { type: 'p', html }           — paragraph (may include <code>, <a>, <b> HTML)
//   { type: 'code', filename, code } — code block
//   { type: 'callout', title, html } — highlighted note/warning
//   { type: 'ul', items }         — bullet list of HTML strings
//   { type: 'h3', text }          — sub-section heading

export const DOCS_PAGES = {
  'creating-zooming-images': {
    title: 'Creating Zooming Images',
    category: 'Getting Started',
    lede: 'OpenSeadragon works with tiled image formats that allow on-demand access to portions of a large image. Large images must be converted into a tile pyramid before use.',
    sections: [
      {
        id: 'hosted',
        heading: 'Hosted conversion',
        blocks: [
          { type: 'p', html: 'The fastest way to get started is to use a hosted conversion service. Two recommended options:' },
          {
            type: 'ul',
            items: [
              '<a href="https://zoomable.ca" target="_blank" rel="noopener" style="color:var(--accent)">Zoomable</a> — free and premium tiers, with WordPress and Photoshop plugins.',
              '<a href="https://zoomhub.net" target="_blank" rel="noopener" style="color:var(--accent)">ZoomHub</a> — free for personal use, includes a REST API.',
            ],
          },
        ],
      },
      {
        id: 'vips',
        heading: 'Self-hosted with VIPS',
        blocks: [
          { type: 'p', html: '<a href="https://www.libvips.org/" target="_blank" rel="noopener" style="color:var(--accent)">VIPS</a> is the recommended self-hosted tool — fast, robust, and cross-platform. It can generate DZI pyramids directly from the command line.' },
          {
            type: 'code',
            filename: 'terminal',
            code: '# Install vips, then convert any image to DZI\nvips dzsave painting.tiff output --suffix .jpg',
          },
          { type: 'p', html: 'The <code>output.dzi</code> file and <code>output_files/</code> directory are what you point OpenSeadragon at.' },
        ],
      },
      {
        id: 'dzi-tools',
        heading: 'DZI format tools',
        blocks: [
          { type: 'p', html: 'DZI (Deep Zoom Image) is an XML specification maintained by Microsoft. Many converters exist across languages:' },
          {
            type: 'ul',
            items: [
              '<b>Sharp</b> (Node.js) — uses VIPS under the hood; great for automated pipelines.',
              '<b>deepzoom.py</b> (Python) — lightweight, no dependencies beyond Pillow.',
              '<b>DZT</b> (Ruby) — image slicing library for Ruby apps.',
              '<b>Deepzoom</b> (PHP) — single-file PHP converter.',
            ],
          },
        ],
      },
      {
        id: 'iiif-tools',
        heading: 'IIIF image servers',
        blocks: [
          { type: 'p', html: 'If you need IIIF compliance (museums, libraries, research), run a dedicated image server:' },
          {
            type: 'ul',
            items: [
              '<b>Cantaloupe</b> — Java server, feature-rich, widely deployed in cultural heritage.',
              '<b>IIPImage</b> — C++ server, extremely fast, JPEG 2000 native.',
              '<b>Loris</b> — Python WSGI server, simple to configure.',
            ],
          },
        ],
      },
      {
        id: 'other-formats',
        heading: 'Other formats',
        blocks: [
          {
            type: 'ul',
            items: [
              '<b>TMS / OSM</b> — use GDAL (<code>gdal2tiles</code>) or MapTiler to generate XYZ tile pyramids.',
              '<b>Zoomify</b> — generate tiles from scripts in PHP, Python, or Node; also supported by several desktop apps.',
              '<b>IIP</b> — use IIPImage server; supports TIFF, JPEG 2000, and more.',
            ],
          },
        ],
      },
    ],
  },

  'viewport-coordinates': {
    title: 'Viewport Coordinates',
    category: 'Getting Started',
    lede: 'OpenSeadragon uses three distinct coordinate systems. Understanding them unlocks overlays, multi-image placement, and precise programmatic control.',
    sections: [
      {
        id: 'systems',
        heading: 'The three coordinate systems',
        blocks: [
          { type: 'p', html: '<b>Image coordinates</b> — the actual pixels of your image. A 1000 px wide image has x from 0 to 1000.' },
          { type: 'p', html: '<b>Web coordinates</b> — standard CSS pixel coordinates of the webpage. On retina displays these may not match physical screen pixels.' },
          { type: 'p', html: '<b>Viewport coordinates</b> — an arbitrary normalized space OpenSeadragon uses internally. By default, a single image occupies x&nbsp;0–1 horizontally. The bottom edge depends on aspect ratio (y&nbsp;=&nbsp;0.5 for a 2:1 image).' },
        ],
      },
      {
        id: 'single-image',
        heading: 'Single-image default placement',
        blocks: [
          { type: 'p', html: 'When a single image is opened, its left edge is at viewport x&nbsp;=&nbsp;0 and its right edge at x&nbsp;=&nbsp;1. The top is y&nbsp;=&nbsp;0. The bottom is y&nbsp;=&nbsp;aspectRatio (height / width).' },
        ],
      },
      {
        id: 'multi-image',
        heading: 'Multi-image placement',
        blocks: [
          { type: 'p', html: 'When using <code>addTiledImage</code>, specify x, y, and either width or height in viewport coordinates. The other dimension is calculated from the image\'s aspect ratio.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `viewer.addTiledImage({
  tileSource: 'painting.dzi',
  x: 0,
  y: 0,
  width: 1
});

viewer.addTiledImage({
  tileSource: 'detail.dzi',
  x: 1.1,   // 0.1 gap to the right of the first image
  y: 0,
  width: 0.5
});`,
          },
        ],
      },
      {
        id: 'conversion',
        heading: 'Converting between systems',
        blocks: [
          { type: 'p', html: 'Use the <code>Viewport</code> and <code>TiledImage</code> APIs to convert between systems. <code>MouseTracker</code> events give you web coordinates; most positioning APIs expect viewport coordinates.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `viewer.addHandler('canvas-click', function(event) {
  // web → viewport
  const viewportPoint = viewer.viewport.pointFromPixel(event.position);

  // viewport → image
  const imagePoint = viewer.world.getItemAt(0)
    .viewportToImageCoordinates(viewportPoint);

  console.log('Image pixel:', imagePoint.x, imagePoint.y);
});`,
          },
        ],
      },
    ],
  },

  'tilesource-image': {
    title: 'Image Tile Source',
    category: 'Tile Sources',
    lede: 'Display any plain image URL in OpenSeadragon. Useful for quick demos — for production with large images, build a tile pyramid instead.',
    sections: [
      {
        id: 'basic',
        heading: 'Basic configuration',
        blocks: [
          { type: 'p', html: 'Set <code>type</code> to <code>\'image\'</code> and provide a <code>url</code>. That\'s it.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  id: 'viewer',
  prefixUrl: '/openseadragon/images/',
  tileSources: {
    type: 'image',
    url: '/images/grand-canyon.jpg'
  }
});`,
          },
          {
            type: 'callout',
            title: 'Performance note',
            html: 'The Image Tile Source is convenient but has a performance cost on large images — the whole file is downloaded before display. For anything over ~2 MB, build a proper DZI or IIIF pyramid.',
          },
        ],
      },
      {
        id: 'pyramid',
        heading: 'Pyramid building',
        blocks: [
          { type: 'p', html: 'By default, OpenSeadragon builds an internal pyramid from the image to prevent aliasing during zoom-out. This can be disabled to speed up initial load:' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  tileSources: {
    type: 'image',
    url: '/images/photo.jpg',
    buildPyramid: false
  }
});`,
          },
        ],
      },
      {
        id: 'cors',
        heading: 'Cross-origin images',
        blocks: [
          { type: 'p', html: 'When loading from a different domain, configure CORS to allow pyramid building:' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  tileSources: {
    type: 'image',
    url: 'https://cdn.example.com/photo.jpg',
    crossOriginPolicy: 'Anonymous',
    ajaxWithCredentials: false
  }
});`,
          },
        ],
      },
    ],
  },

  'tilesource-dzi': {
    title: 'DZI Tile Source',
    category: 'Tile Sources',
    lede: 'Deep Zoom Image (DZI) is an XML specification maintained by Microsoft. It\'s the most common format used with OpenSeadragon and has the widest tool support.',
    sections: [
      {
        id: 'xml-ajax',
        heading: 'Loading a .dzi file',
        blocks: [
          { type: 'p', html: 'Point <code>tileSources</code> at a <code>.dzi</code> URL. OpenSeadragon automatically detects whether the response is XML or JSON.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  id: 'viewer',
  prefixUrl: '/openseadragon/images/',
  tileSources: '/tiles/painting.dzi'
});`,
          },
        ],
      },
      {
        id: 'dzi-format',
        heading: 'DZI file format',
        blocks: [
          { type: 'p', html: 'A <code>.dzi</code> file is a small XML descriptor. The tile files live in a sibling directory named <code>&lt;basename&gt;_files/</code>.' },
          {
            type: 'code',
            filename: 'painting.dzi',
            code: `<?xml version="1.0" encoding="UTF-8"?>
<Image xmlns="http://schemas.microsoft.com/deepzoom/2008"
       Format="jpg"
       Overlap="2"
       TileSize="256">
  <Size Height="9221" Width="7026"/>
</Image>`,
          },
          { type: 'p', html: 'An equivalent JSON representation is also accepted — OpenSeadragon detects the format automatically.' },
          {
            type: 'code',
            filename: 'painting.dzi.json',
            code: `{
  "Image": {
    "xmlns": "http://schemas.microsoft.com/deepzoom/2008",
    "Format": "jpg",
    "Overlap": "2",
    "TileSize": "256",
    "Size": {
      "Height": "9221",
      "Width": "7026"
    }
  }
}`,
          },
        ],
      },
      {
        id: 'jsonp',
        heading: 'JSONP',
        blocks: [
          { type: 'p', html: 'Files with a <code>.js</code> extension trigger JSONP format recognition. The callback name matches the filename (without extension).' },
          {
            type: 'code',
            filename: 'painting.js',
            code: `painting({
  "Image": {
    "xmlns": "http://schemas.microsoft.com/deepzoom/2008",
    "Format": "jpg",
    "Overlap": "2",
    "TileSize": "256",
    "Size": { "Height": "9221", "Width": "7026" }
  }
});`,
          },
        ],
      },
      {
        id: 'inline',
        heading: 'Inline configuration',
        blocks: [
          { type: 'p', html: 'Embed the DZI JSON directly in your JavaScript config to avoid an extra network request. You must include the <code>Url</code> property since it can\'t be inferred.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  tileSources: {
    Image: {
      xmlns:    'http://schemas.microsoft.com/deepzoom/2008',
      Url:      '/tiles/painting_files/',
      Format:   'jpg',
      Overlap:  '2',
      TileSize: '256',
      Size: { Height: '9221', Width: '7026' }
    }
  }
});`,
          },
        ],
      },
    ],
  },

  'tilesource-iiif': {
    title: 'IIIF Tile Source',
    category: 'Tile Sources',
    lede: 'The International Image Interoperability Framework (IIIF) Image API defines a standard way to serve and address image regions at any resolution. It\'s widely adopted in cultural heritage institutions.',
    sections: [
      {
        id: 'info-json',
        heading: 'Loading an info.json',
        blocks: [
          { type: 'p', html: 'Point <code>tileSources</code> at a IIIF <code>info.json</code> URL. OpenSeadragon recognizes the protocol from the JSON and handles tiling automatically.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  id: 'viewer',
  prefixUrl: '/openseadragon/images/',
  tileSources: 'https://images.example.org/iiif/painting/info.json'
});`,
          },
          {
            type: 'callout',
            title: 'CORS required',
            html: 'The image server must send <code>Access-Control-Allow-Origin: *</code> (or your domain) for cross-origin requests. Most IIIF servers do this by default.',
          },
        ],
      },
      {
        id: 'sequence',
        heading: 'Sequence of IIIF images',
        blocks: [
          { type: 'p', html: 'Pass an array of <code>info.json</code> URLs to display pages in sequence mode:' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  sequenceMode: true,
  preserveViewport: true,
  tileSources: [
    'https://server.org/iiif/page1/info.json',
    'https://server.org/iiif/page2/info.json',
    'https://server.org/iiif/page3/info.json'
  ]
});`,
          },
        ],
      },
      {
        id: 'inline-iiif',
        heading: 'Inline IIIF configuration',
        blocks: [
          { type: 'p', html: 'Embed the <code>info.json</code> content directly to avoid a network round-trip. Useful when you already have the metadata.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  tileSources: {
    '@context': 'http://iiif.io/api/image/2/context.json',
    '@id': 'https://server.org/iiif/painting',
    height: 7200,
    width: 5233,
    profile: ['http://iiif.io/api/image/2/level2.json'],
    protocol: 'http://iiif.io/api/image',
    tiles: [{ scaleFactors: [1, 2, 4, 8, 16, 32], width: 1024 }]
  }
});`,
          },
        ],
      },
    ],
  },

  'tilesource-osm': {
    title: 'OpenStreetMap Tile Source',
    category: 'Tile Sources',
    lede: 'Display OpenStreetMap tiles in OpenSeadragon. Useful for geographic visualizations or embedding a map alongside your images.',
    sections: [
      {
        id: 'basic',
        heading: 'Configuration',
        blocks: [
          { type: 'p', html: 'Set the tile source type to <code>\'openstreetmaps\'</code>. OSM tiles have extensive zoom levels so it\'s worth adjusting the scroll speed and disabling the navigator.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  id: 'viewer',
  prefixUrl: '/openseadragon/images/',
  showNavigator:     false,
  wrapHorizontal:    true,
  zoomPerScroll:     1.2,
  minZoomImageRatio: 0.5,
  tileSources: [{
    type: 'openstreetmaps'
  }]
});`,
          },
          { type: 'p', html: 'Implemented with contributions by Rainer Simon. See the <a href="https://wiki.openstreetmap.org/wiki/Zoom_levels" target="_blank" rel="noopener" style="color:var(--accent)">OSM zoom levels wiki</a> for details on the tile schema.' },
        ],
      },
    ],
  },

  'tilesource-zoomify': {
    title: 'Zoomify Tile Source',
    category: 'Tile Sources',
    lede: 'Zoomify is a legacy tiled image format that originated as a Flash viewer. OpenSeadragon fully supports Zoomify tiles, making it an easy migration target.',
    sections: [
      {
        id: 'config',
        heading: 'Configuration',
        blocks: [
          { type: 'p', html: 'Zoomify only supports inline configuration (the metadata format is non-standard XML). Provide the required fields: <code>type</code>, <code>width</code>, <code>height</code>, and <code>tilesUrl</code>.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  id: 'viewer',
  prefixUrl: '/openseadragon/images/',
  tileSources: [{
    type:     'zoomifytileservice',
    width:    7026,
    height:   9221,
    tilesUrl: '/tiles/painting/',
    // optional:
    tileSize:   256,
    fileFormat: 'jpg'
  }]
});`,
          },
          {
            type: 'callout',
            title: 'Credit',
            html: 'Zoomify support was contributed by <a href="https://github.com/foobarable" target="_blank" rel="noopener" style="color:var(--accent)">foobarable</a>.',
          },
        ],
      },
    ],
  },

  'tilesource-tms': {
    title: 'TMS Tile Source',
    category: 'Tile Sources',
    lede: 'Tile Map Service (TMS) is a standard for slippy-map tile pyramids. OpenSeadragon reads TMS tiles directly, making geographic tile sets easy to integrate.',
    sections: [
      {
        id: 'config',
        heading: 'Configuration',
        blocks: [
          { type: 'p', html: 'TMS tile sets can be loaded by specifying the root URL and image dimensions:' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  id: 'viewer',
  prefixUrl: '/openseadragon/images/',
  tileSources: {
    type:   'tms',
    width:  512 * 256,
    height: 512 * 256,
    tilesUrl: '/tiles/map/'
  }
});`,
          },
          { type: 'p', html: 'Generate TMS tiles from GeoTIFFs using <code>gdal2tiles.py</code> or <a href="https://www.maptiler.com/" target="_blank" rel="noopener" style="color:var(--accent)">MapTiler</a>.' },
        ],
      },
    ],
  },

  'tilesource-iip': {
    title: 'IIP Tile Source',
    category: 'Tile Sources',
    lede: 'The Internet Imaging Protocol (IIP) is a high-performance protocol for serving large image files, especially JPEG 2000. OpenSeadragon supports IIPImage servers natively.',
    sections: [
      {
        id: 'config',
        heading: 'Configuration',
        blocks: [
          { type: 'p', html: 'Provide the IIPImage server URL as your tile source. OpenSeadragon detects the protocol from the server\'s response.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  id: 'viewer',
  prefixUrl: '/openseadragon/images/',
  tileSources: 'https://iipserver.example.org/?FIF=painting.tif&obj=IIP,1.0&obj=Max-size&obj=Tile-size&obj=Resolution-number'
});`,
          },
          { type: 'p', html: 'See the <a href="https://iipimage.sourceforge.io/" target="_blank" rel="noopener" style="color:var(--accent)">IIPImage documentation</a> for server setup.' },
        ],
      },
    ],
  },

  'tilesource-legacy': {
    title: 'Legacy Tile Source',
    category: 'Tile Sources',
    lede: 'The Legacy Tile Source provides compatibility with older Deep Zoom tile sets that don\'t conform to the modern DZI spec.',
    sections: [
      {
        id: 'config',
        heading: 'Configuration',
        blocks: [
          { type: 'p', html: 'Set type to <code>\'legacy-image-pyramid\'</code> and provide an array of levels, each with a URL, width, and height.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  tileSources: {
    type: 'legacy-image-pyramid',
    levels: [
      { url: '/tiles/0/image.jpg', width: 200, height: 150 },
      { url: '/tiles/1/image.jpg', width: 400, height: 300 },
      { url: '/tiles/2/image.jpg', width: 800, height: 600 },
      { url: '/tiles/3/image.jpg', width: 1600, height: 1200 }
    ]
  }
});`,
          },
        ],
      },
    ],
  },

  'tilesource-custom': {
    title: 'Custom Tile Source',
    category: 'Tile Sources',
    lede: 'Roll your own tile source by providing a getTileUrl function. Great for any tiled dataset that doesn\'t follow a standard format — map APIs, procedural sources, CDN-backed pyramids.',
    sections: [
      {
        id: 'inline',
        heading: 'Inline configuration',
        blocks: [
          { type: 'p', html: 'The minimal interface requires a <code>getTileUrl</code> function plus the image\'s maximum-resolution <code>width</code> and <code>height</code>. Optional: <code>tileSize</code>, <code>tileOverlap</code>, <code>minLevel</code>, <code>maxLevel</code>.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  id: 'viewer',
  prefixUrl: '/openseadragon/images/',
  tileSources: {
    height: 512 * 256,
    width:  512 * 256,
    tileSize: 256,
    minLevel: 8,
    getTileUrl(level, x, y) {
      return \`https://s3.amazonaws.com/tiles/\${level - 8}-r\${y}-c\${x}.jpg\`;
    }
  }
});`,
          },
        ],
      },
      {
        id: 'class',
        heading: 'Full class implementation',
        blocks: [
          { type: 'p', html: 'For reusable sources, extend <code>OpenSeadragon.TileSource</code> and implement <code>supports()</code>, <code>configure()</code>, and <code>getTileUrl()</code>.' },
          {
            type: 'code',
            filename: 'my-tile-source.js',
            code: `class MyTileSource extends OpenSeadragon.TileSource {
  supports(data) {
    return typeof data === 'object' && data.type === 'my-source';
  }

  configure(data) {
    return data;
  }

  getTileUrl(level, x, y) {
    return \`https://cdn.example.com/tiles/\${level}/\${x}/\${y}.jpg\`;
  }
}

OpenSeadragon.extend(OpenSeadragon.TileSource.prototype, MyTileSource.prototype);`,
          },
        ],
      },
    ],
  },

  'tilesource-custom-advanced': {
    title: 'Custom Tile Source (Advanced)',
    category: 'Tile Sources',
    lede: 'Beyond getTileUrl — custom data types, async tile loading, and full control over the render pipeline.',
    sections: [
      {
        id: 'overview',
        heading: 'What you can override',
        blocks: [
          { type: 'p', html: '<code>getTileUrl</code> doesn\'t have to return a URL at all. By overriding methods like <code>downloadTileStart</code>, you gain full control over how tile data is fetched and decoded.' },
          { type: 'p', html: 'This is the foundation for custom data types, WebGL textures sourced from non-image data, or tiles fetched from WebSockets.' },
          {
            type: 'callout',
            title: 'See also',
            html: 'Read the <a href="#/docs/data-modifications" style="color:var(--accent)">Data Modifications</a> and <a href="#/docs/data-types" style="color:var(--accent)">Data Types</a> guides for the full pipeline.',
          },
        ],
      },
    ],
  },

  'ui-zoom-and-pan': {
    title: 'Zoom & Pan',
    category: 'UI & Controls',
    lede: 'Control the range of zooming and panning — lock axes, set limits, constrain the viewport so the image never disappears from view.',
    sections: [
      {
        id: 'options',
        heading: 'Key options',
        blocks: [
          {
            type: 'ul',
            items: [
              '<code>panHorizontal</code> (default: <code>true</code>) — allow horizontal panning.',
              '<code>panVertical</code> (default: <code>true</code>) — allow vertical panning.',
              '<code>constrainDuringPan</code> (default: <code>false</code>) — enforce bounds while dragging.',
              '<code>wrapHorizontal</code> (default: <code>false</code>) — loop the image horizontally (good for maps).',
              '<code>visibilityRatio</code> (default: <code>0.5</code>) — fraction of viewport that must always show image.',
              '<code>minZoomImageRatio</code> (default: <code>0.8</code>) — how small the image can get relative to the viewport.',
              '<code>maxZoomPixelRatio</code> (default: <code>2</code>) — max zoom as a ratio of image pixels to screen pixels.',
              '<code>defaultZoomLevel</code> (default: <code>0</code>) — initial zoom (0 = fit-to-viewport).',
              '<code>minZoomLevel</code> / <code>maxZoomLevel</code> — hard zoom limits.',
            ],
          },
        ],
      },
      {
        id: 'constrained',
        heading: 'Constrained viewport',
        blocks: [
          { type: 'p', html: 'Set <code>visibilityRatio: 1</code> so the image can never be panned off screen. Combine with <code>constrainDuringPan</code> for a rigid clamp.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  visibilityRatio:    1.0,
  constrainDuringPan: true
});`,
          },
        ],
      },
      {
        id: 'fit-width',
        heading: 'Fit-width (PDF-style)',
        blocks: [
          { type: 'p', html: 'Disable horizontal pan and pin the zoom to create a "fit-width" reading experience.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  panHorizontal:  false,
  defaultZoomLevel: 1,
  minZoomLevel:   1,
  maxZoomLevel:   1,
  visibilityRatio: 1
});`,
          },
        ],
      },
    ],
  },

  'ui-overlays': {
    title: 'Overlays',
    category: 'UI & Controls',
    lede: 'Overlays anchor DOM elements in image space — they track pan, zoom, and rotation. Use them for annotations, highlights, interactive hotspots, or filter effects.',
    sections: [
      {
        id: 'highlighted',
        heading: 'Highlighted regions',
        blocks: [
          { type: 'p', html: 'Declare overlay positions in normalized image coordinates (x/y = 0–1 relative to image width/height). Style via CSS.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  tileSources: [{
    // ...
    overlays: [{
      id: 'highlight',
      x: 0.33,
      y: 0.75,
      width: 0.2,
      height: 0.25,
      className: 'highlight'
    }]
  }]
});`,
          },
          {
            type: 'code',
            filename: 'style.css',
            code: `.highlight {
  background: rgba(100, 200, 255, 0.25);
  border: 2px solid rgba(100, 200, 255, 0.8);
  border-radius: 4px;
}`,
          },
        ],
      },
      {
        id: 'fixed-size',
        heading: 'Fixed-size overlays',
        blocks: [
          { type: 'p', html: 'Omit <code>width</code> and <code>height</code> to keep an overlay at a constant screen size regardless of zoom. Use <code>placement</code> to control which part of the element anchors to the coordinates.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  overlays: [{
    id: 'pin',
    x: 0.2008,
    y: 0.4778,
    placement: 'RIGHT',
    checkResize: false
  }]
});`,
          },
        ],
      },
      {
        id: 'viewport-overlay',
        heading: 'Viewport overlays',
        blocks: [
          { type: 'p', html: 'Overlays configured outside <code>tileSources</code> persist across image sequences. Use <code>px</code>/<code>py</code> (pixel coords) instead of <code>x</code>/<code>y</code> (normalized).' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  overlays: [{
    id: 'global-filter',
    px: 0,
    py: 0,
    width:  6425,
    height: 8535,
    className: 'filter'
  }]
});`,
          },
        ],
      },
      {
        id: 'runtime',
        heading: 'Runtime overlays',
        blocks: [
          { type: 'p', html: 'Add overlays dynamically after the viewer is open using <code>viewer.addOverlay</code>. Remove them with <code>viewer.removeOverlay</code>.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `const el = document.createElement('div');
el.className = 'annotation';

viewer.addOverlay({
  element:  el,
  location: new OpenSeadragon.Rect(0.33, 0.75, 0.2, 0.25)
});

// Later:
viewer.removeOverlay(el);`,
          },
        ],
      },
      {
        id: 'rotation',
        heading: 'Overlay rotation modes',
        blocks: [
          {
            type: 'ul',
            items: [
              '<code>EXACT</code> — overlay rotates with the viewport (default).',
              '<code>NO_ROTATION</code> — overlay ignores viewport rotation.',
              '<code>BOUNDING_BOX</code> — overlay size adapts to contain the rotated rectangle.',
            ],
          },
        ],
      },
      {
        id: 'events',
        heading: 'Events on overlays',
        blocks: [
          {
            type: 'callout',
            title: 'Important',
            html: 'Standard JavaScript event listeners do not work on overlay elements inside the viewer canvas. Use <code>OpenSeadragon.MouseTracker</code> instead.',
          },
          {
            type: 'code',
            filename: 'main.js',
            code: `new OpenSeadragon.MouseTracker({
  element: document.getElementById('my-overlay'),
  clickHandler(event) {
    console.log('overlay clicked', event.position);
  }
});`,
          },
        ],
      },
    ],
  },

  'ui-viewport-navigator': {
    title: 'Viewport Navigator',
    category: 'UI & Controls',
    lede: 'The navigator shows a thumbnail of the full image with a box indicating the current viewport position — like a minimap.',
    sections: [
      {
        id: 'basic',
        heading: 'Enable the navigator',
        blocks: [
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  showNavigator: true
});`,
          },
          { type: 'p', html: 'By default it appears in the top-right corner and auto-fades after the user stops interacting.' },
        ],
      },
      {
        id: 'position',
        heading: 'Corner position',
        blocks: [
          { type: 'p', html: 'Use <code>navigatorPosition</code> to move it to any corner.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  showNavigator:     true,
  navigatorPosition: 'BOTTOM_LEFT'  // TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT
});`,
          },
        ],
      },
      {
        id: 'absolute',
        heading: 'Absolute position & size',
        blocks: [
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  showNavigator:   true,
  navigatorPosition: 'ABSOLUTE',
  navigatorTop:    '40px',
  navigatorLeft:   '4px',
  navigatorHeight: '120px',
  navigatorWidth:  '145px'
});`,
          },
        ],
      },
      {
        id: 'custom-location',
        heading: 'Custom DOM element',
        blocks: [
          { type: 'p', html: 'Move the navigator outside the viewer entirely by pointing it at any element on your page.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  showNavigator: true,
  navigatorId:   'my-minimap-div'
});`,
          },
        ],
      },
      {
        id: 'autofade',
        heading: 'Auto-fade toggle',
        blocks: [
          { type: 'p', html: 'Disable auto-fade for a permanently visible navigator, or toggle it manually.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `const viewer = OpenSeadragon({
  showNavigator:      true,
  navigatorAutoFade:  false
});

// Toggle visibility programmatically
function toggleNav(show) {
  viewer.navigator.element.style.display = show ? 'inline-block' : 'none';
}`,
          },
        ],
      },
    ],
  },

  'ui-rotation': {
    title: 'Rotation',
    category: 'UI & Controls',
    lede: 'The viewer can be rotated via UI controls or programmatically through the Viewport API. Touch pinch rotation is also supported.',
    sections: [
      {
        id: 'buttons',
        heading: 'Rotation buttons',
        blocks: [
          { type: 'p', html: 'Enable the built-in rotate buttons and optional touch pinch rotation.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  degrees: 90,              // initial rotation angle
  showRotationControl: true,
  gestureSettingsTouch: {
    pinchRotate: true
  }
});`,
          },
        ],
      },
      {
        id: 'programmatic',
        heading: 'Programmatic rotation',
        blocks: [
          { type: 'p', html: 'Use <code>viewport.setRotation(degrees)</code> for precise control.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `const viewer = OpenSeadragon({ /* ... */ });

// Rotate to 45°
viewer.viewport.setRotation(45);

// Animate to a rotation
viewer.viewport.setRotation(90, true); // second arg = animate`,
          },
        ],
      },
    ],
  },

  'ui-toolbar': {
    title: 'Toolbar',
    category: 'UI & Controls',
    lede: 'Move the viewer controls out of the viewport overlay and into a traditional toolbar element elsewhere on the page.',
    sections: [
      {
        id: 'config',
        heading: 'Configuration',
        blocks: [
          { type: 'p', html: 'Pass the ID of a container element to <code>toolbar</code>. OpenSeadragon will render its buttons there instead of overlaying them on the canvas.' },
          {
            type: 'code',
            filename: 'index.html',
            code: `<div id="toolbar"><!-- buttons rendered here --></div>
<div id="viewer" style="width:100%;height:600px"></div>`,
          },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  id:      'viewer',
  toolbar: 'toolbar'
});`,
          },
          { type: 'p', html: 'This approach lets you style the toolbar independently for normal and fullscreen modes by targeting the element\'s context with CSS.' },
        ],
      },
    ],
  },

  'ui-binding-custom-buttons': {
    title: 'Custom Buttons',
    category: 'UI & Controls',
    lede: 'Wire any DOM elements as viewer controls — zoom, home, fullscreen, and sequence navigation — without using the built-in button styles.',
    sections: [
      {
        id: 'config',
        heading: 'Binding by element ID',
        blocks: [
          { type: 'p', html: 'Pass element IDs to the corresponding option. OpenSeadragon attaches the right behavior automatically.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  zoomInButton:   'btn-zoom-in',
  zoomOutButton:  'btn-zoom-out',
  homeButton:     'btn-home',
  fullPageButton: 'btn-fullscreen',
  nextButton:     'btn-next',
  previousButton: 'btn-prev'
});`,
          },
          {
            type: 'callout',
            title: 'Multiple viewers',
            html: 'If you have multiple viewer instances, pass DOM <i>elements</i> (not ID strings) to prevent one set of buttons from controlling all viewers.',
          },
        ],
      },
      {
        id: 'page-events',
        heading: 'Reacting to page changes',
        blocks: [
          { type: 'p', html: 'Listen to the <code>page</code> event to keep UI in sync with the current sequence index.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `viewer.addHandler('page', function(data) {
  document.getElementById('page-label').textContent =
    (data.page + 1) + ' of ' + viewer.tileSources.length;
});`,
          },
        ],
      },
    ],
  },

  'ui-keyboard-navigation': {
    title: 'Keyboard Navigation',
    category: 'UI & Controls',
    lede: 'OpenSeadragon ships with built-in keyboard controls. You can extend or override them for custom shortcuts.',
    sections: [
      {
        id: 'defaults',
        heading: 'Default keyboard shortcuts',
        blocks: [
          {
            type: 'ul',
            items: [
              '<code>+</code> / <code>=</code> — zoom in',
              '<code>-</code> — zoom out',
              '<code>0</code> — home (fit image to viewport)',
              '<code>W</code> / <code>↑</code> — pan up',
              '<code>S</code> / <code>↓</code> — pan down',
              '<code>A</code> / <code>←</code> — pan left',
              '<code>D</code> / <code>→</code> — pan right',
            ],
          },
        ],
      },
      {
        id: 'custom',
        heading: 'Custom key bindings',
        blocks: [
          { type: 'p', html: 'Override <code>keyHandler</code> on the viewer\'s <code>innerTracker</code> to add custom shortcuts.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `viewer.innerTracker.keyHandler = function(event) {
  if (event.keyCode === 82) { // 'r' key
    viewer.viewport.setRotation(
      viewer.viewport.getRotation() + 90
    );
  }
};`,
          },
        ],
      },
    ],
  },

  'ui-customize-tooltips': {
    title: 'Customize Tooltips',
    category: 'UI & Controls',
    lede: 'Override the default tooltip strings on built-in buttons for localization or custom UX copy.',
    sections: [
      {
        id: 'nav-images',
        heading: 'NavImages configuration',
        blocks: [
          { type: 'p', html: 'The <code>navImages</code> option lets you swap the button icons. Each entry has a <code>REST</code>, <code>GROUP</code>, <code>HOVER</code>, and <code>DOWN</code> state.' },
          { type: 'p', html: 'To change tooltip text, set the <code>title</code> attribute on the generated button elements after init, or override them via CSS pseudo-elements.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `const viewer = OpenSeadragon({ /* ... */ });

// Override tooltip text after initialization
viewer.buttons.buttons.forEach(function(button) {
  if (button.tooltip === 'Zoom in') {
    button.element.title = 'Agrandir';
  }
});`,
          },
        ],
      },
    ],
  },

  'ui-tiledimage-polygon-cropping': {
    title: 'Polygon Cropping',
    category: 'UI & Controls',
    lede: 'Crop a tiled image to an arbitrary polygon shape using the TiledImage crop API.',
    sections: [
      {
        id: 'basic',
        heading: 'Setting a crop polygon',
        blocks: [
          { type: 'p', html: 'After the image is added to the world, call <code>tiledImage.setCroppingPolygons()</code> with an array of <code>OpenSeadragon.Point</code> objects in image coordinates.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `viewer.addHandler('open', function() {
  const tiledImage = viewer.world.getItemAt(0);

  tiledImage.setCroppingPolygons([
    new OpenSeadragon.Point(0.1, 0.1),
    new OpenSeadragon.Point(0.9, 0.1),
    new OpenSeadragon.Point(0.9, 0.9),
    new OpenSeadragon.Point(0.1, 0.9)
  ]);
});`,
          },
          { type: 'p', html: 'Call <code>tiledImage.resetCroppingPolygons()</code> to remove the crop.' },
        ],
      },
    ],
  },

  'tilesource-sequence': {
    title: 'Sequence Mode',
    category: 'Multi-Image',
    lede: 'Display an ordered set of images with previous/next navigation — ideal for document pages, image stacks, or any multi-frame dataset.',
    sections: [
      {
        id: 'basic',
        heading: 'Basic sequence',
        blocks: [
          { type: 'p', html: 'Pass an array to <code>tileSources</code> and set <code>sequenceMode: true</code>. Navigation buttons appear automatically.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  sequenceMode: true,
  tileSources: [
    '/tiles/page1.dzi',
    '/tiles/page2.dzi',
    '/tiles/page3.dzi'
  ]
});`,
          },
        ],
      },
      {
        id: 'preset-zoom',
        heading: 'Preset zoom per page',
        blocks: [
          { type: 'p', html: 'Set <code>defaultZoomLevel</code> to start each new page at a consistent zoom.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  sequenceMode:     true,
  defaultZoomLevel: 1.05,
  tileSources: [ /* ... */ ]
});`,
          },
        ],
      },
      {
        id: 'preserve',
        heading: 'Preserve viewport position',
        blocks: [
          { type: 'p', html: '<code>preserveViewport</code> remembers the zoom and pan when turning pages — useful for synchronized reading across images at the same scale.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  sequenceMode:     true,
  preserveViewport: true,
  tileSources: [ /* ... */ ]
});`,
          },
        ],
      },
      {
        id: 'mixed',
        heading: 'Mixed tile sources',
        blocks: [
          { type: 'p', html: 'Each entry in the array can be a different tile source type — DZI, IIIF, image, custom. Mix freely.' },
        ],
      },
    ],
  },

  'ui-reference-strip': {
    title: 'Reference Strip',
    category: 'Multi-Image',
    lede: 'A filmstrip-style thumbnail row for navigating sequences. Complements sequence mode with visual page previews.',
    sections: [
      {
        id: 'config',
        heading: 'Configuration',
        blocks: [
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  sequenceMode:         true,
  showReferenceStrip:   true,
  referenceStripScroll: 'horizontal',
  tileSources: [ /* ... */ ]
});`,
          },
          { type: 'p', html: 'Use <code>referenceStripScroll: \'vertical\'</code> for a sidebar layout.' },
        ],
      },
    ],
  },

  'tilesource-collection': {
    title: 'Collection Mode',
    category: 'Multi-Image',
    lede: 'Display multiple images in a grid layout simultaneously — each image is independently zoomable in a shared viewport.',
    sections: [
      {
        id: 'config',
        heading: 'Configuration',
        blocks: [
          { type: 'p', html: 'Set <code>collectionMode: true</code> and optionally configure the grid with <code>collectionRows</code> and <code>collectionTileSize</code>.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  collectionMode:     true,
  collectionRows:     2,
  collectionTileSize: 10,
  collectionTileMargin: 0.8,
  tileSources: [
    '/tiles/image1.dzi',
    '/tiles/image2.dzi',
    '/tiles/image3.dzi',
    '/tiles/image4.dzi'
  ]
});`,
          },
        ],
      },
    ],
  },

  'multi-image': {
    title: 'Multi-Image Worlds',
    category: 'Multi-Image',
    lede: 'Load any number of images into one viewer and arrange them freely in viewport space. Combine images of different resolutions, formats, or scales.',
    sections: [
      {
        id: 'adding',
        heading: 'Adding images',
        blocks: [
          { type: 'p', html: 'Use <code>viewer.addTiledImage()</code> to append images to the world after the viewer is open.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `const viewer = OpenSeadragon({ id: 'viewer', prefixUrl: '/osd/images/' });

viewer.addTiledImage({ tileSource: 'image1.dzi', x: 0, y: 0, width: 1 });
viewer.addTiledImage({ tileSource: 'image2.dzi', x: 1.1, y: 0, width: 1 });
viewer.addTiledImage({ tileSource: 'image3.dzi', x: 2.2, y: 0, width: 1 });`,
          },
          { type: 'p', html: 'Specify either <code>width</code> or <code>height</code> — the other dimension is calculated from the image\'s aspect ratio.' },
        ],
      },
      {
        id: 'world-api',
        heading: 'The World object',
        blocks: [
          { type: 'p', html: '<code>viewer.world</code> gives you access to all loaded images.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `// Iterate all images
const count = viewer.world.getItemCount();
for (let i = 0; i < count; i++) {
  const img = viewer.world.getItemAt(i);
  img.setPosition(new OpenSeadragon.Point(i * 1.1, 0));
}

// Auto-arrange in a grid
viewer.world.arrange({
  rows: 2,
  layout: 'horizontal',
  tileSize: 1,
  tileMargin: 0.1
});`,
          },
        ],
      },
    ],
  },

  'data-modifications': {
    title: 'Data Modifications',
    category: 'Data',
    lede: 'The tile invalidation pipeline lets plugins modify tile data asynchronously — apply filters, run edge detection, composite layers — without touching OpenSeadragon internals.',
    sections: [
      {
        id: 'basics',
        heading: 'How it works',
        blocks: [
          { type: 'p', html: 'Call <code>viewer.requestInvalidate()</code> to trigger a re-render cycle. Handle the <code>tile-invalidated</code> event to modify tile data before it\'s displayed.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `viewer.addHandler('tile-invalidated', async (e) => {
  const ctx = await e.getData('context2d');
  const { width, height } = ctx.canvas;

  // apply any canvas 2D operation
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(255, 100, 0, 0.3)';
  ctx.fillRect(0, 0, width, height);

  await e.setData(ctx, 'context2d');
});

viewer.requestInvalidate();`,
          },
        ],
      },
      {
        id: 'outdated',
        heading: 'Checking for stale events',
        blocks: [
          { type: 'p', html: 'When multiple invalidation requests fire in quick succession, use <code>e.outdated()</code> to bail out of expensive work.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `viewer.addHandler('tile-invalidated', async (e) => {
  const ctx = await e.getData('context2d');

  // expensive computation...
  await runEdgeDetection(ctx);

  if (e.outdated()) return; // newer request superseded this one

  await e.setData(ctx, 'context2d');
});`,
          },
        ],
      },
      {
        id: 'incremental',
        heading: 'Incremental vs. full reset',
        blocks: [
          { type: 'p', html: '<code>requestInvalidate(true)</code> (default) resets tile data to the original before applying handlers. <code>requestInvalidate(false)</code> stacks modifications on the previous result.' },
          { type: 'p', html: 'Alternatively, call <code>e.resetData()</code> inside the handler to start fresh from original tile data.' },
        ],
      },
      {
        id: 'priorities',
        heading: 'Handler ordering',
        blocks: [
          { type: 'p', html: 'Pass a priority number as the fourth argument to <code>addHandler</code> to control the order multiple plugins run.' },
          {
            type: 'code',
            filename: 'my-plugin.js',
            code: `viewer.addHandler('tile-invalidated', myHandler, null, 10); // runs first
viewer.addHandler('tile-invalidated', otherHandler, null, 5); // runs second`,
          },
        ],
      },
    ],
  },

  'data-types': {
    title: 'Data Types',
    category: 'Data',
    lede: 'OpenSeadragon\'s data pipeline is type-agnostic. Learn how the conversion system works and how to register custom types for your tile data.',
    sections: [
      {
        id: 'built-in',
        heading: 'Built-in types',
        blocks: [
          {
            type: 'ul',
            items: [
              '<code>\'image\'</code> — an <code>HTMLImageElement</code>.',
              '<code>\'canvas\'</code> — an <code>HTMLCanvasElement</code>.',
              '<code>\'context2d\'</code> — a <code>CanvasRenderingContext2D</code>.',
              '<code>\'imageData\'</code> — an <code>ImageData</code> object (raw pixel buffer).',
            ],
          },
        ],
      },
      {
        id: 'converters',
        heading: 'Automatic conversion',
        blocks: [
          { type: 'p', html: 'When you call <code>e.getData(\'context2d\')</code> but the tile is stored as <code>\'image\'</code>, OpenSeadragon automatically converts through the registered conversion graph. You don\'t need to handle intermediate steps.' },
        ],
      },
      {
        id: 'custom-type',
        heading: 'Registering a custom type',
        blocks: [
          { type: 'p', html: 'Add a converter from an existing type to your custom type using <code>$.converter.learn()</code>.' },
          {
            type: 'code',
            filename: 'my-type.js',
            code: `OpenSeadragon.converter.learn(
  'context2d',       // from type
  'my-float32',      // to type
  async (ctx) => {
    const { data, width, height } = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const float32 = new Float32Array(data.buffer);
    return { float32, width, height };
  },
  1,  // cost (lower = preferred path)
  async (obj) => { /* destructor: free GPU resources, etc. */ }
);`,
          },
        ],
      },
    ],
  },

  'drawer-design': {
    title: 'Drawer Design',
    category: 'Data',
    lede: 'Drawers are the rendering backend — Canvas, HTML, and WebGL are built in. You can implement a custom drawer for any rendering target.',
    sections: [
      {
        id: 'built-in',
        heading: 'Choosing a drawer',
        blocks: [
          { type: 'p', html: 'Set the <code>drawer</code> option at init time.' },
          {
            type: 'ul',
            items: [
              '<code>\'canvas\'</code> — 2D Canvas API. Stable, broadly compatible. Default prior to v5.',
              '<code>\'webgl\'</code> — WebGL 1.0. Best performance, GPU-accelerated filters. Default in v5+.',
              '<code>\'html\'</code> — DOM elements. Useful for accessibility or CSS-based rendering.',
            ],
          },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  drawer: 'canvas'  // force canvas if WebGL causes issues
});`,
          },
        ],
      },
      {
        id: 'custom',
        heading: 'Custom drawer skeleton',
        blocks: [
          { type: 'p', html: 'Extend <code>OpenSeadragon.DrawerBase</code> and register it.' },
          {
            type: 'code',
            filename: 'my-drawer.js',
            code: `class MyDrawer extends OpenSeadragon.DrawerBase {
  getType() { return 'my-drawer'; }

  getSupportedDataFormats() {
    return ['context2d'];
  }

  drawTile(tile, matrix, context, sourceBounds) {
    // custom render logic
  }

  clear() {
    // clear the display
  }

  destroy() {
    // cleanup
  }
}

OpenSeadragon.registerDrawer('my-drawer', MyDrawer);`,
          },
        ],
      },
    ],
  },

  'developer-debug-mode': {
    title: 'Debug Mode',
    category: 'Developer Tools',
    lede: 'Enable debug mode to visualize tile boundaries, loading state, and coordinate systems. Indispensable when building custom tile sources or drawers.',
    sections: [
      {
        id: 'enable',
        heading: 'Enabling debug mode',
        blocks: [
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  debugMode: true
});`,
          },
          { type: 'p', html: 'With debug mode on, each tile gets a colored border showing its load state, and tile coordinates are printed inside each tile.' },
        ],
      },
      {
        id: 'grid',
        heading: 'Debug grid levels',
        blocks: [
          { type: 'p', html: 'Set <code>debugGridColor</code> to control the tile outline color at each zoom level. Accepts an array of CSS color strings.' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  debugMode: true,
  debugGridColor: ['red', 'blue', 'green', 'orange']
});`,
          },
        ],
      },
    ],
  },

  'migration-v6': {
    title: 'Migrating from v5 to v6',
    category: 'Migration',
    lede: 'v6 overhauled how tile data is handled. Most viewer configs are unaffected, but plugins that modify tiles need updating.',
    sections: [
      {
        id: 'breaking',
        heading: 'Breaking changes',
        blocks: [
          {
            type: 'ul',
            items: [
              'Tile data properties <code>image</code>, <code>getImage</code>, <code>getCanvasContext</code>, <code>context2D</code>, and <code>cacheImageRecord</code> are removed.',
              'Drawer-specific tile properties (<code>element</code>, <code>style</code>, <code>context2D</code>) are removed.',
              'The <code>tile-drawing</code> event is removed — use <code>tile-invalidated</code> instead.',
              '<code>TileSource.createTileCache</code> is removed — the core now manages data lifecycle.',
              'Custom <code>downloadTileStart</code> overrides must specify the submitted data type.',
            ],
          },
        ],
      },
      {
        id: 'new-pattern',
        heading: 'New data modification pattern',
        blocks: [
          { type: 'p', html: 'Replace <code>tile-drawing</code> handler with an async <code>tile-invalidated</code> handler:' },
          {
            type: 'code',
            filename: 'main.js',
            code: `// v5 (removed):
// viewer.addHandler('tile-drawing', (e) => {
//   e.context.fillRect(...);
// });

// v6:
viewer.addHandler('tile-invalidated', async (e) => {
  const ctx = await e.getData('context2d');
  ctx.fillStyle = 'rgba(255,0,0,0.2)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  await e.setData(ctx, 'context2d');
});

viewer.requestInvalidate();`,
          },
        ],
      },
      {
        id: 'plugins',
        heading: 'Plugin compatibility',
        blocks: [
          {
            type: 'callout',
            title: 'Plugin authors',
            html: 'Plugins that access tile internals must be updated. Add an explicit <code>destroy()</code> method — the new lifecycle requires it to prevent listener leaks on hot reload.',
          },
        ],
      },
    ],
  },

  'migration-v5': {
    title: 'Migrating from v4 to v5',
    category: 'Migration',
    lede: 'v5 introduced the WebGL drawer as the default. Most code runs unchanged, but tile-drawing plugins and cross-origin image handling need attention.',
    sections: [
      {
        id: 'webgl-default',
        heading: 'WebGL is now the default',
        blocks: [
          { type: 'p', html: 'v5 switched from the 2D Canvas drawer to WebGL by default. This improves performance but has a few implications:' },
          {
            type: 'ul',
            items: [
              'Older devices may have WebGL compatibility issues.',
              'Images must be same-domain or have CORS headers; GPU access requires it.',
              'Tile data lives on the GPU — it\'s not directly readable from JavaScript.',
              'Plugins using <code>tile-drawing</code> (Canvas 2D callbacks) will not fire.',
            ],
          },
        ],
      },
      {
        id: 'fallback',
        heading: 'Falling back to Canvas',
        blocks: [
          { type: 'p', html: 'If you need the v4 behavior, opt out of WebGL explicitly:' },
          {
            type: 'code',
            filename: 'main.js',
            code: `OpenSeadragon({
  drawer: 'canvas'
});`,
          },
          {
            type: 'callout',
            title: 'Report issues',
            html: 'If you encounter device-specific WebGL problems, <a href="https://github.com/openseadragon/openseadragon/issues" target="_blank" rel="noopener" style="color:var(--accent)">file an issue</a> on GitHub.',
          },
        ],
      },
    ],
  },

  'framework-web': {
    title: 'OpenSeadragon in Web Frameworks',
    category: 'Frameworks',
    lede: 'OpenSeadragon is a plain-JS library with no framework dependencies. Wrapping it in React, Vue, Svelte, Solid, or Lit follows the same pattern: mount the viewer after the DOM element renders, and destroy it on unmount.',
    sections: [
      {
        id: 'pattern',
        heading: 'The universal pattern',
        blocks: [
          { type: 'p', html: 'Every framework wrapper has three responsibilities: (1) render a container <code>&lt;div&gt;</code>, (2) call <code>OpenSeadragon()</code> after the element exists in the DOM, (3) call <code>viewer.destroy()</code> when the component is removed. Everything else is framework sugar.' },
          {
            type: 'callout',
            title: 'Never pass a virtual element',
            html: 'OpenSeadragon needs a real DOM node. Always wait for the framework\'s equivalent of <code>mounted</code> / <code>useEffect</code> before creating the viewer, or pass the element reference directly via <code>element:</code> instead of <code>id:</code>.',
          },
        ],
      },
      {
        id: 'react',
        heading: 'React',
        blocks: [
          { type: 'p', html: 'Use <code>useEffect</code> with an empty dependency array to create the viewer once, and return a cleanup function to destroy it.' },
          {
            type: 'code',
            filename: 'OSDViewer.jsx',
            code: `import { useEffect, useRef } from 'react'
import OpenSeadragon from 'openseadragon'

export default function OSDViewer({ tileSources, options = {} }) {
  const containerRef = useRef(null)

  useEffect(() => {
    const viewer = OpenSeadragon({
      element: containerRef.current,
      prefixUrl: '/openseadragon/images/',
      tileSources,
      ...options,
    })
    return () => viewer.destroy()
  }, [])

  return <div ref={containerRef} style={{ width: '100%', height: '600px' }} />
}`,
          },
        ],
      },
      {
        id: 'vue',
        heading: 'Vue 3',
        blocks: [
          { type: 'p', html: 'Use <code>onMounted</code> and <code>onUnmounted</code> from the Composition API. Pass the template ref directly as <code>element</code> so no ID lookup is needed.' },
          {
            type: 'code',
            filename: 'OSDViewer.vue',
            code: `<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import OpenSeadragon from 'openseadragon'

const props = defineProps(['tileSources', 'options'])
const container = ref(null)
let viewer = null

onMounted(() => {
  viewer = OpenSeadragon({
    element: container.value,
    prefixUrl: '/openseadragon/images/',
    tileSources: props.tileSources,
    ...props.options,
  })
})

onUnmounted(() => viewer?.destroy())
</script>

<template>
  <div ref="container" style="width:100%;height:600px" />
</template>`,
          },
        ],
      },
      {
        id: 'svelte',
        heading: 'Svelte 5',
        blocks: [
          { type: 'p', html: 'Svelte 5 uses runes. Bind the DOM element with <code>bind:this</code>, then create the viewer inside <code>$effect</code>. Return the destroy call from the effect for automatic cleanup.' },
          {
            type: 'code',
            filename: 'OSDViewer.svelte',
            code: `<script>
  import { $effect } from 'svelte'
  import OpenSeadragon from 'openseadragon'

  let { tileSources, options = {} } = $props()
  let container = $state(null)

  $effect(() => {
    if (!container) return
    const viewer = OpenSeadragon({
      element: container,
      prefixUrl: '/openseadragon/images/',
      tileSources,
      ...options,
    })
    return () => viewer.destroy()
  })
</script>

<div bind:this={container} style="width:100%;height:600px" />`,
          },
        ],
      },
      {
        id: 'solid',
        heading: 'Solid',
        blocks: [
          { type: 'p', html: 'Solid\'s <code>onMount</code> fires once after the DOM is ready. Use <code>onCleanup</code> to register the destroy call.' },
          {
            type: 'code',
            filename: 'OSDViewer.jsx',
            code: `import { onMount, onCleanup } from 'solid-js'
import OpenSeadragon from 'openseadragon'

export default function OSDViewer(props) {
  let container

  onMount(() => {
    const viewer = OpenSeadragon({
      element: container,
      prefixUrl: '/openseadragon/images/',
      tileSources: props.tileSources,
      ...props.options,
    })
    onCleanup(() => viewer.destroy())
  })

  return <div ref={container} style="width:100%;height:600px" />
}`,
          },
        ],
      },
      {
        id: 'lit',
        heading: 'Lit custom element',
        blocks: [
          { type: 'p', html: 'Extend <code>LitElement</code> and create the viewer in <code>firstUpdated</code> — Lit\'s lifecycle hook that fires after the first render. Destroy in <code>disconnectedCallback</code>.' },
          {
            type: 'code',
            filename: 'osd-viewer.js',
            code: `import { LitElement, html, css } from 'lit'
import OpenSeadragon from 'openseadragon'

class OSDViewer extends LitElement {
  static properties = {
    tileSources: { type: Object },
  }

  static styles = css\`
    :host { display: block; width: 100%; height: 600px; }
    #viewer { width: 100%; height: 100%; }
  \`

  firstUpdated() {
    this._viewer = OpenSeadragon({
      element: this.renderRoot.querySelector('#viewer'),
      prefixUrl: '/openseadragon/images/',
      tileSources: this.tileSources,
    })
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._viewer?.destroy()
  }

  render() {
    return html\`<div id="viewer"></div>\`
  }
}

customElements.define('osd-viewer', OSDViewer)`,
          },
        ],
      },
    ],
  },

  'framework-desktop': {
    title: 'OpenSeadragon in Desktop Apps',
    category: 'Frameworks',
    lede: 'Electron and Tauri both embed a web renderer, so OpenSeadragon works as-is. The main considerations are asset serving, CORS policy, and renderer security settings.',
    sections: [
      {
        id: 'electron',
        heading: 'Electron',
        blocks: [
          { type: 'p', html: 'Electron\'s renderer process is a Chromium window that loads local HTML. Serve OpenSeadragon and tile sources from the app bundle or a local HTTP server started by the main process.' },
          {
            type: 'callout',
            title: 'webSecurity and CORS',
            html: 'By default Electron enforces CORS in the renderer. If your tile sources are remote URLs, either configure your server to send the right CORS headers, or disable <code>webSecurity</code> in the <code>BrowserWindow</code> options for development only — never in production.',
          },
          {
            type: 'code',
            filename: 'main.js',
            code: `const { app, BrowserWindow } = require('electron')
const path = require('path')

app.whenReady().then(() => {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      // Enable if loading tiles from a local file:// URL without a dev server
      // webSecurity: false,
      contextIsolation: true,
    },
  })
  win.loadFile(path.join(__dirname, 'renderer/index.html'))
})`,
          },
          {
            type: 'p', html: 'Inside the renderer, use OpenSeadragon exactly as in a browser. If you serve tiles from the local filesystem, use a small Express server in the main process and point <code>tileSources</code> at <code>http://localhost:PORT/...</code>.',
          },
        ],
      },
      {
        id: 'tauri',
        heading: 'Tauri',
        blocks: [
          { type: 'p', html: 'Tauri uses the OS\'s native WebView (WebKit on macOS/Linux, WebView2 on Windows). OpenSeadragon works without modification. Bundle your frontend with Vite or another bundler and point Tauri\'s <code>distDir</code> at the build output.' },
          {
            type: 'code',
            filename: 'tauri.conf.json (excerpt)',
            code: `{
  "build": {
    "distDir": "../dist",
    "devPath": "http://localhost:5173"
  },
  "tauri": {
    "allowlist": {
      "protocol": {
        "asset": true,
        "assetScope": ["**"]
      }
    }
  }
}`,
          },
          {
            type: 'callout',
            title: 'Native WebView quirks',
            html: 'WebKit on older macOS versions has WebGL limitations. If you rely on the WebGL drawer, test on the minimum macOS version you intend to support. Fall back to the Canvas drawer via <code>drawer: \'canvas\'</code> if needed.',
          },
          {
            type: 'p', html: 'To load local tile pyramids, use Tauri\'s <code>asset</code> protocol: <code>https://asset.localhost/path/to/tiles/</code>. No extra server process needed.',
          },
        ],
      },
    ],
  },
}
