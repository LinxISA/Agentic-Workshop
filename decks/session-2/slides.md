---
theme: default
title: 从 LinxCore 到可复现实验 · 第二课
info: 逐级微架构、NDF、pyCircuit 与 Agent 研究闭环
transition: fade-out
colorSchema: dark
mdc: true
favicon: /generated/slides/s22-core-dive.png
fonts:
  sans: "MiSans, Noto Sans SC, Microsoft YaHei, sans-serif"
  mono: "SFMono-Regular, Menlo, monospace"
  provider: none
---

# 从屋顶钻进核心

<FullBleedStage background="/generated/slides/s22-core-dive.png" title="从屋顶钻进核心" claim="第一课给出上界；第二课解释每个周期为什么达不到上界。" eyebrow="SESSION 02 · MICROARCHITECTURE" slide-id="S22">
  <template #diagram><div class="diagram-dock"><ArchitectureZoom level="core" :active-path="['chip','cluster','core','queue','cycle']" /></div></template>
</FullBleedStage>

<!--
Slide-ID: S22
Objective: 从宏观 Roofline 平滑切换到核心内部的周期级资源竞争。
Timing: 1 min
Visual: 镜头从封装穿入乱序核心；前景尺度条从 chip 走到 cycle。
Interaction: 复盘第一课投票，问“带宽不足”在核心内部会留下哪些可观察状态。
Sources: course-synthesis; linxcore
Boundary: 爆炸图表达通用乱序核心层次，不声称是 LinxCore 物理版图。
Narrative: Roofline 告诉我们哪类资源可能限制上界，但无法说明气泡从哪个周期开始传播。第二课沿 LinxCore 的真实模块边界建立逐级模型。
-->

---

# LinxCore：真实模块，真实问题

<FullBleedStage background="/generated/slides/s23-linxcore-case.png" title="LinxCore：真实模块，真实问题" claim="以开源 LinxCore 为锚点，把前端、调度、执行、访存和提交连成系统。" eyebrow="CASE STUDY" slide-id="S23">
  <template #diagram><LinxCoreModuleExplorer /></template>
</FullBleedStage>

<!--
Slide-ID: S23
Objective: 给学生一张可点击的 LinxCore 模块地图，并建立代码来源意识。
Timing: 4 min
Visual: 模块化核心由 frontend、BISQ、execute、memory、BROB 等区域组成；前景 explorer 逐个高亮模块。
Interaction: 点击模块，预测它拥有的状态、输入输出队列和最可能的背压来源。
Sources: linxcore; course-synthesis
Boundary: 组件只使用已核实的模块名；描述中的通用乱序概念与具体实现细节分开标注。
Narrative: LinxCore 的价值不是提供一张漂亮框图，而是让每个主张都能回到代码。我们用它校准模块边界，再把适合教学的行为投影到 NDF 与 pyCircuit 模型。
-->

---

# PTO 定义语义，不规定微架构

<FullBleedStage background="/generated/slides/s24-pto-contract.png" title="PTO 定义语义，不规定微架构" claim="同一虚拟 ISA effect 可以由不同流水线、缓存和调度策略实现。" eyebrow="SEMANTIC CONTRACT" slide-id="S24">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">PTO effect<small>软件可依赖的语义</small></span><span style="--layer:#ffbe00">Implementation choice<small>tile、queue、latency、ports</small></span><span style="--layer:#b9ff33">Measured behavior<small>cycles、traffic、stalls</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S24
Objective: 明确采用 PTO-ISA/pto-spec，并严格分离规范语义与课程实现。
Timing: 3 min
Visual: 中央语义边界连接多个不同处理器实现；前景用三层标出 effect、choice、measurement。
Interaction: 给出一个 matrix/tile effect，让学生列出“规范必须保证”和“硬件可以选择”的各两项。
Sources: pto-spec; normative-language
Boundary: 不使用 ARM ASL；PTO 引用只覆盖仓内核实的公开定义，课程模型不冒充规范。
Narrative: 语义边界是软硬件协同的稳定支点。Agent 可以探索实现，但不能悄悄改变软件可见 effect；所有实现假设必须写成独立的 architecture choice。
-->

