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

test('schedulePitch sends semitones at the engine latency compensation point', () => {
  const calls = [];
  const engine = {
    latency: () => 0.12,
    schedule: value => { calls.push(value); return Promise.resolve(); }
  };
  const context = { currentTime: 10 };
  schedulePitch(engine, -3, context);
  assert.deepEqual(calls, [{ semitones: -3, output: 10.12, formantCompensation: true, formantBaseHz: 0 }]);
});

test('schedulePitch rejects missing engine or context instead of failing silently', () => {
  assert.throws(() => schedulePitch(null, 1, { currentTime: 0 }), /engine/i);
  assert.throws(() => schedulePitch({ schedule() {} }, 1, null), /audio context/i);
});
