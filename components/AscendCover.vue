<script setup>
import { computed } from 'vue'
import { buildStageStyle } from './fullBleedStageModel.mjs'

const props = defineProps({
  background: { type: String, required: true },
  title: { type: String, required: true },
  claim: { type: String, default: '' },
  speaker: { type: String, required: true },
  affiliation: { type: String, required: true },
})

const stageStyle = computed(() => buildStageStyle(props.background, 'center', import.meta.env.BASE_URL))
</script>

<template>
  <main class="ascend-cover full-bleed-stage" :style="stageStyle">
    <div class="ascend-cover__shade" aria-hidden="true" />

    <section class="ascend-cover__copy">
      <span class="ascend-cover__accent" aria-hidden="true" />
      <h1>{{ title }}</h1>
      <p v-if="claim" class="ascend-cover__claim">{{ claim }}</p>
    </section>

    <footer class="ascend-cover__presenter">
      <p>演讲人：{{ speaker }}</p>
      <p>{{ affiliation }}</p>
    </footer>
  </main>
</template>

<style scoped>
.ascend-cover {
  position: absolute;
  inset: 0;
  overflow: hidden;
  color: #fff;
  isolation: isolate;
}

.ascend-cover__shade {
  position: absolute;
  z-index: -1;
  inset: 0;
  background:
    linear-gradient(90deg, transparent 0 40%, rgba(2, 8, 24, .1) 49%, rgba(2, 8, 24, .34) 100%),
    radial-gradient(circle at 72% 52%, rgba(12, 47, 91, .18), transparent 38%);
}

.ascend-cover__copy {
  position: absolute;
  top: 45%;
  right: 5.4%;
  width: 58%;
  transform: translateY(-50%);
}

.ascend-cover__accent {
  display: block;
  width: 54px;
  height: 4px;
  margin-bottom: 19px;
  border-radius: 99px;
  background: linear-gradient(90deg, #e33a3a, #17d9ff);
  box-shadow: 0 0 24px rgba(23, 217, 255, .36);
}

.ascend-cover h1 {
  margin: 0;
  color: #fff;
  font-size: 54px;
  font-weight: 780;
  line-height: 1.05;
  letter-spacing: -.045em;
  white-space: nowrap;
  text-shadow: 0 5px 34px rgba(0, 0, 0, .76);
}

.ascend-cover__claim {
  margin: 17px 0 0;
  color: rgba(222, 235, 250, .78);
  font-size: 17px;
  font-weight: 520;
  letter-spacing: .04em;
}

.ascend-cover__presenter {
  position: absolute;
  right: 5.6%;
  bottom: 12.5%;
  min-width: 245px;
  padding-left: 18px;
  border-left: 3px solid rgba(227, 58, 58, .92);
  text-align: left;
  text-shadow: 0 4px 24px rgba(0, 0, 0, .82);
}

.ascend-cover__presenter p {
  margin: 0;
  font-size: 21px;
  font-weight: 560;
  line-height: 1.55;
  letter-spacing: .02em;
}

.ascend-cover__presenter p + p {
  color: rgba(230, 239, 250, .84);
  font-size: 18px;
}
</style>
