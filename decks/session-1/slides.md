---
theme: default
title: 体系结构研究的第一性原理 · 第一课
info: 从空间资源到数据移动时间
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

<AscendCover background="/generated/slides/s01-architecture-first.png" title="Agent时代体系结构研究" claim="Architecture First · Agentic Circuit as a Research Instrument" speaker="周若愚" affiliation="华为海思半导体" />

<!--
Slide-ID: S01
Objective: 建立“体系结构优先、Agent 为研究工具”的课程定位。
Timing: 3 min
Visual: 沿用昇腾封面，计算芯片与带宽线路构成开场视觉。
Interaction: 看到“432 TFLOPS”时，先追问哪个结构参数？
Sources: source-deck
Boundary: 背景为昇腾风格概念视觉，不表示具体产品内部结构。
Narrative: 性能来自计算、数据移动、并发、队列与控制的共同作用。
Transition: 从课程主张进入演讲人与课程背景。
[Sources]
- source: K01
- catalog: source-deck
-->

---

# 自我介绍

<KeynoteSourceStage background="/generated/slides/s02-keynote-page-2.png" title="自我介绍" claim="姓名：周若愚" slide-id="S02" />

<!--
Slide-ID: S02
Objective: 按原稿介绍演讲人背景与研究方向。
Timing: 3 min
Visual: 更新版 Keynote 第 2 页 1920×1080 确定性整页渲染。
Interaction: 演讲人口头补充个人经历。
Sources: publish-keynote-page-2
Boundary: 可见文字与图片直接来自演讲人提供的 Keynote。
Narrative: 建立课程内容与演讲人体系结构实践之间的联系。
Transition: 由个人背景转向本次暑期学校课程结构。
[Sources]
- source: K02
- catalog: publish-keynote-page-2
-->

---

# 本次暑期学校课程

<KeynoteSourceStage background="/generated/slides/s03-keynote-page-3.png" title="本次暑期学校课程" claim="什么是计算体系结构" slide-id="S03" />

<!--
Slide-ID: S03
Objective: 保留原稿课程范围与处理器核示例组成。
Timing: 3 min
Visual: 更新版 Keynote 第 3 页 1920×1080 确定性整页渲染。
Interaction: 指出右图哪些关系属于计算、内存、互连与编程。
Sources: publish-keynote-page-3
Boundary: 可见文字与图形直接来自演讲人提供的 Keynote。
Narrative: 本课先建立空间与时间的体系结构坐标，再进入 PTO 数据搬运。
Transition: 进入第一章处理器体系结构。
[Sources]
- source: K03
- catalog: publish-keynote-page-3
-->

---

# 计算机体系结构-处理器

<KeynoteSourceStage background="/generated/slides/s04-keynote-page-4.png" title="计算机体系结构-处理器" claim="第一章" slide-id="S04" />

<!--
Slide-ID: S04
Objective: 完整保留原稿第一章章节分隔页。
Timing: 3 min
Visual: 更新版 Keynote 第 4 页 1920×1080 确定性整页渲染。
Interaction: 章节转场，无附加操作。
Sources: publish-keynote-page-4
Boundary: 可见文字与装饰直接来自演讲人提供的 Keynote。
Narrative: 第一章从冯诺依曼结构的物流隐喻开始。
Transition: 从章节标题进入农业时代的小农经济。
[Sources]
- source: K04
- catalog: publish-keynote-page-4
-->

---

# 冯诺依曼架构·农业时代·小农经济

<KeynoteSourceStage background="/generated/slides/s05-keynote-page-5.png" title="冯诺依曼架构·农业时代·小农经济" claim="Von Neumann bottleneck" slide-id="S05" />

<!--
Slide-ID: S05
Objective: 用小农经济比喻解释冯诺依曼结构与传输瓶颈。
Timing: 3 min
Visual: 更新版 Keynote 第 5 页 1920×1080 确定性整页渲染。
Interaction: 沿村庄、道路、农田与指令卷轴讲解一次工作往返。
Sources: publish-keynote-page-5
Boundary: 比喻与可见文字沿用演讲人原稿。
Narrative: 计算与存储分离后，信息传输率成为第一性约束。
Transition: 当小路变成公路，局部性开始组织运输。
[Sources]
- source: K05
- catalog: publish-keynote-page-5
-->

