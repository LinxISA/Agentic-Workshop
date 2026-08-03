# LinxISA Summer School 2026

两段各 75 分钟、共 76 页（第一段 35 页、第二段 41 页）、可离线运行的交互式 Slidev 教程：

> Agent 时代的体系结构研究：从空间资源、时间代价到可执行 NPU Core

课程主角始终是计算机体系结构。第一课用“芯片城市”解释达芬奇核、昇腾 SoC、存储层级、互联、容量与带宽，再用 PTO Tile 操作把空间结构转成时间成本。第二课先把 Agentic Circuit 设计成可执行的 Python 架构生成语言，再以 Qwen3-14B `q_proj` 为贯穿案例，从 PTO Trace、DaVinciOO gfsim/SimQueue 和参数搜索走到 PTO-ASL、NDF 与 pyCircuit 纵向切片。Agentic Circuit 是提出、执行和验证体系结构假设的工具，不替代体系结构判断。

核心叙事：

`空间资源 → 时间代价 → 可执行模型 → Agentic Circuit → 参数搜索 → 规范约束 → Agent 驱动实现 → 实验证据`

## 本地运行

```bash
git clone --recursive https://github.com/LinxISA/SummerSchool.git
cd SummerSchool
npm ci
npm run dev:1
npm run dev:2
```

完整离线构建与验证：

```bash
npm test
npm run export
npm run preview
```

浏览器入口为 `http://127.0.0.1:4173/`。所有运行时资源均打入 `dist/`；实验的预生成结果位于 `experiments/artifacts/`。

- Local: [http://127.0.0.1:4173/](http://127.0.0.1:4173/)
- Public: [https://linxisa.github.io/SummerSchool/](https://linxisa.github.io/SummerSchool/)

GitHub Pages 从 `main` 自动构建并发布。发布构建使用 `/SummerSchool` 作为资源与路由前缀；本地构建保持空前缀，所以同一套源码既能在根路径预览，也能部署到 organization Pages 的仓库子路径。

完整视觉检查会逐页渲染两个 deck：

```bash
npm run preview
# 另一个终端
npm run qa:render
npm run qa:contact
```

## 课程边界

- 不使用 ARM ISA 或 ARM ASL；本课程的 ASL 指 PTO 仓库内的可执行语义。
- PTO-ASL、DaVinciOO 通信扩展、gfsim 实现映射、NDF 和 pyCircuit 分属不同证据层，不互相冒充规范来源。
- `TPUT`/`TGET` 明确标为 DaVinciOO communication extensions，不属于 normative PTO-ASL。
- 562 条 Trace / 11028 cycles 是可重放 q_proj 证据；扫参只支持当前 Trace/配置下的敏感性结论，不证明硬件等价。
- ImageGen 只生成背景与概念插图；精确电路、时序、状态机、trace 和数据图均由本仓确定性代码生成。

## 目录

- `decks/session-1/`：芯片城市、Roofline、达芬奇/昇腾层级与 PTO 搬运时间
- `decks/session-2/`：Agentic Circuit、q_proj Trace、gfsim/SimQueue、扫参、PTO-ASL、NDF 与 pyCircuit
- `components/`：Slidev 交互组件
- `experiments/`：可复现实验和预生成证据
- `materials/`：课程输入材料与来源清单
- `vendor/`：固定提交的 PTO spec、pyCircuit 与既有参考 submodules
- `assets/generated/`：ImageGen 原始资产及提示词记录
- `public/generated/`：构建时使用的本地图片
- `docs/GOAL_PROMPT.md`：可直接交给 Codex Goal 的完整课件制作 prompt
- `docs/PLAN.md`：实现计划与完成标准
- `docs/`：NDF、讲师手册、学生快速上手与视觉验收记录