---

# 同一个算子穿过五层

<FullBleedStage background="/generated/slides/s25-cross-layer.png" title="同一个算子穿过五层" claim="算法、Tile 程序、ISA effect、微操作和硬件事件，是五种不同观察层。" eyebrow="CROSS-LAYER TRACE" slide-id="S25">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">Algorithm<small>矩阵与依赖</small></span><span style="--layer:#ffbe00">Tile program<small>分块与搬运</small></span><span style="--layer:#b9ff33">PTO effect<small>架构语义</small></span><span style="--layer:#f16bb5">Micro-ops<small>队列与端口</small></span><span style="--layer:#f5f8ff">Cycle events<small>fire / stall / commit</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S25
Objective: 建立跨层 traceability，避免把某一层的术语错误投射到另一层。
Timing: 3 min
Visual: 同一矩阵 tile 垂直穿过五个透明层，最终落入物理核心事件。
Interaction: 选择 TLOAD 或 MATMUL，从算法意图一直口述到 queue fire 与 cache request。
Sources: pto-spec; pycircuit; course-synthesis
Boundary: 微操作拆分和硬件信号属于课程实现；只有 effect 层引用 PTO 规范。
Narrative: 可追踪性让性能数字能够回到源头。某个 stall 可以追到具体队列，再追到 tile 调度和算法形状，而不是只停留在“利用率低”的症状。
-->

---

# 流水线是一组相互背压的队列

<FullBleedStage background="/generated/slides/s26-core-pipeline.png" title="流水线是一组相互背压的队列" claim="现代核心不是单向传送带，而是带状态、反馈和资源竞争的队列网络。" eyebrow="CORE MODEL" slide-id="S26">
  <template #diagram><LinxCoreModuleExplorer /></template>
</FullBleedStage>

<!--
Slide-ID: S26
Objective: 用队列网络而非理想流水线理解乱序核心的状态与反馈。
Timing: 3 min
Visual: Fetch 到 Commit 的宽流水线包含多条反馈和资源控制路径；前景 explorer 逐级选择状态所有者。
Interaction: 点击一个模块，要求学生指出 valid、ready、payload 分别由哪一侧持有。
Sources: linxcore; course-synthesis
Boundary: 图只标注已核实模块或通用概念；不推断未检查的内部策略。
Narrative: 队列把时间解耦，也把压力储存起来。性能分析的关键不是某阶段“快不快”，而是生产速率、消费速率、容量和反馈延迟如何共同演化。
-->

---

# Fetch/Decode：带宽从前端开始

<FullBleedStage background="/generated/slides/s27-frontend.png" title="Fetch/Decode：带宽从前端开始" claim="前端供给不足会让后端算力失去意义；错误路径还会浪费真实带宽。" eyebrow="FRONTEND" slide-id="S27">
  <template #diagram><PipelineStepper :stages="[{title:'I-Cache',subtitle:'blocks',detail:'Instruction bytes arrive.'},{title:'Predict',subtitle:'next PC',detail:'Choose the speculative path.'},{title:'Decode',subtitle:'lanes',detail:'Create operations.'},{title:'Rename',subtitle:'dispatch',detail:'Enter the out-of-order window.'}]" /></template>
</FullBleedStage>

<!--
Slide-ID: S27
Objective: 说明核心吞吐上限从取指与解码开始，并量化分支错误的供给损失。
Timing: 3 min
Visual: I-cache 向多路 decode 供给，洋红错误路径被 flush；前景 stepper 展示四个前端阶段。
Interaction: 逐步调整宽度和分支准确率的口算场景，判断后端每周期可见的有效操作数。
Sources: linxcore; course-model
Boundary: 性能曲线来自课程前端模型；具体 LinxCore 宽度和预测器策略只以代码证据为准。
Narrative: 执行端口再多，如果前端不能稳定供给就会空转。分支错误不仅增加延迟，还消耗 fetch、decode、rename 和缓存带宽，直到恢复边界生效。
-->

