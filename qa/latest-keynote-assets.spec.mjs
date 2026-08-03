import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import sharp from 'sharp'

const folders = ['assets/generated/keynote-latest', 'public/generated/keynote-latest']

test('latest Keynote sync contains exactly 71 paired 1920x1080 offline pages', async () => {
  for (const folder of folders) {
    const files = (await readdir(folder)).filter(name => /^page-\d{2}\.png$/.test(name)).sort()
    assert.deepEqual(files, Array.from({ length: 71 }, (_, index) => `page-${String(index + 1).padStart(2, '0')}.png`))
    for (const file of files) {
      const metadata = await sharp(`${folder}/${file}`).metadata()
      assert.deepEqual([metadata.width, metadata.height], [1920, 1080], `${folder}/${file}`)
    }
  }
})

test('authoring and runtime copies of every Keynote page are byte-identical', async () => {
  for (let page = 1; page <= 71; page += 1) {
    const file = `page-${String(page).padStart(2, '0')}.png`
    const hashes = await Promise.all(folders.map(async folder => createHash('sha256').update(await readFile(`${folder}/${file}`)).digest('hex')))
    assert.equal(hashes[0], hashes[1], file)
  }
})
