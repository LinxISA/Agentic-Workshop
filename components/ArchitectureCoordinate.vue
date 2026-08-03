<script setup>
import { computed, ref } from 'vue'

const coordinates = [
  { id: 'compute', name: '计算', question: '每周期能完成多少有效工作？', color: '#ffbe00' },
  { id: 'memory', name: '存储', question: '工作集放在哪里、能复用几次？', color: '#b9ff33' },
  { id: 'movement', name: '互连', question: '数据经过哪些链路与层级？', color: '#17d9ff' },
  { id: 'parallel', name: '并发', question: '多少独立工作可同时在途？', color: '#f16bb5' },
  { id: 'control', name: '控制', question: '谁排序、同步并承受回压？', color: '#a9c8ff' },
]

const active = ref(0)
const current = computed(() => coordinates[active.value])
</script>

<template>
  <section class="coordinates arch-overlay" aria-label="体系结构五坐标交互图">
    <div class="orbit" aria-hidden="true">
      <span v-for="(coordinate, index) in coordinates" :key="coordinate.id" :class="{ active: index === active }" :style="{ '--c': coordinate.color, '--i': index }">{{ coordinate.name }}</span>
      <b>工作负载</b>
    </div>
    <div class="coordinate-copy" aria-live="polite">
      <small>COORDINATE {{ active + 1 }} / 5</small>
      <strong :style="{ color: current.color }">{{ current.name }}</strong>
      <p>{{ current.question }}</p>
      <nav aria-label="选择体系结构坐标">
        <button v-for="(coordinate, index) in coordinates" :key="coordinate.id" :aria-pressed="index === active" :class="{ active: index === active }" @click="active = index">{{ coordinate.name }}</button>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.coordinates{inset:0;display:grid;grid-template-columns:1.2fr 1fr;align-items:center;gap:40px;padding:32px 48px;border-radius:24px;background:linear-gradient(110deg,rgba(3,12,29,.9),rgba(6,26,58,.45));box-sizing:border-box}.orbit{position:relative;width:390px;height:300px;margin:auto}.orbit::before,.orbit::after{content:"";position:absolute;inset:28px;border:1px solid rgba(23,217,255,.24);border-radius:50%;transform:rotate(-12deg)}.orbit::after{inset:70px;transform:rotate(24deg)}.orbit>b{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:grid;place-items:center;width:118px;height:118px;border-radius:50%;background:#061a3a;border:1px solid #17d9ff;color:#fff;box-shadow:0 0 42px rgba(23,217,255,.24)}.orbit span{position:absolute;left:calc(50% + cos(calc(var(--i) * 72deg - 90deg))*150px);top:calc(50% + sin(calc(var(--i) * 72deg - 90deg))*115px);transform:translate(-50%,-50%);padding:9px 15px;border-radius:999px;border:1px solid color-mix(in srgb,var(--c) 70%,transparent);background:#030c1ddd;color:var(--c);font-weight:800;transition:transform .25s,box-shadow .25s}.orbit span.active{transform:translate(-50%,-50%) scale(1.12);box-shadow:0 0 24px color-mix(in srgb,var(--c) 45%,transparent)}.coordinate-copy small{color:#8ba6bd;letter-spacing:.16em;font-size:12px}.coordinate-copy strong{display:block;margin:8px 0;font-size:42px}.coordinate-copy p{min-height:64px;margin:0 0 22px;font-size:21px;line-height:1.4}.coordinate-copy nav{display:flex;gap:7px;flex-wrap:wrap}.coordinate-copy button{padding:7px 13px;font-size:12px}.coordinate-copy button.active{border-color:#17d9ff;background:#17d9ff22}
</style>
