const sessions = new Set(['session-1', 'session-2'])

export function normalizeBasePath(value) {
  if (typeof value !== 'string') {
    throw new TypeError('Base path must be a string')
  }

  if (value === '') {
    return ''
  }

  if (
    !value.startsWith('/') ||
    value.startsWith('//') ||
    value.includes('%') ||
    value.includes('?') ||
    value.includes('#') ||
    value.includes('\\')
  ) {
    throw new TypeError('Base path must be a slash-prefixed pathname')
  }

  const normalized = value.replace(/\/+$/, '')
  if (normalized === '') {
    return ''
  }

  if (normalized.split('/').some((segment) => segment === '.' || segment === '..')) {
    throw new TypeError('Base path must not contain dot segments')
  }

  return normalized
}

export function deckBase(session, value = process.env.SUMMERSCHOOL_BASE_PATH ?? '') {
  if (!sessions.has(session)) {
    throw new TypeError(`Unknown deck session: ${session}`)
  }

  const basePath = normalizeBasePath(value)
  return `${basePath}/${session}/`
}
