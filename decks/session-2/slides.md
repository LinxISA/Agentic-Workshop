---
theme: default
title: Agentic Model 与 PTO NPU Core · 第二课
info: q_proj、trace、gfsim、PTO-ASL、NDF 与 pyCircuit 验证闭环
transition: fade-out
colorSchema: dark
mdc: true
favicon: /generated/slides/s29-keynote-page-27.png
fonts:
  sans: "MiSans, Noto Sans SC, Microsoft YaHei, sans-serif"
  mono: "SFMono-Regular, Menlo, monospace"
  provider: none
---

# Agentic Model

<KeynoteSourceStage background="/generated/slides/s34-keynote-page-32.png" title="Agentic Model" claim="Agentic Model" slide-id="S34" />

<!--
Slide-ID: S34
Objective: 完整保留原 Keynote 第 27 页，开启 Agentic Model 章节。
Timing: 3 min
Visual: 更新版 Keynote 第 32 页 1920×1080 确定性整页渲染。
Interaction: 章节转场，提示后续用一个 q_proj 贯穿模型与证据链。
Sources: publish-keynote-page-32
Boundary: 可见文字与图形直接来自演讲人提供的 Keynote。
Narrative: 本章不把 Agent 当作结论生成器，而把它放进可执行、可复查的模型实验流程。
Transition: 从章节标题进入一个可计算的 Transformer 投影切片。
[Sources]
- source: K32
- catalog: publish-keynote-page-32
-->

---

# Agentic Architecture Model：基本仿真组件

<KeynoteSourceStage background="/generated/slides/s35-keynote-page-33.png" title="Agentic Architecture Model：基本仿真组件" claim="严格保留更新版 Keynote 第 33 页文字、图片与构图" slide-id="S35" />

<!--
Slide-ID: S35
Objective: 按更新版 Keynote 原页讲解“Agentic Architecture Model：基本仿真组件”。
Timing: 3 min
Visual: 更新版 Keynote 第 33 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的体系结构层次与数据路径。
Sources: publish-keynote-page-33
Boundary: 本页逐字逐图保留更新版 Keynote；图中参数与结构按原稿教学语境解释。
Narrative: 先按原页构图建立直觉，再把其中的资源、带宽、容量或执行关系接入课程主线。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K33
- catalog: publish-keynote-page-33
-->

---

# Agentic Architecture Model：MLIR架构方言

<KeynoteSourceStage background="/generated/slides/s36-keynote-page-34.png" title="Agentic Architecture Model：MLIR架构方言" claim="严格保留更新版 Keynote 第 34 页文字、图片与构图" slide-id="S36" />

<!--
Slide-ID: S36
Objective: 按更新版 Keynote 原页讲解“Agentic Architecture Model：MLIR架构方言”。
Timing: 3 min
Visual: 更新版 Keynote 第 34 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的体系结构层次与数据路径。
Sources: publish-keynote-page-34
Boundary: 本页逐字逐图保留更新版 Keynote；图中参数与结构按原稿教学语境解释。
Narrative: 先按原页构图建立直觉，再把其中的资源、带宽、容量或执行关系接入课程主线。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K34
- catalog: publish-keynote-page-34
-->

---

# Agentic Architecture Model：让Agent准确建模体系结构

<KeynoteSourceStage background="/generated/slides/s37-keynote-page-35.png" title="Agentic Architecture Model：让Agent准确建模体系结构" claim="严格保留更新版 Keynote 第 35 页文字、图片与构图" slide-id="S37" />

<!--
Slide-ID: S37
Objective: 按更新版 Keynote 原页讲解“Agentic Architecture Model：让Agent准确建模体系结构”。
Timing: 3 min
Visual: 更新版 Keynote 第 35 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的体系结构层次与数据路径。
Sources: publish-keynote-page-35
Boundary: 本页逐字逐图保留更新版 Keynote；图中参数与结构按原稿教学语境解释。
Narrative: 先按原页构图建立直觉，再把其中的资源、带宽、容量或执行关系接入课程主线。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K35
- catalog: publish-keynote-page-35
-->

---

# q_proj：从 Transformer 到一次 BF16 投影

<FullBleedStage background="/generated/slides/s38-qproj-transformer-scaling-v2.png" title="q_proj：从 Transformer 到一次 BF16 投影" claim="输入 activation × BF16 weight → GEMM → projected output；一次投影就是可追踪的垂直切片。" eyebrow="QWEN3-14B · WORKLOAD SLICE" slide-id="S38">
  <template #diagram><div class="diagram-dock architecture-chain"><span>Input<br><small>activation tile</small></span><i>×</i><span>Weight<br><small>BF16 q_proj</small></span><i>→</i><span>GEMM</span><i>→</i><span>Output<br><small>query projection</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S38
