---
theme: default
title: 体系结构研究的第一性原理 · 第一课
info: 从 Roofline、存储层级到加速器数据流
transition: slide-left
colorSchema: dark
mdc: true
favicon: /generated/slides/s01-architecture-first.png
fonts:
  sans: "MiSans, Noto Sans SC, Microsoft YaHei, sans-serif"
  mono: "SFMono-Regular, Menlo, monospace"
  provider: none
---

# Agent时代体系结构研究

<AscendCover
  background="/generated/slides/s01-architecture-first.png"
  title="Agent时代体系结构研究"
  claim="Architecture First · Agentic Circuit as a Research Instrument"
  speaker="周若愚"
  affiliation="华为海思半导体"
/>

<!--
Slide-ID: S01
Objective: 建立“体系结构优先、Agent 为研究工具”的课程定位。
Timing: 1 min
Visual: 左侧为海思昇腾风格 AI 处理器与带宽线路，右侧以大标题和演讲人信息建立正式开场。
Interaction: 开场提问：看到“432 TFLOPS”时，你最先追问哪个结构参数？
Sources: source-deck; agenda
Boundary: 背景为昇腾风格的概念视觉，不表示任何具体产品内部结构。
Narrative: 先建立共同语言：性能来自计算、数据移动、并发、队列与控制的共同作用。Agentic Circuit 只负责把这些假设变成可执行模型和可审计证据。
-->

---

# 自我介绍

<KeynoteSourceStage background="/generated/slides/s02-self-introduction.png" title="自我介绍" claim="姓名：周若愚" slide-id="S02" :focuses="[{ x: 78.5, y: 19, w: 18, h: 56 }]" />

<!--
Slide-ID: S02
Objective: 按原稿介绍演讲人教育背景、研究方向和工作经历。
Timing: 3 min
Visual: 原 Keynote 第 2 页完整画面；轻微聚焦右侧个人照片与海思标识，不改动文字。
Interaction: 演讲人口头补充个人经历。
Sources: publish-keynote-page-2
Boundary: 可见文字与图片均直接来自演讲人提供的 Keynote。
Narrative: 姓名、教育背景、研究方向、ARM 与华为海思经历，以及 PTO 虚拟指令集规范工作。
-->

---

# 本次暑期学校课程

<KeynoteSourceStage background="/generated/slides/s03-course-outline.png" title="本次暑期学校课程" claim="什么是计算体系结构" slide-id="S03" :focuses="[{ x: 53, y: 22, w: 42, h: 60 }]" />

<!--
Slide-ID: S03
Objective: 按原稿说明课程范围与处理器核示例的组成。
Timing: 2 min
Visual: 原 Keynote 第 3 页完整画面；轻微聚焦右侧计算、内存、互连、网络、编程关系图。
Interaction: 让学生观察右侧六个体系结构维度如何连接到课程的三部分内容。
Sources: publish-keynote-page-3
Boundary: 可见文字与图形均直接来自演讲人提供的 Keynote。
Narrative: 什么是计算体系结构；Agentic Circuit 与 NDF；基于 PTO Tile 的处理器核示例。
-->

---

# 计算机体系结构-处理器

<KeynoteSourceStage background="/generated/slides/s04-chapter-processor.png" title="计算机体系结构-处理器" claim="第一章" slide-id="S04" :focuses="[{ x: 13.5, y: 17, w: 73, h: 66 }]" />

<!--
Slide-ID: S04
Objective: 完整保留原稿的第一章章节分隔页。
Timing: 2 min
Visual: 原 Keynote 第 4 页完整画面；边框以低强度呼吸光建立章节转场。
Interaction: 章节转场，无附加可见文字。
Sources: publish-keynote-page-4
Boundary: 可见文字与装饰均直接来自演讲人提供的 Keynote。
Narrative: 第一章：计算机体系结构-处理器。
-->

---

# 冯诺依曼架构·农业时代·小农经济

