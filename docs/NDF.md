# Course NDF — Normative Design Facts and Decisions

本文件记录课程自身的设计与验收约束，不属于 PTO 规范。关键词采用 RFC 2119 风格：`MUST`/`MUST NOT` 表示课程交付硬约束，`SHOULD` 表示只有充分理由才可偏离。

## 课程结构与叙事

| ID | 课程约束 | 证据目标 |
|---|---|---|
| NDF-COURSE-001 | 课程 MUST 包含两节各 75 分钟的 session，分别为 33 页与 31 页。 | `content/slides.json`、deck tests |
| NDF-COURSE-002 | Session 1 MUST 按“城市→DaVinci/Ascend→存储/互连→PTO 数据搬运时间”推进。 | `decks/session-1/slides.md` |
| NDF-COURSE-003 | Session 2 MUST 按“Qwen3-14B q_proj→PTO Trace→DaVinciOO gfsim/SimQueue→参数敏感性→PTO-ASL→NDF→pyCircuit vertical slice→证据飞轮”推进。 | `decks/session-2/slides.md` |
| NDF-COURSE-004 | 全课程 MUST 使用“空间资源→时间代价→可执行模型→参数搜索→规范约束→Agent 驱动实现→实验证据”作为核心因果链。 | 首页、章节转场、S64 |
| NDF-COURSE-005 | 课程 MUST NOT 使用 Arm ASL，也不得把旧的通用处理器案例放回观众可见主线。 | 内容扫描 |

## 语义、模型与证据边界

| ID | 课程约束 | 证据目标 |
|---|---|---|
| NDF-SRC-001 | PTO 语义主张 MUST 以仓内固定版本的 `vendor/pto-spec` 为规范事实源。 | `materials/SOURCES.yaml` |
| NDF-SRC-002 | `TLOAD`、`TMOV`、`TEXTRACT`、`TPUSH`、`TPOP` 的软件可见 effect MUST 归于 normative PTO-ASL。 | S30、S59 与来源备注 |
| NDF-SRC-003 | `TPUT/TGET` MUST 标为 DaVinciOO communication extensions，并 MUST NOT 表述为 normative PTO-ASL。 | S30、S33、S59、内容扫描 |
| NDF-MODEL-001 | DaVinciOO gfsim 的 opcode 路由、SimQueue、资源数量和时间公式 MUST 表述为实现或教学模型，不得升级为 PTO 规范。 | S42–S47 |
| NDF-MODEL-002 | NDF MUST 表述为课程采用的设计与验收追踪方法，不得表述为 PTO 官方格式。 | S60、本文 |
| NDF-MODEL-003 | pyCircuit MUST 表述为 canonical implementation source surface，不得表述为 RTL 或 silicon。 | S62–S63 |
| NDF-MTH-001 | 优化 Agent MUST NOT 修改独立的语义或正确性裁判。 | S62–S64、intentional failure |

## q_proj 实验证据

| ID | 课程约束 | 证据目标 |
|---|---|---|
| NDF-EVD-001 | 默认 q_proj artifact MUST 标为 `reference_replay`。 | `experiments/artifacts/11/qproj_summary.json` |
| NDF-EVD-002 | 课程 MUST 准确陈述 checked artifact 为 562 records，当前 DaVinciOO gfsim replay 重现 11028 cycles。 | S50、qproj summary |
| NDF-EVD-003 | 课程 MUST 明确 fresh PTO capture 尚未完成，不得把 replay 描述为新 capture。 | S50、presenter docs |
| NDF-EVD-004 | 参数 sweep MUST 标为 one-factor-at-a-time sensitivity only；不得据此宣称结构等价、绝对周期等价、PPA 最优或普遍规律。 | S48、S50、qproj sweep |
| NDF-EVD-005 | gfsim 与 pyCircuit 只有在建立 calibration contract 后才可比较绝对周期；此前只比较覆盖、顺序、资源趋势、错误和性能包络。 | S63 |

## 视觉、交互与离线交付

| ID | 课程约束 | 证据目标 |
|---|---|---|
| NDF-VIS-001 | 每页 MUST 有独立、本地打包的全屏视觉；精确标签、连线、公式、时序和数据 MUST 使用确定性 HTML/SVG/Vue。 | image manifest、content tests |
| NDF-VIS-002 | Image Gen MUST NOT 生成文字、数字、公式、logo、watermark、伪文字或精确电路连线。 | `assets/generated/prompts.yaml` |
| NDF-VIS-003 | 34 个 Keynote source pages MUST 各映射一次并保持可见内容；其余页面使用单独审查的 v2 视觉。 | blueprint、image manifest |
| NDF-INT-001 | 交互 MUST 改变体系结构变量或证据视图，并揭示可解释后果。 | component tests |
| NDF-OFF-001 | 运行时 MUST 无远程网络依赖。 | `npm run test:offline` |
| NDF-OFF-002 | 课程 MUST 提供 `/`、`/session-1/1..33` 与 `/session-2/1..31` 路由及键盘导航。 | route、keyboard tests |

## 学习结果

| ID | 学习结果 | 课程证据 |
|---|---|---|
| NDF-LRN-101 | 学生能用计算、存储、互连、并发和控制描述空间资源。 | Session 1 S05–S23 |
| NDF-LRN-102 | 学生能把延迟、带宽、排队和同步换算为数据搬运周期。 | Session 1 S24–S33 |
| NDF-LRN-201 | 学生能沿 q_proj 的 PTO Trace 解释 SimQueue、gfsim 路由和 system time。 | Session 2 S38–S47 |
| NDF-LRN-202 | 学生能区分 replay observation、parameter sensitivity、normative semantics 与 implementation contract。 | Session 2 S48–S63 |
| NDF-LRN-203 | 学生能定义 Agent 的候选修改、独立裁判、artifact 和停止条件。 | Session 2 S62–S64 |

## 追踪格式

每页备注使用：

```text
Slide-ID: S..
Objective: ...
Timing: ... min
Visual: ...
Interaction: ...
Sources: ...
Boundary: ...
Narrative: ...
Transition: ...
```
