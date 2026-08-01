# Presenter Runbook

## 现场入口

1. 在演示机器执行 `npm ci && npm test`，确认 `dist/` 为新鲜构建。
2. 执行 `npm run preview`，浏览器打开 `http://127.0.0.1:4173/`。
3. 第一课进入 `/session-1/`，第二课进入 `/session-2/`。
4. Slidev 演讲者模式使用浏览器内置入口；PDF 仅作为静态备份。

## 断网策略

- 主路径：本地 `dist/` + `vite preview`。
- 备用路径：直接启动仓库根目录中的同一构建，不依赖 CDN、远程字体或 iframe。
- 最低风险路径：`dist/session-1.pdf` 与 `dist/session-2.pdf`。
- 实验现场不运行重型 EDA；播放 `experiments/artifacts/` 中预生成 JSON/CSV。现场可重跑 `bash experiments/smoke.sh` 证明确定性。

## 两课节奏

### Session 1 · 09:00–10:00

- 0–8 分钟：Agent 放大歧义；把研究主张分类。
- 8–20 分钟：固定 PTO executable architecture spec 与最小操作链。
- 20–32 分钟：PTO 条款到课程 NDF 投影。
- 32–46 分钟：pyCircuit 的结构化行动空间、流水/队列契约。
- 46–55 分钟：commit trace 等价和 intentional failure。
- 55–60 分钟：把“更快流水线”改写成可审计任务。

### Session 2 · 10:30–11:30

- 0–10 分钟：观察点与独立裁判回顾。
- 10–24 分钟：LinxCore 模块边界、状态所有权和接口契约。
- 24–38 分钟：ELF/QEMU/硬件 trace 的 bounded crosscheck。
- 38–48 分钟：设计空间与 Pareto。
- 48–56 分钟：Agent action/judge/sensor/memory 闭环。
- 56–60 分钟：失败证据、课后复现实验和研究问题。

## 互动控制

- `PipelineStepper`：先让学生预测下一状态，再点 Step；Play 仅用于复盘。
- `TimingDiagram`：游标停在 ready/valid 交叉处，问“本周期是否 fire”。
- `TraceComparator`：先显示全部事件，再只显示 mismatch。
- `LinxCoreModuleExplorer`：从 CommitTrace 逆向点击到状态所有者。
- `DesignSpaceExplorer` / `ParetoFrontier`：先探索错误设计点，再打开正确性过滤。

## 口径边界

- 始终称 `pto-spec` ASL1 为“PTO executable architecture spec”。
- LinxCore 是课程案例，不是 PTO 官方实现。
- TAO 与两份 agentic 文档是 v0.1 研究提案；不声称已有完整 PPA 实证。
- 课堂 crosscheck 是 reduced/bounded envelope，不等于完整内核或全系统证明。
- commit trace 功能等价不代表微架构侧信道安全等价。

## 故障切换

| 故障 | 立即动作 |
|---|---|
| 交互组件异常 | 刷新页面；仍异常则切 PDF，并讲解同页预生成证据 |
| 实验重跑失败 | 保留终端输出，使用预生成 artifact；把失败作为 reproducibility 边界说明 |
| 浏览器/端口异常 | `npm run preview -- --port 4174`；仍失败则打开 PDF |
| 外部网络不可用 | 无动作；课程不依赖网络 |
