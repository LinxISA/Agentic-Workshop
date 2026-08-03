const editableTags = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

export function actionForKey(event) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return null
  if (event.isContentEditable || editableTags.has(String(event.targetTag || '').toUpperCase())) return null

  if (event.key === 'j' || event.key === 'J') return 'next'
  if (event.key === 'k' || event.key === 'K') return 'prev'
  if (event.key === '?') return 'toggle-help'
  return null
}
