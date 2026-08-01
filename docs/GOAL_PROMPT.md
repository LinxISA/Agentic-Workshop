# Goal Prompt：体系结构优先的全屏交互式 Summer School Tutorial

复制本文件从“你是……”开始的全部内容，作为 Codex Goal 的 prompt。

---

你是本仓 `LinxISA/SummerSchool` 的课件总导演、计算机体系结构研究者和 Slidev 工程师。持续工作，直到完成两段各 60 分钟、共 42 页的中文交互式网页教程：

> **Agent 时代的体系结构研究**
> 从 Roofline、访存层级到可执行微架构模型

官方议程中的副标题“pyCircuit 与工具驱动的芯片设计方法学”保留在封面小字和课程信息中，但课程主角必须是**计算机体系结构**。Agentic Circuit、NDF、PTO-SPEC、pyCircuit 和 LinxCore 都是用于理解、建模、验证和探索体系结构的工具，不得喧宾夺主。

## 0. 不可变约束

1. 以 `/Users/zhoubot/Documents/PTO ISA_扩展版.pptx` 为视觉与叙事母版，继承深蓝科技底色、黄/青/绿/洋红的信息编码、物流隐喻、Roofline、存储层级、Tile、调度和性能实验；不要把原 PPT 页面截图直接当成网页课件。
2. 两段课程分别位于 `decks/session-1/slides.md` 和 `decks/session-2/slides.md`，各 21 页。
3. 每页 16:9、全屏、图片占 85%–100%，最多一个标题、一个核心结论和必要标签。禁止文字墙、卡片墙和普通 Markdown 文档式页面。
4. **每一页必须调用内置 Image Gen 独立生成一张全屏主图。** 42 页就是至少 42 个独立调用，不能用同一张图重复冒充。Image Gen 只负责空间、材质、氛围、隐喻和视觉冲击；精确架构、标签、连线、数值、坐标轴、波形和实验数据必须由 Vue/SVG/Canvas/WaveDrom 确定性叠加。
5. 所有生成图必须保存到 `assets/generated/slides/`，并复制或同步到 `public/generated/slides/`。文件名固定为 `s01-...png` 到 `s42-...png`。
6. 在 `assets/generated/prompts.yaml` 中逐图记录：slide、asset、prompt、date、source_style、review、regenerated、final_path。
7. 生成图不得包含文字、数字、公式、logo、watermark、伪文字、精确电路连线、机器人头像或无意义的发光线路。
8. PTO 语义事实源固定为本仓 `vendor/pto-spec`；不使用 Arm ISA、Arm ASL、Sail Arm 或 Isla。
9. LinxCore 是处理器体系结构案例，不得称为 PTO 官方实现。NDF/Agentic Circuit 是课程模型层，不得反向覆盖 PTO 规范。
10. 完全断网可运行；禁止 CDN、远程字体、运行时 iframe、远程图片和必须联网的 API。

## 1. 全局 Image Gen 风格前缀

每次 Image Gen 调用都把下面内容作为 prompt 前缀，并追加对应页面的专用描述：

```text
Use case: scientific-educational
Asset type: full-bleed 16:9 architecture lecture slide background, 1920x1080 composition
Primary request: create a visually spectacular but technically grounded processor-architecture scene that supports the lesson described below
Style/medium: cinematic scientific visualization, precise industrial 3D cutaway, premium semiconductor keynote aesthetic, coherent with a dark navy Chinese computer-architecture deck
Composition/framing: edge-to-edge panoramic composition; strong single focal structure; depth and camera motion; preserve calm negative space for a short title and deterministic SVG labels
Lighting/mood: dark navy environment, electric cyan data paths, warm yellow compute structures, lime memory structures, sparse magenta bottleneck highlights, controlled bloom, high projection contrast
Materials/textures: silicon die, copper interconnect, glass-like data volumes, matte package substrate, subtle PCB traces
Constraints: no text, no letters, no numbers, no equations, no charts, no labels, no logos, no watermark, no people, no humanoid robots, no fantasy components, no pseudo-writing, no exact circuit wiring; architecture labels and data will be overlaid later in SVG
Avoid: generic AI imagery, decorative neon spaghetti, dense HUD overlays, cyberpunk city clutter, illegible micro-details, stock-photo look, empty dark regions, multiple competing focal points
```

