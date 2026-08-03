const isPlainObject = value => {
  if (value === null || typeof value !== 'object') return false
  const prototype = Object.getPrototypeOf(value)
  return prototype === Object.prototype || prototype === null
}

export function canonicalizeStaticConfig(value, path = 'cfg') {
  if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) return value
  if (Array.isArray(value)) return value.map((entry, index) => canonicalizeStaticConfig(entry, `${path}[${index}]`))
  if (!isPlainObject(value)) throw new TypeError(`unsupported Static value at ${path}`)

  return Object.fromEntries(
    Object.keys(value)
      .sort((left, right) => left.localeCompare(right))
      .map(key => [key, canonicalizeStaticConfig(value[key], `${path}.${key}`)]),
  )
}

export function specializationKeyInput({
  templateName,
  sourceHash,
  staticParams,
  dependencyHashes = [],
  dialectVersion,
  runtimeAbi,
}) {
  return canonicalizeStaticConfig({
    agc_version: dialectVersion,
    dependency_hashes: [...dependencyHashes].sort(),
    runtime_abi: runtimeAbi,
    source_hash: sourceHash,
    static_params: staticParams,
    template: templateName,
  })
}

function fnv1a(text) {
  let hash = 0x811c9dc5
  for (const character of text) {
    hash ^= character.codePointAt(0)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

export function specializationKey(config) {
  return fnv1a(JSON.stringify(specializationKeyInput(config)))
}

export function elaborateNpuCity({ clusters, coresPerCluster, enableDma }) {
  if (!Number.isInteger(clusters) || clusters < 1) throw new RangeError('clusters must be a positive integer')
  if (!Number.isInteger(coresPerCluster) || coresPerCluster < 1) throw new RangeError('coresPerCluster must be a positive integer')

  const clusterInstances = Array.from({ length: clusters }, (_, index) => ({
    name: `cluster_${index}`,
    kind: 'cluster',
    specialization: `ComputeCluster__cores_${coresPerCluster}`,
    cores: Array.from({ length: coresPerCluster }, (_unused, core) => `core_${core}`),
  }))
  const dma = enableDma ? { name: 'dma0', kind: 'dma' } : null
  const modules = [
    { name: 'scheduler', kind: 'scheduler' },
    { name: 'shared_l2', kind: 'storage' },
    { name: 'cluster_bus', kind: 'bus' },
    { name: 'control_bus', kind: 'priority_bus' },
    ...clusterInstances,
    ...(dma ? [dma] : []),
  ]
  return { clusters: clusterInstances, dma, modules }
}

export const AGC_PIPELINE_STEPS = [
  { id: 'scan', label: 'Source Contract Scan', phase: 'Python frontend', detail: '检查入口文件、本地 import 与受限 Python 合同。' },
  { id: 'elaborate', label: 'JIT Elaboration', phase: 'Python frontend', detail: '执行 for、if、列表推导和模板调用，建造静态图。' },
  { id: 'specialize', label: 'Template Specialization', phase: 'Python frontend', detail: '按 Static 参数生成或复用特化模块。' },
  { id: 'manifest', label: 'Project Manifest', phase: 'Python frontend', detail: '记录确定的模块集合、依赖和入口。' },
  { id: 'verify', label: 'verify-static', phase: 'AGC IR', detail: '拒绝动态拓扑、非法端口和不稳定参数。' },
  { id: 'canonicalize', label: 'canonicalize', phase: 'AGC IR', detail: '统一属性顺序与等价表达。' },
  { id: 'resolve-ports', label: 'resolve-ports', phase: 'AGC IR', detail: '解析层级端口、数组端口与实例绑定。' },
  { id: 'materialize-queues', label: 'materialize-queues', phase: 'AGC IR', detail: '依据 link/bus 属性插入运行时 SimQueue。' },
  { id: 'connectivity', label: 'check-connectivity', phase: 'AGC IR', detail: '检查悬空、多驱动与方向错误。' },
  { id: 'capacity', label: 'check-capacity', phase: 'AGC IR', detail: '验证 Storage、Buffer 和队列容量约束。' },
  { id: 'bandwidth', label: 'normalize-bandwidth', phase: 'AGC IR', detail: '把端口、链路和总线带宽归一到统一单位。' },
  { id: 'lower', label: 'Target Lowering', phase: 'Backends', detail: '生成 C++ 仿真、行为级 SystemVerilog 或 RTL。' },
]
