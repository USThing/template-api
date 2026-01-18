# USThing Template API

A concise Fastify + TypeScript starter used by USThing backend services. This repository provides a minimal, well-tested scaffold with recommended scripts, linting, and CI configuration.

## Quickstart

Run the following to get started (single command block; brief comments explain each step):

```bash
# Install dependencies
yarn install

# Prepare Husky git hooks (if present)
yarn run prepare

# Run in development (watch + fastify)
yarn run dev

# Build TypeScript to `dist`
yarn run build

# Start production server (uses `dist`)
yarn run start

# Run tests
yarn run test
```

Note: this repository expects Yarn managed via Corepack. If Corepack is not enabled on your machine, enable it first:

```bash
corepack enable
# after enabling, use `yarn ...` as usual (no need for `corepack` prefix)
```

## Key scripts

- `dev` — start in development (watch + fastify)
- `build` — compile TypeScript
- `start` — run production server (from `dist`)
- `test` — build and run tests
- `lint`, `lint:fix` — ESLint checks and fixes
- `commitlint` — validate commit messages

## Project layout

- `src/` — application code (routes, plugins, utils)
- `src/app.ts` — Fastify app and plugin registration
- `routes/` — route modules
- `test/` — tests and helpers
- `docs/` — human-authored docs (Quickstart, guides, migration)
- `.env.example` — example env variables

## Docs and API reference

Human-facing guides belong in `docs/`. API specs (generated from code via Fastify+Swagger or TypeDoc) should be produced by CI and published to your docs site rather than frequently committing generated files.

## Environment

See `.env.example` for application-level variables. Fastify CLI options are documented at the `fastify-cli` project.

## Contributing

Please follow `CONTRIBUTING.md`. Use the configured commitlint rules and run lint/tests before opening a PR.

## Support

Open an issue on GitHub using the provided templates for bugs or feature requests.

## Learn more

- Fastify: <https://www.fastify.dev/>
- Docs folder: `docs/` (detailed guides and examples)
