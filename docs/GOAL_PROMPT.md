# 课件构建 Goal Prompt（逐页视觉设计版）

## 目标

在 private GitHub 仓库 `LinxISA/SummerSchool` 中，持续执行直到完成两段各 60 分钟的中文 Slidev 交互式教程：

> 《Agent 时代的体系结构研究：pyCircuit 与工具驱动的芯片设计方法学》

课件必须从本仓源码构建，可在完全断网环境中通过本地网站演示，也必须能导出 PDF。统一输出：

- `dist/index.html`
- `dist/session-1/`
- `dist/session-2/`
- `dist/session-1.pdf`
- `dist/session-2.pdf`

受众是体系结构方向研究生和年轻研究者。课程不是工具广告，而是一套可操作的研究方法：让 Agent Circuit 帮助研究者理解规范、提出微架构假设、构造证据、淘汰错误设计，并把结论写回可追踪的 NDF。

## 研究主线与事实边界

课程必须围绕以下闭环展开：

```text
PTO 可执行架构规范
→ 课程 NDF 投影
→ pyCircuit / LinxCore 微架构模块
→ 功能与轨迹验证
→ PPA 与性能测量
→ Agent 设计空间探索
→ 决策写回 NDF
```

硬约束：

1. PTO 语义唯一事实源固定为 `PTO-ISA/pto-spec@9574f0293929bf692517dd29de11a8354440c7dc`。
2. 不使用 Arm ISA、Arm ASL、Sail Arm 或 Isla。
3. `pto-spec` 中使用的 ASL1 在课程中统一称为“PTO 可执行架构规范”。
4. NDF、pyCircuit、LinxCore、trace 与 PPA 数据属于课程构造的研究证据，不能反向覆盖 PTO ISA 规范。
5. LinxCore 只作为模块化处理器与软硬件协同研究案例，不得称为 PTO 的官方实现。

## 两段课程

Session 1《从可执行规范到可优化微架构》必须覆盖：规范—实现边界、架构状态与微架构状态、观测点、模块与层次、流水线与周期、前馈数据通路与反馈环、pyCircuit 研究变量、commit/effect trace、逐周期对拍、等价门，以及“提案—验证—测量—选择—写回”的 Agent Circuit 闭环。

Session 2《从模块设计到软硬件协同研究》必须覆盖：LinxCore 模块分解，Fetch→Decode→Rename→Issue→Execute→ROB/Commit，ReducedScalarAluExecute、ReducedScalarIssueQueue、ROBEntryBank、CommitTrace 的接口与状态所有权，ELF/QEMU/模型/RTL trace cross-check，单元/模块/系统证据分层，流水线深度、队列深度、发射宽度、旁路与资源共享，以及性能、面积、功耗、复杂度的 Pareto 权衡。

## 强制逐页视觉合同

课件不能是“带背景的 Markdown 文档”。**每一页都必须先完成视觉设计，再写最终文字。** 对每页依次完成：

1. 写出一个中心观点，禁止一页承担多个互不相关的任务。
2. 指定该页的主视觉类型和视觉叙事，禁止把图片当装饰。
3. 选择统一 layout，在 12 列网格和 5%–7% 安全边距内排版。
4. 只保留支撑中心观点的文字；普通列表不超过 5 项，每项尽量不超过两行。
5. 页面必须至少包含一种有效视觉：电路图、架构框图、流水线图、数据通路、时序图、状态机、trace、代码—结果对照、交互实验、数据图、Pareto 图或 ImageGen 概念插图。
6. 除封面和极简章节页外，禁止只有标题、段落或 bullet 的页面。
7. 正文投影视觉字号不低于约 24px；代码通常不超过 18 行，超出时拆页或逐步高亮。
8. 普通内容页最多三个视觉层级、三个主要区域；所有边缘、基线和间距必须对齐。
9. 页码、章节、来源与 NDF ID 使用固定位置，不能与内容争夺注意力。
10. 每个关键研究结论必须由电路图、架构图、trace 或实验图支撑，不能只靠口头声明。

建议视觉节奏：

- 封面与章节页：全幅或半幅 ImageGen 背景，保留标题负空间。
- 概念页：ImageGen 概念插图 + 一句结论 + 少量注释。
- 技术页：Vue/SVG/Mermaid/WaveDrom 架构图、电路图或时序图占主导。
- 代码页：代码、状态与输出并列，突出因果关系。
- 实验页：控制面板 + 波形/trace/数据结果，不把交互按钮堆成表单。
- 总结页：关系图或闭环图，不使用密集 bullet。
- 每 8–12 分钟至少安排一次交互、动态演示、判断题或实验。

## ImageGen 强制要求

所有课程背景、封面、章节过渡图和非确定性概念插图必须调用内置 ImageGen 原创生成，禁止用网络 stock image 替代。至少独立生成：总封面、Session 1 封面、Session 2 封面、“规范到电路”、“Agent Circuit 研究闭环”、“模块化处理器”、“软硬件协同实验室”、“设计空间与 Pareto 前沿”，以及需要的章节过渡背景。每个不同资产单独调用 ImageGen，不得用同一个结果冒充多张图片。

