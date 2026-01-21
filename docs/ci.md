# CI workflows (overview)

The repository uses GitHub Actions. The active workflows live in `.github/workflows/` — check those files for exact steps. CI logic has been refactored into local shared-step workflows (named `*-shared-steps.yml`) that are invoked via `workflow_call` by small top-level callers. This implements a hosted-first → self-hosted fallback pattern.

- `check.yml` — top-level caller that invokes `.github/workflows/check-shared-steps.yml` and runs lint, commitlint, and the test suite on pushes and PRs. The caller uses `ubuntu-22.04` for the primary try job and falls back to `self-hosted` only when the try job fails.
- `docker.yml` — caller that invokes `.github/workflows/docker-shared-steps.yml` to build and push container images (primary: `ubuntu-latest`, fallback: `self-hosted`).
- `release.yml` — caller that invokes `.github/workflows/release-shared-steps.yml` (primary: `ubuntu-latest`, fallback: `self-hosted`).

Notes about the shared-step / fallback pattern:

- The shared-step files are internal to this repository (named `*-shared-steps.yml`) and are not intended as cross-repo reusable workflows; they expose inputs such as `runs_on` and `continue_on_error` to the caller.
- Each top-level caller runs a primary job on a hosted runner and conditionally runs a fallback job on `self-hosted` using `if: ${{ failure() }}`. This makes CI more resilient but can cause duplicated or expanded sections in the GitHub PR UI when the fallback executes — this is cosmetic and documented in the workflow comments.
- `continue_on_error` is passed from the caller into the shared-step workflow and applied at the job level inside the shared workflow.

When a check fails, open the corresponding workflow run in GitHub (Actions tab) to see job logs. Prefer inspecting the primary (hosted) job logs first.

Avoid committing generated artifacts — have CI produce and publish them instead.
