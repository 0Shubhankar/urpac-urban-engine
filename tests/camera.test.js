import test from 'node:test';
import assert from 'node:assert/strict';
import { Vector3 } from 'three';
import { clampPanTarget } from '../src/renderer/CameraController.js';

test('pan clamp preserves camera offset and detects change on all axes', () => {
  const target = new Vector3(900, -80, -900);
  const camera = { position: new Vector3(1200, 400, -200) };
  const offset = camera.position.clone().sub(target);
  assert.equal(clampPanTarget(camera, target), true);
  assert.deepEqual(target.toArray(), [650, 0, -650]);
  assert.deepEqual(camera.position.clone().sub(target).toArray(), offset.toArray());
  assert.equal(clampPanTarget(camera, target), false);
});
