# UUE development instructions

Work only in this project. Preserve URPAC ownership: do not add an open-source license for original source without owner approval. Do not modify other URPAC, portfolio or Project 42 projects.

Use JavaScript ES modules, Three.js, HTML/CSS, Vite and JSON. Avoid frameworks, external models, textures, paid APIs and unnecessary dependencies. Verify all new dependency licenses and update LICENSE_NOTES and package-lock.json.

Logical state and generators must not import Three.js or retain meshes. All randomness comes from SeededRandom. Keep stable unique IDs, SI coordinates and serializable metadata. Rendering and input belong to their own modules. Research logic belongs in modules/ and future simulation mechanisms in simulation/, never embed them into renderer or generators.

Use descriptive names, small module APIs and explicit data flow. Share geometry/materials and batch repeated meshes. Dispose GPU resources and event listeners when extending lifecycle behavior. Keep the city visually dominant and the interface small.

For changes to generation run npm test; maintain meaningful seed, metadata, connectivity and spatial-envelope tests. For browser changes run npm run build and visually test relevant interactions, console errors and resize where tools permit. Never report unperformed tests as passed. Update CHANGELOG and docs/DEVELOPMENT_STATUS with evidence and limitations.

U0.1 is visual interaction only. Do not implement finance, traffic, populations, climate models, construction systems or later roadmap versions without a new assignment. Avoid unrelated cleanup, replacing the stack, telemetry, imported city simulators, or speculative abstractions. Keep source archives free of credentials, node_modules, .git and work/.
