# Builder sandbox

A test copy of the visual builder's **demo site**: not the ARD website, and no ARD data.

- **Editor:** https://ivan555top.github.io/builder/. Sign in with a GitHub token for this repository only (Contents: read and write; Actions: read-only, optional).
- **Where changes go.** Everything you publish is saved in this repository. Nothing reaches ardengineeringgroup.com.

## How publishing works here

1. **Publish** in the editor commits the page to `content/builder/` on `main`.
2. `.github/workflows/deploy.yml` builds the site from that commit (`npm run build`). The build writes `/_builder/build.json` with the commit it was built from.
3. The same workflow deploys the build to GitHub Pages.
4. The editor shows **Saving → Committed → Building → Deploying → Live ✓**. It says *Live* only when the site serves a build containing your commit, and the page carries your publish. **Open** then opens that version of the page.

Commits marked `[skip ci]` do not rebuild the site: media details, saved colours, drafts.

**One-time setting.** Settings → Pages → Build and deployment → **Source: GitHub Actions**.

## Contents

- `src/`, `scripts/`, `builder.config.ts`: the demo site, as in the builder's repository (`examples/demo-site`).
- `vendor/builder/`: the builder packages (the same version as in the builder's repository).
- `content/`, `public/`: pages, templates, settings and images, including everything published from the editor.
