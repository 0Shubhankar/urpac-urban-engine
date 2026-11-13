# URPAC Urban Engine

Version: 1.0.0-rc.1

UUE is a reusable browser-based 3D urban
editing environment built with Three.js.

The default city is Riverbend.

## Local development

Requirements:
- Node.js 20 or later
- npm

Commands:

    npm ci
    npm test
    npm run build
    npm run dev -- --port 5180 --strictPort

## Engine capabilities

- Procedural buildings and infrastructure
- Interactive construction and demolition
- Object movement, resizing and rotation
- Object duplication
- Group selection and editing
- Straight and curved road drawing
- Geometric bridge construction
- Expandable city workspace
- Grid-based terrain editing
- Vegetation brushes
- Artificial ponds
- Land parcel designations
- Infrastructure asset library
- Distance and polygon area measurements
- Visual display layers
- Undo and redo
- Browser autosave
- Portable JSON city export and import

## Navigation

- Scroll or pinch: zoom
- Left drag: orbit
- Right drag or modified drag: pan
- Click: select or edit
- Escape: inspection mode

## Architecture

src/core/
    City state, construction, persistence,
    landscape, spatial editing and editor API.

src/renderer/
    Three.js rendering, camera and lighting.

src/generators/
    Procedural city and landscape assets.

src/interaction/
    Editing tools and browser interface.

scenarios/
    Initial city configurations.

tests/
    Automated regression tests.

## Research integration

Research projects should implement their
own models separately from the core city.

UUE does not prescribe:

- Population models
- Land-value models
- Municipal financial models
- Infrastructure demand models
- Transport demand models

These can be introduced through project-
specific modules using the editor API.

## Editor API

The browser exposes window.UUE.

Read current city state:

    UUE.getState()

Read a specific object:

    UUE.getObject('object-id')

Export a portable city snapshot:

    UUE.exportCity()

Get infrastructure inventory:

    UUE.getInventory()

Execute a construction decision:

    UUE.execute('place','house',850,850)

Edit an object:

    UUE.execute(
      'edit',
      'object-id',
      {height:60}
    )

Reverse a decision:

    UUE.execute('undo')

Read operations return copies of data.

Editor commands run through the construction
model and trigger rendering and autosave
after successful changes.

## Persistence

City saves are stored in browser localStorage.
Storage is specific to the website origin.

Export a JSON backup before clearing browser
storage or transferring to another domain.

Undo and redo history is session-based.

## Current limitations

- Original road and bridge network protected.
- New road geometry is not a traffic graph.
- Existing traffic animation is illustrative.
- New bridges are geometric structures.
- Terrain uses discrete elevation cells.
- Buildings require level ground.
- Parcels are visual grid designations.
- Utility assets are not functional networks.
- Measurements are horizontal.
- Group editing excludes roads.
- Browser and device performance varies.

## Release verification

Automated tests and a production build must
pass before deployment.

Browser smoke tests must verify navigation,
construction, road drawing, terrain changes,
group editing and save/load.

The release candidate becomes a stable
release only after this verification.

## Licensing

See repository license and third-party
notices. Original engine code and assets
remain subject to their existing terms.
