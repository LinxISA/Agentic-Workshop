# PTO ISA 立体卡通 Cheatsheet 设计规格

## 目标

基于本地输入文件 `PTO-ISA-保留指令列表.xlsx` 制作两张 4K、16:9 的 PTO ISA 教学速查海报。海报使用用户提供参考图的深蓝背景、等距视角和立体卡通微缩模型风格，覆盖主表中的 11 个一级分类与 124 条指令。

最终只交付两张组合式海报，不为每个分类分别生成独立图片。每个一级分类在组合海报中都必须拥有一个语义清晰的立体卡通图示，并显示该分类下全部指令名称。

## 数据边界

- 指令与分类的唯一内容来源是工作簿 `Sheet1!A1:C125`。
- 当前主表包含 11 个一级分类、24 个展示分组和 124 条指令。
- `Sheet2!B9` 提到 `TPOW`、`TPOWS` 是 reserved/TODO 规划项，但它们未出现在 `Sheet1` 当前指令表中，因此不进入本版 cheatsheet。
- 保留源表中的指令拼写与大小写，包括不带 `T` 前缀的 `SYNCALL`。
- 不在图片中表达 CPU-SIM、A2A3、A5、Kirin 等支持状态，避免降低主速查表的可读性。

## 视觉系统

- 画布：每张 3840×2160，横向 16:9。
- 背景：深海军蓝到近黑的柔和渐变，边缘轻微压暗。
- 风格：等距视角、立体卡通、微缩工业模型、圆角底座、柔和阴影、精细材质。
- 主色：青蓝表示数据与存储，暖黄/橙表示计算，绿色用于广播或调度，洋红只作极少量强调。
- 统一性：两张海报使用相同相机角度、照明、底座厚度、阴影方向和材质语言。
- 图示不得依赖文字才能表达基本语义。
- 不使用真实厂商标识，不把教学隐喻描述成真实芯片内部结构。

## 生成与排版策略

Image Gen 只生成两张无技术文字的组合场景底图，并为每个分类保留清晰、低细节的文字区域。分类标题、子分类标题与 opcode 使用确定性 SVG/HTML 文字层叠加，再渲染成最终 PNG。

这样可以同时满足：

1. 每个分类都有立体卡通图示；
2. 两张海报具有统一的 Image Gen 视觉语言；
3. 124 条 opcode 的拼写完全来自源表，不受生成模型文字错误影响；
4. 后续可以只修改文字层而无需重新生成场景。

## 海报 A：计算与数据并行

### 内容

海报 A 覆盖 7 个一级分类、74 条指令。采用四列两行的卡片网格，其中一处用于标题与图例，其余七处对应七个分类。

### 分类与图示

1. **逐元素双目运算（12）**
   - 图示：两条 Tile 传送带进入一台双入口运算机，输出一组新 Tile。
   - 算术：`TADD`、`TSUB`、`TMUL`、`TMAX`、`TMIN`
   - 逻辑：`TAND`、`TOR`、`TXOR`、`TSHL`、`TSHR`、`TCMP`、`TSEL`

2. **逐元素单目运算（4）**
   - 图示：单条 Tile 流穿过一台变换机，每个方块被独立加工。
   - 指令：`TABS`、`TNOT`、`TNEG`、`TRELU`

3. **逐元素超越函数（7）**
   - 图示：Tile 进入带有曲线管道、平方根形机械结构和指数上升轨道的非线性反应器；结构只作语义隐喻，不生成公式或字符。
   - 指令：`TDIV`、`TREM`、`TSQRT`、`TLOG`、`TRECIP`、`TEXP`、`TRSQRT`

4. **逐元素与标量运算（15）**
   - 图示：一组 Tile 接收来自顶部单颗标量胶囊的统一加工参数。
   - 算术：`TADDS`、`TAXPY`、`TSUBS`、`TMULS`、`TDIVS`、`TMINS`、`TMAXS`、`TREMS`
   - 逻辑：`TANDS`、`TORS`、`TXORS`、`TCMPS`、`TSELS`、`TSHLS`、`TSHRS`

5. **归约运算（12）**
   - 图示：多行或多列货物流在漏斗式汇聚站中压缩为单行或单列。
   - 归约为一列：`TROWSUM`、`TROWPROD`、`TROWMAX`、`TROWMIN`、`TROWARGMAX`、`TROWARGMIN`
   - 归约为一行：`TCOLSUM`、`TCOLPROD`、`TCOLMAX`、`TCOLMIN`、`TCOLARGMAX`、`TCOLARGMIN`

