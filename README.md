# USThing Template API

The template repository for USThing backend services, powered by Fastify.

## Available Scripts

In the project directory, you can run:

### `yarn run dev`

To start the app in dev mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn run start`

For production mode

### `yarn run test`

Run the test cases.

### `yarn run lint`

Run the linter.

Note that the format of the code will also be checked.

### `yarn run lint:fix`

Run the linter and fix the issues.

Note that the format of the code will also be checked and fixed.

## Environment Variables

For Fastify-level environment variables, please refer to the [fastify-cli documentation](https://github.com/fastify/fastify-cli).

For the application-level environment variables, please refer to the `.env.example` file.

## CI / CD

This template supports GitHub Actions for CI / CD. The available workflows are:

- Checks / eslint: Run ES Lint to check problems and the format of the code.
- Checks / commitlint: Run Commitlint to check the format of the commit messages.
- Docker CI / docker: Build the Docker image and push it to the GitHub Container Registry.
- Release Please / release-please: Automatic releasing. See also [release-please](https://github.com/googleapis/release-please).

## Learn More

To learn Fastify, check out the [Fastify documentation](https://fastify.dev/docs/latest/).
