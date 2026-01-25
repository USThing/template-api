# Testing & Linting

This document covers how to run tests and linting locally for this project.

## Run tests locally

From the repository root:

```bash
# install dependencies
yarn install

# compile TypeScript
yarn run build

# run tests
yarn run test
```

Notes

- The `test` script compiles tests with `tsc -p test/tsconfig.json` and runs the compiled tests from `dist/test/` using Node's test runner.

## Test structure

- `test/` contains unit and integration tests and a `helper.ts` for shared utilities.
- Keep fixtures under `test/fixtures/` and helpers under `test/helpers/`.
- Prefer small, deterministic tests. Use environment flags (e.g. `AUTH_SKIP`) to avoid external dependencies in unit tests.

## Linting and pre-commit

Run lint locally:

```bash
yarn run lint
```

To fix common lint issues:

```bash
yarn run lint:fix
```

Husky may be configured to run checks on commit; run `yarn run prepare` to install hooks locally.

## Troubleshooting

- If TypeScript compilation for tests fails, run `tsc -p test/tsconfig.json` to inspect errors.
- If tests are slow or flaky, isolate and run them individually and add timeouts or mocks where appropriate.

## Further reading

- Node.js test runner: <https://nodejs.org/api/test.html>
