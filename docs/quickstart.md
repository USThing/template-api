# Quickstart

This page expands the brief Quickstart in the project README. Keep this short and focused — detailed guides belong elsewhere in `docs/`.

## Prerequisites

- Node.js >= 24
- Yarn 3+ (the repository uses Yarn; `npm` may also work but commands below use `yarn`)

Corepack / Node setup: see `docs/dev-setup.md` for enabling Corepack and node version manager tips.

## Install

```bash
# Install dependencies (after enabling Corepack, use `yarn`)
yarn install

# Prepare Husky git hooks (if present)
yarn run prepare
```

## Development

```bash
# start in development (watch + fastify)
yarn run dev
```

The server listens on the port configured in your environment (default Fastify port is typically 3000). `yarn run dev` automatically loads a `.env` file from the repository root if it exists. Check logs for the bound address.

## Build & production run

```bash
# compile the TypeScript output to dist
yarn run build

# start the production server (reads compiled files from dist)
yarn run start
```

## Environment

Application-level variables are documented in `.env.example` at the repository root. Don't commit secrets — use environment management for CI/production.

## Example requests

This template includes an example route. When running locally, try:

```bash
# Basic example (expected response: "this is an example")
curl -sS http://localhost:3000/example/

# Example that returns a bad request error (demonstrates error handling)
curl -sS http://localhost:3000/example/error
```

Notes:

- The example routes are implemented under `src/routes/example/`. The folder name is used as the route prefix by autoload (so the endpoints above are `/example/` and `/example/error`).
- If your project config mounts routes differently, adjust the path accordingly.

## API docs

When Swagger/UI is enabled (see `src/plugins`), an interactive API UI is typically available at `/documentation` (or the path configured in the plugin). Generated specs should be published by CI rather than committed frequently to avoid merge conflicts.

## Next steps

- Read `docs/routes.md` for a high-level route map and plugin responsibilities.
- Add environment values to `.env` based on `.env.example`.
- Open `CONTRIBUTING.md` before making the first PR.