每张图生成后必须用 `view_image` 检查：主体是否正确、全屏构图是否成立、标题区域是否安静、是否出现伪文字、颜色是否符合统一编码、是否能承载确定性架构叠加。不合格时只针对一个明确问题重新生成。项目引用的最终图不能只留在 `$CODEX_HOME/generated_images`。

## 2. 逐页构建蓝图

### Session 1：体系结构性能——算力只是机器的一半

#### S01 — 封面：算力不是答案，体系结构才是

- 核心观点：课程研究的是处理器如何获得性能，不是某个工具如何使用。
- 画面：从晶圆、封装、Die、Core、执行单元逐级展开的巨大剖面，镜头正准备进入芯片内部；右侧留标题空间。
- Image Gen 专用描述：`a monumental processor package opening into nested die, cluster, core and execution-unit layers, dramatic architectural cutaway, camera poised to dive inward, quiet negative space on the right`
- 确定性叠加：主标题、副标题、演讲者、时间地点；用细线标出 System→Chip→Core→Unit。
- 节奏：60 秒，说明“Agentic Circuit 是望远镜和显微镜，不是研究对象”。

#### S02 — 谜题：432 TFLOPS 为什么跑不满

- 核心观点：峰值算力和实际性能之间的缺口，就是体系结构研究空间。
- 画面：庞大的矩阵计算阵列只有一部分被点亮，大量计算单元等待远处稀疏到达的数据流。
- Image Gen 专用描述：`a vast matrix compute array with only a fraction brightly active while most units wait, thin delayed data streams arriving from distant memory, visual tension between enormous compute capacity and starvation`
- 确定性叠加：`Peak 432 TFLOPS` 与 `Measured ?`，点击后显示 utilization；不直接复用原稿曲线截图。
- 互动：让学生猜瓶颈来自算力、带宽、容量还是调度。

#### S03 — 工作负载：计算 + 数据移动

- 核心观点：任何算子都同时要求运算次数和数据搬运字节数。
- 画面：矩阵块从存储仓穿过多级通道进入计算阵列，计算火花只发生在流动路径的末端。
- Image Gen 专用描述：`large tensor blocks moving through layered memory corridors into a compute array, computation sparks only at the final stage, clear physical contrast between data movement distance and arithmetic locality`
- 确定性叠加：FLOPs、Bytes、Reuse 三个量及 `Performance = work / time`。
- 节奏：用一个矩阵乘例子口算数量级。

#### S04 — Roofline 的两根轴

- 核心观点：横轴是每字节做多少计算，纵轴是每秒完成多少计算。
- 画面：一个由斜坡和水平天花板组成的巨大建筑剖面，数据通道沿斜坡上升，计算阵列形成屋顶。
- Image Gen 专用描述：`an architectural monument shaped like a rising ramp meeting a flat ceiling, data channels climbing the ramp and a compute array forming the roof, strong clean geometry for overlaying axes`
- 确定性叠加：对数坐标、Bandwidth slope、Compute ceiling、ridge point，全部用 SVG。
- 节奏：从 `P=min(Ppeak, AI×BW)` 推导图形。

#### S05 — 交互 Roofline

- 核心观点：架构参数变化会移动屋顶，算法复用变化会移动工作点。
- 画面：同一 Roofline 建筑被四个可控机械结构支撑，分别象征计算、带宽、复用和缓存。
- Image Gen 专用描述：`a dynamic roofline structure supported by four adjustable industrial mechanisms representing compute, bandwidth, reuse and cache, clean center stage for an interactive chart overlay`
- 确定性叠加：`InteractiveRoofline.vue`，滑杆控制 peak FLOPS、HBM BW、AI、cache hit rate，显示瓶颈判断。
- 互动：学生先增算力，再增带宽，观察哪些操作无效。

#### S06 — Arithmetic Intensity：一份数据用几次

