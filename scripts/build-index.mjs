import { copyFile, mkdir, writeFile } from 'node:fs/promises'

await mkdir('dist', { recursive: true })
await mkdir('dist/generated', { recursive: true })
await copyFile('public/generated/main-hero.png', 'dist/generated/main-hero.png')
const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LinxISA Summer School 2026</title>
<style>body{margin:0;background:#06101d;color:#eef8ff;font:20px/1.5 system-ui,-apple-system,"PingFang SC",sans-serif}main{min-height:100vh;display:grid;place-items:center;padding:40px;background:linear-gradient(90deg,rgba(6,16,29,.97),rgba(6,16,29,.68),rgba(6,16,29,.12)),url('./generated/main-hero.png') center/cover}.wrap{width:min(980px,92vw);margin-right:auto}.eyebrow{color:#62e7ff;letter-spacing:.16em;text-transform:uppercase;font-weight:700}h1{font-size:clamp(42px,6vw,78px);line-height:1.02;letter-spacing:-.04em;margin:.2em 0}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin-top:42px;max-width:850px}a{color:inherit;text-decoration:none;border:1px solid #2f6074;border-radius:18px;padding:28px;background:rgba(11,27,45,.92);transition:.2s}a:hover{border-color:#62e7ff;transform:translateY(-2px)}small{color:#a9bed0}@media(max-width:720px){.cards{grid-template-columns:1fr}}</style></head>
<body><main><div class="wrap"><div class="eyebrow">LinxISA · 2026 Summer School</div><h1>Agent 时代的<br>体系结构研究</h1><p>pyCircuit 与工具驱动的芯片设计方法学 · 两段各 60 分钟 · 完全离线</p><div class="cards"><a href="./session-1/"><strong>第一课</strong><br>从可执行规范到可审计微架构<br><small>PTO · NDF · pyCircuit · evidence</small></a><a href="./session-2/"><strong>第二课</strong><br>从 LinxCore 模块到 Agent 设计空间<br><small>HW/SW codesign · trace · Pareto</small></a></div></div></main></body></html>`
await writeFile('dist/index.html', html)
