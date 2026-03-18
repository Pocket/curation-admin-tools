# Curation Admin Tools

React/TypeScript frontend (CRA + MUI + Apollo GraphQL) used by Mozilla's editorial team to review, curate, and schedule content recommendations for the Firefox New Tab.

- **Backend:** `admin-api.getpocket.dev` (GraphQL). Source: [pocket/content-monorepo](https://github.com/pocket/content-monorepo) — curated-corpus-api, prospect-api.
- **ML:** Ranking and section generation: [mozilla/content-ml-services](https://github.com/mozilla/content-ml-services) — pushes candidates via SQS → backend lambdas → this UI.

**Three coexisting content modes** (newest → oldest):

1. **ML Sections** — Sections are topic-based groupings of articles shown on the New Tab (e.g., "Technology", "Sports"). ML sections are generated automatically by `content-ml-services`; curators QA the output. Custom sections (also called "manual sections") are created and managed by the editorial team. ML sections are currently rolling out to new markets.
2. **ML auto-scheduling** — ML populates the full schedule automatically. Live in Germany.
3. **Manual curation** — Curators hand-pick articles from prospect feeds. Markets are being migrated from this to ML Sections over the course of 2026.

## Local development

```bash
nvm use 18 && npm ci && npm start   # dev server on :3000 (uses dev API by default)
npm run test:nowatch                 # all tests (94 suites, 519 tests, Jest + RTL)
npm run lint-check

# single file / single test (--transformIgnorePatterns is required for Apollo ESM):
node scripts/test.js --watchAll=false \
  --transformIgnorePatterns "node_modules/(?!@apollo/client/link/core/ApolloLink.js)/" \
  --testPathPatterns="formatFileSize"
# add -t "test name" to run a single case
```

**Gotchas:**

- Requires **Node 18** (not 24) — the `--openssl-legacy-provider` flag in the start script will fail otherwise.
- **Port 3000** conflicts with `content-monorepo`'s Grafana/OTEL container if it's running; use `PORT=3001 npm start`.
- Use **npm**, not pnpm (ignore the untracked `pnpm-lock.yaml`).
- Login requires **Mozilla SSO** credentials.
- `npm start` opens a browser window by default — set `BROWSER=none` to suppress this (always do this unless the user explicitly asked to open the app).