---

# Rename 与 ROB：乱序执行，顺序退休

<FullBleedStage background="/generated/slides/s28-rename-rob.png" title="Rename 与 ROB：乱序执行，顺序退休" claim="重命名释放假依赖，ROB 保存程序顺序、异常边界和恢复状态。" eyebrow="ORDERING" slide-id="S28">
  <template #diagram><PipelineStepper :stages="[{title:'Rename',subtitle:'map',detail:'Allocate physical destinations.'},{title:'Execute',subtitle:'out of order',detail:'Run when operands are ready.'},{title:'Complete',subtitle:'mark done',detail:'Return results to the window.'},{title:'Commit',subtitle:'in order',detail:'Make state architecturally visible.'}]" /></template>
</FullBleedStage>

<!--
Slide-ID: S28
Objective: 区分执行完成与架构提交，理解 ROB 在精确状态中的角色。
Timing: 3 min
Visual: 多条 rename 路径汇入环形 ROB，在 commit 边界重新顺序化；前景播放四阶段生命周期。
Interaction: 点击 Rename→Execute→Complete→Commit，询问每一步可以撤销哪些状态。
Sources: linxcore; course-synthesis
Boundary: 具体 ROB entry 字段与恢复机制以 LinxCore 代码为准，图中为教学抽象。
Narrative: 乱序扩大可用并发，但软件仍要求顺序、异常和控制流可解释。ROB 把“物理完成”与“架构可见”分开，也是 miss 或误预测压力回传的重要容量边界。
-->

---

# Issue Queue：谁准备好了

<FullBleedStage background="/generated/slides/s29-issue-queue.png" title="Issue Queue：谁准备好了" claim="发射性能由唤醒、选择、端口和队列压力共同决定。" eyebrow="SCHEDULER" slide-id="S29">
  <template #diagram><QueuePressure /></template>
</FullBleedStage>

<!--
Slide-ID: S29
Objective: 用 arrival、service、depth 三个参数解释 issue queue 的占用和回压。
Timing: 3 min
Visual: 依赖唤醒点亮 ready entries，有限端口只选出少数；前景队列可调到饱和。
Interaction: 增加 dispatch rate 或降低 issue rate，观察 occupancy、headroom 和 stalled 状态。
Sources: linxcore; pycircuit; course-model
Boundary: QueuePressure 只演示容量动力学，选择优先级与端口兼容性需查看具体实现。
Narrative: 调度器不是“找到 ready 指令”这么简单。每周期要完成唤醒、可执行端口匹配、优先级选择和状态更新；临界路径与容量往往形成 PPA 权衡。
-->

---

# Execute 与 bypass：结果何时可消费

<FullBleedStage background="/generated/slides/s30-execute-bypass.png" title="Execute 与 bypass：结果何时可消费" claim="执行延迟、吞吐和旁路覆盖，共同决定依赖链速度。" eyebrow="EXECUTION" slide-id="S30">
  <template #diagram><PipelineStepper :stages="[{title:'Issue',subtitle:'select',detail:'Reserve a compatible port.'},{title:'Execute',subtitle:'latency',detail:'Advance through the unit.'},{title:'Bypass',subtitle:'forward',detail:'Wake dependent operations.'},{title:'Writeback',subtitle:'state',detail:'Store the physical result.'}]" /></template>
</FullBleedStage>

