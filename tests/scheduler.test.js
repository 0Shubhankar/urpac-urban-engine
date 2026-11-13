import test from 'node:test';
import assert from 'node:assert/strict';
import { RenderScheduler } from '../src/core/RenderScheduler.js';

function harness(step) {
  let next = 0;
  const queue = new Map();
  const scheduler = new RenderScheduler(step, fn => { queue.set(++next, fn); return next; }, id => queue.delete(id));
  return { scheduler, queue, flush() { const [id, fn] = queue.entries().next().value; queue.delete(id); fn(16 * id); } };
}

test('repeated invalidations coalesce; stable view has no idle callbacks', () => {
  let renders = 0;
  const h = harness(() => { renders++; return false; });
  h.scheduler.invalidate(); h.scheduler.invalidate(); h.scheduler.invalidate();
  assert.equal(h.queue.size, 1);
  h.flush();
  assert.equal(renders, 1);
  assert.equal(h.queue.size, 0);
});

test('damping continues only while state changes', () => {
  let frames = 0;
  const h = harness(() => ++frames < 4);
  h.scheduler.invalidate();
  while (h.queue.size) h.flush();
  assert.equal(frames, 4);
  assert.equal(h.queue.size, 0);
});

test('suspend and disposal cancel frames; disposed engine cannot resume', () => {
  const h = harness(() => true);
  h.scheduler.invalidate(); h.scheduler.suspend();
  assert.equal(h.queue.size, 0);
  h.scheduler.invalidate(); assert.equal(h.queue.size, 1);
  h.scheduler.dispose(); h.scheduler.invalidate();
  assert.equal(h.queue.size, 0);
});
