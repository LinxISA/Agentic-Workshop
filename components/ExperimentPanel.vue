<script setup>
import { computed, ref } from 'vue'
import { sweepBandwidth } from './architectureModels.mjs'
const variants=[{id:'baseline',label:'Baseline',bw:2,cache:64,queue:12},{id:'bandwidth',label:'2× BW',bw:4,cache:64,queue:12},{id:'locality',label:'2× Cache',bw:2,cache:128,queue:12},{id:'balanced',label:'Balanced',bw:3.4,cache:128,queue:20}]
const selected=ref(0)
const v=computed(()=>variants[selected.value])
const performance=computed(()=>sweepBandwidth({peak:100,intensity:v.value.cache/16,values:[v.value.bw]})[0])
const traffic=computed(()=>Math.round(100*64/v.value.cache))
const queuePressure=computed(()=>Math.round(100*12/v.value.queue))
</script>
<template><section class="experiment arch-overlay"><nav><button v-for="(item,i) in variants" :key="item.id" :class="{active:i===selected}" @click="selected=i">{{item.label}}</button></nav><div class="bars"><div><span>PERF</span><i :style="{width:`${performance}%`}"/><b>{{performance}}</b></div><div><span>TRAFFIC</span><i class="memory" :style="{width:`${traffic}%`}"/><b>{{traffic}}</b></div><div><span>QUEUE</span><i class="pressure" :style="{width:`${queuePressure}%`}"/><b>{{queuePressure}}</b></div></div><footer><b>{{v.label}}</b><span>BW {{v.bw}} TB/s · Cache {{v.cache}} MB · Queue {{v.queue}}</span></footer></section></template>
<style scoped>
.experiment{right:0;bottom:0;width:650px;border-radius:22px;padding:18px 22px}.experiment nav{display:flex;gap:7px}.experiment nav button{font-size:12px;padding:6px 12px}.experiment nav button.active{background:#17d9ff;color:#031020}.bars{display:grid;gap:13px;margin:18px 0}.bars div{display:grid;grid-template-columns:62px 1fr 40px;align-items:center;gap:9px}.bars span,.bars b{font-size:12px;color:#adc3d8}.bars div:after{content:'';grid-column:2;grid-row:1;height:12px;background:#ffffff0c;border-radius:9px;z-index:-1}.bars i{display:block;grid-column:2;grid-row:1;height:12px;background:#ffbe00;border-radius:9px;box-shadow:0 0 13px #ffbe0066;transition:.35s}.bars i.memory{background:#b9ff33}.bars i.pressure{background:#f16bb5}.bars b{text-align:right;color:#f5f8ff}footer{display:flex;justify-content:space-between;padding-top:11px;border-top:1px solid #ffffff18}footer b{color:#17d9ff}footer span{color:#adc3d8;font-size:12px}
.experiment nav button.active{background:#087d99;color:#fff}
</style>
