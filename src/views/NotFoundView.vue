<template>
  <div>
    <NavBar />
    <section class="section-tight" style="padding-top:120px;padding-bottom:120px;">
      <div class="container" style="text-align:center;max-width:480px;">
        <p class="eyebrow"><span class="dot"></span>404</p>
        <h1 class="h-section" style="margin-top:16px;">Page not found.</h1>
        <p class="sub" style="margin-top:12px;">The page you're looking for doesn't exist or was moved.</p>
        <div style="margin-top:32px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
          <RouterLink to="/" class="btn btn-primary">Home</RouterLink>
          <RouterLink to="/docs" class="btn btn-secondary">Docs</RouterLink>
          <RouterLink to="/examples" class="btn btn-secondary">Examples</RouterLink>
        </div>
      </div>
    </section>
    <SiteFooter />
  </div>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import { RouterLink } from 'vue-router'
</script>
