# CI workflows (overview)

The repository uses GitHub Actions. The active workflows live in `.github/workflows/` — check those files for exact steps. Recent CI changes extract common logic into reusable workflows to allow a hosted-first runner strategy with a self-hosted fallback. High-level:

- `check.yml` — top-level caller that invokes the reusable workflow in `check-reusable.yml`; runs lint, commitlint, and the test suite on pushes and PRs. The caller prefers GitHub-hosted runners and will fall back to a self-hosted runner only if the hosted job fails.
- `docker.yml` — top-level caller that invokes `docker-reusable.yml` to build and push container images.
- `release.yml` — caller for `release-reusable.yml`; invoked by `release-please` on `main` to automate releases and image publishing.

Key notes about the hosted-first / self-hosted fallback:

- The top-level workflow will try a hosted runner first and, if that job fails, run a fallback job targeting `self-hosted` runners. This improves reliability when hosted runners are unavailable or hit capacity.
- The fallback uses a `failure()` condition so it only runs when the primary (hosted) job fails; this can cause duplicated checks to appear in the PR UI and may show cosmetic failures for the fallback run — this is expected and documented in the workflow comments.
- `continue_on_error` is exposed as an input and applied at the reusable workflow job level when requested.

When a check fails, open the corresponding workflow run in GitHub (Actions tab) to see job logs. Prefer inspecting the primary (hosted) job logs first.

Avoid committing generated artifacts — have CI produce and publish them instead.
