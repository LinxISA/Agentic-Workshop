<script setup>
import { computed, ref, watch } from 'vue'
import { convertTimeDraft, convertTimeToCycles } from './clockCycleModel.mjs'

const duration = ref(4)
const durationUnit = ref('ns')
const frequency = ref(2)
const frequencyUnit = ref('GHz')
const result = ref(convertTimeToCycles({ duration: duration.value, durationUnit: durationUnit.value, frequency: frequency.value, frequencyUnit: frequencyUnit.value }))
watch([duration, durationUnit, frequency, frequencyUnit], () => {
  result.value = convertTimeDraft({ duration: duration.value, durationUnit: durationUnit.value, frequency: frequency.value, frequencyUnit: frequencyUnit.value }, result.value)
})
const formattedCycles = computed(() => result.value.cycles >= 1e9 ? result.value.cycles.toExponential(3) : result.value.cycles.toLocaleString('en-US', { maximumFractionDigits: 3 }))
</script>

<template>
  <section class="clock-converter arch-overlay" aria-label="时间与时钟周期换算器">
    <header><small>TIME → CYCLES</small><b aria-live="polite">{{ formattedCycles }} cycles</b></header>
    <div class="formula">cycles = time × frequency</div>
    <div class="fields">
      <label>时间<input v-model.number="duration" type="number" min="0.001" step="0.5"><select v-model="durationUnit"><option>ps</option><option>ns</option><option>us</option><option>ms</option><option>s</option><option>day</option></select></label>
      <span>×</span>
      <label>频率<input v-model.number="frequency" type="number" min="0.1" step="0.1"><select v-model="frequencyUnit"><option>MHz</option><option>GHz</option></select></label>
    </div>
  </section>
</template>

<style scoped>
.clock-converter{right:34px;bottom:34px;width:420px;padding:16px 18px;border-radius:18px;box-sizing:border-box}.clock-converter header{display:flex;justify-content:space-between;align-items:end}.clock-converter small{color:#8ba6bd;letter-spacing:.15em;font-size:12px}.clock-converter header b{color:#17d9ff;font-size:20px;font-variant-numeric:tabular-nums}.formula{margin:8px 0 11px;padding:6px 10px;border-radius:8px;background:#ffffff0a;color:#ffbe00;font:600 12px SFMono-Regular,Menlo,monospace}.fields{display:grid;grid-template-columns:1fr 18px 1fr;align-items:end;gap:7px}.fields>span{padding-bottom:8px;color:#f5f8ff;text-align:center}.fields label{display:grid;grid-template-columns:1fr 65px;gap:5px;color:#adc3d8;font-size:12px}.fields input{grid-column:1/2;width:100%;box-sizing:border-box}.fields select{grid-column:2/3}.fields input,.fields select{height:30px;border:1px solid #17d9ff55;border-radius:7px;background:#030c1ddd;color:#f5f8ff;padding:4px 7px}
</style>
