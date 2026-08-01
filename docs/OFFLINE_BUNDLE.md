# Offline Bundle Contract

`dist/` 是可复制到 U 盘或无网络演示机的完整课程站点：

```text
dist/
  index.html
  generated/main-hero.png
  session-1/
  session-2/
  session-1.pdf
  session-2.pdf
```

验证条件：

1. `npm run build` 成功；
2. `npm run test:offline` 不发现运行时远程 URL；
3. 在断网浏览器中从本地 preview 服务访问两课；
4. 所有 ImageGen 资产由本仓 `public/generated/` 打包；
5. 实验演示读取 `experiments/artifacts/`，不调用远程服务；
6. PDF 与交互网页来自同一份 `slides.md` 源码。

`dist/` 不进入 Git；发布包由固定 lockfile 和构建脚本重建。
