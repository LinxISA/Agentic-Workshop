<script setup>
import { computed, ref } from 'vue'
import { AGC_PIPELINE_STEPS } from './agcModels.mjs'

const active = ref(1)
const current = computed(() => AGC_PIPELINE_STEPS[active.value])
const advance = () => { active.value = (active.value + 1) % AGC_PIPELINE_STEPS.length }
</script>

<template>
  <div class="agc-pipeline">
    <div class="agc-pipeline__rail">
      <button
        v-for="(step, index) in AGC_PIPELINE_STEPS"
        :key="step.id"
        :class="{ active: index === active, done: index < active }"
        @click="active = index"
      >
        <small>{{ step.phase }}</small><b>{{ step.label }}</b>
      </button>
    </div>
    <section class="agc-pipeline__focus">
      <div class="agc-pipeline__number">{{ String(active + 1).padStart(2, '0') }}</div>
      <div><p>{{ current.phase }}</p><h3>{{ current.label }}</h3><strong>{{ current.detail }}</strong></div>
      <button class="agc-pipeline__next" @click="advance">下一步 →</button>
    </section>
    <div class="agc-pipeline__targets"><span>C++ cycle model</span><span>SystemVerilog behavior</span><span>RTL</span></div>
  </div>
</template>

<style scoped>
.agc-pipeline{height:100%;display:flex;flex-direction:column;justify-content:center;gap:22px}.agc-pipeline__rail{display:grid;grid-template-columns:repeat(6,1fr);gap:8px}.agc-pipeline__rail button{min-height:66px;padding:9px 8px;border-radius:12px;text-align:left;background:rgba(2,10,25,.86);border:1px solid rgba(23,217,255,.25)}.agc-pipeline__rail button.done{border-color:rgba(185,255,51,.55);background:rgba(185,255,51,.08)}.agc-pipeline__rail button.active{border-color:#ffbe00;box-shadow:0 0 28px rgba(255,190,0,.22);transform:translateY(-3px)}.agc-pipeline__rail small{display:block;color:#8ba9c0;font-size:8px}.agc-pipeline__rail b{display:block;margin-top:5px;color:#f5f8ff;font-size:10px;line-height:1.18}.agc-pipeline__focus{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:20px;padding:22px 26px;border-radius:20px;border:1px solid rgba(255,190,0,.48);background:linear-gradient(100deg,rgba(8,42,72,.94),rgba(26,25,49,.94));box-shadow:0 24px 70px rgba(0,0,0,.42)}.agc-pipeline__number{color:#ffbe00;font:900 52px/1 ui-monospace,monospace}.agc-pipeline__focus p{margin:0;color:#62e7ff;font-size:10px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.agc-pipeline__focus h3{margin:4px 0 6px;color:#f5f8ff;font-size:23px}.agc-pipeline__focus strong{color:#adc3d8;font-size:13px;font-weight:600}.agc-pipeline__next{white-space:nowrap}.agc-pipeline__targets{display:flex;justify-content:center;gap:10px}.agc-pipeline__targets span{padding:8px 16px;border-radius:999px;border:1px solid rgba(23,217,255,.32);background:rgba(2,10,25,.72);color:#adc3d8;font:700 10px/1 ui-monospace,monospace}
.agc-pipeline__rail small{font-size:9px}
.agc-pipeline{gap:10px}.agc-pipeline__rail button{min-height:52px;padding:6px}.agc-pipeline__focus{gap:14px;padding:12px 18px}.agc-pipeline__number{font-size:42px;line-height:1.15}.agc-pipeline__focus h3{font-size:19px}.agc-pipeline__focus strong{font-size:11px}.agc-pipeline__targets span{padding:5px 12px}
.agc-pipeline__rail small,.agc-pipeline__rail b,.agc-pipeline__focus p,.agc-pipeline__focus strong,.agc-pipeline__targets span{font-size:12px}
</style>
