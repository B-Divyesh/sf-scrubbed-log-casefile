# Adversarial first-read review 3 — FAIL

Date: 2026-08-28 UTC

Live URL: <https://scrubbed-log-casefile.sociobot.in>

Reviewed commit: `aab7f00a4c7eb1b98e76d8e119e97b54481e296b`

## Verdict

**FAIL.** The product is clear on first read, the sample opens in one click,
all 21 declared claim commands pass independently from a clean clone, and no
blocking defect was found. Five minor copy findings remain. The required
zero-findings threshold therefore is not met.

## Findings

### F-3-1 — MINOR — the landing page uses “sample” and “example” for the same data

**Locations and exact text:** hero action “Try it with sample data”; adjacent
copy “Opens a ready example”; art label “EXAMPLE REDACTED LOG”; preview action
“Load sample”; empty result “load the example.”

**Why this impedes a first-time visitor:** switching nouns implies that the
hero example, browser sample, and loaded input may be different things. The
plain-words contract requires one term for one concept.

**Concrete fix:** use **sample** throughout: “Opens a ready sample,” “SAMPLE
REDACTED LOG,” and “Paste a log fragment or load the sample, then try again.”

### F-3-2 — MINOR — cryptographic implementation jargon replaces the user-visible result

**Locations and exact text:** demo summary “Fresh in-memory salt for this demo
case”; README “A fresh in-memory salt keeps repeated values correlated only
within one demo case”; README “A second casefile uses a fresh salt”; README
“The manifest records one salted fingerprint per file.”

**Why this impedes a first-time visitor:** “salt,” “salted fingerprint,” and
“correlated” require cryptographic context. The useful facts are whether
replacements match and whether a new casefile can be linked to the old one.

**Concrete fix:** use “A new demo uses different replacements”; “Repeated
values match within one demo page. A new page uses different replacements”;
“A second casefile uses different replacements”; and “The manifest records a
one-way file fingerprint that differs between casefiles.” Keep the existing
tests for the same behavior.

### F-3-3 — MINOR — “replacement tokens” breaks the established term

**Location and exact text:** landing hero caption “Repeated values keep
matching replacement tokens.” Other landing and README copy calls these
“replacements.”

**Why this impedes a first-time visitor:** “token” already refers to license,
bearer, and JWT values elsewhere. Reusing it for scrubbed placeholders creates
an avoidable terminology collision.

**Concrete fix:** “Repeated values get matching replacements.”

### F-3-4 — MINOR — “CORE” is a generic pricing-card label

**Location and exact text:** landing pricing card eyebrow “CORE.”

**Why this impedes a first-time visitor:** the label does not say what the
card contains and could appear unchanged on any product. It adds no usable
information above “Casefile CLI” and “$0.”

**Concrete fix:** replace it with “FREE CLI” or remove it.

### F-3-5 — MINOR — the license error exposes the internal term “verdict”

**Location and exact text:** landing error state “The saved verdict is
unchanged; try again when connected.”

**Why this impedes a first-time visitor:** “verdict” describes internal stored
state, not the purchase status the visitor is trying to recover.

**Concrete fix:** “Your last license status is unchanged. Try again when
connected.”

## Cold first read

Fresh Chromium contexts opened the production root at 390×844 and 1440×900.
Nothing was scrolled before this assessment.

| Question | First-read answer | Exact first-screen evidence |
|---|---|---|
| What does this do? | It removes common sensitive values from incident logs before they are shared. | “Scrub incident logs before sharing” |
| For whom? | Engineers escalating a bug. | “For engineers escalating bugs…” |
| What should I click first? | Open the ready sample. | “Try it with sample data” and “Opens a ready example. Nothing is saved.” |

All three answers and all three facts were visible without scrolling on both
viewports. The first-read gate passes.

## Copy audit

Words are split on whitespace after standalone punctuation separators are
removed. Hyphenated terms, code spans, and a URL each count as one word. Code
blocks and sample log payloads are not prose. Dynamic landing states are
included because errors and empty states are product copy. No sentence exceeds
22 words and no banned marketing adjective appears.

### Landing-page sentences

