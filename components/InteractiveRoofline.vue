<script setup>
import { computed, ref } from 'vue'
import { rooflineGeometry } from './architectureModels.mjs'

const peak = ref(432)
const bandwidth = ref(3.2)
const intensity = ref(64)
const cacheHit = ref(0.75)
const point = computed(() => rooflineGeometry({ peak: peak.value, bandwidth: bandwidth.value, intensity: intensity.value, cacheHit: cacheHit.value }))
</script>

<template>
  <section class="roofline arch-overlay">
    <svg viewBox="0 0 600 300" role="img" aria-label="Interactive roofline model">
      <path class="axis" d="M55 25V255H565" />
      <path class="roof memory-roof" :d="point.memoryPath" />
      <path class="roof compute-roof" :d="point.computePath" />
      <line :x1="point.pointX" :x2="point.pointX" :y1="point.pointY" y2="255" class="guide" />
      <circle :cx="point.pointX" :cy="point.pointY" r="11" :class="point.bottleneck" />
      <text x="65" y="42">PERFORMANCE</text><text x="430" y="281">ARITHMETIC INTENSITY</text>
      <text x="402" y="42" class="compute-label">COMPUTE CEILING</text>
      <text x="150" y="176" class="memory-label">EFFECTIVE BANDWIDTH CEILING</text>
    </svg>
    <div class="metrics">
      <div><small>OPERATING POINT</small><strong>{{ point.performance }} TFLOPS</strong></div>
      <div><small>BOTTLENECK</small><strong :class="point.bottleneck">{{ point.bottleneck }}</strong></div>
      <div><small>EFFECTIVE BW</small><strong>{{ point.effectiveBandwidth }} TB/s</strong></div>
    </div>
    <div class="sliders">
      <label>Peak <input v-model.number="peak" type="range" min="128" max="768" step="16"><b>{{ peak }}</b></label>
      <label>BW <input v-model.number="bandwidth" type="range" min="0.8" max="8" step="0.2"><b>{{ bandwidth }}</b></label>
      <label>AI <input v-model.number="intensity" type="range" min="1" max="1024" step="1"><b>{{ intensity }}</b></label>
      <label>Hit <input v-model.number="cacheHit" type="range" min="0" max="0.95" step="0.05"><b>{{ Math.round(cacheHit*100) }}%</b></label>
    </div>
  </section>
</template>

<style scoped>
.roofline{right:0;bottom:0;width:560px;max-width:100%;box-sizing:border-box;border-radius:22px;padding:12px 16px;transform:none}.roofline svg{width:100%;height:170px}.axis{fill:none;stroke:#8ba6bd;stroke-width:2}.roof{fill:none;stroke-width:5;filter:drop-shadow(0 0 8px currentColor)}.memory-roof{stroke:#b9ff33}.compute-roof{stroke:#ffbe00}.guide{stroke:#f5f8ff;stroke-dasharray:5 6;opacity:.45}.roofline circle{stroke:#fff;stroke-width:3;filter:drop-shadow(0 0 12px currentColor)}circle.bandwidth{fill:#f16bb5;color:#f16bb5}circle.compute{fill:#ffbe00;color:#ffbe00}text{fill:#8ba6bd;font-size:11px;font-weight:800;letter-spacing:.08em}.compute-label{fill:#ffbe00}.memory-label{fill:#b9ff33}.metrics{display:grid;grid-template-columns:1.2fr 1fr 1fr;gap:8px}.metrics div{background:#07142dcc;border:1px solid #ffffff18;border-radius:12px;padding:8px 10px}.metrics small{display:block;color:#8ba6bd;font-size:10px;letter-spacing:.1em}.metrics strong{display:block;margin-top:3px;font-size:14px}.metrics .bandwidth{color:#f16bb5}.metrics .compute{color:#ffbe00}.sliders{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin-top:6px}.sliders label{display:grid;grid-template-columns:27px minmax(0,1fr) 36px;align-items:center;gap:4px;min-width:0;color:#adc3d8;font-size:10px}.sliders input{width:100%;min-width:0}.sliders b{text-align:right;color:#17d9ff;font-variant-numeric:tabular-nums}
</style>
