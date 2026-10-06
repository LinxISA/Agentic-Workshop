# Offline Bundle Contract

## Base path 与静态路由

- 本地构建的 base path 为空，入口是 `http://127.0.0.1:4173/`，课程路径从 `/session-1/` 和 `/session-2/` 开始。
- GitHub Pages 构建设置 `SUMMERSCHOOL_BASE_PATH=/SummerSchool`，公开入口是 `https://linxisa.github.io/SummerSchool/`，资源和课程链接都带 `/SummerSchool` 前缀。
- `npm run build:routes` 分别生成 `session-1/1..33/index.html` 与 `session-2/1..31/index.html`。这些物理编号路由复用对应 deck 的入口 HTML，不复制 assets，因此直接打开或刷新 `/session-1/17` 等链接时仍可离线工作。

验证 Pages 版本时使用：

```bash
SUMMERSCHOOL_BASE_PATH=/SummerSchool npm run build
SUMMERSCHOOL_EXPECTED_BASE_PATH=/SummerSchool npm run test:pages
```

`dist/` 是可复制到 U 盘或无网络演示机的完整课程站点。构建后包含：

```text
dist/
  index.html
  generated/
  session-1/
  session-2/
  session-1.pdf
  session-2.pdf
```

## 路由契约

- `/`：本地课程首页；
- `/session-1/1` 到 `/session-1/33`：第一节课；
- `/session-2/1` 到 `/session-2/31`：第二节课；
- `/session-1` 与 `/session-2` 重定向到对应目录入口。

两节课都支持 `←`/`→`、`Space`、`J`/`K`、`F`、`O`、`?` 和 `Esc`。这些控制不依赖网络。

## 构建与验证

```bash
npm run build
npm run export
npm run test:offline
```

发布前必须满足：

1. 两个 deck 分别为 33 页与 31 页，计时各 75 分钟；
2. 首页和所有 `/session-1/1..33`、`/session-2/1..31` 页面只读取本地脚本、字体、图片和数据；
3. 所有课程图片由 `public/generated/` 打包；
4. 两份 PDF 与网页使用相同的 `slides.md` 源；
5. `npm run test:offline` 不发现运行时远程 URL；
6. 默认实验通过 `bash experiments/smoke.sh` 重建本地 artifact。

## Replay 与 live environment

默认演示使用已检入的 `experiments/artifacts/11/`：q_proj artifact 标记为 `reference_replay`，含 562 条记录；当前 gfsim replay 重现 11028 cycles。fresh PTO capture 尚未完成，参数 sweep 只表示 sensitivity。

可选 live environment mode 由 `experiments/11_qproj_davincioo/run.py --mode live` 提供。它只调用演示机上通过环境变量显式选择的 DaVinciOO/PTO 工具和输入文件。外部工具、私有 trace 与模型仓库不属于 offline bundle；live 输出必须写入独立临时目录，不得覆盖 `reference_replay`。

`dist/` 不进入 Git；发布包由 lockfile、构建脚本和本地资产重新生成。
