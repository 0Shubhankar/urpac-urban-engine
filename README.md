# URPAC Urban Engine — U0.1

An independent, browser-based miniature urban environment built with Three.js, JavaScript ES modules and Vite. Riverbend contains 132 procedural buildings, six district categories, a connected road hierarchy, seven river bridges, two parks and riverside greenery across an illustrative 1.44 km² boundary. No simulation, backend, mapping service, paid API, external models or textures are used.

## Run

Use Node.js 20 or newer and npm. From this directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite (normally http://127.0.0.1:5173). If your global npm cache is not writable, use `npm ci --cache ./work/npm-cache`. The lockfile pins dependency versions.

```sh
npm test
npm run build
npm run preview
```

Publish the **contents of `dist/`** to any static HTTPS host. The relative Vite base supports deployment below a URL subdirectory. Do not open index.html directly using file://. Development and preview servers bind to loopback and are not production servers. No publication or external account is required to use the source.

## Controls

- Left-drag: orbit and change elevation. Wheel: zoom.
- Right-drag or arrow keys: pan. Touch: one finger orbits; two fingers pan/pinch.
- Click/tap a building: highlight and metadata; click empty space to clear.
- Reset view: default overview. Top-down: overhead view; click again for overview.
- Fullscreen: shown when the browser supports it.

The river runs north–south. The small N indicator denotes the world north convention, not a live rotating compass. No operational population or economic meaning is attached to the buildings.

## Reproducibility and ownership

`scenarios/default-city.json` defines the seed and the supported Riverbend street layout. Changing the integer seed changes building dimensions, materials and vegetation deterministically. Arbitrary layout editing is not supported in U0.1; see ARCHITECTURE. Original code and procedural assets have no open-source license assigned. See LICENSE_NOTES for third-party notices.

Architecture, roadmap, acceptance evidence and limitations are in `docs/`. Run `python3 tools/package-source.py` to recreate `UUE_v0.1_Source.zip` without dependencies, caches or machine configuration.
