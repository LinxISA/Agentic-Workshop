import test from 'node:test'
import assert from 'node:assert/strict'
import { chromium } from 'playwright-chromium'

const base = process.env.SUMMERSCHOOL_PREVIEW_URL || 'http://127.0.0.1:4173'

for (const [path, deckTitle] of [
  ['/session-1', '体系结构研究的第一性原理'],
  ['/session-2', 'Agentic Model 与 PTO NPU Core'],
]) {
  test(`${path} opens its Slidev deck without falling back to the course index`, async () => {
    const response = await fetch(`${base}${path}`)
    const body = await response.text()
    assert.equal(response.status, 200)
    assert.match(body, /property="slidev:version"/)
    assert.match(body, new RegExp(deckTitle))
  })
}

test('/ is available from the offline preview', async () => {
  const response = await fetch(`${base}/`)
  const body = await response.text()
  assert.equal(response.status, 200)
  assert.match(response.headers.get('content-type') ?? '', /text\/html/)
  assert.match(body, /<title>LinxISA Summer School 2026<\/title>/)
})

for (const [path, deckTitle] of [
  ['/session-1/1', '体系结构研究的第一性原理'],
  ['/session-1/28', '体系结构研究的第一性原理'],
  ['/session-2/1', 'Agentic Model 与 PTO NPU Core'],
  ['/session-2/28', 'Agentic Model 与 PTO NPU Core'],
]) {
  test(`${path} returns the requested Slidev deck, not the course index`, async () => {
    const response = await fetch(`${base}${path}`)
    const body = await response.text()
    assert.equal(response.status, 200)
    assert.match(response.headers.get('content-type') ?? '', /text\/html/)
    assert.match(body, /property="slidev:version"/)
    assert.match(body, new RegExp(deckTitle))
    assert.doesNotMatch(body, /<title>LinxISA Summer School 2026<\/title>/)
  })
}

test('Escape opens the overview and closes either overview or keyboard help', async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.goto(`${base}/session-1/`, { waitUntil: 'networkidle' })
    await page.waitForSelector('.slidev-layout')

    await page.keyboard.press('Escape')
    await page.waitForFunction(() => {
      const visibleLayouts = [...document.querySelectorAll('.slidev-layout')]
        .filter((element) => {
          const style = getComputedStyle(element)
          const rect = element.getBoundingClientRect()
          return style.display !== 'none'
            && style.visibility !== 'hidden'
            && rect.width > 0
            && rect.height > 0
        })
      return visibleLayouts.length > 1
    })

    await page.keyboard.press('Escape')
    await page.waitForFunction(() => {
      const visibleLayouts = [...document.querySelectorAll('.slidev-layout')]
        .filter((element) => {
          const style = getComputedStyle(element)
          const rect = element.getBoundingClientRect()
          return style.display !== 'none'
            && style.visibility !== 'hidden'
            && rect.width > 0
            && rect.height > 0
        })
      return visibleLayouts.length === 1
    })

    await page.keyboard.press('?')
    await page.waitForSelector('.keyboard-navigation__help')
    await page.keyboard.press('Escape')
    await page.waitForSelector('.keyboard-navigation__help', { state: 'detached' })
  }
  finally {
    await browser.close()
  }
})