- 核心观点：提高复用比单纯增加计算单元更可能改变瓶颈。
- 画面：同一个数据块被多个邻近计算单元重复消费，而另一路数据每次都从远处重新搬运。
- Image Gen 专用描述：`split architectural scene: one data tile locally reused by many nearby compute units, contrasted with repeated long-distance fetches of identical tiles from far memory, visually obvious reuse advantage`
- 确定性叠加：两个算例的 FLOPs/Bytes 计算和工作点移动箭头。
- 节奏：解释 tiling 的本质是改变数据移动而非改变数学结果。

#### S07 — Locality：让工作点向右移动

- 核心观点：缓存、Tile 和数据布局通过增加局部复用改变有效 Arithmetic Intensity。
- 画面：数据从遥远仓库被搬入芯片内部的三个近距离环形缓存，访问路径逐层缩短。
- Image Gen 专用描述：`processor interior with three concentric local memory rings pulling data closer to compute, long external route collapsing into short bright local loops, strong sense of improved locality`
- 确定性叠加：无缓存、L2 命中、Tile 复用三个 Roofline 工作点。
- 互动：切换布局，观察有效 Bytes 与 AI。

#### S08 — 访存延迟：如果一个周期等于一天

- 核心观点：不同存储层级的延迟差异大到足以改变所有调度策略。
- 画面：从计算核心出发的同心时间地貌：近处寄存器，城区缓存，远方港口 DDR，星际航线 RDMA/RPC。
- Image Gen 专用描述：`concentric time-distance landscape centered on a processor core: immediate register ring, urban cache layers, distant memory port, inter-system route fading toward the horizon, epic but clean scale comparison`
- 确定性叠加：1 天、4 天、10 天、20 天、50 天、300 天、3000 天、10万天，点击层级显示真实数量级。
- 节奏：继承原稿“天数”隐喻，但用统一视觉重绘。

#### S09 — 存储层级：延迟、带宽、容量不能混为一谈

- 核心观点：每一级存储都是容量、带宽、延迟和能耗的不同组合。
- 画面：芯片剖面中的阶梯形存储山脉，靠近计算端细小而明亮，向外逐层巨大但遥远。
- Image Gen 专用描述：`stepped memory hierarchy embedded in a processor cutaway, tiny brilliant near-core storage expanding into massive distant layers, visually encoding proximity, capacity and flow width`
- 确定性叠加：MemoryHierarchy.vue，四维指标可切换，条宽代表带宽，体积代表容量，距离代表延迟。
- 互动：选择工作集大小，显示落在哪一级。

#### S10 — 并发：延迟不可消失，但可以被覆盖

- 核心观点：Outstanding requests、MLP 和队列容量决定能否用并发隐藏延迟。
- 画面：单车长途运输与多车并行车队的对比，最终汇入多 bank 存储入口。
- Image Gen 专用描述：`single long-latency data carrier contrasted with a coordinated fleet of parallel carriers feeding multiple memory banks, industrial processor transport metaphor, clear lanes and queues`
- 确定性叠加：Little’s Law `Concurrency ≈ Bandwidth × Latency`、outstanding 数量、队列占用。
- 互动：拖动 outstanding 上限，看吞吐何时饱和。

#### S11 — 一颗处理器就是一座城市

- 核心观点：计算、缓存、互连和调度共同决定城市吞吐，而不是单个建筑。
- 画面：俯视处理器城市，黄色计算街区、绿色缓存仓、青色道路、洋红片外出口，结构对应真实层次。
- Image Gen 专用描述：`top-down processor city metaphor with distinct compute districts, local cache warehouses, hierarchical cyan roads, central scheduler and sparse off-chip gateways, orderly architecture not fantasy city clutter`
- 确定性叠加：Core、L2 slice、LLC、NoC router、memory controller 标签。
- 节奏：从此页开始由系统向芯片内部连续放大。

#### S12 — 封装、HBM 与 DDR