---

# 冯诺依曼架构·工业时代

<KeynoteSourceStage background="/generated/slides/s06-keynote-page-6.png" title="冯诺依曼架构·工业时代" claim="时间局部性与空间局部性" slide-id="S06" />

<!--
Slide-ID: S06
Objective: 用城市、公路与分级仓库解释存储层级和局部性。
Timing: 2 min
Visual: 更新版 Keynote 第 6 页 1920×1080 确定性整页渲染。
Interaction: 沿运输路径说明每一级保存什么复用机会。
Sources: publish-keynote-page-6
Boundary: 比喻与可见文字沿用演讲人原稿。
Narrative: 局部性用更近的仓库减少昂贵的远距离往返。
Transition: 单个工厂扩展为多 Lane 的共享运输体系。
[Sources]
- source: K06
- catalog: publish-keynote-page-6
-->

---

# 冯诺依曼架构·工业时代·社会主义

<KeynoteSourceStage background="/generated/slides/s07-keynote-page-7.png" title="冯诺依曼架构·工业时代·社会主义" claim="共享层级与并行 Lane" slide-id="S07" />

<!--
Slide-ID: S07
Objective: 展示多计算 Lane、分级仓库和共享道路组织。
Timing: 2 min
Visual: 更新版 Keynote 第 7 页 1920×1080 确定性整页渲染。
Interaction: 从计算 Lane 到内存总仓逐级讲解共享与争用。
Sources: publish-keynote-page-7
Boundary: 可见文字与图形沿用演讲人原稿。
Narrative: 共享提高资源利用率，也引入仲裁、拥塞与回压。
Transition: 用 Roofline 把算力与运力放到同一张图。
[Sources]
- source: K07
- catalog: publish-keynote-page-7
-->

---

# 仓库管理：Roofline Model

<KeynoteSourceStage background="/generated/slides/s08-keynote-page-8.png" title="仓库管理：Roofline Model" claim="运力到达瓶颈，再加算力没有用处" slide-id="S08" />
<details class="keynote-lab-drawer">
  <summary aria-label="打开 Roofline 交互实验">交互实验</summary>
  <InteractiveRoofline />
</details>

<!--
Slide-ID: S08
Objective: 用原稿仓库隐喻和交互曲线解释 Roofline。
Timing: 2 min
Visual: 更新版 Keynote 第 8 页 1920×1080 确定性整页渲染。
Interaction: 调节 Peak、BW、AI 与 Hit，观察瓶颈跨越 ridge point。
Sources: publish-keynote-page-8; roofline-paper
Boundary: 原稿可见内容保持不变；交互数值是确定性教学模型。
Narrative: Arithmetic Intensity 与有效带宽共同决定工作点落在哪条屋顶。
Transition: 把 Roofline 的局部性落实到 Da Vinci Tile 与仓库。
[Sources]
- source: K08
- catalog: publish-keynote-page-8
- catalog: roofline-paper
-->

---

# 冯诺依曼架构·工业时代·达芬奇文艺复兴

<KeynoteSourceStage background="/generated/slides/s09-keynote-page-9.png" title="冯诺依曼架构·工业时代·达芬奇文艺复兴" claim="Tile / CUBE 与本地仓库" slide-id="S09" />

<!--
Slide-ID: S09
Objective: 展示 Tile/CUBE 计算组织与 L0A、L0B、L0C 本地仓库。
Timing: 2 min
Visual: 更新版 Keynote 第 9 页 1920×1080 确定性整页渲染。
Interaction: 先追踪 Left、Right、ACC Tile，再追踪 256B/cycle 路径。
Sources: publish-keynote-page-9
Boundary: 可见文字、容量和带宽标注沿用演讲人原稿。
Narrative: 阵列附近的数据复用决定算力能否持续获得操作数。
Transition: 放大 CUBE 核内部的数据供给结构。
[Sources]
- source: K09
- catalog: publish-keynote-page-9
-->

---

# 冯诺依曼架构·工业时代·CUBE核设计

<KeynoteSourceStage background="/generated/slides/s10-keynote-page-10.png" title="冯诺依曼架构·工业时代·CUBE核设计" claim="CUBE 核的数据供给与计算闭环" slide-id="S10" />

