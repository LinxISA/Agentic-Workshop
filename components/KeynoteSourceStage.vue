<script setup>
import { computed, ref } from 'vue'
import { buildStageStyle } from './fullBleedStageModel.mjs'
import { focusAt, normalizeFocuses } from './keynoteSourceStageModel.mjs'

const props = defineProps({
  background: { type: String, required: true },
  title: { type: String, required: true },
  claim: { type: String, default: '' },
  slideId: { type: String, required: true },
  focuses: { type: Array, default: () => [] },
  interactive: { type: Boolean, default: false },
})

const step = ref(0)
const stageStyle = computed(() => buildStageStyle(props.background, 'center', import.meta.env.BASE_URL))
const normalizedFocuses = computed(() => normalizeFocuses(props.focuses))
const activeFocus = computed(() => focusAt(normalizedFocuses.value, step.value))
const focusStyle = computed(() => activeFocus.value ? {
  left: `${activeFocus.value.x}%`,
  top: `${activeFocus.value.y}%`,
  width: `${activeFocus.value.w}%`,
  height: `${activeFocus.value.h}%`,
} : {})

function nextFocus() {
  if (normalizedFocuses.value.length) step.value = (step.value + 1) % normalizedFocuses.value.length
}
</script>

<template>
  <main class="keynote-source-stage full-bleed-stage" :style="stageStyle" :aria-label="title" :data-slide-id="slideId">
    <div class="keynote-source-stage__edge" aria-hidden="true" />
    <section class="full-bleed-stage__diagram keynote-source-stage__diagram" aria-label="Source slide focus animation">
      <div v-if="activeFocus" class="keynote-source-stage__focus" :style="focusStyle" aria-hidden="true" />
      <button v-if="interactive && normalizedFocuses.length > 1" class="keynote-source-stage__next" type="button" aria-label="切换讲解焦点" @click="nextFocus">
        <span aria-hidden="true" />
      </button>
    </section>
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

.keynote-source-stage__diagram {
  position: absolute;
  z-index: 2;
  inset: 0;
  pointer-events: none;
}

.keynote-source-stage__focus {
  position: absolute;
  border: 2px solid rgba(23, 217, 255, .44);
  border-radius: 18px;
  pointer-events: none;
  box-shadow:
    0 0 0 1px rgba(255, 190, 0, .12),
    0 0 34px rgba(23, 217, 255, .16),
    inset 0 0 34px rgba(23, 217, 255, .04);
  animation: keynote-focus-breathe 2.8s ease-in-out infinite;
  transition: left .48s ease, top .48s ease, width .48s ease, height .48s ease;
}

.keynote-source-stage__next {
  position: absolute;
  right: 13px;
  bottom: 12px;
  display: grid;
  width: 31px;
  height: 31px;
  padding: 0;
  place-items: center;
  border: 1px solid rgba(23, 217, 255, .42);
  border-radius: 50%;
  background: rgba(2, 10, 28, .56);
  box-shadow: 0 5px 24px rgba(0, 0, 0, .38);
  pointer-events: auto;
  backdrop-filter: blur(5px);
}

.keynote-source-stage__next span {
  width: 0;
  height: 0;
  margin-left: 2px;
  border-top: 5px solid transparent;
  border-bottom: 5px solid transparent;
  border-left: 8px solid rgba(245, 248, 255, .9);
}

@keyframes keynote-focus-breathe {
  0%, 100% { opacity: .38; filter: saturate(.9); }
  50% { opacity: .9; filter: saturate(1.2); }
}

@media (prefers-reduced-motion: reduce) {
  .keynote-source-stage__focus { animation: none; transition: none; opacity: .58; }
}
</style>