- 核心观点：封装级互连和内存位置决定可用带宽与能耗。
- 画面：2.5D 封装剖面，计算 Die、HBM 堆栈、interposer、DDR 通道清晰分层。
- Image Gen 专用描述：`technically plausible 2.5D package cutaway with central compute die, nearby stacked high-bandwidth memory, silicon interposer and longer external memory channels, clean industrial realism`
- 确定性叠加：通道宽度、每 hop 距离、理论带宽计算；不在生成图中画精确 bump。
- 互动：切换 HBM/DDR，更新 Roofline 屋顶。

#### S13 — NoC：路够宽，但路口堵了

- 核心观点：端点带宽充足不代表片上网络没有拥塞。
- 画面：规则 mesh NoC 的数据流在一个热点路由器汇聚并形成背压波纹。
- Image Gen 专用描述：`regular on-chip mesh network seen as a silicon transport grid, balanced traffic converging into one visibly congested hotspot router, backpressure ripples propagating upstream`
- 确定性叠加：NoCTraffic.vue，注入率、链路宽度、hop 数、热点比例；精确 mesh 和流量箭头用 SVG。
- 互动：改变映射策略，观察热点迁移。

#### S14 — Tile/CUBE：把数据留在计算旁边

- 核心观点：Tile 架构用局部存储和专用数据通路提升复用。
- 画面：CUBE 计算阵列夹在 Left/Right/ACC 三类 Tile 存储之间，数据形成短闭环。
- Image Gen 专用描述：`processor tile cutaway with a central matrix compute cube surrounded by three distinct local data reservoirs, short luminous reuse loops, symmetrical technical composition`
- 确定性叠加：Left、Right、ACC、Scale、Bias、Vector、Reduction，以及容量和方向。
- 节奏：由原稿 Tile Register/CUBE 结构扩展为体系结构资源图。

#### S15 — TLOAD/TSTORE：数据布局也是体系结构

- 核心观点：从 Tensor 到 Tile 的加载不是普通 copy，而是布局和访问模式的建立。
- 画面：三维 Tensor 被切成 Tile，穿过装载引擎后重排成规则 bank 布局。
- Image Gen 专用描述：`three-dimensional tensor volume sliced into compact tiles, passing through a load engine and emerging as an orderly banked on-chip layout, clear transformation stages`
- 确定性叠加：TLOAD/TSTORE 箭头、layout mapping、bank index 和有效字节数。
- 互动：点击不同 tile shape，显示传输次数与浪费比例。

#### S16 — Double Buffer：让搬运与计算重叠

- 核心观点：双缓冲通过时间重叠提高利用率，但不会增加原始带宽。
- 画面：两个交替发光的数据舱，一边装载下一 Tile，一边向计算阵列供数。
- Image Gen 专用描述：`two alternating on-chip buffer chambers beside a compute array, one filling from memory while the other feeds computation, rhythmic ping-pong timing visualized physically`
- 确定性叠加：TimingDiagram.vue，LOAD、COMPUTE、STORE 三条时间线和气泡。
- 互动：打开/关闭双缓冲并播放周期动画。

#### S17 — Bank Conflict 与 Swizzle

- 核心观点：总带宽没有变化时，数据布局仍会决定实际并行度。
- 画面：多条数据流先冲向同一 bank 入口形成冲突，再经过 swizzle 后均匀分布到多个 bank。
- Image Gen 专用描述：`before-and-after memory banking scene: many data streams colliding at one bank entrance, then evenly distributed across parallel banks after a geometric remapping, clean split composition`
- 确定性叠加：bank index 公式、conflict degree、swizzle mapping 和 measured TFLOPS。
- 互动：选择 stride/swizzle，实时更新 bank 热力图。

#### S18 — 调度：任务、块与微操作

- 核心观点：体系结构需要在多个时间尺度上分配资源。
- 画面：三层透明调度空间，上层为任务块，中层为 Tile 流水，底层为微操作队列。
- Image Gen 专用描述：`three transparent scheduling strata stacked in depth: coarse task blocks above, tile pipelines in the middle, fine micro-operation queues below, aligned causal flow through all levels`
- 确定性叠加：Task scheduler、PTO block scheduler、micro-op scheduler；点击层级放大。
- 节奏：连接原稿多层级调度页，但去除密集截图。

#### S19 — 一张性能因果图

