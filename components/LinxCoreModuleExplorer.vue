<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'

const modules = [
  { id:'fetch', label:'Fetch', x:30, y:42, w:130, h:64, color:'#60a5fa', desc:'Fetches instruction blocks and predicts the next PC.' },
  { id:'decode', label:'Decode', x:210, y:42, w:130, h:64, color:'#38bdf8', desc:'Decodes Linx instructions into queue operations.' },
  { id:'rename', label:'Rename', x:390, y:42, w:130, h:64, color:'#2dd4bf', desc:'Maps architectural state onto physical registers.' },
  { id:'issue', label:'BISQ', x:210, y:172, w:130, h:64, color:'#fbbf24', desc:'Selects ready work while preserving block semantics.' },
  { id:'execute', label:'Execute', x:390, y:172, w:130, h:64, color:'#fb923c', desc:'Runs scalar, vector, memory, and control operations.' },
  { id:'retire', label:'BROB', x:570, y:107, w:130, h:64, color:'#c084fc', desc:'Commits blocks atomically and recovers speculation.' },
]
const links = [['fetch','decode'],['decode','rename'],['rename','retire'],['decode','issue'],['issue','execute'],['execute','retire']]
const selected = ref(0), playing = ref(false)
let timer: ReturnType<typeof setInterval> | undefined
const module = computed(() => modules[selected.value])
function step(){ selected.value=(selected.value+1)%modules.length }
function stop(){ playing.value=false;if(timer)clearInterval(timer);timer=undefined }
function play(){ if(playing.value)return;playing.value=true;timer=setInterval(step,1100) }
function reset(){ stop();selected.value=0 }
function line(a:string,b:string){const x=modules.find(m=>m.id===a)!,y=modules.find(m=>m.id===b)!;return {x1:x.x+x.w,y1:x.y+x.h/2,x2:y.x,y2:y.y+y.h/2}}
onBeforeUnmount(stop)
</script>

<template>
  <section class="explorer">
    <header><div><small>LINXCORE / MICROARCHITECTURE</small><h3>Block-level execution engine</h3></div><div class="controls"><button @click="step">Step</button><button @click="playing?stop():play()">{{ playing?'Pause':'Play' }}</button><button @click="reset">Reset</button></div></header>
    <div class="canvas">
      <svg viewBox="0 0 730 280" role="img" aria-label="LinxCore module diagram">
        <defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0l10 5-10 5z" fill="#64748b"/></marker></defs>
        <line v-for="([a,b]) in links" :key="a+b" v-bind="line(a,b)" :class="{ glow: module.id===a || module.id===b }" marker-end="url(#arrow)" />
        <g v-for="(m,i) in modules" :key="m.id" class="module" :class="{ selected:i===selected }" @click="selected=i">
          <rect :x="m.x" :y="m.y" :width="m.w" :height="m.h" rx="12" :style="{ '--accent':m.color }"/><text :x="m.x+m.w/2" :y="m.y+29">{{ m.label }}</text><text class="id" :x="m.x+m.w/2" :y="m.y+47">{{ m.id.toUpperCase() }}</text>
        </g>
      </svg>
      <aside :style="{ '--accent':module.color }"><small>SELECTED MODULE</small><h3>{{ module.label }}</h3><p>{{ module.desc }}</p><div><span>ready</span><b>● ACTIVE</b></div></aside>
    </div>
  </section>
</template>

<style scoped>
.explorer{color:#eef7ff;background:#0b1320;border:1px solid #27364b;border-radius:18px;padding:22px;font-family:Inter,system-ui;box-shadow:0 20px 55px #02061777}header{display:flex;justify-content:space-between;align-items:center}header small,aside small{color:#51d9cc;letter-spacing:.17em;font-size:12px;font-weight:800}header h3{margin:4px 0 0;font-size:20px}.controls{display:flex;gap:7px}.controls button{background:#152235;color:#cbd8ea;border:1px solid #33445d;border-radius:7px;padding:6px 11px;cursor:pointer}.controls button:hover{color:#51d9cc;border-color:#51d9cc}.canvas{display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:14px;align-items:stretch;margin-top:14px}svg{width:100%;height:280px;background:radial-gradient(circle at 40% 30%,#18273a,#0a111c);border-radius:13px;border:1px solid #24344b}line{stroke:#46566d;stroke-width:2;transition:.3s}.glow{stroke:#55e6d6;stroke-width:3;filter:drop-shadow(0 0 5px #55e6d6)}.module{cursor:pointer}.module rect{fill:#111d2d;stroke:#3a4a61;stroke-width:2;transition:.25s}.module:hover rect,.module.selected rect{stroke:var(--accent);fill:#172438;filter:drop-shadow(0 0 9px var(--accent))}.module text{fill:#edf7ff;text-anchor:middle;font-weight:800;font-size:14px;pointer-events:none}.module .id{fill:#8fa1b8;font-size:12px;letter-spacing:.16em}aside{--accent:#51d9cc;background:#101b2b;border-left:3px solid var(--accent);border-radius:10px;padding:20px;display:flex;flex-direction:column}aside h3{font-size:24px;margin:10px 0;color:var(--accent)}aside p{font-size:13px;line-height:1.55;color:#aab9cd}aside div{margin-top:auto;display:flex;justify-content:space-between;font-size:12px;color:#8b9db4}aside b{color:var(--accent)}
.explorer{position:absolute;right:0;bottom:0;width:900px;transform:scale(.58);transform-origin:bottom right}
</style>