Objective: 把 Qwen3-14B 的 q_proj 缩小为一个可建模的 BF16 矩阵投影。
Timing: 3 min
Visual: Transformer block 聚焦 q_proj，前景展示 input、weight、GEMM、output 数据流。
Interaction: 让学生指出 shape、dtype、layout 和数据搬运中哪些会改变执行代价。
Sources: qproj-davincioo-lab; course-synthesis
Boundary: 这是 q_proj 教学切片，不声称覆盖完整模型推理、量化或并行策略。
Narrative: 研究从足够小但仍真实的工作负载开始。q_proj 同时包含权重搬运、activation 组织和矩阵计算，足以暴露跨层约束。
Transition: 下一页把这次投影送入可复现的软件到模型链。
[Sources]
- catalog: qproj-davincioo-lab
- catalog: course-synthesis
-->

---

# 从 Python 到周期模型

<FullBleedStage background="/generated/slides/s39-pypto-to-gfsim-chain-v2.png" title="从 Python 到周期模型" claim="每一层都保留可审计的中间产物，而不是把程序直接跳成一个性能数字。" eyebrow="REPRODUCIBLE PIPELINE" slide-id="S39">
  <template #diagram><div class="diagram-dock architecture-chain"><span>pypto-lib<br><small>Python</small></span><i>→</i><span>.pto<br><small>MLIR PTO dialect</small></span><i>→</i><span>PTOAS<br><small>C++</small></span><i>→</i><span>host Trace Runner</span><i>→</i><span>.pto.trace<br><small>JSONL</small></span><i>→</i><span>gfsim</span></div></template>
</FullBleedStage>

<!--
Slide-ID: S39
Objective: 建立 pypto-lib 到 gfsim 的完整、可审计实验流水线。
Timing: 3 min
Visual: 六段本地流水线明确标注 Python、MLIR PTO dialect、C++、host runner、JSONL 与 gfsim。
Interaction: 点名每个中间产物可以回答的问题，以及失败时应回到哪一层定位。
Sources: qproj-davincioo-lab; davincioo-public-docs
Boundary: 流水线描述止于 host trace 与 gfsim replay，不推断未公开的部署格式。
Narrative: 可复现性来自中间证据。程序、dialect、语义执行、trace 与模型输出分别形成可比较边界。
Transition: 接着观察一条 q_proj 程序如何展开成 trace opcode。
[Sources]
- catalog: qproj-davincioo-lab
- catalog: davincioo-public-docs
-->

---

# q_proj 展开成可调度事件

<FullBleedStage background="/generated/slides/s40-program-unfolds-into-events-v2.png" title="q_proj 展开成可调度事件" claim="Trace 明示 input_tiles / output_tiles / scalar_inputs；dependency readiness 由 rename / scoreboard 推导。" eyebrow="PTO TRACE VOCABULARY" slide-id="S40">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">TASSIGN → TEXTRACT<small>input_tiles / output_tiles / scalar_inputs</small></span><span style="--layer:#b9ff33">TLOAD<small>数据进入可见 Tile 状态</small></span><span style="--layer:#ffbe00">TMATMUL → TMATMUL_ACC<small>首块计算与累加</small></span><span style="--layer:#f16bb5">TSTORE<small>readiness: rename / scoreboard derived</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S40
Objective: 展示 q_proj PTO trace 中 TASSIGN、TEXTRACT、TLOAD、TMATMUL、TMATMUL_ACC、TSTORE 的角色。
Timing: 3 min
Visual: q_proj 数据流展开为六类 opcode，并标出 input_tiles、output_tiles、scalar_inputs。
Interaction: 让学生根据 Tile 读写推导 load、extract、matmul-acc、store 的 readiness 顺序。
Sources: qproj-davincioo-lab; pto-spec
Boundary: opcode 组合来自已检查的 q_proj reference replay；不把一次展开推广成所有实现的唯一 lowering。
Narrative: trace 不是汇编截图，而是模型能够消费的事件契约。记录保留 opcode、input_tiles、output_tiles、scalar_inputs；dependency/readiness edges 由 rename/scoreboard 推导。
Transition: 下一页用交互式显微镜逐字段读取一条 JSONL 记录。
[Sources]
- catalog: qproj-davincioo-lab
- catalog: pto-spec
-->

---

# 一条 trace 记录的解剖

<FullBleedStage background="/generated/slides/s41-jsonl-trace-microscope-v2.png" title="一条 trace 记录的解剖" claim="Tile metadata 可见；依赖由 rename / scoreboard 推导。" eyebrow="TRACE ANATOMY" slide-id="S41">
  <template #diagram><TraceAnatomy /></template>
</FullBleedStage>

<!--
Slide-ID: S41
Objective: 交互检查 checked JSONL 的 sequence_id、opcode、engine、Tile address/shape/layout/dtype 与 scalar inputs。
Timing: 3 min
Visual: JSONL 显微镜与字段检查器并列，当前记录使用暖色高亮。
Interaction: 点击记录或使用方向键切换，要求学生解释每个字段影响语义还是调度。
Sources: qproj-davincioo-lab; course-model
Boundary: 组件只显示 sanitized checked sample 的真实字段，不补造 deps；artifact 不可用时只显示明确标注的 teaching sample。
Narrative: sequence_id 让不同工具对同一事件对齐；input/output Tile 保存 address、shape、layout、dtype。依赖由 rename 与 scoreboard 从资源读写中推导，不是显式 deps 字段。
Transition: 有了记录后，需要一个明确时间可见性的队列语义。
[Sources]
- catalog: qproj-davincioo-lab
- catalog: course-model
-->