<KeynoteSourceStage background="/generated/slides/s05-von-neumann-farm.png" title="冯诺依曼架构·农业时代·小农经济" claim="Von Neumann bottleneck：性能瓶颈在于计算与存储之间信息传输率" slide-id="S05" interactive :focuses="[{ x: 10, y: 20, w: 31, h: 61 }, { x: 55, y: 20, w: 20, h: 61 }, { x: 78, y: 19, w: 19, h: 66 }]" />

<!--
Slide-ID: S05
Objective: 用农业时代的小农经济比喻解释最基本的冯诺依曼结构与瓶颈。
Timing: 4 min
Visual: 原 Keynote 第 5 页完整画面；点击右下角演示按钮依次聚焦村庄、农田和指令卷轴。
Interaction: 依次讲解控制与计算、乡间小路、内存和基本指令类型。
Sources: publish-keynote-page-5
Boundary: 比喻与可见文字完全沿用演讲人原稿。
Narrative: Von Neumann bottleneck：性能瓶颈在于计算与存储之间信息传输率。
-->

---

# 冯诺依曼架构·工业时代

<KeynoteSourceStage background="/generated/slides/s06-von-neumann-industry.png" title="冯诺依曼架构·工业时代" claim="克服传输瓶颈：利用计算上的时间局部性与存储的空间局部性" slide-id="S06" :focuses="[{ x: 29, y: 21, w: 55, h: 67 }]" />

<!--
Slide-ID: S06
Objective: 用城市、公路和分级仓库比喻解释存储层级与局部性。
Timing: 3 min
Visual: 原 Keynote 第 6 页完整画面；轻微聚焦城市公路、二级仓库、三级仓库和高速路。
Interaction: 让学生沿运输路径说明哪一级保存指令、数据和复用机会。
Sources: publish-keynote-page-6
Boundary: 比喻与可见文字完全沿用演讲人原稿。
Narrative: 克服传输瓶颈：利用计算上的时间局部性与存储的空间局部性；当运输成为瓶颈时触及 Roofline。
-->

---

# 冯诺依曼架构·工业时代·社会主义

<KeynoteSourceStage background="/generated/slides/s07-von-neumann-socialism.png" title="冯诺依曼架构·工业时代·社会主义" claim="冯诺依曼架构·工业时代·社会主义" slide-id="S07" :focuses="[{ x: 13, y: 18, w: 82, h: 76 }]" />

<!--
Slide-ID: S07
Objective: 按原稿展示多计算 Lane、分级仓库和多级道路组织。
Timing: 2 min
Visual: 原 Keynote 第 7 页完整画面；整条层级化运输体系使用低强度边缘呼吸光。
Interaction: 沿计算 Lane 到内存总仓逐级讲解并行度与共享层级。
Sources: publish-keynote-page-7
Boundary: 可见文字与图形完全沿用演讲人原稿。
Narrative: 多个计算 Lane 经过一级数据仓库、二级仓库和三级仓库连接内存总仓。
-->

---

# 仓库管理：Roofline Model

<KeynoteSourceStage background="/generated/slides/s08-warehouse-roofline.png" title="仓库管理：Roofline Model" claim="运力已经到达瓶颈，再加算力没有用处" slide-id="S08" :focuses="[{ x: 5.5, y: 22, w: 40, h: 68 }]" />

<!--
Slide-ID: S08
Objective: 按原稿用仓库与运力比喻解释 Roofline、Arithmetic Intensity 和 Locality。
Timing: 2 min
Visual: 原 Keynote 第 8 页完整画面；轻微聚焦左侧 Roofline 曲线与计算单元算力轴。
Interaction: 结合右侧运输图解释“运力已经到达瓶颈”和“再加算力没有用处”。
Sources: publish-keynote-page-8
Boundary: 可见文字、问题和示意图完全沿用演讲人原稿。
Narrative: Arithmetic Intensity 询问一个送来的包裹可以算几个运算；Locality 询问一个送来的货物能够用几次。
-->

