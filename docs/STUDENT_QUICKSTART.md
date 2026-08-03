# 学生 10 分钟上手

## 1. 运行课程站点（3 分钟）

```bash
npm ci
npm run build
npm run preview
```

打开 `http://127.0.0.1:4173/`。课程包含两节各 75 分钟、共 64 页的内容：

- `/`：课程首页；
- `/session-1/1` 到 `/session-1/33`：城市、DaVinci/Ascend、存储/互连与 PTO 数据搬运时间；
- `/session-2/1` 到 `/session-2/31`：q_proj Trace、DaVinciOO gfsim/SimQueue、参数敏感性、PTO-ASL、NDF、pyCircuit 与证据飞轮。

键盘：`←`/`→` 或 `J`/`K` 翻页，`Space` 前进，`F` 全屏，`O` 总览，`?` 打开帮助，`Esc` 关闭帮助。

## 2. 重放全部实验（2 分钟）

```bash
bash experiments/smoke.sh
```

成功标准：11 个实验全部按预期通过。实验 07 是 intentional failure，必须返回预期失败判决，统一 runner 才把它计为通过。

## 3. 检查 q_proj 证据（3 分钟）

```bash
python3 experiments/11_qproj_davincioo/run.py \
  --output-dir /tmp/qproj-reference-replay
```

检查 `/tmp/qproj-reference-replay/qproj_summary.json`：

- `evidence_mode` 是 `reference_replay`；
- checked artifact 含 562 条 trace 记录；
- 当前 DaVinciOO gfsim replay 重现 11028 cycles；
- fresh PTO capture 尚未完成；
- sweep 只表达 one-factor-at-a-time sensitivity，不证明结构等价或最优。

## 4. 做一次架构判断（2 分钟）

在 Session 2 的参数搜索页只移动一个参数：ROB depth、Tile tags、TMA bandwidth、Cube MACs/cycle 或 engine count。记录：

- 哪个空间资源发生变化；
- 它影响了哪段时间代价；
- artifact 支持的是观察、敏感方向还是规范结论；
- 若要进入实现，PTO-ASL、NDF 与 pyCircuit 分别约束什么；
- 哪个新实验可以证伪你的候选解释。

## 不要混淆

- PTO-ASL 定义 normative 语义；`TPUT/TGET` 是 DaVinciOO communication extensions，不属于 normative PTO-ASL。
- DaVinciOO gfsim/SimQueue 是可执行模型层；NDF 是设计与验收追踪层；pyCircuit 是实现源层。
- `reference_replay` 是已检查的离线证据，不是 fresh PTO capture。
- 一次 sweep 的周期变化是 sensitivity，不自动升级为结构等价、PPA 最优或普遍事实。
