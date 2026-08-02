<script setup>
import { computed } from 'vue'
import { buildStageStyle } from './fullBleedStageModel.mjs'

const props = defineProps({
  background: { type: String, required: true },
  title: { type: String, required: true },
  claim: { type: String, default: '' },
  slideId: { type: String, required: true },
})

const stageStyle = computed(() => buildStageStyle(props.background, 'center', import.meta.env.BASE_URL))
</script>

<template>
  <main class="keynote-source-stage full-bleed-stage" :style="stageStyle" :aria-label="title" :data-slide-id="slideId">
    <div class="keynote-source-stage__edge" aria-hidden="true" />
  </main>
</template>

<style scoped>
.keynote-source-stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
  isolation: isolate;
  background-color: #061a3a;
}

.keynote-source-stage__edge {
  position: absolute;
  inset: 0;
  pointer-events: none;
  box-shadow: inset 0 0 90px rgba(1, 8, 24, .18);
}

</style>
