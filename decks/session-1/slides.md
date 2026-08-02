---
theme: default
title: 体系结构研究的第一性原理 · 第一课
info: 从 Roofline、存储层级到加速器数据流
transition: fade-out
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

# 432 TFLOPS 为什么跑不满

<FullBleedStage background="/generated/slides/s02-peak-gap.png" title="432 TFLOPS 为什么跑不满" claim="峰值算力与实测性能之间的缺口，就是体系结构研究空间。" eyebrow="PROBLEM" slide-id="S02">
  <template #diagram><div class="diagram-dock evidence-strip"><span>Peak<b class="compute">432</b></span><span>Measured<b class="bottleneck">96</b></span><span>Utilization<b>22%</b></span><span>Question<b>谁在等？</b></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S02
Objective: 用峰值—实测差距引出体系结构瓶颈，而不是把低利用率归咎于“代码没优化”。
Timing: 3 min
Visual: 大部分熄灭的计算阵列与遥远存储体；四个前景数字按 Peak、Measured、Utilization、Question 逐步出现。
Interaction: 四选一投票：算力、带宽、局部性还是并发度；先记录判断，课末再复盘。
Sources: source-deck; course-model
Boundary: 432 TFLOPS 与 96 TFLOPS 是教学场景参数，不代表未公开产品实测。
Narrative: 峰值只描述所有执行单元都持续得到正确数据时的上限。真实系统会在访存、依赖、队列满、前端供给和同步上损失周期，因此研究问题是找出第一个限制吞吐的结构环节。
-->

---

# 工作负载 = 计算 + 数据移动

<FullBleedStage background="/generated/slides/s03-workload-data-movement.png" title="工作负载 = 计算 + 数据移动" claim="任何算子都同时要求运算次数、搬运字节数和可利用的复用。" eyebrow="WORKLOAD MODEL" slide-id="S03">
  <template #diagram><div class="diagram-dock architecture-chain"><span class="compute">FLOPs</span><i>÷</i><span class="data">Bytes</span><i>=</i><span class="memory">Reuse / AI</span></div></template>
</FullBleedStage>

<!--
Slide-ID: S03
Objective: 把工作负载拆成计算量、数据量和复用机会，为 Roofline 建模准备变量。
Timing: 2 min
Visual: 张量块从存储流向计算阵列；前景公式只呈现 FLOPs、Bytes 与 Arithmetic Intensity 的关系。
Interaction: 让学生口算一次矩阵乘：一个输出元素需要多少乘加、至少读取多少输入数据。
Sources: roofline-paper; course-model
Boundary: 使用简化矩阵乘模型，忽略索引、控制和缓存元数据开销。
Narrative: 算法并不直接“拥有性能”，它只提出计算与数据移动需求。体系结构决定这些需求如何映射到本地存储、片上网络、执行阵列和调度窗口。
-->

---

# Roofline 的两根轴

<FullBleedStage background="/generated/slides/s04-roofline-axes.png" title="Roofline 的两根轴" claim="横轴是每字节计算量，纵轴是每秒完成的计算量。" eyebrow="MACRO MODEL" slide-id="S04">
  <template #diagram><div class="diagram-dock"><div class="claim-callout"><b>P = min(P<sub>peak</sub>, AI × BW)</b><br><span class="muted">斜坡由带宽决定，平台由计算峰值决定。</span></div></div></template>
</FullBleedStage>

<!--
Slide-ID: S04
Objective: 从两个独立上界推导 Roofline，而不是让学生死记图形。
Timing: 2 min
Visual: 斜坡进入平顶屋顶的工业景观；前景用一行公式标记带宽上界和计算上界。
Interaction: 分两步 reveal：先画 AI×BW，再加 Ppeak，最后取二者最小值。
Sources: roofline-paper
Boundary: Roofline 是吞吐上界模型，不是周期级预测，也不描述尾延迟。
Narrative: 左侧工作点每做一次计算需要大量外部字节，因此沿带宽斜坡；越过 ridge point 后，数据供给足够，执行单元数量成为上限。
-->

---

# 交互 Roofline

<FullBleedStage background="/generated/slides/s05-interactive-roofline.png" title="交互 Roofline" claim="架构参数移动屋顶，算法复用移动工作点。" eyebrow="LIVE MODEL" slide-id="S05">
  <template #diagram><InteractiveRoofline /></template>
</FullBleedStage>

<!--
Slide-ID: S05
Objective: 让学生亲手区分“提高屋顶”和“移动工作点”两类优化。
Timing: 4 min
Visual: 真实处理器与透明 Roofline 装置；前景 SVG 根据 Peak、BW、AI 三个滑杆实时更新。
Interaction: 先只加算力观察无效，再加带宽，最后提高 AI；要求学生解释瓶颈为何切换。
Sources: roofline-paper; course-model
Boundary: 交互数值由本仓简化模型计算，不是 LinxCore 或商业芯片测量。
Narrative: 如果工作点仍在斜坡，加倍矩阵单元可能完全无效；如果工作点已经在平台，继续增加带宽也不会提升性能。优化必须针对当前限制项。
-->

