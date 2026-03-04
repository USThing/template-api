# Routes (overview)

This file gives a short, human-oriented map of the routes and plugins in this template. Keep it brief — full API specs are generated from code (use CI to publish generated docs).

## Route loading

- The project uses `@fastify/autoload` in `src/app.ts` to load all files under `src/routes/`.
- Each folder under `src/routes/<name>/` is mounted at the prefix `/<name>` (e.g. `src/routes/example/` => `/example`).

## About routes

Routes define the endpoints of your application. Prefer organizing related endpoints in the same folder (e.g. `src/routes/users/`) and keep each route file a Fastify plugin (autoload will mount it automatically).

If a single route file grows large, split it into a folder with an `index.ts` plugin and helper modules. Use `plugins/` for shared functionality exposed via decorators.

See Fastify's route patterns and promise-resolution behavior for async handlers: <https://fastify.dev/docs/latest/Reference/Routes/#promise-resolution>

## Example routes

`src/routes/example/index.ts` exposes two endpoints:

- GET /example/
  - Response: 200, plain string
  - Example: `this is an example`
- GET /example/error
  - Response: 400 (Bad Request) with JSON error body produced via `fastify-sensible`
  - Example: returns a bad request with message `this is an error example`

Use these endpoints for quick smoke tests while developing.

## How to extend

- Add route modules under `src/routes/<name>/` — autoload will mount them automatically.
- Add plugins to `src/plugins/` for shared functionality (auth, DB init, logging, etc.).
- When adding config-driven plugins, ensure options are declared in `AppOptions` in `src/app.ts` or passed via `--options` to Fastify start.

## Where to find generated API docs

- The project registers `@fastify/swagger` and `@fastify/swagger-ui` in `src/app.ts`. The interactive UI is typically served at `/documentation` unless configured otherwise.
- Prefer generating and publishing the OpenAPI/TypeDoc output in CI rather than committing generated artifacts to the repository.
