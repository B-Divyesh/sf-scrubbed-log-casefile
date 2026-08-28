# Adversarial first-read review 4 — PASS

Date: 2026-08-28 UTC

Live URL: <https://scrubbed-log-casefile.sociobot.in>

Reviewed commit: `ca9b03dc3bd392b97fb645e11f3ee68f75aa316b`

Work order: `scrubbed-log-casefile-review-4`

## Verdict

**PASS.** No blocking or minor finding remains. The cold first screen explains
the job, audience, and first action at both requested widths. The one-click
demo opens with a completed realistic result and keeps its data isolated. All
21 declared claim commands pass independently from a clean clone. No unlisted
claim, dead link, routing defect, accessibility defect, generic-template
regression, or missing brief-implied feature was found.

## Cold first read

Fresh Chromium contexts opened the live root at 390×844 and 1440×900. Nothing
was scrolled before recording these answers.

| Question | First-read answer | Exact first-screen evidence |
|---|---|---|
| What does this do? | It removes common sensitive values from incident logs before they are shared. | “Scrub incident logs before sharing” |
| For whom? | Engineers escalating a bug. | “For engineers escalating bugs…” |
| What should I click first? | Open the prepared sample. | “Try it with sample data” and “Opens a ready sample. Nothing is saved.” |

The primary action and its result text are fully visible at both widths. At
390×844, all three short product facts are also visible above the action. There
is no blocking first-screen finding.

## Findings

None. No `F-4-k` identifier is issued because the acceptance rule reserves
findings for a concrete defect with a required fix.

## Copy audit

Words are split on whitespace. Hyphenated terms, code spans, paths, and a URL
count as one word. Code blocks and sample payloads are not prose. Identical
dynamic sentences are listed once. No sentence exceeds 22 words, contains a
banned marketing adjective, uses an unexplained metaphor, or needs a rewrite.

### Landing-page sentences

| Sentence | Words | Result |
|---|---:|---|
| Offline. | 1 | Pass |
| The sample scrubber still works. | 5 | Pass |
| Reconnect to verify a saved license. | 6 | Pass |
| For engineers escalating bugs, it keeps useful structure while replacing common credentials and identifiers. | 14 | Pass |
| Opens a ready sample. | 4 | Pass |
| Nothing is saved. | 3 | Pass |
| Repeated values get matching replacements. | 5 | Pass |
| Test an incident log fragment. | 5 | Pass |
| The preview changes text in this tab. | 7 | Pass |
| It sends no scrub input and saves no scrub input. | 10 | Pass |
| Recognizes common emails, IPv4 addresses, credentials, bearer tokens, and JWTs. | 10 | Pass |
| Run the scrubber to create a preview. | 7 | Pass |
| Waiting for input. | 3 | Pass |
| Scrub and package an incident log. | 6 | Pass |
| Point one command at files or directories. | 7 | Pass |
| The same value gets the same replacement within one casefile. | 10 | Pass |
| A casefile is an AES-256 encrypted ZIP with rule names and counts, not matched values. | 15 | Pass |
| Limits of rule-based log scrubbing. | 5 | Pass |
| Rules cannot find every secret or identifier. | 7 | Pass |
| Review the casefile before sharing. | 5 | Pass |
| This is not a log host or cloud scrubber. | 9 | Pass |
| Build one local binary. | 4 | Pass |
| Run the bundled sample first, then pack your own incident files. | 11 | Pass |
| Recorded from the shipped casefile demo command. | 7 | Pass |
| It creates two sample files and one casefile in a new temporary directory, then prints its paths and password. | 19 | Pass |
| Password stays out of arguments. | 5 | Pass |
| Read it from CASEFILE_PASSWORD or another variable. | 7 | Pass |
| A failed run leaves no partial casefile. | 7 | Pass |
| Existing output remains unless you pass --force. | 7 | Pass |
| Review before sharing. | 3 | Pass |
| casefile inspect shows the manifest and can extract scrubbed files into a new temporary directory. | 15 | Pass |
| Free CLI and $19 team policy pack. | 7 | Pass |
| The CLI stays MIT-licensed. | 4 | Pass |
| The optional team pack adds four policy starters and a review checklist. | 12 | Pass |
| No active team-pack license on this device. | 7 | Pass |
| Team pack ready. | 3 | Pass |
| Download the AWS, Kubernetes, PostgreSQL, and HTTP starter rules with the team review checklist. | 14 | Pass |
| Nothing to scrub yet. | 4 | Pass |
| Paste a log fragment or load the sample, then try again. | 11 | Pass |
| No built-in rule matched. | 4 | Pass |
| Add a project rule in a policy file. | 8 | Pass |
| Copy was blocked by the browser. | 6 | Pass |
| Select the text and copy it manually. | 7 | Pass |
| Reconnect to verify the saved license. | 6 | Pass |
| Team-pack license active on this device. | 6 | Pass |
| License no longer active. | 4 | Pass |
| You can purchase or paste another token. | 7 | Pass |
| Could not reach license verification. | 5 | Pass |
| Your last license status is unchanged. | 6 | Pass |
| Try again when connected. | 4 | Pass |
| License received. | 2 | Pass |
| Confirming it with Sociobot… | 4 | Pass |
| Verifying license… | 2 | Pass |
| Scrub incident logs locally before sharing. | 6 | Pass |