<!--
Slide-ID: S10
Objective: 按原稿讲解 CUBE 核、L0 仓库与片外层级连接。
Timing: 2 min
Visual: 更新版 Keynote 第 10 页 1920×1080 确定性整页渲染。
Interaction: 从左侧输入依次追踪到 CUBE、二级仓库、三级仓库与 HBM。
Sources: publish-keynote-page-10
Boundary: 页面是原稿 CUBE 核教学图，不补充私有实现细节。
Narrative: 局部供给能力与远端层级共同限制 CUBE 的持续吞吐。
Transition: 从一个 CUBE 核扩展到完整 Da Vinci 架构。
[Sources]
- source: K10
- catalog: publish-keynote-page-10
-->

---

# 冯诺依曼架构·工业时代·达芬奇910B架构设计

<KeynoteSourceStage background="/generated/slides/s11-keynote-page-11.png" title="冯诺依曼架构·工业时代·达芬奇910B架构设计" claim="计算、搬运与共享仓库协同" slide-id="S11" />

<!--
Slide-ID: S11
Objective: 按原稿展示 Da Vinci 架构的 CUBE、Vector 与搬运层级。
Timing: 2 min
Visual: 更新版 Keynote 第 11 页 1920×1080 确定性整页渲染。
Interaction: 对照上下两条路径，指出计算与数据搬运的汇合点。
Sources: publish-keynote-page-11
Boundary: 可见模块与连线按原稿保留，不推断未公开微架构时序。
Narrative: 多执行单元共享层级时，调度和带宽匹配比单元峰值更重要。
Transition: 用城市化比喻抽象多个计算与运输单元的组织。
[Sources]
- source: K11
- catalog: publish-keynote-page-11
-->

---

# 冯诺依曼架构·信息时代·Transformer

<KeynoteSourceStage background="/generated/slides/s12-keynote-page-12.png" title="冯诺依曼架构·信息时代·Transformer" claim="Q、K、V 与 Tile 数据流" slide-id="S12" />

<!--
Slide-ID: S12
Objective: 按原稿把 Transformer 张量操作映射到 Tile/CUBE/Vector 数据流。
Timing: 2 min
Visual: 更新版 Keynote 第 12 页 1920×1080 确定性整页渲染。
Interaction: 沿 Q、K、V 输入追踪矩阵计算、向量处理与中间结果驻留。
Sources: publish-keynote-page-12
Boundary: 数据流按原稿教学表达，不宣称唯一实现或固定时序。
Narrative: 算法图只有落到数据放置、运输和执行单元后才成为体系结构问题。
Transition: 单芯片数据流继续扩展到芯片间通信。
[Sources]
- source: K12
- catalog: publish-keynote-page-12
-->

---

# 达芬奇昇腾950架构

<KeynoteSourceStage background="/generated/slides/s13-keynote-page-13.png" title="达芬奇昇腾950架构" claim="严格保留更新版 Keynote 第 13 页文字、图片与构图" slide-id="S13" />

<!--
Slide-ID: S13
Objective: 按更新版 Keynote 原页讲解“达芬奇昇腾950架构”。
Timing: 2 min
Visual: 更新版 Keynote 第 13 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的体系结构层次与数据路径。
Sources: publish-keynote-page-13
Boundary: 本页逐字逐图保留更新版 Keynote；图中参数与结构按原稿教学语境解释。
Narrative: 先按原页构图建立直觉，再把其中的资源、带宽、容量或执行关系接入课程主线。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K13
- catalog: publish-keynote-page-13
-->

---

# 同构架构

<KeynoteSourceStage background="/generated/slides/s14-keynote-page-14.png" title="同构架构" claim="严格保留更新版 Keynote 第 14 页文字、图片与构图" slide-id="S14" />

<!--
Slide-ID: S14
Objective: 按更新版 Keynote 原页讲解“同构架构”。
Timing: 2 min
Visual: 更新版 Keynote 第 14 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的体系结构层次与数据路径。
Sources: publish-keynote-page-14
Boundary: 本页逐字逐图保留更新版 Keynote；图中参数与结构按原稿教学语境解释。
Narrative: 先按原页构图建立直觉，再把其中的资源、带宽、容量或执行关系接入课程主线。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K14
- catalog: publish-keynote-page-14
-->