- 核心观点：性能由工作量、局部性、带宽、并发、调度和计算上限共同决定。
- 画面：所有前述结构汇聚成一条从 workload 到 throughput 的可视化因果管线。
- Image Gen 专用描述：`a coherent architecture causal pipeline converging from workload tiles through locality, memory transport, queues, schedulers and compute arrays toward final throughput, one strong left-to-right flow`
- 确定性叠加：可点击因果图；每个节点链接到对应实验参数。
- 互动：随机制造一个瓶颈，学生判断最先测什么。

#### S20 — Agentic Circuit：给体系结构装上可执行模型

- 核心观点：Agentic Circuit 的作用是把已经定义清楚的体系结构对象变成可运行、可测量、可探索的模型。
- 画面：上一页的处理器结构投影成一张简洁的节点—端口—队列模型，两层半透明对齐。
- Image Gen 专用描述：`a physical processor architecture smoothly projecting into a clean abstract executable network of modules, queues and links, two aligned layers with architecture remaining visually dominant`
- 确定性叠加：ArchitectureModelOverlay.vue；Compute、Buffer、Link、Arbiter、Event 五类模型对象。
- 节奏：工具第一次正式出场，不介绍产品功能列表。

#### S21 — 第一段挑战：你会先改什么

- 核心观点：没有证据前，不应直接扩大计算阵列。
- 画面：同一芯片前出现四条设计分叉：更多算力、更宽内存、更大缓存、更深队列，只有一条被数据证据照亮。
- Image Gen 专用描述：`one processor design branching into four architectural modification paths—more compute, wider memory, larger cache, deeper queues—with only one path illuminated by evidence, dramatic decision scene`
- 确定性叠加：四选一投票，随后显示所需测量和正确判断条件。
- 节奏：5 分钟互动与 Session 1 总结。

### Session 2：体系结构研究——从微架构模型到设计探索

#### S22 — 章节封面：进入处理器内部

- 核心观点：第二段把系统瓶颈追到具体微架构状态和模块。
- 画面：镜头穿过封装和缓存，进入一个展开的乱序处理器核心。
- Image Gen 专用描述：`camera diving through package and cache layers into an exploded out-of-order processor core, pipeline stages opening in depth, cinematic technical reveal`
- 确定性叠加：Session 2 标题和 System→Core→Queue→Cycle 路径。
- 节奏：45 秒承接第一段。

#### S23 — LinxCore：案例而不是答案

- 核心观点：用一个具体模块化处理器学习可迁移的研究方法，而不是宣传实现。
- 画面：模块化处理器核心被拆成前端、调度、执行、访存和提交五个物理区域。
- Image Gen 专用描述：`modular processor core exploded into five coherent regions for frontend, scheduling, execution, memory and commit, neutral case-study presentation, no branding`
- 确定性叠加：LinxCoreModuleExplorer.vue；标注事实边界和模型来源。
- 互动：点击区域进入后续页面的状态所有权。

#### S24 — PTO-SPEC：工作负载与 ISA 合同

- 核心观点：可执行规范定义“应该发生什么”，微架构模型研究“如何发生”。
- 画面：左侧抽象指令与状态契约，右侧多种可能处理器实现，中间是一条不可跨越的语义边界。
- Image Gen 专用描述：`an abstract executable contract on one side and several distinct processor implementations on the other, connected through a precise semantic boundary, clean formal architecture mood`
- 确定性叠加：PTO instruction/state/effect 与 implementation timing/resource；来源链接到 `vendor/pto-spec`。
- 节奏：明确不用 Arm ASL，PTO-SPEC 是唯一语义源。

#### S25 — 软件到硬件：同一个算子穿过五层

- 核心观点：算法、Tile 程序、ISA effect、微操作和硬件事件是同一计算的不同观察层。
- 画面：一个矩阵 Tile 垂直穿过五层透明抽象层，逐层展开为更具体的事件。
- Image Gen 专用描述：`one matrix tile descending through five transparent abstraction layers, transforming from algorithmic object into instruction effects, micro-operations and physical hardware events`
- 确定性叠加：Algorithm→PTO program→ISA effect→micro-op→signal/trace，点击对齐同一事件。
- 互动：选择 TLOAD 或 MATMUL 看跨层追踪。

