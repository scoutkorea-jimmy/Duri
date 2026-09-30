# Duri website

Static Korean website for 두리손잡고 사회적협동조합 and 두리손잡고 직업재활센터. The deployable site is in `duri-website/`; project workflow and design guidance are in `CLAUDE.md` and `rules/`.

- Runtime: Python 3 for a local HTTP server, Node.js for repository checks. No package manager, install step, build step, or required environment variables.
- Preview: `python3 -m http.server 5599 --directory duri-website` then open `http://localhost:5599/`.
- Checks: `node tools/check-links.mjs`, `node tools/verify-headless.mjs`, `node tools/verify-a11y.mjs`. Browser checks use a locally available Chrome and `puppeteer-core`; see `rules/40-verify.md` for setup.
- Deployment: GitHub Actions publishes `duri-website/` after an authorized push to `main`.