---

# SimQueue：容量、延迟与可见性

<FullBleedStage background="/generated/slides/s42-simqueue-tollgate-v2.png" title="SimQueue：容量、延迟与可见性" claim="push 先进入 pending；延迟到期才 visible；容量耗尽会把 backpressure 传回生产者。" eyebrow="PUBLIC TEACHING ABSTRACTION" slide-id="S42">
  <template #diagram><SimQueueExplorer /></template>
</FullBleedStage>

<!--
Slide-ID: S42
Objective: 用高层公开抽象解释 capacity、latency、pending/visible、stall 与 backpressure。
Timing: 3 min
Visual: 队列闸门把 pending、visible、completed 三种状态分开。
Interaction: 调整容量和延迟，每次按键推进一周期，观察何时拒绝新 arrival。
Sources: davincioo-public-docs; course-model
Boundary: 不展示私有实现字段、调度规则或 timing constants；组件是教学模型。
Narrative: 队列既储存数据也储存时间。pending 与 visible 的分离避免消费者提前看到尚未成熟的结果。
Transition: 多个队列被拓扑连接后，才形成完整的 gfsim 数据路径。
[Sources]
- catalog: davincioo-public-docs
- catalog: course-model
-->

---

# DaVinci gfsim 的高层拓扑

<FullBleedStage background="/generated/slides/s43-davincioo-pipeline-topology-v2.png" title="DaVinci gfsim 的高层拓扑" claim="TraceSource 供给事件，乱序窗口追踪依赖，四类执行资源完成工作并通过 wakeup 释放消费者。" eyebrow="HIGH-LEVEL MODEL TOPOLOGY" slide-id="S43">
  <template #diagram><DaVinciTopology /></template>
</FullBleedStage>

<!--
Slide-ID: S43
Objective: 建立 TraceSource→ROB→Rename→Dispatch→ReadyTable→IQ→执行资源→Wakeup 的公开高层图。
Timing: 3 min
Visual: 中央流水线连接 Scalar、Vector、Cube、TMA，返回弧表示 wakeup。
Interaction: 点击 opcode 或使用左右键，查看它进入哪类执行资源。
Sources: davincioo-public-docs; course-synthesis
Boundary: 图不公开私有状态字段、选择策略或 timing constants，只表达教学层连接关系。
Narrative: ROB 保存顺序，ReadyTable 与 IQ 组织可执行性，engine 建模资源占用，wakeup 把完成事件传播给依赖者。
Transition: 下一页只公开时间公式与假设，不泄露实现常数。
[Sources]
- catalog: davincioo-public-docs
- catalog: course-synthesis
-->

---

# 三类执行时间模型

<FullBleedStage background="/generated/slides/s44-execution-engine-time-model-v2.png" title="三类执行时间模型" claim="公式是可替换假设；参数必须来自公开配置、实验或明确的课程设定。" eyebrow="TIMING ASSUMPTIONS" slide-id="S44">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#b9ff33">TMA time = ceil(bytes / bandwidth)<small>再叠加公开的固定开销假设</small></span><span style="--layer:#17d9ff">Vector time = f(data volume, op class)<small>按数据量与操作类别分层</small></span><span style="--layer:#ffbe00">Cube time = ceil(M×N×K / MACs per cycle)<small>shape 与有效并行度进入模型</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S44
Objective: 给出 TMA、Vector、Cube 的时间公式和可审计假设边界。
Timing: 3 min
Visual: 三条公式分别连接 bytes/BW、data/op class、MACs/cycle。
Interaction: 固定工作量，分别把带宽或 MACs/cycle 加倍，判断哪类时间会改变。
Sources: davincioo-public-docs; course-model
Boundary: 页面不披露私有 timing constants；公式只定义参数关系，不声称完成校准。
Narrative: intrinsic latency 的价值是解释单个事件的服务时间，但它仍不是完整系统时间。
Transition: 在计算延迟前，先明确每个 opcode 由哪类资源执行。
[Sources]
- catalog: davincioo-public-docs
- catalog: course-model
-->

---

# Opcode 到执行资源的确定性路由

<FullBleedStage background="/generated/slides/s45-opcode-resource-mapping-v2.png" title="Opcode 到执行资源的确定性路由" claim="这是 DaVinci gfsim implementation routing；PTO family 只定义语义类别，不规定同一资源映射。" eyebrow="IMPLEMENTATION CHOICE" slide-id="S45">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#b9ff33">TLOAD → TMA<small>数据搬运</small></span><span style="--layer:#17d9ff">TEXTRACT / TMOV → Vector<small>TMOV 是 PTO family；此处为 gfsim 路由</small></span><span style="--layer:#ffbe00">TMATMUL* → Cube<small>矩阵计算</small></span><span style="--layer:#f16bb5">management / sync → Scalar<small>管理与同步</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S45
Objective: 明确 DaVinci gfsim 对 TLOAD、TEXTRACT、TMOV、TMATMUL 与管理同步类的确定性路由。
Timing: 3 min
Visual: 四条 opcode family 到 TMA、Vector、Cube、Scalar 的彩色映射。
Interaction: 给出一组混合 trace，让学生统计四类 engine 的 arrival pressure。
Sources: davincioo-public-docs; pto-spec
Boundary: TMOV 被标为 PTO family；具体映射属于 DaVinci gfsim 实现而非 PTO 规范。
Narrative: 把语义与资源路由分开，才能在不改变程序 effect 的情况下探索不同微架构。
Transition: 确定路由后，用单周期播放观察状态如何迁移。
[Sources]
- catalog: davincioo-public-docs
- catalog: pto-spec
-->

