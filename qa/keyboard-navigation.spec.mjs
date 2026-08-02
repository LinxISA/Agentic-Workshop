import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { actionForKey } from '../components/keyboardNavigationModel.mjs'

const event = (key, overrides = {}) => ({
  key,
  targetTag: 'DIV',
  isContentEditable: false,
  altKey: false,
  ctrlKey: false,
  metaKey: false,
  repeat: false,
  ...overrides,
})

test('J and K provide presentation-style next and previous navigation', () => {
  assert.equal(actionForKey(event('j')), 'next')
  assert.equal(actionForKey(event('J')), 'next')
  assert.equal(actionForKey(event('k')), 'prev')
  assert.equal(actionForKey(event('K')), 'prev')
})

test('question mark and Escape control the keyboard help overlay', () => {
  assert.equal(actionForKey(event('?')), 'toggle-help')
  assert.equal(actionForKey(event('Escape')), 'close-help')
})

test('shortcuts do not interfere with typing, modifiers, or held keys', () => {
  assert.equal(actionForKey(event('j', { targetTag: 'INPUT' })), null)
  assert.equal(actionForKey(event('k', { isContentEditable: true })), null)
  assert.equal(actionForKey(event('j', { metaKey: true })), null)
  assert.equal(actionForKey(event('j', { repeat: true })), null)
})

test('Slidev built-in arrow and Space shortcuts remain untouched', () => {
  assert.equal(actionForKey(event('ArrowRight')), null)
  assert.equal(actionForKey(event('ArrowLeft')), null)
  assert.equal(actionForKey(event(' ')), null)
})

test('each Slidev entry root mounts the shared keyboard navigation layer', async () => {
  for (const session of ['session-1', 'session-2']) {
    const source = await readFile(new URL(`../decks/${session}/global-top.vue`, import.meta.url), 'utf8')
    assert.match(source, /KeyboardNavigation/)
  }
})
