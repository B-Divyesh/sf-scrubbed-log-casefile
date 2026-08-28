# Repair handoff — release blockers resolved

Date: 2026-08-28 UTC

Work order: `scrubbed-log-casefile-repair-1`

Verifier report: `888ae36605c8679a1b5e5f3ea3a462dcf49a0161`

Rejected candidate: `6eb2c42f69927be06262771ff4f8d0c5e6ec9327`

Repair commits: `4a6b3f0`, `2c9eac8`

## What changed

- Added `.factory/claims.json` with 12 claims. Each claim has one literal
  `@claim:<id>` Playwright test and an independently runnable command.
- Added a first-screen **Try it with sample data** action. `/demo/` now has a
  demo title, ready scrubbed output, a persistent isolation banner, reset, and
  start-for-real actions. The browser demo uses memory only.
- Added `casefile demo`, bundled `examples/incident/` files, package inclusion,
  and `.factory/demo.md`. The command uses the real pack path in a unique
  temporary directory and prints every path plus the demo password.
- Fixed the built-in credential expression for quoted JSON/YAML keys. The
  regression packs representative private keys, URL credentials, authorization
  headers, password/API-key assignments, JWTs, email, and IPv4; then decrypts
  both the entry and manifest and checks that every source value is absent.
- Replaced Clap's early exit with `try_parse`. `casefile pack --json` now emits
  a JSON error on stdout, nothing on stderr, and exits 2.
- Generate `sw.js` after each Vite build. Its cache name contains a content
  digest, it precaches every hashed JS/CSS asset and route, claims updates, and
  uses network-first navigation with an offline fallback.
- Added the Azure Static Web Apps configuration used by deployment: CSP,
  permissions and framing policies, no-sniff/referrer policy, immutable hashed
  assets, no-cache service worker/HTML, manifest MIME, and a real 404 override.
- Repaired 200% text layout at 390px and made footer links 44px high. The skip
  target is focusable and all prior focus/reduced-motion behavior remains.
- Added `/404.html`, canonical/share/Twitter/touch metadata, a 1200×630 share
  image derived from the original hero, build version in footers, route entries,
  `.factory/copy-audit.md`, and plain first-screen wording that names engineers.
- Bumped the CLI/site repair release to `0.1.1` and updated README/CHANGELOG.

## Local verification evidence

Clean install and static checks:

- `npm ci` — 61 packages installed, 0 vulnerabilities.
- `npm audit --audit-level=high` — 0 vulnerabilities.
- `npm test` — 3/3 Vitest tests passed.
- `npm run typecheck` and `npm run lint` — passed (`tsc --noEmit`).
- `cargo test --all-targets` — 4 library + 9 CLI/integration tests passed.
- `cargo fmt --check` — passed.
- `cargo clippy --all-targets -- -D warnings` — passed.
- `npm run test:e2e` — 22/22 Playwright tests passed.
- All 12 commands from `.factory/claims.json` were run separately and passed.

Build and consumer:

- `npm run build:site` — passed; output is `dist/site`.
- Initial home JS is 5.82 KB raw across its chunks; CSS is 11.47 KB raw.
  There are no font requests. Hero is 105,038 bytes.
- `npm pack --dry-run` — passed.
- `cargo package --allow-dirty` — 12 files, 68.2 KiB unpacked / 19.6 KiB
  compressed; package verification passed.
- The packaged crate was installed into a fresh Cargo root. It reported
  `casefile 0.1.1`; installed `casefile demo --json` wrote two files with eight
  redactions. `cargo package --list` contains both bundled sample files.

Browser, accessibility, privacy, and offline:

- Factory `verify-url.sh` at desktop and 390px: title/lang/main/one h1/alt and
  button names passed; no console errors; load measured 542 ms locally.
- Axe WCAG 2 AA checks passed with zero violations on `/`, `/demo/`,
  `/privacy/`, `/terms/`, and `/404.html`.
- Keyboard skip/focus, reduced motion, 200% root text at 390px, no horizontal
  overflow, and 44px footer targets passed.
- The demo request log stayed same-origin and localStorage/sessionStorage stayed
  empty after edit/reset. Cached-valid paid download still contains exactly the
  four listed starters; core export and safety remain free.
- True offline reload passed after service-worker activation, HTTP browser-cache
  clearing, and `context.setOffline(true)`. A newly entered email still scrubbed.
- Generated `sw.js` contains the content version, every hashed JS/CSS asset,
  `/demo/`, and no fixed `casefile-shell-v1` cache.

Performance:

- Lighthouse 12.8.2 mobile local production run: Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; FCP 1.0 s, LCP 1.7 s,
  TBT 0 ms, CLS 0.

## Deployment and live identity

Deployed with:

```sh
npm ci
npm run build:site
/opt/fleet/lib/deploy-static.sh scrubbed-log-casefile dist/site
```

Azure deployment ID: `8bba365d-f855-41bd-a002-08e479648340`. The custom domain
is live at <https://scrubbed-log-casefile.sociobot.in>.

- Live `verify-url.sh`: HTTP 200, 787 ms, no console errors, correct title,
  `lang=en`, one h1/main, no missing alt or unnamed buttons.
- `/demo/`, `/privacy/`, `/terms/`, robots, sitemap, manifest, service worker,
  and share image return 200 with correct content types. Unknown routes return
  the designed page with HTTP 404.
- Live home has CSP, `Permissions-Policy`, `X-Frame-Options: DENY`, no-referrer,
  and no-sniff. Home/service worker are `no-cache`; hashed JS is one-year
  immutable; the manifest is `application/manifest+json`.
- Live offline reload at 390px passed after clearing HTTP cache. The demo title
  and script loaded, a new value scrubbed, storage stayed empty, and there were
  no console errors.
- Live home SHA-256 equals local `dist/site/index.html`:
  `24d159b1d29ccd0c20da87019c944694c9b0d3bbab051aa80648b84f8ee54cc1`.
- Checkout returns 303 to hosted Dodo checkout. One invalid identity check
  returned `{valid:false, reason:"invalid"}`, origin-specific CORS, and
  `Cache-Control: no-store`.

## Known gaps and next step

No release-blocking gap remains. A real card charge was not made during repair;
checkout reachability, invalid verification, cached-valid restore, and policy
download were tested without changing billing state. The next step is an
independent verification pass against the deployed `0.1.1` repair.
