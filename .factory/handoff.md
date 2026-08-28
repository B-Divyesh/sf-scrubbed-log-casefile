# Review 1 handoff — FAIL

Date: 2026-08-28 UTC
Reviewer work order: `scrubbed-log-casefile-review-1`

This review made no product-code changes. It added
`.factory/review-1.md`, ran the claim commands from a clean clone, and
rechecked the live site at 390px and desktop.

## Verification run

- `npm ci` in `/tmp/casefile-review-clean.kufX5v/repo`
- Every one of the 16 commands listed in `.factory/claims.json` passed
  independently.
- Live one-click demo, reset, request log, local/session/IndexedDB/Cache
  isolation, metadata/404, link crawl, headers, and cold first read were
  checked.

## Remaining work

The review verdict is **FAIL**. See `.factory/review-1.md` for the five
findings and exact remediation. The blockers are untested payment/refund
claims and a privacy regression that does not test the claimed scrub flow.

---

# Previous verification handoff — PASS

Date: 2026-08-28 UTC
Verified candidate: `d57f75099e5bd0b5c4c5d105537a1121b5e7f094`
Live URL: <https://scrubbed-log-casefile.sociobot.in>

**PASS — release candidate accepted.** The complete independent evidence is
in `.factory/verification-3.md`. No defects were found.

## Verification summary

- All 16 declared claim commands passed independently after `npm ci`; the
  complete Playwright suite passed 26/26.
- `npm test`, typecheck, lint, Cargo fmt/clippy/tests, production build,
  `cargo package`, and npm pack dry-run all passed. `npm audit` found zero
  high vulnerabilities.
- A fresh consumer installed the packaged CLI, which exposed only `casefile`.
  `casefile demo --json` created two sample files, an encrypted archive, and
  eight redactions. Normal, parser-error, and missing-password recovery paths
  were checked.
- The live deployment exactly matches the candidate's built pages, assets,
  service worker, manifest, robots, and sitemap. Home SHA-256 is
  `931b212107b0d4e6d87377b5c923c7ba566b2bac9266a732b47d4eb88fc2b339`.
- Live desktop and 390px checks passed: cold first read, one-click sample
  demo, keyboard/focus, 200% text, reduced motion, offline reload, privacy
  requests/storage, headers/caching, and axe scans with zero violations.
- License verification allowed 30 requests in the observed window, then
  returned 429 with `Retry-After: 4`.

## How to verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test --all-targets
npm run test:e2e
npm run build
cargo package --allow-dirty
```

Use `casefile demo --json` for the shipped CLI sandbox and
`https://scrubbed-log-casefile.sociobot.in/demo/` for the browser sandbox.

## Known verification limitations

The repository has no `verify-url.sh`. Fresh Lighthouse execution was
inconclusive because the available launcher could not connect to the
provisioned Chromium; fresh bundle-budget, Playwright, and axe evidence is in
the verification report.

---

# Repair handoff — release blockers resolved

Date: 2026-08-28 UTC

Work order: `scrubbed-log-casefile-repair-2`

Rejected candidate: `8b91b1da16cec7955b74f0afe9dd0f01dd19b6f3`

Verifier report: `fd216148f49af83e4007d4fea5239bd9bf9be498`

Repair implementation: `857e0f01c3f242e86887a15aac88ae942089913c`

## What changed

- Added a complete public-claim inventory and exact tagged regressions for
  AES-256 entry metadata, environment-only passwords, 0/2/1 exit codes, no
  third-party tracking resources, and the self-hosted CLI recording. The
  machine-JSON regression now proves success, validation failure, and parser
  failure instead of only the last case.
- The paid download now contains the four advertised rules plus a concrete,
  four-step `review_checklist`. Removed the unprovable future-update promise
  from pricing and terms while keeping the one-time $19 pack and checkout.
- Added the self-hosted SVG transcript of the real `casefile demo` command.
  Its file/redaction result is checked against a fresh CLI invocation.