<!--
Slide-ID: S30
Objective: 分清 latency、throughput 与 bypass 三个经常混淆的执行参数。
Timing: 3 min
Visual: 三条不同执行流水线带有返回旁路弧；前景 stepper 逐步显示 issue 到 writeback。
Interaction: 比较独立乘法流与乘法依赖链，解释为何同一单元有不同吞吐表现。
Sources: linxcore; course-synthesis
Boundary: 流水级数与 bypass 覆盖为通用模型，具体路径必须由 LinxCore 源码或波形确认。
Narrative: 一个四周期流水单元可以每周期接收新操作，却仍让依赖链每四周期前进一步。旁路决定结果何时能唤醒消费者，写回则决定状态何时稳定保存。
-->

---

# LSU：地址、顺序、缓存与 miss

<FullBleedStage background="/generated/slides/s31-load-store.png" title="LSU：地址、顺序、缓存与 miss" claim="访存单元同时处理地址生成、内存顺序、转发、缓存和未完成请求。" eyebrow="LOAD / STORE" slide-id="S31">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">AGU<small>计算地址</small></span><span style="--layer:#ffbe00">LQ / SQ<small>顺序与转发</small></span><span style="--layer:#b9ff33">D-Cache<small>命中、端口、bank</small></span><span style="--layer:#f16bb5">Miss path<small>MSHR 与下级内存</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S31
Objective: 把一个 load 拆成多个结构阶段，连接第一课的存储层级与核心队列。
Timing: 4 min
Visual: LSU 切面包含 AGU、LQ、SQ、D-cache 和 miss path；前景逐层说明职责。
Interaction: 追踪一次 load：地址未知、命中、store forwarding、cache miss 四种路径分别占用什么状态。
Sources: linxcore; course-synthesis
Boundary: 模块拆分采用通用 LSU 术语；LinXCore 的确切结构只陈述已核实部分。
Narrative: 访存比算术复杂，因为结果取决于地址、程序顺序和缓存状态。一个 miss 会长时间占用 entry，并通过依赖链和容量压力影响完全不同的前端模块。
-->

---

# 一次 cache miss 如何拖慢全核

<FullBleedStage background="/generated/slides/s32-miss-propagation.png" title="一次 cache miss 如何拖慢全核" claim="Miss 先占住 LSU，再堵塞 issue、ROB、rename，最终让 fetch 停止。" eyebrow="PRESSURE WAVE" slide-id="S32">
  <template #diagram><QueuePressure /></template>
</FullBleedStage>

<!--
Slide-ID: S32
Objective: 展示局部 miss 如何通过依赖和有限容量传播为全核停顿。
Timing: 3 min
Visual: 洋红压力波从内存端逆向穿过执行、issue、rename 和 fetch；前景队列显示 headroom 消失。
Interaction: 先令 service rate 小于 arrival rate，再指出每个上游模块在什么条件下停止接收。
Sources: course-model; linxcore; course-synthesis
Boundary: 传播顺序是教学级因果路径；真实乱序核心可用独立指令部分隐藏 miss。
Narrative: Miss latency 本身只说明一个请求等待多久；全核性能取决于等待期间还有多少独立工作，以及 LQ、ROB、issue queue 等窗口何时被占满。
-->

---

# Backpressure 是一个闭环

<FullBleedStage background="/generated/slides/s33-backpressure.png" title="Backpressure 是一个闭环" claim="下游满会向上游传播 stop；下游释放又向前传播 progress。" eyebrow="HANDSHAKE" slide-id="S33">
  <template #diagram><TimingDiagram :cycles="8" /></template>
</FullBleedStage>

<!--
Slide-ID: S33
Objective: 用 valid/ready/fire 波形解释数据保持、停顿和恢复的周期语义。
Timing: 4 min
Visual: 物理核心外围形成闭合 backpressure 回路；前景波形可逐周期播放。
Interaction: Step 波形，找出 valid=1、ready=0 时 payload 必须保持的周期，以及真正发生 transfer 的周期。
Sources: pycircuit; course-synthesis
Boundary: valid-ready 是课程模型采用的握手；具体 LinxCore 接口需以实现为准。
Narrative: 把回压建成显式信号比写一个平均吞吐公式更强，因为它保留了状态所有权和周期边界。这个契约正适合用 pyCircuit 表达和检查。
-->

