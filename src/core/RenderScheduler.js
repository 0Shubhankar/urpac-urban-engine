/** Coalesces invalidations and stops requesting frames when damping has settled. */
export class RenderScheduler {
  constructor(step, request = requestAnimationFrame, cancel = cancelAnimationFrame) {
    this.step = step;
    this.request = request;
    this.cancel = cancel;
    this.pending = null;
    this.disposed = false;
    this.tick = time => {
      this.pending = null;
      if (this.disposed) return;
      if (this.step(time)) this.invalidate();
    };
  }

  invalidate() {
    if (!this.disposed && this.pending === null) {
      this.pending = this.request(this.tick);
    }
  }

  suspend() {
    if (this.pending !== null) this.cancel(this.pending);
    this.pending = null;
  }

  dispose() {
    this.suspend();
    this.disposed = true;
  }
}
