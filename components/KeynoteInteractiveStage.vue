<script setup>
import { ref } from 'vue'

defineProps({ mode: { type: String, default: 'plan' } })
const active = ref('NPU clusters')
const regions = ['NPU clusters', 'CPU clusters', 'NoC / shared cache', 'DDR / I/O']
</script>

<template>
  <aside v-if="mode === 'disclaimer'" class="keynote-disclaimer">教学抽象 · 非产品框图</aside>
  <section v-else class="keynote-plan arch-overlay" aria-label="教学用 SoC 规划叠加层">
    <small>TEACHING PLAN OVERLAY</small>
    <nav aria-label="选择 SoC 规划区域"><button v-for="region in regions" :key="region" :aria-pressed="active === region" :class="{ active: active === region }" @click="active = region">{{ region }}</button></nav>
    <p aria-live="polite"><b>{{ active }}</b><span>从资源分区追到共享链路，再追到数据入口。</span></p>
  </section>
</template>

<style scoped>
.keynote-disclaimer{position:absolute;right:22px;bottom:18px;z-index:4;padding:6px 10px;border:1px solid #ffbe0066;border-radius:8px;background:#030c1ddd;color:#ffdc72;font-size:12px;letter-spacing:.08em}.keynote-plan{right:24px;bottom:24px;width:365px;padding:12px 14px;border-radius:15px;box-sizing:border-box}.keynote-plan small{color:#8ba6bd;font-size:12px;letter-spacing:.14em}.keynote-plan nav{display:flex;gap:5px;margin:7px 0}.keynote-plan button{padding:4px 8px;font-size:12px}.keynote-plan button.active{border-color:#17d9ff;background:#17d9ff22}.keynote-plan p{display:flex;justify-content:space-between;gap:10px;margin:0;font-size:12px}.keynote-plan p b{color:#17d9ff}.keynote-plan p span{color:#adc3d8}
</style>
