import { defineShortcutsSetup } from '@slidev/types'

export default defineShortcutsSetup((nav, base) => base.map(shortcut => {
  if (shortcut.name !== 'hide_overview') return shortcut
  return {
    ...shortcut,
    fn: () => {
      if (document.querySelector('.keyboard-navigation__help'))
        window.dispatchEvent(new CustomEvent('summerschool:close-keyboard-help'))
      else
        nav.toggleOverview()
    },
  }
}))
