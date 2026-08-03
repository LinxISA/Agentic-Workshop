# Goal Prompt：体系结构优先的 56 页交互式 Summer School 课程

复制本文件从“你是……”开始的全部内容，作为可复用的 Codex Goal prompt。

---

你是本仓课程总导演、计算机体系结构研究者、技术写作者和 Slidev 工程师。请实现并验证一套中文、全屏、离线可运行的 Summer School 课程：

> **Agent 时代的体系结构研究**

课程由两节各 75 分钟、各 28 页的 session 组成。核心叙事必须始终是：

`空间资源 → 时间代价 → 可执行模型 → 参数搜索 → 规范约束 → Agent 驱动实现 → 实验证据`

Session 1 从处理器城市与仓库隐喻出发，经 DaVinci/Ascend 教学抽象、存储与互连进入 PTO 数据搬运时间。Session 2 用 Qwen3-14B `q_proj` 贯穿 PTO Trace、DaVinciOO gfsim/SimQueue、参数敏感性、PTO-ASL、NDF、pyCircuit vertical slice 和 Architecture research Agent flywheel。

Agentic Circuit/Agent 是研究工具，不是课程主角。不得使用 Arm ASL，也不得把旧的通用处理器案例放回观众可见主线。

## 1. 不可变交付约束

1. `decks/session-1/slides.md` 与 `decks/session-2/slides.md` 各包含 28 页；备注中的分钟数各合计 75。
2. 页面路由必须是 `/`、`/session-1/1..28` 与 `/session-2/1..28`；`/session-1` 和 `/session-2` 重定向到对应目录入口。
3. 每页采用 16:9 全屏构图。观众层只保留一个标题、一个核心结论和必要标签；禁止 Markdown 文字墙、卡片墙和工具功能清单。
4. 保留演讲人提供的 Keynote source pages 1–34，每页只映射一次：S01 使用经批准的课程封面视觉；source pages 2–34 使用 1920×1080 精确本地渲染，不改写可见文字、数字、标点、图形或排版。
5. 新增或重绘页面各使用一张独立、已审查的 Image Gen 全屏背景。精确标签、模块边界、连线、公式、坐标、时序、trace 和实验数据必须由 HTML/SVG/Vue 确定性绘制。
6. 所有图片保存到 `assets/generated/slides/`，同步到 `public/generated/slides/`，并在 `assets/generated/prompts.yaml` 记录生成器、prompt/source-render contract、日期、来源风格、最终路径、runtime 路径、review、regenerated 和 hash。
7. 所有网页、字体、图片、组件、数据与 replay artifact 必须离线运行；禁止 CDN、远程字体、运行时 iframe、远程图片或必需联网的 API。
8. 每页备注必须包含 `Slide-ID`、`Objective`、`Timing`、`Visual`、`Interaction`、`Sources`、`Boundary`、`Narrative` 和 `Transition`。

## 2. 语义与证据边界

- PTO-ASL 是 normative 语义权威。`TLOAD`、`TMOV`、`TEXTRACT`、`TPUSH`、`TPOP` 的软件可见 effect 以仓内固定版本 `vendor/pto-spec` 为准。
- `TPUT/TGET` 必须逐次标注为 **DaVinciOO communication extensions — not normative PTO-ASL**。
- DaVinciOO gfsim 的 opcode 路由、SimQueue、资源数量和 timing model 属于实现或教学模型，不是 PTO 规范。
- NDF 是设计意图、契约、机制和可执行验收的课程追踪方法，不是 PTO 官方格式。
- pyCircuit 是 canonical implementation source surface，不是 RTL 或 silicon。
- q_proj checked artifact 的模式是 `reference_replay`，含 562 条 trace records；当前重建的 DaVinciOO gfsim replay 重现 11028 cycles。
- fresh PTO capture 尚未完成。不得把 checked artifact 描述为新 capture，不得用 replay 代替来源边界。
- 参数 sweep 是 one-factor-at-a-time sensitivity only。它可以指出候选方向，不能证明结构等价、绝对周期等价、PPA 最优或普遍规律。
- gfsim 与 pyCircuit 在建立 calibration contract 前，只比较 coverage、order、resource trends、errors 和 performance envelope。

