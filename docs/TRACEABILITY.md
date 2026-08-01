# Course Traceability Matrix

Generated from deck speaker notes. This is a course-level NDF projection, not a PTO normative artifact.

| Course requirement | Slide | Claim | Diagram/component | Experiment/evidence |
|---|---:|---|---|---|
| NDF-MTH-001, NDF-SRC-001 | session-1 · 1 | 先建立一条**不会自欺**的研究闭环 | class: hero | docs/NDF.md; materials/SOURCES.yaml |
| NDF-MTH-002, NDF-MTH-003 | session-1 · 2 | Agent 放大的首先是**歧义**，不是生产力 | class: compare | experiments/artifacts/07/expected_failure.json |
| NDF-LRN-101, NDF-LRN-102 | session-1 · 3 | 今天只练**四个判断动作** | class: architecture | docs/NDF.md |
| NDF-MTH-001 | session-1 · 4 | 一项研究只有闭环，才配得上“可复现” | class: architecture | docs/NDF.md; experiments/artifacts/summary.json |
| NDF-MTH-003 | session-1 · 5 | 先给每句话贴上**证据类型**，争论会立刻变短 | class: evidence | docs/NDF.md |
| NDF-SRC-001 | session-1 · 6 | 可执行规范让语义进入**机器检查** | class: architecture | materials/SOURCES.yaml |
| NDF-SRC-001, NDF-MTH-001 | session-1 · 7 | 五个操作就能形成第一条**端到端证据链** | class: experiment | experiments/artifacts/01/pto_trace.json |
| NDF-LRN-101, NDF-MTH-001 | session-1 · 8 | NDF 把研究承诺**钉在规范上** | NdfTraceability | experiments/artifacts/02/ndf_projection.json |
| NDF-VIS-001, NDF-LRN-102 | session-1 · 9 | 好的追踪链必须允许你**反向找到责任人** | class: evidence | docs/NDF.md; experiments/artifacts/04/comparison.json |
| NDF-LRN-101 | session-1 · 10 | 分层不是增加文档，而是限制每层**可以说什么** | class: architecture | experiments/artifacts/02/ndf_projection.json |
| NDF-SRC-003 | session-1 · 11 | LinxCore 是模块化案例，**不是 PTO 官方实现** | class: compare | materials/SOURCES.yaml; docs/NDF.md |
| NDF-SRC-003, NDF-LRN-101 | session-1 · 12 | 模块化的关键是**唯一状态所有者** | LinxCoreModuleExplorer | vendor/LinxCore/docs/spec/10-architecture/ownership.md |
| NDF-LRN-101, NDF-MTH-002 | session-1 · 13 | pyCircuit 把“改设计”压缩成**结构化行动空间** | class: circuit-focus | experiments/artifacts/03/pipeline_summary.json |
| NDF-LRN-101, NDF-MTH-001 | session-1 · 14 | 编译链不是后端细节，而是每次行动的**可审计路径** | PipelineStepper | experiments/artifacts/03/pipeline_summary.json |
| NDF-LRN-102 | session-1 · 15 | 队列把并发设计变成一个**局部可判定契约** | CircuitDataflow | experiments/artifacts/05/queue_summary.json |
| NDF-LRN-102, NDF-MTH-003 | session-1 · 16 | 观察点应贴近**架构承诺**，而不是贴满内部信号 | class: evidence | experiments/artifacts/04/comparison.json |
| NDF-LRN-102 | session-1 · 17 | 等价允许时序不同，但**承诺必须一致** | class: compare | experiments/artifacts/04/comparison.json |
| NDF-LRN-102, NDF-MTH-003 | session-1 · 18 | Trace 对比先做**身份对齐**，再谈差异 | TraceComparator | experiments/artifacts/04/comparison.json; experiments/artifacts/06/crosscheck.json |
| NDF-MTH-002 | session-1 · 19 | 故意失败，证明**裁判独立** | class: experiment | experiments/artifacts/07/expected_failure.json |
| NDF-MTH-002 | session-1 · 20 | 优化者与裁判共享代码，就会共享**盲点** | class: architecture | experiments/artifacts/07/expected_failure.json |
| NDF-MTH-003, NDF-OFF-001 | session-1 · 21 | 可审计证据不是一张图，而是一份**可重放包** | class: evidence | experiments/artifacts/summary.json |
| NDF-MTH-003, NDF-LRN-102 | session-1 · 22 | 主张写成六格卡片，Agent 才知道**何时停手** | class: evidence | experiments/artifacts/04/comparison.json |
| NDF-MTH-001, NDF-MTH-002 | session-1 · 23 | 每轮实验只改变一个**可解释维度** | class: experiment | experiments/artifacts/summary.json |
| NDF-MTH-002, NDF-LRN-102 | session-1 · 24 | Agent 的边界是**五件事**，不是一条 prompt | class: architecture | experiments/artifacts/07/expected_failure.json; experiments/artifacts/08/design_points.csv |
| NDF-MTH-001, NDF-MTH-003 | session-1 · 25 | 接受一个设计，需要同时回答**对、好、懂** | class: evidence | experiments/artifacts/04/comparison.json; experiments/artifacts/08/design_points.csv |
| NDF-LRN-101, NDF-LRN-102 | session-1 · 26 | 练习：把“做一个更快流水线”改写成**可审计任务** | class: quiz | experiments/artifacts/03/pipeline_summary.json; experiments/artifacts/04/comparison.json; experiments/artifacts/07/expected_failure.json |
| NDF-LRN-101, NDF-LRN-102, NDF-MTH-002 | session-1 · 27 | 一个合格答案，必须让陌生人**不用猜** | class: evidence | experiments/artifacts/04/comparison.json; experiments/artifacts/07/expected_failure.json |
| NDF-MTH-001, NDF-MTH-002, NDF-MTH-003, NDF-SRC-003 | session-1 · 28 | 证据最终要写回**设计记忆** | class: hero | experiments/artifacts/summary.json; docs/NDF.md |
| NDF-LRN-201, NDF-LRN-202, NDF-SRC-003 | session-2 · 1 | 模块化把复杂核变成**可审计实验** | class: hero | docs/NDF.md; experiments/artifacts/summary.json |
| NDF-LRN-201, NDF-LRN-202 | session-2 · 2 | 第二课把闭环落到**一个模块、一条 trace、一个决策** | class: architecture | docs/NDF.md |
| NDF-SRC-001, NDF-SRC-003, NDF-MTH-003 | session-2 · 3 | 先钉死三条边界，才不会把**案例说成规范** | class: compare | materials/SOURCES.yaml; docs/NDF.md |
| NDF-LRN-201, NDF-SRC-003 | session-2 · 4 | 模块不是文件夹，而是**状态、接口和证据的责任单元** | class: section | vendor/LinxCore/docs/spec/00-charter/scope.md |
| NDF-LRN-201, NDF-SRC-003 | session-2 · 5 | LinxCore 案例显示执行路径可以按**责任边界**拆开 | LinxCoreModuleExplorer | vendor/LinxCore/docs/spec/00-charter/scope.md; vendor/LinxCore/docs/spec/10-architecture/ownership.md |
| NDF-LRN-201, NDF-MTH-002 | session-2 · 6 | 单一状态所有者让恢复与提交只有**一个裁决点** | class: architecture | vendor/LinxCore/docs/spec/10-architecture/ownership.md |
| NDF-LRN-201 | session-2 · 7 | ready/valid：一个**局部契约**就够了 | CircuitDataflow | experiments/artifacts/05/queue_trace.csv |
| NDF-LRN-201, NDF-MTH-003 | session-2 · 8 | 8 周期队列 trace 把“不会丢数据”变成**可重放证据** | class: code-trace | experiments/artifacts/05/queue_trace.csv; experiments/artifacts/05/queue_summary.json |
| NDF-LRN-201, NDF-LRN-102 | session-2 · 9 | 背压传播必须停在接口，不能污染**架构语义** | TimingDiagram | experiments/artifacts/05/queue_trace.csv |
| NDF-LRN-201, NDF-LRN-102 | session-2 · 10 | 软硬件协同的共同语言是**可比较事件**，不是共享实现 | class: section | experiments/artifacts/06/crosscheck.json |
| NDF-LRN-201, NDF-MTH-003 | session-2 · 11 | 从 ELF 到提交 trace，每层只承诺**自己知道的事实** | class: evidence | experiments/06_trace_crosscheck/fixtures/elf_symbols.json; experiments/06_trace_crosscheck/fixtures/qemu_trace.csv; experiments/06_trace_crosscheck/fixtures/hardware_trace.csv |
| NDF-LRN-201, NDF-LRN-102 | session-2 · 12 | Crosscheck 先固定输入身份，再比较**4 条提交事件** | class: code-trace | experiments/artifacts/06/normalized_trace.csv; experiments/artifacts/06/crosscheck.json |
| NDF-LRN-102, NDF-MTH-003 | session-2 · 13 | Trace 不一致要先定位**首个分歧**，不要先解释全局 | TraceComparator | experiments/artifacts/06/crosscheck.json; components/TraceComparator.vue |
| NDF-LRN-102 | session-2 · 14 | 稳定 UID 让乱序、重放和 flush 之后仍能**可靠对齐** | class: architecture | vendor/LinxCore/docs/trace/uid_contract.md |
| NDF-LRN-201, NDF-MTH-002 | session-2 · 15 | 观察者不能反向阻塞**被观察系统** | class: architecture | vendor/LinxCore/docs/spec/20-behavior/ifu.md |
| NDF-MTH-001, NDF-MTH-002, NDF-LRN-202 | session-2 · 16 | 正确性门必须在 PPA 测量之前**关闭错误分支** | class: experiment | experiments/artifacts/summary.json |
| NDF-MTH-002, NDF-LRN-202 | session-2 · 17 | 故意越界并得到 exit 2，证明裁判会**拒绝候选** | class: experiment | experiments/artifacts/07/expected_failure.json |
| NDF-MTH-002, NDF-MTH-003, NDF-LRN-202 | session-2 · 18 | 失败工件是**设计知识**，不是日志垃圾 | class: evidence | experiments/artifacts/07/expected_failure.json |
| NDF-LRN-202, NDF-MTH-002 | session-2 · 19 | 体系结构 Agent 由**五项可审计合同**组成 | class: section | docs/NDF.md; materials/agentic_circuit_optimizer.md |
| NDF-LRN-202, NDF-LRN-201 | session-2 · 20 | 动作空间越结构化，实验的**因果归因**越可信 | class: compare | materials/agentic_circuit_optimizer.md |
| NDF-LRN-202 | session-2 · 21 | 旋钮只有绑定不变量后，才是**研究变量** | DesignSpaceExplorer | components/DesignSpaceExplorer.vue; experiments/artifacts/08/design_points.csv |
| NDF-LRN-202, NDF-MTH-003 | session-2 · 22 | 代理指标适合**筛选**，不适合宣称真实 PPA | class: architecture | materials/agentic_circuit_optimizer.md; materials/agentic_tao_physical_design_flow.md |
| NDF-LRN-202 | session-2 · 23 | Pareto 前沿保留**不可比较的好设计** | ParetoFrontier | experiments/artifacts/08/pareto_frontier.json; components/ParetoFrontier.vue |
| NDF-LRN-202, NDF-MTH-003 | session-2 · 24 | 被支配点仍能解释搜索为什么**停止** | class: evidence | experiments/artifacts/08/design_points.csv; experiments/artifacts/08/pareto_frontier.json |
| NDF-LRN-202, NDF-MTH-001, NDF-MTH-002 | session-2 · 25 | 接受规则必须同时约束**正确性、收益和可解释性** | class: evidence | experiments/artifacts/07/expected_failure.json; experiments/artifacts/08/design_points.csv |
| NDF-MTH-001, NDF-LRN-202 | session-2 · 26 | 每轮只验证一个假设，结果才能写回**设计记忆** | class: experiment | experiments/artifacts/summary.json; materials/agentic_circuit_optimizer.md |
| NDF-LRN-202, NDF-LRN-101 | session-2 · 27 | 结构性跳变应开新分支，而不是伪装成**局部优化** | class: compare | materials/agentic_circuit_optimizer.md |
| NDF-LRN-202, NDF-MTH-003 | session-2 · 28 | TAO v0.1 只是一条**待验证的物理设计研究路线** | class: section | materials/agentic_tao_physical_design_flow.md; materials/SOURCES.yaml |
| NDF-LRN-201, NDF-LRN-202 | session-2 · 29 | 练习：用证据卡审计一个“更快”的候选 | class: quiz | experiments/artifacts/05/queue_summary.json; experiments/artifacts/06/crosscheck.json; experiments/artifacts/07/expected_failure.json |
| NDF-LRN-202, NDF-MTH-003 | session-2 · 30 | 一张决策记录应让下一位研究者**复现选择** | class: evidence | docs/NDF.md; experiments/artifacts/summary.json |
| NDF-LRN-201, NDF-LRN-202, NDF-MTH-001, NDF-MTH-002, NDF-SRC-003 | session-2 · 31 | 研究闭环的产物不是赢家，而是**可否证的决策历史** | class: takeaway | experiments/artifacts/summary.json; docs/NDF.md |