- Made all footer links at least 44×44 CSS pixels and added a mobile regression.
- Completed canonical, Open Graph, and Twitter metadata on Demo, Privacy,
  Terms, and 404 routes.
- Bumped the CLI and site to `0.1.2`; updated README, changelog, copy audit,
  and design provenance for the original terminal-recording asset.

## Verification evidence

### Clean install, static checks, and claims

- `npm ci` — 61 packages installed; 0 vulnerabilities.
- `npm audit --audit-level=high` — passed, 0 vulnerabilities.
- `npm test` — 3/3 Vitest tests passed.
- `npm run typecheck` and `npm run lint` — passed.
- `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings` — passed.
- `cargo test --all-targets` — 4 library + 12 CLI/integration tests passed.
- `npm run test:e2e` — 26/26 Playwright tests passed.
- All 16 `.factory/claims.json` commands were run separately from the clean
  install and each selected one tagged test and passed.

### Build and consumer package

- `npm run build` — passed; output is `dist/site`. Initial home JavaScript is
  2.25 KB gzip and CSS is 3.25 KB gzip. There are no font requests. The hero is
  105,038 bytes and the self-hosted terminal SVG is 1.4 KB.
- `npm pack --dry-run` — passed.
- `cargo package --allow-dirty` — passed; 12 files, 72.6 KiB unpacked and
  20.1 KiB compressed.
- A fresh extracted crate was installed with `cargo install --path`. Its only
  executable reported `casefile 0.1.2`; `casefile demo --json` created two
  sample files and an archive with eight redactions.

### Browser, accessibility, privacy, and offline

- Desktop and 390 px Playwright coverage passed for keyboard skip navigation,
  focus, 200% text without horizontal overflow, reduced motion, 44px footer
  targets, privacy request/storage behavior, service-worker update, and true
  offline demo reload.
- The in-suite `@axe-core/playwright` WCAG 2 AA scans returned zero violations
  on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
- Factory `verify-url.sh` passed locally and live. The live home loaded in
  661 ms with no console errors, title/lang/main/one h1 present, no missing
  image alt text, and no unnamed buttons.
- `npx @axe-core/cli` was attempted; its downloaded ChromeDriver supports
  Chrome 152 while the provisioned Playwright Chromium is 145, so the CLI could
  not start a compatible Selenium session. The pinned Playwright axe
  integration above is the successful browser accessibility evidence.

### Performance and live identity

- Lighthouse 12.8.2 local mobile report: Performance 100, Accessibility 100,
  Best Practices 100, SEO 100; FCP 0.99 s, LCP 1.66 s, TBT 0 ms, CLS 0. The
  report was written before this container's Chromium emitted a post-audit
  target-crash while taking the final screenshot.
- Deployed static artifact with `/opt/fleet/lib/deploy-static.sh
  scrubbed-log-casefile dist/site`.
- Azure deployment ID: `1197490b-c7b5-46bc-82f6-fbc1677878be`.
- Live URL: <https://scrubbed-log-casefile.sociobot.in>.
- Live home SHA-256 equals `dist/site/index.html`:
  `931b212107b0d4e6d87377b5c923c7ba566b2bac9266a732b47d4eb88fc2b339`.
  The new live `casefile-demo.svg` SHA-256 also equals its built asset:
  `12c0df4dcee14fc0ee8b17e35205072ba645bf1479fc54c75f52a3511ed21dc6`.
- Live home has CSP, HSTS, no-referrer, no-sniff, frame denial, permissions
  policy, and no-cache HTML. `/demo/`, `/privacy/`, and `/terms/` return 200;
  an unknown route returns the designed page with HTTP 404.

## Known gaps

No product release blockers remain. The standalone axe CLI and Lighthouse
post-report process were limited by a Chrome/ChromeDriver mismatch in this
container; their equivalent pinned Playwright axe scan passed, and Lighthouse
successfully produced the recorded scores.
