# AUDIO GEM — Code Review Rules

## General

- Do not introduce unnecessary changes outside the requested scope.
- Preserve existing project architecture and conventions unless there is a clear reason to change them.
- Prefer simple, maintainable solutions over unnecessary abstraction.
- Do not leave debugging code, console logs, commented-out code, or temporary files in production code.
- Do not introduce secrets, API keys, tokens, passwords, or credentials into the repository.

## TypeScript / JavaScript

- Prefer `const` and `let`; never use `var`.
- Avoid `any` unless there is a documented reason.
- Prefer explicit and useful types at important boundaries.
- Handle errors explicitly rather than silently ignoring them.
- Avoid unnecessary duplication.

## React

- Prefer functional components and hooks.
- Keep components focused on a single responsibility.
- Avoid unnecessary re-renders and state.
- Reuse existing components and utilities before creating duplicates.
- Keep business logic separate from presentation when practical.

## Dependencies

- Do not add a dependency when the existing project or platform already provides an adequate solution.
- Avoid unnecessary dependency upgrades unrelated to the requested change.

## Security

- Never expose credentials or secrets.
- Validate untrusted input.
- Do not disable security mechanisms merely to make code work.