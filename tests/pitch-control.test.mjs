import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeSemitones, schedulePitch } from '../chrome-extension/pitch-control.js';

test('normalizeSemitones clamps to the supported range', () => {
  assert.equal(normalizeSemitones(18), 12);
  assert.equal(normalizeSemitones(-18), -12);
  assert.equal(normalizeSemitones(4), 4);
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
  assert.deepEqual(calls, [{ semitones: -3, output: 10.12, formantCompensation: true, formantBaseHz: 0 }]);
});

test('schedulePitch can disable formant compensation for full-band mixes', async () => {
  let scheduled;
  const engine = { latency: async () => 0, schedule: value => { scheduled = value; } };
  await schedulePitch(engine, 2, { currentTime: 4 }, false);
  assert.equal(scheduled.formantCompensation, false);
});

test('schedulePitch rejects missing engine or context instead of failing silently', async () => {
  await assert.rejects(schedulePitch(null, 1, { currentTime: 0 }), /engine/i);
  await assert.rejects(schedulePitch({ schedule() {}, latency() { return 0; } }, 1, null), /audio context/i);
});
