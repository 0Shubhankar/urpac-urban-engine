# Architecture

## Data flow and responsibilities

`main.js` loads scenario JSON and creates CityEngine. CityEngine calls pure `createCityState`, creates CityRenderer, CameraController and SelectionManager, then owns the demand-driven RenderScheduler and cleanup.

CityState contains name, seed, boundary, terrain, water, roads, bridges, buildings, parks and trees. Every physical object carries id, type, district, position, dimensions, orientation and visual configuration. All values are plain JSON data; no mesh references. `SeededRandom` uses a deterministic 32-bit PRNG. Generation sequence is stable and covered by equality tests.

The five generators produce logical objects. BuildingGenerator allocates six separated lots per block, assigns district-specific typologies and dimensional ranges, and reserves two entire blocks for parks. RoadGenerator defines continuous orthogonal roads; every horizontal river crossing has a bridge. VegetationGenerator reserves road clearance in the promenade. TerrainGenerator supplies the flat base; visual boundary berms introduce gentle relief away from buildings. WaterGenerator supplies the straight river corridor.

## Coordinate and spatial conventions

One unit equals one metre. +Y is up, +X east, -Z north. The square boundary is centred at (0,0,0), spanning ±600 m in X/Z. Dimensions are width X, height Y, depth Z. Orientation is radians around Y; U0.1 objects all use zero. Logical position.y is the nominal allocation elevation; rendering applies explicit decorative surface offsets (ground top 3 m, road top 4.25 m, building base 4 m). This is an illustrative scale model, not surveyed terrain.

Blocks are 180 m apart. Plot centres occupy x = -450, -270, 270, 450 and z = -450, -270, -90, 90, 270, 450, with ±48/0 m X and ±46 m Z lot offsets. Tests include 10 m road/water clearance and 8 m building-envelope separation to accommodate roof overhangs, plinths and civic columns. The 110 m river and promenades occupy the central corridor.

Only the supplied road coordinates, 1200 m boundary and centred 110 m river are supported in U0.1. Seed and name are safe to vary. Road-coordinate changes require changing block allocation and repeating spatial tests; this is not a general-purpose city-layout solver. Unsupported size/river values throw clearly.

## Rendering

CityRenderer translates metadata into shared boxes, a triangular-prism gable roof, low-poly foliage, cylinders and instanced facade details. Batches are keyed by geometry and colour. Instance-to-building ID arrays retain batch metadata without inserting renderer objects into state. Materials are rough and texture-free; hemisphere and directional lighting, capped DPR (1) and cached 1024-pixel directional shadows keep the implementation modest.

SelectionManager intersects a ray with conservative logical building bounds, chooses the nearest hit, and requests a separate wireframe selection box. It does not raycast individual instanced windows. Pointer movement exceeding 5 CSS pixels and multi-touch suppress click selection. CameraController wraps OrbitControls with damping, distance/elevation bounds, bounded pan, reset and overhead positioning. ResizeObserver updates canvas and projection. The UI uses safe textContent for selected metadata.

RenderScheduler coalesces invalidations into a single pending animation callback, continues during camera motion, and stops when motion settles. Hidden tabs cancel pending callbacks and reset frame timing. The renderer skips unchanged or zero-sized viewports. Static shadow maps are computed once. Facade windows use two-triangle planes instead of boxes. No continuous telemetry or network reporting exists.

## Extension points

Future research modules should consume snapshots or explicit state APIs from `modules/`. Simulation mechanisms belong in `simulation/`, currently empty. Neither may require mesh access. A future persistence format can serialize state; save/load, construction, vehicles and research mechanisms are explicitly out of scope. Empty folders are retained with .gitkeep, and `tools/` was added only for portable packaging.
