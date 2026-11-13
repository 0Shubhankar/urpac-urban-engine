# URPAC Urban Engine — Command Reference

This is the primary reference for operating UUE.
You do not need to memorize any commands.

## 1. Open the engine directory

    cd "$HOME/Documents/WebDev/URPAC Urban Engine (UUE)"

Display help at any time:

    npm run help

## 2. Start the engine

    npm run dev -- --port 5180 --strictPort

Open:

    http://localhost:5180/

Stop the server with Ctrl+C.

## 3. Create a new research project

    npm run create-project -- 42 municipal-finance

Example for a future project:

    npm run create-project -- 53 transportation

The generator refuses duplicate project IDs and
existing folders. It creates project-specific
files only, not another copy of the engine.

Generated folder:

    public/projects/42/

Open:

    http://localhost:5180/projects/42/

The generated validator allows all editing by
default. Replace it with research-specific rules.

## 4. List registered projects

    npm run projects

Registry file:

    projects.json

## 5. Start a fresh experiment

Use a new session identifier:

    http://localhost:5180/projects/42/?session=test-02

Each project/session has independent city storage.
Research logging uses a separate namespaced key.

Do not reuse session IDs for unrelated experiments.

## 6. Validate the engine

    npm test
    npm run build

Preview the production build:

    npm run preview -- --port 5181 --strictPort

Open:

    http://localhost:5181/

The tests do not replace real browser verification.

## 7. Inspect and commit changes

    git status --short
    git diff --stat

Review and stage the intended source files:

    git add src/ tests/ public/ tools/ docs/
    git add index.html package.json package-lock.json
    git add projects.json COMMANDS.md CHANGELOG.md ENGINE_GUIDE.md

Inspect staged changes:

    git diff --cached --stat

Then commit:

    git commit -m "Update UUE engine and project toolkit"

Do not stage confidential participant data,
credentials, private datasets or experiment exports.

## 8. Freeze a versioned release

First commit the verified source so the working
tree is clean. Then:

    npm run release:freeze
    npm run release:verify

Frozen distribution:

    public/releases/<version>/

Every release contains a SHA-256 manifest and
the Git commit used to build it.

The freeze command refuses to overwrite an
existing release version.

Inspect, stage and commit the new release folder:

    git status --short
    git add public/releases/
    git diff --cached --stat
    git commit -m "Publish frozen UUE release"

A future update must use a new version number.
Never edit or overwrite a frozen release.

## 9. Deploy to GitHub

    git remote set-url origin https://github.com/0Shubhankar/urpac-urban-engine.git
    git push origin main

Check:

    https://github.com/0Shubhankar/urpac-urban-engine/actions

Current engine:

    https://shubhankarsharma.com/urpac-urban-engine/

Frozen releases should appear at:

    /urpac-urban-engine/releases/<version>/

Check the actual hosting URL after deployment.

If GitHub rejects a push, the local commit remains.
Do not reset or force-push simply to fix a server error.

## 10. Pin a project's engine version

Edit:

    public/projects/42/project.config.json

For the current development engine:

    "engineUrl": "../../"

For a frozen release, use a URL ending with a slash,
for example from a generated project page:

    "engineUrl": "../../releases/1.2.0-rc.1/"

The engineVersion must match the selected release.

For a project served separately in the portfolio,
use the appropriate same-origin absolute path:

    "engineUrl": "/urpac-urban-engine/releases/1.2.0-rc.1/"

Verify the frozen URL before collecting research data.

## 11. Export an initial scenario

Open the standalone engine.
Edit the city and use Export.
Copy the exported JSON to the project's scenario.json.

Start a new project session to load that scenario.

## 12. Export experiment data

Use Export experiment in the generated project.

This produces JSON containing the city snapshot
and the research event log.

Keep exports outside the public repository.
Do not store identifiable participant records
in browser localStorage.

## 13. Recover from problems

Check Git status:

    git status

Inspect recent commits:

    git log -5 --oneline

Check automated tests:

    npm test

Reinstall dependencies when needed:

    npm ci

Do not delete browser storage until city and
research JSON backups have been exported.

## 14. Documentation

    open COMMANDS.md
    open ENGINE_GUIDE.md
    open docs/PROJECT_INTEGRATION.md
    open docs/PROJECT_API.md
    open docs/PROJECT_CREATION.md
    open docs/RESEARCH_TOOLKIT.md
    open docs/RELEASE_VERSIONING.md
    open docs/TESTING_GUIDE.md
    open docs/DEPLOYMENT_GUIDE.md

The documentation in the repository is the
authoritative development reference.
