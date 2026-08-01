<script setup>
defineProps({
  kind: { type: String, default: 'default' },
  art: { type: String, default: '' },
  scrim: { type: Boolean, default: false },
})
</script>

<template>
  <div class="slidev-layout" :class="[`ss-${kind}`]">
    <img v-if="art" class="bg-art" :src="art" alt="" aria-hidden="true">
    <div v-if="scrim" class="bg-scrim" />
    <div class="ss-layout-body"><slot /></div>
    <div class="ss-layout-foot"><slot name="footer" /></div>
  </div>
</template>

<style scoped>
.ss-layout-body { position: relative; z-index: 1; height: 100%; }
.ss-layout-foot { position: absolute; z-index: 2; left: 64px; right: 64px; bottom: 18px; color: var(--ss-muted); font-size: 11px; }
.ss-hero .ss-layout-body, .ss-section .ss-layout-body { display: flex; flex-direction: column; justify-content: center; }
.ss-architecture .ss-layout-body, .ss-circuit-focus .ss-layout-body, .ss-experiment .ss-layout-body { display: grid; grid-template-rows: auto 1fr; }
.ss-quiz .ss-layout-body, .ss-takeaway .ss-layout-body { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
</style>