| Sentence | Words | Result |
|---|---:|---|
| Offline. | 1 | Pass |
| The sample scrubber still works. | 5 | Pass |
| Reconnect to verify a saved license. | 6 | Pass |
| For engineers escalating bugs, it keeps useful structure while replacing common credentials and identifiers. | 14 | Pass |
| Opens a ready example. | 4 | F-3-1 |
| Nothing is saved. | 3 | Pass |
| Repeated values keep matching replacement tokens. | 6 | F-3-3 |
| The preview changes text in this tab. | 7 | Pass |
| It sends no scrub input and saves no scrub input. | 10 | Pass |
| Recognizes common emails, IPv4 addresses, credentials, bearer tokens, and JWTs. | 10 | Pass |
| Run the scrubber to create a preview. | 7 | Pass |
| Waiting for input. | 3 | Pass |
| Scrub and package an incident log. | 6 | Pass |
| Point one command at files or directories. | 7 | Pass |
| The same value gets the same replacement within one casefile. | 10 | Pass |
| A casefile is an AES-256 encrypted ZIP with rule names and counts, not matched values. | 15 | Pass |
| Rules cannot find every secret or identifier. | 7 | Pass |
| Review the casefile before sharing. | 5 | Pass |
| This is not a log host or cloud scrubber. | 9 | Pass |
| Run the bundled sample first, then pack your own incident files. | 11 | Pass |
| Recorded from the shipped casefile demo command. | 7 | Pass |
| It creates two sample files and one casefile in a new temporary directory, then prints its paths and password. | 19 | Pass |
| Password stays out of arguments. | 5 | Pass |
| Read it from CASEFILE_PASSWORD or another variable. | 7 | Pass |
| A failed run leaves no partial casefile. | 7 | Pass |
| Existing output remains unless you pass --force. | 7 | Pass |
| Review before sharing. | 3 | Pass |
| casefile inspect shows the manifest and can extract scrubbed files into a new temporary directory. | 15 | Pass |
| The CLI stays MIT-licensed. | 4 | Pass |
| The optional team pack adds four policy starters and a review checklist. | 12 | Pass |
| No active team-pack license on this device. | 7 | Pass |
| Team pack ready. | 3 | Pass |
| Download the AWS, Kubernetes, PostgreSQL, and HTTP starter rules with the team review checklist. | 14 | Pass |
| Nothing to scrub yet. | 4 | Pass |
| Paste a log fragment or load the example, then try again. | 11 | F-3-1 |
| No built-in rule matched. | 4 | Pass |
| Add a project rule in a policy file. | 8 | Pass |
| Copy was blocked by the browser. | 6 | Pass |
| Select the text and copy it manually. | 7 | Pass |
| Reconnect to verify the saved license. | 6 | Pass |
| Team-pack license active on this device. | 6 | Pass |
| License no longer active. | 4 | Pass |
| You can purchase or paste another token. | 7 | Pass |
| Could not reach license verification. | 5 | Pass |
| The saved verdict is unchanged; try again when connected. | 9 | F-3-5 |
| License received. | 2 | Pass |
| Confirming it with Sociobot… | 4 | Pass |
| Verifying license… | 2 | Pass |
| Scrub incident logs locally before sharing. | 6 | Pass |

The generated success status has a four-word base plus two words for each
matched rule; with all five rules it remains under 22 words.

### Landing headings, labels, and actions

| Copy unit | Words | Result |
|---|---:|---|
| Scrub incident logs before sharing | 5 | Pass: job headline |
| LOCAL / OFFLINE / ENCRYPTED | 3 | Pass: three product facts |
| Scrubs in your browser | 4 | Pass |
| Demo works offline after one visit | 6 | Pass |
| CLI free · team pack $19 once | 6 | Pass |
| Try it with sample data | 5 | Pass: result-naming action |
| EXAMPLE REDACTED LOG | 3 | F-3-1 |
| LIVE / BROWSER-ONLY | 2 | Pass |
| Test an incident log fragment | 5 | Pass |
| Raw incident fragment | 3 | Pass |
| Load sample | 2 | Pass: result-naming action |
| Scrub this fragment | 3 | Pass: result-naming action |
| Scrubbed preview | 2 | Pass |
| Copy result | 2 | Pass: result-naming action |
| How it works | 3 | Pass |
| Collect locally | 2 | Pass |
| Scrub consistently | 2 | Pass |
| Create the encrypted ZIP | 4 | Pass |
| Clear limits | 2 | Pass |
| Limits of rule-based log scrubbing | 5 | Pass |
| Version 0.1.3 / MIT | 3 | Pass |
| Build one local binary | 4 | Pass |
| Copy command | 2 | Pass: result-naming action |
| One-time pricing | 2 | Pass |
| Free CLI and $19 team policy pack | 7 | Pass |
| CORE | 1 | F-3-4 |
| Casefile CLI | 2 | Pass |
| Install the CLI | 3 | Pass: result-naming action |
| Team pack | 2 | Pass |
| Policy starters | 2 | Pass |
| Buy the team pack | 4 | Pass: result-naming action |
| Restore a purchase | 3 | Pass |
| Verify license | 2 | Pass: result-naming action |
| Download policy pack | 3 | Pass: result-naming action |

