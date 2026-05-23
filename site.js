/* =========================================================
   OSD redesign — interactions + synthetic tile sources
   ========================================================= */

/* ---------------------------------------------------------
   Demo images — pre-rendered, deterministic. Each theme is a
   ~300KB JPEG generated offline. Real-feeling content for the
   viewer with no network dependency on a tile server.
   --------------------------------------------------------- */
function getDemoImageUrl(theme) {
  return `img/demo-${theme}.jpg`;
}

/* ---------------------------------------------------------
   Tile-loading particle field
   A canvas behind the hero. Three layers:
   (1) ambient grid tiles fading in/out (the tile-pyramid metaphor)
   (2) constellation lines drawn between nearby active tiles
   (3) "tile-flight" particles that streak across periodically,
       trailing a fade — like prefetched tiles arriving.
   --------------------------------------------------------- */
function initParticles() {
  const canvas = document.getElementById('tile-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = 0, h = 0;
  const tiles = [];
  const flyers = [];
  const TILE = 28;          // grid cell size in CSS px
  const PAD  = 2;
  const MAX  = 140;          // max live tiles at once
  const MAX_FLY = 6;

  // cursor parallax — particles drift slightly away from cursor
  let mx = -9999, my = -9999;
  canvas.addEventListener('mousemove', () => {}); // canvas is pointer-events:none, listen on parent
  const hero = canvas.closest('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    });
    hero.addEventListener('mouseleave', () => { mx = my = -9999; });
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width  = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  function accent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || 'oklch(0.82 0.16 210)';
  }

  function spawn() {
    if (tiles.length >= MAX) return;
    const cols = Math.max(1, Math.floor(w / TILE));
    const rows = Math.max(1, Math.floor(h / TILE));
    const cx = Math.floor(Math.random() * cols);
    const cy = Math.floor(Math.random() * rows);
    if (Math.random() < (cy / rows) * 0.6) return;
    const scale = Math.random() < 0.12 ? 2 : 1;
    tiles.push({
      x: cx * TILE,
      y: cy * TILE,
      ox: 0, oy: 0,   // parallax offset
      size: TILE * scale - PAD,
      life: 0,
      ttl: 2400 + Math.random() * 2800,
      hue: Math.random() < 0.85 ? 'a' : 'w',
      filled: Math.random() < 0.18
    });
  }

  function spawnFlyer() {
    if (flyers.length >= MAX_FLY) return;
    // pick edge: 0 top, 1 right, 2 bottom, 3 left
    const edge = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const speed = 0.28 + Math.random() * 0.22;
    if (edge === 0)      { x = Math.random() * w; y = -40; vx = (Math.random() - 0.5) * 0.4; vy = speed; }
    else if (edge === 1) { x = w + 40; y = Math.random() * h; vx = -speed; vy = (Math.random() - 0.5) * 0.4; }
    else if (edge === 2) { x = Math.random() * w; y = h + 40; vx = (Math.random() - 0.5) * 0.4; vy = -speed; }
    else                 { x = -40; y = Math.random() * h; vx = speed; vy = (Math.random() - 0.5) * 0.4; }
    flyers.push({
      x, y, vx, vy,
      size: 14 + Math.random() * 10,
      life: 0,
      ttl: 3800 + Math.random() * 1800,
      trail: []
    });
  }

  function roundedRect(x, y, s, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+s-r, y); ctx.quadraticCurveTo(x+s, y, x+s, y+r);
    ctx.lineTo(x+s, y+s-r); ctx.quadraticCurveTo(x+s, y+s, x+s-r, y+s);
    ctx.lineTo(x+r, y+s); ctx.quadraticCurveTo(x, y+s, x, y+s-r);
    ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  }

  let last = performance.now();
  let spawnAcc = 0;
  let flyAcc = 0;

  function frame(now) {
    const dt = Math.min(64, now - last);
    last = now;
    spawnAcc += dt;
    flyAcc += dt;
    while (spawnAcc > 50) { spawnAcc -= 50; spawn(); }
    if (flyAcc > 1400 + Math.random() * 1600) { flyAcc = 0; spawnFlyer(); }

    ctx.clearRect(0, 0, w, h);
    const acc = accent();

    // ===== ambient tiles =====
    // pass 1: update positions + cache visible ones (for line pass)
    const active = [];
    for (let i = tiles.length - 1; i >= 0; i--) {
      const t = tiles[i];
      t.life += dt;
      if (t.life >= t.ttl) { tiles.splice(i, 1); continue; }

      // parallax: push away from cursor
      if (mx > -1000) {
        const dx = (t.x + t.size/2) - mx;
        const dy = (t.y + t.size/2) - my;
        const d2 = dx*dx + dy*dy;
        if (d2 < 24000) {
          const f = 1 - d2/24000;
          const m = f * 22;
          const len = Math.sqrt(d2) || 1;
          t.ox += (dx/len * m - t.ox) * 0.15;
          t.oy += (dy/len * m - t.oy) * 0.15;
        } else {
          t.ox += (0 - t.ox) * 0.08;
          t.oy += (0 - t.oy) * 0.08;
        }
      } else {
        t.ox += (0 - t.ox) * 0.06;
        t.oy += (0 - t.oy) * 0.06;
      }

      active.push(t);
    }

    // pass 2: constellation lines between nearby active tiles
    ctx.strokeStyle = acc;
    ctx.lineWidth = 0.6;
    const LINE_DIST = 110;
    const LD2 = LINE_DIST * LINE_DIST;
    for (let i = 0; i < active.length; i++) {
      const a = active[i];
      const ax = a.x + a.ox + a.size/2;
      const ay = a.y + a.oy + a.size/2;
      const ap = a.life / a.ttl;
      const aAlpha = ap < 0.5 ? (ap/0.5) : (1 - (ap-0.5)/0.5);
      for (let j = i + 1; j < active.length; j++) {
        const b = active[j];
        const bx = b.x + b.ox + b.size/2;
        const by = b.y + b.oy + b.size/2;
        const dx = ax - bx, dy = ay - by;
        const d2 = dx*dx + dy*dy;
        if (d2 > LD2) continue;
        const bp = b.life / b.ttl;
        const bAlpha = bp < 0.5 ? (bp/0.5) : (1 - (bp-0.5)/0.5);
        const f = 1 - d2/LD2;
        ctx.globalAlpha = f * 0.16 * Math.min(aAlpha, bAlpha);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }
    }

    // pass 3: draw the tiles themselves
    for (let i = 0; i < active.length; i++) {
      const t = active[i];
      const p = t.life / t.ttl;
      const a = p < 0.5 ? (p/0.5) * 0.6 : (1 - (p-0.5)/0.5) * 0.6;
      const color = t.hue === 'a' ? acc : 'oklch(0.80 0.14 60)';
      ctx.save();
      ctx.globalAlpha = a * (t.filled ? 0.22 : 0.6);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 1;
      const x = t.x + t.ox + PAD/2, y = t.y + t.oy + PAD/2, s = t.size;
      roundedRect(x, y, s, 2);
      if (t.filled) { ctx.fill(); } else { ctx.stroke(); }
      ctx.restore();
    }

    // ===== flyers (in-flight tiles) =====
    for (let i = flyers.length - 1; i >= 0; i--) {
      const f = flyers[i];
      f.life += dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.trail.unshift({ x: f.x, y: f.y });
      if (f.trail.length > 22) f.trail.pop();
      if (f.life >= f.ttl ||
          f.x < -80 || f.x > w + 80 ||
          f.y < -80 || f.y > h + 80) {
        flyers.splice(i, 1); continue;
      }

      // trail
      for (let k = 0; k < f.trail.length; k++) {
        const tp = f.trail[k];
        const ta = (1 - k / f.trail.length) * 0.35;
        ctx.save();
        ctx.globalAlpha = ta;
        ctx.fillStyle = acc;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // head — a glowing tile-square
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = acc;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = acc;
      ctx.lineWidth = 1.2;
      roundedRect(f.x - f.size/2, f.y - f.size/2, f.size, 2);
      ctx.stroke();
      ctx.restore();
    }

    requestAnimationFrame(frame);
  }

  // seed
  for (let i = 0; i < 60; i++) spawn();
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------
   Community page — animated big stats counters
   --------------------------------------------------------- */
function initCommunityPage() {
  const stars = document.getElementById('cm-stars');
  if (!stars || !window.anime) return; // not on this page
  const setup = [
    { el: document.getElementById('cm-stars'),   to: 3412, format: v => Math.round(v).toLocaleString() },
    { el: document.getElementById('cm-contrib'), to: 184,  format: v => Math.round(v) },
    { el: document.getElementById('cm-dl'),      to: 768,  format: v => Math.round(v) + 'k' },
    { el: document.getElementById('cm-issues'),  to: 2718, format: v => Math.round(v).toLocaleString() }
  ];
  setup.forEach(({ el, to, format }, i) => {
    if (!el) return;
    el.textContent = format(0);
    const obj = { v: 0 };
    anime({
      targets: obj, v: to,
      duration: 2000 + i * 200,
      delay: 200 + i * 80,
      easing: 'easeOutCubic',
      update: () => { el.textContent = format(obj.v); }
    });
  });
}
/* ---------------------------------------------------------
   Examples page — featured live viewers + filterable grid
   --------------------------------------------------------- */
function initExamplesPage() {
  const data = window.__EXAMPLES_DATA;
  const grid = document.getElementById('ex-grid');
  const filters = document.getElementById('ex-filters');
  if (!data || !grid || !filters) return;

  // featured live viewers — three slots
  ['osd-feat-art', 'osd-feat-micro', 'osd-feat-maps'].forEach((id, i) => {
    const theme = ['art', 'micro', 'maps'][i];
    const v = initCaseViewer(id, theme);
    if (v) miniViewers.push(v);
  });

  // categories
  const cats = ['All', ...Array.from(new Set(data.map(d => d.cat)))];
  const counts = Object.fromEntries(cats.map(c => [c, c === 'All' ? data.length : data.filter(d => d.cat === c).length]));
  filters.innerHTML = cats.map((c, i) =>
    `<button class="filter-pill${i===0?' active':''}" data-cat="${c}" role="tab">${c}<span class="count">${counts[c]}</span></button>`
  ).join('');

  // grid
  grid.innerHTML = data.map((it, i) => `
    <a class="example-card" data-cat="${it.cat}" href="#">
      <div class="example-thumb">
        <div class="img"><canvas data-hue="${it.hue}" data-level="${i}" style="width:100%;height:100%;display:block"></canvas></div>
        <div class="reticle">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="22" cy="22" r="14"/>
            <path d="M22 4v6M22 34v6M4 22h6M34 22h6"/>
            <path d="M22 18v8M18 22h8"/>
          </svg>
        </div>
      </div>
      <div class="ex-tag-row"><span class="ex-tag">${it.cat}</span></div>
      <div class="example-meta">
        <b>${it.title}</b><span class="tag">${it.tag}</span>
      </div>
    </a>
  `).join('');
  // paint thumb canvases
  grid.querySelectorAll('canvas[data-hue]').forEach(c => {
    paintExampleThumb(c, +c.dataset.hue, +c.dataset.level);
  });

  // filter behavior
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    filters.querySelectorAll('.filter-pill').forEach(p => {
      p.classList.toggle('active', p === btn);
      p.setAttribute('aria-selected', p === btn ? 'true' : 'false');
    });
    const cat = btn.dataset.cat;
    grid.querySelectorAll('.example-card').forEach(card => {
      const show = cat === 'All' || card.dataset.cat === cat;
      card.hidden = !show;
    });
    if (window.anime) {
      const visible = Array.from(grid.querySelectorAll('.example-card:not([hidden])'));
      anime({ targets: visible, opacity: [0.3, 1], translateY: [8, 0], duration: 360, delay: anime.stagger(20), easing: 'cubicBezier(.2,.7,.2,1)' });
    }
  });

  // hero stat counters
  if (window.anime) {
    const c1 = { v: 0 }, c2 = { v: 0 };
    const e1 = document.getElementById('ex-stat-count');
    const e2 = document.getElementById('ex-stat-cats');
    if (e1) anime({ targets: c1, v: data.length, duration: 1400, delay: 300, easing: 'easeOutCubic', update: () => { e1.textContent = Math.round(c1.v); } });
    if (e2) anime({ targets: c2, v: cats.length - 1, duration: 1400, delay: 300, easing: 'easeOutCubic', update: () => { e2.textContent = Math.round(c2.v); } });
  }
}
/* ---------------------------------------------------------
   Plugins page — category filter + card grid renderer
   --------------------------------------------------------- */
