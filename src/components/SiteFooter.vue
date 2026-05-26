<template>
  <footer class="foot" data-screen-label="Footer">
    <div class="container">
      <div class="foot-grid">
        <div>
          <RouterLink to="/" class="brand">
            <span class="brand-mark" aria-hidden="true">
              <svg class="brand-glyph" viewBox="0 0 24 24" fill="none">
                <rect class="bg-outer" x="3" y="3" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linejoin="round" rx="1.5"/>
                <rect class="bg-inner" x="8" y="8" width="13" height="13" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-opacity="0.55" rx="1.5"/>
                <rect class="bg-dot" x="11" y="11" width="3" height="3" fill="currentColor"/>
              </svg>
            </span>
            <span>OpenSeadragon</span>
          </RouterLink>
          <p class="muted" style="margin-top:16px;font-size:13px;max-width:34ch;">
            An open-source, web-based viewer for high-resolution zoomable images.
            BSD-3 licensed. No tracking. No npm-install drama.
          </p>
        </div>
        <div>
          <h5>Product</h5>
          <ul>
            <li><RouterLink to="/docs">Docs</RouterLink></li>
            <li><RouterLink to="/examples">Examples</RouterLink></li>
            <li><RouterLink to="/plugins">Plugins</RouterLink></li>
            <li><RouterLink to="/docs" class="hash-link">API reference</RouterLink></li>
          </ul>
        </div>
        <div>
          <h5>Learn</h5>
          <ul>
            <li><RouterLink to="/docs">Getting started</RouterLink></li>
            <li><a href="#">Creating tiles</a></li>
            <li><a href="#">Migration to v6</a></li>
            <li><a href="https://www.newline.co/courses/openseadragon-deep-dive" target="_blank" rel="noopener noreferrer">Course</a></li>
          </ul>
        </div>
        <div>
          <h5>Community</h5>
          <ul>
            <li><a href="#">GitHub</a></li>
            <li><a href="#">Discussions</a></li>
            <li><a href="#">Stack Overflow</a></li>
            <li><a href="#">Sponsor</a></li>
          </ul>
        </div>
        <div>
          <h5>Legal</h5>
          <ul>
            <li><a href="#">BSD-3 license</a></li>
            <li><a href="#">Contributing</a></li>
            <li><a href="#">Code of conduct</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© 2002–2026 · BSD-3-Clause</span>
        <span>Made by people who like seeing the brushstrokes.</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
