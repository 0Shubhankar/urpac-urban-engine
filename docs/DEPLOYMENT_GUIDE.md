# UUE Deployment Guide

See COMMANDS.md for the exact Terminal commands.

1. Run npm test and npm run build.
2. Complete browser acceptance tests.
3. Inspect, stage and commit verified source.
4. Run npm run release:freeze.
5. Run npm run release:verify.
6. Commit the newly frozen release directory.
7. Push main to GitHub.
8. Inspect the GitHub Actions deployment.
9. Verify the online engine and frozen release.

Frozen releases are stored under public/releases/.
Vite copies these static distributions into dist
during the normal production build.

The existing Pages workflow is expected to publish
dist. Verify this in the repository's workflow.

The freeze command prevents accidental replacement
of a released version and records file hashes.
It does not enforce immutability at the Git server.

Never change published release files in place.
Use new versions for subsequent changes.

Back up the central repository using Git.
Back up local city designs and research data
using JSON exports.

Do not publish private experimental records.
