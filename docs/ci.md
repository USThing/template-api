# CI workflows (overview)

The repository uses GitHub Actions. The active workflows are in `.github/workflows/` — check those files for exact steps. High-level:

- `check.yml` — runs lint, commitlint, and the test suite on pushes and PRs.
- `docker.yml` — builds and pushes container images for PRs and pushes.
- `release.yml` — run by `release-please` on `main` to automate releases and production image publishing.

When a check fails, open the corresponding workflow run in GitHub (Actions tab) to see job logs.

Avoid committing generated artifacts — have CI produce and publish them instead.