---

# 用 NDF 描述模块、队列和因果边

<FullBleedStage background="/generated/slides/s34-ndf-graph.png" title="用 NDF 描述模块、队列和因果边" claim="NDF 记录设计承诺：谁拥有状态、谁生产、谁消费、什么条件推进。" eyebrow="NETWORK DESCRIPTION FORMAT" slide-id="S34">
  <template #diagram><NdfTraceability /></template>
</FullBleedStage>

<!--
Slide-ID: S34
Objective: 把 LinxCore 物理模块投影为可追踪的 NDF 节点、端口、队列和主张。
Timing: 4 min
Visual: 左侧物理核心一对一投影为右侧分层图；前景 traceability 组件强调来源与边界。
Interaction: 选择 Issue Queue，填写最小 NDF：inputs、outputs、state、fire condition、evidence link。
Sources: ndf; linxcore; agentic-tao-material
Boundary: NDF 是课程设计方法，不是 PTO 官方格式；所有 normative 语句必须带来源。
Narrative: NDF 的价值不是换一种画框图，而是让每条边都可判定。它把自然语言主张、代码符号、实验指标和不确定边界放在同一设计记录里。
-->

---

# 用 pyCircuit 把周期语义跑起来

<FullBleedStage background="/generated/slides/s35-pycircuit-cycle.png" title="用 pyCircuit 把周期语义跑起来" claim="模块、寄存器和队列在时钟边界更新；相同输入必须产生可重放轨迹。" eyebrow="EXECUTABLE MODEL" slide-id="S35">
  <template #diagram><TimingDiagram :cycles="10" /></template>
</FullBleedStage>

<!--
Slide-ID: S35
Objective: 说明 pyCircuit 在课程中负责实现可执行的周期状态机，而非替代 RTL 全流程。
Timing: 4 min
Visual: 时钟脉冲推动 token 穿过寄存器、队列和功能单元；前景逐周期观察 fire/stall。
Interaction: 修改 ready 序列或逐步播放，检查 payload 在 stall 周期是否保持、计数器是否只在 fire 时更新。
Sources: pycircuit; agentic-circuit-material
Boundary: 示例聚焦当前 pyCircuit frontend 支持的队列与寄存器语义，不承诺完整 LinxCore 等价模型。
Narrative: 可执行模型让“应该会背压”变成可以失败的测试。Agent 修改模块后，固定 stimulus、trace schema 和断言会独立判断行为是否仍满足设计承诺。
-->

---

# 先固定 workload 和 baseline

<FullBleedStage background="/generated/slides/s36-reproducible-baseline.png" title="先固定 workload 和 baseline" claim="没有固定输入、配置、指标和产物，任何性能比较都不可信。" eyebrow="EXPERIMENT CONTRACT" slide-id="S36">
  <template #diagram><div class="diagram-dock architecture-chain"><span>Workload</span><i>+</i><span>Config</span><i>→</i><span>Trace</span><i>+</i><span>Metrics</span><i>→</i><span>Verdict</span></div></template>
</FullBleedStage>

<!--
Slide-ID: S36
Objective: 定义可复现实验的最小契约：固定 workload、配置、种子、指标和原始产物。
Timing: 3 min
Visual: 处理器被 workload、cycle model 和多组测量仪器包围；前景显示实验数据流。
Interaction: 打开本仓实验目录，指出 input、config、artifact、expected 与 validator 的位置。
Sources: experiments; agentic-circuit-material; course-synthesis
Boundary: 实验为教学规模模型，目标是方法可复现，不是宣称硅后性能。
Narrative: Agent 可以生成很多结果，但可重复不等于可信。baseline 必须能被另一进程从干净环境重跑，指标必须从原始 trace 派生，verdict 必须由独立检查器给出。
-->

