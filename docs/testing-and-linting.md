# Testing & Linting

This document covers how to run tests and linting locally for this project.

## Run tests locally

From the repository root:

```bash
# install dependencies
yarn install

# type-check only (runs type checking)
yarn run compile

# run tests (TypeScript tests run directly via tsx)
yarn run test
```

Notes

- The `test` script runs TypeScript tests directly using `tsx` (no separate build artifact is required). It executes `tsx --test --test-timeout=5000 --experimental-test-coverage test/**/*.test.ts` as defined in `package.json`.
- Use `yarn compile` when you only need type-checking (the script uses `tsgo` for type checks).

## Test structure

- `test/` contains unit and integration tests and `test/helper.ts` for shared utilities.
- Place fixtures under `test/fixtures/` and put shared helpers in `test/helper.ts` or a `test/helpers/` module as needed.
- Prefer small, deterministic tests. Use environment flags (e.g. `AUTH_SKIP`) to avoid external dependencies in unit tests.

## Linting and pre-commit

Run lint locally:

```bash
# fixes are applied by default
yarn run lint
```

To check lint without fixing:

```bash
yarn run lint:check
```

Husky may be configured to run checks on commit; run `yarn run prepare` to install hooks locally.

## Formatting

Run Prettier to format files:

```bash
yarn run fmt
```

To check formatting without modifying files:

```bash
yarn run fmt:check
```

## Troubleshooting

- If TypeScript type-checking fails, run `yarn compile` (or `tsgo -p test/tsconfig.json --noEmit`) to inspect errors.
- If tests are slow or flaky, isolate and run them individually and add timeouts or mocks where appropriate.

## Further reading

- Node.js test runner: <https://nodejs.org/api/test.html>