## 3. 视觉与 Image Gen 规则

视觉基线：深海军蓝背景，青色表示数据路径，暖黄表示计算，酸橙绿表示存储，少量洋红表示瓶颈。镜头节奏遵循“全景→放大→剖面→数据流→时间线→实验证据”。

每个新增页面的 Image Gen prompt 使用以下前缀，再追加页面蓝图中的 scene brief：

```text
Use case: scientific-educational.
Asset type: full-bleed 16:9 computer-architecture lecture background, composed for 1920x1080.
Style: cinematic industrial semiconductor visualization, premium keynote, dark navy, technically grounded.
Composition: one coherent processor-architecture scene, one strong focal structure, controlled depth, calm title zone, clear room for deterministic foreground overlays.
Palette: electric cyan data movement, warm yellow compute, lime memory, sparse magenta bottleneck, off-white highlights.
Materials: silicon die, copper interconnect, matte package substrate, glass-like data volumes, restrained bloom, high projection contrast.
Constraints: no text, letters, numbers, equations, charts, labels, logos, watermarks, people, humanoid robots, pseudo-writing, exact circuit wiring, decorative neon spaghetti, dense HUDs, fantasy components, or multiple competing focal points.
Technical contract: the raster supplies atmosphere, spatial metaphor, material and composition only; code supplies every exact architecture claim.
```

每次生成后用 `view_image` 检查：主体与 scene brief 是否一致、16:9 全屏构图是否成立、标题区是否安静、是否出现伪文字、颜色编码是否一致、叠加区是否可读。每次重生成只修一个明确问题。项目不得引用只存在于临时生成目录的图片。

对 source-render 页面不得调用 Image Gen 重画。通过 Keynote PDF 导出并栅格化到精确 1920×1080，保持全部可见内容；网页增强只能添加不遮挡原内容的轻量 focus overlay。

## 4. 逐页蓝图

### Session 1 · 城市、空间资源与数据搬运时间 · 75 分钟