#### S26 — Core 全景：流水线是一组相互背压的队列

- 核心观点：现代核心不是简单直线，而是带状态、反馈和资源竞争的队列网络。
- 画面：Fetch 到 Commit 的处理器核心全景，主数据流清晰，反馈通道返回前端。
- Image Gen 专用描述：`wide cutaway of a modern processor core from fetch to commit, strong forward pipeline and visible feedback paths, queues and execution clusters arranged with technical clarity`
- 确定性叠加：Fetch→Decode→Rename→Issue→Execute→ROB/Commit；队列容量和 ready/valid。
- 节奏：整段微架构的地图页。

#### S27 — Fetch/Decode：带宽从前端开始

- 核心观点：取指、分支预测和解码供给不足会让后端算力失去意义。
- 画面：指令流从 I-cache 进入多路解码器，错误预测形成一条被冲刷的旁路。
- Image Gen 专用描述：`instruction stream flowing from an instruction cache into a multi-lane decode front end, one mispredicted branch path visibly flushed, compact precise architecture scene`
- 确定性叠加：fetch width、decode width、branch bubble、IPC 上限。
- 互动：调整分支准确率和宽度，观察供给率。

#### S28 — Rename 与 ROB：乱序执行，顺序退休

- 核心观点：重命名释放数据依赖，ROB 保存精确状态和程序顺序。
- 画面：指令在 rename 处分裂为并行路径，最后在环形 ROB 中重新排队并有序退出。
- Image Gen 专用描述：`instructions fan out into parallel renamed paths and reconverge into an orderly reorder buffer ring for in-order retirement, vivid distinction between speculative interior and precise boundary`
- 确定性叠加：architectural vs physical register、ROBEntryBank、commit point、exception recovery。
- 节奏：强调状态所有权而非只画方框。

#### S29 — Issue Queue：谁准备好了

- 核心观点：发射性能由依赖唤醒、选择逻辑、端口和队列压力共同决定。
- 画面：多个等待槽位被依赖信号逐个点亮，少数指令被选入有限执行端口。
- Image Gen 专用描述：`dense but orderly issue queue slots waiting in darkness, dependency wakeup signals illuminating ready entries, a small number selected into limited execution ports`
- 确定性叠加：ReducedScalarIssueQueue、ready bits、age/priority、issue width、occupancy。
- 互动：QueuePressure.vue 播放一个依赖链。

#### S30 — Execute：流水线深度与旁路

- 核心观点：执行单元的吞吐、延迟和旁路网络是不同参数。
- 画面：ALU、乘法、访存三条不同长度的流水线并列，结果通过旁路返回等待者。
- Image Gen 专用描述：`three parallel execution pipelines of different physical lengths for arithmetic, multiply and memory, bright result bypass arcs returning to waiting consumers`
- 确定性叠加：ReducedScalarAluExecute、latency、initiation interval、bypass、structural hazard。
- 互动：改变流水级，显示频率假设与依赖链代价。

#### S31 — Load/Store：最复杂的执行单元

- 核心观点：访存执行同时面对地址、顺序、缓存、合并和异常。
- 画面：AGU、load queue、store queue、cache ports、miss path 组成一座多入口访存设施。
- Image Gen 专用描述：`detailed load-store subsystem cutaway with address-generation lanes, load and store holding areas, cache ports and a long miss path, visually the most interconnected execution cluster`
- 确定性叠加：地址生成、依赖检查、forwarding、replay、commit store。
- 互动：注入一次 store-to-load forwarding 和一次 cache miss。

#### S32 — Cache Miss 如何变成全核停顿

- 核心观点：一个局部 miss 可以通过 MSHR、队列和 ROB 传播成全局背压。
- 画面：从 cache miss 点开始的红色压力波沿队列逐级向前端传播。
- Image Gen 专用描述：`a cache miss at the memory edge launching a visible pressure wave backward through miss handlers, load queue, issue queue, reorder buffer and frontend`
- 确定性叠加：MSHR、miss latency、ROB head blocking、front-end stall；箭头由 SVG 控制。
- 节奏：将访存层级和核心流水线真正连起来。

