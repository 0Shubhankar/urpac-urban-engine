# UUE Testing Guide

## Automated checks

    npm test
    npm run build
    npm run release:verify

## Browser acceptance testing

Open the standalone engine and verify:

- Night, High activity and Performance defaults.
- Trackpad navigation.
- Construction, editing and demolition.
- Straight and curved roads.
- Bridges, terrain and vegetation.
- Group editing and measurement tools.
- Undo and redo.
- City export, import and refresh persistence.

Open public/projects/demo through the dev server.

Verify that house construction is accepted and
office construction is rejected, including through
the built-in city editor.

Verify standalone and project storage isolation.

Create a disposable generated project and verify
that it loads, logs decisions and exports JSON.

After freezing, preview the frozen release URL
and verify that the client loads the exact version.

The current tests are primarily Node.js regression
tests. Full automated browser testing remains
a separate future improvement.
