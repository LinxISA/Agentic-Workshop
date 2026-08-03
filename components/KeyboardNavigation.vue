<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useNav } from '@slidev/client'
import { actionForKey } from './keyboardNavigationModel.mjs'

const { currentSlideNo, total, nextSlide, prevSlide } = useNav()
const helpOpen = ref(false)
const hintVisible = ref(true)
let hintTimer

function onKeydown(event) {
  const target = event.target
  const action = actionForKey({
    key: event.key,
    targetTag: target?.tagName,
    isContentEditable: Boolean(target?.isContentEditable),
    altKey: event.altKey,
    ctrlKey: event.ctrlKey,
    metaKey: event.metaKey,
    repeat: event.repeat,
  })

  if (!action) return
  event.preventDefault()
  event.stopImmediatePropagation()
  if (action === 'next') nextSlide()
  if (action === 'prev') prevSlide()
  if (action === 'toggle-help') helpOpen.value = !helpOpen.value
}

function closeHelp() {
  helpOpen.value = false
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown, true)
  window.addEventListener('summerschool:close-keyboard-help', closeHelp)
  hintTimer = window.setTimeout(() => { hintVisible.value = false }, 4800)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown, true)
  window.removeEventListener('summerschool:close-keyboard-help', closeHelp)
  window.clearTimeout(hintTimer)
})
</script>

<template>
  <div class="keyboard-navigation">
    <Transition name="keyboard-hint">
      <aside v-if="hintVisible && currentSlideNo === 1" class="keyboard-navigation__hint" aria-live="polite">
        <span><kbd>←</kbd><kbd>→</kbd> 翻页</span>
        <i />
        <span><kbd>J</kbd><kbd>K</kbd> 快捷翻页</span>
        <i />
        <span><kbd>?</kbd> 查看帮助</span>
      </aside>
    </Transition>

    <Transition name="keyboard-help">
      <section v-if="helpOpen" class="keyboard-navigation__help" role="dialog" aria-modal="true" aria-label="键盘控制帮助" @click.self="helpOpen = false">
        <article>
          <header>
            <div>
              <small>KEYBOARD CONTROL</small>
              <h2>键盘控制</h2>
            </div>
            <button type="button" aria-label="关闭键盘帮助" @click="helpOpen = false">×</button>
          </header>
          <dl>
            <div><dt><kbd>→</kbd> / <kbd>Space</kbd></dt><dd>下一页或下一步</dd></div>
            <div><dt><kbd>←</kbd></dt><dd>上一页或上一步</dd></div>
            <div><dt><kbd>J</kbd> / <kbd>K</kbd></dt><dd>直接翻到下一页 / 上一页</dd></div>
            <div><dt><kbd>F</kbd></dt><dd>全屏演示</dd></div>
            <div><dt><kbd>O</kbd></dt><dd>幻灯片总览</dd></div>
            <div><dt><kbd>?</kbd></dt><dd>打开 / 关闭帮助</dd></div>
            <div><dt><kbd>Esc</kbd></dt><dd>打开总览；再次按下关闭当前浮层</dd></div>
          </dl>
          <footer>{{ currentSlideNo }} / {{ total }}</footer>
        </article>
      </section>
    </Transition>
  </div>
</template>

<style scoped>
.keyboard-navigation {
  position: absolute;
  z-index: 40;
  inset: 0;
  pointer-events: none;
  color: #f5f8ff;
}

.keyboard-navigation__hint {
  position: absolute;
  left: 50%;
  bottom: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  transform: translateX(-50%);
  padding: 9px 15px;
  border: 1px solid rgba(23, 217, 255, .28);
  border-radius: 999px;
  background: rgba(3, 12, 29, .68);
  box-shadow: 0 10px 34px rgba(0, 0, 0, .36);
  backdrop-filter: blur(9px);
  font-size:12px;
  white-space: nowrap;
}

.keyboard-navigation__hint span { display: flex; align-items: center; gap: 5px; }
.keyboard-navigation__hint i { width: 1px; height: 15px; background: rgba(255, 255, 255, .18); }

kbd {
  min-width: 21px;
  padding: 2px 6px;
  border: 1px solid rgba(255, 255, 255, .2);
  border-bottom-color: rgba(255, 255, 255, .42);
  border-radius: 5px;
  background: rgba(255, 255, 255, .08);
  color: #fff;
  font: 700  12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace;
  text-align: center;
}

.keyboard-navigation__help {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 42px;
  background: rgba(1, 7, 19, .72);
  pointer-events: auto;
  backdrop-filter: blur(12px);
}

.keyboard-navigation__help article {
  width: min(550px, 82%);
  overflow: hidden;
  border: 1px solid rgba(23, 217, 255, .34);
  border-radius: 22px;
  background: linear-gradient(145deg, rgba(8, 31, 64, .98), rgba(3, 12, 29, .98));
  box-shadow: 0 28px 90px rgba(0, 0, 0, .62);
}

.keyboard-navigation__help header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 23px 27px 18px;
  border-bottom: 1px solid rgba(255, 255, 255, .1);
}

.keyboard-navigation__help small {
  color: #17d9ff;
  font-size:12px;
  font-weight: 800;
  letter-spacing: .18em;
}

.keyboard-navigation__help h2 { margin: 3px 0 0; font-size: 27px; }
.keyboard-navigation__help button {
  display: grid;
  width: 34px;
  height: 34px;
  padding: 0;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .2);
  border-radius: 50%;
  background: rgba(255, 255, 255, .05);
  color: #fff;
  font-size: 23px;
}

.keyboard-navigation__help dl { margin: 0; padding: 12px 27px 18px; }
.keyboard-navigation__help dl div {
  display: grid;
  grid-template-columns: 180px 1fr;
  align-items: center;
  min-height: 43px;
  border-bottom: 1px solid rgba(255, 255, 255, .07);
}
.keyboard-navigation__help dl div:last-child { border-bottom: 0; }
.keyboard-navigation__help dt { display: flex; align-items: center; gap: 7px; }
.keyboard-navigation__help dd { margin: 0; color: rgba(228, 239, 250, .78); font-size: 14px; }
.keyboard-navigation__help footer {
  padding: 11px 27px;
  border-top: 1px solid rgba(255, 255, 255, .08);
  color: rgba(228, 239, 250, .54);
  font: 700  12px/1 ui-monospace, SFMono-Regular, Menlo, monospace;
  text-align: right;
}

.keyboard-hint-enter-active,
.keyboard-hint-leave-active,
.keyboard-help-enter-active,
.keyboard-help-leave-active { transition: opacity .28s ease, transform .28s ease; }
.keyboard-hint-enter-from,
.keyboard-hint-leave-to { opacity: 0; transform: translate(-50%, 12px); }
.keyboard-help-enter-from,
.keyboard-help-leave-to { opacity: 0; transform: scale(.985); }

@media (prefers-reduced-motion: reduce) {
  .keyboard-navigation * { animation: none !important; transition: none !important; }
}

@media print {
  .keyboard-navigation { display: none; }
}
</style>
