# Polish 3 — zero-finding closure

Date: 2026-08-28 UTC
Work order: `scrubbed-log-casefile-polish-3`
Base reviewed: `aab7f00a4c7eb1b98e76d8e119e97b54481e296b`
Repair commit: `f1238b3`
Deployment: `5778fec9-e7da-4b89-ac08-4f0a567b575f`
Live URL: <https://scrubbed-log-casefile.sociobot.in>

I read every `review-*.md` and `polish-*.md` before this repair. The live
evidence root is `.factory/evidence/polish-3-live/`: `live-home-390.png`,
`live-home-1440.png`, `live-demo-390.png`, `verify.json`,
`live-audit.json`, `live-route-audit.json`, `live-bundle-audit.json`, and
`lighthouse-mobile-rerun.json`. The clean clone was
`/tmp/scrubbed-polish3-clean.PUzQkk/repo`.

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Kept merchant-of-record, refund, and refund-revocation promises out of product copy; retained only the fixture-tested $19 pack. | `@claim:team-policy-pack`; home capture `live-home-1440.png`; live `/` payment-copy absence check in `live-audit.json`. |
| F-1-2 | Kept the landing and demo sentinel scrub, request-body/URL, local/session/IndexedDB/cache, real-key-preservation, and route-resource checks. | `@claim:browser-local`; `live-audit.json` records live input redaction and no input requests at `/` and `/demo/`; `live-demo-390.png`. |
| F-1-3 | Kept the art, stamp, and caption within both audited viewports. | `hero evidence and caption stay within the 390px/1440px viewport`; `live-home-390.png`, `live-home-1440.png`; live `/` bounds audit. |
| F-1-4 | Kept h1 focus and polite announcements for header, footer, wordmark, and Back paths. | `normal routes keep navigation, announce the destination, and focus its h1 on forward and back`; live `/privacy/` → `/terms/` → `/` focus audit in `live-audit.json`. |
| F-1-5 | Kept the four-link header and literal workflow wording on every route. | `normal routes keep navigation…`; `live-route-audit.json` for `/`, `/demo/`, `/privacy/`, `/terms/`, `/404.html`; `live-home-390.png`. |
| F-2-1 | Kept the ready before/after result and summary in the phone demo’s first viewport. | `the ?demo=1 entry point opens the isolated demo…`; `live-demo-390.png`; live `/?demo=1` → `/demo/` check in `live-audit.json`. |
| F-2-2 | Kept reconnect verification for a saved license and plain offline copy. | `@claim:license-reconnect`; live `/` route passed in `live-route-audit.json`; `live-home-390.png`. |
| F-2-3 | Kept two real packed and decrypted casefiles in the stable-replacement regression. | `@claim:stable-tokens`; Rust `separate_cli_casefiles_use_fresh_salts_and_stable_tokens`; live install instructions at `/#install` in `live-home-1440.png`. |
| F-2-4 | Kept the browser feature inventory and exercised every listed rule class. | `@claim:browser-redaction`; live `/demo/` rule-class scrub in `live-audit.json`; `live-demo-390.png`. |
| F-2-5 | Kept the in-memory per-page/reset boundary and changed its wording to user-visible replacement behavior. | `@claim:browser-redaction`; live fresh-page token comparison in `live-audit.json`; `live-demo-390.png`. |
| F-2-6 | Kept CLI demo proof for two files, new directory, paths, password, redaction count, and human/JSON output. | `@claim:cli-demo`; clean-clone command pass; live install recording at `/#install` in `live-home-1440.png`. |
| F-2-7 | Kept manifest proof for one fingerprint per file, rule names, counts, and no raw values. | `@claim:manifest-contents`; Rust `manifest_has_salted_fingerprints_rule_names_counts_and_no_values`; live manifest preview at `/` in `live-home-1440.png`. |
| F-2-8 | Kept the offline promise limited to the demo and tested a real cold offline reload. | `@claim:offline-reload`; live `/demo/` reload-and-scrub result in `live-route-audit.json`; `live-demo-390.png`. |
| F-2-9 | Kept all three facts inside the 390×844 first screen. | `cold first screen names engineers and has one sample-data action`; `live-home-390.png`; live `/` rectangle audit. |
| F-2-10 | Kept every visible header/footer link at least 44×44px before 200% text scaling. | `keyboard, 200% text, touch targets, and accessibility pass at 390px`; `live-home-390.png`; live `/` touch-target audit. |
| F-2-11 | Kept the required product one-liner in every footer. | Route metadata/axe tests; `live-route-audit.json`; `live-home-1440.png`. |
| F-2-12 | Kept `casefile inspect` manifest display and safe temporary extraction. | `@claim:inspect-casefile`; Rust `inspect_displays_manifest_and_extracts_scrubbed_files_safely`; live `/#install` in `live-home-1440.png`. |
| F-2-13 | Kept the heading “Test an incident log fragment.” | `plain-language sample, replacement, and license wording stays consistent`; live `/` in `live-home-1440.png`. |
| F-2-14 | Kept the workflow result heading “Create the encrypted ZIP.” | Route/copy browser suite; live `/` in `live-home-1440.png`. |
| F-2-15 | Kept the direct limits heading. | Route/copy browser suite; live `/` in `live-home-1440.png`. |
| F-2-16 | Kept the art label informational, now standardized as “SAMPLE REDACTED LOG.” | `plain-language sample, replacement, and license wording stays consistent`; `live-home-390.png`; live `/` audit. |
| F-2-17 | Kept case lore absent and stated the matching-replacement result directly. | `plain-language sample, replacement, and license wording stays consistent`; `live-home-1440.png`; live `/` audit. |
| F-2-18 | Kept the concrete partial-casefile failure explanation. | `@claim:atomic-output`; live `/#install` in `live-home-1440.png`. |
| F-2-19 | Kept the factual “Free CLI and $19 team policy pack” pricing heading. | `@claim:team-policy-pack`; live `/` price area in `live-home-1440.png`. |
| F-2-20 | Kept “personal-data” in place of the unexplained acronym in README. | clean-clone README audit in `plain-language sample, replacement, and license wording stays consistent`; live privacy route in `live-route-audit.json`. |
| F-2-21 | Kept replacement behavior in direct language rather than “case-scoped tokens.” | `@claim:stable-tokens`; README copy regression; live `/` workflow in `live-home-1440.png`. |
| F-2-22 | Kept the manifest described with names, counts, and excluded matched values. | `@claim:manifest-contents`; README audit; live `/` manifest preview in `live-home-1440.png`. |
| F-2-23 | Kept “casefile” as the output term after defining it as an encrypted ZIP. | README/source audit; live `/#install` in `live-home-1440.png`. |
| F-2-24 | Kept one detector as a rule and its collection as a policy file. | `@claim:custom-rules`; live preview copy at `/` in `live-home-1440.png`. |
| F-3-1 | Replaced every user-facing “example” reference with “sample,” including the hero, art label, empty state, accessible label, and internal button id. | `plain-language sample, replacement, and license wording stays consistent`; `live-home-390.png`; live `/` audit. |
| F-3-2 | Replaced salt/correlation language with matching and different replacements in the demo, README, demo docs, claims, and inspected manifest description. | `@claim:browser-redaction`, `@claim:stable-tokens`, `@claim:manifest-contents`; `live-demo-390.png`; live `/demo/` audit plus README regression. |
| F-3-3 | Replaced “replacement tokens” with “matching replacements.” | `plain-language sample, replacement, and license wording stays consistent`; `live-home-1440.png`; live `/` audit. |
| F-3-4 | Replaced the generic “CORE” stamp with “FREE CLI.” | `plain-language sample, replacement, and license wording stays consistent`; `live-home-1440.png`; live `/` audit. |
| F-3-5 | Replaced the internal “saved verdict” error with “Your last license status is unchanged,” and made Privacy use the same term. | `plain-language sample, replacement, and license wording stays consistent`; `live-bundle-audit.json` verifies the deployed dynamic string at `/`; `live-home-390.png`. |

## Verification

- Fresh remote clone: all 21 exact commands in `.factory/claims.json` passed
  independently after `npm ci`.
- Fresh clone full suite: `npm test` (3/3), typecheck, lint, build,
  Playwright (36/36), `cargo fmt --check`, clippy with `-D warnings`,
  `cargo test --all-targets` (4 library + 15 integration), and
  `cargo package --allow-dirty` all passed.
- Live `verify-url.sh`: HTTP 200, title/lang/main/alt/button checks, and zero
  console errors; evidence `verify.json`.
- Live Playwright axe: zero WCAG 2 AA violations on five routes; each route
  also had one h1, one main, a route title, and zero console errors. The demo
  cold-reloaded offline and scrubbed new data. Evidence:
  `live-route-audit.json`.
- Live browser audit rechecked demo isolation, reset, rule classes, fresh demo
  replacements, privacy requests, mobile first screen, hero containment,
  focus/announcements, headers, footer, and 404. Evidence: `live-audit.json`.
- Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 0.9 s, LCP 1.4 s, CLS 0, TBT 10 ms. Evidence:
  `lighthouse-mobile-rerun.json`.

No review finding remains open.
