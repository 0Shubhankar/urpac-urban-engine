# Project 42 — municipal-finance

Engine version: 1.2.0-rc.1

## Start development

From the central UUE directory:

    npm run dev -- --port 5180 --strictPort

Open:

    http://localhost:5180/projects/42/

Start a fresh session:

    http://localhost:5180/projects/42/?session=test-02

## Files

project.config.json — project identity and engine dependency.
scenario.json — initial city snapshot, or null for Riverbend.
project.js — engine connection and experiment interface.
experiments/rules.js — decision validation.
models/ — project-specific mathematics.
tests/ — project-specific verification.
data/ — non-sensitive example data only.

## Important

This project must not contain a copy of the UUE engine.

Replace the initial permissive validator with the
actual experimental rules before conducting research.

Before formal data collection, pin a frozen release
URL in project.config.json and verify the scenario.

Read the central documentation:

- COMMANDS.md
- docs/PROJECT_INTEGRATION.md
- docs/PROJECT_API.md
- docs/RESEARCH_TOOLKIT.md
- docs/RELEASE_VERSIONING.md
