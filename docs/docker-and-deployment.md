# Docker & Deployment

This guide explains how to build and run the project's Docker image and where CI builds/publishes images.

## Provided Dockerfile

A `Dockerfile` exists at the repository root. It is used by the CI workflow `.github/workflows/docker.yml` to build multi-tag images and push them to the configured registry (default: `ghcr.io`).

## Local build & run

Build the image locally (from repo root):

```bash
# build
docker build -t template-api:local .

# run (expose port 3000)
docker run --rm -p 3000:3000 --env-file .env example template-api:local
```

Replace `--env-file .env.example` with your `.env` file or explicit `-e` flags for required environment variables.

## CI image publishing

The repository's `docker.yml` workflow builds and pushes images to the registry. The workflow:

- sets up QEMU and Buildx
- logs into the registry using the workflow token
- generates metadata tags (sha, branch/ref, test)
- builds and pushes the image(s)

If you need to change the target registry or image name, update the `REGISTRY` and `IMAGE_NAME` environment variables in the workflow.

## Deployment notes

- Use environment variables (do not bake secrets into images).
- Prefer a runtime secret manager (Kubernetes Secrets, cloud secret manager) rather than `.env` in production.
- For Kubernetes, build image tags in CI (sha or semver) and deploy via your CD system pointing to those tags.

## Debugging

- To inspect a container locally:

```bash
docker logs <container>
docker exec -it <container> /bin/sh
```

- If the app fails to start in the container, check the `NODE_ENV` and required env variables, and run the same start command from within the container to reproduce.

## Further reading

- Docker Docs: <https://docs.docker.com/>
- GitHub Actions docker/build-push-action: <https://github.com/docker/build-push-action>