---

# 实验一：扫描内存带宽

<FullBleedStage background="/generated/slides/s37-bandwidth-sweep.png" title="实验一：扫描内存带宽" claim="只改变带宽，观察性能先增长后在计算屋顶饱和。" eyebrow="REPRODUCIBLE LAB 09" slide-id="S37">
  <template #diagram><InteractiveRoofline /></template>
</FullBleedStage>

<!--
Slide-ID: S37
Objective: 通过单变量 sweep 验证 Roofline 对带宽区间与计算区间的预测。
Timing: 5 min
Visual: 相同核心连接逐渐变宽的内存通道；前景 Roofline 滑杆与仓内实验结果相互校准。
Interaction: 运行实验 09 或使用离线结果，预测每个 bandwidth 点的性能，并找出 ridge point。
Sources: experiments; roofline-paper; course-model
Boundary: sweep 使用课程性能模型；结果用于验证趋势与上界，不代表 LinxCore RTL benchmark。
Narrative: 单变量实验先保持 peak、AI、队列和延迟不变，再改变 BW。预测曲线必须在 ridge 之前近似线性、之后饱和；偏离时再检查并发和队列约束。
-->

---

# 实验二：Cache、局部性与队列深度

<FullBleedStage background="/generated/slides/s38-cache-queue-sweep.png" title="实验二：Cache、局部性与队列深度" claim="更大 cache 减少流量，更深队列隐藏延迟；两者解决的不是同一个问题。" eyebrow="REPRODUCIBLE LAB 10" slide-id="S38">
  <template #diagram><ExperimentPanel /></template>
</FullBleedStage>

<!--
Slide-ID: S38
Objective: 比较 locality 优化与 concurrency 优化，观察它们对不同指标的影响。
Timing: 5 min
Visual: 三个核心变体分别增加 cache、增加 queue、同时平衡；前景切换变体查看 PERF、TRAFFIC、QUEUE。
Interaction: 运行实验 10 或使用离线结果，解释为何 queue 变深不一定降低 DRAM bytes，cache 变大也不一定消除依赖链延迟。
Sources: experiments; course-model; linxcore
Boundary: 变体是教学参数化模型，未包含 cache 面积、频率和功耗回归。
Narrative: 不同优化应由不同证据裁判。Cache 看 miss 与 bytes，queue 看 occupancy、headroom 与 overlap，性能只是最终结果；只看单一 speedup 会掩盖代价和原因。
-->

---

# 预测 Roofline，对照周期轨迹

<FullBleedStage background="/generated/slides/s39-predicted-measured.png" title="预测 Roofline，对照周期轨迹" claim="宏观模型负责提出上界，微观轨迹负责解释偏差。" eyebrow="MODEL VALIDATION" slide-id="S39">
  <template #diagram><div class="diagram-dock evidence-strip"><span>Roofline<b class="compute">Upper bound</b></span><span>Cycle model<b class="data">Measured</b></span><span>Gap<b class="bottleneck">Queue / latency</b></span><span>Action<b>Refine model</b></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S39
Objective: 建立宏观预测与微观测量的双模型校准方法。
Timing: 3 min
Visual: Roofline 山脊与下方流水线由同一 operating point 连接；前景并列 upper bound、measured、gap、action。
Interaction: 给出 Roofline 预测 100、周期模型测得 72，要求提出三项可区分的补充指标。
Sources: roofline-paper; experiments; course-synthesis
Boundary: 两类模型精度不同；不应强迫周期模型等于上界，而应解释差距。
Narrative: 好模型不是每次都“预测正确”，而是当预测失败时能告诉我们缺少哪条结构约束。队列占用、端口利用、miss overlap 与前端气泡共同把 gap 变成可定位证据。
-->

---

# Agent 进入研究闭环，而不是替代裁判