function initPluginsPage() {
  const data = window.__PLUGINS_DATA;
  const grid = document.getElementById('plugin-grid');
  const filters = document.getElementById('plugin-filters');
  if (!data || !grid || !filters) return;

  // build category list
  const cats = ['All', ...Array.from(new Set(data.map(p => p.cat)))];
  const counts = Object.fromEntries(cats.map(c => [c, c === 'All' ? data.length : data.filter(p => p.cat === c).length]));
  filters.innerHTML = cats.map((c, i) =>
    `<button class="filter-pill${i===0?' active':''}" data-cat="${c}" role="tab" aria-selected="${i===0}">${c}<span class="count">${counts[c]}</span></button>`
  ).join('');

  // build cards
  grid.innerHTML = data.map(p => `
    <article class="plugin-card" data-cat="${p.cat}">
      <div class="plugin-card-head">
        <div class="plugin-card-mark">${p.mark}</div>
        <div class="plugin-card-title">
          <div class="plugin-card-name">${p.name}</div>
          <div class="plugin-card-cat">${p.cat}</div>
        </div>
        <div class="plugin-card-stars"><span class="star">★</span> ${p.stars}</div>
      </div>
      <p class="plugin-card-desc">${p.desc}</p>
      <div class="plugin-card-install">
        <span style="color:var(--paper-mute);">npm i</span>
        <span class="cmd">${p.install}</span>
      </div>
      <div class="plugin-card-meta">
        <span>updated ${p.updated}</span>
        <a href="#">View on GitHub →</a>
      </div>
    </article>
  `).join('');

  // filter behavior
  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    filters.querySelectorAll('.filter-pill').forEach(p => {
      p.classList.toggle('active', p === btn);
      p.setAttribute('aria-selected', p === btn ? 'true' : 'false');
    });
    const cat = btn.dataset.cat;
    grid.querySelectorAll('.plugin-card').forEach(card => {
      const show = cat === 'All' || card.dataset.cat === cat;
      card.hidden = !show;
    });
    // re-animate visible cards
    if (window.anime) {
      const visible = Array.from(grid.querySelectorAll('.plugin-card:not([hidden])'));
      anime({
        targets: visible,
        opacity: [0.3, 1],
        translateY: [8, 0],
        duration: 360,
        delay: anime.stagger(20),
        easing: 'cubicBezier(.2,.7,.2,1)'
      });
    }
  });

  // hero stats counter
  if (window.anime) {
    const stats = [
      { id: 'stat-plugins', to: data.length },
      { id: 'stat-cats',    to: cats.length - 1 },
    ];
    stats.forEach(({id, to}) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obj = { v: 0 };
      anime({ targets: obj, v: to, duration: 1400, delay: 300, easing: 'easeOutCubic',
        update: () => { el.textContent = Math.round(obj.v); } });
    });
    // download counter (string)
    const dl = document.getElementById('stat-dl');
    if (dl) {
      const obj = { v: 0 };
      anime({ targets: obj, v: 9.2, duration: 1800, delay: 300, easing: 'easeOutCubic',
        update: () => { dl.textContent = obj.v.toFixed(1) + 'M'; } });
    }
  }
}

