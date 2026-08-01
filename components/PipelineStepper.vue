<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'

type Stage = { title: string; subtitle?: string; detail?: string }
const props = withDefaults(defineProps<{ stages?: Stage[]; autoplayMs?: number }>(), {
  stages: () => [
    { title: 'PyCircuit', subtitle: 'Python DSL', detail: 'Describe modules and queue connections.' },
    { title: 'MLIR', subtitle: 'Circuit IR', detail: 'Canonicalize structure and infer interfaces.' },
    { title: 'RTL', subtitle: 'SystemVerilog', detail: 'Lower scheduling and storage into hardware.' },
    { title: 'Silicon', subtitle: 'PPA feedback', detail: 'Measure timing, power, and area.' },
  ],
  autoplayMs: 1300,
})

const active = ref(0)
const playing = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
const progress = computed(() => props.stages.length < 2 ? 0 : active.value / (props.stages.length - 1) * 100)

function step() { active.value = (active.value + 1) % props.stages.length }
function stop() { playing.value = false; if (timer) clearInterval(timer); timer = undefined }
function play() { if (playing.value) return; playing.value = true; timer = setInterval(step, props.autoplayMs) }
function reset() { stop(); active.value = 0 }
watch(() => props.stages.length, () => { active.value = 0 })
onBeforeUnmount(stop)
</script>

<template>
  <section class="pipeline-shell">
    <div class="eyebrow">COMPILATION PIPELINE <span>{{ active + 1 }} / {{ stages.length }}</span></div>
    <div class="track">
      <div class="track-fill" :style="{ width: `${progress}%` }" />
      <button v-for="(stage, i) in stages" :key="stage.title" class="stage" :class="{ active: i === active, done: i < active }" @click="active = i">
        <span class="dot">{{ i < active ? '✓' : i + 1 }}</span>
        <strong>{{ stage.title }}</strong><small>{{ stage.subtitle }}</small>
      </button>
    </div>
    <div class="detail"><span>0{{ active + 1 }}</span><div><h3>{{ stages[active]?.title }}</h3><p>{{ stages[active]?.detail }}</p></div></div>
    <div class="controls"><button @click="step">Step</button><button :class="{ hot: playing }" @click="playing ? stop() : play()">{{ playing ? 'Pause' : 'Play' }}</button><button @click="reset">Reset</button></div>
  </section>
</template>

<style scoped>
.pipeline-shell{--c:#55e6d6;--muted:#8b9bb5;color:#edf7ff;background:linear-gradient(135deg,#111b2b,#0a111d);border:1px solid #273650;border-radius:20px;padding:26px 30px;box-shadow:0 18px 60px #03071266;font-family:Inter,ui-sans-serif,system-ui}.eyebrow{font-size:12px;letter-spacing:.2em;color:var(--c);font-weight:800}.eyebrow span{float:right;color:var(--muted);letter-spacing:.08em}.track{height:126px;display:flex;align-items:center;justify-content:space-between;position:relative;margin:16px 18px 8px}.track:before,.track-fill{content:"";position:absolute;left:4%;right:4%;top:44px;height:3px;background:#2b3b53}.track-fill{right:auto;background:linear-gradient(90deg,#55e6d6,#6aa9ff);box-shadow:0 0 14px #55e6d688;transition:width .45s;width:0}.stage{z-index:1;width:22%;border:0;background:none;color:var(--muted);display:grid;justify-items:center;gap:6px;cursor:pointer}.dot{display:grid;place-items:center;width:34px;height:34px;border:2px solid #42516a;background:#101a29;border-radius:50%;transition:.3s}.stage strong{font-size:14px}.stage small{font-size:11px}.stage.active{color:#fff}.stage.active .dot,.stage.done .dot{border-color:var(--c);background:#153b3e;color:var(--c);box-shadow:0 0 20px #55e6d655}.detail{display:flex;gap:18px;align-items:center;min-height:86px;background:#ffffff08;border:1px solid #ffffff10;border-radius:14px;padding:14px 18px}.detail>span{font-size:38px;font-weight:900;color:#ffffff12}.detail h3{margin:0 0 5px;font-size:18px}.detail p{margin:0;color:#aebcd0;font-size:13px}.controls{display:flex;justify-content:flex-end;gap:8px;margin-top:14px}.controls button{border:1px solid #35445d;background:#172236;color:#cfdbeb;border-radius:8px;padding:7px 14px;cursor:pointer}.controls button:hover,.controls .hot{border-color:var(--c);color:var(--c)}
.pipeline-shell{position:absolute;right:0;bottom:0;width:850px;transform:scale(.6);transform-origin:bottom right}
</style>
