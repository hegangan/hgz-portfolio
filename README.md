# He Ganzhong · AIGC Visual Designer
React + Vite portfolio, with Chinese/English content, light/dark themes, 25 films and 6 photography series.

## Run locally
Use Node.js 24 and the pnpm version declared in package.json.
- pnpm install --frozen-lockfile
- pnpm dev

## GitHub Pages
The workflow in .github/workflows/pages.yml builds and publishes on pushes to main.
In repository Settings → Pages, set the build source to GitHub Actions.
The build reads PAGES_BASE_PATH and PAGES_SITE_URL from actions/configure-pages, so project Pages and account-root Pages both work.
Images and videos are local public assets; there is no server dependency, secret key, external font CDN, Git LFS requirement or client-side history router.
Website navigation uses hash anchors, so a refresh does not need a server fallback.

## Validation
- node scripts/check-pages-source.mjs
- pnpm build
- node scripts/check-pages-build.mjs

The development performance panel is only available with ?perf in Vite development mode and is eliminated from the production build.
React Bits source attribution is retained in licenses/ and the adapted component comments.