/* ---------------------------------------------------------
   Plugins mindmap — hub-and-spoke layout with curved bezier
   connections from each plugin node to the central hub.
   Packets ping-pong between hub and node, suggesting
   bidirectional message flow through the plugin pipeline.
   --------------------------------------------------------- */
function initPluginsMap() {
  const map = document.getElementById('plugins-map');
  const canvas = document.getElementById('plugins-map-canvas');
  if (!map || !canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const hub = map.querySelector('.pl-hub');
  const nodes = Array.from(map.querySelectorAll('.pl-node'));

  let w = 0, h = 0;
  let hubX = 0, hubY = 0;
  const HUB_R = 75;     // hub visual radius (for line offset)
  const NODE_OFF = 56;  // distance from node center the line stops

  // each node gets a packet that oscillates 0→1→0 along the line
  const packets = nodes.map((_, i) => ({
    nodeIdx: i,
    phase: Math.random(),
    speed: 0.6 + Math.random() * 0.4,    // cycles per sec
    dir: Math.random() < 0.5 ? 1 : -1
  }));

  // each connection has its own bezier control point offset
  const connData = nodes.map((_, i) => ({
    curveOffset: (i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 8)
  }));

  function layout() {
    const r = map.getBoundingClientRect();
    w = r.width; h = r.height;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width  = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    hubX = w / 2;
    hubY = h / 2;

    const narrow = w < 720;
    const N = nodes.length;

    nodes.forEach((node, i) => {
      let x, y;
      if (narrow) {
        // 3-col grid layout, hub in center
        const col = i % 3;
        const row = Math.floor(i / 3);
        x = (w * (col + 1)) / 4;
        y = 80 + row * ((h - 160) / Math.ceil(N/3 - 1 || 1));
      } else {
        const a = (i / N) * Math.PI * 2 - Math.PI / 2;
        const radius = Math.min(w * 0.36, h * 0.4);
        x = hubX + Math.cos(a) * radius;
        y = hubY + Math.sin(a) * radius;
      }
      node.style.left = x + 'px';
      node.style.top  = y + 'px';
      connData[i].x = x;
      connData[i].y = y;
    });
  }
  layout();
  let resizeRaf = null;
  window.addEventListener('resize', () => {
    if (resizeRaf) cancelAnimationFrame(resizeRaf);
    resizeRaf = requestAnimationFrame(layout);
  });

  function accent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || 'oklch(0.82 0.16 210)';
  }

  // quadratic bezier point at t
  function bezier(t, x0, y0, cx, cy, x1, y1) {
    const omt = 1 - t;
    return {
      x: omt * omt * x0 + 2 * omt * t * cx + t * t * x1,
      y: omt * omt * y0 + 2 * omt * t * cy + t * t * y1
    };
  }

  let last = performance.now();
  function frame(now) {
    const dt = Math.min(64, now - last); last = now;
    ctx.clearRect(0, 0, w, h);
    const acc = accent();

    // pre-compute each connection's path geometry (start, control, end)
    connData.forEach(c => {
      const dx = c.x - hubX;
      const dy = c.y - hubY;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      c.sx = hubX + ux * HUB_R;
      c.sy = hubY + uy * HUB_R;
      c.ex = c.x - ux * NODE_OFF;
      c.ey = c.y - uy * NODE_OFF;
      const midX = (c.sx + c.ex) / 2;
      const midY = (c.sy + c.ey) / 2;
      // control point perpendicular to line
      c.cx = midX + (-uy) * c.curveOffset;
      c.cy = midY + ( ux) * c.curveOffset;
    });

    // draw connections — faint curved bezier lines
    ctx.strokeStyle = acc;
    ctx.lineWidth = 1;
    connData.forEach(c => {
      ctx.globalAlpha = 0.22;
      ctx.beginPath();
      ctx.moveTo(c.sx, c.sy);
      ctx.quadraticCurveTo(c.cx, c.cy, c.ex, c.ey);
      ctx.stroke();
    });

    // animate + draw packets ping-pong along each connection
    packets.forEach(pk => {
      pk.phase += (pk.speed * pk.dir * dt) / 1000;
      if (pk.phase >= 1) { pk.phase = 1; pk.dir = -1; }
      if (pk.phase <= 0) { pk.phase = 0; pk.dir = 1; }

      const c = connData[pk.nodeIdx];
      if (!c) return;
      const p  = bezier(pk.phase,           c.sx, c.sy, c.cx, c.cy, c.ex, c.ey);
      const pp = bezier(Math.max(0, pk.phase - 0.08 * pk.dir), c.sx, c.sy, c.cx, c.cy, c.ex, c.ey);

      // trail
      ctx.save();
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = acc;
      ctx.beginPath();
      ctx.arc(pp.x, pp.y, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // head — glowing
      ctx.save();
      ctx.globalAlpha = 0.95;
      ctx.shadowBlur = 14;
      ctx.shadowColor = acc;
      ctx.fillStyle = acc;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // node arrival pulses — ring at node end when packet is close to 1
    packets.forEach(pk => {
      const c = connData[pk.nodeIdx];
      if (!c) return;
      let dist;
      if (pk.dir === 1 && pk.phase > 0.92) dist = 1 - pk.phase;
      else if (pk.dir === -1 && pk.phase < 0.08) dist = pk.phase;
      else return;
      const k = 1 - (dist / 0.08);
      const target = pk.dir === 1 ? { x: c.ex, y: c.ey } : { x: c.sx, y: c.sy };
      ctx.save();
      ctx.globalAlpha = k * 0.5;
      ctx.strokeStyle = acc;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 6 + (1 - k) * 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

/* ---------------------------------------------------------
   Community 3D tilt — cards rotate around their center
   following the cursor, with a soft accent spotlight that
   tracks the cursor's position on the surface.
   --------------------------------------------------------- */
function initCommunityTilt() {
  const cards = document.querySelectorAll('.community-card');
  cards.forEach(card => {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = null, hovering = false;

    card.addEventListener('mouseenter', () => { hovering = true; });
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tx = (py - 0.5) * -10;
      ty = (px - 0.5) *  10;
      card.style.setProperty('--sx', (px * 100) + '%');
      card.style.setProperty('--sy', (py * 100) + '%');
      if (!raf) raf = requestAnimationFrame(tick);
    });
    card.addEventListener('mouseleave', () => {
      hovering = false;
      tx = 0; ty = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    });

    function tick() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      card.style.transform = `rotateX(${cx.toFixed(2)}deg) rotateY(${cy.toFixed(2)}deg) translateZ(0)`;
      if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = null;
        if (!hovering) card.style.transform = '';
      }
    }
  });
}
function initCursorSpot() {
  const hero = document.querySelector('.hero');
  const spot = document.getElementById('cursor-spot');
  if (!hero || !spot) return;
  let tx = 0, ty = 0, x = 0, y = 0;
  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    tx = e.clientX - r.left;
    ty = e.clientY - r.top;
  });
  function tick() {
    x += (tx - x) * 0.15;
    y += (ty - y) * 0.15;
    spot.style.setProperty('--mx', x + 'px');
    spot.style.setProperty('--my', y + 'px');
    requestAnimationFrame(tick);
  }
  tick();
}

/* ---------------------------------------------------------
   Mini OSD viewers in the Use Cases section.
   Each one auto-tours its image (slow pan + breathing zoom).
   --------------------------------------------------------- */
const miniViewers = [];

function initCaseViewer(mountId, theme) {
  const mount = document.getElementById(mountId);
  if (!mount || !window.OpenSeadragon) return null;

  const v = OpenSeadragon({
    element: mount,
    prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/',
    tileSources: { type: 'image', url: getDemoImageUrl(theme) },
    showNavigator: false,
    showNavigationControl: false,
    mouseNavEnabled: false,
    gestureSettingsMouse:    { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
    gestureSettingsTouch:    { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
    gestureSettingsPen:      { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
    gestureSettingsUnknown:  { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
    animationTime: 4.5,
    springStiffness: 4.5,
    blendTime: 0.2,
    immediateRender: false,
    minZoomImageRatio: 0.8,
    maxZoomPixelRatio: 6,
    visibilityRatio: 1,
    constrainDuringPan: true,
    background: '#000'
  });

  v.addHandler('open', () => {
    runTour(v);
  });

  // pause when off-screen — saves rendering
  const card = mount.closest('.case-card');
  if (card && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { v._osdPaused = false; }
        else { v._osdPaused = true; }
      });
    }, { threshold: 0.1 });
    io.observe(card);
  }

  return v;
}

function runTour(v) {
  // sequence of pan-zoom targets — eased, infinite loop
  const points = [
    { x: 0.32, y: 0.35, z: 2.4 },
    { x: 0.65, y: 0.48, z: 3.6 },
    { x: 0.5,  y: 0.7,  z: 2.0 },
    { x: 0.42, y: 0.22, z: 4.2 },
    { x: 0.75, y: 0.65, z: 1.6 },
    { x: 0.5,  y: 0.5,  z: 1.0 }
  ];
  let i = 0;
  function next() {
    if (!v || !v.viewport || v.isDestroyed) return;
    if (v._osdPaused) { setTimeout(next, 800); return; }
    const p = points[i % points.length];
    i++;
    try {
      v.viewport.zoomTo(p.z, null, false);
      v.viewport.panTo(new OpenSeadragon.Point(p.x, p.y), false);
    } catch (e) { /* viewer torn down */ return; }
    setTimeout(next, 5200);
  }
  // small stagger so all three minis don't move in lockstep
  setTimeout(next, 400 + Math.random() * 1200);
}

function initCaseViewers() {
  miniViewers.push(initCaseViewer('osd-case-art', 'art'));
  miniViewers.push(initCaseViewer('osd-case-micro', 'micro'));
  miniViewers.push(initCaseViewer('osd-case-maps', 'maps'));
}

/* ---------------------------------------------------------
   Hero viewer
   --------------------------------------------------------- */
let heroViewer = null;
let secondaryViewer = null;
let currentTheme = 'art';

function initHeroViewer() {
  const mount = document.getElementById('osd-hero');
  if (!mount || !window.OpenSeadragon) return;

  heroViewer = OpenSeadragon({
    element: mount,
    prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/',
    tileSources: { type: 'image', url: getDemoImageUrl(currentTheme) },
    showNavigator: true,
    navigatorId: 'osd-hero-navigator',
    navigatorBackground: '#1a1a1a',
    navigatorBorderColor: 'transparent',
    navigatorDisplayRegionColor: '#7adff5',
    showNavigationControl: false,
    showZoomControl: false,
    showHomeControl: false,
    showFullPageControl: false,
    animationTime: 0.9,
    springStiffness: 6.5,
    blendTime: 0.1,
    immediateRender: false,
    zoomPerScroll: 1.5,
    minZoomImageRatio: 0.7,
    maxZoomPixelRatio: 8,
    visibilityRatio: 0.7,
    constrainDuringPan: true,
    gestureSettingsMouse: { scrollToZoom: true, clickToZoom: false, dblClickToZoom: true, flickEnabled: true },
    background: '#000'
  });

  const zoomReadout = document.getElementById('zoom-readout');
  const tileCount = document.getElementById('tile-count');
  const zcThumb = document.getElementById('zc-thumb');
  const zcThumbLabel = document.getElementById('zc-thumb-label');
  const zcFill = document.getElementById('zc-fill');
  const zcRailWrap = document.querySelector('.zc-rail-wrap');
  let tilesLoaded = 0;

  function updateThumb() {
    if (!heroViewer || !heroViewer.viewport) return;
    const z = heroViewer.viewport.getZoom(true);
    const minZ = heroViewer.viewport.getMinZoom();
    const maxZ = heroViewer.viewport.getMaxZoom();
    // log-scale mapping so the slider feels even
    const t = Math.log(Math.max(z, minZ * 1.0001) / minZ) / Math.log(maxZ / minZ);
    const tc = Math.max(0, Math.min(1, t));
    if (zcThumb) {
      zcThumb.style.bottom = (tc * 100) + '%';
      zcThumb.setAttribute('aria-valuenow', z.toFixed(2));
    }
    if (zcThumbLabel) zcThumbLabel.textContent = z.toFixed(1) + '×';
    if (zcFill) zcFill.style.height = (tc * 100) + '%';
  }

  heroViewer.addHandler('open', () => {
    // start at a nice zoomed-in position to show off detail
    heroViewer.viewport.zoomTo(2.6, null, true);
    heroViewer.viewport.panTo(new OpenSeadragon.Point(0.45, 0.4), true);
    // play wireframe overlay sweep on first paint
    const wires = document.getElementById('viewer-wires');
    if (wires) { wires.classList.remove('show'); void wires.offsetWidth; wires.classList.add('show'); }
    updateThumb();
    // OSD sets display:inline-block on the navigator host (overriding our CSS),
    // which collapses it to its content. Force a re-size after our CSS applies.
    if (heroViewer.navigator) {
      setTimeout(() => {
        const navEl = document.getElementById('osd-hero-navigator');
        if (navEl && heroViewer.navigator.updateSize) {
          const r = navEl.getBoundingClientRect();
          heroViewer.navigator.element.style.width  = r.width  + 'px';
          heroViewer.navigator.element.style.height = r.height + 'px';
          heroViewer.navigator.updateSize();
          heroViewer.navigator.update(heroViewer.viewport);
        }
      }, 60);
    }
  });

  heroViewer.addHandler('zoom', (e) => {
    const z = heroViewer.viewport.getZoom(true);
    if (zoomReadout) zoomReadout.textContent = z.toFixed(2) + '×';
    updateThumb();
  });

  heroViewer.addHandler('tile-loaded', () => {
    tilesLoaded++;
    if (tileCount) tileCount.textContent = tilesLoaded.toLocaleString();
  });

  // overlay buttons
  const zIn  = document.getElementById('zoom-in');
  const zOut = document.getElementById('zoom-out');
  const zHm  = document.getElementById('zoom-home');
  const zFl  = document.getElementById('zoom-full');
  if (zIn)  zIn.addEventListener('click', () => heroViewer.viewport.zoomBy(1.5).applyConstraints());
  if (zOut) zOut.addEventListener('click', () => heroViewer.viewport.zoomBy(1 / 1.5).applyConstraints());
  if (zHm)  zHm.addEventListener('click', () => heroViewer.viewport.goHome());
  if (zFl)  zFl.addEventListener('click', () => heroViewer.setFullScreen(!heroViewer.isFullPage()));

  // === zoom-slider drag interaction ===
  if (zcThumb && zcRailWrap) {
    const rail = zcRailWrap.querySelector('.zc-rail');
    function setZoomFromClientY(clientY) {
      const r = rail.getBoundingClientRect();
      const tc = 1 - Math.max(0, Math.min(1, (clientY - r.top) / r.height));
      const minZ = heroViewer.viewport.getMinZoom();
      const maxZ = heroViewer.viewport.getMaxZoom();
      const z = minZ * Math.pow(maxZ / minZ, tc);
      heroViewer.viewport.zoomTo(z, null, false);
    }
    let dragging = false;
    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      setZoomFromClientY(e.clientY);
    }
    function onUp(e) {
      if (!dragging) return;
      dragging = false;
      zcThumb.classList.remove('dragging');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
    zcThumb.addEventListener('pointerdown', (e) => {
      dragging = true;
      zcThumb.classList.add('dragging');
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      e.preventDefault();
    });
    // click on the rail to jump-to-zoom
    zcRailWrap.addEventListener('click', (e) => {
      if (e.target === zcThumb || zcThumb.contains(e.target)) return;
      setZoomFromClientY(e.clientY);
    });
    // keyboard
    zcThumb.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowUp')   { heroViewer.viewport.zoomBy(1.2).applyConstraints(); e.preventDefault(); }
      if (e.key === 'ArrowDown') { heroViewer.viewport.zoomBy(1/1.2).applyConstraints(); e.preventDefault(); }
      if (e.key === 'Home')      { heroViewer.viewport.goHome(); e.preventDefault(); }
    });
  }

  // hide the hint after first interaction
  const hint = document.getElementById('hint-chip');
  if (hint) {
    const dismiss = () => { hint.style.transition = 'opacity 400ms'; hint.style.opacity = '0'; setTimeout(() => hint.remove(), 500); };
    heroViewer.addOnceHandler('canvas-drag', dismiss);
    heroViewer.addOnceHandler('canvas-scroll', dismiss);
  }
}

