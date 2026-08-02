# Course Traceability Matrix

Generated from the authoritative deck contract. `COURSE-Sxx` identifiers are course slide records. The mappings below are separate verified examples; they are not presented as one cross-layer semantic chain.

| Course record | Session | Claim | Overlay | Sources | Boundary |
|---|---:|---|---|---|---|
| COURSE-S01 | 1 | Architecture First · Agentic Circuit as a Research Instrument | AscendCover | `source-deck`, `agenda` | 背景为昇腾风格的概念视觉，不表示任何具体产品内部结构。 |
| COURSE-S02 | 1 | 姓名：周若愚 | KeynoteSourceStage | `publish-keynote-page-2` | 可见文字与图片均直接来自演讲人提供的 Keynote。 |
| COURSE-S03 | 1 | 什么是计算体系结构 | KeynoteSourceStage | `publish-keynote-page-3` | 可见文字与图形均直接来自演讲人提供的 Keynote。 |
| COURSE-S04 | 1 | 第一章 | KeynoteSourceStage | `publish-keynote-page-4` | 可见文字与装饰均直接来自演讲人提供的 Keynote。 |
| COURSE-S05 | 1 | Von Neumann bottleneck：性能瓶颈在于计算与存储之间信息传输率 | KeynoteSourceStage | `publish-keynote-page-5` | 比喻与可见文字完全沿用演讲人原稿。 |
| COURSE-S06 | 1 | 克服传输瓶颈：利用计算上的时间局部性与存储的空间局部性 | KeynoteSourceStage | `publish-keynote-page-6` | 比喻与可见文字完全沿用演讲人原稿。 |
| COURSE-S07 | 1 | 冯诺依曼架构·工业时代·社会主义 | KeynoteSourceStage | `publish-keynote-page-7` | 可见文字与图形完全沿用演讲人原稿。 |
| COURSE-S08 | 1 | 运力已经到达瓶颈，再加算力没有用处 | KeynoteSourceStage | `publish-keynote-page-8` | 可见文字、问题和示意图完全沿用演讲人原稿。 |
| COURSE-S09 | 1 | 256B/cycle | KeynoteSourceStage | `publish-keynote-page-9` | 可见文字、容量和带宽标注完全沿用演讲人原稿。 |
| COURSE-S10 | 1 | 足够多的独立请求可以隐藏延迟，但队列、端口和返回带宽会先饱和。 | Little’s Law 与队列占用 | `course-model`, `source-deck` | 数值仅用于教学推导；真实上限还受地址相关、bank、协议与调度影响。 |
| COURSE-S11 | 1 | 计算单元是工厂，存储是仓库，NoC 是道路，调度器决定货物流向。 | ArchitectureZoom | `source-deck`, `course-synthesis` | 城市隐喻帮助理解连接关系，不对应具体物理布局。 |
| COURSE-S12 | 1 | HBM、interposer、chiplet 与引脚共同决定可见带宽、延迟和能耗。 | package/HBM/DDR paths | `source-deck`, `course-synthesis` | 图片为通用 2.5D 架构概念，不影射具体厂商封装。 |
| COURSE-S13 | 1 | 局部热点、路由重叠和回压，会让总带宽充足的网络仍然拥塞。 | NoCTraffic | `course-model`, `source-deck` | NoCTraffic 是确定性 mesh 教学模型，不等同于 LinxCore 实际拓扑或完整路由器。 |
| COURSE-S14 | 1 | 高吞吐来自操作数在阵列附近循环，而不是每次乘加都访问远端。 | TileDataflow resources | `pto-spec`, `course-synthesis` | Left、Right、ACC 是教学映射，不宣称 PTO 规定物理缓冲结构。 |
| COURSE-S15 | 1 | Tile 太小浪费复用，太大挤爆容量和端口；最优点来自共同约束。 | Tile shape、layout、bank mapping | `pto-spec`, `course-model` | Tile 参数和容量为课程示例；PTO 定义语义而非唯一微架构映射。 |
| COURSE-S16 | 1 | 一块 buffer 服务计算，另一块 buffer 同时搬运下一 tile。 | DoubleBufferTimeline | `course-model`, `source-deck` | 忽略 DMA setup、bank 冲突和尾块不规则性，作为一阶模型。 |
| COURSE-S17 | 1 | 总容量相同，地址映射不同，瞬时带宽可以相差数倍。 | BankConflictExplorer | `course-model`, `source-deck` | 映射器只演示最简单顺序分布，未覆盖真实地址 XOR、端口与仲裁策略。 |
| COURSE-S18 | 1 | Task、Tile、Micro-op 分别管理全局依赖、本地复用和周期资源。 | three-level scheduler zoom | `course-synthesis`, `pto-spec`, `linxcore` | 三层是课程分析框架，不是 PTO 或 LinxCore 的规范术语集合。 |
| COURSE-S19 | 1 | 不要直接从代码跳到性能数字；先追踪每一级结构状态。 | clickable causal pipeline | `course-synthesis`, `course-model` | 因果链是分析顺序；真实系统存在反馈与并行路径，不是严格单向流水。 |
| COURSE-S20 | 1 | Agent 负责提出和修改模型；独立实验负责裁判。 | ArchitectureZoom | `ndf-course`, `pycircuit`, `course-synthesis` | NDF 图是课程设计投影；除明确引用外不冒充 PTO 规范或 LinxCore RTL。 |
| COURSE-S21 | 1 | 给定同一工作负载，选择一个改动，并预测它会改变哪条证据链。 | ExperimentPanel | `course-model`, `course-synthesis` | 面板结果是定性教学模型，第二课再用周期模型检查哪些预测站得住。 |
| COURSE-S22 | 2 | 第一课给出上界；第二课解释每个周期为什么达不到上界。 | ArchitectureZoom | `course-synthesis`, `linxcore` | 爆炸图表达通用乱序核心层次，不声称是 LinxCore 物理版图。 |
| COURSE-S23 | 2 | 以开源 LinxCore 为锚点，把前端、调度、执行、访存和提交连成系统。 | LinxCoreModuleExplorer | `linxcore`, `course-synthesis` | 组件只使用已核实的模块名；描述中的通用乱序概念与具体实现细节分开标注。 |
| COURSE-S24 | 2 | 同一虚拟 ISA effect 可以由不同流水线、缓存和调度策略实现。 | semantic/implementation boundary | `pto-spec`, `normative-language` | 不使用 ARM ASL；PTO 引用只覆盖仓内核实的公开定义，课程模型不冒充规范。 |
| COURSE-S25 | 2 | 算法、Tile 程序、ISA effect、微操作和硬件事件，是五种不同观察层。 | five-layer event alignment | `pto-spec`, `pycircuit`, `course-synthesis` | 微操作拆分和硬件信号属于课程实现；只有 effect 层引用 PTO 规范。 |
| COURSE-S26 | 2 | 现代核心不是单向传送带，而是带状态、反馈和资源竞争的队列网络。 | LinxCoreModuleExplorer | `linxcore`, `course-synthesis` | 图只标注已核实模块或通用概念；不推断未检查的内部策略。 |
| COURSE-S27 | 2 | 前端供给不足会让后端算力失去意义；错误路径还会浪费真实带宽。 | PipelineStepper | `linxcore`, `course-model` | 性能曲线来自课程前端模型；具体 LinxCore 宽度和预测器策略只以代码证据为准。 |
| COURSE-S28 | 2 | 重命名释放假依赖，ROB 保存程序顺序、异常边界和恢复状态。 | PipelineStepper | `linxcore`, `course-synthesis` | 具体 ROB entry 字段与恢复机制以 LinxCore 代码为准，图中为教学抽象。 |
| COURSE-S29 | 2 | 发射性能由唤醒、选择、端口和队列压力共同决定。 | QueuePressure | `linxcore`, `pycircuit`, `course-model` | QueuePressure 只演示容量动力学，选择优先级与端口兼容性需查看具体实现。 |
| COURSE-S30 | 2 | 执行延迟、吞吐和旁路覆盖，共同决定依赖链速度。 | PipelineStepper | `linxcore`, `course-synthesis` | 流水级数与 bypass 覆盖为通用模型，具体路径必须由 LinxCore 源码或波形确认。 |
| COURSE-S31 | 2 | 访存单元同时处理地址生成、内存顺序、转发、缓存和未完成请求。 | AGU/LQ/SQ/cache/miss path | `linxcore`, `course-synthesis` | 模块拆分采用通用 LSU 术语；LinXCore 的确切结构只陈述已核实部分。 |
| COURSE-S32 | 2 | Miss 先占住 LSU，再堵塞 issue、ROB、rename，最终让 fetch 停止。 | QueuePressure | `course-model`, `linxcore`, `course-synthesis` | 传播顺序是教学级因果路径；真实乱序核心可用独立指令部分隐藏 miss。 |
| COURSE-S33 | 2 | 下游满会向上游传播 stop；下游释放又向前传播 progress。 | TimingDiagram | `pycircuit`, `course-synthesis` | valid-ready 是课程模型采用的握手；具体 LinxCore 接口需以实现为准。 |
| COURSE-S34 | 2 | NDF 记录设计承诺：谁拥有状态、谁生产、谁消费、什么条件推进。 | NdfTraceability | `ndf-course`, `linxcore`, `agentic-materials` | NDF 是课程设计方法，不是 PTO 官方格式；所有 normative 语句必须带来源。 |
| COURSE-S35 | 2 | 模块、寄存器和队列在时钟边界更新；相同输入必须产生可重放轨迹。 | TimingDiagram | `pycircuit`, `agentic-materials` | 示例聚焦当前 pyCircuit frontend 支持的队列与寄存器语义，不承诺完整 LinxCore 等价模型。 |
| COURSE-S36 | 2 | 没有固定输入、配置、指标和产物，任何性能比较都不可信。 | BaselineExperiment | `experiment-artifacts`, `agentic-materials`, `course-synthesis` | 实验为教学规模模型，目标是方法可复现，不是宣称硅后性能。 |
| COURSE-S37 | 2 | 只改变带宽，观察性能先增长后在计算屋顶饱和。 | InteractiveRoofline | `experiment-artifacts`, `roofline-paper`, `course-model` | sweep 使用课程性能模型；结果用于验证趋势与上界，不代表 LinxCore RTL benchmark。 |
| COURSE-S38 | 2 | 更大 cache 减少流量，更深队列隐藏延迟；两者解决的不是同一个问题。 | ArtifactComparison | `experiment-artifacts`, `course-model`, `linxcore` | 变体是教学参数化模型，未包含 cache 面积、频率和功耗回归。 |
| COURSE-S39 | 2 | 宏观模型负责提出上界，微观轨迹负责解释偏差。 | gap decomposition | `roofline-paper`, `experiment-artifacts`, `course-synthesis` | 两类模型精度不同；不应强迫周期模型等于上界，而应解释差距。 |
| COURSE-S40 | 2 | 提出变体、运行模型、收集证据、批判结果；每一步都有边界和失败条件。 | PipelineStepper | `agentic-materials`, `normative-language` | Agent 不产生规范真相；它的主张必须由来源、实验和独立检查器支持。 |
| COURSE-S41 | 2 | 性能、流量、面积、功耗和复杂度之间没有单一冠军。 | ParetoFrontier | `course-model`, `course-synthesis` | 当前 cost 指标为教学代理量，不替代综合、时序和功耗工具。 |
| COURSE-S42 | 2 | 从工作负载到周期事件，保持层次、因果、来源和可复现性。 | ArchitectureZoom | `course-synthesis` | 总结图表示方法论关系，不声称任何单一模型覆盖全部真实处理器行为。 |

## Verified mappings

| Scope | Claim | Source | Evidence |
|---|---|---|---|
| separate example | PTO bundle-active state is implemented and directly asserted | `vendor/pto-spec/asl/bundle/state.asl` | `vendor/pto-spec/tests/asl/bundle-tests.asl` |
| separate example | The pyCircuit IssueQueue build is instantiated by its testbench | `vendor/pyCircuit/designs/IssueQueue/issq.py` | `vendor/pyCircuit/designs/IssueQueue/tb_issq.py` |
| separate example | LinxCore ROB control is wired into the ROB bank | `vendor/LinxCore/src/bcc/backend/rob.py` | `vendor/LinxCore/src/bcc/backend/modules/rob_bank.py` |
