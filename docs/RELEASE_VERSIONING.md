# UUE Release Versioning

## Versioning policy

Use semantic versions:

    MAJOR.MINOR.PATCH

MAJOR: incompatible engine API changes.
MINOR: compatible new functionality.
PATCH: compatible bug fixes.

Release candidates use a suffix:

    1.2.0-rc.1

## Research reproducibility

Every project should record:

- Exact engine version
- Engine Git commit SHA
- Project Git commit SHA
- Scenario version
- Research model version
- Experimental parameters
- Session identifier
- Date of data collection

## Stable hosted releases

A mutable GitHub Pages URL is suitable for
development, but does not preserve old releases.

Before collecting formal research data, publish
an immutable build for the chosen engine release.

Suggested hosting structure:

    /urpac-urban-engine/
        Current development/release build

    /uue-releases/1.1.0/
        Frozen engine distribution

Projects should point to the frozen release URL.

The project client checks the required engine
version during startup and refuses incompatible
versions.

This check does not create immutable hosting.
A separate release publication process is needed.

## Updating projects

1. Test the new engine against the project.
2. Run the project's regression tests.
3. Verify scenario/save compatibility.
4. Update the project's pinned version.
5. Record the change in its documentation.

Do not silently update an engine during an
ongoing research experiment.
