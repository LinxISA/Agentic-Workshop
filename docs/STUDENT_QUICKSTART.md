# 学生 10 分钟上手

## 1. 运行课件（2 分钟）

```bash
npm ci
npm run build
npm run preview
```

打开 `http://127.0.0.1:4173/`。

## 2. 重放全部实验（2 分钟）

```bash
bash experiments/smoke.sh
```

成功标准：8 个实验全部按预期通过，其中 intentional failure 必须产生预期的失败判决，统一 runner 才把它计为通过。

## 3. 顺着一条证据链走到底（3 分钟）

```text
NDF-SRC-001
  → Session 1 的 PTO 操作链页面
  → experiments/01_pto_tile_ops
  → experiments/artifacts/01/pto_trace.json
```

再做反向检查：从 JSON 结果返回页面备注，找到它支持的学习目标和限制。

## 4. 改一个设计点（3 分钟）

在 `experiments/08_design_space_pareto/` 中选择一个配置，只改变一个参数并重跑。记录：

- 假设是什么；
- 哪个正确性门不可绕过；
- 哪个指标决定“更好”；
- 新结果是否支配已有点；
- 接受或拒绝理由应写回哪个 NDF ID。

## 不要混淆

- PTO executable architecture spec 是规范事实源。
- 课程 NDF 是追踪和设计承诺的投影。
- pyCircuit/LinxCore 是实现与实验层。
- 一次测试通过是实验观察，不自动升级为普遍事实。
