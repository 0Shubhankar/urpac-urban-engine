# Development status — U0.1

Delivered 2026-11-13. Functional source and successful static production build. Performance targets are not certified.

## Implemented

132 procedural buildings across six district categories; houses with gable roofs, apartments, midrises, commercial buildings, offices, school, hospital and civic buildings. Connected arterial/secondary/local streets, seven bridges, a straight river, riverbanks, two parks, street trees, landscaped edge relief and a bounded miniature base. Seeded JSON state is independent of Three.js. Instanced rendering, selection/highlight, orbit/zoom/pan, reset, top-down, responsive UI and supported fullscreen control are present.

The requested directory tree was created, including README, AGENTS, CHANGELOG, LICENSE_NOTES, all core/renderer/generator/interaction modules, styles, scenario, tests and roadmap. simulation/, modules/ and assets/ are deliberately empty. tools/ contains archive and license-copy helpers. docs/third-party/ retains dependency notices.

## Tests and evidence

- npm install succeeded using a project-local cache after the global cache was unwritable. Vite was patched to 6.4.6; the resulting npm audit reported zero vulnerabilities at installation time.
- npm test: 5/5 passed. Deterministic JSON state, changed-seed variation, unique IDs and all eight building types, road/water/building clearance, boundary containment, connected roads and bridge coverage. Spatial checks cover 30 seeds.
- npm run build: passed after the final performance edits; third-party notices copied automatically.
- Development server: started successfully on loopback; browser loaded the city.
- Browser smoke checks: rendered city, no blocking console errors, orbit/zoom, selection metadata and highlight, reset, top-down, drag without selection, and responsive 390 × 844 layout. Keyboard pan was exercised; a dedicated right-button drag test was not performed. Touch gestures and fullscreen were implemented but not tested on physical mobile/fullscreen hardware.
- After the performance follow-up, the city rendered and orbit/reset worked without browser console errors. Earlier selection and mobile checks preceded the rendering-only optimization.
- Production directory: **681,919 bytes** (0.682 MB), including licenses. This is filesystem payload, not network transfer size.
- Earlier in-app-browser samples: 14.2 FPS and 12.2 FPS across 180 frames after 60 warmup frames, 49 reported draw calls and 141,658 triangles. These were below the target and motivated the performance follow-up. Hardware/GPU details were not collected. They do not describe the final optimized version.

## Performance follow-up

Final rendering uses demand-driven redraw, DPR capped at 1, cached 1024 × 1024 shadows, and instanced two-triangle windows instead of twelve-triangle boxes. Static views stop submitting frames after camera damping settles. A final controlled FPS/memory benchmark has not been performed; 50–60 desktop FPS and 30 mobile FPS remain targets, not claimed results. The tradeoff is softer high-DPI detail and shadows.

## Decisions and limitations

This is one illustrative orthogonal Riverbend scenario, not a general procedural layout solver. Seed and name may vary; dimensions and road allocation are version-specific. Terrain is predominantly flat with gentle peripheral berms. River geometry is straight. Facades repeat by typology. No operational finance, traffic, population, construction or save/load systems exist. The north indicator denotes the world convention rather than camera heading. Source is modular but some rendering routines are compact and should be formatted/refactored only when materially extending them.

## Recommended next work

First benchmark final navigation in a normal hardware-accelerated desktop browser and on a physical phone, then check touch/fullscreen and right-drag pan. Profile remaining lag before adding geometry. Only under a separate U0.2 assignment expand configurable block/district allocation and visual variety. Keep future Project 42 research logic outside the core renderer.


## U0.1 performance review candidate 1 — ChatGPT continuation

Based on the newest working source in UUE_Current_Source.zip, not the older nested release. Original source archive preserved. No city generator, visual styling, research module or dependency version changes.

- Camera pan clamp uses scalar calculations and reports corrections; test verifies target limits and preservation of camera offset.
- Visibility changes reset elapsed frame timing; diagnostics forward camera delta, clear previous completion and reject empty foreground samples.
- Resize skips unchanged and zero-sized viewports. Selection clears completed pointer gesture state and guards empty canvas bounds. Page lifecycle preserves the engine for back-forward cache restoration.
- Automated regression suite: see PERFORMANCE_REVIEW.md for exact results.
- Offline dependency install completed from the supplied cache, but npm run build fails because @rollup/rollup-linux-x64-gnu is missing. Browser navigation was denied by environment policy; no browser FPS, GPU memory, interaction or physical phone acceptance result is claimed for this candidate.
- U0.1 remains unaccepted. Run the local procedure in PERFORMANCE_REVIEW.md before U0.2.