---

# 冯诺依曼架构·工业时代·达芬奇文艺复兴

<KeynoteSourceStage background="/generated/slides/s09-davinci-architecture.png" title="冯诺依曼架构·工业时代·达芬奇文艺复兴" claim="256B/cycle" slide-id="S09" interactive :focuses="[{ x: 0.5, y: 19, w: 47, h: 71 }, { x: 48, y: 18, w: 50, h: 78 }]" />

<!--
Slide-ID: S09
Objective: 按原稿展示达芬奇架构中的 Tile/CUBE 计算组织与 L0A、L0B、L0C 本地仓库。
Timing: 3 min
Visual: 原 Keynote 第 9 页完整画面；点击右下角演示按钮在 Tile/CUBE 与仓库层级之间切换焦点。
Interaction: 先讲 Left Tile、Right Tile、ACC Tile 与 CUBE，再讲 L0A/L0B/L0C、256B/cycle、二级与三级仓库。
Sources: publish-keynote-page-9
Boundary: 可见文字、容量和带宽标注完全沿用演讲人原稿。
Narrative: Tile 数据流与本地存储层级共同决定片上计算和数据供给。
-->

---

# 并发度把延迟变成吞吐

<FullBleedStage background="/generated/slides/s10-concurrency.png" title="并发度把延迟变成吞吐" claim="足够多的独立请求可以隐藏延迟，但队列、端口和返回带宽会先饱和。" eyebrow="MEMORY-LEVEL PARALLELISM" slide-id="S10">
  <template #diagram><div class="diagram-dock evidence-strip"><span>Latency<b>220 cyc</b></span><span>Outstanding<b>32</b></span><span>Return BW<b>4/cyc</b></span><span>Limiter<b class="bottleneck">MSHR / Queue</b></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S10
Objective: 区分单请求延迟和多请求吞吐，理解 MLP 需要硬件状态承载。
Timing: 3 min
Visual: 单车道与多车道访问并列；前景给出 latency、outstanding、return bandwidth 和结构限制。
Interaction: 逐步增加 outstanding requests，预测吞吐何时线性增长、何时平台化。
Sources: course-model; source-deck
Boundary: 数值仅用于教学推导；真实上限还受地址相关、bank、协议与调度影响。
Narrative: 并发并不是免费的。每个未完成请求都占用队列项、标签、重放状态和返回路径。窗口太小无法隐藏延迟，窗口过大又可能增加面积、功耗和临界路径。
-->

---

# 一座处理器城市

<FullBleedStage background="/generated/slides/s11-processor-city.png" title="一座处理器城市" claim="计算单元是工厂，存储是仓库，NoC 是道路，调度器决定货物流向。" eyebrow="SYSTEM VIEW" slide-id="S11">
  <template #diagram><div class="diagram-dock"><ArchitectureZoom level="chip" :active-path="['cluster','core','queue']" /></div></template>
</FullBleedStage>

<!--
Slide-ID: S11
Objective: 把前十页的计算、存储、互连和调度统一到一张芯片级架构图。
Timing: 2 min
Visual: 顶视角处理器城市；前景尺度条从 chip 继续放大到 queue。
Interaction: 让学生在图上指出一次 cache miss 穿过的“道路”和占用的“停车位”。
Sources: source-deck; course-synthesis
Boundary: 城市隐喻帮助理解连接关系，不对应具体物理布局。
Narrative: 体系结构不是模块清单，而是资源通过数据和控制路径组成的动态系统。性能问题通常发生在模块之间：带宽不匹配、队列传播、仲裁冲突和反馈延迟。
-->

---

# 封装本身也是存储体系结构