<FullBleedStage background="/generated/slides/s40-agent-research-loop.png" title="Agent 进入研究闭环，而不是替代裁判" claim="提出变体、运行模型、收集证据、批判结果；每一步都有边界和失败条件。" eyebrow="AGENTIC RESEARCH LOOP" slide-id="S40">
  <template #diagram><PipelineStepper :stages="[{title:'Propose',subtitle:'bounded delta',detail:'Change one architecture claim.'},{title:'Simulate',subtitle:'replay',detail:'Run fixed workloads.'},{title:'Measure',subtitle:'artifacts',detail:'Collect traces and metrics.'},{title:'Critique',subtitle:'independent',detail:'Reject unsupported conclusions.'}]" /></template>
</FullBleedStage>

<!--
Slide-ID: S40
Objective: 把 Agent 定位为受约束的研究协作者，并保留独立验证者。
Timing: 4 min
Visual: 中央处理器连接 propose、simulate、measure、critique 四台装置，无机器人或拟人形象。
Interaction: 让学生给 Agent 一个最小 design delta，并写出 validator 必须拒绝的两种错误结论。
Sources: agentic-tao-material; agentic-circuit-material; normative-language
Boundary: Agent 不产生规范真相；它的主张必须由来源、实验和独立检查器支持。
Narrative: 研究自动化最危险的不是代码错误，而是未经证明的因果叙事。闭环必须限制修改范围、固定输入、保存原始产物，并让 critique 阶段能真正返回失败。
-->

---

# 最优设计是一条 Pareto 前沿

<FullBleedStage background="/generated/slides/s41-pareto.png" title="最优设计是一条 Pareto 前沿" claim="性能、流量、面积、功耗和复杂度之间没有单一冠军。" eyebrow="DESIGN SPACE" slide-id="S41">
  <template #diagram><ParetoFrontier /></template>
</FullBleedStage>

<!--
Slide-ID: S41
Objective: 用 Pareto 概念收束多指标体系结构探索，避免只追求单一性能数字。
Timing: 3 min
Visual: 多个硬件配置映射到三维设计空间，非支配前沿发光；前景组件可选择候选点。
Interaction: 选择两个 Pareto 点，分别为云端吞吐、边缘功耗和教学实现三个场景辩护。
Sources: course-model; course-synthesis
Boundary: 当前 cost 指标为教学代理量，不替代综合、时序和功耗工具。
Narrative: Agent 的优势是能遍历更多候选，但选择仍需要明确目标和代价。任何“最优”都必须附带约束条件、测量方法与不确定性。
-->

---

# 体系结构优先，Agent 为证据服务

<FullBleedStage background="/generated/slides/s42-architecture-first-closing.png" title="体系结构优先，Agent 为证据服务" claim="从工作负载到周期事件，保持层次、因果、来源和可复现性。" eyebrow="TAKEAWAY" slide-id="S42">
  <template #diagram><div class="diagram-dock"><ArchitectureZoom level="cycle" :active-path="['system','package','chip','cluster','core','queue','cycle']" /><div class="claim-callout">研究对象始终是体系结构；Agentic Circuit 让架构假设更快地被表达、运行、质疑与复现。</div></div></template>
</FullBleedStage>

<!--
Slide-ID: S42
Objective: 总结两课主线，并给学生一个可以继续使用的研究工作流。
Timing: 2 min
Visual: Workload、Roofline、存储层级、队列、流水线、NDF 与 cycle token 重新组装为完整处理器。
Interaction: 回到 S02 的瓶颈投票，每位学生用一条因果链重新解释自己的答案。
Sources: course-synthesis; all-course-sources
Boundary: 总结图表示方法论关系，不声称任何单一模型覆盖全部真实处理器行为。
Narrative: 先用宏观模型找到限制区间，再沿存储层级和队列进入微架构，用 PTO 固定语义边界，以 NDF 记录设计承诺，以 pyCircuit 和实验产物建立可重放证据，最后让 Agent 在边界内探索。
-->
