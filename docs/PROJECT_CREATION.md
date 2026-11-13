# Creating a UUE Research Project

Run npm run help to see all commands.

Create a project with:

    npm run create-project -- 42 municipal-finance

The generator registers the project automatically
in projects.json and creates public/projects/42/.

No engine source is duplicated.

The generated project initially uses the current
development engine and a permissive decision rule.

Develop the research model inside models/ and the
experiment rules inside experiments/.

Use a compatible exported city as scenario.json.

For an existing portfolio project, the generated
project files may be moved to its portfolio folder.
Adjust engineUrl and the registry path accordingly.

The engine and project must share the same origin.

Before research data collection, pin a frozen engine
release and independently test the research model.