---

# 一次只推进一个周期

<FullBleedStage background="/generated/slides/s46-single-cycle-step-v2.png" title="一次只推进一个周期" claim="每次按键只做一次状态转移：dispatch、ready、issue、execute、complete、retire 都能被逐步检查。" eyebrow="CYCLE PLAYBACK" slide-id="S46">
  <template #diagram><CyclePlayback /></template>
</FullBleedStage>

<!--
Slide-ID: S46
Objective: 逐周期观察 trace、ROB、IQ、execute、completion 与 retirement 状态。
Timing: 3 min
Visual: 六列状态视图把同一 sequence_id 的迁移保持可见。
Interaction: 点击按钮、空格或右箭头每次推进一个周期；Home 回到初始状态。
Sources: course-model; davincioo-public-docs
Boundary: 播放器是确定性教学模型，不声称复制 gfsim 的全部内部事件顺序。
Narrative: 单步执行迫使每个状态变化都有前因。依赖未满足不能 issue，完成也不等于已经按序退休。
Transition: 下一页把单条 intrinsic latency 与端到端 system time 分开。
[Sources]
- catalog: course-model
- catalog: davincioo-public-docs
-->

---

# Intrinsic latency 不等于 system time

<FullBleedStage background="/generated/slides/s47-queueing-critical-path-v2.png" title="Intrinsic latency 不等于 system time" claim="系统时间还包含依赖等待、资源争用、ROB/IQ 容量、可重叠工作与最终 critical path。" eyebrow="QUEUEING + DEPENDENCIES" slide-id="S47">
  <template #diagram><div class="diagram-dock evidence-strip"><span>Intrinsic<b>service time</b></span><span>Deps<b>ready wait</b></span><span>Contention<b>engine wait</b></span><span>Window<b>ROB / IQ</b></span><span>Overlap<b>hidden work</b></span><span>Result<b class="bottleneck">critical path</b></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S47
Objective: 区分执行单元 intrinsic latency 与包含排队、依赖、容量和 overlap 的 system time。
Timing: 2 min
Visual: 同一事件的服务时间嵌在更长的依赖与排队时间轴中。
Interaction: 比较一条独立 TLOAD 与一条 critical-path TLOAD，说明相同 intrinsic latency 为何有不同影响。
Sources: course-model; davincioo-public-docs
Boundary: 因果项是公开教学分类，不给出私有实现的精确等待分解。
Narrative: 性能优化要缩短关键路径，而不是机械缩短每个局部延迟。足够的 overlap 可以隐藏长服务时间，容量不足又会把它暴露出来。
Transition: 将这些结构参数放进受控 sweep，观察敏感性而非猜测等价。
[Sources]
- catalog: course-model
- catalog: davincioo-public-docs
-->

---

# 参数搜索：找敏感方向，不制造等价

<FullBleedStage background="/generated/slides/s48-parameter-search-space-v2.png" title="参数搜索：找敏感方向，不制造等价" claim="同时观察 ROB depth、Tile tags、TMA BW、Cube MACs 与 engine counts；结果只支持候选方向。" eyebrow="PARAMETER SWEEP" slide-id="S48">
  <template #diagram><ParameterSweep /></template>
</FullBleedStage>

<!--
Slide-ID: S48
Objective: 选择并检查 ROB、Tile tags、TMA bandwidth、Cube MACs/cycle 与 engine-count 的实际 OFAT points。
Timing: 2 min
Visual: checked qproj_sweep 点选择器直接显示 parameter、value、simulated_cycles、bottleneck_signal 与 speedup。
Interaction: 选择 baseline 与各 OFAT point，比较实际 simulated_cycles 和 bottleneck_signal。
Sources: qproj-davincioo-lab; experiment-artifacts; course-model
Boundary: 组件只展示本地 qproj_sweep.json 的 checked points；artifact 不可用时明确显示 unavailable，不生成 q_proj 替代证据。
Narrative: sweep 的任务是排除不敏感方向并产生下一轮问题。相同 cycle count 既不证明结构等价，也不证明参数无意义。
Transition: 聚合数字还不够，下一页回到时间线上检查事件重叠。
[Sources]
- catalog: qproj-davincioo-lab
- catalog: experiment-artifacts
- catalog: course-model
-->

---

# 离线时间线：证据必须可浏览

