<script setup>
import { computed, ref } from 'vue'
import { bankDistribution } from './architectureModels.mjs'
const swizzled=ref(false),requests=ref(16),banks=ref(8)
const counts=computed(()=>bankDistribution({requests:requests.value,banks:banks.value,swizzled:swizzled.value}))
const max=computed(()=>Math.max(...counts.value))
</script>
<template><section class="banks arch-overlay"><header><span>BANK MAPPING</span><button @click="swizzled=!swizzled">{{swizzled?'Swizzled':'Naive stride'}}</button></header><div class="bars"><div v-for="(count,i) in counts" :key="i"><i :style="{height:`${18+count/max*120}px`}" :class="{hot:count===max&&max>2}"/><b>B{{i}}</b><small>{{count}} req</small></div></div><div class="verdict"><b>{{swizzled?'并行服务全部 bank':'热点 bank 串行化吞吐'}}</b><span>{{swizzled?'冲突消失，带宽可扩展':'同一地址位选择造成结构冲突'}}</span></div></section></template>
<style scoped>
.banks{right:0;bottom:0;width:620px;border-radius:22px;padding:18px 22px}.banks header{display:flex;justify-content:space-between;align-items:center;color:#17d9ff;font-size:12px;letter-spacing:.14em}.bars{height:175px;display:grid;grid-template-columns:repeat(8,1fr);align-items:end;gap:10px;margin:12px 0}.bars div{display:grid;justify-items:center;gap:5px}.bars i{display:block;width:34px;background:#b9ff33;border:1px solid #d8ff89;border-radius:6px 6px 2px 2px;box-shadow:0 0 14px #b9ff3366;transition:.3s}.bars i.hot{background:#f16bb5;border-color:#ffc4e5;box-shadow:0 0 18px #f16bb588}.bars b,.bars small{font-size:12px;color:#adc3d8}.verdict{display:flex;justify-content:space-between;background:#07142dcc;border-radius:10px;padding:11px 13px}.verdict b{color:#ffbe00}.verdict span{color:#adc3d8;font-size:12px}
.banks{transform:scale(.78);transform-origin:bottom right}
</style>
