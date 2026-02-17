# template-api

<!-- NOTE: If you use this repository as a template, replace `USThing/template-api` with your own GitHub owner/repo in the badge URLs. -->
[![CI](https://github.com/USThing/template-api/actions/workflows/check.yml/badge.svg)](https://github.com/USThing/template-api/actions/workflows/check.yml) [![Docs](https://github.com/USThing/template-api/actions/workflows/docs-publish.yml/badge.svg)](https://github.com/USThing/template-api/actions/workflows/docs-publish.yml) [![Release](https://github.com/USThing/template-api/actions/workflows/release.yml/badge.svg)](https://github.com/USThing/template-api/actions/workflows/release.yml) [![Docs site](https://img.shields.io/badge/docs-site-blue)](https://usthing.github.io/template-api/index.html)

A concise Fastify + TypeScript starter used by USThing backend services. This repository provides a minimal, well-tested scaffold with recommended scripts, linting, and CI configuration.

## Prerequisites

- Node.js (see `engines` in `package.json`)
- Yarn via Corepack

Enable Corepack (recommended) and the Yarn version used by this repo:

```bash
corepack enable
corepack prepare yarn@stable --activate
```

## Quickstart (local)

```bash
corepack enable
yarn install
yarn build
yarn start
```

## Developer workflow

- Start dev mode (watch + Fastify): `yarn dev`
- Run tests: `yarn test`
- Lint: `yarn lint` (fix: `yarn lint:fix`)

## Automatic API docs

API docs are generated from source by TypeDoc and published by CI. To generate locally:

```bash
yarn docs:typedoc
```

Generated docs are placed under `docs/api` (CI publishes these artifacts — do not commit generated files).

## Project layout

- `src/` — application code (routes, plugins, utils)
- `src/app.ts` — Fastify app and plugin registration
- `src/routes/` — route modules
- `test/` — tests and helpers
- `docs/` — human-authored guides and docs
- `.env.example` — example environment variables

## Environment

Tests and some dev helpers reference `TEST_AUTH_TOKEN` / `TEST_AUTH_USER`. See `docs/env-vars.md` for recommended env variables and CI secret usage. Keep secrets out of the repo and use your CI's secret manager.

## Contributing

Follow `CONTRIBUTING.md` (commitlint, lint, tests). The project uses Conventional Commits for releases.

## Support

Open an issue on GitHub using the provided templates for bugs or feature requests.

## Learn more

- Fastify: <https://www.fastify.dev/>
- Docs folder: `docs/` (detailed guides and examples)
