<script setup>
import { computed, ref } from 'vue'
import { rooflinePoint } from './architectureModels.mjs'

const peak = ref(432)
const bandwidth = ref(3.2)
const intensity = ref(64)
const point = computed(() => rooflinePoint({ peak: peak.value, bandwidth: bandwidth.value, intensity: intensity.value }))
const x = computed(() => 55 + Math.log2(intensity.value) / 10 * 470)
const y = computed(() => 255 - Math.log2(Math.max(1, point.value.performance)) / 10 * 205)
</script>

<template>
  <section class="roofline arch-overlay">
    <svg viewBox="0 0 600 300" role="img" aria-label="Interactive roofline model">
      <path class="axis" d="M55 25V255H565" />
      <path class="roof memory-roof" d="M55 255L390 52" />
      <path class="roof compute-roof" d="M390 52H565" />
      <line :x1="x" :x2="x" :y1="y" y2="255" class="guide" />
      <circle :cx="x" :cy="y" r="11" :class="point.bottleneck" />
      <text x="65" y="42">PERFORMANCE</text><text x="430" y="281">ARITHMETIC INTENSITY</text>
      <text x="402" y="42" class="compute-label">COMPUTE CEILING</text>
      <text x="165" y="176" class="memory-label">BANDWIDTH CEILING</text>
    </svg>
    <div class="metrics">
      <div><small>OPERATING POINT</small><strong>{{ point.performance }} TFLOPS</strong></div>
      <div><small>BOTTLENECK</small><strong :class="point.bottleneck">{{ point.bottleneck }}</strong></div>
      <div><small>UTILIZATION</small><strong>{{ point.utilization }}%</strong></div>
    </div>
    <div class="sliders">
      <label>Peak <input v-model.number="peak" type="range" min="128" max="768" step="16"><b>{{ peak }}</b></label>
      <label>BW <input v-model.number="bandwidth" type="range" min="0.8" max="8" step="0.2"><b>{{ bandwidth }}</b></label>
      <label>AI <input v-model.number="intensity" type="range" min="1" max="1024" step="1"><b>{{ intensity }}</b></label>
    </div>
  </section>
</template>

<style scoped>
.roofline{right:0;bottom:0;width:690px;border-radius:22px;padding:18px 22px}.roofline svg{width:100%;height:255px}.axis{fill:none;stroke:#8ba6bd;stroke-width:2}.roof{fill:none;stroke-width:5;filter:drop-shadow(0 0 8px currentColor)}.memory-roof{stroke:#b9ff33}.compute-roof{stroke:#ffbe00}.guide{stroke:#f5f8ff;stroke-dasharray:5 6;opacity:.45}.roofline circle{stroke:#fff;stroke-width:3;filter:drop-shadow(0 0 12px currentColor)}circle.bandwidth{fill:#f16bb5;color:#f16bb5}circle.compute{fill:#ffbe00;color:#ffbe00}text{fill:#8ba6bd;font-size:11px;font-weight:800;letter-spacing:.08em}.compute-label{fill:#ffbe00}.memory-label{fill:#b9ff33}.metrics{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:8px}.metrics div{background:#07142dcc;border:1px solid #ffffff18;border-radius:12px;padding:10px 12px}.metrics small{display:block;color:#8ba6bd;font-size:9px;letter-spacing:.12em}.metrics strong{display:block;margin-top:3px;font-size:18px}.metrics .bandwidth{color:#f16bb5}.metrics .compute{color:#ffbe00}.sliders{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:10px}.sliders label{display:grid;grid-template-columns:34px 1fr 42px;align-items:center;gap:7px;color:#adc3d8;font-size:11px}.sliders b{text-align:right;color:#17d9ff;font-variant-numeric:tabular-nums}
.roofline{box-sizing:border-box;width:560px;max-width:100%;padding:12px 16px;transform:none}
.roofline svg{height:170px}
.metrics strong{font-size:15px}
.sliders{margin-top:6px}
.sliders{grid-template-columns:repeat(3,minmax(0,1fr))}
.sliders label{grid-template-columns:30px minmax(0,1fr) 32px;min-width:0}
.sliders input{width:100%;min-width:0}
</style>
