# USThing Template API

The template repository for USThing backend services, powered by Fastify.

## Available Scripts

In the project directory, you can run:

### `yarn run dev`

Run the app in development mode; watch the source for changes.

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn run compile`

Run the TypeScript compiler to check for type errors.

### `yarn run build`, `yarn run start`

- Build the app for production to the `dist` folder.
- Start the built app in production mode.

### `yarn run test`

Run the tests.

### `yarn run lint`

Run the linter and fix any issues.

`lint:check` does not fix the issues.

### `yarn run fmt`

Run the formatter and fix any issues.

`fmt:check` does not fix the issues.

## Environment Variables

For Fastify-level environment variables, please refer to the [fastify-cli documentation](https://github.com/fastify/fastify-cli).

For the application-level environment variables, please refer to the
`.env.example` file. `yarn run dev` automatically loads a `.env` file if it exists.

## CI / CD

This template supports GitHub Actions for CI / CD. The available workflows are:

- Checks / eslint: Run ES Lint to check problems and the format of the code.
- Checks / commitlint: Run Commitlint to check the format of the commit messages.
- Checks / tests: Run unit tests of the project.
- Docker CI / docker: Build the Docker image and push it to the GitHub Container Registry.
- Release Please / release-please: Automatic releasing. See also [release-please](https://github.com/googleapis/release-please).

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
