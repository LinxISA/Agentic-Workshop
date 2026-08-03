import test from 'node:test'
import assert from 'node:assert/strict'
import { buildStageStyle, buildScrimStyle } from '../components/fullBleedStageModel.mjs'

test('buildStageStyle covers the complete slide with the requested local image', () => {
  assert.deepEqual(buildStageStyle('/generated/slides/s01-architecture-first.png', 'center'), {
    backgroundImage: "url('/generated/slides/s01-architecture-first.png')",
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  })
})

test('buildStageStyle respects the Slidev base path for offline subdirectory builds', () => {
  assert.equal(
    buildStageStyle('/generated/slides/s01-architecture-first.png', 'center', '/session-1/').backgroundImage,
    "url('/session-1/generated/slides/s01-architecture-first.png')",
  )
})

test('buildStageStyle accepts synchronized Keynote page assets', () => {
  assert.deepEqual(buildStageStyle('/generated/keynote-latest/page-01.png', 'center', '/session-1/'), {
    backgroundImage: "url('/session-1/generated/keynote-latest/page-01.png')",
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  })
})

test('buildStageStyle rejects remote and non-slide assets', () => {
  assert.throws(() => buildStageStyle('https://example.com/image.png'), /local generated slide asset/)
  assert.throws(() => buildStageStyle('/generated/main-hero.png'), /local generated slide asset/)
})

test('buildScrimStyle creates a calm text zone on the selected side', () => {
  assert.equal(buildScrimStyle('left').background, 'linear-gradient(90deg, rgba(3, 12, 29, 0.96) 0%, rgba(3, 12, 29, 0.72) 42%, rgba(3, 12, 29, 0.12) 72%, rgba(3, 12, 29, 0.04) 100%)')
  assert.equal(buildScrimStyle('right').background, 'linear-gradient(270deg, rgba(3, 12, 29, 0.96) 0%, rgba(3, 12, 29, 0.72) 42%, rgba(3, 12, 29, 0.12) 72%, rgba(3, 12, 29, 0.04) 100%)')
  assert.equal(buildScrimStyle('full').background, 'rgba(3, 12, 29, 0.68)')
})