The generated scrub-success status has a four-word base plus two words per
matched rule. With every browser rule present, it remains below 22 words.

### Landing headings, labels, and actions

| Copy unit | Words | Check |
|---|---:|---|
| Scrub incident logs before sharing | 5 | Job-naming h1 |
| LOCAL / OFFLINE / ENCRYPTED | 3 | Three concrete facts |
| Scrubs in your browser | 4 | Concrete fact |
| Demo works offline after one visit | 6 | Concrete, tested fact |
| CLI free · team pack $19 once | 6 | Concrete, tested price fact |
| Try it with sample data | 5 | Required first action |
| SAMPLE REDACTED LOG | 3 | Describes the art |
| LIVE / BROWSER-ONLY | 2 | Describes the preview boundary |
| Raw incident fragment | 3 | Input label |
| Load sample | 2 | Result-naming action |
| Scrub this fragment | 3 | Result-naming action |
| Scrubbed preview | 2 | Output label |
| Copy result | 2 | Result-naming action |
| HOW IT WORKS | 3 | Section label |
| Collect locally | 2 | Workflow step |
| Scrub consistently | 2 | Workflow step |
| Create the encrypted ZIP | 4 | Workflow result |
| CLEAR LIMITS | 2 | Limits section label |
| VERSION 0.1.3 / MIT | 3 | Version and license facts |
| Copy command | 2 | Result-naming action |
| ONE-TIME PRICING | 2 | Pricing section label |
| FREE CLI | 2 | Free tier label |
| Casefile CLI | 2 | Product tier name |
| Install the CLI | 3 | Result-naming link |
| TEAM PACK | 2 | Paid tier label |
| Policy starters | 2 | Paid product name |
| Buy the team pack | 4 | Result-naming link |
| Restore a purchase | 3 | Recovery section heading |
| Verify license | 2 | Result-naming action |
| Download policy pack | 3 | Result-naming action |

Navigation labels are short destination names rather than buttons. Demo
actions also pass: **Reset demo**, **Start for real**, **Scrub this fragment**,
and **Copy result**. “Start for real” is the prescribed demo-exit label.

### README sentences