6. **广播运算（16）**
   - 图示：一个中央分发塔将一行或一列数据复制到规则 Tile 阵列。
   - 按行：`TROWEXPAND`、`TROWEXPANDADD`、`TROWEXPANDSUB`、`TROWEXPANDMUL`、`TROWEXPANDDIV`、`TROWEXPANDMAX`、`TROWEXPANDMIN`、`TROWEXPANDEXPDIF`
   - 按列：`TCOLEXPAND`、`TCOLEXPANDADD`、`TCOLEXPANDSUB`、`TCOLEXPANDMUL`、`TCOLEXPANDDIV`、`TCOLEXPANDMAX`、`TCOLEXPANDMIN`、`TCOLEXPANDEXPDIF`

7. **矩阵运算（8）**
   - 图示：左右两组矩阵货架进入中央 CUBE 工厂，生成新的矩阵阵列。
   - 矩阵乘矩阵：`TMATMUL`、`TMATMUL_BIAS`、`TMATMUL_ACC`、`TMATMUL_MX`
   - 矩阵乘向量：`TGEMV`、`TGEMV_BIAS`、`TGEMV_ACC`、`TGEMV_MX`

## 海报 B：数据流动与系统协作

### 内容

海报 B 覆盖 4 个一级分类、50 条指令。使用非对称网格：复杂变换计算占据双倍面积，其他三个分类各自使用一个大卡片。

### 分类与图示

1. **数据搬运与访存（5）**
   - 图示：港口仓库与规则直达道路表示规则访存，分叉取货路径表示不规则访存。
   - 规则访存：`TLOAD`、`TSTORE`、`TPREFETCH`
   - 不规则访存：`MGATHER`、`MSCATTER`

2. **复杂变换计算（29）**
   - 图示：一座大型 Tile 加工中心，内部包含五个相互连通的小工位。
   - 初始化：`TEXPANDS`、`TCI`、`TTRI`、`TRANDOM`、`TFILLPAD`
   - 数据类型转换：`TCVT`、`TQUANT`、`TDEQUANT`
   - 布局变换：`TEXTRACT`、`TINSERT`、`TGATHER`、`TSCATTER`、`TCONCAT`、`TTRANS`、`TIMG2COL`、`TMOV`、`TGATHERB`、`TDEINTERLEAVE`、`TINTERLEAVE`、`TRESHAPE`
   - 排序：`TSORT32`、`TMRGSORT`、`THISTOGRAM`
   - Union 计算：`TPARTADD`、`TPARTMUL`、`TPARTMAX`、`TPARTMIN`、`TPARTARGMAX`、`TPARTARGMIN`

3. **系统与控制（7）**
   - 图示：控制塔、Tile 生命周期仓位和同步闸门组成一座运行控制中心。
   - 调试：`TASSIGN`、`TPRINT`
   - CV 通信：`TPUSH`、`TPOP`、`TALLOC`、`TFREE`
   - 同步：`SYNCALL`

4. **通信（9）**
   - 图示：两座 Tile 城市通过双向桥梁和独立异步通道交换货物与信号。
   - 同步通信：`TPUT`、`TGET`、`TBROADCAST`、`TREDUCE`、`TNOTIFY`、`TWAIT`、`TTEST`
   - 异步通信：`TPUT_ASYNC`、`TGET_ASYNC`

## 文字层级

- 海报标题：88–104 px，粗体。
- 一级分类：44–56 px，粗体。
- 子分类：28–34 px，中等字重。
- Opcode：26–32 px，等宽字体，按 1–3 列排列。
- 中文分类使用高对比度白色；opcode 使用浅青白色；子分类使用分类强调色。
- 最长指令名必须完整显示，不缩写、不裁切。

## 资产与记录

建议最终资产：

- `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-compute-v1.png`
- `assets/generated/pto-cheatsheet/pto-isa-cheatsheet-data-system-v1.png`
- `assets/generated/pto-cheatsheet/prompts.json`
- 可编辑的确定性文字与排版源文件，保存在同一目录的 `source/` 子目录。

Image Gen 输入中的用户参考图角色为“风格与构图参考”，不是编辑目标。两张图分别调用一次 Image Gen，生成结果不得依赖网络运行时资源。

## 验收标准

1. 恰好交付两张最终 3840×2160 PNG。
2. 11 个一级分类各有一个可辨识的立体卡通图示。
3. 两张图合计恰好出现 124 个 opcode，且与 `Sheet1!C2:C125` 逐字一致。
4. 每个 opcode 只出现一次，并位于正确分类与子分类中。
5. `TPOW`、`TPOWS` 不出现在本版海报中。
6. 在 1920×1080 等比缩放和原始 4K 尺寸下检查，无裁字、重叠或低对比度文本。
7. 两张海报的相机角度、光照、背景、卡片底座和字体系统保持一致。
8. Image Gen 不直接生成中文、opcode、公式、代码或技术标签。
9. 保存最终 prompt、输入图角色、用途与本地路径，满足项目素材追溯要求。