<FullBleedStage background="/generated/slides/s49-perfetto-kanata-timeline-v2.png" title="离线时间线：证据必须可浏览" claim="按 opcode 与 engine 过滤 q_proj 事件，检查 issue、complete 与 retire 的相对位置。" eyebrow="PERFETTO / KANATA-STYLE" slide-id="S49">
  <template #diagram><EvidenceTimeline /></template>
</FullBleedStage>

<!--
Slide-ID: S49
Objective: 用离线 Perfetto/Kanata-style 视图检查 q_proj timeline artifact。
Timing: 2 min
Visual: Scalar、TMA、Vector、Cube 轨道展示事件跨度与长尾 store。
Interaction: 组合 opcode 与 engine filter，定位首个 Cube 工作和末尾 TSTORE。
Sources: qproj-davincioo-lab; experiment-artifacts
Boundary: 时间线读取本地 CSV，展示 reference_replay；不声称是新抓取的硬件波形。
Narrative: 时间线让“为什么是这个周期数”变成可检查问题。过滤器帮助区分 engine 忙碌、依赖空洞和尾部拖延。
Transition: 将 trace、summary、sweep 和 timeline 合并成一个可复述的实验结论。
[Sources]
- catalog: qproj-davincioo-lab
- catalog: experiment-artifacts
-->

---

# q_proj 实验：可复述，也有边界

<FullBleedStage background="/generated/slides/s50-candidate-design-point-v2.png" title="q_proj 实验：可复述，也有边界" claim="checked reference replay: 562 records / 11028 cycles。候选点来自敏感性，不代表结构等价。" eyebrow="REPRODUCIBLE EVIDENCE" slide-id="S50">
  <template #diagram><div class="diagram-dock evidence-strip"><span>Trace<b>562 records</b></span><span>Opcode mix<b>281 / 160 / 40 / 1 / 79 / 1</b></span><span>Replay<b>11028 cycles</b></span><span>Artifact<b>reference_replay</b></span><span>Fresh capture<b class="bottleneck">not done</b></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S50
Objective: 准确陈述 q_proj checked reference artifact 与未完成的新 capture。
Timing: 2 min
Visual: 五个证据标签展示 record count、opcode mix、cycles、mode 与 capture 状态。
Interaction: 要求学生把结论拆成 observation、candidate design point、sensitivity conclusion 与 unresolved question。
Sources: qproj-davincioo-lab; experiment-artifacts
Boundary: durable artifact 标为 reference_replay。一次 task-local gfsim re-simulation 曾重现 11028 cycles，但不是 checked live artifact，也不是 fresh PTO capture；不宣称等价。
Narrative: checked reference replay 含 562 条记录，opcode mix 为 281/160/40/1/79/1，总计 11028 cycles；敏感性只支持候选设计方向。
Transition: 从模型证据转向能够承载 PTO 的 NPU Core 设计。
[Sources]
- catalog: qproj-davincioo-lab
- catalog: experiment-artifacts
-->

---

# NPU Core for PTO

<KeynoteSourceStage background="/generated/slides/s51-keynote-page-36.png" title="NPU Core for PTO" claim="NPU Core for PTO" slide-id="S51" />

<!--
Slide-ID: S51
Objective: 完整保留原 Keynote 第 28 页，开启 NPU Core for PTO 章节。
Timing: 2 min
Visual: 更新版 Keynote 第 36 页 1920×1080 确定性整页渲染。
Interaction: 章节转场，把上一章的模型参数转成实现约束。
Sources: publish-keynote-page-36
Boundary: 可见文字与图形直接来自演讲人提供的 Keynote。
Narrative: 模型给出问题方向，Core 设计必须把这些方向写成语义、接口、资源与验收契约。
Transition: 先回到原稿的分层调度思想。
[Sources]
- source: K36
- catalog: publish-keynote-page-36
-->

---

# 分层调度

<KeynoteSourceStage background="/generated/slides/s52-keynote-page-37.png" title="分层调度" claim="分层调度" slide-id="S52" />

<!--
Slide-ID: S52
Objective: 完整保留原 Keynote 第 29 页的调度内容。
Timing: 2 min
Visual: 更新版 Keynote 第 37 页 1920×1080 确定性整页渲染。
Interaction: 沿原图说明不同层级为何需要不同粒度的调度决策。
Sources: publish-keynote-page-37
Boundary: 本页可见内容完全来自历史源稿，不追加当前实现结论。
Narrative: 分层调度把长时间尺度的工作分配与短时间尺度的资源选择分开。
Transition: 下一页继续保留原稿中的 PTO 多级调度层次。
[Sources]
- source: K37
- catalog: publish-keynote-page-37
-->

---

# PTO 多级调度层次

<KeynoteSourceStage background="/generated/slides/s53-keynote-page-38.png" title="PTO 多级调度层次" claim="PTO 多级调度层次" slide-id="S53" />

<!--
Slide-ID: S53
Objective: 完整保留原 Keynote 第 30 页的 PTO 层次关系。
Timing: 2 min
Visual: 更新版 Keynote 第 38 页 1920×1080 确定性整页渲染。
Interaction: 指出原图中层次之间传递的是意图、约束还是具体调度动作。
Sources: publish-keynote-page-38
Boundary: 可见层次与术语完全来自历史源稿。
Narrative: 多级结构为软件语义与硬件资源之间提供多个稳定边界。
Transition: 下一页查看原稿中 PTO 与 MLIR 的源码表达。
[Sources]
- source: K38
- catalog: publish-keynote-page-38
-->

