import { onMounted, onUnmounted } from 'vue'

const observers = []

function splitChars(el) {
  if (!el || el.dataset.split === '1') return el ? el.querySelectorAll('.split-char') : []
  el.dataset.split = '1'
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null)
  const textNodes = []
  while (walker.nextNode()) textNodes.push(walker.currentNode)
  textNodes.forEach(node => {
    const txt = node.nodeValue
    if (!txt || !txt.trim()) return
    const frag = document.createDocumentFragment()
    const words = txt.split(/(\s+)/)
    words.forEach(w => {
      if (/^\s+$/.test(w)) {
        frag.appendChild(document.createTextNode(w))
      } else {
        const word = document.createElement('span')
        word.className = 'split-word'
        for (const ch of w) {
          const c = document.createElement('span')
          c.className = 'split-char'; c.textContent = ch; word.appendChild(c)
        }
        frag.appendChild(word)
      }
    })
    node.parentNode.replaceChild(frag, node)
  })
  return el.querySelectorAll('.split-char')
}

function typewriteHtml(target, html, caret, charMs, done) {
  const src = document.createElement('div')
  src.innerHTML = html
  const ops = []
  function walk(srcNode) {
    for (const n of Array.from(srcNode.childNodes)) {
      if (n.nodeType === 3) {
        for (const c of n.nodeValue) ops.push({ kind: 'char', ch: c })
      } else {
        ops.push({ kind: 'open', el: n.cloneNode(false) })
        walk(n)
        ops.push({ kind: 'close' })
      }
    }
  }
  walk(src)
  let i = 0
  const parentStack = [target]
  function tick() {
    let processed = 0
    while (i < ops.length && processed < 2) {
      const op = ops[i++]
      const top = parentStack[parentStack.length - 1]
      if (op.kind === 'open') { top.appendChild(op.el); parentStack.push(op.el) }
      else if (op.kind === 'close') { parentStack.pop() }
      else { top.appendChild(document.createTextNode(op.ch)); processed++ }
    }
    target.appendChild(caret)
    if (i < ops.length) { setTimeout(tick, charMs) }
    else { target.style.minHeight = ''; if (done) done() }
  }
  tick()
}

