import { onMounted, onUnmounted } from 'vue'

export function usePluginsMap() {
  let running = false
  let rafId = null
  let resizeRaf = null
  let resizeHandler = null

  onMounted(() => {
    const map = document.getElementById('plugins-map')
    const canvas = document.getElementById('plugins-map-canvas')
    if (!map || !canvas) return

    const ctx = canvas.getContext('2d')
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const hub = map.querySelector('.pl-hub')
    const nodes = Array.from(map.querySelectorAll('.pl-node'))

    let w = 0, h = 0, hubX = 0, hubY = 0
    const HUB_R = 75, NODE_OFF = 56

    const packets = nodes.map(() => ({
      phase: Math.random(),
      speed: 0.6 + Math.random() * 0.4,
      dir: Math.random() < 0.5 ? 1 : -1
    }))

    const connData = nodes.map((_, i) => ({
      curveOffset: (i % 2 === 0 ? 1 : -1) * (20 + (i % 3) * 8)
    }))

    function layout() {
      const r = map.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr)
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      hubX = w / 2; hubY = h / 2
      const narrow = w < 720, N = nodes.length
      nodes.forEach((node, i) => {
        let x, y
        if (narrow) {
          x = (w * ((i % 3) + 1)) / 4
          y = 80 + Math.floor(i / 3) * ((h - 160) / Math.ceil(N/3 - 1 || 1))
        } else {
          const a = (i / N) * Math.PI * 2 - Math.PI / 2
          const radius = Math.min(w * 0.36, h * 0.4)
          x = hubX + Math.cos(a) * radius; y = hubY + Math.sin(a) * radius
        }
        node.style.left = x + 'px'; node.style.top = y + 'px'
        connData[i].x = x; connData[i].y = y
      })
    }
    layout()

    resizeHandler = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf)
      resizeRaf = requestAnimationFrame(layout)
    }
    window.addEventListener('resize', resizeHandler)

    function accent() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || 'oklch(0.82 0.16 210)'
    }

    function bezier(t, x0, y0, cx, cy, x1, y1) {
      const omt = 1 - t
      return { x: omt*omt*x0 + 2*omt*t*cx + t*t*x1, y: omt*omt*y0 + 2*omt*t*cy + t*t*y1 }
    }

    let last = performance.now()
    function frame(now) {
      if (!running) return
      const dt = Math.min(64, now - last); last = now
      ctx.clearRect(0, 0, w, h)
      const acc = accent()

      connData.forEach(c => {
        const dx = c.x - hubX, dy = c.y - hubY
        const len = Math.hypot(dx, dy) || 1
        const ux = dx/len, uy = dy/len
        c.sx = hubX + ux * HUB_R; c.sy = hubY + uy * HUB_R
        c.ex = c.x - ux * NODE_OFF; c.ey = c.y - uy * NODE_OFF
        const midX = (c.sx + c.ex) / 2, midY = (c.sy + c.ey) / 2
        c.cx = midX + (-uy) * c.curveOffset; c.cy = midY + (ux) * c.curveOffset
      })

      ctx.strokeStyle = acc; ctx.lineWidth = 1
      connData.forEach(c => {
        ctx.globalAlpha = 0.22
        ctx.beginPath(); ctx.moveTo(c.sx, c.sy); ctx.quadraticCurveTo(c.cx, c.cy, c.ex, c.ey); ctx.stroke()
      })

      packets.forEach((pk, idx) => {
        pk.phase += (pk.speed * pk.dir * dt) / 1000
        if (pk.phase >= 1) { pk.phase = 1; pk.dir = -1 }
        if (pk.phase <= 0) { pk.phase = 0; pk.dir = 1 }
        const c = connData[idx]; if (!c) return
        const p  = bezier(pk.phase,                              c.sx, c.sy, c.cx, c.cy, c.ex, c.ey)
        const pp = bezier(Math.max(0, pk.phase - 0.08 * pk.dir), c.sx, c.sy, c.cx, c.cy, c.ex, c.ey)
        ctx.save(); ctx.globalAlpha = 0.35; ctx.fillStyle = acc
        ctx.beginPath(); ctx.arc(pp.x, pp.y, 1.3, 0, Math.PI*2); ctx.fill(); ctx.restore()
        ctx.save(); ctx.globalAlpha = 0.95; ctx.shadowBlur = 14; ctx.shadowColor = acc; ctx.fillStyle = acc
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, Math.PI*2); ctx.fill(); ctx.restore()
      })

      packets.forEach((pk, idx) => {
        const c = connData[idx]; if (!c) return
        let dist
        if (pk.dir === 1 && pk.phase > 0.92) dist = 1 - pk.phase
        else if (pk.dir === -1 && pk.phase < 0.08) dist = pk.phase
        else return
        const k = 1 - (dist / 0.08)
        const target = pk.dir === 1 ? { x: c.ex, y: c.ey } : { x: c.sx, y: c.sy }
        ctx.save(); ctx.globalAlpha = k * 0.5; ctx.strokeStyle = acc; ctx.lineWidth = 1.2
        ctx.beginPath(); ctx.arc(target.x, target.y, 6 + (1-k) * 10, 0, Math.PI*2); ctx.stroke(); ctx.restore()
      })

      rafId = requestAnimationFrame(frame)
    }

    running = true
    rafId = requestAnimationFrame(frame)
  })

  onUnmounted(() => {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    if (resizeRaf) cancelAnimationFrame(resizeRaf)
    if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  })
}
