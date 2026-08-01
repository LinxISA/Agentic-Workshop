# Course NDF — Normative Design Facts and Decisions

本文件是课程的设计记忆与追踪索引，不属于 PTO 规范。关键词采用 RFC 2119 风格：`MUST`/`MUST NOT` 表示课程交付硬约束，`SHOULD` 表示有充分理由才可偏离。

## 规范与边界

| ID | 课程约束 | 证据目标 |
|---|---|---|
| NDF-SRC-001 | 课程 MUST 以 `PTO-ISA/pto-spec@9574f...` 为 PTO 规范事实源。 | `materials/SOURCES.yaml` |
| NDF-SRC-002 | 课程 MUST NOT 使用 Arm ASL、Sail Arm 或 Isla。 | 内容扫描 |
| NDF-SRC-003 | 课程 MUST 把 LinxCore 表述为案例，而非 PTO 官方实现。 | 两课备注与边界页 |
| NDF-MTH-001 | 课程 MUST 使用“规范→NDF→微架构→验证→测量→Agent→决策”闭环。 | 总图、八个实验 |
| NDF-MTH-002 | 优化 Agent MUST NOT 修改独立的正确性裁判。 | intentional failure |
| NDF-MTH-003 | 研究主张 MUST 区分规范事实、实现事实、实验观察与研究假设。 | evidence slides |

## 视觉与交互

| ID | 课程约束 | 证据目标 |
|---|---|---|
| NDF-VIS-001 | 每个内容页 MUST 有至少一个有意义的视觉。 | `npm run test:content` |
| NDF-VIS-002 | ImageGen 只用于氛围背景和概念插图。 | `assets/generated/prompts.yaml` |
| NDF-VIS-003 | 精确技术图 MUST 由确定性代码生成。 | `components/` |
| NDF-INT-001 | 关键交互 SHOULD 支持 step/play/pause/reset/highlight。 | 八个 Vue 组件 |
| NDF-OFF-001 | 运行时 MUST 无远程网络依赖。 | `npm run test:offline` |

## 课程目标

| ID | 学习结果 | 课程/实验 |
|---|---|---|
| NDF-LRN-101 | 学生能判断改动属于规范、NDF、微架构还是实现层。 | Session 1 / Exp 2 |
| NDF-LRN-102 | 学生能为流水线改动选择架构观察点和等价判据。 | Session 1 / Exp 3–4 |
| NDF-LRN-201 | 学生能拆出 LinxCore 小模块及其软硬件接口契约。 | Session 2 / Exp 5–6 |
| NDF-LRN-202 | 学生能定义 Agent 动作、裁判、传感器、记忆和接受规则。 | Session 2 / Exp 7–8 |

## 追踪格式

每页备注使用：

```text
NDF-ID: NDF-...
Learning objective: ...
Duration: ...
Visual intent: ...
Evidence: experiments/artifacts/...
Interaction: ...
Caveat: ...
[Sources]
- ...
```
