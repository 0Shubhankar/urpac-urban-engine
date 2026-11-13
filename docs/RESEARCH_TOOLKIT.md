# Shared Research Toolkit

The generic toolkit is public/research-toolkit.js.

It supports project/session identity, sequential
decision events, timestamps, local persistence
and JSON export.

Typical use:

    const research = new ResearchSession({
      project: '42',
      session: 'pilot-01',
      engineVersion: '1.2.0-rc.1',
      scenarioVersion: '1.0.0',
      researchVersion: '0.1.0'
    });

    research.record('decision-accepted', {
      action: 'place',
      args: ['hospital', 850, 850]
    });

Use research.snapshot() to obtain the event log.

Do not record names, contact details, credentials
or sensitive participant information in the log.

The toolkit is intended for local development
and research prototyping, not secure participant
data collection.

City autosave and research event storage are
separate operations. They are not atomic.

Client-side logs can be modified by users.
Formal experiments require appropriate consent,
data governance, secure storage and a stronger
transaction/data-recording architecture.

Each research project owns its mathematical
models, research parameters and financial state.
