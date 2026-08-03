import { copyFile, mkdir, writeFile } from 'node:fs/promises'

import { normalizeBasePath } from './pages-paths.mjs'

const prefix = normalizeBasePath(process.env.SUMMERSCHOOL_BASE_PATH ?? '')
const session1Path = `${prefix}/session-1/`
const session2Path = `${prefix}/session-2/`
const heroPath = `${prefix}/generated/main-hero.png`

await mkdir('dist', { recursive: true })
await mkdir('dist/generated', { recursive: true })
await copyFile('public/generated/main-hero.png', 'dist/generated/main-hero.png')
const html = `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>LinxISA Summer School 2026</title>
<style>body{margin:0;background:#06101d;color:#eef8ff;font:20px/1.5 system-ui,-apple-system,"PingFang SC",sans-serif}main{min-height:100vh;display:grid;place-items:center;padding:40px;background:linear-gradient(90deg,rgba(6,16,29,.97),rgba(6,16,29,.68),rgba(6,16,29,.12)),url('${heroPath}') center/cover}.wrap{width:min(980px,92vw);margin-right:auto}.eyebrow{color:#62e7ff;letter-spacing:.16em;text-transform:uppercase;font-weight:700}h1{font-size:clamp(42px,6vw,78px);line-height:1.02;letter-spacing:-.04em;margin:.2em 0}.cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin-top:42px;max-width:850px}a{color:inherit;text-decoration:none;border:1px solid #2f6074;border-radius:18px;padding:28px;background:rgba(11,27,45,.92);transition:.2s}a:hover{border-color:#62e7ff;transform:translateY(-2px)}small{color:#a9bed0}@media(max-width:720px){.cards{grid-template-columns:1fr}}</style></head>
<body><main><div class="wrap"><div class="eyebrow">LinxISA · 2026 Summer School</div><h1>Agent 时代的体系结构研究</h1><p>空间资源 → 时间代价 → 可执行模型 → Agentic Circuit → 参数搜索 → 规范约束 → Agent 驱动实现 → 实验证据<br>两段各 75 分钟，共 76 页，完全离线运行</p><div class="cards"><a href="${session1Path}"><strong>第一课 · 从城市到周期</strong><br>把芯片看作城市，再给搬运加入时间<br><small>35 页 · Roofline · 达芬奇 · 存储层级 · PTO 数据移动</small></a><a href="${session2Path}"><strong>第二课 · 从 Agentic Circuit 到 Core</strong><br>用 Python 构造架构图，再把假设变成可执行、可验证的核心<br><small>41 页 · AGC · q_proj · gfsim · PTO-ASL · NDF · pyCircuit</small></a></div></div></main></body></html>`
await writeFile('dist/index.html', html)
