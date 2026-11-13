# U0.1 performance review candidate 1

## Evidence

The original source was preserved. No measured frame-rate improvement is claimed. Camera pan clamp previously allocated three temporary vectors per update; the replacement uses scalar bounds. Diagnostic instrumentation previously dropped the time delta passed to OrbitControls, invalidating its intended time-normalized orbit comparison. Resize work is avoided for duplicate and zero-area observations. Unit tests exercise pan bounds, resize and selection event logic using a mock canvas and real Three.js camera. This is not a real-device interaction test.

## Local acceptance procedure (Mac)

Extract this archive into a separate test directory; leave the current working copy intact. Open Terminal in the extracted UUE_v0.1 folder and run:

```sh
npm ci
npm test
npm run build
npm run dev
```

Open the development URL printed by Vite with `?diagnostics=1` appended (normally http://127.0.0.1:5173/?diagnostics=1). In a visible foreground tab click **Run performance check**, keep the tab visible and avoid input until the JSON appears. Save the output. Repeat three times at the same viewport size, preferably with the original working copy for comparison. Record browser version, device, power mode, and display resolution. Compare active FPS, p95 frame interval, CPU submission time, draw calls, triangles and idle callback/render counts. Idle counts should be zero once motion settles. JS heap is approximate and excludes GPU and total browser memory; record browser process memory separately if available.

Manually verify orbit, scroll zoom, right-drag pan, reset, top-down, selection after drag, selection after resize, fullscreen enter/exit, and return via browser back/forward. Test touch orbit/pinch/pan and selection on a physical phone using a locally accessible dev server or static deployment. Record actual device and results. Do not certify performance from simulated mobile viewport alone.

Targets: 50–60 FPS desktop, approximately 30 FPS mobile, below 300 MB browser memory where practical, production payload below 10 MB. These are targets, not observed values. Do not advance to U0.2 before reviewing the evidence.

## Automated test output

```text

> urpac-urban-engine@0.1.0 test
> node --test

TAP version 13
# Subtest: pan clamp preserves camera offset and detects change on all axes
ok 1 - pan clamp preserves camera offset and detects change on all axes
  ---
  duration_ms: 8.900304
  type: 'test'
  ...
# Subtest: seed reproduces complete JSON state
ok 2 - seed reproduces complete JSON state
  ---
  duration_ms: 9.279071
  type: 'test'
  ...
# Subtest: 132 unique buildings with required types and complete metadata
ok 3 - 132 unique buildings with required types and complete metadata
  ---
  duration_ms: 1.881797
  type: 'test'
  ...
# Subtest: building envelopes including details clear roads, water, each other and boundary
ok 4 - building envelopes including details clear roads, water, each other and boundary
  ---
  duration_ms: 6.915022
  type: 'test'
  ...
# Subtest: road network connected; every river crossing has a bridge
ok 5 - road network connected; every river crossing has a bridge
  ---
  duration_ms: 0.411886
  type: 'test'
  ...
# Subtest: spatial integrity holds across 30 seeds
ok 6 - spatial integrity holds across 30 seeds
  ---
  duration_ms: 27.394531
  type: 'test'
  ...
# Subtest: resize skips duplicate and zero-sized viewports; valid resize invalidates once
ok 7 - resize skips duplicate and zero-sized viewports; valid resize invalidates once
  ---
  duration_ms: 0.984344
  type: 'test'
  ...
# Subtest: selection recognizes click, rejects drag, right click and multitouch, and disposes listeners
ok 8 - selection recognizes click, rejects drag, right click and multitouch, and disposes listeners
  ---
  duration_ms: 2.136068
  type: 'test'
  ...
# Subtest: repeated invalidations coalesce; stable view has no idle callbacks
ok 9 - repeated invalidations coalesce; stable view has no idle callbacks
  ---
  duration_ms: 1.30297
  type: 'test'
  ...
# Subtest: damping continues only while state changes
ok 10 - damping continues only while state changes
  ---
  duration_ms: 0.190305
  type: 'test'
  ...
# Subtest: suspend and disposal cancel frames; disposed engine cannot resume
ok 11 - suspend and disposal cancel frames; disposed engine cannot resume
  ---
  duration_ms: 0.141812
  type: 'test'
  ...
1..11
# tests 11
# suites 0
# pass 11
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 240.785728
```
