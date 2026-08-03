<script setup>
import { ref } from 'vue'
import { shouldHandleRootKey } from './session2Models.mjs'
const focus=ref(0)
const rows=['opcode coverage','dependency / retirement order','resource-pressure trends','errors','performance envelope']
function move(delta){focus.value=(focus.value+delta+rows.length)%rows.length}
function onKey(event){if(shouldHandleRootKey(event,['ArrowDown'])){event.preventDefault();move(1)}else if(shouldHandleRootKey(event,['ArrowUp'])){event.preventDefault();move(-1)}}
</script>
<template><section class="closed arch-overlay" tabindex="0" aria-label="Proposed closed-loop acceptance design" @keydown="onKey"><header><b>PROPOSED ACCEPTANCE DESIGN</b><span>no pyCircuit result loaded</span></header><div class="fork"><strong>checked gfsim artifact</strong><i>⇐ same trace ⇒</i><strong>pyCircuit replay target</strong></div><div class="checks"><button v-for="(row,index) in rows" :key="row" :aria-pressed="focus===index" @click="focus=index"><span>{{row}}</span><b>acceptance criterion</b></button></div><footer><span>implementation target · not an existing harness claim</span><b>absolute cycles blocked until calibration</b></footer></section></template>
<style scoped>.closed{right:0;bottom:-18px;width:760px;padding:17px;border-radius:20px;transform:scale(.94);transform-origin:bottom right}.closed header,.closed footer,.fork{display:flex;align-items:center;justify-content:space-between;color:#9fb7ca;font-size:12px}.closed header b{color:#17d9ff}.fork{justify-content:center;gap:20px;margin:14px}.fork strong{padding:12px 28px;border:1px solid #17d9ff55;border-radius:10px;color:#f5f8ff}.fork i{color:#ffbe00;font-style:normal}.checks{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.checks button{padding:8px;border-radius:8px;font-size:12px}.checks button[aria-pressed=true]{border-color:#ffbe00}.checks span,.checks b{display:block}.checks b{margin-top:4px;color:#b9ff33}.closed footer{margin-top:13px}.closed footer>b{color:#f16bb5}</style>
