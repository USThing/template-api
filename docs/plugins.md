# Plugins

This file summarizes the plugins provided in the template and how they are loaded.

## Loading

- Plugins live under `src/plugins/` and are autoloaded by `@fastify/autoload` in `src/app.ts`.
- Plugins run before routes are registered so they can provide decorators, hooks, and shared schemas used by routes.

## About plugins

Plugins define cross-cutting behavior for your application (auth, DB, caching, helpers). Files in `src/plugins/` typically use `fastify-plugin` so they can expose decorators and hooks to the outer scope.

See also:

- The hitchhiker's guide to plugins: <https://fastify.dev/docs/latest/Guides/Plugins-Guide/>
- Fastify decorators: <https://fastify.dev/docs/latest/Reference/Decorators/>
- Fastify lifecycle: <https://fastify.dev/docs/latest/Reference/Lifecycle/>

## Key plugins

- `sensible.ts`
  - Registers `@fastify/sensible` and exposes a shared schema id `HttpError` used in route schemas.
  - Provides convenience reply helpers such as `reply.badRequest()`.

- `auth.ts`
  - Adds authentication support via OpenID Connect discovery and JWT verification.
  - Exposes a decorator `fastify.authPlugin(request, reply)` to validate requests; also sets `request.user` after successful auth.
  - Options: `authDiscoveryURL`, `authClientID`, and optional `authSkip` to disable in local/testing.

- `init-mongo.ts` (optional)
  - Placeholder plugin for MongoDB initialization (indexes, migrations). The actual MongoDB registration is commented out in `src/app.ts` and is optional.

- `support.ts`
  - Example plugin demonstrating `fastify.decorate()` (adds `someSupport()` decorator returning a string).

## Extending plugins

- Add a new plugin under `src/plugins/` and export it as a Fastify plugin (use `fastify-plugin` to expose decorators).
- Keep plugin responsibilities narrow and reusable (auth, DB setup, metrics, tracing, etc.).
- Document plugin options and side effects in `docs/plugins.md` or inline plugin README comments.
