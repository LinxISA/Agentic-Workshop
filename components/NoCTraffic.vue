<script setup>
import { computed, ref } from 'vue'
import { nocMeshEdges } from './architectureModels.mjs'
const hotspot=ref(35),mapping=ref('spread')
const edges=computed(()=>nocMeshEdges({hotspot:hotspot.value,clustered:mapping.value==='clustered'}))
const worst=computed(()=>Math.max(...edges.value.map(edge=>edge.load)))
const node=(id)=>({x:45+(id%4)*100,y:35+Math.floor(id/4)*64})
</script>
<template><section class="noc arch-overlay"><header><b>4×4 MESH TRAFFIC</b><span>hottest link {{worst}}%</span></header><svg viewBox="0 0 390 255"><g class="links"><line v-for="edge in edges" :key="`${edge.from}-${edge.to}`" :x1="node(edge.from).x" :y1="node(edge.from).y" :x2="node(edge.to).x" :y2="node(edge.to).y" :style="{stroke:edge.load>70?'#f16bb5':'#17d9ff',strokeWidth:2+edge.load/18}"/><circle v-for="i in 16" :key="'n'+i" :cx="node(i-1).x" :cy="node(i-1).y" r="16"/><text v-for="i in 16" :key="'t'+i" :x="node(i-1).x" :y="node(i-1).y+4">{{i-1}}</text></g></svg><footer><button @click="mapping='spread'" :class="{on:mapping==='spread'}">Spread</button><button @click="mapping='clustered'" :class="{on:mapping==='clustered'}">Hotspot</button><label>hotspot <input v-model.number="hotspot" type="range" min="20" max="100"></label></footer></section></template>
<style scoped>.noc{right:0;bottom:0;width:600px;padding:16px;border-radius:20px;transform:scale(.65);transform-origin:bottom right}.noc header,.noc footer{display:flex;align-items:center;justify-content:space-between;color:#bed0df;font-size:12px}.noc header b{color:#17d9ff}.noc svg{width:100%;height:240px}.links line{opacity:.8;filter:drop-shadow(0 0 5px currentColor)}.links circle{fill:#07142d;stroke:#b9ff33;stroke-width:2}.links text{fill:white;text-anchor:middle;font-size:12px}.noc button{font-size:12px;padding:5px 9px}.noc button.on{background:#087d99;color:white}.noc label{display:flex;gap:7px;align-items:center}</style>