---

# AI时代的Tile处理器

<KeynoteSourceStage background="/generated/slides/s15-keynote-page-15.png" title="AI时代的Tile处理器" claim="严格保留更新版 Keynote 第 15 页文字、图片与构图" slide-id="S15" />

<!--
Slide-ID: S15
Objective: 按更新版 Keynote 原页讲解“AI时代的Tile处理器”。
Timing: 2 min
Visual: 更新版 Keynote 第 15 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的体系结构层次与数据路径。
Sources: publish-keynote-page-15
Boundary: 本页逐字逐图保留更新版 Keynote；图中参数与结构按原稿教学语境解释。
Narrative: 先按原页构图建立直觉，再把其中的资源、带宽、容量或执行关系接入课程主线。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K15
- catalog: publish-keynote-page-15
-->

---

# 超标量NPU的物理约束

<KeynoteSourceStage background="/generated/slides/s16-keynote-page-16.png" title="超标量NPU的物理约束" claim="严格保留更新版 Keynote 第 16 页文字、图片与构图" slide-id="S16" />

<!--
Slide-ID: S16
Objective: 按更新版 Keynote 原页讲解“超标量NPU的物理约束”。
Timing: 2 min
Visual: 更新版 Keynote 第 16 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的体系结构层次与数据路径。
Sources: publish-keynote-page-16
Boundary: 本页逐字逐图保留更新版 Keynote；图中参数与结构按原稿教学语境解释。
Narrative: 先按原页构图建立直觉，再把其中的资源、带宽、容量或执行关系接入课程主线。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K16
- catalog: publish-keynote-page-16
-->

---

# 冯诺依曼架构·工业时代·昇腾950处理器

<KeynoteSourceStage background="/generated/slides/s17-keynote-page-17.png" title="冯诺依曼架构·工业时代·昇腾950处理器" claim="教学抽象，不是产品框图" slide-id="S17" />
<KeynoteInteractiveStage mode="disclaimer" />

<!--
Slide-ID: S17
Objective: 通过原稿 Ascend SoC 教学图讨论核、共享缓存与 I/O 分区。
Timing: 2 min
Visual: 更新版 Keynote 第 17 页 1920×1080 确定性整页渲染。
Interaction: 沿 NPU/CPU 核、共享缓存、NoC 与 I/O 找资源边界。
Sources: publish-keynote-page-17
Boundary: 教学抽象，非产品框图；不得据此推断真实产品内部结构。
Narrative: SoC 规划把复制的计算核连接到共享存储、互连和外部接口。
Transition: 下一页在同一类 SoC 平面上追踪资源分区的因果路径。
[Sources]
- source: K17
- catalog: publish-keynote-page-17
-->

---

# 冯诺依曼架构·工业时代·SoC规划

<KeynoteSourceStage background="/generated/slides/s18-keynote-page-18.png" title="冯诺依曼架构·工业时代·SoC规划" claim="从资源分区追到共享路径" slide-id="S18" />
<KeynoteInteractiveStage mode="plan" />

<!--
Slide-ID: S18
Objective: 用原稿 SoC 平面图建立核、共享缓存、NoC 与 I/O 的规划顺序。
Timing: 2 min
Visual: 更新版 Keynote 第 18 页 1920×1080 确定性整页渲染。
Interaction: 切换 NPU、CPU、NoC/共享缓存、DDR/I/O，追踪相邻约束。
Sources: publish-keynote-page-18
Boundary: 叠加层只用于教学导航，不增加产品结构主张。
Narrative: 一个资源分区的变化会改变共享链路、缓存压力与外部带宽需求。
Transition: 从物理 SoC 规划回到信息时代的空间抽象。
[Sources]
- source: K18
- catalog: publish-keynote-page-18
-->

---

# 冯诺依曼架构·信息时代·城市化

<KeynoteSourceStage background="/generated/slides/s19-keynote-page-19.png" title="冯诺依曼架构·信息时代·城市化" claim="电梯连接不同规模的存储空间" slide-id="S19" />

