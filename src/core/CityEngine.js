import { createCityState } from './CityState.js';
import { CityRenderer } from '../renderer/CityRenderer.js';
import { CameraController } from '../renderer/CameraController.js';
import { SelectionManager } from '../interaction/SelectionManager.js';
import { RenderScheduler } from './RenderScheduler.js';

export class CityEngine {
  constructor(container, config, onSelect) {
    this.state = createCityState(config);
    this.view = new CityRenderer(container, this.state);
    this.camera = new CameraController(this.view.camera, this.view.renderer.domElement);
    this.selection = new SelectionManager(this.view, onSelect);
    let previousTime = null;
    this.scheduler = new RenderScheduler(time => {
      if (document.hidden) { previousTime = null; return false; }
      const delta = previousTime === null ? 1 / 60 : Math.min((time - previousTime) / 1000, 0.1);
      previousTime = time;
      const changed = this.camera.update(delta);
      if (changed || this.view.dirty) this.view.render();
      if (!changed && !this.camera.controls.autoRotate) previousTime = null;
      return changed || this.camera.controls.autoRotate;
    });
    this.invalidate = () => {
      this.view.dirty = true;
      this.scheduler.invalidate();
    };
    this.view.onInvalidate = this.invalidate;
    this.camera.controls.addEventListener('change', this.invalidate);
    this.visibility = () => {
      if (document.hidden) this.scheduler.suspend();
      else this.invalidate();
    };
    document.addEventListener('visibilitychange', this.visibility);
    this.invalidate();
  }

  dispose() {
    this.scheduler.dispose();
    document.removeEventListener('visibilitychange', this.visibility);
    this.camera.controls.removeEventListener('change', this.invalidate);
    this.view.onInvalidate = null;
    this.selection.dispose();
    this.camera.dispose();
    this.view.dispose();
  }
}
