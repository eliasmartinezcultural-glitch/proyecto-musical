export function normalizeSemitones(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(Math.max(-12, Math.min(12, numeric)));
}

export async function schedulePitch(engine, value, audioContext, preserveFormants = true) {
  if (!engine || typeof engine.schedule !== 'function' || typeof engine.latency !== 'function') {
    throw new TypeError('Pitch engine is required');
  }
  if (!audioContext || !Number.isFinite(audioContext.currentTime)) {
    throw new TypeError('Audio context is required');
  }
  const semitones = normalizeSemitones(value);
  const latencyValue = await engine.latency();
  const latency = Math.max(0, Number(latencyValue) || 0);
  return await engine.schedule({
    semitones,
    output: audioContext.currentTime + latency,
    formantCompensation: Boolean(preserveFormants),
    formantBaseHz: 0
  });
}
