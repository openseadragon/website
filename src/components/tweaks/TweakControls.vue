<!-- All tweak controls in one file to avoid many small imports -->
<script>
// TweakSection
export const TweakSection = {
  props: { label: String },
  template: `<div class="twk-sect">{{ label }}</div>`
}

// TweakRow
export const TweakRow = {
  props: { label: String, value: { default: null } },
  template: `
    <div class="twk-row">
      <div class="twk-lbl"><span>{{ label }}</span><span v-if="value != null" class="twk-val">{{ value }}</span></div>
      <slot />
    </div>`
}

// TweakSlider
export const TweakSlider = {
  props: { label: String, modelValue: Number, min: { default: 0 }, max: { default: 100 }, step: { default: 1 }, unit: { default: '' } },
  emits: ['update:modelValue'],
  template: `
    <div class="twk-row">
      <div class="twk-lbl"><span>{{ label }}</span><span class="twk-val">{{ modelValue }}{{ unit }}</span></div>
      <input type="range" class="twk-slider" :min="min" :max="max" :step="step" :value="modelValue" @input="$emit('update:modelValue', Number($event.target.value))" />
    </div>`
}

// TweakToggle
export const TweakToggle = {
  props: { label: String, modelValue: Boolean },
  emits: ['update:modelValue'],
  template: `
    <div class="twk-row twk-row-h">
      <div class="twk-lbl"><span>{{ label }}</span></div>
      <button type="button" class="twk-toggle" :data-on="modelValue ? '1' : '0'" role="switch" :aria-checked="!!modelValue" @click="$emit('update:modelValue', !modelValue)"><i /></button>
    </div>`
}

// TweakRadio
export const TweakRadio = {
  props: { label: String, modelValue: [String, Number, Boolean], options: Array },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const { ref, computed } = Vue
    const dragging = ref(false)
    const trackRef = ref(null)
    const opts = computed(() => props.options.map(o => typeof o === 'object' ? o : { value: o, label: o }))
    const idx = computed(() => Math.max(0, opts.value.findIndex(o => o.value === props.modelValue)))
    const n = computed(() => opts.value.length)
    const maxLen = computed(() => props.options.reduce((m, o) => Math.max(m, String(typeof o === 'object' ? o.label : o).length), 0))
    const fitsAsSegments = computed(() => maxLen.value <= ({ 2: 16, 3: 10 }[n.value] ?? 0))

    function segAt(clientX) {
      const r = trackRef.value.getBoundingClientRect()
      const inner = r.width - 4
      const i = Math.floor(((clientX - r.left - 2) / inner) * n.value)
      return opts.value[Math.max(0, Math.min(n.value - 1, i))].value
    }
    function onPointerDown(e) {
      dragging.value = true
      const v0 = segAt(e.clientX)
      if (v0 !== props.modelValue) emit('update:modelValue', v0)
      function move(ev) { if (!trackRef.value) return; const v = segAt(ev.clientX); if (v !== props.modelValue) emit('update:modelValue', v) }
      function up() { dragging.value = false; window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
    }
    return { opts, idx, n, fitsAsSegments, trackRef, dragging, onPointerDown }
  },
  template: `
    <div class="twk-row">
      <div class="twk-lbl"><span>{{ label }}</span></div>
      <select v-if="!fitsAsSegments" class="twk-field" :value="String(modelValue)" @change="$emit('update:modelValue', $event.target.value)">
        <option v-for="o in opts" :key="o.value" :value="o.value">{{ o.label }}</option>
      </select>
      <div v-else ref="trackRef" role="radiogroup" :class="['twk-seg', { dragging }]" @pointerdown="onPointerDown">
        <div class="twk-seg-thumb" :style="{ left: \`calc(2px + \${idx} * (100% - 4px) / \${n})\`, width: \`calc((100% - 4px) / \${n})\` }" />
        <button v-for="o in opts" :key="o.value" type="button" role="radio" :aria-checked="o.value === modelValue">{{ o.label }}</button>
      </div>
    </div>`
}

// TweakColor
export const TweakColor = {
  props: { label: String, modelValue: [String, Array], options: Array },
  emits: ['update:modelValue'],
  setup(props) {
    function isLight(hex) {
      const h = String(hex).replace('#', '')
      const x = h.length === 3 ? h.replace(/./g, c => c+c) : h.padEnd(6, '0')
      const n = parseInt(x.slice(0,6), 16)
      if (Number.isNaN(n)) return true
      const r=(n>>16)&255, g=(n>>8)&255, b=n&255
      return r*299+g*587+b*114>148000
    }
    function key(o) { return String(JSON.stringify(o)).toLowerCase() }
    function isCurrent(o) { return key(o) === key(props.modelValue) }
    return { isLight, key, isCurrent }
  },
  template: `
    <div class="twk-row">
      <div class="twk-lbl"><span>{{ label }}</span></div>
      <div v-if="options && options.length" class="twk-chips" role="radiogroup">
        <button v-for="(o, i) in options" :key="i" type="button" class="twk-chip" role="radio"
                :aria-checked="isCurrent(o)" :data-on="isCurrent(o) ? '1' : '0'"
                :style="{ background: Array.isArray(o) ? o[0] : o }"
                @click="$emit('update:modelValue', o)">
          <span v-if="Array.isArray(o) && o.length > 1">
            <i v-for="(c, j) in o.slice(1, 5)" :key="j" :style="{ background: c }" />
          </span>
          <svg v-if="isCurrent(o)" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M3 7.2 5.8 10 11 4.2" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" :stroke="isLight(Array.isArray(o) ? o[0] : o) ? 'rgba(0,0,0,.78)' : '#fff'" />
          </svg>
        </button>
      </div>
      <input v-else type="color" class="twk-swatch" :value="modelValue" @change="$emit('update:modelValue', $event.target.value)" />
    </div>`
}
</script>