---

# PTO / MLIR 源码表达

<KeynoteSourceStage background="/generated/slides/s54-keynote-page-39.png" title="PTO / MLIR 源码表达" claim="PTO / MLIR 源码表达" slide-id="S54" />

<!--
Slide-ID: S54
Objective: 完整保留原 Keynote 第 31 页的 PTO 与 MLIR source capture。
Timing: 2 min
Visual: 更新版 Keynote 第 39 页 1920×1080 确定性整页渲染。
Interaction: 在原图上识别程序意图、dialect 表达与实现映射的边界。
Sources: publish-keynote-page-39
Boundary: 源码截图是历史源稿内容；本页不声称已用当前工具链重新编译。
Narrative: 可读源码让语义意图成为 review 对象，也为后续自动生成模型和测试提供输入。
Transition: 下一页保留原稿中的历史性能结果。
[Sources]
- source: K39
- catalog: publish-keynote-page-39
-->

---

# 历史源稿性能结果

<KeynoteSourceStage background="/generated/slides/s55-keynote-page-40.png" title="历史源稿性能结果" claim="历史源稿性能结果" slide-id="S55" />

<!--
Slide-ID: S55
Objective: 完整保留原 Keynote 第 32 页的历史性能图表。
Timing: 2 min
Visual: 更新版 Keynote 第 40 页 1920×1080 确定性整页渲染。
Interaction: 让学生区分历史 source result 与本课程 q_proj replay evidence。
Sources: publish-keynote-page-40
Boundary: 性能图明确标为历史源稿结果，不作为本次环境新测量。
Narrative: 历史结果提供设计动机，但当前结论必须由当前 artifact、版本与复现记录支撑。
Transition: 下一页保留原稿对 Swizzle 的解释。
[Sources]
- source: K40
- catalog: publish-keynote-page-40
-->

---

# Swizzle

<KeynoteSourceStage background="/generated/slides/s56-keynote-page-41.png" title="Swizzle" claim="Swizzle" slide-id="S56" />

<!--
Slide-ID: S56
Objective: 完整保留原 Keynote 第 33 页的 Swizzle source 与 mapping。
Timing: 2 min
Visual: 更新版 Keynote 第 41 页 1920×1080 确定性整页渲染。
Interaction: 沿原图说明逻辑 Tile layout 与物理访问分布之间的关系。
Sources: publish-keynote-page-41
Boundary: Swizzle 可见内容直接来自历史源稿，不延伸到未核实实现细节。
Narrative: layout 变换可以在语义不变时改变 bank 分布、连续性与端口压力。
Transition: 下一页保留对应的历史容量与性能结果。
[Sources]
- source: K41
- catalog: publish-keynote-page-41
-->

---

# Swizzle 容量与性能

<KeynoteSourceStage background="/generated/slides/s57-keynote-page-42.png" title="Swizzle 容量与性能" claim="Swizzle 容量与性能" slide-id="S57" />

<!--
Slide-ID: S57
Objective: 完整保留原 Keynote 第 34 页的容量与性能内容。
Timing: 2 min
Visual: 更新版 Keynote 第 42 页 1920×1080 确定性整页渲染。
Interaction: 讨论容量变化、访问分布与历史性能曲线之间可能的因果链。
Sources: publish-keynote-page-42
Boundary: 所有数值明确属于历史源稿，不标为当前实验结果。
Narrative: 容量与性能不是孤立参数；它们通过 layout、并发请求和端口冲突共同作用。
Transition: 下面把模型结果系统地转写成设计约束。
[Sources]
- source: K42
- catalog: publish-keynote-page-42
-->

---

# 从模型结果到设计约束

<FullBleedStage background="/generated/slides/s58-model-parameters-design-constraints-v2.png" title="从模型结果到设计约束" claim="每个敏感参数都要落到容量、端口、队列、带宽或延迟契约，并写出可验证的接受条件。" eyebrow="MODEL → DESIGN" slide-id="S58">
  <template #diagram><div class="diagram-dock architecture-chain"><span>Model result</span><i>→</i><span>Capacity</span><i>·</i><span>Ports</span><i>·</i><span>Queues</span><i>·</i><span>Bandwidth</span><i>·</i><span>Latency</span><i>→</i><span>Acceptance</span></div></template>
</FullBleedStage>

<!--
Slide-ID: S58
Objective: 把模型敏感性翻译为 capacity、ports、queues、bandwidth、latency 的设计约束。
Timing: 2 min
Visual: 参数结果经过约束分类器，最终进入可执行 acceptance。
Interaction: 选择一个 sweep 信号，写出资源约束、可测指标与失败判据。
Sources: course-synthesis; qproj-davincioo-lab
Boundary: 敏感性用于形成候选约束，不直接决定实现尺寸或 PPA 最优点。
Narrative: 设计约束必须比“加大队列”更具体：谁拥有容量、哪个端口承载流量、何时 backpressure、如何验收。
Transition: 任何实现约束都必须先服从 PTO-ASL 的语义权威。
[Sources]
- catalog: course-synthesis
- catalog: qproj-davincioo-lab
-->

