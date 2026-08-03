const positiveFields = [
  'dataBytes',
  'tileCapacityBytes',
  'sourceBandwidthBytesPerCycle',
  'linkBandwidthBytesPerCycle',
  'destinationBandwidthBytesPerCycle',
]

const cycleCostFields = ['setupCycles', 'queueCycles', 'synchronizationCycles']

export function calculateTransferTime(input) {
  for (const field of positiveFields) {
    if (!Number.isFinite(input?.[field]) || input[field] <= 0) throw new RangeError(`${field} must be positive`)
  }
  for (const field of cycleCostFields) {
    if (!Number.isFinite(input?.[field]) || input[field] < 0) throw new RangeError(`${field} must be non-negative`)
  }

  const chunks = Math.ceil(input.dataBytes / input.tileCapacityBytes)
  const effectiveBandwidthBytesPerCycle = Math.min(
    input.sourceBandwidthBytesPerCycle,
    input.linkBandwidthBytesPerCycle,
    input.destinationBandwidthBytesPerCycle,
  )
  const intrinsicCycles = chunks * input.setupCycles + Math.ceil(input.dataBytes / effectiveBandwidthBytesPerCycle)
  const totalCycles = intrinsicCycles + input.queueCycles + input.synchronizationCycles

  return { chunks, effectiveBandwidthBytesPerCycle, intrinsicCycles, totalCycles }
}
