<script setup>
import { computed, onMounted, ref } from 'vue'
import { inspectTraceRecord, parseTraceJsonl, readArtifactResponse, routeOpcode, shouldHandleRootKey } from './session2Models.mjs'

const fallback = [
  { sequence_id: 'sample-1', opcode: 'TLOAD', engine: 'TMA', input_tile_count: 1, output_tile_count: 1 },
]
const records = ref(fallback), selected = ref(0), artifactState = ref('teaching sample')
const detail = computed(() => inspectTraceRecord(records.value[selected.value]))
const displayedDetail = computed(() => Object.fromEntries([
  'blockIndex', 'sequenceId', 'opcode', 'engine',
  'inputTileRefs', 'outputTileRefs', 'scalarInputs', 'dependencyNote',
].map(key => [key, detail.value[key]])))
function move(delta) { selected.value = (selected.value + delta + records.value.length) % records.value.length }
function onKey(event) {
  if (shouldHandleRootKey(event, ['ArrowRight', 'ArrowDown', ' '])) { event.preventDefault(); move(1) }
  else if (shouldHandleRootKey(event, ['ArrowLeft', 'ArrowUp'])) { event.preventDefault(); move(-1) }
}
onMounted(async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}experiments/artifacts/11/qproj_trace_sample.jsonl`)
    const text = await readArtifactResponse(response, value => value.text())
    records.value = parseTraceJsonl(text)
    artifactState.value = 'checked artifact'
  } catch { records.value = fallback; artifactState.value = 'artifact unavailable · teaching sample' }
})
</script>
<template>
  <section class="trace arch-overlay" tabindex="0" aria-label="Trace record explorer" @keydown="onKey">
    <header><b>.pto.trace JSONL · {{ artifactState }}</b><span>record {{ selected + 1 }} / {{ records.length }}</span></header>
    <div class="records">
      <button v-for="(record,index) in records" :key="record.sequence_id" :aria-pressed="selected===index" @click="selected=index"><small>#{{ record.sequence_id }}</small><b>{{ record.opcode }}</b><i>{{ routeOpcode(record.opcode) }}</i></button>
    </div>
    <dl><template v-for="(value,key) in displayedDetail" :key="key"><dt>{{ key }}</dt><dd>{{ value }}</dd></template></dl>
    <footer>←/→ 选择记录 · deps 由 rename / scoreboard 推导，不是 JSONL 字段</footer>
  </section>
</template>
<style scoped>
.trace{right:0;bottom:0;width:720px;padding:16px;border-radius:20px;transform:scale(.78);transform-origin:bottom right}.trace header,.trace footer{display:flex;justify-content:space-between;color:#9fb7ca;font-size:12px}.trace header b{color:#17d9ff}.records{display:flex;gap:7px;margin:12px 0;overflow:hidden}.records button{display:grid;gap:2px;min-width:96px;padding:8px;border-radius:9px;text-align:left}.records button[aria-pressed=true]{border-color:#ffbe00;background:#ffbe001c}.records small,.records i{color:#8faabe;font-size:12px;font-style:normal}.records b{font-size:12px}dl{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin:0 0 10px;overflow:visible}dl>*{margin:0;padding:7px;background:#ffffff0a;border-radius:6px}dt{color:#7f9ab1;font-size:12px}dd{color:#f5f8ff;font:700  12px/1.2 monospace;overflow-wrap:anywhere}
.trace{bottom:-28px}
</style>