| Sentence | Words | Result |
|---|---:|---|
| Scrubbed Log Casefile is for engineers escalating a bug. | 9 | Pass |
| It replaces common credentials and identifiers while keeping repeated values useful inside one casefile. | 14 | Pass |
| A casefile is an AES-256 encrypted ZIP. | 7 | Pass |
| Its manifest lists rule names and counts, not matched values. | 10 | Pass |
| It is a local CLI, not a log host or complete personal-data detector. | 13 | Pass |
| Review every casefile before sharing it. | 6 | Pass |
| Build the single `casefile` binary, then run the two-file sample. | 10 | Pass |
| The command creates a new temporary directory. | 7 | Pass |
| It prints the sample path, casefile path, and demo password. | 10 | Pass |
| The same sample is committed under `examples/incident/`. | 7 | Pass |
| Try the isolated browser sample at <https://scrubbed-log-casefile.sociobot.in/?demo=1>. | 7 | Pass |
| It starts ready, stores edits only in memory, and resets without touching license data. | 14 | Pass |
| Landing and demo scrubbing send no input. | 7 | Pass |
| The demo works offline after the first visit. | 8 | Pass |
| The browser rules cover emails, IPv4 addresses, credentials, bearer tokens, and JWTs. | 12 | Pass |
| Repeated values match within one demo page. | 7 | Pass |
| A new page uses different replacements. | 6 | Pass |
| Keep the password out of shell arguments. | 7 | Pass |
| The built-in policy file covers private keys, URL credentials, authorization headers, credential assignments, JWTs, emails, and IPv4 addresses. | 18 | Pass |
| It also supports quoted JSON and YAML credential keys. | 9 | Pass |
| The same value gets the same replacement within one casefile. | 10 | Pass |
| A second casefile uses different replacements. | 6 | Pass |
| A failed pack keeps existing output and leaves no partial casefile. | 11 | Pass |
| Read the manifest before sharing. | 5 | Pass |
| Add `--extract` to write scrubbed files into a new temporary review directory. | 12 | Pass |
| Safe relative paths are preserved. | 5 | Pass |
| Extraction starts in a new empty directory. | 7 | Pass |
| The manifest records a one-way file fingerprint that differs between casefiles. | 11 | Pass |
| It also records rule names and hit counts without matched values. | 11 | Pass |
| A named `value` capture replaces only the sensitive value. | 9 | Pass |
| `pack --json` writes one machine-readable success or error object. | 9 | Pass |
| Exit codes are `0` for success, `2` for invalid input, and `1` for a runtime failure. | 16 | Pass |
| The CLI package contains no network or telemetry client. | 9 | Pass |
| Every ZIP entry uses AES-256 encryption with the user-held password. | 10 | Pass |
| The CLI accepts that password only through an environment variable. | 10 | Pass |
| Rules cannot detect every secret or identifier. | 7 | Pass |
| Inspect the policy file and send the casefile password through a separate channel. | 13 | Pass |
| The CLI and safety features remain MIT-licensed. | 7 | Pass |
| A $19 one-time license adds four policy starters and a team review checklist. | 13 | Pass |
| Every public claim and its sandbox command is listed in `.factory/claims.json`. | 11 | Pass |
| Demo isolation is documented in `.factory/demo.md`. | 6 | Pass |
| `npm run build:site` writes the static site to `dist/site`. | 9 | Pass |
| The factory deploys that directory to <https://scrubbed-log-casefile.sociobot.in>. | 7 | Pass |
| This repository does not change DNS, billing, or other infrastructure. | 10 | Pass |
| MIT. | 1 | Pass |
| See LICENSE. | 2 | Pass |

README headings also stand alone: **Scrub incident logs before sharing**,
**Try the bundled demo**, **Pack an incident**, **Review a casefile**, **Add a
project rule**, **Privacy and security limits**, **Optional team pack**,
**Develop and verify**, **Deploy**, and **License**.

### Terminology check

| Concept | Consistent term |
|---|---|
| Encrypted support artifact | casefile, defined as an AES-256 encrypted ZIP |
| Redacted placeholder | replacement |
| One detector | rule |
| Collection of JSON rules | policy file |
| Browser try-out | demo |
| Prepared inputs | sample data |
| Optional purchase | team pack |

“Token” is used only for input credential/JWT classes and the license token,
not as a synonym for a replacement. No flagged jargon, marketing adjective,
meaningless heading, slogan, or inconsistent product noun remains.

## Demo and sandbox behavior

- The first-screen action opens `/demo/` in one click. The first 390×844 demo
  screen already shows incident `INC-1842`, raw email/password values,
  matching email replacements, a password replacement, and the six-value
  summary.
- The banner remains visible and reads “Demo — sample data, nothing is saved.”
  It includes **Reset demo** and **Start for real**.
- Editing and scrubbing the sample, then pressing Reset, restores the exact
  shipped five-line input. A reset also starts a new replacement scope.
