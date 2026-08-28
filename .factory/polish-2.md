# Polish 2 — cumulative finding closure

Date: 2026-08-28 UTC

Work order: `scrubbed-log-casefile-polish-2`

Implementation commit: `a5eb79f4`

Deployment: `bc702d1f-f982-482e-a1c2-2a4c91266650`

Live URL: <https://scrubbed-log-casefile.sociobot.in>

All tests named below passed from the clean clone at
`/tmp/casefile-polish2-final.oK8QuY/repo`. Every `@claim:*` test also passed
individually from that clone. Live screenshots are under
`.factory/evidence/live/`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept unproved merchant/refund statements absent from landing, README, and Terms. Retained only the fixture-tested price and pack contents. | `@claim:team-policy-pack`; live `/` and `/terms/`; 14-link live crawl. |
| F-1-2 | Expanded one privacy regression across landing scrub, the `?demo=1` transition, demo scrub/reset, every public route, request URLs/bodies, real namespace preservation, local/session storage, IndexedDB, and Cache Storage. | `@claim:browser-local`; live sentinel/storage audit; `live/verify.json`. |
| F-1-3 | Kept the evidence figure, stamp, and caption inside both phone and desktop viewports. | `hero evidence and caption stay within…` at 390 and 1440; `live/screenshot-mobile.png`; `live/screenshot-desktop.png`. |
| F-1-4 | Route marking now covers every same-origin route link, including footer links and the wordmark, with h1 focus and polite announcement on forward and Back. | `normal routes keep navigation…`; live Footer Terms → wordmark → Back audit. |
| F-1-5 | Preserved the same four-link navigation on every route and kept the workflow heading in plain task language. | `normal routes keep navigation…`; five-route live crawl and axe scan. |
| F-2-1 | Added a compact ready before/after result above the phone editor, with repeated email and credential replacements plus a summary. | `the ?demo=1 entry point…`; `live/demo-mobile.png`; cold live 390×844 rectangle check. |
| F-2-2 | Reconnection now calls license verification for a saved token; offline copy says exactly what happens. | `@claim:license-reconnect`; fixture asserts one request and active verdict. |
| F-2-3 | Replaced the unit-only wrapper with two real `casefile pack` runs, decrypted both casefiles, compared within-case and cross-case replacements, and inspected both manifests. | `@claim:stable-tokens`; Rust `separate_cli_casefiles_use_fresh_salts_and_stable_tokens`. |
| F-2-4 | Added an inventory claim and browser-boundary test for emails, IPv4, credentials, bearer tokens, JWTs, and repeated correlation. | `@claim:browser-redaction`. |
| F-2-5 | Browser pages and resets now generate fresh in-memory salts; repeated values match only inside that demo case. The UI states this boundary. | `@claim:browser-redaction`; fresh-page live token comparison. |
| F-2-6 | Extended the CLI demo claim to check two files, redactions, unique temporary root, sample and casefile paths, password, and human output. | `@claim:cli-demo`. |
| F-2-7 | Added a manifest claim that decrypts and parses a real manifest, checks the per-file salted SHA-256 fingerprint, rule list, exact counts, and seeded-value absence. | `@claim:manifest-contents`; Rust `manifest_has_salted_fingerprints_rule_names_counts_and_no_values`. |
| F-2-8 | Narrowed Privacy to the tested demo offline boundary. | `@claim:offline-reload`; cold live service-worker reload with HTTP cache cleared. |
| F-2-9 | Moved the three facts above the CTA and tightened only the phone hero spacing. | `cold first screen names engineers…`; `live/screenshot-mobile.png`; all fact bottoms ≤844px live. |
| F-2-10 | Added width, padding, and centered layout so every header link is at least 44×44px before text scaling. | `keyboard, 200% text, touch targets…`; live default-size rectangle audit. |
| F-2-11 | Every footer now says “Scrub incident logs locally before sharing,” while retaining Privacy, Terms, Param Factory, and v0.1.3. | Five-route metadata/axe tests; live route crawl. |
| F-2-12 | Added `casefile inspect`, which shows the decrypted manifest and optionally extracts scrubbed files through validated relative paths into a new temporary directory. Errors clean up; wrong passwords fail before extraction. | `@claim:inspect-casefile`; Rust `inspect_displays_manifest_and_extracts_scrubbed_files_safely`; `cargo package`. |
| F-2-13 | Rewrote the heading to “Test an incident log fragment.” | `.factory/copy-audit.md`; `live/screenshot-desktop.png`. |
| F-2-14 | Rewrote the step to “Create the encrypted ZIP” and defined a casefile once. | `.factory/copy-audit.md`; live `/`. |
| F-2-15 | Rewrote the heading to “Limits of rule-based log scrubbing.” | `.factory/copy-audit.md`; live `/`. |
| F-2-16 | Replaced the decorative stamp with “EXAMPLE REDACTED LOG.” | 390/1440 hero containment tests; live screenshots. |
| F-2-17 | Removed “CASE 001” and sealing lore; the caption now explains matching replacement tokens. | `.factory/copy-audit.md`; live screenshots. |
| F-2-18 | Replaced atomicity jargon and its duplicate with “A failed run leaves no partial casefile.” | `@claim:atomic-output`; `.factory/copy-audit.md`. |
| F-2-19 | Rewrote the pricing heading to “Free CLI and $19 team policy pack.” | `@claim:team-policy-pack`; live `/`. |
| F-2-20 | Replaced README’s “PII” with “personal-data.” | Plain-word source audit; `.factory/copy-audit.md`. |
| F-2-21 | Replaced “case-scoped tokens” with “The same value gets the same replacement within one casefile.” | `@claim:stable-tokens`; `.factory/copy-audit.md`. |
| F-2-22 | Replaced “value-free rule manifest” with the concrete rule-names, counts, and unmatched-values explanation. | `@claim:encrypted-casefile`; `@claim:manifest-contents`. |
| F-2-23 | Defined the output once as a casefile (an AES-256 encrypted ZIP), then used “casefile” consistently. | README/source terminology audit; `.factory/copy-audit.md`. |
| F-2-24 | Standardized one detector as a “rule” and its JSON collection as a “policy file,” including the empty result. | `@claim:custom-rules`; `.factory/copy-audit.md`. |

## Cumulative verification

- Clean clone: all 21 `.factory/claims.json` commands passed independently.
- Clean clone full suite: 4 library tests, 15 CLI integration tests, 3 Vitest
  tests, and 35 Playwright tests passed.
- `cargo fmt --check`, clippy with warnings denied, typecheck, lint, build, and
  `cargo package` passed.
- Build output: home JS 2.28 KiB gzip and CSS 3.50 KiB gzip.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices
  100, SEO 100; LCP 1.4 s, CLS 0, TBT 20 ms.
- Live Playwright axe: zero WCAG 2 AA violations on `/`, `/demo/`, `/privacy/`,
  `/terms/`, and `/404.html`.
- Factory live verifier: HTTP 200, zero console errors, correct title/lang,
  one h1, main landmark, complete image alt text, and labelled buttons.
- Live link crawl: all 14 discovered URLs returned 2xx after redirects.
- Cold production audit passed first-screen facts, one-click isolated demo,
  reset, fresh salt, request/storage privacy, route focus, 404, and offline use.

No finding from either adversarial review remains open.