function initSecondaryViewer() {
  const mount = document.getElementById('osd-secondary');
  if (!mount || !window.OpenSeadragon) return;

  secondaryViewer = OpenSeadragon({
    element: mount,
    prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/',
    tileSources: { type: 'image', url: getDemoImageUrl(currentTheme) },
    showNavigator: true,
    navigatorPosition: 'TOP_RIGHT',
    navigatorHeight: '60px',
    navigatorWidth: '100px',
    showNavigationControl: false,
    animationTime: 0.9,
    zoomPerScroll: 1.4,
    background: '#000',
    minZoomImageRatio: 0.8,
    visibilityRatio: 0.8,
    constrainDuringPan: true
  });

  secondaryViewer.addHandler('open', () => {
    // center of image at center of viewer, default fit
    secondaryViewer.viewport.goHome(true);
  });
}

function rebuildViewersForTheme(theme) {
  currentTheme = theme;
  if (heroViewer) { heroViewer.destroy(); heroViewer = null; }
  if (secondaryViewer) { secondaryViewer.destroy(); secondaryViewer = null; }
  initHeroViewer();
  initSecondaryViewer();

  // strip metadata
  const srcName = document.getElementById('src-name');
  const stripSource = document.getElementById('strip-source');
  if (theme === 'art')   { if (srcName) srcName.textContent = 'Van Gogh · The Starry Night (study tile)'; if (stripSource) stripSource.textContent = '13,824 × 10,368 px synthetic DZI'; }
  if (theme === 'micro') { if (srcName) srcName.textContent = 'H&E whole-slide · liver biopsy'; if (stripSource) stripSource.textContent = '28,672 × 21,504 px @ 40×'; }
  if (theme === 'maps')  { if (srcName) srcName.textContent = 'Antarctic survey · sheet 47-N'; if (stripSource) stripSource.textContent = '32,768 × 24,576 px tile pyramid'; }
}

