# Presenter Runbook

## 现场入口

1. 在演示机器执行 `npm ci && npm test`，确认 `dist/` 来自当前源码。
2. 执行 `npm run preview`，打开 `http://127.0.0.1:4173/`。
3. 首页 `/` 进入两节课；第一页分别是 `/session-1/1` 与 `/session-2/1`，有效页码分别为 `1..33` 与 `1..31`。
4. PDF 只作为静态备份；交互讲解使用本地网页。

## 两节课节奏

### Session 1 · 75 分钟 · 城市、资源与数据搬运时间

| 时间 | 页面 | 讲解目标 |
|---|---:|---|
| 0–8 分钟 | 1–4 | 建立课程问题：体系结构研究解释空间资源如何限制工作负载。 |
| 8–28 分钟 | 5–12 | 用城市与仓库隐喻讲清局部性、Roofline、Tile/CUBE 与共享资源。 |
| 28–43 分钟 | 13–18 | 从 Ascend 教学抽象、SoC、存储与互连收束到五个体系结构坐标。 |
| 43–55 分钟 | 19–22 | 把物理时间、频率、存储层级和远程访问换算为周期代价。 |
| 55–71 分钟 | 23–27 | 从 PTO Tile 粒度进入抽象执行机器、操作路径和布局。 |
| 71–75 分钟 | 28 | 用数据搬运实验总结：总时间 = 固有搬运 + 排队 + 同步。 |

讲解主线：城市 → DaVinci/Ascend 教学抽象 → 存储/互连 → PTO 数据搬运时间。S30 与 S33 必须明确：`TPUT/TGET` 是 DaVinciOO communication extensions，不属于 normative PTO-ASL。

### Session 2 · 75 分钟 · 从 q_proj Trace 到证据飞轮

| 时间 | 页面 | 讲解目标 |
|---|---:|---|
| 0–10 分钟 | 1–4 | 将 Qwen3-14B `q_proj` 缩成可追踪的 BF16 垂直切片，并建立 Python→PTO→Trace→gfsim 链。 |
| 10–28 分钟 | 5–10 | 解剖 trace、SimQueue、DaVinciOO gfsim 拓扑、时间模型、资源路由与单周期推进。 |
| 28–40 分钟 | 11–14 | 区分 intrinsic latency 与 system time；做参数敏感性探索并浏览离线证据。 |
| 40–53 分钟 | 15–21 | 陈述 q_proj 证据边界，再承接历史源稿中的分层调度、PTO/MLIR 与 Swizzle。 |
| 53–62 分钟 | 22–24 | 把敏感参数转成设计约束，以 PTO-ASL 固定语义，再用 NDF 分层表达验收。 |
| 62–72 分钟 | 25–27 | 定义 q_proj vertical slice，在 pyCircuit 上分工，并用同一 trace 比较两个模型。 |
| 72–75 分钟 | 28 | 收束为 Architecture research Agent flywheel。 |

讲解主线：Qwen3-14B `q_proj` → PTO Trace → DaVinciOO gfsim/SimQueue → 参数敏感性 → PTO-ASL → NDF → pyCircuit vertical slice → 实验证据飞轮。

## 互动与键盘

- `→` / `Space`：下一页或 Slidev 的下一步。
- `←`：上一页或上一步。
- `J` / `K`：直接翻到下一页 / 上一页。
- `F`：全屏；`O`：总览。
- `?`：打开键盘帮助；`Esc`：关闭帮助。
- 聚焦交互组件后，按页面提示使用方向键、`Space` 或 `Home`。输入框、下拉框和滑杆获得焦点时，全局快捷键不会抢占输入。

关键互动顺序：先让学生预测，再操作，最后读证据边界。重点使用 S1-08 Roofline、S1-18 五坐标、S1-25 PTO 抽象机器、S1-28 搬运时间，以及 S2-05 Trace、S2-06 SimQueue、S2-07 gfsim 拓扑、S2-10 单周期播放、S2-12 参数敏感性、S2-13 时间线、S2-27 双模型比较。

## 实验模式

### 默认：离线 replay

```bash
bash experiments/smoke.sh
```

课堂默认读取已检入的 `reference_replay` artifact。q_proj checked artifact 含 562 条记录；当前 gfsim replay 重现 11028 cycles。fresh PTO capture 尚未完成，因此不得把 artifact 讲成刚刚生成的新 trace。参数 sweep 是 one-factor-at-a-time sensitivity，只用于发现候选方向，不证明结构等价或最优。

### 可选：本地 live environment

只有在本地 DaVinciOO、gfsim 和输入 trace/PTO 文件都已预先验证时才切换 live mode。使用环境变量选择外部路径，输出到临时目录；不要覆盖课程的 `reference_replay` artifact。现场命令见 `experiments/11_qproj_davincioo/README.md`。

## 口径边界

- 核心叙事是：空间资源 → 时间代价 → 可执行模型 → 参数搜索 → 规范约束 → Agent 驱动实现 → 实验证据。
- PTO-ASL 是 normative 语义权威；`TPUT/TGET` 是 DaVinciOO 通信扩展，不属于 normative PTO-ASL。
- DaVinciOO gfsim 的 opcode 路由、SimQueue 与时间模型属于实现/教学模型，不是 PTO 规范。
- NDF 是课程采用的设计与验收追踪方法，不是 PTO 官方格式。
- pyCircuit 是 canonical implementation source surface；它不是 RTL 或 silicon。
- Agent 提出与修改候选模型，独立规范和实验负责裁判。
- 历史源稿结果与本课程 q_proj replay evidence 必须分开陈述。

## 故障切换

| 故障 | 立即动作 |
|---|---|
| 交互组件异常 | 刷新当前路由；仍异常则切 PDF，并按同页静态证据讲解。 |
| live mode 失败 | 保留终端输出，立即回到 `reference_replay`；不要现场修工具链。 |
| 浏览器/端口异常 | 执行 `npm run preview -- --port 4174`；仍失败则打开 PDF。 |
| 外部网络不可用 | 无动作；网页、字体、图片与 replay artifact 均为本地资源。 |
