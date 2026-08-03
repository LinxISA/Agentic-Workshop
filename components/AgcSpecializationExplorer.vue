<script setup>
import { computed, ref } from 'vue'
import { specializationKey, specializationKeyInput } from './agcModels.mjs'

const cores = ref(4)
const enableDma = ref(true)
const frequency = ref(1800)
const config = computed(() => ({
  templateName: 'agc.ComputeCluster',
  sourceHash: 'sha256:91ec…',
  staticParams: { cores: cores.value, enable_dma: enableDma.value, banks: 16, queue_depth: 8 },
  runtimeParams: { frequency_mhz: frequency.value, trace_enable: false },
  dependencyHashes: ['Crossbar:75ad…', 'Storage:0f41…'],
  dialectVersion: 'agc-0.1',
  runtimeAbi: 'simqueue-1',
}))
const key = computed(() => specializationKey(config.value))
const keyInput = computed(() => specializationKeyInput(config.value))
</script>

<template>
  <div class="agc-spec">
    <section class="agc-spec__controls">
      <h3>Static：改变架构形态</h3>
      <label>Core 数量 <b>{{ cores }}</b><input v-model.number="cores" type="range" min="2" max="8" step="2" /></label>
      <label class="agc-switch"><input v-model="enableDma" type="checkbox" /> enable_dma</label>
      <dl><div><dt>banks</dt><dd>16</dd></div><div><dt>queue_depth</dt><dd>8</dd></div></dl>
      <h3 class="runtime">Runtime：只改变仿真配置</h3>
      <label>frequency <b>{{ frequency }} MHz</b><input v-model.number="frequency" type="range" min="1200" max="2400" step="100" /></label>
    </section>
    <section class="agc-spec__key">
      <p>Specialization Key</p>
      <strong>ComputeCluster__sp_{{ key }}</strong>
      <div class="agc-key-inputs">
        <span><b>template</b>{{ keyInput.template }}</span>
        <span><b>source hash</b>{{ keyInput.source_hash }}</span>
        <span><b>Static</b>{{ cores }} cores · DMA {{ enableDma ? 'on' : 'off' }}</span>
        <span><b>dependency hashes</b>2 modules</span>
        <span><b>AGC version</b>{{ keyInput.agc_version }}</span>
        <span><b>runtime ABI</b>{{ keyInput.runtime_abi }}</span>
      </div>
      <div class="agc-runtime-note">frequency={{ frequency }} MHz 不进入 Key：扫频不会触发新的 C++ 编译。</div>
    </section>
  </div>
</template>

<style scoped>
.agc-spec{height:100%;display:grid;grid-template-columns:34% 1fr;gap:24px}.agc-spec section{border:1px solid rgba(23,217,255,.4);border-radius:22px;background:rgba(2,10,25,.88);box-shadow:0 24px 70px rgba(0,0,0,.4)}.agc-spec__controls{padding:22px}.agc-spec h3{margin:0 0 14px;color:#ffbe00;font-size:18px}.agc-spec h3.runtime{margin-top:24px;color:#b9ff33}.agc-spec label{display:grid;grid-template-columns:1fr auto;gap:8px;margin:11px 0;color:#d8e8f5;font-size:13px}.agc-spec label input[type=range]{grid-column:1/3;width:100%}.agc-switch{display:flex!important;align-items:center;gap:8px!important}.agc-spec dl{display:flex;gap:8px;margin:12px 0}.agc-spec dl div{flex:1;padding:10px;border-radius:10px;background:#0a2948}.agc-spec dt{color:#8ba9c0;font-size:10px}.agc-spec dd{margin:3px 0 0;color:#62e7ff;font-weight:800}.agc-spec__key{padding:28px 30px;display:flex;flex-direction:column;justify-content:center}.agc-spec__key>p{margin:0;color:#adc3d8;font:750 12px/1 ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase}.agc-spec__key>strong{margin:10px 0 20px;color:#62e7ff;font:900 27px/1 ui-monospace,monospace;text-shadow:0 0 28px rgba(23,217,255,.3)}.agc-key-inputs{display:grid;grid-template-columns:repeat(2,1fr);gap:9px}.agc-key-inputs span{padding:11px 13px;border-left:3px solid #17d9ff;border-radius:8px;background:rgba(8,40,70,.82);color:#f5f8ff;font:650 11px/1.2 ui-monospace,monospace}.agc-key-inputs b{display:block;margin-bottom:5px;color:#8ba9c0;font:700 9px/1 ui-sans-serif}.agc-runtime-note{margin-top:16px;padding:12px 15px;border-radius:10px;background:rgba(185,255,51,.1);border:1px solid rgba(185,255,51,.36);color:#dfffb0;font-size:12px}
/* Keep both parameter classes visible inside Slidev's 300px diagram region. */
.agc-spec__controls{padding:14px}.agc-spec h3{margin-bottom:6px;font-size:14px}.agc-spec h3.runtime{margin-top:10px}.agc-spec label{gap:4px;margin:5px 0;font-size:10px}.agc-switch{gap:6px!important}.agc-spec dl{gap:6px;margin:6px 0}.agc-spec dl div{padding:6px 8px;border-radius:8px}.agc-spec dt{font-size:9px}.agc-spec dd{margin-top:2px;font-size:11px}.agc-spec__key{padding:18px 20px}.agc-spec__key>p{font-size:9px}.agc-spec__key>strong{margin:7px 0 12px;font-size:20px}.agc-key-inputs{gap:6px}.agc-key-inputs span{padding:7px 9px;font-size:9px;line-height:1.15}.agc-key-inputs b{margin-bottom:3px;font-size:9px}.agc-runtime-note{margin-top:9px;padding:7px 10px;border-radius:8px;font-size:9px}
.agc-spec h3,.agc-spec label,.agc-spec dt,.agc-spec dd,.agc-spec__key>p,.agc-key-inputs span,.agc-key-inputs b,.agc-runtime-note{font-size:12px}
</style>
