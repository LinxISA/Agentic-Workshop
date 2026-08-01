const slideAssetPattern = /^\/generated\/slides\/s\d{2}-[a-z0-9-]+\.png$/

export function buildStageStyle(background, position = 'center') {
  if (!slideAssetPattern.test(background)) {
    throw new Error('background must be a local generated slide asset')
  }
  return {
    backgroundImage: `url('${background}')`,
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