/* ---------------------------------------------------------
   Example cards (zoom-on-hover)
   --------------------------------------------------------- */
function paintExampleThumb(canvas, hue, level) {
  const w = canvas.width = 480, h = canvas.height = 360;
  const ctx = canvas.getContext('2d');
  // base
  ctx.fillStyle = `oklch(0.18 0.02 240)`;
  ctx.fillRect(0, 0, w, h);
  // gradient ring
  const cx = w * 0.55, cy = h * 0.5;
  const r = w * 0.5;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  grad.addColorStop(0, `hsla(${hue}, 70%, 50%, 0.9)`);
  grad.addColorStop(0.4, `hsla(${(hue+30)%360}, 60%, 32%, 0.7)`);
  grad.addColorStop(1, `hsla(${hue}, 50%, 10%, 0.2)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  // strokes
  ctx.lineCap = 'round';
  for (let i = 0; i < 24 + level*4; i++) {
    const s = (i * 9301 + level * 7919) % 233280 / 233280;
    const s2 = ((i + 7) * 49297) % 233280 / 233280;
    ctx.strokeStyle = `hsla(${(hue + i*8) % 360}, ${60 + s*30}%, ${30 + s2*40}%, ${0.3 + s*0.5})`;
    ctx.lineWidth = 1 + s2 * 5;
    ctx.beginPath();
    ctx.moveTo(s * w, s2 * h);
    ctx.bezierCurveTo(s * w + 80, s2 * h - 40, s2 * w - 60, s * h + 70, s2 * w, s * h);
    ctx.stroke();
  }
}

function buildExamples() {
  const grid = document.getElementById('examples-grid');
  if (!grid) return;
  const items = [
    { tag: 'BASIC',         title: 'Single tiled image',  live: 'art' },
    { tag: 'IIIF',          title: 'IIIF image service' },
    { tag: 'OVERLAYS',      title: 'HTML & SVG overlays', live: 'maps' },
    { tag: 'SEQUENCE',      title: 'Sequence mode slideshow' },
    { tag: 'COLLECTION',    title: 'Collection mode grid' },
    { tag: 'CUSTOM CTRLS',  title: 'Custom controls UI' },
    { tag: 'ANNOTATE',      title: 'Annotation overlay' },
    { tag: 'COMPARE',       title: 'Before / after curtain' },
    { tag: 'WEBGL',         title: 'WebGL drawer + filters' }
  ];
  grid.innerHTML = items.map((it, i) => {
    const hue = (i * 41 + 200) % 360;
    if (it.live) {
      return `
        <a class="example-card example-card-live" href="#">
          <div class="example-thumb">
            <div class="example-osd" id="osd-ex-${i}" data-theme="${it.live}"></div>
            <div class="case-osd-frame" aria-hidden="true">
              <span class="corner tl"></span><span class="corner tr"></span>
              <span class="corner bl"></span><span class="corner br"></span>
            </div>
            <div class="example-chip">
              <span class="dot live"></span> LIVE
            </div>
          </div>
          <div class="example-meta">
            <b>${it.title}</b><span class="tag">${it.tag}</span>
          </div>
        </a>`;
    }
    return `
      <a class="example-card" href="#">
        <div class="example-thumb">
          <div class="img"><canvas data-hue="${hue}" data-level="${i}" style="width:100%;height:100%;display:block"></canvas></div>
          <div class="reticle">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="22" cy="22" r="14"/>
              <path d="M22 4v6M22 34v6M4 22h6M34 22h6"/>
              <path d="M22 18v8M18 22h8"/>
            </svg>
          </div>
        </div>
        <div class="example-meta">
          <b>${it.title}</b><span class="tag">${it.tag}</span>
        </div>
      </a>`;
  }).join('');

  // paint the canvases
  grid.querySelectorAll('canvas[data-hue]').forEach(c => {
    paintExampleThumb(c, +c.dataset.hue, +c.dataset.level);
  });

  // initialize live OSDs in examples (slower, very gentle tour)
  items.forEach((it, i) => {
    if (!it.live) return;
    const mount = document.getElementById(`osd-ex-${i}`);
    if (!mount || !window.OpenSeadragon) return;
    const v = OpenSeadragon({
      element: mount,
      prefixUrl: 'https://cdn.jsdelivr.net/npm/openseadragon@6.0.2/build/openseadragon/images/',
      tileSources: { type: 'image', url: getDemoImageUrl(it.live) },
      showNavigator: false,
      showNavigationControl: false,
      mouseNavEnabled: false,
      gestureSettingsMouse:   { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
      gestureSettingsTouch:   { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
      gestureSettingsPen:     { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
      gestureSettingsUnknown: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, dragToPan: false, flickEnabled: false },
      animationTime: 6, springStiffness: 4, blendTime: 0.2, immediateRender: false,
      minZoomImageRatio: 0.8, maxZoomPixelRatio: 5, visibilityRatio: 1, constrainDuringPan: true,
      background: '#000'
    });
    v.addHandler('open', () => runTour(v));
    miniViewers.push(v);
    // pause off-screen
    const card = mount.closest('.example-card');
    if (card && 'IntersectionObserver' in window) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => { v._osdPaused = !e.isIntersecting; });
      }, { threshold: 0.1 });
      io.observe(card);
    }
  });
}

/* ---------------------------------------------------------
   Anime.js — staggered reveals, count-ups, scroll triggers
   --------------------------------------------------------- */

/* Split an element's text into per-character spans.
   Walks text nodes recursively so inline children (<em>, <br>) survive. */
function splitChars(el) {
  if (!el || el.dataset.split === '1') return el.querySelectorAll('.split-char');
  el.dataset.split = '1';
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  textNodes.forEach(node => {
    const txt = node.nodeValue;
    if (!txt || !txt.trim()) return;
    const frag = document.createDocumentFragment();
    // split into words to preserve word-wrap, then chars within each word
    const words = txt.split(/(\s+)/);
    words.forEach(w => {
      if (/^\s+$/.test(w)) {
        frag.appendChild(document.createTextNode(w));
      } else {
        const word = document.createElement('span');
        word.className = 'split-word';
        for (const ch of w) {
          const c = document.createElement('span');
          c.className = 'split-char';
          c.textContent = ch;
          word.appendChild(c);
        }
        frag.appendChild(word);
      }
    });
    node.parentNode.replaceChild(frag, node);
  });
  return el.querySelectorAll('.split-char');
}

function animeReveals() {
  if (!window.anime) return;

  // === HERO HEADLINE — dramatic split-char "deep zoom out" reveal ===
  // each character scales down from 2x with a blur fade. since this IS
  // a deep-zoom product, the headline literally zooms out from huge.
  const headline = document.querySelector('.hero-copy .h-display');
  if (headline) {
    const chars = splitChars(headline);
    chars.forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'scale(2.4) translateY(-8px)';
      c.style.filter = 'blur(14px)';
    });
    anime({
      targets: chars,
      opacity: [0, 1],
      scale: [2.4, 1],
      translateY: [-8, 0],
      filter: ['blur(14px)', 'blur(0px)'],
      duration: 900,
      delay: anime.stagger(28, { start: 240, from: 'center' }),
      easing: 'cubicBezier(.2,.7,.2,1)'
    });
  }

  // === DOCS HERO HEADLINE — same dramatic split-char reveal ===
  const docsHeadline = document.querySelector('.docs-hero h1.h-section');
  if (docsHeadline) {
    const chars = splitChars(docsHeadline);
    chars.forEach(c => {
      c.style.opacity = '0';
      c.style.transform = 'scale(2.2) translateY(-6px)';
      c.style.filter = 'blur(10px)';
    });
    anime({
      targets: chars,
      opacity: [0, 1],
      scale: [2.2, 1],
      translateY: [-6, 0],
      filter: ['blur(10px)', 'blur(0px)'],
      duration: 800,
      delay: anime.stagger(22, { start: 200, from: 'center' }),
      easing: 'cubicBezier(.2,.7,.2,1)'
    });
  }

  // === DOCS body h1 (e.g. "Quickstart") — split-char reveal ===
  const docsBodyH1 = document.querySelector('.doc-body h1');
  if (docsBodyH1) {
    const chars = splitChars(docsBodyH1);
    chars.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(14px)'; });
    anime({
      targets: chars,
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 700,
      delay: anime.stagger(18, { start: 400 }),
      easing: 'cubicBezier(.2,.7,.2,1)'
    });
  }

  // === DOCS doorways — staggered fade-up ===
  const doorways = document.querySelectorAll('.doorway');
  if (doorways.length) {
    doorways.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(18px)'; });
    anime({
      targets: doorways,
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 800,
      delay: anime.stagger(90, { start: 350 }),
      easing: 'cubicBezier(.2,.7,.2,1)'
    });
  }

  // lede + ctas — slide up
  const heroCopy = document.querySelector('.hero-copy');
  if (heroCopy) {
    const targets = heroCopy.querySelectorAll(':scope > .lede, :scope > .hero-cta');
    targets.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(14px)'; });
    anime({
      targets,
      opacity: [0, 1],
      translateY: [14, 0],
      duration: 800,
      delay: anime.stagger(140, { start: 900 }),
      easing: 'cubicBezier(.2,.7,.2,1)'
    });
  }

  // eyebrow above hero-grid
  const heroEyebrow = document.querySelector('.hero .container > .eyebrow');
  if (heroEyebrow) {
    heroEyebrow.style.opacity = '0';
    anime({ targets: heroEyebrow, opacity: [0, 1], translateY: [10, 0], duration: 700, easing: 'cubicBezier(.2,.7,.2,1)' });
  }

  // stage entrance — slight scale-in
  const stage = document.getElementById('hero-stage');
  if (stage) {
    stage.style.opacity = '0'; stage.style.transform = 'translateY(20px) scale(0.99)';
    anime({
      targets: stage,
      opacity: [0, 1],
      translateY: [20, 0],
      scale: [0.99, 1],
      duration: 1100,
      delay: 500,
      easing: 'cubicBezier(.2,.7,.2,1)'
    });
  }

  // GH star count-up
  const ghPill = document.querySelector('.gh-pill span:not(.star)');
  if (ghPill) {
    const target = 3400;
    const counter = { v: 0 };
    anime({
      targets: counter, v: target, duration: 1800, delay: 600, easing: 'easeOutCubic',
      update: () => { ghPill.textContent = (counter.v / 1000).toFixed(1) + 'k'; }
    });
  }

  // hero strip values fade-in
  const strip = document.querySelectorAll('.hero-strip > div');
  if (strip.length) {
    strip.forEach(el => { el.style.opacity = '0'; });
    anime({
      targets: strip, opacity: [0, 1], translateY: [10, 0], duration: 700,
      delay: anime.stagger(80, { start: 900 }), easing: 'cubicBezier(.2,.7,.2,1)'
    });
  }
}

/* scroll-triggered reveals — IntersectionObserver + anime stagger */
function animeOnScroll() {
  if (!window.anime || !('IntersectionObserver' in window)) return;

  // === Section h2 — character-by-character draw-in on scroll ===
  document.querySelectorAll('.section-head .h-section').forEach(h => {
    const chars = splitChars(h);
    chars.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(20px) rotateX(-40deg)'; });
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        anime({
          targets: chars,
          opacity: [0, 1],
          translateY: [20, 0],
          rotateX: [-40, 0],
          duration: 700,
          delay: anime.stagger(15),
          easing: 'cubicBezier(.2,.7,.2,1)'
        });
      });
    }, { threshold: 0.3 });
    io.observe(h);
  });

  // === Plugins mindmap — opacity-only stagger (preserves position transforms) ===
  const plMap = document.querySelector('.plugins-map');
  if (plMap) {
    const hub = plMap.querySelector('.pl-hub');
    const plNodes = Array.from(plMap.querySelectorAll('.pl-node'));
    [hub, ...plNodes].forEach(el => { if (el) el.style.opacity = '0'; });
    const ioMap = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        ioMap.disconnect();
        anime({ targets: hub, opacity: [0, 1], duration: 700, easing: 'cubicBezier(.2,.7,.2,1)' });
        anime({
          targets: plNodes,
          opacity: [0, 1],
          duration: 600,
          delay: anime.stagger(80, { start: 350 }),
          easing: 'cubicBezier(.2,.7,.2,1)'
        });
      });
    }, { threshold: 0.15 });
    ioMap.observe(plMap);
  }

  // === Code typewriter — types itself out when scrolled into view ===
  // Runs on every .codeblock pre, triggering each once as it enters view.
  document.querySelectorAll('.codeblock pre').forEach(codeblock => {
    const html = codeblock.innerHTML;
    const finalH = codeblock.getBoundingClientRect().height;
    if (!finalH) return;
    codeblock.style.minHeight = finalH + 'px';
    codeblock.innerHTML = '';
    const caret = document.createElement('span');
    caret.className = 'type-caret';
    caret.textContent = '▌';
    codeblock.appendChild(caret);
    const charMs = html.length > 600 ? 6 : 12;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        typewriteHtml(codeblock, html, caret, charMs, () => {
          anime({ targets: caret, opacity: 0, duration: 400, delay: 600, easing: 'linear', complete: () => caret.remove() });
        });
      });
    }, { threshold: 0.2 });
    io.observe(codeblock);
  });

  // === Docs sidebar — active state pulses ===
  const sideActive = document.querySelector('.doc-side a.active');
  if (sideActive) {
    sideActive.classList.add('doc-side-pulse');
  }

  // === Docs TOC scroll-spy — highlight current section heading ===
  const tocLinks = document.querySelectorAll('.doc-toc a[href^="#"]');
  if (tocLinks.length) {
    const targets = [];
    tocLinks.forEach(a => {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if (el) targets.push({ link: a, el });
    });
    if (targets.length) {
      const update = () => {
        let best = targets[0], bestY = -Infinity;
        targets.forEach(t => {
          const y = t.el.getBoundingClientRect().top;
          if (y < 220 && y > bestY) { bestY = y; best = t; }
        });
        tocLinks.forEach(a => a.classList.remove('active'));
        if (best) best.link.classList.add('active');
      };
      window.addEventListener('scroll', update, { passive: true });
      update();
    }
  }

  // === Per-icon feature hover animations ===
  wireFeatureIcons();

  // generic stagger groups
  const groups = [
    { sel: '.features .feature',     stagger: 50,  y: 18 },
    { sel: '.case-card',             stagger: 100, y: 22 },
    { sel: '.examples-grid .example-card', stagger: 60, y: 18 },
    { sel: '.community-card',        stagger: 90,  y: 18 },
    { sel: '.section-head',          stagger: 0,   y: 14 }
  ];

  groups.forEach(({ sel, stagger, y }) => {
    const items = document.querySelectorAll(sel);
    if (!items.length) return;
    items.forEach(el => { el.style.opacity = '0'; el.style.transform = `translateY(${y}px)`; });

    const parents = new Map();
    items.forEach(el => {
      const parent = el.parentElement;
      if (!parents.has(parent)) parents.set(parent, []);
      parents.get(parent).push(el);
    });

    parents.forEach(siblings => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
        });
        const visible = siblings.filter(el => el.dataset.animed !== '1');
        if (!visible.length) return;
        const fired = siblings.some(el => el.getBoundingClientRect().top < window.innerHeight);
        if (!fired) return;
        siblings.forEach(el => el.dataset.animed = '1');
        anime({
          targets: siblings,
          opacity: [0, 1],
          translateY: [y, 0],
          duration: 700,
          delay: stagger ? anime.stagger(stagger) : 0,
          easing: 'cubicBezier(.2,.7,.2,1)'
        });
      }, { threshold: 0.12 });
      siblings.forEach(s => io.observe(s));
    });
  });
}

/* ---------------------------------------------------------
   Typewriter that respects existing HTML (token spans).
   Re-builds content into target one character at a time while
   walking the source DOM, so syntax highlighting survives.
   --------------------------------------------------------- */
function typewriteHtml(target, html, caret, charMs, done) {
  const src = document.createElement('div');
  src.innerHTML = html;
  const ops = [];
  function walk(srcNode, mountParent) {
    for (const n of Array.from(srcNode.childNodes)) {
      if (n.nodeType === 3) {
        const text = n.nodeValue;
        for (const c of text) ops.push({ kind: 'char', ch: c });
      } else {
        const newEl = n.cloneNode(false);
        ops.push({ kind: 'open', el: newEl });
        walk(n, newEl);
        ops.push({ kind: 'close' });
      }
    }
  }
  walk(src, target);

  let i = 0;
  const parentStack = [target];
  function tick() {
    let processed = 0;
    while (i < ops.length && processed < 2) {
      const op = ops[i++];
      const top = parentStack[parentStack.length - 1];
      if (op.kind === 'open') {
        top.appendChild(op.el);
        parentStack.push(op.el);
      } else if (op.kind === 'close') {
        parentStack.pop();
      } else {
        top.appendChild(document.createTextNode(op.ch));
        processed++;
      }
    }
    // keep the caret at the very end of the pre — it floats outside the
    // current token span so it always sits at the typing position.
    if (caret.parentNode !== target) {
      target.appendChild(caret);
    } else {
      target.appendChild(caret); // moves to last child
    }
    if (i < ops.length) {
      setTimeout(tick, charMs);
    } else {
      target.style.minHeight = '';
      if (done) done();
    }
  }
  tick();
}

/* ---------------------------------------------------------
   Per-icon anime.js timelines on hover.
   Each feature gets a small custom motion that mirrors what it
   represents — tiles loading, navigator dragging, etc.
   --------------------------------------------------------- */
function wireFeatureIcons() {
  if (!window.anime) return;
  const features = document.querySelectorAll('.features .feature');
  features.forEach((f, idx) => {
    const svg = f.querySelector('.feature-icon');
    if (!svg) return;
    let playing = null;

    f.addEventListener('mouseenter', () => {
      if (playing) playing.pause();
      switch (idx) {
        case 0: // Tile sources — four squares fade-pulse in sequence
          playing = anime({
            targets: svg.querySelectorAll('rect'),
            opacity: [{ value: 0.3, duration: 0 }, { value: 1, duration: 320 }],
            scale: [{ value: 0.6, duration: 0 }, { value: 1, duration: 380 }],
            translateX: [{ value: -2, duration: 0 }, { value: 0, duration: 380 }],
            transformOrigin: ['50% 50%', '50% 50%'],
            delay: anime.stagger(90),
            easing: 'cubicBezier(.2,.7,.2,1)'
          });
          break;
        case 1: // Overlays — crosshair rotates, center pulses
          playing = anime.timeline({ easing: 'cubicBezier(.2,.7,.2,1)' })
            .add({ targets: svg.querySelector('circle:nth-of-type(1)'), rotate: [0, 90], duration: 700, transformOrigin: '16 16' })
            .add({ targets: svg.querySelector('circle:nth-of-type(2)'), scale: [{value: 1}, {value: 1.6, duration: 280}, {value: 1, duration: 320}], transformOrigin: '16 16' }, 0)
            .add({ targets: svg.querySelectorAll('path'), opacity: [0.2, 1], duration: 500, delay: anime.stagger(60) }, 0);
          break;
        case 2: // Navigator — inner rect "drags" across
          playing = anime({
            targets: svg.querySelectorAll('rect')[1],
            translateX: [{ value: -6, duration: 0 }, { value: 0, duration: 500 }, { value: -4, duration: 500 }],
            translateY: [{ value: 2, duration: 0 }, { value: -1, duration: 500 }, { value: 3, duration: 500 }],
            easing: 'cubicBezier(.2,.7,.2,1)',
            loop: true
          });
          break;
        case 3: // Rotation — the rotate icon rotates
          playing = anime({
            targets: svg,
            rotate: [0, 360],
            duration: 1100,
            easing: 'cubicBezier(.6,0,.2,1)'
          });
          break;
        case 4: // Multi-image — slide one rect over the other
          playing = anime({
            targets: svg.querySelectorAll('rect'),
            translateX: (el, i) => i === 0 ? [-3, 0] : [3, 0],
            translateY: (el, i) => i === 0 ? [2, 0] : [-2, 0],
            opacity: [0.4, 1],
            duration: 700,
            delay: anime.stagger(120),
            easing: 'cubicBezier(.2,.7,.2,1)'
          });
          break;
        case 5: // Plugins — the four corners flicker independently
          playing = anime({
            targets: svg.querySelectorAll('path'),
            opacity: [{ value: 0.2, duration: 0 }, { value: 1, duration: 280 }],
            scale: [{ value: 0.85, duration: 0 }, { value: 1, duration: 340 }],
            transformOrigin: '16 16',
            delay: anime.stagger(70, { from: 'first' }),
            easing: 'cubicBezier(.2,.7,.2,1)'
          });
          break;
        case 6: // WebGL — line "draws" across like a waveform
          {
            const path = svg.querySelector('path');
            if (path && path.getTotalLength) {
              const len = path.getTotalLength();
              path.style.strokeDasharray = len;
              path.style.strokeDashoffset = len;
              playing = anime({
                targets: path,
                strokeDashoffset: [len, 0],
                duration: 900,
                easing: 'cubicBezier(.2,.7,.2,1)'
              });
            }
          }
          break;
        case 7: // Mobile — phone wiggles + tap dot pulses
          playing = anime.timeline({ easing: 'cubicBezier(.2,.7,.2,1)' })
            .add({ targets: svg.querySelector('rect'), rotate: [{value:-4, duration:120},{value:4, duration:180},{value:0, duration:200}], transformOrigin: '16 16' })
            .add({ targets: svg.querySelector('circle'), scale: [{value: 1}, {value: 2.4, duration: 250}, {value: 1, duration: 250}], transformOrigin: '16 25' }, 0);
          break;
      }
    });
  });
}
function wireCopy() {
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) { /* no clipboard in iframe is fine */ }
      // icon-button: swap copy → check via class
      if (btn.classList.contains('copy-btn')) {
        btn.classList.add('copied');
        clearTimeout(btn._copiedT);
        btn._copiedT = setTimeout(() => btn.classList.remove('copied'), 1300);
      } else {
        // text-only buttons (legacy fallback): swap content
        const original = btn.textContent;
        btn.textContent = 'copied';
        btn.style.background = 'var(--accent)';
        btn.style.color = 'var(--accent-ink)';
        clearTimeout(btn._copiedT);
        btn._copiedT = setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          btn.style.color = '';
        }, 1100);
      }
    });
  });
}

/* ---------------------------------------------------------
   Theme / accent / frame switching (driven by Tweaks panel)
   --------------------------------------------------------- */
window.__applyDesignTweaks = function (tweaks) {
  const html = document.documentElement;
  if (tweaks.theme)  html.setAttribute('data-theme', tweaks.theme);
  if (tweaks.accent) html.setAttribute('data-accent', tweaks.accent);
  if (tweaks.frame && tweaks.frame !== currentTheme) {
    rebuildViewersForTheme(tweaks.frame);
  }
};

/* ---------------------------------------------------------
   Theme toggle — persists preference to localStorage.
   The anti-flash inline script in each HTML head applies the
   saved value before first paint; this wires the button click.
   --------------------------------------------------------- */
function initThemeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('osd-theme', next); } catch (e) {}
  });
}

/* ---------------------------------------------------------
   Init
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  buildExamples();
  wireCopy();
  initParticles();
  initCursorSpot();
  initHeroViewer();
  initSecondaryViewer();
  initCaseViewers();
  initPluginsMap();
  initPluginsPage();
  initExamplesPage();
  initCommunityPage();
  initCommunityTilt();
  animeReveals();
  animeOnScroll();
});
