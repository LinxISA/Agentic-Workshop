import { writeFile } from 'node:fs/promises'
import { readDeckContract } from './slide-contract.mjs'
const slides = await readDeckContract()
await writeFile('content/slides.json', `${JSON.stringify(slides, null, 2)}\n`)
console.log(`synced ${slides.length} deck records into content/slides.json`)
