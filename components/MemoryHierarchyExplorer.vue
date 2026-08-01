<script setup>
import { computed, ref } from 'vue'
import { memoryHierarchy } from './architectureModels.mjs'
const l1 = ref(90), l2 = ref(80), dram = ref(220)
const model = computed(() => memoryHierarchy({ l1Hit:l1.value/100, l2Hit:l2.value/100, dramCycles:dram.value }))
const levels = computed(() => [
  {name:'L1',latency:4,share:l1.value,color:'#17d9ff'},
  {name:'L2',latency:14,share:(100-l1.value)*l2.value/100,color:'#ffbe00'},
  {name:'DRAM',latency:dram.value,share:model.value.dramFraction*100,color:'#b9ff33'},
])
</script>
<template>
  <section class="hierarchy arch-overlay">
    <div class="levels"><div v-for="level in levels" :key="level.name" class="level" :style="{'--c':level.color,'--w':`${Math.max(8,level.share)}%`}"><header><b>{{ level.name }}</b><span>{{ level.latency }} cycles</span></header><i/><small>{{ level.share.toFixed(1) }}% accesses</small></div></div>
    <div class="readout"><div><small>AVERAGE</small><b>{{ model.averageCycles }} cycles</b></div><div><small>OFF-CHIP</small><b>{{ (model.dramFraction*100).toFixed(1) }}%</b></div><div><small>REUSE</small><b>{{ model.reuse }}×</b></div></div>
    <label>L1 hit <input v-model.number="l1" type="range" min="50" max="99"><b>{{ l1 }}%</b></label>
    <label>L2 hit <input v-model.number="l2" type="range" min="20" max="98"><b>{{ l2 }}%</b></label>
  </section>
</template>
<style scoped>
.hierarchy{right:0;bottom:0;width:650px;padding:22px;border-radius:22px}.levels{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.level{padding:14px;background:#06142ddd;border:1px solid color-mix(in srgb,var(--c) 45%,transparent);border-radius:14px}.level header{display:flex;justify-content:space-between}.level header b{color:var(--c);font-size:18px}.level header span,.level small{color:#adc3d8;font-size:10px}.level i{display:block;height:8px;width:var(--w);max-width:100%;margin:18px 0 8px;background:var(--c);box-shadow:0 0 16px var(--c)}.readout{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:12px 0}.readout div{background:#ffffff0c;border-radius:10px;padding:10px}.readout small{display:block;color:#8ba6bd;font-size:9px;letter-spacing:.12em}.readout b{font-size:17px;color:#f5f8ff}.hierarchy>label{display:grid;grid-template-columns:55px 1fr 42px;gap:8px;align-items:center;color:#adc3d8;font-size:11px;margin-top:8px}.hierarchy>label b{color:#17d9ff;text-align:right}
.hierarchy{transform:scale(.72);transform-origin:bottom right}
</style>
