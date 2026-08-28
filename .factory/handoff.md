# Polish 2 handoff — PASS

Date: 2026-08-28 UTC

Work order: `scrubbed-log-casefile-polish-2`

Repair commit: `2500fc8f`

Live URL: <https://scrubbed-log-casefile.sociobot.in>

Deployment ID: `1cf8efbf-0f1e-42be-a6e4-7f90202390a6`

## Delivered

- Closed every finding in `.factory/review-1.md` and `.factory/review-2.md`.
  The finding-by-finding evidence map is `.factory/polish-2.md`.
- Kept the first-screen job statement and moved all three facts into the phone
  viewport above the one-click sample action.
- Made `?demo=1` enter an isolated in-memory demo with a persistent banner,
  reset, real-start path, phone-visible before/after result, and fresh salt per
  page/reset. The shortcut exits before landing license code can read real
  namespace values.
- Expanded `.factory/claims.json` from 17 to 21 claims. Every claim has exactly
  one tagged observable test.
- Added `casefile inspect <casefile> --password-env <NAME> [--extract]` for
  manifest review and safe extraction to a new temporary directory.
- Added real two-casefile salt/correlation tests and complete manifest-content
  tests.
- Fixed reconnection verification, all-link route focus/announcements, default
  44px navigation targets, footer one-liners, 404 wording, and cumulative copy
  and terminology findings.
- Released version 0.1.3 without changing the single-binary CLI or static-site
  deployment classes.

The catalog description is now: “Scrub incident logs locally into reviewable
encrypted casefiles.” It is verb-first and 64 characters.

## Verification evidence

Clean clone: `/tmp/casefile-polish2-clean.Vb3ewL/repo`.

- All 21 claim commands from `.factory/claims.json`: passed independently.
- `cargo fmt --check`: passed.
- `cargo clippy --all-targets -- -D warnings`: passed.
- `cargo test --all-targets`: 4 library and 15 integration tests passed.
- `npm test`: 3/3 passed.
- `npm run typecheck`; `npm run lint`: passed.
- `npm run build`: passed and produced `dist/site`.
- `npm run test:e2e -- --reporter=line`: 35/35 passed.
- `cargo package`: passed; package 85.4 KiB, 22.4 KiB compressed.
- Initial home JavaScript: 2.28 KiB gzip; CSS: 3.50 KiB gzip.
- Live Lighthouse mobile: 100 Performance, 100 Accessibility, 100 Best
  Practices, 100 SEO; LCP 1.4 s, CLS 0, TBT 20 ms.
- Live axe via pinned Playwright: zero WCAG 2 AA violations on all five routes.
- Live link crawl: 14/14 URLs returned 2xx after redirects.
- Live privacy audit: landing and demo sent no sentinel in URLs/bodies; no
  sentinel appeared in local/session storage, IndexedDB, or Cache Storage.
- Live offline audit: `/demo/` reloaded after clearing HTTP cache and scrubbed
  new input with the browser offline.
- Factory verifier output: `.factory/evidence/live/verify.json`.
- Live screenshots: `.factory/evidence/live/screenshot-mobile.png`,
  `.factory/evidence/live/screenshot-desktop.png`, and
  `.factory/evidence/live/demo-mobile.png`.

## Run and package

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e -- --reporter=line
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test --all-targets
cargo package
```

Run `cargo run -- demo` for the isolated CLI sample. Review one with:

```sh
cargo run -- inspect <casefile> --password-env CASEFILE_PASSWORD --extract
```

## Known gaps and next steps

No acceptance finding or known product defect remains. Registry publication is
intentionally left to the factory credentials; the verified package is ready.
