import { MathUtils } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/** Bound the pan target without allocating vectors or changing the camera offset. */
export function clampPanTarget(camera, target, limit=650) {
  const x = MathUtils.clamp(target.x, -limit, limit);
  const y = MathUtils.clamp(target.y, 0, 150);
  const z = MathUtils.clamp(target.z, -limit, limit);
  if (x === target.x && y === target.y && z === target.z) return false;
  camera.position.x += x - target.x;
  camera.position.y += y - target.y;
  camera.position.z += z - target.z;
  target.set(x, y, z);
  return true;
}

export class CameraController {
  constructor(camera, canvas) {
    this.camera = camera;
    this.controls = new OrbitControls(camera, canvas);
    this.controls.enableDamping = true;

    // U0.8.1: smoother trackpad navigation.
    this.controls.zoomSpeed = 0.65;
    this.controls.rotateSpeed = 0.60;
    this.controls.panSpeed = 0.90;
    this.controls.zoomToCursor = false;
    this.controls.listenToKeyEvents(window);
    this.controls.dampingFactor = .12;
    this.controls.minDistance = 80;
    this.controls.maxDistance = 6000;
    this.controls.maxPolarAngle = Math.PI / 2.12;
    this.controls.screenSpacePanning = false;
    this.reset();
  }

  reset() {
    this.top = false;
    this.controls.target.set(0, 0, 0);
    this.camera.position.set(1250, 1250, 1500).multiplyScalar(Math.max(1, 1.3 / this.camera.aspect));
    this.controls.update();
  }

  toggleTop() {
    if (this.top) { this.reset(); return; }
    this.top = true;
    this.controls.target.set(0, 0, 0);
    this.camera.position.set(0, 2100 *
      ((this.worldSize||1200)/1200) /
      Math.min(1, this.camera.aspect), 0.1);
    this.controls.update();
  }

  update(delta) {
    const changed = this.controls.update(delta);
    const clamped = clampPanTarget(
      this.camera,
      this.controls.target,
      this.worldSize
       ?this.worldSize/2+50:650
    );
    return changed || clamped;
  }

  dispose() { this.controls.dispose(); }
}