---

# Arithmetic Intensity 不是常数

<FullBleedStage background="/generated/slides/s06-arithmetic-intensity.png" title="Arithmetic Intensity 不是常数" claim="同一算子在不同分块、缓存命中率和数据布局下，会落在不同工作点。" eyebrow="LOCALITY" slide-id="S06">
  <template #diagram><div class="diagram-dock evidence-strip"><span>Naive<b>2 FLOP/B</b></span><span>Tiled<b>16 FLOP/B</b></span><span>Fused<b>48 FLOP/B</b></span><span>Effect<b class="memory">少搬数据</b></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S06
Objective: 说明 AI 是算法与存储体系结构共同产生的运行属性。
Timing: 3 min
Visual: 一侧反复远距离取数，另一侧形成短复用环；前景对比 naive、tiled、fused 三个工作点。
Interaction: 点击或口头切换三种映射，判断工作点向右移动还是屋顶上移。
Sources: roofline-paper; course-model
Boundary: 三组 AI 为教学示例，只表达数量级与趋势。
Narrative: 算法 FLOPs 可能不变，但 DRAM 字节数会因 tile 大小、cache 容量、替换行为和融合机会而改变。体系结构研究必须显式建模这些条件。
-->

---

# 局部性就是避免昂贵搬运

<FullBleedStage background="/generated/slides/s07-locality.png" title="局部性就是避免昂贵搬运" claim="时间复用、空间复用和生产者—消费者复用，最终都减少远端字节。" eyebrow="DATA MOVEMENT" slide-id="S07">
  <template #diagram><div class="diagram-dock layer-stack"><span style="--layer:#17d9ff">寄存器复用<small>1–2 cycles</small></span><span style="--layer:#ffbe00">片上 SRAM 复用<small>几到几十 cycles</small></span><span style="--layer:#b9ff33">片外内存<small>高延迟 / 高能耗</small></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S07
Objective: 把抽象“局部性”翻译成逐级存储结构与数据生命周期。
Timing: 2 min
Visual: 以计算阵列为中心的同心存储环；颜色从寄存器、SRAM 延伸到 DRAM。
Interaction: 指定一个矩阵块，让学生决定它应停留在哪一级、被复用多少次后才淘汰。
Sources: course-model; source-deck
Boundary: 延迟范围是教学级概括，不代表 PTO 或 LinxCore 固定参数。
Narrative: 局部性不是缓存命中率的同义词，而是数据在离消费者更近的位置被再次使用。硬件提供容量、端口和带宽，软件决定块形状和访问顺序。
-->

---

# 把存储延迟换算成“天”

<FullBleedStage background="/generated/slides/s08-memory-latency-days.png" title="把存储延迟换算成“天”" claim="核心尺度上的几个周期，与片外访问的几百周期，是完全不同的时间世界。" eyebrow="LATENCY INTUITION" slide-id="S08">
  <template #diagram><div class="diagram-dock evidence-strip"><span>Register<b>今天</b></span><span>L1<b>本周</b></span><span>L2/L3<b>下月</b></span><span>DRAM<b class="bottleneck">明年</b></span></div></template>
</FullBleedStage>

<!--
Slide-ID: S08
Objective: 建立学生对存储延迟数量级的直觉，并说明为何需要并发隐藏延迟。
Timing: 2 min
Visual: 从核心向外扩展的时间距离地形；前景用“今天—明年”类比替代精确产品数字。
Interaction: 假设一次 DRAM 访问为 220 cycles，问需要多少独立 miss 才能填满返回带宽。
Sources: source-deck; course-model
Boundary: 日历类比只表达数量级，不是物理时间换算或特定芯片参数。
Narrative: 延迟不能被带宽数字抹去。即使内存接口很宽，单个依赖链仍然必须等待；体系结构依靠缓存、预取、乱序窗口和多线程形成足够并发。
-->

---

# 存储层级：容量、延迟、带宽三角

<FullBleedStage background="/generated/slides/s09-memory-hierarchy.png" title="存储层级：容量、延迟、带宽三角" claim="每一级都在用有限容量换取更低平均延迟和更少片外流量。" eyebrow="HIERARCHY" slide-id="S09">
  <template #diagram><MemoryHierarchyExplorer /></template>
</FullBleedStage>

<!--
Slide-ID: S09
Objective: 用可调命中率把存储层级连接到平均访问延迟和片外流量。
Timing: 3 min
Visual: 阶梯式 L1、L2、DRAM 切面；前景组件实时显示命中分布、平均 cycles 与 reuse。
Interaction: 分别降低 L1 hit 和 L2 hit，观察哪一个对 off-chip traffic 与平均延迟影响更大。
Sources: course-model; source-deck
Boundary: 层级延迟和概率为课程模型，未声称对应 LinxCore 实现参数。
Narrative: 平均延迟是一种加权结果，但性能还取决于 miss 能否重叠、端口是否冲突、队列是否容纳未完成请求。下一步从概率模型走向并发结构。
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