---

# PTO-ASL 是语义权威

<FullBleedStage background="/generated/slides/s59-pto-asl-semantics-v2.png" title="PTO-ASL 是语义权威" claim="实现可以改变队列与流水线，但不能悄悄改变 TLOAD、TMOV、TEXTRACT、TPUSH、TPOP 的软件可见 effect。" eyebrow="NORMATIVE SEMANTICS" slide-id="S59">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">TLOAD · TMOV · TEXTRACT<small>Tile 数据与布局语义</small></span><span style="--layer:#ffbe00">TPUSH · TPOP<small>架构状态交互</small></span><span style="--layer:#f16bb5">TPUT / TGET — DaVinciOO communication extensions — not normative PTO-ASL<small>GM → UB → GM</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S59
Objective: 以 PTO-ASL 约束 TLOAD、TMOV、TEXTRACT、TPUSH、TPOP 的语义，并隔离通信扩展。
Timing: 2 min
Visual: normative PTO-ASL 主区与醒目的 TPUT/TGET 扩展侧栏分离。
Interaction: 给出一项性能优化，让学生判断它改变实现时序还是软件可见 effect。
Sources: pto-spec; davincioo-public-docs; normative-language
Boundary: TPUT/TGET 明确标为 DaVinciOO communication extensions，不属于 normative PTO-ASL。
Narrative: 语义权威使不同模型与实现可以共享同一正确性目标。扩展必须单独命名，不能借用规范权威。
Transition: NDF 把语义意图逐层转成实现机制与验收契约。
[Sources]
- catalog: pto-spec
- catalog: davincioo-public-docs
- catalog: normative-language
-->

---

# NDF：从意图到可执行验收

<FullBleedStage background="/generated/slides/s60-ndf-l0-l3-v2.png" title="NDF：从意图到可执行验收" claim="L0 intent → L1 contract → L2 mechanism → L3 executable acceptance；层间关系必须显式可追踪。" eyebrow="TRACEABLE DESIGN" slide-id="S60">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">L0 · Intent<small>为什么需要它</small></span><span style="--layer:#b9ff33">L1 · Contract<small>软件与邻接模块可依赖什么</small></span><span style="--layer:#ffbe00">L2 · Mechanism<small>资源与状态如何实现</small></span><span style="--layer:#f16bb5">L3 · Executable acceptance<small>current: draft test contract, not implementation</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S60
Objective: 解释 NDF L0–L3 与 refines、verifies、derived-from 三类追踪关系。
Timing: 2 min
Visual: 四层 NDF 垂直堆栈，双向链接标注 refines、verifies、derived-from。
Interaction: 把“q_proj 不因 Tile tag 不足停顿”分别写成 L0、L1、L2、L3。
Sources: ndf-course; normative-language
Boundary: 当前 L3 明确是 draft test contract，不是已经存在的 implementation。
Narrative: L0 说明意图，L1 固定接口契约，L2选择机制，L3 把验收写成可运行条件；追踪边让变化影响可计算。
Transition: 用 q_proj vertical slice 给每个模块稳定 ID 与接口。
[Sources]
- catalog: ndf-course
- catalog: normative-language
-->

---

# q_proj vertical slice：稳定 ID 与接口

<FullBleedStage background="/generated/slides/s61-qproj-vertical-slice-v2.png" title="q_proj vertical slice：稳定 ID 与接口" claim="sequence_id 穿过 Trace、Tile Register、TMA、Extract、Matmul 与乱序窗口。" eyebrow="IMPLEMENTATION CONTRACT" slide-id="S61">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">TRACE-01 · Trace<small>input_tiles / output_tiles / scalar_inputs</small></span><span style="--layer:#b9ff33">TREG-01 · Tile Register<small>address / shape / layout / dtype</small></span><span style="--layer:#ffbe00">TMA-01 · VEX-01 · CUBE-01<small>TMA / Extract / Matmul</small></span><span style="--layer:#f16bb5">O3-01 · ROB / IQ / Scoreboard<small>readiness: rename / scoreboard derived</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S61
Objective: 定义 q_proj vertical slice 的稳定 IDs、接口字段和 acceptance 边界。
Timing: 2 min
Visual: Trace 的 input_tiles/output_tiles/scalar_inputs 连接 Tile Register、TMA、Vector Extract、Cube Matmul 与 ROB/IQ/Scoreboard。
Interaction: 选一个 sequence_id，逐模块说出输入、输出、状态所有者与验收检查。
Sources: ndf-course; qproj-davincioo-lab; course-synthesis
Boundary: IDs 是课程设计契约；不冒充已完成的生产实现或最终命名。
Narrative: 稳定 ID 让 spec、模型、实现和测试讨论同一个对象；dependency/readiness edges 由 rename/scoreboard 从 Tile 读写推导，而非 trace 显式字段。
Transition: 下一页把这些契约交给协作 Agent，并限定 pyCircuit 的角色。
[Sources]
- catalog: ndf-course
- catalog: qproj-davincioo-lab
- catalog: course-synthesis
-->

