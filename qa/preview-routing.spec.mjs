import test from 'node:test'
import assert from 'node:assert/strict'

const base = process.env.SUMMERSCHOOL_PREVIEW_URL || 'http://127.0.0.1:4173'

for (const path of ['/session-1', '/session-2']) {
  test(`${path} redirects to its Slidev directory`, async () => {
    const response = await fetch(`${base}${path}`, { redirect: 'manual' })

    assert.equal(response.status, 308)
    assert.equal(response.headers.get('location'), `${path}/`)
  })
}
