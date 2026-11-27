import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSemitones, normalizeQualityPreset, schedulePitch } from '../chrome-extension/pitch-control.js';

test('normalizeSemitones clamps to the supported range', () => {
  assert.equal(normalizeSemitones(18), 12);
  assert.equal(normalizeSemitones(-18), -12);
  assert.equal(normalizeSemitones(4), 4);
});

test('normalizeQualityPreset only accepts the supported low-CPU preset', () => {
  assert.equal(normalizeQualityPreset('cheaper'), 'cheaper');
  assert.equal(normalizeQualityPreset('default'), 'default');
  assert.equal(normalizeQualityPreset('unexpected'), 'default');
});

test('normalizeSemitones handles invalid and fractional values safely', () => {
  assert.equal(normalizeSemitones('not-a-number'), 0);
  assert.equal(normalizeSemitones(undefined), 0);
  assert.equal(normalizeSemitones(2.7), 3);
});

test('schedulePitch awaits the engine latency before scheduling semitones', async () => {
  const calls = [];
  const engine = {
    latency: async () => 0.12,
    schedule: value => { calls.push(value); return Promise.resolve(); }
  };
  const context = { currentTime: 10 };
  await schedulePitch(engine, -3, context);
  assert.deepEqual(calls, [{ semitones: -3, output: 10.12, formantCompensation: false, formantBaseHz: 0 }]);
});

test('schedulePitch can enable formant compensation when explicitly requested', async () => {
  let scheduled;
  const engine = { latency: async () => 0, schedule: value => { scheduled = value; } };
  await schedulePitch(engine, 2, { currentTime: 4 }, true);
  assert.equal(scheduled.formantCompensation, true);
});

test('schedulePitch rejects missing engine or context instead of failing silently', async () => {
  await assert.rejects(schedulePitch(null, 1, { currentTime: 0 }), /engine/i);
  await assert.rejects(schedulePitch({ schedule() {}, latency() { return 0; } }, 1, null), /audio context/i);
});

test('schedulePitch reuses a cached latency without another worklet round trip', async () => {
  let latencyCalls = 0;
  let scheduled;
  const engine = { latency: async () => { latencyCalls += 1; return 0.5; }, schedule: value => { scheduled = value; } };
  await schedulePitch(engine, 1, { currentTime: 2 }, true, 0.08);
  assert.equal(latencyCalls, 0);
  assert.equal(scheduled.output, 2.08);
});