### README copy units

| Copy unit | Words | Result |
|---|---:|---|
| Scrub incident logs before sharing | 5 | Pass |
| Scrubbed Log Casefile is for engineers escalating a bug. | 9 | Pass |
| It replaces common credentials and identifiers while keeping repeated values useful inside one casefile. | 14 | Pass |
| A casefile is an AES-256 encrypted ZIP. | 7 | Pass |
| Its manifest lists rule names and counts, not matched values. | 10 | Pass |
| It is a local CLI, not a log host or complete personal-data detector. | 13 | Pass |
| Review every casefile before sharing it. | 6 | Pass |
| Try the bundled demo | 4 | Pass |
| Build the single `casefile` binary, then run the two-file sample. | 10 | Pass |
| The command creates a new temporary directory. | 7 | Pass |
| It prints the sample path, casefile path, and demo password. | 10 | Pass |
| The same sample is committed under `examples/incident/`. | 7 | Pass |
| Try the isolated browser sample at <https://scrubbed-log-casefile.sociobot.in/?demo=1>. | 7 | Pass |
| It starts ready, stores edits only in memory, and resets without touching license data. | 14 | Pass |
| Landing and demo scrubbing send no input. | 7 | Pass |
| The demo works offline after the first visit. | 8 | Pass |
| The browser rules cover emails, IPv4 addresses, credentials, bearer tokens, and JWTs. | 12 | Pass |
| A fresh in-memory salt keeps repeated values correlated only within one demo case. | 13 | F-3-2 |
| Pack an incident | 3 | Pass |
| Keep the password out of shell arguments. | 7 | Pass |
| The built-in policy file covers private keys, URL credentials, authorization headers, credential assignments, JWTs, emails, and IPv4 addresses. | 18 | Pass |
| It also supports quoted JSON and YAML credential keys. | 9 | Pass |
| The same value gets the same replacement within one casefile. | 10 | Pass |
| A second casefile uses a fresh salt. | 7 | F-3-2 |
| A failed pack keeps existing output and leaves no partial casefile. | 11 | Pass |
| Review a casefile | 3 | Pass |
| Read the manifest before sharing. | 5 | Pass |
| Add `--extract` to write scrubbed files into a new temporary review directory. | 12 | Pass |
| Safe relative paths are preserved. | 5 | Pass |
| Extraction starts in a new empty directory. | 7 | Pass |
| The manifest records one salted fingerprint per file. | 8 | F-3-2 |
| It also records rule names and hit counts without matched values. | 11 | Pass |
| Add a project rule | 4 | Pass |
| A named `value` capture replaces only the sensitive value. | 9 | Pass |
| `pack --json` writes one machine-readable success or error object. | 9 | Pass |
| Exit codes are `0` for success, `2` for invalid input, and `1` for a runtime failure. | 16 | Pass |
| Privacy and security limits | 4 | Pass |
| The CLI package contains no network or telemetry client. | 9 | Pass |
| Every ZIP entry uses AES-256 encryption with the user-held password. | 10 | Pass |
| The CLI accepts that password only through an environment variable. | 10 | Pass |
| Rules cannot detect every secret or identifier. | 7 | Pass |
| Inspect the policy file and send the casefile password through a separate channel. | 13 | Pass |
| Optional team pack | 3 | Pass |
| The CLI and safety features remain MIT-licensed. | 7 | Pass |
| A $19 one-time license adds four policy starters and a team review checklist. | 13 | Pass |
| Develop and verify | 3 | Pass |
| Every public claim and its sandbox command is listed in `.factory/claims.json`. | 11 | Pass |
| Demo isolation is documented in `.factory/demo.md`. | 6 | Pass |
| Deploy | 1 | Pass |
| `npm run build:site` writes the static site to `dist/site`. | 9 | Pass |
| The factory deploys that directory to <https://scrubbed-log-casefile.sociobot.in>. | 7 | Pass |
| This repository does not change DNS, billing, or other infrastructure. | 10 | Pass |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

