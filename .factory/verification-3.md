# Independent product verification 3 — PASS

Date: 2026-08-28 UTC
Candidate: `d57f75099e5bd0b5c4c5d105537a1121b5e7f094`
Live URL: <https://scrubbed-log-casefile.sociobot.in>
Work order: `scrubbed-log-casefile-verify-3`

## Verdict

**PASS — release candidate accepted.** Fresh local and live evidence confirms
the deployed static product is exactly this candidate and the offline CLI's
core redaction, stable-token, encrypted-handoff job works end to end. No
release-blocking defects were found.

## Mandatory gates

### Claims — PASS (16/16)

`.factory/claims.json` is present. From the clean dependency installation,
each declared command was run separately via the product's Playwright/demo
entry point:

| Claims | Result |
|---|---|
| `browser-local`, `offline-reload`, `cli-demo`, `credential-redaction` | PASS |
| `encrypted-casefile`, `aes-256`, `password-env`, `machine-json` | PASS |
| `exit-codes`, `custom-rules`, `stable-tokens`, `atomic-output` | PASS |
| `single-binary`, `cli-local`, `team-policy-pack`, `cli-recording` | PASS |

The aggregate independent rerun, `npm run test:e2e`, passed all 26 tests.

### Cold first read and demo — PASS

Fresh desktop and 390px live visits show, above the fold:

- **What it does:** “Scrub incident logs before sharing.”
- **For whom:** “For engineers escalating bugs…”
- **First action:** one primary **Try it with sample data** action, with “Opens
  a ready example. Nothing is saved.” alongside it.

One click opens `/demo/`, already scrubbed with realistic incident sample
data. The persistent banner says “Demo — sample data, nothing is saved” and
has **Reset demo** plus **Start for real**. Reset restores the exact sample.

## Fresh local verification

| Check | Result |
|---|---|
| `npm ci`; `npm audit --audit-level=high` | PASS; 61 packages, 0 vulnerabilities |
| `npm test` | PASS; 3/3 |
| `npm run typecheck`; `npm run lint` | PASS |
| `cargo fmt --check`; `cargo clippy --all-targets -- -D warnings` | PASS |
| `cargo test --all-targets` | PASS; 4 library + 12 integration tests |
| `npm run test:e2e` | PASS; 26/26 |
| `npm run build` | PASS; produces `dist/site` |
| `cargo package --allow-dirty` | PASS; 12 files, 72.7 KiB unpacked / 20.1 KiB compressed |
| `npm pack --dry-run` | PASS |

The production bundle is 2.25 KiB gzip initial home JavaScript, 3.25 KiB gzip
CSS, no web fonts, and a 105,038-byte hero image: all are below the stated
budgets. A fresh Lighthouse invocation could not complete against the
provisioned Chromium (the current Lighthouse launcher could not connect); the
bundle measurements and browser/axe checks above are fresh evidence. The
repository does not supply the requested `verify-url.sh`; equivalent live
title/lang/landmark/alt/error checks were performed in Playwright.

## CLI consumer and behavior

The packaged crate was installed into a fresh temporary Cargo root. It exposed
only `casefile` at version `0.1.2`. `casefile demo --json` made two bundled
sample files and an encrypted archive with eight redactions.

Independent normal and recovery checks passed:

- representative authorization, assignment, quoted JSON assignment, email,
  IPv4, JWT, private-key, and URL-credential inputs are covered by the
  decrypting Rust integration tests;
- same-case values receive stable tokens and a new case receives different
  tokens;
- custom named-value rules preserve context;
- generated ZIP entries are AES-256 and the manifest is value-free;
- a parser error and a missing password variable each returned one JSON object
  on stdout, empty stderr, and exit `2`;
- the automated integration suite verifies exact `0`/`2`/`1` exit behavior,
  atomic output preservation, and temporary-file cleanup.

## Live deployment, privacy, and accessibility

### Candidate identity and policy

Fresh `dist/site` hashes exactly equal live bytes for home, demo, privacy,
terms, 404, all built JS/CSS/assets, service worker, manifest, robots, and
sitemap. Home SHA-256 is
`931b212107b0d4e6d87377b5c923c7ba566b2bac9266a732b47d4eb88fc2b339`;
the live service worker SHA-256 is
`cde9cbcfe68b61cfdb651b34db4c6fc734a7c3804e1569358145d9c37f610261`.

Home, demo, privacy, and terms return 200; an unknown route returns the
designed response with HTTP 404. Live headers include CSP restricted to self
plus the documented Sociobot API connection, HSTS, `no-referrer`, no-sniff,
frame denial, and Permissions-Policy. HTML and service worker are `no-cache`;
hashed assets are one-year immutable; the manifest has the correct
`application/manifest+json` type.

### Browser and privacy

- No console errors, page errors, or failed initial requests occurred at
  desktop or 390px mobile.
- Complete demo use (load, edit, scrub, reset) made only same-origin requests.
  It stored no localStorage, sessionStorage, or IndexedDB data. Scrubbing made
  no request.
- After service-worker activation and browser-cache clearing, `/demo/`
  reloaded offline and scrubbed a new email successfully.
- Keyboard Tab reaches the skip link first with a visible 3px focus outline;
  Enter moves focus to main. At 390px and 200% text, page width remains 390px.
  Reduced motion changes scrolling to `auto`.
- Fresh `@axe-core/playwright` scans found zero violations on `/`, `/demo/`,
  `/privacy/`, `/terms/`, and `/404.html` (therefore zero serious/critical
  findings).

The free demo requires no sign-in, so the Entra tenant requirement is not
applicable. The paid checkout link returns the documented Sociobot API 303 to
hosted Dodo checkout; no payment was initiated.

### Server-side allowance

The documented license-verification endpoint was exercised with one client
and an invalid token. Requests 1–30 returned 200 invalid-license JSON;
requests 31–36 returned **429** with `Retry-After: 4` and
`X-RateLimit-After: 4`. Observed allowance: **30 requests per active window**.

## Defects by severity

None found.