#### S33 — Backpressure：体系结构中的反馈回路

- 核心观点：性能模型必须包含反馈，否则只能描述理想吞吐。
- 画面：处理器流水线形成一条闭合控制回路，队列满信号逆向传播，前向数据流逐段减速。
- Image Gen 专用描述：`processor pipeline represented as a closed control loop, queue saturation signals propagating backward while forward data flow slows stage by stage, strong feedback-system composition`
- 确定性叠加：CircuitDataflow.vue；ready/valid、full/empty、credit 和 cycle boundary。
- 互动：打开/关闭反馈模型，对比错误预测的吞吐。

#### S34 — NDF：把体系结构对象写成一张可追踪图

- 核心观点：模型需要稳定的模块、端口、状态、参数和测量定义。
- 画面：上一页物理核心被投影为层次清晰的模块图，节点仍与物理位置一一对齐。
- Image Gen 专用描述：`physical processor core transitioning into a clean hierarchical network description, modules and connections remaining spatially aligned with the underlying architecture`
- 确定性叠加：NDF 节点、端口、state ownership、parameter、metric、source ID。
- 互动：点击物理模块，高亮 NDF 条款与实验。

#### S35 — pyCircuit：让模型按周期运行

- 核心观点：可执行模型让假设产生 trace，而不是停留在方框图。
- 画面：模块图被时钟脉冲激活，token 在寄存器、队列和组合逻辑之间逐周期移动。
- Image Gen 专用描述：`hierarchical processor model activated by a clock pulse, data tokens advancing cycle by cycle through registers, queues and combinational regions, precise temporal atmosphere`
- 确定性叠加：PipelineStepper.vue、cycle、state snapshot、input/output trace。
- 互动：step/play/pause/reset；每次只推进一个周期。

#### S36 — 可复现实验：先锁定 Baseline

- 核心观点：没有固定输入、参数、trace 和指标，就没有可比较的优化。
- 画面：一个架构实验台，左侧固定 workload，中间处理器模型，右侧 trace 和指标仪表。
- Image Gen 专用描述：`disciplined processor research bench with a fixed workload source, executable core model and measurement instruments arranged left-to-right, reproducibility over spectacle`
- 确定性叠加：ExperimentPanel.vue，seed、config hash、cycles、IPC、misses、utilization、artifact links。
- 互动：运行 baseline 或加载预生成离线结果。

#### S37 — 实验一：扫带宽，不猜带宽

- 核心观点：带宽 sweep 能识别性能拐点和新的瓶颈。
- 画面：一组逐渐加宽的内存通道连接同一核心，吞吐增长最终停止。
- Image Gen 专用描述：`series of progressively wider memory channels feeding the same processor core, data flow increasing then visibly saturating at the compute side, clean comparative panorama`
- 确定性叠加：带宽 sweep 曲线、ridge point、utilization、queue occupancy；数据来自本地 JSON/CSV。
- 互动：拖动带宽，联动 Roofline 和 trace。

#### S38 — 实验二：容量、命中率和队列深度

- 核心观点：不同参数可能产生相同吞吐，却通过不同机制实现。
- 画面：三个候选核心分别扩大缓存、提高命中率和加深队列，内部数据流形态不同。
- Image Gen 专用描述：`three processor design variants side by side: enlarged local cache, improved locality path, and deeper request queues, each with distinct internal flow patterns but comparable throughput`
- 确定性叠加：三组 trace、occupancy heatmap、miss rate、latency hiding 指标。
- 互动：选择两个设计进行因果对比。

#### S39 — Roofline 预测与周期模型测量

- 核心观点：Roofline 给上界，周期模型解释为什么达不到上界。
- 画面：左侧宏观 Roofline 天际线，右侧微观流水线剖面，中间用同一工作点连接。
- Image Gen 专用描述：`macro roofline skyline on one side and microscopic processor pipeline cutaway on the other, one operating point visually linking the upper bound to cycle-level mechanisms`
- 确定性叠加：predicted、measured、gap decomposition：front-end、memory、dependency、structural。
- 节奏：完成从系统模型到微架构证据的闭环。