The README has no sentence over 22 words. Its only copy flags are the
cryptographic terms in F-3-2.

## Demo and sandbox behavior

- The hero action opened `/demo/` in one click. At 390×844, the first demo
  viewport already showed incident `INC-1842`, raw email/password values,
  matching `<EMAIL:…>` replacements, a `<SECRET:…>` replacement, and the
  six-value summary.
- The persistent banner read “Demo — sample data, nothing is saved” and
  exposed **Reset demo** and **Start for real**. Reset restored the exact
  shipped input. Start for real opened `/#install`.
- A live landing-and-demo scrub with unique sentinels produced 19 requests,
  all to the product origin. No sentinel appeared in a URL, request body,
  localStorage, sessionStorage, IndexedDB, or Cache Storage. Seeded license and
  workspace keys remained byte-identical.
- After priming the live service worker, clearing the HTTP cache, and going
  offline, `/demo/` reloaded and replaced `offline-review3@example.com`.
- The real CLI demo ran from `/tmp/review3-cli-work-Rh0HgN`. It created
  `app.log`, `config.json`, and a 1,344-byte encrypted casefile under a new
  `/tmp/casefile-demo-*` directory, reporting eight redactions and its demo
  password.

The demo and sandbox checks pass.

## Declared claims

A local clean clone was created at
`/tmp/scrubbed-review3-clean-DItr3w` from reviewed commit `aab7f00`. After
`npm ci`, every exact command in `.factory/claims.json` ran independently.

| Claim id | Result |
|---|---|
| `browser-local` | PASS |
| `browser-redaction` | PASS |
| `license-storage` | PASS |
| `license-reconnect` | PASS |
| `offline-reload` | PASS |
| `cli-demo` | PASS |
| `credential-redaction` | PASS |
| `encrypted-casefile` | PASS |
| `manifest-contents` | PASS |
| `aes-256` | PASS |
| `password-env` | PASS |
| `machine-json` | PASS |
| `exit-codes` | PASS |
| `custom-rules` | PASS |
| `stable-tokens` | PASS |
| `atomic-output` | PASS |
| `inspect-casefile` | PASS |
| `single-binary` | PASS |
| `cli-local` | PASS |
| `team-policy-pack` | PASS |
| `cli-recording` | PASS |

Cross-checking the landing page, Privacy, Terms, and README found no unlisted
behavioral claim. The five findings are wording defects in claims that already
have tests, not missing claim coverage.

## Earlier-finding recheck

Every earlier review, polish report, and handoff was read. Each prior finding
was checked again in both production and current source/tests.

