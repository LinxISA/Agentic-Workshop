<script setup>
const props = defineProps({
  level: { type: String, default: 'system' },
  activePath: { type: Array, default: () => [] },
})

const levels = [
  { id: 'system', label: 'SYSTEM', x: 12, y: 70, w: 100, color: '#F16BB5' },
  { id: 'package', label: 'PACKAGE', x: 128, y: 60, w: 104, color: '#17D9FF' },
  { id: 'chip', label: 'CHIP', x: 248, y: 50, w: 96, color: '#B9FF33' },
  { id: 'cluster', label: 'CLUSTER', x: 360, y: 40, w: 100, color: '#B9FF33' },
  { id: 'core', label: 'CORE', x: 476, y: 30, w: 82, color: '#FFBE00' },
  { id: 'queue', label: 'QUEUE', x: 574, y: 20, w: 68, color: '#17D9FF' },
  { id: 'cycle', label: 'CYCLE', x: 658, y: 10, w: 52, color: '#F5F8FF' },
]

const isActive = (id) => id === props.level || props.activePath.includes(id)
</script>

<template>
  <svg class="architecture-zoom" viewBox="0 0 722 210" role="img" aria-label="Architecture hierarchy from system to cycle">
    <defs>
      <filter id="zoom-glow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
    </defs>
    <path class="zoom-axis" d="M 20 180 C 190 180 240 130 355 122 S 570 80 702 36" />
    <g v-for="item in levels" :key="item.id" :class="['zoom-level', { active: isActive(item.id) }]">
      <rect :x="item.x" :y="item.y" :width="item.w" :height="110 - item.y / 3" rx="8" :style="{ '--level-color': item.color }" />
      <text :x="item.x + item.w / 2" :y="160" text-anchor="middle">{{ item.label }}</text>
    </g>
  </svg>
</template>

<style scoped>
.architecture-zoom { width: 100%; height: 100%; overflow: visible; }
.zoom-axis { fill: none; stroke: rgba(245,248,255,.22); stroke-width: 2; stroke-dasharray: 4 8; }
.zoom-level rect { fill: color-mix(in srgb, var(--level-color) 13%, transparent); stroke: color-mix(in srgb, var(--level-color) 48%, transparent); stroke-width: 1.5; }
.zoom-level text { fill: rgba(245,248,255,.58); font-size: 11px; font-weight: 700; letter-spacing: .08em; }
.zoom-level.active rect { fill: color-mix(in srgb, var(--level-color) 22%, transparent); stroke: var(--level-color); stroke-width: 2.5; filter: url(#zoom-glow); }
.zoom-level.active text { fill: var(--level-color); }
</style>
