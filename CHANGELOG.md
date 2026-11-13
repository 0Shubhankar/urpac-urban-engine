# Changelog

## U0.1 — 2026-11-13

Initial Riverbend city: 132 original procedural buildings, six district categories, river, seven bridges, street hierarchy, two parks, vegetation and scale-model lighting. Added deterministic plain-data generation, instanced rendering, orbit/zoom/pan, reset, overhead view, selection, responsive UI and fullscreen capability detection. Added Node integrity/spatial tests, Vite static build, dependency lockfile, architecture and continuation documentation, and portable source packaging.

Performance follow-up: render on demand, DPR capped at 1, cached 1024-pixel shadows, and planar instanced facade windows.


### U0.1 performance review candidate 1

Preserved the city and original dependency versions. Removed per-update pan-clamp allocations, explicitly report boundary corrections, reset elapsed time on visibility changes, skip duplicate/zero-size resize, clear selection gesture state, and preserve the engine across back-forward cache restoration. Corrected diagnostic camera delta forwarding and stale completion flag. Added camera, resize and selection regression tests. Final browser benchmarking and production build remain pending.

### U0.1 startup hotfix
Preserve native animation frame receiver; report actual startup error instead of assuming WebGL failure. Added regression test. Browser verification pending.