<!--
Slide-ID: S19
Objective: 按原稿用建筑、电梯与存储空间解释层级跨度。
Timing: 2 min
Visual: 更新版 Keynote 第 19 页 1920×1080 确定性整页渲染。
Interaction: 让学生指出同层访问与跨层访问分别需要哪些运输资源。
Sources: publish-keynote-page-19
Boundary: 信息时代城市化仍是教学隐喻，不声明实际拓扑。
Narrative: 空间越远、容量越大，访问时间和运输能耗通常越高。
Transition: Transformer 把这种层级运输变成可观察的数据流。
[Sources]
- source: K19
- catalog: publish-keynote-page-19
-->

---

# 芯片与封装

<KeynoteSourceStage background="/generated/slides/s20-keynote-page-20.png" title="芯片与封装" claim="严格保留更新版 Keynote 第 20 页文字、图片与构图" slide-id="S20" />

<!--
Slide-ID: S20
Objective: 按更新版 Keynote 原页讲解“芯片与封装”。
Timing: 2 min
Visual: 更新版 Keynote 第 20 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的体系结构层次与数据路径。
Sources: publish-keynote-page-20
Boundary: 本页逐字逐图保留更新版 Keynote；图中参数与结构按原稿教学语境解释。
Narrative: 先按原页构图建立直觉，再把其中的资源、带宽、容量或执行关系接入课程主线。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K20
- catalog: publish-keynote-page-20
-->

---

# 晶圆级系统

<KeynoteSourceStage background="/generated/slides/s21-keynote-page-21.png" title="晶圆级系统" claim="严格保留更新版 Keynote 第 21 页文字、图片与构图" slide-id="S21" />

<!--
Slide-ID: S21
Objective: 按更新版 Keynote 原页讲解“晶圆级系统”。
Timing: 2 min
Visual: 更新版 Keynote 第 21 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的体系结构层次与数据路径。
Sources: publish-keynote-page-21
Boundary: 本页逐字逐图保留更新版 Keynote；图中参数与结构按原稿教学语境解释。
Narrative: 先按原页构图建立直觉，再把其中的资源、带宽、容量或执行关系接入课程主线。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K21
- catalog: publish-keynote-page-21
-->

---

# 冯诺依曼架构·信息时代·国际化

<KeynoteSourceStage background="/generated/slides/s22-keynote-page-22.png" title="冯诺依曼架构·信息时代·国际化" claim="芯片间通信也是体系结构资源" slide-id="S22" />

<!--
Slide-ID: S22
Objective: 按原稿用航空与航运比喻芯片间通信和全局协同。
Timing: 2 min
Visual: 更新版 Keynote 第 22 页 1920×1080 确定性整页渲染。
Interaction: 比较空运与海运路径对应的延迟、带宽和批量化取舍。
Sources: publish-keynote-page-22
Boundary: 国际化是原稿通信隐喻，不对应具体互连协议。
Narrative: 系统边界扩大后，远程运输与同步成本成为一等架构参数。
Transition: 汇总第一章，建立五个可复用的体系结构坐标。
[Sources]
- source: K22
- catalog: publish-keynote-page-22
-->

---

# 体系结构的五个坐标

<FullBleedStage background="/generated/slides/s23-architecture-city-five-coordinates-v2.png" title="体系结构的五个坐标" claim="计算、存储、互连、并发与控制共同解释性能。" eyebrow="ARCHITECTURE COORDINATES" slide-id="S23" focus="left">
  <template #diagram><ArchitectureCoordinate /></template>
</FullBleedStage>

<!--
Slide-ID: S23
Objective: 把第一章城市隐喻综合为五个可执行的体系结构追问。
Timing: 2 min
Visual: 新生成的处理器城市全景，叠加五坐标交互轨道。
Interaction: 依次选择计算、存储、互连、并发、控制，为同一性能现象提出证据问题。
Sources: course-synthesis; source-deck
Boundary: 五坐标是课程综合框架，不是特定 ISA 或产品规范。
Narrative: 任何性能数字都必须能回到至少一个坐标中的资源与状态变化。
Transition: 第二章把空间资源换算为时间代价。
[Sources]
- catalog: course-synthesis
- catalog: source-deck
-->

---

# 第二章·空间和时间

<KeynoteSourceStage background="/generated/slides/s24-keynote-page-23.png" title="第二章·空间和时间" claim="从资源布局进入周期代价" slide-id="S24" />