export function useAnimations() {
  const localObservers = []

  onMounted(() => {
    if (!window.anime) return

    // Hero headline
    const headline = document.querySelector('.hero-copy .h-display')
    if (headline) {
      const chars = splitChars(headline)
      chars.forEach(c => { c.style.opacity = '0'; c.style.transform = 'scale(2.4) translateY(-8px)'; c.style.filter = 'blur(14px)' })
      window.anime({ targets: chars, opacity: [0,1], scale: [2.4,1], translateY: [-8,0], filter: ['blur(14px)','blur(0px)'],
        duration: 900, delay: window.anime.stagger(28, { start: 240, from: 'center' }), easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // Docs hero headline
    const docsHeadline = document.querySelector('.docs-hero h1.h-section')
    if (docsHeadline) {
      const chars = splitChars(docsHeadline)
      chars.forEach(c => { c.style.opacity = '0'; c.style.transform = 'scale(2.2) translateY(-6px)'; c.style.filter = 'blur(10px)' })
      window.anime({ targets: chars, opacity: [0,1], scale: [2.2,1], translateY: [-6,0], filter: ['blur(10px)','blur(0px)'],
        duration: 800, delay: window.anime.stagger(22, { start: 200, from: 'center' }), easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // Docs body h1
    const docsBodyH1 = document.querySelector('.doc-body h1')
    if (docsBodyH1) {
      const chars = splitChars(docsBodyH1)
      chars.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(14px)' })
      window.anime({ targets: chars, opacity: [0,1], translateY: [14,0], duration: 700, delay: window.anime.stagger(18, { start: 400 }), easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // Docs doorways
    const doorways = document.querySelectorAll('.doorway')
    if (doorways.length) {
      doorways.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(18px)' })
      window.anime({ targets: doorways, opacity: [0,1], translateY: [18,0], duration: 800, delay: window.anime.stagger(90, { start: 350 }), easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // Lede + CTAs
    const heroCopy = document.querySelector('.hero-copy')
    if (heroCopy) {
      const targets = heroCopy.querySelectorAll(':scope > .lede, :scope > .hero-cta')
      targets.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(14px)' })
      window.anime({ targets, opacity: [0,1], translateY: [14,0], duration: 800, delay: window.anime.stagger(140, { start: 900 }), easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // Eyebrow
    const heroEyebrow = document.querySelector('.hero .container > .eyebrow, .page-hero .container > .eyebrow')
    if (heroEyebrow) {
      heroEyebrow.style.opacity = '0'
      window.anime({ targets: heroEyebrow, opacity: [0,1], translateY: [10,0], duration: 700, easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // Hero headline (page-hero variant)
    const pageHeroH1 = document.querySelector('.page-hero h1.h-display')
    if (pageHeroH1) {
      const chars = splitChars(pageHeroH1)
      chars.forEach(c => { c.style.opacity = '0'; c.style.transform = 'scale(2.0) translateY(-6px)'; c.style.filter = 'blur(10px)' })
      window.anime({ targets: chars, opacity: [0,1], scale: [2.0,1], translateY: [-6,0], filter: ['blur(10px)','blur(0px)'],
        duration: 800, delay: window.anime.stagger(20, { start: 200, from: 'center' }), easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // Hero stats
    const pageHeroLede = document.querySelector('.page-hero .lede')
    if (pageHeroLede) {
      pageHeroLede.style.opacity = '0'; pageHeroLede.style.transform = 'translateY(14px)'
      window.anime({ targets: pageHeroLede, opacity: [0,1], translateY: [14,0], duration: 700, delay: 600, easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    const heroStats = document.querySelectorAll('.hero-stats > div')
    if (heroStats.length) {
      heroStats.forEach(el => { el.style.opacity = '0' })
      window.anime({ targets: heroStats, opacity: [0,1], translateY: [10,0], duration: 600, delay: window.anime.stagger(80, { start: 700 }), easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // Stage
    const stage = document.getElementById('hero-stage')
    if (stage) {
      stage.style.opacity = '0'; stage.style.transform = 'translateY(20px) scale(0.99)'
      window.anime({ targets: stage, opacity: [0,1], translateY: [20,0], scale: [0.99,1], duration: 1100, delay: 500, easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // GH star count-up
    const ghPill = document.querySelector('.gh-pill span:not(.star)')
    if (ghPill) {
      const counter = { v: 0 }
      window.anime({ targets: counter, v: 3400, duration: 1800, delay: 600, easing: 'easeOutCubic',
        update: () => { ghPill.textContent = (counter.v / 1000).toFixed(1) + 'k' } })
    }

    // Hero strip
    const strip = document.querySelectorAll('.hero-strip > div')
    if (strip.length) {
      strip.forEach(el => { el.style.opacity = '0' })
      window.anime({ targets: strip, opacity: [0,1], translateY: [10,0], duration: 700, delay: window.anime.stagger(80, { start: 900 }), easing: 'cubicBezier(.2,.7,.2,1)' })
    }

    // Scroll-triggered section headings
    if (!('IntersectionObserver' in window)) return

    document.querySelectorAll('.section-head .h-section').forEach(h => {
      const chars = splitChars(h)
      chars.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(20px) rotateX(-40deg)' })
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          io.unobserve(e.target)
          window.anime({ targets: chars, opacity: [0,1], translateY: [20,0], rotateX: [-40,0],
            duration: 700, delay: window.anime.stagger(15), easing: 'cubicBezier(.2,.7,.2,1)' })
        })
      }, { threshold: 0.3 })
      io.observe(h)
      localObservers.push(io)
    })

    // Plugins map reveal
    const plMap = document.querySelector('.plugins-map')
    if (plMap) {
      const hubEl = plMap.querySelector('.pl-hub')
      const plNodes = Array.from(plMap.querySelectorAll('.pl-node'))
      ;[hubEl, ...plNodes].forEach(el => { if (el) el.style.opacity = '0' })
      const ioMap = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          ioMap.disconnect()
          window.anime({ targets: hubEl, opacity: [0,1], duration: 700, easing: 'cubicBezier(.2,.7,.2,1)' })
          window.anime({ targets: plNodes, opacity: [0,1], duration: 600, delay: window.anime.stagger(80, { start: 350 }), easing: 'cubicBezier(.2,.7,.2,1)' })
        })
      }, { threshold: 0.15 })
      ioMap.observe(plMap)
      localObservers.push(ioMap)
    }

    // Codeblock typewriter
    document.querySelectorAll('.codeblock pre').forEach(codeblock => {
      const html = codeblock.innerHTML
      const finalH = codeblock.getBoundingClientRect().height
      if (!finalH) return
      codeblock.style.minHeight = finalH + 'px'
      codeblock.innerHTML = ''
      const caret = document.createElement('span')
      caret.className = 'type-caret'; caret.textContent = '▌'; codeblock.appendChild(caret)
      const charMs = html.length > 600 ? 6 : 12
      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          io.unobserve(e.target)
          typewriteHtml(codeblock, html, caret, charMs, () => {
            window.anime({ targets: caret, opacity: 0, duration: 400, delay: 600, easing: 'linear', complete: () => caret.remove() })
          })
        })
      }, { threshold: 0.2 })
      io.observe(codeblock)
      localObservers.push(io)
    })

    // TOC scroll-spy
    const tocLinks = document.querySelectorAll('.doc-toc a[href^="#"]')
    if (tocLinks.length) {
      const targets = []
      tocLinks.forEach(a => {
        const id = a.getAttribute('href').slice(1)
        const el = document.getElementById(id)
        if (el) targets.push({ link: a, el })
      })
      if (targets.length) {
        const update = () => {
          let best = targets[0], bestY = -Infinity
          targets.forEach(t => { const y = t.el.getBoundingClientRect().top; if (y < 220 && y > bestY) { bestY = y; best = t } })
          tocLinks.forEach(a => a.classList.remove('active'))
          if (best) best.link.classList.add('active')
        }
        window.addEventListener('scroll', update, { passive: true })
        update()
      }
    }

    // Generic stagger groups
    const groups = [
      { sel: '.features .feature',           stagger: 50,  y: 18 },
      { sel: '.case-card',                   stagger: 100, y: 22 },
      { sel: '.examples-grid .example-card', stagger: 60,  y: 18 },
      { sel: '.community-card',              stagger: 90,  y: 18 },
      { sel: '.section-head',                stagger: 0,   y: 14 }
    ]
    groups.forEach(({ sel, stagger, y }) => {
      const items = document.querySelectorAll(sel)
      if (!items.length) return
      items.forEach(el => { el.style.opacity = '0'; el.style.transform = `translateY(${y}px)` })
      const parents = new Map()
      items.forEach(el => {
        const parent = el.parentElement
        if (!parents.has(parent)) parents.set(parent, [])
        parents.get(parent).push(el)
      })
      parents.forEach(siblings => {
        const io = new IntersectionObserver(entries => {
          entries.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target) })
          const visible = siblings.filter(el => el.dataset.animed !== '1')
          if (!visible.length) return
          const fired = siblings.some(el => el.getBoundingClientRect().top < window.innerHeight)
          if (!fired) return
          siblings.forEach(el => el.dataset.animed = '1')
          window.anime({ targets: siblings, opacity: [0,1], translateY: [y,0], duration: 700,
            delay: stagger ? window.anime.stagger(stagger) : 0, easing: 'cubicBezier(.2,.7,.2,1)' })
        }, { threshold: 0.12 })
        siblings.forEach(s => io.observe(s))
        localObservers.push(io)
      })
    })

    // Feature icon hover animations
    wireFeatureIcons()
  })

  onUnmounted(() => {
    localObservers.forEach(io => io.disconnect())
    localObservers.length = 0
  })
}

function wireFeatureIcons() {
  if (!window.anime) return
  document.querySelectorAll('.features .feature').forEach((f, idx) => {
    const svg = f.querySelector('.feature-icon')
    if (!svg) return
    let playing = null
    f.addEventListener('mouseenter', () => {
      if (playing) playing.pause()
      switch (idx) {
        case 0:
          playing = window.anime({ targets: svg.querySelectorAll('rect'),
            opacity: [{ value: 0.3, duration: 0 },{ value: 1, duration: 320 }],
            scale: [{ value: 0.6, duration: 0 },{ value: 1, duration: 380 }],
            translateX: [{ value: -2, duration: 0 },{ value: 0, duration: 380 }],
            transformOrigin: ['50% 50%','50% 50%'], delay: window.anime.stagger(90), easing: 'cubicBezier(.2,.7,.2,1)' })
          break
        case 1:
          playing = window.anime.timeline({ easing: 'cubicBezier(.2,.7,.2,1)' })
            .add({ targets: svg.querySelector('circle:nth-of-type(1)'), rotate: [0,90], duration: 700, transformOrigin: '16 16' })
            .add({ targets: svg.querySelector('circle:nth-of-type(2)'), scale: [{value:1},{value:1.6,duration:280},{value:1,duration:320}], transformOrigin: '16 16' }, 0)
            .add({ targets: svg.querySelectorAll('path'), opacity: [0.2,1], duration: 500, delay: window.anime.stagger(60) }, 0)
          break
        case 2:
          playing = window.anime({ targets: svg.querySelectorAll('rect')[1],
            translateX: [{ value: -6, duration: 0 },{ value: 0, duration: 500 },{ value: -4, duration: 500 }],
            translateY: [{ value: 2, duration: 0 },{ value: -1, duration: 500 },{ value: 3, duration: 500 }],
            easing: 'cubicBezier(.2,.7,.2,1)', loop: true })
          break
        case 3:
          playing = window.anime({ targets: svg, rotate: [0,360], duration: 1100, easing: 'cubicBezier(.6,0,.2,1)' })
          break
        case 4:
          playing = window.anime({ targets: svg.querySelectorAll('rect'),
            translateX: (el, i) => i === 0 ? [-3,0] : [3,0],
            translateY: (el, i) => i === 0 ? [2,0] : [-2,0],
            opacity: [0.4,1], duration: 700, delay: window.anime.stagger(120), easing: 'cubicBezier(.2,.7,.2,1)' })
          break
        case 5:
          playing = window.anime({ targets: svg.querySelectorAll('path'),
            opacity: [{ value: 0.2, duration: 0 },{ value: 1, duration: 280 }],
            scale: [{ value: 0.85, duration: 0 },{ value: 1, duration: 340 }],
            transformOrigin: '16 16', delay: window.anime.stagger(70, { from: 'first' }), easing: 'cubicBezier(.2,.7,.2,1)' })
          break
        case 6: {
          const path = svg.querySelector('path')
          if (path && path.getTotalLength) {
            const len = path.getTotalLength()
            path.style.strokeDasharray = len; path.style.strokeDashoffset = len
            playing = window.anime({ targets: path, strokeDashoffset: [len, 0], duration: 900, easing: 'cubicBezier(.2,.7,.2,1)' })
          }
          break
        }
        case 7:
          playing = window.anime.timeline({ easing: 'cubicBezier(.2,.7,.2,1)' })
            .add({ targets: svg.querySelector('rect'), rotate: [{value:-4,duration:120},{value:4,duration:180},{value:0,duration:200}], transformOrigin: '16 16' })
            .add({ targets: svg.querySelector('circle'), scale: [{value:1},{value:2.4,duration:250},{value:1,duration:250}], transformOrigin: '16 25' }, 0)
          break
      }
    })
  })
}

export function useCursorSpot() {
  onMounted(() => {
    const hero = document.querySelector('.hero, .page-hero')
    const spot = document.getElementById('cursor-spot')
    if (!hero || !spot) return
    let tx = 0, ty = 0, x = 0, y = 0
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect()
      tx = e.clientX - r.left; ty = e.clientY - r.top
    })
    function tick() { x += (tx - x) * 0.15; y += (ty - y) * 0.15; spot.style.setProperty('--mx', x + 'px'); spot.style.setProperty('--my', y + 'px'); requestAnimationFrame(tick) }
    tick()
  })
}

export function useCopyButtons() {
  onMounted(() => {
    document.querySelectorAll('[data-copy]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault()
        try { await navigator.clipboard.writeText(btn.dataset.copy) } catch {}
        if (btn.classList.contains('copy-btn')) {
          btn.classList.add('copied')
          clearTimeout(btn._copiedT)
          btn._copiedT = setTimeout(() => btn.classList.remove('copied'), 1300)
        }
      })
    })
  })
}

export function useCommunityTilt() {
  onMounted(() => {
    document.querySelectorAll('.community-card').forEach(card => {
      let tx = 0, ty = 0, cx = 0, cy = 0, raf = null, hovering = false
      card.addEventListener('mouseenter', () => { hovering = true })
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect()
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height
        tx = (py - 0.5) * -10; ty = (px - 0.5) * 10
        card.style.setProperty('--sx', (px * 100) + '%'); card.style.setProperty('--sy', (py * 100) + '%')
        if (!raf) raf = requestAnimationFrame(tick)
      })
      card.addEventListener('mouseleave', () => { hovering = false; tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(tick) })
      function tick() {
        cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2
        card.style.transform = `rotateX(${cx.toFixed(2)}deg) rotateY(${cy.toFixed(2)}deg) translateZ(0)`
        if (Math.abs(cx - tx) > 0.05 || Math.abs(cy - ty) > 0.05) { raf = requestAnimationFrame(tick) }
        else { raf = null; if (!hovering) card.style.transform = '' }
      }
    })
  })
}
