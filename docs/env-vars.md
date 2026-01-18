# Environment variables

This project reads configuration from environment variables. A plain-text example file is provided at `.env.example` (copy it to `.env` for local development).

Recommended variables:

- MONGO_URI: MongoDB connection string (optional).
- AUTH_DISCOVERY_URL: OpenID Connect discovery URL (used by the auth plugin).
- AUTH_CLIENT_ID: OpenID Connect client id.
- AUTH_SKIP: When `true`, the auth plugin will skip external verification (useful for local tests).
- NODE_ENV: `development` / `production`.
- PORT: Port the Fastify server listens on (default 3000).

Test helpers (optional):

- TEST_AUTH_TOKEN: Bearer token used by integration tests (set only in CI or local secure env).
- TEST_AUTH_USER: Expected username for the test token.

How to use

Copy the example to a working `.env` file and modify values as needed:

```bash
cp .env.example .env
```

Notes

- Never commit real secrets. Use your cloud provider's secret manager or CI secrets for production deployments.
- Git: the repository ignores any file starting with `.env` (for example `.env`, `.env.local`, `.env.development`) — only the `.env.example` file is tracked. This keeps local or sensitive environment files out of version control while providing an example to copy from.
