<script setup>
import { computed } from 'vue'
import { buildScrimStyle, buildStageStyle } from './fullBleedStageModel.mjs'

const props = defineProps({
  background: { type: String, required: true },
  title: { type: String, default: '' },
  claim: { type: String, default: '' },
  eyebrow: { type: String, default: '' },
  slideId: { type: String, default: '' },
  focus: { type: String, default: 'left' },
  position: { type: String, default: 'center' },
  overlayTone: { type: String, default: 'cyan' },
})

const stageStyle = computed(() => buildStageStyle(props.background, props.position))
const scrimStyle = computed(() => buildScrimStyle(props.focus))
</script>

<template>
  <main class="full-bleed-stage" :class="[`focus-${focus}`, `tone-${overlayTone}`]" :style="stageStyle">
    <div class="full-bleed-stage__scrim" :style="scrimStyle" />
    <div class="full-bleed-stage__texture" aria-hidden="true" />

    <header v-if="title || claim || eyebrow" class="full-bleed-stage__copy">
      <p v-if="eyebrow" class="stage-eyebrow">{{ eyebrow }}</p>
      <h1 v-if="title">{{ title }}</h1>
      <p v-if="claim" class="stage-claim">{{ claim }}</p>
    </header>

    <section class="full-bleed-stage__diagram" aria-label="Architecture visualization">
      <slot name="diagram" />
    </section>

    <aside class="full-bleed-stage__controls">
      <slot name="controls" />
    </aside>

    <footer class="full-bleed-stage__footer">
      <span class="stage-rule" />
      <span>{{ slideId }}</span>
      <slot name="footer" />
    </footer>
  </main>
</template>

<style scoped>
.full-bleed-stage {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  color: var(--ss-text);
  isolation: isolate;
}

.full-bleed-stage__scrim,
.full-bleed-stage__texture {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.full-bleed-stage__scrim { z-index: -1; }
.full-bleed-stage__texture {
  z-index: -1;
  opacity: .26;
  background:
    linear-gradient(180deg, rgba(23,217,255,.1), transparent 20%, transparent 80%, rgba(2,8,22,.46)),
    radial-gradient(circle at 70% 20%, rgba(23,217,255,.12), transparent 30%);
}

.full-bleed-stage__copy {
  position: absolute;
  z-index: 3;
  top: 54px;
  width: min(660px, 52%);
}

.focus-left .full-bleed-stage__copy { left: 68px; text-align: left; }
.focus-right .full-bleed-stage__copy { right: 68px; text-align: right; }
.focus-full .full-bleed-stage__copy { left: 68px; width: calc(100% - 136px); text-align: center; }

.stage-eyebrow {
  margin: 0 0 10px;
  color: var(--ss-cyan);
  font-size: 15px;
  font-weight: 800;
  letter-spacing: .18em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  max-width: 100%;
  font-size: clamp(42px, 4.4vw, 64px);
  line-height: 1.04;
  letter-spacing: -.04em;
  text-wrap: balance;
  text-shadow: 0 4px 28px rgba(0,0,0,.72);
}

.stage-claim {
  margin: 18px 0 0;
  max-width: 620px;
  color: rgba(245,248,255,.88);
  font-size: clamp(21px, 2vw, 28px);
  font-weight: 560;
  line-height: 1.34;
  text-shadow: 0 3px 20px rgba(0,0,0,.82);
}

.focus-right .stage-claim { margin-left: auto; }
.focus-full .stage-claim { margin-left: auto; margin-right: auto; }

.full-bleed-stage__diagram {
  position: absolute;
  z-index: 2;
  inset: 170px 54px 62px;
  pointer-events: auto;
}

.full-bleed-stage__controls {
  position: absolute;
  z-index: 4;
  right: 54px;
  bottom: 62px;
}

.full-bleed-stage__footer {
  position: absolute;
  z-index: 4;
  left: 54px;
  right: 54px;
  bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 18px;
  color: rgba(245,248,255,.56);
  font-size: 11px;
  letter-spacing: .04em;
}

.stage-rule { width: 26px; height: 2px; background: var(--ss-cyan); }

@media (prefers-reduced-motion: reduce) {
  .full-bleed-stage *, .full-bleed-stage *::before, .full-bleed-stage *::after { animation: none !important; transition: none !important; }
}
</style>
