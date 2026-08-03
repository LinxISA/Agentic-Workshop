export const ptoMachineOperations = Object.freeze([
  { op: 'TLOAD', semanticEffect: 'GM → Tile', gfsimEngine: 'TMA', normative: true, detail: '从 Global Memory 装入 Tile。' },
  { op: 'TMOV', semanticEffect: 'shape-matched Tile copy', gfsimEngine: 'Vector', normative: true, detail: '复制形状匹配的 Tile。' },
  { op: 'TEXTRACT', semanticEffect: 'Tile subregion extraction', gfsimEngine: 'Vector', normative: true, detail: '提取 Tile 子区域。' },
  { op: 'TPUSH', semanticEffect: 'producer → explicit handoff slot with capacity', gfsimEngine: 'Scalar', normative: true, detail: '生产者写入显式、有容量的交接槽。' },
  { op: 'TPOP', semanticEffect: 'explicit handoff slot with capacity → consumer', gfsimEngine: 'Scalar', normative: true, detail: '消费者从显式、有容量的交接槽读取。' },
  { op: 'TPUT', semanticEffect: 'GM → UB → GM · local → remote write', gfsimEngine: 'TMA', normative: false, detail: 'DaVinciOO 本地到远端写通信扩展。' },
  { op: 'TGET', semanticEffect: 'GM → UB → GM · remote → local read', gfsimEngine: 'TMA', normative: false, detail: 'DaVinciOO 远端到本地读通信扩展。' },
])