#### S40 — Agent 辅助研究：提出、运行、解释、反驳

- 核心观点：Agent 可以扩大实验吞吐，但不能替代约束、证据和架构判断。
- 画面：体系结构模型位于中央，周围四个机械研究环依次完成 proposal、simulation、measurement、critique。
- Image Gen 专用描述：`processor architecture model at the center of a four-stage automated research apparatus for proposing, simulating, measuring and critiquing, no humanoid agent, architecture remains dominant`
- 确定性叠加：Agent loop、allowed actions、evidence gate、failure cases、NDF write-back。
- 互动：给出一个错误提案，让学生指出违反的架构约束。

#### S41 — Pareto：没有唯一最优处理器

- 核心观点：性能、面积、功耗、复杂度和验证风险必须共同权衡。
- 画面：大量处理器设计点悬浮在多维空间，少数 Pareto 点形成清晰前沿。
- Image Gen 专用描述：`many processor design variants suspended in a dark multidimensional design space, a small luminous Pareto frontier emerging clearly, each point subtly shaped by architecture parameters`
- 确定性叠加：ParetoFrontier.vue，performance/area/power/complexity，可筛约束并打开设计详情。
- 互动：学生为不同产品目标选择不同点。

#### S42 — 结尾：Architecture First, Agent Assisted

- 核心观点：真正可持续的 Agentic Circuit，是让体系结构假设更快变成可证伪证据。
- 画面：从系统到芯片、核心、队列、周期模型的全部层级重新合拢成一颗完整处理器，背景出现由实验数据构成的微光轨迹。
- Image Gen 专用描述：`all explored layers—system, package, chip, core, queues and cycle model—reassembling into one complete processor, subtle evidence trails converging behind it, triumphant but rigorous ending`
- 确定性叠加：三条 takeaway：Model the bottleneck / Measure the mechanism / Let agents explore, not decide；本地仓库和实验入口。
- 节奏：2 分钟总结和后续动手路线。

## 3. 实施要求

1. 先阅读 `docs/superpowers/specs/2026-08-01-architecture-first-tutorial-design.md` 与 `docs/superpowers/plans/2026-08-01-architecture-first-tutorial-web-plan.md`。
2. 保存旧 deck 的 Git 历史，但直接重写当前两个 `slides.md`；不要维护两套相互冲突的主题。
3. 建立统一的 `FullBleedStage.vue`，支持背景图、遮罩、标题安全区、来源、页码和 deterministic overlay slot。
4. 优先复用并重构已有组件；新增的组件必须服务于本蓝图中的明确交互。
5. 为每页 speaker notes 写：学习目标、讲授时间、视觉意图、互动 cue、架构事实来源、不能夸大的结论。
6. 每 8–12 分钟至少一次学生判断、参数拖动、trace 播放或设计选择。
7. 先用低风险静态数据把交互和布局做正确，再接真实实验 artifact；不要用随机数伪造现场结果。
8. 所有图表使用本仓数据和统一深色主题，禁止直接嵌入白底 Matplotlib 截图。

## 4. 验证门

完成前必须执行并读取最新输出：

```bash
npm ci
npm run experiments
npm run test:content
npm run build
npm run test:offline
npm run export
npm run qa:render
npm run qa:contact
```

随后逐页查看两个 contact sheet，并抽查所有 42 张原始 1920×1080 截图。逐页确认：

- 主图撑满页面且与观点直接相关；
- 技术叠加没有溢出、遮挡或伪精确；
- 标题和标签投影可读；
- 每页只有一个中心观点；
- 架构层级、数据方向和状态所有权正确；
- Image Gen 图没有文字、logo、watermark 或不合理结构；
- 页面之间形成连续的镜头推进；
- 所有交互在断网状态下工作；
- 两段讲授时长都不超过 60 分钟。

任何页面未达标都必须修改、重新截图并复查。只有 42 页全部通过、所有生成图和 prompt 可追踪、构建/实验/离线/PDF/视觉检查全部成功，才可宣告 Goal 完成。