| 页 | 分钟 | 标题与教学任务 | 视觉/互动合同 |
|---:|---:|---|---|
| 1 | 1 | **Agent时代体系结构研究**：先问空间资源与时间代价，再谈 Agent。 | 经批准的 Ascend 风格课程封面；确定性课程标题与边界。 |
| 2 | 2 | **自我介绍**：保持演讲人姓名与原稿信息。 | Keynote source page 2 精确渲染；口头补充。 |
| 3 | 2 | **本次暑期学校课程**：定义“什么是计算体系结构”。 | source page 3；指出计算、内存、互连与编程关系。 |
| 4 | 1 | **计算机体系结构-处理器**：第一章转场。 | source page 4；不加新主张。 |
| 5 | 3 | **农业时代·小农经济**：用一次工作往返解释 Von Neumann bottleneck。 | source page 5；沿村庄、道路、农田和指令卷轴讲解。 |
| 6 | 3 | **工业时代**：时间局部性与空间局部性。 | source page 6；沿运输路径解释复用机会。 |
| 7 | 2 | **工业时代·社会主义**：共享层级与并行 Lane。 | source page 7；从计算 Lane 追到内存总仓。 |
| 8 | 4 | **仓库管理：Roofline Model**：运力触顶后增加算力无效。 | source page 8 + 确定性 Roofline；调 Peak、BW、AI、Hit 并跨越 ridge point。 |
| 9 | 3 | **达芬奇文艺复兴**：Tile/CUBE 与本地仓库。 | source page 9；追踪 Left、Right、ACC Tile 与标注带宽路径。 |
| 10 | 3 | **CUBE核设计**：数据供给与计算闭环。 | source page 10；从输入追到 CUBE、层级仓库与 HBM。 |
| 11 | 3 | **达芬奇架构设计**：计算、搬运与共享仓库协同。 | source page 11；比较两条路径的汇合点。 |
| 12 | 2 | **工业时代·城市化**：复制、集中调度与统一规格。 | source page 12；城市只是教学隐喻。 |
| 13 | 3 | **昇腾950处理器**：教学抽象，不是产品框图。 | source page 13；沿核、共享缓存、NoC 与 I/O 找边界。 |
| 14 | 3 | **SoC规划**：从资源分区追到共享路径。 | source page 14；切换 NPU、CPU、NoC/共享缓存、DDR/I/O focus。 |
| 15 | 2 | **信息时代·城市化**：电梯连接不同规模的存储空间。 | source page 15；比较同层与跨层访问资源。 |
| 16 | 4 | **信息时代·Transformer**：Q、K、V 与 Tile 数据流。 | source page 16；追踪矩阵计算、向量处理和中间结果驻留。 |
| 17 | 2 | **信息时代·国际化**：芯片间通信也是体系结构资源。 | source page 17；比较延迟、带宽与批量化。 |
| 18 | 4 | **体系结构的五个坐标**：计算、存储、互连、并发、控制共同解释性能。 | Image Gen scene：俯视芯片城市及五个可辨资源区；`ArchitectureCoordinate` 逐项提出证据问题。 |
| 19 | 2 | **第二章·空间和时间**：从资源布局进入周期代价。 | source page 18；章节转场。 |
| 20 | 4 | **什么是芯片的一天？**：时间 × 频率 = 周期数。 | source page 19 + 确定性换算器；切换 ps/ns/day 与 MHz/GHz。 |
| 21 | 4 | **计算获取数据天数**：层级越远，等待跨度越大。 | source page 20 + 层级模型；调 L1/L2 hit rate。 |
| 22 | 2 | **远程访问**：RDMA 与 RPC 扩大时间尺度。 | source page 21；定位 ns→μs 的边界。 |
| 23 | 2 | **PTO：Parallel Tile Operation**：从 Scalar Operation 到 Tile Operation。 | source page 22；比较 32-bit scalar 与 8KB–16KB Tile 粒度。 |
| 24 | 2 | **不同形状的集装箱**：形状、布局与调度共同定义 Tile。 | source page 23；比较 8×8、长条和子区域分块。 |
| 25 | 4 | **PTO 抽象执行机器**：操作语义路由到不同资源。 | source page 24 + `PtoMachineExplorer`；切换 TLOAD、TMOV、TEXTRACT、TPUSH/TPOP、TPUT/TGET，并显式隔离通信扩展。 |
| 26 | 2 | **抽象执行机器与程序**：程序语义与机器资源相互映射。 | source page 25；追踪 load/matmul/extract/store 的状态读写。 |
| 27 | 2 | **TLOAD TSTORE**：Tensor → Tile → Layout。 | source page 26；区分 Tensor 选择、Tile 分块与 Layout 排列。 |
| 28 | 4 | **数据搬运时间实验**：总时间 = 固有搬运 + 排队 + 同步。 | Image Gen scene：数据块穿过 Tile、链路、队列与同步门；`TransferTimeLab` 调操作、数据量、Tile 容量、带宽与排队成本。 |

### Session 2 · q_proj、可执行模型与证据飞轮 · 75 分钟

