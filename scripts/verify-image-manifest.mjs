import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const manifest = JSON.parse(await readFile('assets/generated/prompts.yaml', 'utf8'))
const errors = []
const expectedSlides = Array.from({ length: 56 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`)
const newSlides = new Set(['S18', 'S28', ...Array.from({ length: 13 }, (_, index) => `S${index + 30}`), ...Array.from({ length: 7 }, (_, index) => `S${index + 50}`)])
const sourcePageBySlide = new Map([
  ...Array.from({ length: 17 }, (_, index) => [`S${String(index + 1).padStart(2, '0')}`, index + 1]),
  ...Array.from({ length: 9 }, (_, index) => [`S${index + 19}`, index + 18]),
  ['S29', 27],
  ...Array.from({ length: 7 }, (_, index) => [`S${index + 43}`, index + 28]),
])

const fail = message => errors.push(message)
const digest = bytes => createHash('sha256').update(bytes).digest('hex')
const dimensions = bytes => ({ width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) })

if (manifest.schema_version !== 2) fail('manifest schema_version must be 2')
if (!Array.isArray(manifest.assets)) fail('manifest assets must be an array')

const assets = Array.isArray(manifest.assets) ? manifest.assets : []
const actualSlides = assets.map(item => item.slide).sort()
if (JSON.stringify(actualSlides) !== JSON.stringify(expectedSlides)) fail('slide IDs must be exactly S01-S56')
if (new Set(assets.map(item => item.asset)).size !== 56) fail('all 56 asset filenames must be unique')

for (const item of assets) {
  const expectedSourcePage = sourcePageBySlide.get(item.slide) ?? null
  if (item.page !== Number(item.slide?.slice(1))) fail(`${item.slide}: page must match slide ID`)
  if (typeof item.use !== 'string' || item.use.trim().length === 0) fail(`${item.slide}: use is missing`)
  if (typeof item.prompt !== 'string' || item.prompt.length < 40) fail(`${item.slide}: prompt/render contract is missing`)
  if (!/^2026-\d{2}-\d{2}$/.test(item.date)) fail(`${item.slide}: invalid date`)
  if (item.review !== 'pass') fail(`${item.slide}: review must be pass`)
  if (item.source_page !== expectedSourcePage) fail(`${item.slide}: source page must be ${expectedSourcePage ?? 'null'}`)
  if (item.path !== `assets/generated/slides/${item.asset}` || item.final_path !== item.path) fail(`${item.slide}: invalid project path`)
  if (item.runtime_path !== `public/generated/slides/${item.asset}` || /^(?:https?:)?\/\//.test(item.runtime_path)) fail(`${item.slide}: invalid runtime path`)

  if (newSlides.has(item.slide)) {
    if (item.generator !== 'OpenAI ImageGen' || item.generation_batch !== 'v2') fail(`${item.slide}: must be a v2 ImageGen record`)
    if (item.provenance_status !== 'original_prompt_only' || item.original_prompt_available !== true || item.original_call_metadata_available !== false) fail(`${item.slide}: must preserve original-prompt-only v2 provenance`)
  } else if (item.slide === 'S01') {
    if (item.generator !== 'OpenAI ImageGen') fail('S01: generator must remain OpenAI ImageGen')
    if (item.provenance_status !== 'legacy_asset_prompt_reconstructed' || item.original_call_metadata_available !== false) fail('S01: legacy prompt provenance must remain explicit')
  } else if (item.generator !== 'Keynote PDF render') {
    fail(`${item.slide}: source-mapped bitmap must be a Keynote PDF render`)
  }

  const [projectBytes, runtimeBytes] = await Promise.all([
    readFile(item.final_path).catch(() => null),
    readFile(item.runtime_path).catch(() => null),
  ])
  if (!projectBytes || !runtimeBytes) {
    if (!projectBytes) fail(`${item.slide}: missing ${item.final_path}`)
    if (!runtimeBytes) fail(`${item.slide}: missing ${item.runtime_path}`)
    continue
  }
  if (digest(projectBytes) !== item.sha256 || digest(runtimeBytes) !== item.sha256) fail(`${item.slide}: project/public SHA256 differs from manifest`)
  if (JSON.stringify(dimensions(projectBytes)) !== JSON.stringify({ width: item.width, height: item.height })) fail(`${item.slide}: project dimensions differ from manifest`)
  if (JSON.stringify(dimensions(runtimeBytes)) !== JSON.stringify({ width: item.width, height: item.height })) fail(`${item.slide}: public dimensions differ from manifest`)
  const expectedDimensions = item.generator === 'Keynote PDF render' ? [1920, 1080] : [1672, 941]
  if (item.width !== expectedDimensions[0] || item.height !== expectedDimensions[1]) fail(`${item.slide}: unexpected generator dimensions`)
}

const sourcePages = assets.filter(item => item.source_page !== null).map(item => item.source_page).sort((a, b) => a - b)
if (JSON.stringify(sourcePages) !== JSON.stringify(Array.from({ length: 34 }, (_, index) => index + 1))) fail('Keynote mappings must cover K01-K34 exactly once')
if (assets.filter(item => item.generator === 'Keynote PDF render').length !== 33) fail('expected 33 literal Keynote PDF renders plus the S01 source-mapped ImageGen cover')
if (assets.filter(item => item.generation_batch === 'v2').length !== 22) fail('expected exactly 22 v2 ImageGen records')

if (errors.length) {
  for (const error of errors) console.error(error)
  process.exit(1)
}

console.log('verified 56 paired offline image records: 34 Keynote mappings (33 exact renders + S01 cover) and 22 original v2 prompt records')