<FullBleedStage background="/generated/slides/s12-package-memory.png" title="封装本身也是存储体系结构" claim="HBM、interposer、chiplet 与引脚共同决定可见带宽、延迟和能耗。" eyebrow="PACKAGE" slide-id="S12">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#ffbe00">Compute die<small>执行与片上缓存</small></span><span style="--layer:#17d9ff">Interposer / links<small>通道与拓扑</small></span><span style="--layer:#b9ff33">HBM stacks<small>容量与并行 bank</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S12
Objective: 把“内存带宽”拆到封装、通道和 bank，而不是视作单个标量。
Timing: 3 min
Visual: 2.5D 封装切面，计算 die 与 HBM stack 通过 interposer 互连；前景标出三层职责。
Interaction: 假设总带宽不变，讨论更多窄通道与更少宽通道对并发和冲突的影响。
Sources: source-deck; course-synthesis
Boundary: 图片为通用 2.5D 架构概念，不影射具体厂商封装。
Narrative: 软件看到一个大内存空间，硬件实际面对多个通道、伪通道、bank 和物理链路。地址映射决定请求是否均衡，封装拓扑决定每字节代价。
-->

---

# NoC：带宽不是均匀水池

<FullBleedStage background="/generated/slides/s13-noc-congestion.png" title="NoC：带宽不是均匀水池" claim="局部热点、路由重叠和回压，会让总带宽充足的网络仍然拥塞。" eyebrow="ON-CHIP NETWORK" slide-id="S13">
  <template #diagram><NoCTraffic /></template>
</FullBleedStage>

<!--
Slide-ID: S13
Objective: 说明 NoC 吞吐由拓扑、流量分布和缓冲共同决定。
Timing: 3 min
Visual: mesh NoC 中央出现洋红热点；前景显示 4×4 路由、链路负载和热点路径。
Interaction: 切换 Spread / Hotspot 并调节热点比例，观察最热链路先于总带宽饱和。
Sources: course-model; source-deck
Boundary: NoCTraffic 是确定性 mesh 教学模型，不等同于 LinxCore 实际拓扑或完整路由器。
Narrative: 全芯片带宽求和可能很大，但热点链路仍会先饱和。下游 credit 消耗后，压力沿路由反向传播，最终让上游核心或 DMA 停顿。
-->

---

# 计算阵列周围的本地复用

<FullBleedStage background="/generated/slides/s14-tile-cube.png" title="计算阵列周围的本地复用" claim="高吞吐来自操作数在阵列附近循环，而不是每次乘加都访问远端。" eyebrow="ACCELERATOR DATAFLOW" slide-id="S14">
  <template #diagram><div class="diagram-dock architecture-chain"><span class="data">Left tile</span><i>→</i><span class="compute">Matrix array</span><i>↔</i><span class="memory">ACC tile</span></div></template>
</FullBleedStage>

<!--
Slide-ID: S14
Objective: 用矩阵阵列展示本地 operand buffer 与 accumulator 如何提高复用。
Timing: 3 min
Visual: 中央矩阵计算立方体与三组本地存储；短复用回路清晰可见。
Interaction: 选择 Left、Right 或 ACC，要求学生描述其生命周期、读取次数和写回时机。
Sources: pto-spec; course-synthesis
Boundary: Left、Right、ACC 是教学映射，不宣称 PTO 规定物理缓冲结构。
Narrative: 虚拟 ISA 可以描述矩阵效果，但性能取决于实现如何分块、预取、双缓冲并累加。这里开始把软件可见操作映射为硬件数据流问题。
-->

---

# Tile 是软硬件共同选择

<FullBleedStage background="/generated/slides/s15-tload-tstore.png" title="Tile 是软硬件共同选择" claim="Tile 太小浪费复用，太大挤爆容量和端口；最优点来自共同约束。" eyebrow="HW/SW CO-DESIGN" slide-id="S15">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">Tensor shape<small>M × N × K</small></span><span style="--layer:#b9ff33">Scratchpad<small>capacity × banks × ports</small></span><span style="--layer:#ffbe00">Compute array<small>lanes × issue rate</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S15
Objective: 把 tiling 定义为算法形状、存储容量和执行阵列之间的联合设计。
Timing: 3 min
Visual: 三维 tensor 被规则切片，经 load engine 进入 banked scratchpad 和计算阵列。
Interaction: 给定 128 KB scratchpad，让学生判断增大 M、N、K 三个 tile 维度分别改变什么。
Sources: pto-spec; course-model
Boundary: Tile 参数和容量为课程示例；PTO 定义语义而非唯一微架构映射。
Narrative: 软件调度选择块形状，硬件决定块能否驻留、多少 bank 可并行访问以及阵列每周期消费多少元素。任何一侧单独优化都可能把压力转移到另一侧。
-->

