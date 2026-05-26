import { ref, watch } from 'vue'

function getInitialTheme() {
  try {
    const stored = localStorage.getItem('osd-theme')
    if (stored) return stored
  } catch {}
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

const theme = ref(getInitialTheme())

export function useTheme() {
  watch(theme, (val) => {
    document.documentElement.setAttribute('data-theme', val)
    try { localStorage.setItem('osd-theme', val) } catch {}
  }, { immediate: true })

  function toggle() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  return { theme, toggle }
}