| 页 | 分钟 | 标题与教学任务 | 视觉/互动合同 |
|---:|---:|---|---|
| 1 | 1 | **Agentic Model**：第三章转场，以一个 q_proj 贯穿模型与证据。 | Keynote source page 27。 |
| 2 | 3 | **q_proj：从 Transformer 到一次 BF16 投影**：activation × weight → GEMM → output。 | Image Gen scene：Transformer block 放大到单一 q_proj 数据路径；确定性 shape/dtype/layout 链。 |
| 3 | 3 | **从 Python 到周期模型**：pypto-lib→`.pto`→PTOAS→host Trace Runner→`.pto.trace`→gfsim。 | Image Gen scene：六层透明编译/执行通道；确定性中间产物链。 |
| 4 | 3 | **q_proj 展开成可调度事件**：TASSIGN、TEXTRACT、TLOAD、TMATMUL、TMATMUL_ACC、TSTORE。 | Image Gen scene：矩阵投影展开为事件与依赖；确定性 opcode/deps。 |
| 5 | 3 | **一条 trace 记录的解剖**：sequence_id、opcode、Tile 属性和 deps。 | Image Gen scene：单条 JSONL 记录置于数据流显微镜中；`TraceAnatomy` 逐字段导航。 |
| 6 | 3 | **SimQueue**：pending、visible、capacity 与 backpressure。 | Image Gen scene：带容量与时间闸门的硬件队列；`SimQueueExplorer` 调容量/延迟并单周期推进。 |
| 7 | 3 | **DaVinci gfsim 高层拓扑**：TraceSource、ROB、Rename、Dispatch、ReadyTable、IQ、执行资源和 wakeup。 | Image Gen scene：队列网络与四类执行区；`DaVinciTopology` 查看 opcode 路由。 |
| 8 | 3 | **三类执行时间模型**：搬运、矩阵计算与固定/分类延迟都是可替换假设。 | Image Gen scene：TMA、Cube、Vector/Scalar 三类时间尺度；确定性公式与参数。 |
| 9 | 3 | **Opcode 到执行资源的确定性路由**：实现映射不等于规范语义。 | Image Gen scene：trace 分流到 Scalar/Vector/Cube/TMA；确定性路由表。 |
| 10 | 3 | **一次只推进一个周期**：dispatch→ready→issue→execute→complete→retire。 | Image Gen scene：单周期状态机剖面；`CyclePlayback` 支持按钮、Space/→、Home。 |
| 11 | 3 | **Intrinsic latency 不等于 system time**：等待、争用、容量、重叠与 critical path。 | Image Gen scene：短执行段被长依赖链和排队包围；确定性 gap decomposition。 |
| 12 | 3 | **参数搜索**：找敏感方向，不制造等价。 | Image Gen scene：ROB、Tile tags、TMA BW、Cube MACs 与 engine count 旋钮；`ParameterSweep` 读取本地 artifact。 |
| 13 | 3 | **离线时间线**：证据必须可浏览。 | Image Gen scene：多执行引擎时间通道；`EvidenceTimeline` 按 opcode/engine 过滤本地 CSV。 |
| 14 | 3 | **q_proj 实验**：准确陈述 562 records、11028 cycles、reference replay 与 fresh capture 未完成。 | Image Gen scene：候选设计点与审计证据台；确定性 evidence strip。 |
| 15 | 1 | **NPU Core for PTO**：第四章转场，把模型参数转成实现约束。 | Keynote source page 28。 |
| 16 | 2 | **分层调度**：不同粒度需要不同决策。 | source page 29；不追加当前实现结论。 |
| 17 | 2 | **PTO 多级调度层次**：区分意图、约束与调度动作。 | source page 30。 |
| 18 | 2 | **PTO / MLIR 源码表达**：区分程序意图、dialect 与实现映射。 | source page 31；不声称已用当前工具链重编译。 |
| 19 | 2 | **历史源稿性能结果**：历史 source result 不等于本课程 replay。 | source page 32；清楚标出来源年代与边界。 |
| 20 | 2 | **Swizzle**：逻辑 Tile layout 与物理访问分布。 | source page 33；不推断未核实细节。 |
| 21 | 2 | **Swizzle 容量与性能**：讨论可能因果链，不把历史数值标为当前测量。 | source page 34。 |
| 22 | 3 | **从模型结果到设计约束**：把敏感参数落到容量、端口、队列、带宽或延迟契约。 | Image Gen scene：参数旋钮收束为工程契约；确定性 resource/metric/failure 三列。 |
| 23 | 3 | **PTO-ASL 是语义权威**：实现可改变时序，不能改变软件可见 effect。 | Image Gen scene：稳定语义核心与可变实现外壳；确定性 normative/extension 分区。 |
| 24 | 3 | **NDF：从意图到可执行验收**：L0 intent→L1 contract→L2 mechanism→L3 acceptance。 | Image Gen scene：四层可追踪设计堆栈；确定性 refines/verifies/derived-from。 |
| 25 | 3 | **q_proj vertical slice**：稳定 ID、接口、状态所有者与验收边界。 | Image Gen scene：同一 sequence_id 穿过 Trace、Tile Register、TMA、Vector、Cube 与乱序窗口。 |
| 26 | 3 | **Agent 协作落到 pyCircuit**：spec、model、implementation、verification 围绕同一 NDF/trace。 | Image Gen scene：四条协作路径汇聚到 canonical source；确定性职责和 artifact。 |
| 27 | 4 | **同一 trace，两个模型，分层比较**：先比较 coverage/order/trends/errors/envelope。 | Image Gen scene：trace 分叉到 gfsim 与 pyCircuit，再汇入比较门；`ClosedLoopVerification` 提供 calibration gate。 |
| 28 | 3 | **Architecture research Agent flywheel**：问题→PTO→Trace→Model→Explore→ASL/NDF→pyCircuit→Evidence→新问题。 | Image Gen scene：围绕芯片与证据的闭环飞轮；确定性节点、artifact 与停止条件。 |

