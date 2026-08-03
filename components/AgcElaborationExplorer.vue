<script setup>
import { computed, ref } from 'vue'
import { elaborateNpuCity } from './agcModels.mjs'

const clusters = ref(4)
const enableDma = ref(true)
const graph = computed(() => elaborateNpuCity({ clusters: clusters.value, coresPerCluster: 4, enableDma: enableDma.value }))
</script>

<template>
  <div class="agc-elab">
    <section class="agc-elab__code">
      <div class="agc-terminal-bar"><span /><span /><span /><b>npu_city.py</b></div>
      <pre><code><em>@system</em>
def NPUCity(m, cfg):
  scheduler = m.scheduler(<q>scheduler</q>)
  l2 = m.storage(<q>shared_l2</q>)
  clusters = [
    m.new(ComputeCluster, name=f<q>cluster_{i}</q>)
    for i in range(cfg.clusters)
  ]
  m.bus(<q>cluster_bus</q>, clusters, l2)
  <strong>if cfg.enable_dma:</strong> m.dma(<q>dma0</q>)</code></pre>
      <div class="agc-elab__controls">
        <label>Static clusters <b>{{ clusters }}</b><input v-model.number="clusters" type="range" min="1" max="6" /></label>
        <label class="agc-switch"><input v-model="enableDma" type="checkbox" /> Static enable_dma</label>
      </div>
    </section>

    <section class="agc-elab__graph">
      <div class="agc-node scheduler">Scheduler</div>
      <div class="agc-control-line">priority control</div>
      <div class="agc-clusters" :style="{ '--columns': Math.min(clusters, 6) }">
        <article v-for="cluster in graph.clusters" :key="cluster.name" class="agc-cluster">
          <header>{{ cluster.name }}</header>
          <div class="agc-cores"><span v-for="core in cluster.cores" :key="core">{{ core }}</span></div>
          <footer>Cluster__sp_c4</footer>
        </article>
      </div>
      <div class="agc-bus">cluster_bus · round_robin</div>
      <div class="agc-memory">shared_l2</div>
      <div v-if="graph.dma" class="agc-node dma">dma0</div>
      <div class="agc-elab__result">Python 已执行：<b>{{ graph.modules.length }}</b> 个静态模块；运行时仍然并发。</div>
    </section>
  </div>
</template>

<style scoped>
.agc-elab{height:100%;display:grid;grid-template-columns:38% 1fr;gap:22px}.agc-elab__code,.agc-elab__graph{border:1px solid rgba(23,217,255,.38);border-radius:22px;background:rgba(2,10,25,.88);box-shadow:0 24px 70px rgba(0,0,0,.42);overflow:hidden}.agc-terminal-bar{height:34px;display:flex;align-items:center;gap:7px;padding:0 15px;background:#0c2442;border-bottom:1px solid rgba(23,217,255,.25)}.agc-terminal-bar span{width:8px;height:8px;border-radius:50%;background:#ffbe00}.agc-terminal-bar span:nth-child(2){background:#f16bb5}.agc-terminal-bar span:nth-child(3){background:#b9ff33}.agc-terminal-bar b{margin-left:auto;color:#adc3d8;font:600 11px/1 ui-monospace,monospace}.agc-elab pre{margin:0;padding:18px 22px 8px;color:#d9e9f8;font:600 13px/1.42 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap}.agc-elab code em{color:#f16bb5;font-style:normal}.agc-elab code q{color:#b9ff33}.agc-elab code strong{color:#ffbe00}.agc-elab__controls{display:grid;gap:10px;padding:12px 22px 18px;color:#adc3d8;font-size:12px}.agc-elab__controls label:first-child{display:grid;grid-template-columns:1fr auto;gap:6px}.agc-elab__controls input[type=range]{grid-column:1/3;width:100%}.agc-switch{display:flex;align-items:center;gap:8px}.agc-elab__graph{position:relative;padding:18px 20px 44px;display:flex;flex-direction:column;align-items:center;gap:9px}.agc-node,.agc-memory,.agc-bus,.agc-control-line{border-radius:10px;border:1px solid rgba(23,217,255,.4);background:#0b3151;color:#f5f8ff;font:750 12px/1.1 ui-sans-serif;padding:8px 15px}.scheduler{border-color:#ffbe00;color:#ffdf7a}.agc-control-line{width:78%;padding:4px;text-align:center;color:#f16bb5;border-color:rgba(241,107,181,.46);background:rgba(241,107,181,.12)}.agc-clusters{width:100%;display:grid;grid-template-columns:repeat(var(--columns),1fr);gap:8px}.agc-cluster{min-width:0;border:1px solid rgba(23,217,255,.35);border-radius:14px;background:linear-gradient(180deg,rgba(15,65,93,.94),rgba(4,24,49,.94));overflow:hidden}.agc-cluster header{padding:6px 8px;background:rgba(23,217,255,.12);color:#62e7ff;font-size:11px;font-weight:800}.agc-cores{display:grid;grid-template-columns:repeat(2,1fr);gap:5px;padding:7px}.agc-cores span{border-radius:6px;background:#d89016;color:#08101b;padding:5px 4px;text-align:center;font-size:9px;font-weight:900}.agc-cluster footer{padding:0 7px 7px;color:#8ba9c0;font:600 8px/1 ui-monospace,monospace}.agc-bus{width:88%;text-align:center;background:#8f2f5f;border-color:#f16bb5}.agc-memory{width:56%;text-align:center;background:#0b5362;border-color:#b9ff33;color:#dfffb0}.dma{position:absolute;right:24px;bottom:48px;border-color:#ffbe00;background:#5a3711}.agc-elab__result{position:absolute;left:20px;right:20px;bottom:12px;color:#adc3d8;font-size:11px}.agc-elab__result b{color:#b9ff33}
/* The deck reserves 300 logical pixels for this interactive diagram. */
.agc-elab pre{padding:12px 18px 6px;font-size:11.5px;line-height:1.28}.agc-elab__controls{gap:6px;padding:7px 18px 10px;font-size:10px}.agc-elab__controls label:first-child{gap:4px}.agc-elab__graph{padding:12px 14px 34px;gap:6px}.agc-node,.agc-memory,.agc-bus,.agc-control-line{padding:6px 11px;font-size:10px}.agc-control-line{padding:3px}.agc-clusters{gap:5px}.agc-cluster{border-radius:11px}.agc-cluster header{padding:4px 5px;font-size:9px}.agc-cores{gap:3px;padding:4px}.agc-cores span{padding:4px 2px;font-size:9px}.agc-cluster footer{padding:0 4px 4px;font-size:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dma{right:18px;bottom:36px}.agc-elab__result{left:14px;right:14px;bottom:9px;font-size:9px}
.agc-terminal-bar b,.agc-elab pre,.agc-elab__controls,.agc-node,.agc-memory,.agc-bus,.agc-control-line,.agc-cluster header,.agc-cores span,.agc-cluster footer,.agc-elab__result{font-size:12px}
</style>
