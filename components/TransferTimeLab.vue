<script setup>
import { computed, reactive, ref } from 'vue'
import { calculateTransferTime } from './transferTimeModel.mjs'

const operation = ref('TLOAD')
const operations = ['TLOAD', 'TMOV', 'TEXTRACT', 'TPUSH/TPOP', 'TPUT/TGET']
const inputs = reactive({ dataBytes: 4096, tileCapacityBytes: 1024, sourceBandwidthBytesPerCycle: 64, linkBandwidthBytesPerCycle: 32, destinationBandwidthBytesPerCycle: 48, setupCycles: 4, queueCycles: 8, synchronizationCycles: 6 })
const result = computed(() => calculateTransferTime(inputs))
</script>

<template>
  <section class="transfer-lab arch-overlay" aria-label="数据搬运时间实验">
    <header><div><small>TRANSFER-TIME LAB</small><strong>{{ operation }}</strong></div><b aria-live="polite">{{ result.totalCycles }}<span>cycles total</span></b></header>
    <nav aria-label="选择数据搬运操作"><button v-for="item in operations" :key="item" :aria-pressed="operation === item" :class="{ active: operation === item }" @click="operation = item">{{ item }}</button></nav>
    <div class="equation"><span>chunks<b>{{ result.chunks }}</b></span><i>× setup +</i><span>bytes / min(BW)<b>{{ result.effectiveBandwidthBytesPerCycle }} B/cyc</b></span><i>+</i><span>queue + sync<b>{{ inputs.queueCycles + inputs.synchronizationCycles }}</b></span></div>
    <div class="controls">
      <label>Data B<input v-model.number="inputs.dataBytes" type="range" min="512" max="16384" step="512"><b>{{ inputs.dataBytes }}</b></label>
      <label>Tile B<input v-model.number="inputs.tileCapacityBytes" type="range" min="256" max="4096" step="256"><b>{{ inputs.tileCapacityBytes }}</b></label>
      <label>Link BW<input v-model.number="inputs.linkBandwidthBytesPerCycle" type="range" min="8" max="128" step="8"><b>{{ inputs.linkBandwidthBytesPerCycle }}</b></label>
      <label>Queue<input v-model.number="inputs.queueCycles" type="range" min="0" max="64"><b>{{ inputs.queueCycles }}</b></label>
    </div>
    <footer><span>intrinsic = {{ result.intrinsicCycles }}</span><em>TPUT/TGET: DaVinciOO communication extensions — not normative PTO-ASL · GM→UB→GM</em></footer>
  </section>
</template>

<style scoped>
.transfer-lab{left:44px;right:44px;bottom:36px;padding:16px 18px;border-radius:20px;box-sizing:border-box;background:linear-gradient(145deg,rgba(3,12,29,.94),rgba(6,26,58,.84))}.transfer-lab header{display:flex;justify-content:space-between;align-items:end}.transfer-lab header small{display:block;color:#8ba6bd;font-size:12px;letter-spacing:.15em}.transfer-lab header strong{color:#ffbe00;font-size:22px}.transfer-lab header>b{color:#17d9ff;font-size:28px}.transfer-lab header>b span{display:block;color:#8ba6bd;font-size:12px;text-align:right}.transfer-lab nav{display:flex;gap:6px;margin:8px 0}.transfer-lab button{padding:5px 10px;font-size:12px}.transfer-lab button.active{background:#17d9ff22;border-color:#17d9ff}.equation{display:grid;grid-template-columns:1fr auto 1.4fr auto 1fr;gap:8px;align-items:center}.equation span{padding:6px 8px;border-radius:8px;background:#ffffff0b;color:#adc3d8;font-size:12px}.equation span b{display:block;color:#f5f8ff;font-size:14px}.equation i{color:#ffbe00;font-style:normal;font-size:12px}.controls{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:9px}.controls label{display:grid;grid-template-columns:42px 1fr 42px;align-items:center;gap:4px;color:#8ba6bd;font-size:12px}.controls input{width:100%}.controls b{color:#17d9ff;text-align:right}.transfer-lab footer{display:flex;justify-content:space-between;margin-top:7px;color:#b9ff33;font-size:12px}.transfer-lab footer em{color:#f16bb5;font-style:normal}
</style>
