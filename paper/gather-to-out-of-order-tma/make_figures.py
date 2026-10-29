#!/usr/bin/env python3
"""Generate the four editable SVG figures used by the Gather article."""

from pathlib import Path
from xml.sax.saxutils import escape

OUT = Path(__file__).resolve().parent
W, H = 1600, 900
NAVY = "#17324D"
BLUE = "#2F6B9A"
CYAN = "#DDF3F2"
TEAL = "#168C84"
AMBER = "#F0A640"
PALE_AMBER = "#FFF2D8"
PALE_BLUE = "#E8F1F8"
INK = "#203040"
MUTED = "#657788"
LIGHT = "#F5F8FA"
GRID = "#C7D2DC"
RED = "#C8554D"
FONT = "PingFang SC, Noto Sans CJK SC, Microsoft YaHei, Arial, sans-serif"


def text(x, y, value, size=26, color=INK, weight=400, anchor="start", extra=""):
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="{weight}" fill="{color}" text-anchor="{anchor}" {extra}>'
            f'{escape(value)}</text>')


def multiline(x, y, lines, size=24, color=INK, weight=400, leading=1.35, anchor="start"):
    spans = []
    for i, line in enumerate(lines):
        dy = 0 if i == 0 else size * leading
        spans.append(f'<tspan x="{x}" dy="{dy}">{escape(line)}</tspan>')
    return (f'<text x="{x}" y="{y}" font-family="{FONT}" font-size="{size}" '
            f'font-weight="{weight}" fill="{color}" text-anchor="{anchor}">' + "".join(spans) + '</text>')


def rect(x, y, w, h, fill="white", stroke=GRID, sw=2, rx=12, extra=""):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" {extra}/>'


def line(x1, y1, x2, y2, color=NAVY, sw=3, dash=None, marker=False):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = ' marker-end="url(#arrow)"' if marker else ""
    return f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{sw}"{d}{m}/>'


def pill(x, y, w, label, fill=PALE_BLUE, color=NAVY):
    return rect(x, y, w, 42, fill, "none", 0, 21) + text(x + w / 2, y + 29, label, 20, color, 600, "middle")


def base(title, subtitle):
    return [
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
        '<defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth"><path d="M0,0 L0,6 L9,3 z" fill="#17324D"/></marker></defs>',
        rect(0, 0, W, H, "#FFFFFF", "none", 0, 0),
        rect(40, 34, 12, 82, TEAL, "none", 0, 6),
        text(76, 74, title, 38, NAVY, 700),
        text(76, 108, subtitle, 22, MUTED, 400),
    ]


def finish(parts, note):
    parts += [line(50, 840, 1550, 840, GRID, 1), text(800, 875, note, 18, MUTED, 400, "middle"), '</svg>']
    return "\n".join(parts)


def sector_figure():
    p = base("同样 128B 有效数据，可能对应完全不同的存储服务量", "32 个线程各读取一个自然对齐的 4B 元素；下图按 32B Sector 计数")
    p += [rect(50, 150, 730, 650, LIGHT, "#D9E2EA", 2, 20), rect(820, 150, 730, 650, LIGHT, "#D9E2EA", 2, 20)]
    p += [pill(82, 176, 164, "连续访问", CYAN, TEAL), text(82, 254, "32 个线程 → 4 个 Sector", 30, NAVY, 700)]
    # 4 sectors, each with 8 four-byte words.
    sx, sy, cw, ch = 82, 308, 19, 64
    for sector in range(4):
        x = sx + sector * (8 * cw + 12)
        p += [text(x + 4 * cw, sy - 18, f"S{sector}", 18, MUTED, 600, "middle")]
        for word in range(8):
            p += [rect(x + word * cw, sy, cw - 2, ch, TEAL, "white", 1, 2)]
    p += [text(82, 424, "覆盖 4 × 32B = 128B", 25, INK, 600), text(82, 462, "有效载荷 128B / 覆盖 128B = 100%", 23, TEAL, 700)]
    p += [rect(82, 520, 650, 174, "white", "#BDD6D3", 2, 14), text(112, 566, "合并机会", 22, TEAL, 700), multiline(112, 605, ["多个线程的地址落在相邻字中，", "硬件可以用少量 Sector 事务覆盖。"], 22, INK)]

    p += [pill(852, 176, 210, "每线程独占 Sector", PALE_AMBER, "#9C6500"), text(852, 254, "32 个线程 → 32 个 Sector", 30, NAVY, 700)]
    gx, gy, bw, bh = 852, 298, 76, 42
    for i in range(32):
        row, col = divmod(i, 8)
        x, y = gx + col * 82, gy + row * 52
        p += [rect(x, y, bw, bh, "#FDE3B5", "#D99B31", 1.5, 6), rect(x + 5, y + 8, 9, 26, AMBER, "none", 0, 2)]
    p += [text(852, 550, "覆盖 32 × 32B = 1024B", 25, INK, 600), text(852, 588, "有效载荷 128B / 覆盖 1024B = 12.5%", 23, "#9C6500", 700)]
    p += [rect(852, 634, 650, 108, "white", "#E6C486", 2, 14), text(882, 676, "8× 是 Sector 覆盖量的放大，不是执行时间的固定倍数。", 21, RED, 700), text(882, 712, "Cache 命中、并发请求能力与依赖链仍会改变实际延迟。", 20, INK, 400)]
    return finish(p, "简化示意：起始地址满足 32B 对齐，32 个线程均活跃；实际事务还受缓存层级与架构规则影响。")