- Real keys seeded before entry (`sb_license:scrubbed-log-casefile` and
  `casefile:real-workspace`) remained byte-identical. Demo data appeared in no
  localStorage, sessionStorage, IndexedDB, or Cache Storage entry.
- A live load, landing scrub, demo entry, demo scrub, and reset made 19
  requests. Every request was same-origin; no sentinel appeared in a URL or
  request body. No scrub action made a network request.
- After service-worker activation and HTTP-cache clearing, the live demo
  reloaded offline and scrubbed `offline-review4@example.com` successfully.
- The real CLI demo ran from `/tmp/review4-cli-work.*`. It created two files
  and `/tmp/casefile-demo-WHSrU5/sample.casefile.zip`, reported eight
  redactions, and printed `casefile-demo-password`.

The browser and CLI demo checks pass. Real data was not modified.

## Claims audit

A clean clone was created at `/tmp/scrubbed-review4-clean.MSFAuc/repo` from the
reviewed commit. After `npm ci`, every exact `test` string from
`.factory/claims.json` ran independently. Each ID occurs on exactly one tagged
test.

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

The live landing page, demo, Privacy, Terms, and README were cross-checked
against the inventory. Product behavior, offline/privacy statements, storage,
redaction classes, archive behavior, CLI interfaces, price, pack contents,
license behavior, and recording all map to a declared test. No unlisted claim
or untested claim was found.

## Earlier-finding recheck

Every earlier review, polish report, verification report, and handoff was read.
Each earlier finding was checked in current source/tests and on the live site.

| Earlier id | Round-4 confirmation |
|---|---|
| F-1-1 | Fixed: merchant-of-record/refund promises remain absent. The retained $19 price and pack contents pass `team-policy-pack` live and locally. |
| F-1-2 | Fixed: `browser-local` scrubs sentinels on landing and demo; inspects URLs, bodies, local/session storage, IndexedDB, and caches; preserves seeded real keys; and visits every route. The independent live run matched it. |
| F-1-3 | Fixed: the art, stamp, and caption fit within 390px and 1440px. Live screenshots and both bounds regressions confirm this. |
| F-1-4 | Fixed: header, footer, wordmark, and Back navigation focus the destination h1 and update the polite announcer. This was confirmed live. |
| F-1-5 | Fixed: normal routes and the 404 retain Demo / How it works / Install / Privacy; workflow copy is literal. |
| F-2-1 | Fixed: the phone demo shows realistic before/after values and its result summary inside the first 844px. |
| F-2-2 | Fixed: reconnecting verifies a saved license; `license-reconnect` passes. |
| F-2-3 | Fixed: `stable-tokens` creates and decrypts two real CLI casefiles. |
| F-2-4 | Fixed: `browser-redaction` tests email, IPv4, credential, bearer-token, and JWT replacement. |
| F-2-5 | Fixed: repeats match on one demo page while a new page/reset gets different replacements; wording describes that boundary directly. |
| F-2-6 | Fixed: `cli-demo` verifies two files, a unique temporary directory, printed paths/password, and redaction count in human and JSON output. |
| F-2-7 | Fixed: `manifest-contents` decrypts and checks fingerprints, rule names, exact counts, and raw-value absence. |
| F-2-8 | Fixed: the offline statement is limited to the demo, and a true cache-cleared offline reload passes live and locally. |
| F-2-9 | Fixed: all three facts fit the live 390×844 first screen. |
| F-2-10 | Fixed: the full e2e run confirms every visible header/footer target is at least 44×44px at 390px. |
| F-2-11 | Fixed: every footer contains the product one-liner, Privacy, Terms, builder, and version. |
| F-2-12 | Fixed: `casefile inspect` displays the manifest and safely extracts to a new temporary review directory. |
| F-2-13 | Fixed: the live heading is “Test an incident log fragment.” |
| F-2-14 | Fixed: the workflow result is “Create the encrypted ZIP.” |
| F-2-15 | Fixed: the section is “Limits of rule-based log scrubbing.” |
| F-2-16 | Fixed: the art label is the factual “SAMPLE REDACTED LOG.” |
| F-2-17 | Fixed: case lore/metaphor remains absent; the caption states the matching-replacement result. |
| F-2-18 | Fixed: the copy says “A failed run leaves no partial casefile.” |
| F-2-19 | Fixed: pricing is headed “Free CLI and $19 team policy pack.” |
| F-2-20 | Fixed: unexplained “PII” remains absent from README and live copy. |
| F-2-21 | Fixed: “case-scoped tokens” remains absent; replacement behavior is stated directly. |
| F-2-22 | Fixed: “value-free rule manifest” remains absent; names, counts, and excluded matched values are explicit. |
| F-2-23 | Fixed: “casefile” consistently names the output after its encrypted-ZIP definition; “ZIP entry” only names files inside it. |
| F-2-24 | Fixed: one detector is a rule; a JSON collection is a policy file. |
| F-3-1 | Fixed: “sample” is used consistently for prepared demo data; the conflicting “example” wording remains absent. |
| F-3-2 | Fixed: user copy describes matching/different replacements and a one-way fingerprint without salt/correlation jargon. |
| F-3-3 | Fixed: the hero says “matching replacements,” not “replacement tokens.” |
| F-3-4 | Fixed: the pricing label is “FREE CLI,” not “CORE.” |
| F-3-5 | Fixed: the error says “Your last license status is unchanged,” not “saved verdict.” |