---

# 双缓冲：用容量换重叠

<FullBleedStage background="/generated/slides/s16-double-buffer.png" title="双缓冲：用容量换重叠" claim="一块 buffer 服务计算，另一块 buffer 同时搬运下一 tile。" eyebrow="OVERLAP" slide-id="S16">
  <template #diagram><DoubleBufferTimeline /></template>
</FullBleedStage>

<!--
Slide-ID: S16
Objective: 展示双缓冲如何把数据搬运和计算重叠，并指出容量与同步代价。
Timing: 3 min
Visual: 两个相邻 buffer，一个填充、一个供给计算；路径颜色区分 DMA 与 compute。
Interaction: 让学生推导稳定态吞吐是 max(Tload,Tcompute)，并找出启动与收尾气泡。
Sources: course-model; source-deck
Boundary: 忽略 DMA setup、bank 冲突和尾块不规则性，作为一阶模型。
Narrative: 双缓冲不是“自动变快”，它要求两个阶段并行、容量加倍、边界同步正确，而且慢的一侧仍决定稳态节拍。模型应显式保留这些条件。
-->

---

# Bank conflict 与地址 swizzle

<FullBleedStage background="/generated/slides/s17-bank-swizzle.png" title="Bank conflict 与地址 swizzle" claim="总容量相同，地址映射不同，瞬时带宽可以相差数倍。" eyebrow="SCRATCHPAD" slide-id="S17">
  <template #diagram><BankConflictExplorer /></template>
</FullBleedStage>

<!--
Slide-ID: S17
Objective: 让学生看到 bank 映射是可建模、可验证的架构参数。
Timing: 3 min
Visual: 左侧所有请求撞向一个 bank，右侧经过 swizzle 均匀分散；前景柱状图可切换映射。
Interaction: 点击 Naive stride / Swizzled，对比每个 bank 的请求数和理论服务周期。
Sources: course-model; source-deck
Boundary: 映射器只演示最简单顺序分布，未覆盖真实地址 XOR、端口与仲裁策略。
Narrative: 平均带宽无法揭示瞬时结构冲突。一个小的地址变换可能无需增加容量或总线，就让全部 bank 同时工作，这是典型软硬件协同机会。
-->

---

# 三层调度看同一件事

<FullBleedStage background="/generated/slides/s18-scheduling-levels.png" title="三层调度看同一件事" claim="Task、Tile、Micro-op 分别管理全局依赖、本地复用和周期资源。" eyebrow="SCHEDULING" slide-id="S18">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">Task level<small>跨核 / 跨算子依赖</small></span><span style="--layer:#ffbe00">Tile level<small>容量、复用、DMA</small></span><span style="--layer:#b9ff33">Micro-op level<small>端口、队列、周期</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S18
Objective: 分离三个调度尺度，避免用单一“scheduler”解释所有性能行为。
Timing: 3 min
Visual: 三层透明调度平面悬浮于物理处理器；每层连接不同粒度的硬件队列。
Interaction: 给出一次矩阵乘停顿，让学生判断原因属于 task、tile 还是 micro-op 层。
Sources: course-synthesis; pto-spec; linxcore
Boundary: 三层是课程分析框架，不是 PTO 或 LinxCore 的规范术语集合。
Narrative: Task 层决定哪些大工作可并行，Tile 层决定数据驻留与搬运，Micro-op 层处理端口和依赖。跨层因果链必须保持可追踪，Agent 才不会在错误层修问题。
-->

