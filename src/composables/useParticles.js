import { onMounted, onUnmounted } from 'vue'

export function useParticles(canvasId = 'tile-particles', heroSelector = '.hero, .page-hero') {
  let running = false
  let rafId = null
  let mouseMoveHandler = null
  let mouseLeaveHandler = null
  let resizeHandler = null

  onMounted(() => {
    const canvas = document.getElementById(canvasId)
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    const tiles = [], flyers = []
    const TILE = 28, PAD = 2, MAX = 140, MAX_FLY = 6
    let mx = -9999, my = -9999

    const hero = canvas.closest(heroSelector) || document.querySelector(heroSelector)
    if (hero) {
      mouseMoveHandler = (e) => {
        const r = canvas.getBoundingClientRect()
        mx = e.clientX - r.left
        my = e.clientY - r.top
      }
      mouseLeaveHandler = () => { mx = my = -9999 }
      hero.addEventListener('mousemove', mouseMoveHandler)
      hero.addEventListener('mouseleave', mouseLeaveHandler)
    }

    function resize() {
      const r = canvas.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    resizeHandler = () => resize()
    window.addEventListener('resize', resizeHandler)

    function accent() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || 'oklch(0.82 0.16 210)'
    }

    function spawn() {
      if (tiles.length >= MAX) return
      const cols = Math.max(1, Math.floor(w / TILE))
      const rows = Math.max(1, Math.floor(h / TILE))
      const cx = Math.floor(Math.random() * cols)
      const cy = Math.floor(Math.random() * rows)
      if (Math.random() < (cy / rows) * 0.6) return
      const scale = Math.random() < 0.12 ? 2 : 1
      tiles.push({
        x: cx * TILE, y: cy * TILE, ox: 0, oy: 0,
        size: TILE * scale - PAD,
        life: 0, ttl: 2400 + Math.random() * 2800,
        hue: Math.random() < 0.85 ? 'a' : 'w',
        filled: Math.random() < 0.18
      })
    }

    function spawnFlyer() {
      if (flyers.length >= MAX_FLY) return
      const edge = Math.floor(Math.random() * 4)
      let x, y, vx, vy
      const speed = 0.28 + Math.random() * 0.22
      if (edge === 0)      { x = Math.random() * w; y = -40; vx = (Math.random() - 0.5) * 0.4; vy = speed }
      else if (edge === 1) { x = w + 40; y = Math.random() * h; vx = -speed; vy = (Math.random() - 0.5) * 0.4 }
      else if (edge === 2) { x = Math.random() * w; y = h + 40; vx = (Math.random() - 0.5) * 0.4; vy = -speed }
      else                 { x = -40; y = Math.random() * h; vx = speed; vy = (Math.random() - 0.5) * 0.4 }
      flyers.push({ x, y, vx, vy, size: 14 + Math.random() * 10, life: 0, ttl: 3800 + Math.random() * 1800, trail: [] })
    }

    function roundedRect(x, y, s, r) {
      ctx.beginPath()
      ctx.moveTo(x+r, y); ctx.lineTo(x+s-r, y); ctx.quadraticCurveTo(x+s, y, x+s, y+r)
      ctx.lineTo(x+s, y+s-r); ctx.quadraticCurveTo(x+s, y+s, x+s-r, y+s)
      ctx.lineTo(x+r, y+s); ctx.quadraticCurveTo(x, y+s, x, y+s-r)
      ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y)
      ctx.closePath()
    }

    let last = performance.now(), spawnAcc = 0, flyAcc = 0

    function frame(now) {
      if (!running) return
      const dt = Math.min(64, now - last); last = now
      spawnAcc += dt; flyAcc += dt
      while (spawnAcc > 50) { spawnAcc -= 50; spawn() }
      if (flyAcc > 1400 + Math.random() * 1600) { flyAcc = 0; spawnFlyer() }

      ctx.clearRect(0, 0, w, h)
      const acc = accent()
      const active = []

      for (let i = tiles.length - 1; i >= 0; i--) {
        const t = tiles[i]
        t.life += dt
        if (t.life >= t.ttl) { tiles.splice(i, 1); continue }
        if (mx > -1000) {
          const dx = (t.x + t.size/2) - mx, dy = (t.y + t.size/2) - my
          const d2 = dx*dx + dy*dy
          if (d2 < 24000) {
            const f = 1 - d2/24000, m = f * 22, len = Math.sqrt(d2) || 1
            t.ox += (dx/len * m - t.ox) * 0.15; t.oy += (dy/len * m - t.oy) * 0.15
          } else { t.ox += (0 - t.ox) * 0.08; t.oy += (0 - t.oy) * 0.08 }
        } else { t.ox += (0 - t.ox) * 0.06; t.oy += (0 - t.oy) * 0.06 }
        active.push(t)
      }

      ctx.strokeStyle = acc; ctx.lineWidth = 0.6
      const LD2 = 110 * 110
      for (let i = 0; i < active.length; i++) {
        const a = active[i]
        const ax = a.x + a.ox + a.size/2, ay = a.y + a.oy + a.size/2
        const ap = a.life / a.ttl
        const aAlpha = ap < 0.5 ? (ap/0.5) : (1 - (ap-0.5)/0.5)
        for (let j = i + 1; j < active.length; j++) {
          const b = active[j]
          const bx = b.x + b.ox + b.size/2, by = b.y + b.oy + b.size/2
          const dx = ax - bx, dy = ay - by, d2 = dx*dx + dy*dy
          if (d2 > LD2) continue
          const bp = b.life / b.ttl
          const bAlpha = bp < 0.5 ? (bp/0.5) : (1 - (bp-0.5)/0.5)
          ctx.globalAlpha = (1 - d2/LD2) * 0.16 * Math.min(aAlpha, bAlpha)
          ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke()
        }
      }

      for (const t of active) {
        const p = t.life / t.ttl
        const a = p < 0.5 ? (p/0.5) * 0.6 : (1 - (p-0.5)/0.5) * 0.6
        const color = t.hue === 'a' ? acc : 'oklch(0.80 0.14 60)'
        ctx.save(); ctx.globalAlpha = a * (t.filled ? 0.22 : 0.6)
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1
        roundedRect(t.x + t.ox + PAD/2, t.y + t.oy + PAD/2, t.size, 2)
        if (t.filled) ctx.fill(); else ctx.stroke()
        ctx.restore()
      }

      for (let i = flyers.length - 1; i >= 0; i--) {
        const f = flyers[i]
        f.life += dt; f.x += f.vx * dt; f.y += f.vy * dt
        f.trail.unshift({ x: f.x, y: f.y })
        if (f.trail.length > 22) f.trail.pop()
        if (f.life >= f.ttl || f.x < -80 || f.x > w+80 || f.y < -80 || f.y > h+80) { flyers.splice(i, 1); continue }
        for (let k = 0; k < f.trail.length; k++) {
          ctx.save(); ctx.globalAlpha = (1 - k / f.trail.length) * 0.35
          ctx.fillStyle = acc; ctx.beginPath(); ctx.arc(f.trail[k].x, f.trail[k].y, 1.8, 0, Math.PI*2); ctx.fill(); ctx.restore()
        }
        ctx.save(); ctx.globalAlpha = 0.85; ctx.shadowColor = acc; ctx.shadowBlur = 10
        ctx.strokeStyle = acc; ctx.lineWidth = 1.2
        roundedRect(f.x - f.size/2, f.y - f.size/2, f.size, 2); ctx.stroke(); ctx.restore()
      }

      rafId = requestAnimationFrame(frame)
    }

    running = true
    for (let i = 0; i < 60; i++) spawn()
    rafId = requestAnimationFrame(frame)
  })

  onUnmounted(() => {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    if (mouseMoveHandler || mouseLeaveHandler) {
      const hero = document.querySelector(heroSelector)
      if (hero) {
        if (mouseMoveHandler) hero.removeEventListener('mousemove', mouseMoveHandler)
        if (mouseLeaveHandler) hero.removeEventListener('mouseleave', mouseLeaveHandler)
      }
    }
    if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  })
}
