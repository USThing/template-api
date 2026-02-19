# Developer setup

This file documents the minimal developer setup for the template-api project.

## Prerequisites

- Node.js >= 24 (LTS or newer recommended)
- Corepack (bundled with modern Node.js releases)

<!-- Node version management was moved to an optional section at the end of this document -->

## Enable Corepack

Enable corepack if not already enabled:

```bash
# enables Corepack globally
corepack enable
```

## Verify setup

Verify Yarn is available and the expected version

```bash
# Yarn should be available after enabling Corepack
yarn -v
```

## Installation

Install dependencies and prepare hooks

```bash
# install dependencies
yarn install

# prepare Husky git hooks (if present)
yarn run prepare
```

## Notes

- After enabling Corepack you can use `yarn` directly — there is no need to prefix commands with `corepack`.
- If the repository sets a Yarn version via `.yarnrc.yml`/`yarn.lock`, Corepack will select the correct Yarn release automatically.
- Keep your Node toolchain up-to-date for security and compatibility.

## Troubleshooting

- If `yarn` is not found after enabling Corepack, restart your shell or open a new terminal.
- If you need a specific Yarn release, run `corepack prepare yarn@<version> --activate`.

## Further reading

- Corepack: <https://nodejs.org/api/corepack.html>
- Yarn (Berry) docs: <https://yarnpkg.com/>

## Optional: Node version management

If you choose to use a Node version manager, pin a version in the repo (for example add a `.nvmrc` with `24`) so contributors and CI pick the same Node. Minimal examples:

```bash
# nvm
nvm install 24 && nvm use 24

# fnm
fnm install 24 && fnm use 24
```

This is optional but recommended for reproducible local builds and CI.