## 5. 互动与导航合同

- 全局：`→`/`Space` 前进，`←` 后退，`J`/`K` 直接翻页，`F` 全屏，`O` 总览，`?` 打开帮助，`Esc` 关闭帮助。
- 输入框、下拉框、滑杆或 `contenteditable` 获得焦点时，不得触发全局翻页。
- 单周期组件的 `Space`/`→` 每次只推进一个周期，`Home` 重置。
- 所有互动必须改变体系结构变量、状态或证据过滤条件，并显示可解释后果；不得使用装饰性 carousel。
- 支持 `prefers-reduced-motion`，并确保静态状态仍能传达完整结论。

## 6. 实验与运行模式

默认执行：

```bash
bash experiments/smoke.sh
```

11 个实验必须按预期通过，其中 intentional failure 的预期非零退出必须由统一 runner 判为通过。Experiment 11 默认使用 deterministic `reference_replay`，输出 q_proj summary、sweep、timeline 和 trace sample。

live environment mode 只能读取环境变量显式指定的本地 DaVinciOO、gfsim、PTO/PTO Trace 和工具路径；不得提交绝对路径，不得静默回退，不得覆盖 reference artifact。live 输出标为 `live_run` 并写入独立目录。

## 7. 验收与停止条件

完成前依次运行并读取结果：

```bash
npm run test:sources
npm run test:course
npm run test:blueprint
npm run test:images
npm run test:models
bash experiments/smoke.sh
npm run traceability
npm run test:content
npm run build
npm run test:offline
npm run export
```

随后保持 `npm run preview` 在本地运行，并在另一终端执行 `npm run test:preview`。

必须满足：

- 两节课各 28 页、各 75 分钟，核心叙事和页面顺序与本蓝图一致；
- 34 个 Keynote source pages 都有唯一、可审计映射，新增视觉均有本地资产与 provenance；
- 所有语义、实现、教学模型和实验观察的边界准确；
- 所有精确图、数值和交互均可由代码审查和测试；
- `/`、两个 session 的 `1..28` 页面、键盘操作、PDF 和 replay 在断网环境可用；
- 1920×1080 与 1366×768 渲染无溢出、裁切、遮挡、缺图、低对比或远程请求；
- q_proj artifact 仍准确标为 `reference_replay`，fresh PTO capture 缺口和 sensitivity 边界没有被隐去；
- 所有测试和导出成功，或明确记录无法运行的外部 live-environment 验证缺口。

达到这些条件后停止；不要把课程扩展为产品介绍、工具教程或未经证据支持的体系结构结论。
