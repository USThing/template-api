# CI workflows

The repository uses three primary GitHub Actions workflows in `.github/workflows/`:

- `check.yml` — runs on push and pull_request. It probes runner availability (a small `detect-quota` job) and then runs ESLint, commitlint, and tests. Each job uses a hosted-first → self-hosted fallback by selecting `runs-on` based on the probe result.
- `docker.yml` — builds and pushes container images (Buildx). It also probes runner availability and uses a hosted-first fallback. The workflow prepares Docker metadata (tags include sha, branch/ref, and PR tags) and pushes images to `REGISTRY`/`IMAGE_NAME`.
- `release.yml` — runs `googleapis/release-please-action@v4` on pushes to `main`. When a release is created the workflow tags versions and (optionally) builds/pushes images. See `release.yml` for the exact tagging and build steps.

## Key notes

- Hosted-first fallback: jobs use a small probe job (`detect-quota`) and set `runs-on` dynamically so CI prefers `ubuntu-latest` but can fall back to `self-hosted` when needed.
- Docker workflow permissions: the docker workflow requests permissions to push packages and to request an `id-token` for registry login; it logs into the registry using the workflow token by default.
- Release workflow: `release-please` creates release PRs or releases and exposes outputs such as `release_created`, `major`, `minor`, `patch`, `tag_name`, and `body` that downstream steps use.
- Tokens: the action uses the default `GITHUB_TOKEN` unless configured to use a PAT; if you need CI checks to run on Release PRs, configure a PAT as described in the action docs.

If a run fails, open the workflow run in GitHub Actions and inspect the primary (hosted) job logs first. Avoid committing generated artifacts; let CI produce and publish them.
