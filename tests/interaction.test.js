import test from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera } from 'three';
import { CityRenderer } from '../src/renderer/CityRenderer.js';
import { SelectionManager } from '../src/interaction/SelectionManager.js';

test('resize skips duplicate and zero-sized viewports; valid resize invalidates once', () => {
  let calls = 0, projections = 0, invalidations = 0;
  const view = { camera: { updateProjectionMatrix() { projections++; } }, renderer: { setSize() { calls++; } }, onInvalidate() { invalidations++; } };
  let rect = { width: 800, height: 600 };
  const container = { getBoundingClientRect: () => rect };
  const resize = () => CityRenderer.prototype.resize.call(view, container);
  resize(); resize();
  rect = { width: 0, height: 0 }; resize();
  assert.equal(calls, 1);
  rect = { width: 390, height: 844 }; resize();
  assert.equal(calls, 2); assert.equal(projections, 2); assert.equal(invalidations, 2);
  assert.equal(view.camera.aspect, 390 / 844);
});

test('selection recognizes click, rejects drag, right click and multitouch, and disposes listeners', () => {
  const canvas = new EventTarget();
  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 100 });
  const camera = new PerspectiveCamera(40, 1, 1, 1000);
  camera.position.set(0, 15, 100); camera.lookAt(0, 15, 0);
  const building = { id: 'a', type: 'office', position: { x: 0, z: 0 }, dimensions: { width: 20, depth: 20, height: 30 } };
  const selected = [];
  const manager = new SelectionManager({ renderer: { domElement: canvas }, camera, state: { buildings: [building] }, highlight() {} }, b => selected.push(b));
  function send(type, id = 1, button = 0, x = 50) {
    const event = new Event(type); Object.assign(event, { pointerId: id, button, clientX: x, clientY: 50 }); canvas.dispatchEvent(event);
  }
  send('pointerdown'); send('pointerup'); assert.equal(selected[0], building);
  send('pointerdown'); send('pointermove', 1, 0, 65); send('pointerup');
  send('pointerdown', 1, 2); send('pointerup', 1, 2);
  send('pointerdown'); send('pointerdown', 2); send('pointerup', 2); send('pointerup');
  assert.equal(selected.length, 1);
  send('pointerdown'); send('pointerup'); assert.equal(selected.length, 2);
  manager.dispose(); send('pointerdown'); send('pointerup'); assert.equal(selected.length, 2);
});