---

# 从工作负载到利用率的因果链

<FullBleedStage background="/generated/slides/s19-performance-causality.png" title="从工作负载到利用率的因果链" claim="不要直接从代码跳到性能数字；先追踪每一级结构状态。" eyebrow="CAUSAL MODEL" slide-id="S19">
  <template #diagram><div class="diagram-dock architecture-chain"><span>Workload</span><i>→</i><span>Locality</span><i>→</i><span>Memory</span><i>→</i><span>Queues</span><i>→</i><span>Compute</span></div></template>
</FullBleedStage>

<!--
Slide-ID: S19
Objective: 建立后续 Agentic Circuit 模型必须保留的端到端因果结构。
Timing: 3 min
Visual: 工作负载几何依次转化为局部性、层级流量、队列占用、调度和计算利用率。
Interaction: 从“利用率只有 22%”反向追问，每一级需要什么证据才能排除。
Sources: course-synthesis; course-model
Boundary: 因果链是分析顺序；真实系统存在反馈与并行路径，不是严格单向流水。
Narrative: 一个可信模型应能解释数值从何而来：工作集决定复用，复用决定层级流量，流量决定队列压力，压力决定供给节拍，最终才形成利用率。
-->

---

# Agentic Circuit：让架构假设可执行

<FullBleedStage background="/generated/slides/s20-agentic-circuit-map.png" title="Agentic Circuit：让架构假设可执行" claim="Agent 负责提出和修改模型；独立实验负责裁判。" eyebrow="MODELING INSTRUMENT" slide-id="S20">
  <template #diagram><div class="diagram-dock model-map"><div class="architecture-chain"><span>Physical idea</span><i>→</i><span>NDF graph</span><i>→</i><span>pyCircuit</span><i>→</i><span>Evidence</span></div><ArchitectureZoom level="queue" :active-path="['core','queue','cycle']" /></div></template>
</FullBleedStage>

<!--
Slide-ID: S20
Objective: 在完成体系结构铺垫后，准确定位 NDF、pyCircuit 与 Agent 的工具角色。
Timing: 3 min
Visual: 物理处理器投影为 module、queue、link 图；前景展示 idea→NDF→pyCircuit→evidence。
Interaction: 选中一个物理队列，口述其 NDF 节点、pyCircuit 状态和需要记录的证据。
Sources: ndf-course; pycircuit; course-synthesis
Boundary: NDF 图是课程设计投影；除明确引用外不冒充 PTO 规范或 LinxCore RTL。
Narrative: Agentic Circuit 不是新体系结构，而是一套把架构主张写成可运行模型的工作方法。Agent 可以探索设计空间，但每个变体必须带边界、来源和独立可重放实验。
-->

---

# 第一课挑战：你会改哪一层

<FullBleedStage background="/generated/slides/s21-design-challenge.png" title="第一课挑战：你会改哪一层" claim="给定同一工作负载，选择一个改动，并预测它会改变哪条证据链。" eyebrow="DESIGN CHALLENGE" slide-id="S21">
  <template #diagram><ExperimentPanel /></template>
</FullBleedStage>

<!--
Slide-ID: S21
Objective: 让学生用本课模型提出一个受约束的体系结构假设，并为第二课微架构验证做铺垫。
Timing: 4 min
Visual: 一个处理器分叉为计算、带宽、缓存、队列多个设计；前景可切换 Baseline、2×BW、2×Cache、Balanced。
Interaction: 小组选择一个变体，写下预测：Roofline 工作点、片外流量、队列压力各如何变化。
Sources: course-model; course-synthesis
Boundary: 面板结果是定性教学模型，第二课再用周期模型检查哪些预测站得住。
Narrative: 好的设计假设必须写出不变量、可控变量、预期指标和失败条件。下一课进入 LinxCore，把宏观判断逐级落实到前端、ROB、issue、执行和 LSU。
-->
