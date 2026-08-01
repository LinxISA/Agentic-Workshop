# LinxISA Summer School 2026

两段各 60 分钟、可离线运行的交互式 Slidev 教程：

> Agent 时代的体系结构研究：pyCircuit 与工具驱动的芯片设计方法学

课程以 `PTO-ISA/pto-spec` 的 PTO executable architecture spec 为规范事实源，把 NDF 作为课程中的可追踪设计投影，以 pyCircuit 和 LinxCore 展示模块化微架构、软硬件协同、验证证据与设计空间探索。

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

## 课程边界

- 不使用 Arm ASL、Sail Arm 或 Isla。
- PTO-AS/ASL1 统一称为“PTO executable architecture spec”。
- NDF、pyCircuit、LinxCore、PPA 与 Agent 闭环是本课程的研究方法层，不冒充 PTO 规范组成。
- LinxCore 是模块化处理器与软硬件协同案例，不宣称是 PTO 的官方实现。
- ImageGen 只生成背景与概念插图；精确电路、时序、状态机、trace 和数据图均由本仓确定性代码生成。

## 目录

- `decks/session-1/`：规范、NDF、pyCircuit 与证据闭环
- `decks/session-2/`：LinxCore、软硬件协同与 Agent 设计探索
- `components/`：Slidev 交互组件
- `experiments/`：可复现实验和预生成证据
- `materials/`：课程输入材料与来源清单
- `vendor/`：固定提交的 PTO spec、pyCircuit 和 LinxCore submodules
- `assets/generated/`：ImageGen 原始资产及提示词记录
- `public/generated/`：构建时使用的本地图片
- `docs/`：NDF、讲师手册、学生快速上手与视觉验收记录
