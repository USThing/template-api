# Docker & Deployment

This guide explains how to build and run the project's Docker image and where CI builds/publishes images.

## Provided Dockerfile

A `Dockerfile` exists at the repository root. CI image build/publish logic has been extracted into an internal shared-step workflow (`.github/workflows/docker-shared-steps.yml`) and is invoked by a small top-level caller (`.github/workflows/docker.yml`) that prefers hosted runners and falls back to `self-hosted` when the hosted job fails.

## Local build & run

Build the image locally (from repo root):

```bash
# build
docker build -t template-api:local .

# run (expose port 3000)
docker run --rm -p 3000:3000 --env-file .env.example template-api:local
```

Replace `--env-file .env.example` with your `.env` file or explicit `-e` flags for required environment variables.

## CI image publishing

The repository's `docker.yml` top-level caller invokes the internal shared-step workflow to build and push images to the registry. The shared-step workflow:

- sets up QEMU and Buildx
- logs into the registry using the workflow token
- generates metadata tags (sha, branch/ref, test)
- builds and pushes the image(s)

If you need to change the target registry or image name, update the `REGISTRY` and `IMAGE_NAME` environment variables in the shared-step workflow or the top-level caller as appropriate.

Note: the top-level caller uses `ubuntu-latest` for the primary try job; when that job fails the fallback runs on `self-hosted`. This is intended to improve reliability while keeping hosted runner usage first.

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