def banks_figure():
    p = base("SRAM Bank 冲突：指令一次给出四个地址，不等于四个地址能同时服务", "左侧比较服务下界，右侧说明为什么 32×33 Padding 能打散按列访问")
    p += [rect(50, 150, 950, 650, LIGHT, "#D9E2EA", 2, 20), rect(1030, 150, 520, 650, LIGHT, "#D9E2EA", 2, 20)]
    p += [pill(82, 176, 270, "不同 Bank：理想 1 周期", CYAN, TEAL)]
    # parallel bank request diagram
    for i in range(4):
        y = 250 + i * 82
        p += [rect(90, y, 124, 50, PALE_BLUE, BLUE, 2, 10), text(152, y + 33, f"请求 R{i}", 20, NAVY, 600, "middle"),
              line(220, y + 25, 326, y + 25, NAVY, 2.5, marker=True), rect(340, y, 148, 50, CYAN, TEAL, 2, 10), text(414, y + 33, f"Bank {i}", 20, TEAL, 700, "middle")]
    p += [rect(535, 226, 405, 360, "white", "#D7E0E7", 2, 14), pill(565, 246, 320, "同一 Bank：理想 4 周期", PALE_AMBER, "#9C6500")]
    for i in range(4):
        y = 318 + i * 54
        p += [rect(565, y, 112, 40, PALE_BLUE, BLUE, 1.5, 8), text(621, y + 27, f"R{i}", 18, NAVY, 600, "middle"), line(682, y + 20, 758, y + 20, AMBER, 2.2, marker=True)]
    p += [rect(775, 318, 130, 202, PALE_AMBER, AMBER, 2, 10), text(840, 352, "Bank 0", 22, "#9C6500", 700, "middle")]
    for i in range(4):
        p += [rect(798, 372 + i * 34, 84, 26, "white", "#E1B760", 1, 4), text(840, 391 + i * 34, f"word {i}", 15, INK, 500, "middle")]
    p += [rect(82, 632, 858, 110, "white", "#D7E0E7", 2, 14), text(112, 674, "服务下界", 21, NAVY, 700), text(112, 712, "Cycles ≥ maxᵦ ⌈nᵦ / rᵦ⌉；此例每个 Bank 每周期最多读 1 个不同 Word。", 22, INK, 500)]

    p += [pill(1062, 176, 224, "Padding 改变映射", PALE_BLUE, NAVY), text(1062, 250, "简化模型", 22, MUTED, 600), text(1062, 288, "32 Bank / 4B Word", 25, NAVY, 700)]
    p += [rect(1062, 330, 456, 102, "white", "#C9D8E5", 2, 12), text(1290, 372, "bank = (row × stride + col) mod 32", 21, NAVY, 600, "middle"), text(1290, 408, "固定 col = 0，观察连续四行", 18, MUTED, 400, "middle")]
    p += [text(1080, 492, "32 × 32", 22, RED, 700), text(1212, 492, "→", 24, MUTED, 700), text(1270, 492, "0, 0, 0, 0", 24, RED, 700)]
    p += [text(1080, 554, "32 × 33", 22, TEAL, 700), text(1212, 554, "→", 24, MUTED, 700), text(1270, 554, "0, 1, 2, 3", 24, TEAL, 700)]
    # small column banks
    for i, color in enumerate([TEAL, BLUE, AMBER, "#7D68A8"]):
        p += [rect(1080 + i * 100, 604, 72, 72, color, "white", 2, 10), text(1116 + i * 100, 648, str(i), 24, "white", 700, "middle")]
    p += [multiline(1062, 724, ["重复地址广播不在本例中；", "Group 通路与读写混合约束也未展开。"], 18, MUTED)]
    return finish(p, "公式是教学用简化映射；真实 NPU/GPU 的 Bank、Group、Subbank 与端口规则必须按具体代际核对。")


