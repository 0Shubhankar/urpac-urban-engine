// Opt-in local diagnostics only: open ?diagnostics=1. Nothing is transmitted.
export function attachPerformanceCheck(engine) {
  const { view, camera } = engine;
  const panel = document.createElement('section');
  panel.style.cssText = 'position:fixed;left:20px;bottom:70px;max-height:65vh;overflow:auto;width:min(540px,90vw);padding:14px;background:#fffffff2;border:1px solid #bac7b5;border-radius:8px;z-index:10';
  const button = document.createElement('button');
  button.textContent = 'Run performance check';
  const output = document.createElement('pre');
  output.id = 'performance-results';
  output.style.cssText = 'white-space:pre-wrap;font-size:11px';
  output.textContent = 'Ready. Keep this tab visible during the 9-second check.';
  panel.append(button, output);
  document.body.append(panel);
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const round = n => Math.round(n * 10) / 10;
  const heap = () => performance.memory ? {
    usedMB: round(performance.memory.usedJSHeapSize / 1048576),
    allocatedMB: round(performance.memory.totalJSHeapSize / 1048576),
    note: 'Chromium approximate JS heap; excludes GPU and total browser memory.'
  } : { note: 'JS heap measurement unavailable in this browser.' };
  button.onclick = async () => {
    button.disabled = true;
    output.textContent = 'Running…';
    const originalRender = view.render;
    const originalUpdate = camera.update;
    let callbacks = 0, renders = 0, times = [], submit = [], recording = false;
    view.render = function () {
      const start = performance.now();
      originalRender.call(this);
      renders++;
      if (recording) { times.push(start); submit.push(performance.now() - start); }
    };
    camera.update = function () { callbacks++; return originalUpdate.call(this); };
    let hidden = document.hidden;
    const visibility = () => { if (document.hidden) hidden = true; };
    document.addEventListener('visibilitychange', visibility);
    try {
      camera.reset();
      camera.controls.autoRotate = true;
      engine.invalidate?.();
      await wait(1000);
      recording = true;
      const start = performance.now();
      await wait(5000);
      const elapsed = performance.now() - start;
      recording = false;
      camera.controls.autoRotate = false;
      await wait(1500); // Let orbit damping settle before the idle sample.
      const before = { callbacks, renders };
      await wait(1500);
      const intervals = times.slice(1).map((t, i) => t - times[i]).sort((a,b) => a-b);
      const gl = view.renderer.getContext();
      const debug = gl.getExtension('WEBGL_debug_renderer_info');
      const result = {
        date: new Date().toISOString(),
        viewport: { width: innerWidth, height: innerHeight, pixelRatio: view.renderer.getPixelRatio() },
        webglRenderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
        validForegroundSample: !hidden,
        activeOrbit: { durationMs: round(elapsed), frames: times.length, fps: round(times.length * 1000 / elapsed), p95FrameIntervalMs: round(intervals[Math.floor(intervals.length * .95)] || 0), meanCpuSubmitMs: round(submit.reduce((a,b)=>a+b,0) / Math.max(submit.length,1)) },
        idle1500ms: { callbacks: callbacks-before.callbacks, renders: renders-before.renders },
        scene: { drawCalls: view.renderer.info.render.calls, triangles: view.renderer.info.render.triangles, geometries: view.renderer.info.memory.geometries, textures: view.renderer.info.memory.textures },
        heap: heap(),
        note: 'One automated orbit sample, not a physical mobile or cross-browser certification. CPU submit time is not GPU time.'
      };
      output.textContent = JSON.stringify(result, null, 2);
      output.dataset.complete = 'true';
    } catch (error) { output.textContent = `Failed: ${error.message}`; }
    finally {
      recording = false;
      camera.controls.autoRotate = false;
      camera.update = originalUpdate;
      view.render = originalRender;
      document.removeEventListener('visibilitychange', visibility);
      button.disabled = false;
    }
  };
}
