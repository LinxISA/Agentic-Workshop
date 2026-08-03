<script setup>
import { computed, ref } from 'vue'
import { queueState } from './architectureModels.mjs'
const arrivals=ref(6),service=ref(4),depth=ref(16)
const state=computed(()=>queueState({arrivals:arrivals.value,service:service.value,depth:depth.value,cycles:4}))
</script>
<template><section class="queue arch-overlay" :class="{stalled:state.stalled}"><header><span>QUEUE PRESSURE</span><b>{{ state.stalled?'BACKPRESSURE':'FLOWING' }}</b></header><div class="slots"><i v-for="n in depth" :key="n" :class="{filled:n<=state.occupancy}"/></div><div class="stats"><div><small>OCCUPANCY</small><b>{{state.occupancy}} / {{depth}}</b></div><div><small>PRESSURE</small><b>{{state.pressure}}%</b></div><div><small>HEADROOM</small><b>{{state.headroom}}</b></div></div><label>arrival <input v-model.number="arrivals" type="range" min="1" max="10"><b>{{arrivals}}/c</b></label><label>service <input v-model.number="service" type="range" min="1" max="10"><b>{{service}}/c</b></label></section></template>
<style scoped>
.queue{right:0;bottom:0;width:610px;border-radius:22px;padding:20px}.queue header{display:flex;justify-content:space-between;color:#17d9ff;font-size:12px;letter-spacing:.14em}.queue header b{color:#b9ff33}.queue.stalled{border-color:#f16bb5}.queue.stalled header b{color:#f16bb5}.slots{display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin:18px 0}.slots i{height:28px;border:1px solid #52657d;border-radius:5px;background:#07142d}.slots i.filled{background:#ffbe00;border-color:#ffdf70;box-shadow:0 0 12px #ffbe0077}.stalled .slots i.filled{background:#f16bb5}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.stats div{padding:9px;background:#ffffff0c;border-radius:9px}.stats small{display:block;color:#8ba6bd;font-size:12px}.stats b{font-size:17px}.queue label{display:grid;grid-template-columns:48px 1fr 42px;align-items:center;gap:8px;margin-top:9px;color:#adc3d8;font-size:12px}.queue label>b{color:#17d9ff;text-align:right}
.queue{transform:scale(.78);transform-origin:bottom right}
</style>