No prior finding is unfixed, partial, or regressed.

## Structure, accessibility, links, and visual identity

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` return route-specific
  titles in the required pattern, `lang="en"`, one h1, one main, a description,
  canonical, Open Graph/Twitter metadata, and local favicon/touch icon.
- A random missing path returns the designed 404 with HTTP 404 and a working
  home action. `robots.txt`, `sitemap.xml`, and the web manifest resolve with
  the correct content types.
- Every discovered internal link and hash target resolves. The GitHub source
  resolves. The Sociobot checkout redirects to a live hosted checkout; no
  purchase was made.
- Cross-route How it works and Install links settle on their intended section.
  Forward and Back restore h1 focus and announce the page. Deep links reload.
- Fresh live axe scans report zero WCAG 2 A/AA violations on all five designed
  routes at 390px. The full local suite also covers keyboard use, 200% text,
  44px targets, reduced motion, route focus, and both requested viewports.
- Normal designed routes produced no console/page errors or failed requests.
  There is no horizontal overflow at 390px.
- Live response headers include the matching CSP, frame denial, no-sniff,
  no-referrer, permissions policy, HSTS, and no-cache HTML behavior.
- The initial home JavaScript is 2.29 KiB gzip and CSS is 3.50 KiB gzip. No
  third-party font or script is loaded.
- The concrete-and-moss evidence slab, local slab/monospace type, hard rules,
  stamp controls, and original art match `.factory/design.md`. The visual
  identity is recognisable and not a centered generic SaaS template.

The live home HTML and home JavaScript SHA-256 hashes exactly match the clean
build (`8fcc610c…` and `39599ad0…`).

## Full clean-clone verification

| Check | Result |
|---|---|
| `npm test` | PASS — 3/3 |
| `npm run typecheck`; `npm run lint` | PASS |
| `npm run build` | PASS — emitted `dist/site` |
| `npm run test:e2e -- --reporter=line` | PASS — 36/36 |
| `cargo fmt --check` | PASS |
| `cargo clippy --all-targets -- -D warnings` | PASS |
| `cargo test --all-targets` | PASS — 4 library + 15 integration tests |
| `cargo package --allow-dirty` | PASS — 86.6 KiB unpacked / 22.5 KiB compressed |

## Missed leverage

No missing AI, import/export, or sync feature is implied by the brief. Sending
incident logs to a model would conflict with the deterministic offline privacy
boundary. The CLI already accepts files/directories, imports project policy
files, exports an encrypted casefile and manifest, and extracts scrubbed files
for review. No decorative AI feature or embedded provider key exists.

## What would make this perfect

Nothing remains to change within the brief and review contract. Future feature
work should preserve the tested local boundary, but this review identifies no
current corrective action.
