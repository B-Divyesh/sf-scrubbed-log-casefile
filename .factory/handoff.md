# Polish 1 handoff — PASS

Date: 2026-08-28 UTC

Work order: `scrubbed-log-casefile-polish-1`

Base: `b78bdbc70472c94346f2913006de2e4786e1937d`
Repair commit: `893a2043f3b63428c1e1a9751209040e9697fc51`

## Delivered

- Closed every finding in `.factory/review-1.md`; the detailed finding-to-fix
  map is in `.factory/polish-1.md`.
- Removed the untestable payment and refund promises rather than representing
  an external billing contract as locally proven.
- Strengthened the primary browser privacy claim to exercise scrubbing with a
  unique sentinel and inspect request bodies, URLs, all browser storage, and
  cache responses.
- Added the documented `?demo=1` one-click entry. It redirects to the
  in-memory `/demo/` sandbox, where the sample banner, reset action, and
  start-for-real link remain visible.
- Contained the hero art and readable caption at 390px and 1440px without
  changing the concrete-and-moss visual thesis.
- Added consistent navigation, route-level polite announcements, and focused
  `<h1>` landmarks after in-site forward and Back/Forward navigation.
- Added a fixture-backed license-storage claim, updated the copy audit and
  demo documentation, and added the verb-first catalog description.

## Verification evidence

### Clean clone and claim gate

Fresh clone: `/tmp/casefile-clean.u0igUC/repo` from repair commit, followed by
`npm ci` (61 packages, 0 vulnerabilities). Every one of the 17 commands in
`.factory/claims.json` was run independently and passed:

`browser-local`, `license-storage`, `offline-reload`, `cli-demo`,
`credential-redaction`, `encrypted-casefile`, `aes-256`, `password-env`,
`machine-json`, `exit-codes`, `custom-rules`, `stable-tokens`,
`atomic-output`, `single-binary`, `cli-local`, `team-policy-pack`, and
`cli-recording`.

### Local full suite

- `npm test` — 3/3 passed.
- `npm run typecheck` and `npm run lint` — passed.
- `npm audit --audit-level=high` — passed; 0 vulnerabilities.
- `npm run build` — passed; output is `dist/site`. Initial home JS is 2.28 KB
  gzip, CSS is 3.30 KB gzip, no web fonts are requested, and the hero image is
  105,038 bytes.
- `npm run test:e2e -- --reporter=line` — 31/31 passed, including all five
  route metadata pages and WCAG 2 AA axe scans with zero violations.
- `cargo fmt --check`, `cargo clippy --all-targets -- -D warnings`, and
  `cargo test --all-targets` — passed (4 library + 12 integration tests).
- `cargo package --allow-dirty` — passed; 12 files, 72.6 KiB unpacked,
  20.1 KiB compressed. `npm pack --dry-run` also passed.
- Factory `verify-url.sh` against local build — passed; no console errors,
  title/lang/main/one h1/alt/button checks passed. The standalone axe CLI was
  attempted with the provisioned Chrome and could not create its Selenium
  session; the pinned `@axe-core/playwright` suite above is the successful
  browser accessibility evidence.

### Deployment and cold live recheck

- Deployed `dist/site` with `/opt/fleet/lib/deploy-static.sh
  scrubbed-log-casefile dist/site`.
- Deployment ID: `14c4f411-a83c-477f-9f2b-8135eb531d92`.
- Live URL: <https://scrubbed-log-casefile.sociobot.in>.
- `verify-url.sh` cold live check passed in 704 ms with no console errors;
  evidence is `/tmp/casefile-live.zlmSAI/verify.json`.
- Cold live Playwright recheck passed at 1440×900 and 390×844: contained hero
  figure/caption, `?demo=1` redirect/banner/reset, no payment/refund copy,
  header consistency, focused and announced `/` → `/privacy/` → Back flow,
  sentinel scrub privacy across request URL/body/storage/IndexedDB/cache, and
  HTTP 404. Screenshots are `/tmp/casefile-live.zlmSAI/recheck-desktop.png`
  and `/tmp/casefile-live.zlmSAI/recheck-mobile.png`.

## How to run

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:e2e
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test --all-targets
casefile demo --json
```

Use `https://scrubbed-log-casefile.sociobot.in/?demo=1` for the browser demo.

## Known gaps

None. The standalone axe CLI is environment-limited by its Selenium Chrome
session; its equivalent pinned Playwright axe checks pass on every route.
