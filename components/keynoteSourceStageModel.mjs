const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0))

export function normalizeFocuses(focuses = []) {
  return focuses.map((focus) => {
    const x = clamp(focus.x, 0, 100)
    const y = clamp(focus.y, 0, 100)
    return {
      x,
      y,
      w: clamp(focus.w, 0, 100 - x),
      h: clamp(focus.h, 0, 100 - y),
    }
  })
}

export function focusAt(focuses, step) {
  if (!focuses.length) return null
  const index = ((step % focuses.length) + focuses.length) % focuses.length
  return focuses[index]
}