def blocks_figure():
    p = base("块间离散、块内连续：不要把可利用的结构压扁成一串 Scalar Index", "索引 [1, 6, 3] 选择相距较远的 KV 条目，每个条目内部仍是一段连续向量")
    p += [rect(50, 150, 960, 650, LIGHT, "#D9E2EA", 2, 20), rect(1040, 150, 510, 650, LIGHT, "#D9E2EA", 2, 20)]
    p += [pill(82, 176, 190, "压缩 KV 存储", PALE_BLUE, NAVY), pill(1120, 176, 180, "紧凑 Buffer", CYAN, TEAL)]
    # entries rows
    colors = ["#B8D5EA", "#64B8B0", "#B8D5EA", "#F0B45B", "#B8D5EA", "#B8D5EA", "#547DA3", "#B8D5EA"]
    selected = {1: "①", 6: "②", 3: "③"}
    for i in range(8):
        y = 242 + i * 60
        sel = i in selected
        p += [text(94, y + 33, f"KV[{i}]", 18, NAVY if sel else MUTED, 700 if sel else 400)]
        for j in range(8):
            p += [rect(190 + j * 71, y, 64, 42, colors[i], "white", 1, 5)]
        if sel:
            p += [text(800, y + 32, selected[i], 26, colors[i], 700, "middle"), text(836, y + 31, "连续向量", 18, INK, 600)]
    p += [rect(720, 202, 240, 498, "none", AMBER, 2, 12, 'stroke-dasharray="8 8"'), text(840, 730, "块内连续", 22, "#9C6500", 700, "middle")]
    p += [text(120, 754, "块间离散：KV[1] → KV[6] → KV[3]", 24, RED, 700)]

    # arrows and compact buffer
    p += [line(972, 320, 1100, 320, NAVY, 3, marker=True), text(1035, 268, "保持索引顺序", 17, MUTED, 600, "middle")]
    out_rows = [("KV[1]", colors[1]), ("KV[6]", colors[6]), ("KV[3]", colors[3])]
    for i, (label, color) in enumerate(out_rows):
        y = 264 + i * 90
        p += [text(1080, y + 35, label, 18, NAVY, 700)]
        for j in range(8):
            p += [rect(1168 + j * 37, y, 33, 48, color, "white", 1, 5)]
    p += [line(1285, 524, 1285, 592, NAVY, 3, marker=True), rect(1130, 610, 310, 88, PALE_AMBER, AMBER, 2, 16), text(1285, 648, "Attention", 27, NAVY, 700, "middle"), text(1285, 680, "消费选中条目", 18, MUTED, 400, "middle")]
    p += [rect(1070, 724, 450, 54, "white", "#D7E0E7", 1.5, 10), text(1295, 758, "融合实现可以直接消费，不必物化此 Buffer。", 18, INK, 500, "middle")]
    return finish(p, "概念示意，不代表某个具体模型的真实维度、条目宽度或物理布局；关键是保留“选择条目 + 条目内连续段”的结构。")


