# Financial Passport MVP

## GitHub Pages publishing (important)

Use **`main`** as your publish branch.

Recommended setup:
1. In **Settings → Pages**, set **Source** to **GitHub Actions**.
2. Keep development on feature branches (for example `codex/build-financial-passport-mvp-web-app`).
3. Merge feature branches into `main`.
4. The included workflow deploys automatically on pushes to `main`.

If you select a non-main feature branch directly in Pages, deploys may break when that branch is deleted or out of sync.
