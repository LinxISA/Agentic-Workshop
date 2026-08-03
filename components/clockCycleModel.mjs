const durationSeconds = Object.freeze({
  ps: 1e-12,
  ns: 1e-9,
  us: 1e-6,
  ms: 1e-3,
  s: 1,
  day: 86400,
})

const frequencyHertz = Object.freeze({ MHz: 1e6, GHz: 1e9 })

export function convertTimeToCycles({ duration, durationUnit, frequency, frequencyUnit }) {
  if (!Number.isFinite(duration) || duration <= 0) throw new RangeError('duration must be positive')
  if (!Number.isFinite(frequency) || frequency <= 0) throw new RangeError('frequency must be positive')
  if (!(durationUnit in durationSeconds)) throw new RangeError('unsupported duration unit')
  if (!(frequencyUnit in frequencyHertz)) throw new RangeError('unsupported frequency unit')

  const seconds = duration * durationSeconds[durationUnit]
  const hertz = frequency * frequencyHertz[frequencyUnit]
  return { seconds, hertz, cycles: seconds * hertz }
}

export function convertTimeDraft(input, previousResult) {
  if (input?.duration === '' || input?.frequency === '') return previousResult
  return convertTimeToCycles(input)
}
