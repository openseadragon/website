import { ref, watch } from 'vue'

const theme = ref(
  (() => { try { return localStorage.getItem('osd-theme') || 'dark' } catch { return 'dark' } })()
)

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