def versions_figure():
    p = base("乱序 TMA：参数必须绑定操作版本，数据就绪与参数稳定要分别判断", "程序顺序 A → B；在无内存顺序冲突且 B 数据先就绪时，B 可以先发射，A 仍必须使用 V1")
    p += [rect(50, 150, 1500, 650, LIGHT, "#D9E2EA", 2, 20)]
    # stages
    stages = [(110, "参数绑定"), (390, "就绪判断"), (670, "搬运"), (930, "完成 / 可见性"), (1250, "引用 / 存储回收")]
    for x, label in stages:
        p += [pill(x, 180, 200 if x != 930 else 230, label, PALE_BLUE if x not in (670, 930) else CYAN, NAVY if x != 670 else TEAL)]
    for x in [350, 630, 890, 1210]:
        p += [line(x, 202, x + 28, 202, NAVY, 2.5, marker=True)]
    # lanes
    p += [text(88, 304, "TMA A", 26, NAVY, 700), text(88, 536, "TMA B", 26, NAVY, 700), line(210, 280, 1450, 280, GRID, 1), line(210, 512, 1450, 512, GRID, 1)]
    # A nodes
    p += [rect(110, 326, 210, 92, PALE_BLUE, BLUE, 2, 14), text(215, 362, "绑定 V1", 24, NAVY, 700, "middle"), text(215, 394, "Base/Shape/Stride…", 16, MUTED, 400, "middle")]
    p += [line(320, 372, 402, 372, NAVY, 2.5, marker=True), rect(416, 326, 200, 92, PALE_AMBER, AMBER, 2, 14), text(516, 360, "数据未就绪", 23, "#9C6500", 700, "middle"), text(516, 394, "保留 V1", 18, MUTED, 500, "middle")]
    p += [line(616, 372, 746, 372, NAVY, 2.5, dash="8 7", marker=True), rect(760, 326, 180, 92, CYAN, TEAL, 2, 14), text(850, 360, "后发射 A", 23, TEAL, 700, "middle"), text(850, 394, "仍读取 V1", 18, NAVY, 600, "middle")]
    p += [line(940, 372, 1014, 372, NAVY, 2.5, marker=True), rect(1028, 326, 190, 92, "white", TEAL, 2, 14), text(1123, 360, "按契约完成", 22, NAVY, 700, "middle"), text(1123, 394, "并建立可见性", 17, MUTED, 400, "middle")]
    p += [line(1218, 372, 1302, 372, NAVY, 2.5, dash="7 6", marker=True), rect(1316, 326, 160, 92, LIGHT, GRID, 2, 14), text(1396, 360, "示例：释放 V1", 19, NAVY, 700, "middle"), text(1396, 394, "引用归零后", 16, MUTED, 400, "middle")]
    # B nodes
    p += [rect(110, 558, 210, 92, PALE_BLUE, BLUE, 2, 14), text(215, 594, "绑定 V2", 24, NAVY, 700, "middle"), text(215, 626, "独立于 V1", 17, MUTED, 400, "middle")]
    p += [line(320, 604, 402, 604, NAVY, 2.5, marker=True), rect(416, 558, 200, 92, CYAN, TEAL, 2, 14), text(516, 592, "数据已就绪", 23, TEAL, 700, "middle"), text(516, 626, "且无顺序冲突", 17, MUTED, 500, "middle")]
    p += [line(616, 604, 746, 604, NAVY, 2.5, marker=True), rect(760, 558, 180, 92, CYAN, TEAL, 2, 14), text(850, 592, "先发射 B", 23, TEAL, 700, "middle"), text(850, 626, "读取 V2", 18, NAVY, 600, "middle")]
    p += [line(940, 604, 1014, 604, NAVY, 2.5, marker=True), rect(1028, 558, 190, 92, "white", TEAL, 2, 14), text(1123, 592, "按契约完成", 22, NAVY, 700, "middle"), text(1123, 626, "并建立可见性", 17, MUTED, 400, "middle")]
    p += [line(1218, 604, 1302, 604, NAVY, 2.5, dash="7 6", marker=True), rect(1316, 558, 160, 92, LIGHT, GRID, 2, 14), text(1396, 592, "示例：释放 V2", 19, NAVY, 700, "middle"), text(1396, 626, "引用归零后", 16, MUTED, 400, "middle")]
    # key point box
    p += [rect(110, 684, 1366, 112, "white", "#E2B65D", 2, 14), text(136, 718, "关键：", 21, "#9C6500", 700), text(216, 718, "参数版本稳定 ≠ 输入数据就绪；版本生命周期取决于参数何时被安全捕获。", 20, INK, 600), text(216, 750, "本图示例将引用保留到搬运完成；若参数已安全捕获，Descriptor 存储可以更早回收。", 19, NAVY, 600), text(216, 780, "此图只表达允许的依赖关系，不代表实测周期或某款产品的具体队列实现。", 17, MUTED, 400)]
    return finish(p, "“B 先于 A”需要同时满足数据依赖、内存顺序、资源与异常语义；版本绑定只解决参数不会被后续配置覆盖的问题。")


FIGURES = {
    "sector.svg": sector_figure,
    "banks.svg": banks_figure,
    "blocks.svg": blocks_figure,
    "versions.svg": versions_figure,
}


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, build in FIGURES.items():
        (OUT / name).write_text(build(), encoding="utf-8")


if __name__ == "__main__":
    main()
