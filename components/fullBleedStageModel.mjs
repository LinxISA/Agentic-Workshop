const slideAssetPattern = /^\/generated\/(?:slides\/s\d{2}-[a-z0-9-]+|keynote-latest\/page-\d{2})\.png$/

export function buildStageStyle(background, position = 'center', base = '/') {
  if (!slideAssetPattern.test(background)) {
    throw new Error('background must be a local generated slide asset')
  }
  const prefix = base === '/' ? '' : `/${base.replace(/^\/+|\/+$/g, '')}`
  return {
    backgroundImage: `url('${prefix}${background}')`,
    backgroundPosition: position,
    backgroundSize: 'cover',
  }
}

export function buildScrimStyle(focus = 'left') {
  if (focus === 'full') return { background: 'rgba(3, 12, 29, 0.68)' }
  const angle = focus === 'right' ? '270deg' : '90deg'
  return {
    background: `linear-gradient(${angle}, rgba(3, 12, 29, 0.96) 0%, rgba(3, 12, 29, 0.72) 42%, rgba(3, 12, 29, 0.12) 72%, rgba(3, 12, 29, 0.04) 100%)`,
  }
}
