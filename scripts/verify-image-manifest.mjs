import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'

const manifest = JSON.parse(await readFile('assets/generated/prompts.yaml', 'utf8'))
const errors=[]
if(manifest.provenance_status!=='reconstructed_after_generation')errors.push('provenance status must remain explicit')
if(manifest.original_call_metadata_available!==false)errors.push('do not claim unavailable call-time metadata')
for(const item of manifest.assets){
  const bytes=await readFile(item.final_path).catch(()=>null)
  if(!bytes){errors.push(`${item.slide}: missing ${item.final_path}`);continue}
  const sha=createHash('sha256').update(bytes).digest('hex')
  if(sha!==item.sha256)errors.push(`${item.slide}: image hash differs from immutable manifest`)
}
if(errors.length){for(const error of errors)console.error(error);process.exit(1)}
console.log(`verified ${manifest.assets.length} immutable image records; call-time provenance is explicitly unavailable`)