<!--
Slide-ID: S24
Objective: 完整保留原稿第二章“空间和时间”章节页。
Timing: 2 min
Visual: 更新版 Keynote 第 23 页 1920×1080 确定性整页渲染。
Interaction: 章节转场，无附加操作。
Sources: publish-keynote-page-23
Boundary: 可见文字与装饰直接来自演讲人提供的 Keynote。
Narrative: 空间回答资源在哪里，时间回答数据到达与操作完成需要多久。
Transition: 从 SDR/DDR/QDR 信号边沿定义一个时钟周期。
[Sources]
- source: K23
- catalog: publish-keynote-page-23
-->

---

# 冯诺依曼架构·什么是芯片的一天？

<KeynoteSourceStage background="/generated/slides/s25-keynote-page-24.png" title="冯诺依曼架构·什么是芯片的一天？" claim="时间 × 频率 = 周期数" slide-id="S25" />
<ClockCycleConverter />

<!--
Slide-ID: S25
Objective: 用原稿 SDR/DDR/QDR 时序把人类时间换算为芯片周期。
Timing: 2 min
Visual: 更新版 Keynote 第 24 页 1920×1080 确定性整页渲染。
Interaction: 切换 ps/ns/day 与 MHz/GHz，比较同一时间跨度包含多少周期。
Sources: publish-keynote-page-24; course-model
Boundary: 换算器只做单位与周期数换算，不代表具体存储接口协议时序。
Narrative: 周期是离散模型的共同时间坐标，但事件仍可能跨多个信号边沿。
Transition: 用“天数”尺度比较不同存储层级的访问代价。
[Sources]
- source: K24
- catalog: publish-keynote-page-24
- catalog: course-model
-->

---

# 冯诺依曼架构·计算获取数据天数

<KeynoteSourceStage background="/generated/slides/s26-keynote-page-25.png" title="冯诺依曼架构·计算获取数据天数" claim="层级越远，等待跨度越大" slide-id="S26" />
<details class="keynote-lab-drawer">
  <summary aria-label="打开存储层级交互实验">交互实验</summary>
  <MemoryHierarchyExplorer />
</details>

<!--
Slide-ID: S26
Objective: 用原稿天数比喻与交互层级模型比较 L1、L2、L3、远端访问。
Timing: 2 min
Visual: 更新版 Keynote 第 25 页 1920×1080 确定性整页渲染。
Interaction: 调节 L1/L2 hit rate，观察平均周期与片外访问比例。
Sources: publish-keynote-page-25; course-model
Boundary: 天数是原稿尺度隐喻；交互延迟参数是教学值。
Narrative: 少量远端 miss 可以主导平均等待，因此命中率必须和代价共同建模。
Transition: 将访问边界扩展到 RDMA 与 RPC。
[Sources]
- source: K25
- catalog: publish-keynote-page-25
- catalog: course-model
-->

---

# 冯诺依曼架构·计算获取数据天数·远程访问

<KeynoteSourceStage background="/generated/slides/s27-keynote-page-26.png" title="冯诺依曼架构·计算获取数据天数·远程访问" claim="RDMA 与 RPC 扩大时间尺度" slide-id="S27" />

<!--
Slide-ID: S27
Objective: 按原稿比较片内层级、RDMA 与 RPC 的时间尺度。
Timing: 2 min
Visual: 更新版 Keynote 第 26 页 1920×1080 确定性整页渲染。
Interaction: 找出从 ns 到 μs 的数量级跳变来自哪些边界。
Sources: publish-keynote-page-26
Boundary: 原稿数字用于数量级教学，不能替代具体系统测量。
Narrative: 远程路径包含更多协议、队列、链路与同步阶段。
Transition: 由标量操作转向以 Tile 为单位的并行操作。
[Sources]
- source: K26
- catalog: publish-keynote-page-26
-->

---

# PTO指令集：Parallel Tile Operation

<KeynoteSourceStage background="/generated/slides/s28-keynote-page-27.png" title="PTO指令集：Parallel Tile Operation" claim="从 Scalar Operation 到 Tile Operation" slide-id="S28" />

