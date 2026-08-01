# LinxISA Summer School 2026

两段各 60 分钟、可离线运行的交互式 Slidev 教程：

> Agent 时代的体系结构研究：从 Roofline、访存层级到可执行微架构模型

课程主角是计算机体系结构：第一课从工作负载、Roofline、局部性、访存层级、并发和片上数据流建立宏观性能模型；第二课进入 LinxCore 的前端、调度、执行、访存、提交和背压，再用 NDF、pyCircuit 与可复现实验形成证据闭环。Agentic Circuit 是建模与探索工具，不是课程研究对象。

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

完整视觉检查会逐页渲染两个 deck：

```bash
npm run preview
# 另一个终端
npm run qa:render
npm run qa:contact
```

## 课程边界

- 不使用 Arm ASL、Sail Arm 或 Isla。
- PTO-AS/ASL1 统一称为“PTO executable architecture spec”。
- NDF、pyCircuit、LinxCore、PPA 与 Agent 闭环是本课程的研究方法层，不冒充 PTO 规范组成。
- LinxCore 是模块化处理器与软硬件协同案例，不宣称是 PTO 的官方实现。
- ImageGen 只生成背景与概念插图；精确电路、时序、状态机、trace 和数据图均由本仓确定性代码生成。

## 目录

- `decks/session-1/`：Roofline、局部性、访存层级、NoC 与 Tile 数据流
- `decks/session-2/`：LinxCore 微架构、NDF、pyCircuit、实验与 Pareto 探索
- `components/`：Slidev 交互组件
- `experiments/`：可复现实验和预生成证据
- `materials/`：课程输入材料与来源清单
- `vendor/`：固定提交的 PTO spec、pyCircuit 和 LinxCore submodules
- `assets/generated/`：ImageGen 原始资产及提示词记录
- `public/generated/`：构建时使用的本地图片
- `docs/GOAL_PROMPT.md`：可直接交给 Codex Goal 的完整课件制作 prompt
- `docs/PLAN.md`：实现计划与完成标准
- `docs/`：NDF、讲师手册、学生快速上手与视觉验收记录
