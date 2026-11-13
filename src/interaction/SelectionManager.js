import * as THREE from 'three';

export class SelectionManager {
  constructor(view, onSelect) {
    this.view = view;
    this.onSelect = onSelect;
    this.raycaster = new THREE.Raycaster();
    this.pointers = new Set();
    this.hitPoint = new THREE.Vector3();
    // One conservative envelope per building; avoid raycasting thousands of windows.
    this.targets = view.state.buildings.map(building => {
      const { x, z } = building.position;
      const { width, depth, height } = building.dimensions;
      return { building, bounds: new THREE.Box3(
        new THREE.Vector3(x - width / 2 - 2, 3, z - depth / 2 - 2),
        new THREE.Vector3(x + width / 2 + 2, height + (building.type === 'house' ? 13 : 9), z + depth / 2 + 3)
      ) };
    });
    const canvas = view.renderer.domElement;
    this.down = event => {
      this.pointers.add(event.pointerId);
      if (this.pointers.size > 1) this.cancelled = true;
      else {
        this.start = { x: event.clientX, y: event.clientY };
        this.cancelled =
          event.button !== 0 ||
          event.shiftKey ||
          event.ctrlKey ||
          event.metaKey ||
          event.altKey;
      }
    };
    this.move = event => {
      if (this.start && Math.hypot(event.clientX - this.start.x, event.clientY - this.start.y) > 5) this.cancelled = true;
    };
    this.up = event => {
      this.pointers.delete(event.pointerId);
      const start = this.start;
      if (this.pointers.size === 0) this.start = null;
      if (event.button !== 0 || this.cancelled || !start) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      view.camera.updateMatrixWorld();
      this.raycaster.setFromCamera(new THREE.Vector2(
        (event.clientX - rect.left) / rect.width * 2 - 1,
        -(event.clientY - rect.top) / rect.height * 2 + 1
      ), view.camera);
      let selected, distance = Infinity;
      for (const target of this.targets) {
        if (this.raycaster.ray.intersectBox(target.bounds, this.hitPoint)) {
          const candidate = this.hitPoint.distanceToSquared(this.raycaster.ray.origin);
          if (candidate < distance) { distance = candidate; selected = target.building; }
        }
      }
      view.highlight(selected);
      onSelect(selected);
    };
    this.cancel = () => { this.cancelled = true; this.start = null; this.pointers.clear(); };
    this.handlers = { pointerdown: this.down, pointermove: this.move, pointerup: this.up, pointercancel: this.cancel };
    for (const [type, fn] of Object.entries(this.handlers)) canvas.addEventListener(type, fn);
  }

  dispose() {
    for (const [type, fn] of Object.entries(this.handlers)) this.view.renderer.domElement.removeEventListener(type, fn);
  }
}