<!--
Slide-ID: S28
Objective: 按原稿说明 PTO 以 Tile 为并行数据与操作单位。
Timing: 2 min
Visual: 更新版 Keynote 第 27 页 1920×1080 确定性整页渲染。
Interaction: 比较 32-bit scalar 与 8KB–16KB Tile 对搬运和调度粒度的影响。
Sources: publish-keynote-page-27
Boundary: 可见术语与容量范围按原稿保留；规范语义以后续 PTO-ASL 为准。
Narrative: 粒度变大提高批量复用，也放大容量、分块和尾块约束。
Transition: Tile 不只是方块，还需要表达不同形状与布局。
[Sources]
- source: K27
- catalog: publish-keynote-page-27
-->

---

# PTO指令集：我们在设计不同形状的集装箱

<KeynoteSourceStage background="/generated/slides/s29-keynote-page-28.png" title="PTO指令集：我们在设计不同形状的集装箱" claim="形状、布局与调度共同定义 Tile" slide-id="S29" />

<!--
Slide-ID: S29
Objective: 按原稿用集装箱比喻解释 Tile 形状、装载、运输与调度。
Timing: 2 min
Visual: 更新版 Keynote 第 28 页 1920×1080 确定性整页渲染。
Interaction: 对同一矩阵讨论 8×8、长条和子区域容器对搬运次数的影响。
Sources: publish-keynote-page-28
Boundary: 集装箱图是语义与调度隐喻，不规定物理 SRAM 形状。
Narrative: 形状必须同时满足算法访问、执行单元和本地容量。
Transition: 把这些操作放进 PTO 抽象执行机器。
[Sources]
- source: K28
- catalog: publish-keynote-page-28
-->

---

# PTO ISA CHEATSHEET：计算与数据并行

<KeynoteSourceStage background="/generated/slides/s30-keynote-page-29.png" title="PTO ISA CHEATSHEET：计算与数据并行" claim="严格保留更新版 Keynote 第 29 页文字、图片与构图" slide-id="S30" />

<!--
Slide-ID: S30
Objective: 按更新版 Keynote 原页讲解“PTO ISA CHEATSHEET：计算与数据并行”。
Timing: 2 min
Visual: 更新版 Keynote 第 29 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的指令分类、图示与体系结构关系。
Sources: publish-keynote-page-29
Boundary: 本页逐字逐图保留更新版 Keynote；指令语义以 PTO-ASL 规范为准。
Narrative: 先建立 PTO 指令族的整体地图，再进入抽象执行机器和程序。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K29
- catalog: publish-keynote-page-29
-->

---

# PTO ISA CHEATSHEET：数据流动与系统协作

<KeynoteSourceStage background="/generated/slides/s31-keynote-page-30.png" title="PTO ISA CHEATSHEET：数据流动与系统协作" claim="严格保留更新版 Keynote 第 30 页文字、图片与构图" slide-id="S31" />

<!--
Slide-ID: S31
Objective: 按更新版 Keynote 原页讲解“PTO ISA CHEATSHEET：数据流动与系统协作”。
Timing: 2 min
Visual: 更新版 Keynote 第 30 页 1920×1080 确定性整页渲染。
Interaction: 按方向键推进；观察原页中的指令分类、图示与体系结构关系。
Sources: publish-keynote-page-30
Boundary: 本页逐字逐图保留更新版 Keynote；指令语义以 PTO-ASL 规范为准。
Narrative: 先建立 PTO 指令族的整体地图，再进入抽象执行机器和程序。
Transition: 沿新版源稿顺序进入下一层体系结构问题。
[Sources]
- source: K30
- catalog: publish-keynote-page-30
-->

---

# PTO指令集：抽象执行机器

<KeynoteSourceStage background="/generated/slides/s32-keynote-page-31.png" title="PTO指令集：抽象执行机器" claim="语义路由到不同执行资源" slide-id="S32" />
<details class="keynote-lab-drawer">
  <summary aria-label="打开 PTO 抽象机器交互实验">交互实验</summary>
  <PtoMachineExplorer label="TLOAD TMOV TEXTRACT TPUSH TPOP · TPUT TGET · DaVinciOO communication extensions — not normative PTO-ASL" />
</details>