| Earlier id | Round-3 verification |
|---|---|
| F-1-1 | Fixed: merchant/refund claims remain absent; the retained price and pack contents pass `team-policy-pack`. |
| F-1-2 | Fixed: `browser-local` scrubs sentinels on landing and demo, checks all named storage surfaces, preserves real keys, and visits every public route. The live independent audit matched it. |
| F-1-3 | Fixed: hero art, label, and caption fit the 390px and 1440px viewports; both regression tests pass. |
| F-1-4 | Fixed: footer, wordmark, header, and Back navigation focus the destination h1 and update `#route-announcer`; confirmed live after animation-frame focus. |
| F-1-5 | Fixed: all five routes retain Demo / How it works / Install / Privacy; the workflow heading is literal. |
| F-2-1 | Fixed: the phone demo shows ready before/after values and the result summary above 844px. |
| F-2-2 | Fixed: reconnect invokes saved-license verification; `license-reconnect` passes. |
| F-2-3 | Fixed: `stable-tokens` creates and decrypts two real CLI casefiles. |
| F-2-4 | Fixed: `browser-redaction` covers all five published browser rule classes. |
| F-2-5 | Fixed: each demo page/reset uses a fresh in-memory case boundary while repeats match inside it. F-3-2 concerns wording only. |
| F-2-6 | Fixed: `cli-demo` verifies both files, unique directory, paths, password, redaction count, and human/JSON output. |
| F-2-7 | Fixed: `manifest-contents` checks per-file fingerprints, rules, exact counts, and raw-value absence. |
| F-2-8 | Fixed: Privacy now limits the offline promise to the tested demo. |
| F-2-9 | Fixed: all three facts fit the live 390×844 first screen. |
| F-2-10 | Fixed: no visible link or button measured below 44×44px at either audited viewport. |
| F-2-11 | Fixed: every footer includes “Scrub incident logs locally before sharing,” Privacy, Terms, builder, and version. |
| F-2-12 | Fixed: `casefile inspect` displays the manifest and safely extracts into a new directory; its claim passes. |
| F-2-13 | Fixed: the heading is “Test an incident log fragment.” |
| F-2-14 | Fixed: the workflow step is “Create the encrypted ZIP.” |
| F-2-15 | Fixed: the heading is “Limits of rule-based log scrubbing.” |
| F-2-16 | Fixed: the art label identifies an example redacted log. F-3-1 concerns the sample/example noun mismatch, not case lore. |
| F-2-17 | Fixed: “CASE 001” and “values sealed” remain absent. F-3-3 concerns terminology in the replacement caption. |
| F-2-18 | Fixed: atomicity jargon is replaced with “A failed run leaves no partial casefile.” |
| F-2-19 | Fixed: pricing is headed “Free CLI and $19 team policy pack.” |
| F-2-20 | Fixed: “PII” remains absent from README. |
| F-2-21 | Fixed: “case-scoped tokens” remains absent; the result is described directly. |
| F-2-22 | Fixed: “value-free rule manifest” remains absent; rule names, counts, and excluded values are stated. |
| F-2-23 | Fixed: the output is defined once as a casefile, an encrypted ZIP; “ZIP entry” is reserved for its files. |
| F-2-24 | Fixed: one detector is a rule and the JSON collection is a policy file. |

No earlier finding is reopened.

## Structure, accessibility, links, and visual identity

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each have `lang=en`,
  one h1, one main landmark, a route-specific title in the required pattern, a
  description, canonical, OG/Twitter metadata, and local favicon/touch icon.
  A random unknown URL returned the designed 404 with HTTP 404.
- All 14 unique discovered links returned 2xx after redirects. Hash targets
  exist. The external source and Sociobot checkout links resolve.
- Footer Terms → wordmark → Back and header navigation focused the correct h1
  and announced the new route. Direct deep links loaded their intended page.
- Live Playwright axe scans at both viewports reported zero WCAG 2 A/AA
  violations on all five routes. No console or page errors occurred. The full
  keyboard, 200% text, touch-target, reduced-motion, and route tests also pass
  locally.
- The production landing load requested only same-origin HTML, JavaScript,
  CSS, WebP, and SVG assets. Built home JavaScript is 2.29 KiB gzip and CSS is
  3.50 KiB gzip.
- The concrete-and-moss evidence slab, slab-serif/monospace pairing, hard
  borders, stamp controls, and original illustration match
  `.factory/design.md`. The site is visually distinct from a generic SaaS
  template.

These checks pass.

## Missed leverage

No missing AI, import/export, or sync feature was found. The deterministic,
offline redaction boundary is central to the brief, so sending incident logs
to an AI service would weaken the product rather than complete it. Directory
input, encrypted casefile output, custom policy import, manifest inspection,
and safe extraction cover the expected file workflow.

## Full verification

The clean clone also passed:

- `npm test` — 3/3 tests.
- `npm run typecheck` and `npm run lint`.
- `npm run build` — emitted `dist/site`.
- `npm run test:e2e -- --reporter=line` — 35/35 tests.
- `cargo fmt --check` and `cargo clippy --all-targets -- -D warnings`.
- `cargo test --all-targets` — 4 library and 15 CLI integration tests.
- `cargo package --allow-dirty` — 86.5 KiB package, 22.5 KiB compressed.

## What would make this perfect

Resolve F-3-1 through F-3-5: use **sample** consistently, describe fresh
casefile separation without “salt” or “correlated,” use **replacement** rather
than “token,” remove the generic “CORE” label, and say “license status” instead
of “saved verdict.” Then rerun the complete copy and claim audit. No functional,
privacy, accessibility, structure, demo, or missed-feature change is otherwise
indicated by this review.
