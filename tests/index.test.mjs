import assert from 'node:assert/strict';
import test from 'node:test';
import * as api from '../dist/esm/index.js';
test('start and projection', () => {
  const s = api.transitionStopwatch(api.createStopwatch(), 'start', 100);
  assert.equal(api.elapsedAt(s, 350), 250);
});
test('pause and resume', () => {
  let s = api.transitionStopwatch(api.createStopwatch(), 'start', 100);
  s = api.transitionStopwatch(s, 'pause', 200);
  assert.equal(api.elapsedAt(s, 500), 100);
  s = api.transitionStopwatch(s, 'start', 500);
  assert.equal(api.elapsedAt(s, 600), 200);
});
test('lap snapshot', () => {
  const a = api.transitionStopwatch(api.createStopwatch(), 'start', 0),
    b = api.transitionStopwatch(a, 'lap', 50);
  assert.deepEqual(b.laps, [50]);
  assert.deepEqual(a.laps, []);
});
test('reset', () => {
  let s = api.transitionStopwatch(api.createStopwatch(), 'start', 0);
  s = api.transitionStopwatch(s, 'reset', 100);
  assert.equal(s.running, false);
  assert.equal(s.elapsedMs, 0);
});
test('monotonic and event validation', () => {
  assert.throws(() => api.transitionStopwatch(api.createStopwatch(), 'lap', 0));
  assert.throws(() => api.transitionStopwatch(api.createStopwatch(), 'bogus', 0));
  const s = api.transitionStopwatch(api.createStopwatch(), 'start', 10);
  assert.throws(() => api.elapsedAt(s, 9));
});
test('idempotent transition timeline', () => {
  let s = api.createStopwatch();
  for (let t = 0; t <= 100; t += 10) s = api.transitionStopwatch(s, 'start', t);
  assert.equal(api.elapsedAt(s, 150), 150);
  s = api.transitionStopwatch(s, 'pause', 150);
  s = api.transitionStopwatch(s, 'pause', 200);
  assert.equal(api.elapsedAt(s, 300), 150);
});
