# UUE Project Integration Guide

## 1. Core principle

Maintain one central URPAC Urban Engine source
repository. Never manually copy its renderer,
editor, generators or asset library into
individual research projects.

The engine owns the physical urban environment.

Each project owns its research methodology,
mathematical models, participant interface,
experimental parameters and results.

## 2. Integration architecture

UUE 1.1 provides a shared browser engine host
and an importable JavaScript project client.

The client embeds the engine through a same-origin
iframe and connects to the registered project host.

This is not yet a mountable Three.js npm library.
It is a reusable web integration contract.

Both the engine and research project must be
served from the same origin: matching protocol,
hostname and port.

## 3. Starting a project

Copy only the small project starter files from:

    public/projects/demo/

Do not copy the engine.

For a project hosted in the existing portfolio,
create or use its own project folder:

    portfolio/42/
        index.html
        project.js
        methodology.js
        scenario.json
        README.md

The project loads the centrally hosted client:

    import { mountUUE } from
      '/urpac-urban-engine/project-client.js';

Create an engine container in the project HTML
and give it an explicit width and height.

In project.js:

    const engine = await mountUUE(container, {
      id: '42',
      session: 'experiment-v1',
      engineUrl: '/urpac-urban-engine/',
      engineVersion: '1.2.0-rc.1',
      authorize: decision => true
    });

The exact URL depends on the hosting layout.
Use the same origin for the project and engine.

## 4. Local development

Start the central engine:

    npm run dev -- --port 5180 --strictPort

Open the demonstration:

    http://localhost:5180/projects/demo/

For early local project development, individual
project files may live under public/projects/.

For separate repositories or directories,
configure a same-origin development proxy or
serve both directories through one local server.
Do not run the project and engine on different
ports without such a proxy.

## 5. Independent city scenarios

The existing engine generates Riverbend.

To create a research-specific initial city:

1. Open the standalone engine.
2. Edit Riverbend into the desired scenario.
3. Export the city as JSON.
4. Store the file in the project folder.
5. Fetch the JSON in the project.
6. Pass it as initialCity to mountUUE.

Example:

    const initialCity = await fetch(
      './scenario.json'
    ).then(r => r.json());

    const engine = await mountUUE(container, {
      id: '42',
      session: 'experiment-v1',
      engineUrl: '/urpac-urban-engine/',
      engineVersion: '1.2.0-rc.1',
      initialCity,
      authorize: decision => true
    });

The initial scenario is loaded only when there
is no existing saved city for that project/session.

Use a new session ID to start a fresh experiment.

Current scenario imports must remain compatible
with the Riverbend baseline and its protected
original road network.

Arbitrary new city generators are future work.

## 6. Project-specific storage

City autosave keys are separated by project
identifier and session identifier.

Example:

    project=42, session=experiment-v1

does not overwrite:

    project=53, session=experiment-v1

The standalone city retains its existing key.

Research variables are not automatically saved
by UUE. Each project should maintain its own
separate state and persistence system.

Browser localStorage is not a research database.
Do not store identifiable participant data there
without a suitable data-governance plan.

## 7. Decision validation

Every supported editing command passes through
the project decision validator before mutation.

The validator receives:

    action
    args
    state
    identity

Return true to allow the command.
Return a string to reject it with an explanation.
Any other return value rejects the command.

The validator must be synchronous and should
not mutate project finances or other research
state before the engine accepts the decision.

Use onDecision to receive accepted model
changes and onRejected for failed decisions.

The project can also control restore operations,
including import, load and reset.

## 8. Project testing

Before publishing any project:

- Verify its required engine version.
- Verify independent storage.
- Verify scenario initialization.
- Test accepted and rejected decisions.
- Test editing through both project controls
  and the built-in editor.
- Test refresh, export and import.
- Verify research calculations independently.
- Test full research-state persistence.

## 9. Where new features belong

Shared rendering and editing capabilities:
    Add to the central UUE repository.

Research-specific economic models:
    Add to the research project only.

Research-specific UI:
    Add to the research project only.

Reusable generic infrastructure assets:
    Add to the central asset library.

Do not introduce one project's theoretical
assumptions into the standalone engine.

## 10. Important limitations

The project policy is a client-side application
control, not a security boundary.

Decision callbacks report model changes before
render completion. Research state and city
autosave are not one atomic transaction.

A production serious-game experiment requires
a stronger transaction and data-recording layer.

The demonstration project is an integration
test, not a research experiment.
