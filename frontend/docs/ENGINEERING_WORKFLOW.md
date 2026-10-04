# Engineering Workflow

This project follows a minimal-change, evidence-driven workflow for feature work, fixes, and maintenance.

## Operating order

1. Understand the relevant project area.
2. Understand the requested behaviour and constraints.
3. Identify the smallest correct change.
4. Implement using existing patterns where possible.
5. Run only relevant verification.
6. Report the result concisely.

## Before making a change

- Inspect only the files, entry points, and documentation related to the request.
- Treat explicit requirements and existing project documentation as the source of truth.
- Reuse existing components, utilities, dependencies, naming, and formatting conventions.
- Preserve existing behaviour unless the request explicitly changes it.
- Ask one concise question only when a critical requirement cannot be safely inferred.

## Change principles

- Change only the exact scope requested by the user. Do not add extra features, refactors, styling, files, dependencies, or “nice-to-have” improvements unless explicitly asked.
- If a necessary supporting change is outside the requested scope, explain it and ask for approval before making it.
- Prefer focused patches over rewrites.
- Do not alter architecture, APIs, schemas, dependencies, or unrelated files without a direct requirement.
- Avoid duplicate logic and speculative abstractions.
- Keep accessibility, validation, error handling, performance, and security appropriate to the change.
- Add or update tests when a relevant test structure exists or the change needs meaningful coverage.

## Debugging workflow

1. Identify the failure and inspect its direct cause.
2. Reproduce or trace the issue when possible.
3. Fix the root cause with the smallest safe change.
4. Check adjacent behaviour for regressions.

## Verification

Use the project’s existing checks that are relevant to the modified area, such as:

- Build or type-check
- Lint
- Tests
- Relevant API or integration checks

If a check cannot be run, state that clearly in the handoff.

## Delivery format

For completed work, provide:

1. The changed files or diff when useful.
2. A brief explanation of what changed and why.
3. Verification performed and its result.
4. Any material assumptions or remaining limitations.

## Priority order

Correctness → requirement compliance → project consistency → security and reliability → maintainability → token efficiency → minimal output.