<!--
Slide-ID: S32
Objective: 在原稿抽象机器上区分 PTO-ASL 操作语义与 DaVinciOO 通信扩展。
Timing: 2 min
Visual: 更新版 Keynote 第 31 页 1920×1080 确定性整页渲染。
Interaction: 切换 TLOAD、TMOV、TEXTRACT、TPUSH/TPOP、TPUT/TGET，观察路径和引擎。
Sources: publish-keynote-page-31; pto-spec; davincioo-public-docs
Boundary: TPUT/TGET 是 DaVinciOO communication extensions — not normative PTO-ASL；不展示私有时序细节。
Narrative: TLOAD 为 GM→Tile/TMA；TMOV 为形状匹配 Tile copy 并在 DaVinci gfsim 路由 Vector；TEXTRACT 为 Vector 子区域；TPUSH/TPOP 使用显式 handoff slot/capacity；扩展路径为 GM→UB→GM。
Transition: 下一页观察 PTO 程序如何驱动抽象机器。
[Sources]
- source: K31
- catalog: publish-keynote-page-31
- catalog: pto-spec
- catalog: davincioo-public-docs
-->

---

# PTO指令集：抽象执行机器与程序

<KeynoteSourceStage background="/generated/slides/s33-keynote-page-32.png" title="PTO指令集：抽象执行机器与程序" claim="程序语义与机器资源相互映射" slide-id="S33" />

<!--
Slide-ID: S33
Objective: 按原稿把 PTO 程序操作映射到抽象执行机器。
Timing: 2 min
Visual: 更新版 Keynote 第 32 页 1920×1080 确定性整页渲染。
Interaction: 从一条 load/matmul/extract/store 链指出每步读写的架构状态。
Sources: publish-keynote-page-32
Boundary: 代码与抽象机器按原稿展示；具体规范效果以 PTO-ASL 为准。
Narrative: 程序顺序表达语义依赖，实现可以用不同资源与调度策略完成效果。
Transition: 放大最基础的 TLOAD/TSTORE 搬运链。
[Sources]
- source: K32
- catalog: publish-keynote-page-32
-->

---

# PTO指令集：TLOAD TSTORE

<KeynoteSourceStage background="/generated/slides/s34-keynote-page-33.png" title="PTO指令集：TLOAD TSTORE" claim="Tensor → Tile → Layout" slide-id="S34" />

<!--
Slide-ID: S34
Objective: 按原稿用工厂隐喻解释 Tensor、Tile 与 Layout 的装载过程。
Timing: 2 min
Visual: 更新版 Keynote 第 33 页 1920×1080 确定性整页渲染。
Interaction: 逐步指出 Tensor 选择、Tile 分块与 Layout 排列分别解决什么问题。
Sources: publish-keynote-page-33
Boundary: 工厂图是原稿教学比喻；TLOAD/TSTORE 规范语义以 PTO-ASL 为准。
Narrative: 数据搬运时间同时受分块次数、各段带宽、排队与同步影响。
Transition: 用可计算实验分解一次数据移动的总周期。
[Sources]
- source: K33
- catalog: publish-keynote-page-33
-->

---

# 数据搬运时间实验

<FullBleedStage background="/generated/slides/s35-data-movement-time-experiment-v2.png" title="数据搬运时间实验" claim="总时间 = 固有搬运 + 排队 + 同步。" eyebrow="SPACE → TIME" slide-id="S35" focus="left">
  <template #diagram><TransferTimeLab /></template>
</FullBleedStage>

<!--
Slide-ID: S35
Objective: 用确定性公式把 Tile 分块、最窄带宽、排队和同步合成总周期。
Timing: 2 min
Visual: 新生成的数据移动实验场景，底部为可调计算实验室。
Interaction: 切换 TLOAD、TMOV、TEXTRACT、TPUSH/TPOP、TPUT/TGET 并调节数据量、Tile 容量、链路带宽与排队成本。
Sources: course-synthesis; pto-spec; davincioo-public-docs
Boundary: 公式是教学一阶模型；TPUT/TGET 是 DaVinciOO 通信扩展，不属于规范 PTO-ASL；不暴露私有 DaVinci 时序实现。
Narrative: chunks=ceil(data/tile)，有效带宽取源、链路、目的最小值；固有周期加上 queue 与 synchronization 才是可见总时间。
Transition: 第一课结束；下一课把这些时间项落到可执行模型、队列与证据。
[Sources]
- catalog: course-synthesis
- catalog: pto-spec
- catalog: davincioo-public-docs
-->