每个 ImageGen prompt 必须包含：

- 16:9 横向构图，适合 1920×1080；
- 明确描述图片承担的课程概念，而非笼统的“未来科技”；
- 明确指出标题、图表或人物所在侧需要的负空间；
- 深海军蓝、青蓝、电路绿和少量暖橙的统一色彩；
- 芯片、数据流、模块层次、研究工作台等与内容相关的视觉隐喻；
- 无文字、公式、标签、logo、watermark 和伪文字；
- 不生成精确电路连接，不使用普通 AI 机器人头像，不堆砌无意义发光线路；
- 背景对比度受控，正文区域保持安静、可读。

ImageGen 结果必须保存到 `assets/generated/`，并在 `assets/generated/prompts.yaml` 记录 asset ID、使用页面、最终 prompt、日期、路径、尺寸、审核结论和是否需要重生成。每张图生成后检查构图、负空间、主题相关性、风格一致性、伪文字和正文可读性；不合格时只针对具体问题重生成，不能靠裁切掩盖问题。

## 技术图准确性

ImageGen 只负责概念与氛围。以下内容必须由 Vue + SVG、Mermaid、WaveDrom、Canvas 或实验 JSON/CSV 确定性生成：端口、模块连接、流水级、ready/valid、时序、状态机、寄存器、队列、ROB、Issue Queue、commit trace、NDF 追踪、实验数据与 Pareto 前沿。

至少实现并用于课程：

- `PipelineStepper.vue`
- `LinxCoreModuleExplorer.vue`
- `CircuitDataflow.vue`
- `TimingDiagram.vue`
- `TraceComparator.vue`
- `NdfTraceability.vue`
- `DesignSpaceExplorer.vue`
- `ParetoFrontier.vue`

组件应支持与内容匹配的 step、play、pause、reset 和关键状态高亮。架构图要能看出层次、接口、状态所有权与数据/控制方向；电路图要能看出组合逻辑、寄存器、反馈路径和周期边界。

## Slidev、实验与离线交付

固定使用 `@slidev/cli@52.18.1`，建立 `decks/session-1/slides.md` 与 `decks/session-2/slides.md`，共用 `components/`、`layouts/`、`styles/`、`assets/`、`public/` 与 `experiments/artifacts/`。字体、图片、JavaScript、CSS、数据与实验结果全部进入仓库；禁止 CDN、远程字体、运行时 iframe 和必须联网的 API。

至少包含八个确定性实验：PTO TALLOC→TLOAD→TADD→TSTORE、PTO 条款 NDF 投影、pyCircuit 小流水线、两个微架构版本 trace 对比、LinxCore 小模块、ELF/QEMU/硬件 trace cross-check、intentional failure、设计空间/Pareto。所有结果输出为 JSON/CSV，并保留预生成工件，确保现场断网或重型工具失败时仍可演示。

## NDF 与逐页追踪

每个重要课程条款具有稳定 NDF ID，建立：

```text
requirement → slide → diagram/component → experiment → evidence
```

每页 speaker notes 必须记录：NDF ID、学习目标、讲授时间、视觉意图、证据来源、互动方式、不能夸大的结论与 sources。

## 逐页视觉验收门

必须把两个 deck 的每一页渲染为 1920×1080 截图并生成 contact sheet。自动检查：溢出、裁切、字号、对比度、远程请求、图片存在性和比例、代码横向溢出、图表标签、有效视觉、speaker notes 与 NDF ID。

随后对 **每一页** 人工按 1–5 分评分：

- 信息层次；
- 对齐与留白；
- 可读性；
- 视觉与中心观点的相关性；
- 电路/架构表达的技术准确性；
- 全套课件的风格一致性；
- 演讲现场效果。

任一维度低于 4/5，或出现文字墙、装饰性图片、伪电路、元素漂浮、局部拥挤、标题异常换行、图表标签过小、视觉与论点无关，都必须修改并重新截图。禁止用“能够构建”代替视觉验收。

## 完成条件

只有同时满足以下条件才能停止：private `LinxISA/SummerSchool` 已推送；两段课程各 60 分钟；`npm ci`、build、test、实验 smoke、离线检查、PDF 导出全部通过；所有 ImageGen 资产与 prompt 可追踪；所有技术图确定性生成；每页有有效视觉；每个关键结论有电路/架构/trace/实验证据；59 页逐页截图和 contact sheet 审核通过；无溢出、裁切、低对比度、文字墙或远程依赖；NDF 追踪完整；presenter runbook、student quickstart 和 offline bundle 完成；所有完成声明附最新验证证据。

持续执行直到以上条件全部满足。不得用占位图、空白 diagram、“后续补充”或未经检查的生成图替代交付物。
