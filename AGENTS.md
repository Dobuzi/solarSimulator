# Repository Guidelines

## Project Structure & Module Organization
This repository is currently empty (no source, tests, or assets yet). As you add code, prefer a simple, conventional layout:
- `src/` for application or library code.
- `tests/` for automated tests.
- `assets/` or `public/` for static files (images, fonts, etc.).
- `docs/` for design notes or architecture references.

Keep modules small and single-purpose. Group related functionality under a feature directory (for example, `src/payments/` with `handlers/`, `models/`, and `services/`).

## Build, Test, and Development Commands
No build or test tooling is configured yet. When you add tooling, document it here and keep commands consistent across contributors. Examples to standardize on:
- `npm run dev` or `make dev` for local development.
- `npm test` or `make test` for running the full test suite.
- `npm run build` or `make build` for production builds.

## Coding Style & Naming Conventions
No formatter or linter is configured. Until one is added, keep code readable and consistent within each file:
- Use consistent indentation within a file (spaces recommended).
- Prefer descriptive, lower-case names for files (e.g., `user_profile.ts`, `invoice_service.py`).
- Match the language’s common style guide (PEP 8 for Python, standard style for Go, etc.).

When a formatter or linter is introduced, add its config file to the repo and run it on every change.

## Testing Guidelines
No testing framework is configured. When adding tests:
- Keep test files in `tests/` or alongside code (e.g., `src/foo.test.ts`).
- Use clear, behavior-focused names (e.g., `should_create_invoice_with_tax`).
- Prefer fast, deterministic tests; note any fixtures or external dependencies.

## Commit & Pull Request Guidelines
This is not currently a git repository. If you initialize git, define a commit convention (for example, Conventional Commits) and document it here. For pull requests, include:
- A concise summary of changes.
- Linked issues or tickets when applicable.
- Screenshots or logs for UI or behavior changes.

## Security & Configuration Tips
Avoid committing secrets. Store environment-specific settings in a `.env` file and add `.env` to `.gitignore` once git is initialized.
