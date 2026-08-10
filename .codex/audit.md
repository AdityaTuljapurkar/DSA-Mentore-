# Repository Inspection

Perform a complete repository audit.

You are expected to actively investigate the project instead of only reading source files.

You may use every available capability provided by the environment, including but not limited to:

- Reading every source file
- Searching the repository
- Running terminal commands
- Executing development scripts
- Running Django management commands
- Running tests
- Running linters
- Inspecting migrations
- Inspecting PostgreSQL
- Verifying API routes
- Inspecting installed packages
- Checking build output
- Checking Docker configuration
- Checking environment configuration
- Verifying frontend builds
- Inspecting Git status

When available, use the terminal to verify implementation instead of assuming.

Examples include:

```bash
python manage.py check
python manage.py showmigrations
python manage.py makemigrations --check
python manage.py test

npm run build
npm run lint

pytest

psql ...

git status
git log
```

If PostgreSQL is configured, inspect the database schema when necessary to verify migrations and model implementation.

Use runtime verification whenever it provides stronger evidence than static code inspection.

Never assume a feature works simply because source code exists.

Whenever possible, verify execution.
## Evidence

For every feature marked COMPLETE, provide the evidence used.

Examples:

- Verified through source code
- Verified by successful Django check
- Verified through PostgreSQL schema
- Verified by automated tests
- Verified by frontend build
- Verified by API route inspection

Never mark a feature COMPLETE without evidence.
# Terminal Usage

You are encouraged to use the terminal whenever it improves confidence in the audit.

Examples include:

- Running Django
- Running React
- Running tests
- Running migrations
- Inspecting PostgreSQL
- Verifying installed packages
- Checking environment variables
- Verifying API endpoints
- Checking frontend compilation

Do not modify project files while using the terminal.

Read-only inspection is preferred.

Temporary execution for verification is allowed.
# Verification Rules

Use the strongest available evidence.

Evidence priority:

1. Successful runtime verification
2. Successful automated tests
3. Successful build
4. Successful terminal inspection
5. Source code inspection
6. Documentation

Documentation alone is never sufficient evidence.

A feature is COMPLETE only if there is sufficient evidence that it is implemented correctly.

If runtime verification fails, explain why.

If verification cannot be performed, clearly state the limitation.