<script setup>
import { computed, ref } from 'vue'
import { ptoMachineOperations as operations } from './ptoMachineModel.mjs'

const selected = ref(0)
const current = computed(() => operations[selected.value])
</script>

<template>
  <section class="pto-machine arch-overlay" aria-label="PTO 抽象执行机器操作选择器">
    <nav aria-label="选择 PTO 操作">
      <button v-for="(item, index) in operations" :key="item.op" :aria-pressed="selected === index" :class="{ active: selected === index, extension: !item.normative }" @click="selected = index">{{ item.op }}</button>
    </nav>
    <div class="route" aria-live="polite">
      <strong>{{ current.op }}</strong>
      <span><small>SEMANTIC EFFECT</small>{{ current.semanticEffect }}</span>
      <i aria-hidden="true">≠</i>
      <span><small>DAVINCI GFSIM ROUTING</small><b>{{ current.gfsimEngine }}</b></span>
    </div>
    <p>{{ current.detail }}</p>
    <footer><span>Normative PTO-ASL: TLOAD · TMOV · TEXTRACT · TPUSH · TPOP</span><em>DaVinciOO communication extensions — not normative PTO-ASL: TPUT · TGET · GM→UB→GM</em></footer>
  </section>
</template>

<style scoped>
.pto-machine{left:24px;right:24px;bottom:22px;padding:13px 16px;border-radius:17px;box-sizing:border-box}.pto-machine nav{display:flex;gap:6px}.pto-machine button{padding:5px 11px;font-size:12px}.pto-machine button.active{border-color:#17d9ff;background:#17d9ff22;box-shadow:0 0 15px #17d9ff22}.pto-machine button.extension{border-color:#f16bb566}.route{display:grid;grid-template-columns:70px 1fr 20px 1fr;align-items:center;gap:9px;margin-top:10px}.route strong{color:#ffbe00;font-size:20px}.route i{font-style:normal;color:#17d9ff;text-align:center}.route span{display:grid;color:#f5f8ff;font:600  12px SFMono-Regular,Menlo,monospace}.route small{color:#8ba6bd;font:800  12px sans-serif;letter-spacing:.12em}.route b{color:#b9ff33}.pto-machine>p{margin:4px 0;color:#adc3d8;font-size:12px}.pto-machine footer{display:flex;justify-content:space-between;gap:12px;padding-top:7px;border-top:1px solid #ffffff12;font-size:12px}.pto-machine footer span{color:#b9ff33}.pto-machine footer em{color:#f16bb5;font-style:normal;text-align:right}
</style>
