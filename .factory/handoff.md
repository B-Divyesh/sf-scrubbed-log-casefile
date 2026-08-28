# Adversarial review 2 handoff — FAIL

Date: 2026-08-28 UTC

Work order: `scrubbed-log-casefile-review-2`

Reviewed commit: `59a3167fbfb9fc753008d907e84c522c6ba60560`

## Delivered

- Performed a fresh phone and desktop first-read review of the live product.
- Audited every landing and README sentence, headings, controls, terminology,
  and public claims.
- Exercised the browser demo, reset, start-for-real path, storage isolation,
  request privacy, offline reload, and the CLI demo from a temporary directory.
- Ran all 17 declared claim commands independently from a clean clone.
- Rechecked every finding in `.factory/review-1.md` against live behavior and
  current code.
- Crawled all links; checked metadata, 404 behavior, navigation focus, default
  touch targets, reduced motion, and live accessibility at 390 and 1440.
- Wrote the complete result to `.factory/review-2.md`. No product code was
  changed.

## Verdict and known gaps

**FAIL.** The review contains six blocking findings, including reopened
F-1-2 and F-1-4. The phone demo hides its ready output below the first screen;
the license reconnect message is false; the stable-token claim test does not
pack two real casefiles; and browser recognition is absent from the claim
inventory. Medium and minor findings cover further claim gaps, demo fidelity,
mobile facts/touch targets, footer structure, missing casefile inspection, and
plain-language copy.

See `.factory/review-2.md` for exact quotes, evidence, and concrete fixes.

## Verification

- 17/17 individual claim commands: passed from
  `/tmp/casefile-review2-clean.BsThPT/repo`.
- `npm test`: 3/3 passed.
- `npm run typecheck`; `npm run lint`: passed.
- `npm run build`: passed; output `dist/site`.
- `npm run test:e2e -- --reporter=line`: 31/31 passed; review identifies the
  missing assertions that allow the defects through.
- `cargo fmt --check`; `cargo clippy --all-targets -- -D warnings`: passed.
- `cargo test --all-targets`: 4 library and 12 integration tests passed.
- Live Playwright axe: zero WCAG 2 AA violations across five routes at both
  viewports.
- Factory `verify-url.sh`: passed in 823 ms with no console errors.
- Link crawl: all 14 discovered URLs returned 200 after redirects.
- Standalone axe CLI was attempted but could not create its Selenium Chrome
  session; the pinned Playwright axe checks completed successfully.

## Reproduce the review gates

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run test:e2e -- --reporter=line
npm run build
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test --all-targets
cargo run --quiet -- demo --json
```

Use fresh browser contexts at 390×844 and 1440×900 against
<https://scrubbed-log-casefile.sociobot.in>. The review records the additional
manual paths not covered by the current suite.