---

# Agent 协作落到 pyCircuit

<FullBleedStage background="/generated/slides/s62-agent-collaboration-pycircuit-v2.png" title="Agent 协作落到 pyCircuit" claim="spec、model、implementation、verification Agent 围绕同一 NDF 与 trace 工作；pyCircuit 是 pinned implementation target/source surface。" eyebrow="AGENT-DRIVEN COOPERATION" slide-id="S62">
  <template #diagram><div class="diagram-dock architecture-chain"><span>Spec Agent</span><i>↔</i><span>Model Agent</span><i>↔</i><span>Implementation Agent</span><i>↔</i><span>Verification Agent</span><i>→</i><span>vendor/pyCircuit<br><small>pinned source · target</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S62
Objective: 说明 Agent 如何围绕 spec、model、implementation、verification 与 pyCircuit 协作。
Timing: 2 min
Visual: 四类 Agent 共享 NDF、trace 和 acceptance，输出指向仓内 pinned vendor/pyCircuit source surface。
Interaction: 让学生为一个接口变更分配提案、模型影响、实现和验证责任。
Sources: pycircuit; davincioo-public-docs; agentic-materials
Boundary: pyCircuit 是 implementation target/source surface，不是 RTL 或 silicon；本页不声称已执行、已编译或已有 replay 结果。
Narrative: Agent 的并行度来自稳定契约，而不是各自猜测。pinned vendor/pyCircuit 提供可审计的实现目标与源码面。
Transition: 实现与 gfsim 必须消费同一 trace 才能形成闭环比较。
[Sources]
- catalog: pycircuit
- catalog: davincioo-public-docs
- catalog: agentic-materials
-->

---

# 闭环验证：先定义验收，再比较结果

<FullBleedStage background="/generated/slides/s63-dual-model-closed-loop-validation-v2.png" title="闭环验证：先定义验收，再比较结果" claim="当前是 proposed acceptance design：同一 trace 进入 checked gfsim evidence 与 pyCircuit replay target；只定义验收项，不展示 pyCircuit 结果。" eyebrow="CLOSED-LOOP VERIFICATION" slide-id="S63">
  <template #diagram><ClosedLoopVerification /></template>
</FullBleedStage>

<!--
Slide-ID: S63
Objective: 提出未来用同一 trace 比较 gfsim 与 pyCircuit target 的分层 acceptance design。
Timing: 2 min
Visual: proposed trace 分叉设计连接 checked gfsim artifact 与 pyCircuit replay target，五类验收项在下方汇合。
Interaction: 上下键选择 coverage、order、resource trends、errors、perf envelope acceptance criterion。
Sources: qproj-davincioo-lab; pycircuit; course-model
Boundary: 本页是 proposed acceptance design；不声称 replay implementation 已存在或 pyCircuit 已产出结果。绝对 cycles 只有校准后才可比较。
Narrative: 计划中的闭环不会要求两个模型内部一致，而会在共享观察点比较覆盖、顺序、资源趋势、错误与性能包络。
Transition: 最后一页把闭环扩展成持续的体系结构研究飞轮。
[Sources]
- catalog: qproj-davincioo-lab
- catalog: pycircuit
- catalog: course-model
-->

---

# 体系结构研究的 Agent 飞轮

<FullBleedStage background="/generated/slides/s64-research-flywheel-v2.png" title="体系结构研究的 Agent 飞轮" claim="Agent 加速可执行证据循环；选择问题、划定语义边界和判断架构取舍仍是研究核心。" eyebrow="ARCHITECTURE JUDGMENT FIRST" slide-id="S64">
  <template #diagram><div class="diagram-dock architecture-chain flywheel-chain"><span>Workload</span><i>→</i><span>PTO</span><i>→</i><span>Trace</span><i>→</i><span>Model</span><i>→</i><span>Explore</span><i>→</i><span>ASL / NDF</span><i>→</i><span>pyCircuit / Core</span><i>→</i><span>Evidence</span><i>↻</i><span>new questions</span></div></template>
</FullBleedStage>

<!--
Slide-ID: S64
Objective: 总结 Workload→PTO→Trace→Model→Explore→ASL/NDF→pyCircuit/Core→Evidence→new questions 的研究闭环。
Timing: 2 min
Visual: 发光飞轮把九个研究阶段连成可重复循环，中心保留 architecture judgment。
Interaction: 每位学生选择飞轮中的一个边，写下其输入证据、输出 artifact 与停止条件。
Sources: agentic-materials; course-synthesis; qproj-davincioo-lab
Boundary: Agent 是研究工具，不替代语义权威、实验边界或体系结构判断。
Narrative: 好的 Agentic Circuit 流程缩短“提出假设到得到可审计反证”的时间。研究价值来自更快地产生新问题，而不是自动生成确定答案。
Transition: 课程结束；回到自己的 workload，从一个可复现 vertical slice 开始下一轮。
[Sources]
- catalog: agentic-materials
- catalog: course-synthesis
- catalog: qproj-davincioo-lab
-->
