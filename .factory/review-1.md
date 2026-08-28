# Adversarial first-read review 1 — FAIL

Date: 2026-08-28 UTC  
Live URL: <https://scrubbed-log-casefile.sociobot.in>  
Reviewed commit: `a3ca24bcd80a135da50fe7467d037baa257b0ab8`

## Verdict

**FAIL.** The core job is clear, the real CLI demo works, and all 16 declared
claim commands pass. However, two public privacy/payment claims are not
adequately tested, navigation does not meet the required screen-reader route
behavior, and the live hero deliberately clips readable content on both
viewports. There are five findings below. This is not PASS-adjacent under the
zero-findings rule.

## Cold first read

Fresh Chromium contexts were opened at 390x844 and 1440x900 before scrolling.
Both first screens answered the three required questions:

| Question | What the screen says |
|---|---|
| What does this do? | “Scrub incident logs before sharing” |
| For whom? | “For engineers escalating bugs…” |
| What should I click first? | “Try it with sample data” — “Opens a ready example. Nothing is saved.” |

The single primary action is visible at both sizes. This check passes; it is
not a finding.

## Findings

### F-1-1 — BLOCKING — public payment and refund claims have no matching claim entry or sandbox proof

**Locations and exact text**

- Landing paid card: “Sociobot/Dodo is merchant of record. Refunds revoke the license.”
- README, Optional team pack: “Payment and refunds use the Sociobot billing service.”
- Terms, Team pack purchase: “Sociobot/Dodo handles payments and refunds. A refund revokes the license.”

`claims.json` has `team-policy-pack`, but that claim only covers the $19 price,
cached-valid license, four policy starters, and checklist. Its Playwright test
does not establish merchant-of-record status, refund handling, or that a
refund revokes a license. These are concrete purchase terms that a visitor can
rely on, so they are unlisted claims under the claims contract.

**Why this fails first-read honesty:** the product asks for money while making
specific promises about who takes payment and what happens after a refund
without a local, repeatable proof of either promise.

**Concrete fix:** remove these statements until an observable billing contract
exists. If retained, add distinct claim entries and sandbox/integration tests
that prove the documented checkout merchant and a refunded-license revocation
against a safe test fixture; list the permitted external endpoint explicitly.

### F-1-2 — BLOCKING — `browser-local` regression does not exercise the claimed scrub flow or all stated persistence stores

**Location:** `e2e/site.spec.ts`, `@claim:browser-local`, for the claim
“The browser demo sends and saves no scrub input, and the site loads no
third-party tracking resources.”

The test starts request logging, visits `/demo/`, changes the textarea, then
clicks **Reset demo**. It never clicks **Scrub this fragment** after entering
new data. It asserts only `localStorage.length` and `sessionStorage.length`; it
does not check IndexedDB or Cache Storage for the entered sentinel. Therefore
the test would still pass if a future scrub handler sent the edited input to
the same origin, or persisted it in IndexedDB/Cache Storage. Same-origin-only
request checks do not prove that the input itself was not transmitted.

**Why this fails first-read honesty:** “nothing is saved” and “sends no scrub
input” are primary privacy promises. The current live behavior is good—the
review’s separate live run clicked Scrub with a unique sentinel and found no
outgoing request, no local/session storage, no IndexedDB database, and no
sentinel in the service-worker cache—but the required claim regression does
not protect that behavior.

**Concrete fix:** after filling a unique sentinel, click **Scrub this
fragment** while collecting `postData()` and URLs; assert no request carries
the sentinel. Assert `indexedDB.databases()` is empty and enumerate Cache
Storage entries to assert none contains the sentinel. Keep the current
same-origin/third-party-resource assertion.

### F-1-3 — MEDIUM — readable hero art and caption are clipped rather than laid out within the viewport

**Location:** landing hero, `.hero-art` in `site/src/styles.css`.

At 1440px, the live hero-art box runs from x=647.5 to x=1481.2; the viewport
ends at x=1440. Its caption runs to x=1467.8. At 390px, it runs from x=48.0 to
x=451.1 and the caption to x=443.6. `main { overflow: hidden }` hides the
overflow, so the right side of the evidence art, its “EVIDENCE / SCRUBBED”
stamp, and the caption “structure retained / values sealed” are cut off.

**Why this fails first-read use:** the workbench visual is distinctive, but
content that explains it is only partly visible. The visitor cannot pan to
read it because the overflow is hidden.

**Concrete fix:** preserve the intended asymmetric offset without moving the
art outside the viewport. For example, cap the negative right margin at zero
at the layout’s maximum width and use an internal transform/shadow that is
fully contained. Add a 390px and 1440px assertion that the hero image,
stamp, and figcaption rectangles are within the viewport.

### F-1-4 — MEDIUM — route changes leave focus on `<body>` and provide no route announcement

**Location:** live `/` → `/privacy/` and browser back navigation.

Clicking the header Privacy link leaves `document.activeElement` as `BODY` on
Privacy. Going back leaves it as `BODY` on the landing page. There is no
route-level `aria-live="polite"` announcer, and the privacy/landing headings
are not programmatically focused. This does not meet the required deep-link,
back-button, focus-on-route-change behavior.

**Why this fails first-read use:** a screen-reader or keyboard visitor gets no
reliable indication that the page changed or where reading should resume.

**Concrete fix:** on every navigation target, move focus to a `tabindex="-1"`
`h1` after load/navigation and expose a polite route announcer with the new
title. Add Playwright coverage for forward navigation and Back.

### F-1-5 — MINOR — navigation/header and workflow copy do not meet the stated consistent, plain-language structure

**Locations and exact text**

- Home header: “Demo”, “How it works”, “Install”, “Privacy”.
- Demo header: only “Install”.
- 404 header: only the wordmark.
- Landing workflow eyebrow: “THE CHAIN OF CUSTODY”; h2: “From raw incident to sealed case.”

The header navigation changes by route rather than remaining the required
consistent set. “The chain of custody” and “sealed case” are incident-response
jargon; neither tells a first-time visitor, in isolation, that this section
explains log scrubbing and packaging.

**Why this fails first-read use:** navigation options appear and disappear
between places, while the workflow heading adds terminology the visitor must
interpret before understanding the core process.

**Concrete fix:** retain the same compact `Demo` / `How it works` / `Install`
/ `Privacy` navigation on all normal routes (404 may keep the same navigation
or a clearly equivalent return action). Replace the workflow eyebrow and h2
with “HOW IT WORKS” and “Scrub and package an incident log.”

## Copy audit

Words are split on visible words; code and URLs count as one label where they
function as one visible token. Interface labels/headings without terminal
punctuation were separately checked for jargon, context, and verb specificity.

### Landing page sentences

| Sentence | Words |
|---|---:|
| Offline. | 1 |
| The sample scrubber still works. | 5 |
| License checks resume when connected. | 5 |
| For engineers escalating bugs, it keeps useful structure while replacing common credentials and identifiers. | 14 |
| Opens a ready example. | 4 |
| Nothing is saved. | 3 |
| The preview changes text in this tab. | 7 |
| It sends no scrub input and saves no scrub input. | 10 |
| Run the scrubber to create a preview. | 7 |
| Waiting for input. | 3 |
| Point one command at files or directories. | 8 |
| Named rules give repeated values stable, case-scoped tokens. | 8 |
| Get an AES-256 ZIP and a value-free rule manifest. | 9 |
| Rules cannot find every secret or identifier. | 7 |
| Review the result before sharing. | 5 |
| This is not a log host or cloud scrubber. | 9 |
| Run the bundled sample first, then pack your own incident files. | 10 |
| Password stays out of arguments. | 5 |
| Read it from CASEFILE_PASSWORD or another variable. | 7 |
| Failure stays atomic. | 3 |
| Incomplete archives are removed. | 4 |
| Existing output remains unless you pass --force. | 7 |
| Recorded from the shipped casefile demo command. | 7 |
| It writes two sample files and one encrypted archive in a new temporary directory. | 14 |
| The CLI stays MIT-licensed. | 4 |
| The optional team pack adds four policy starters and a review checklist. | 12 |
| Sociobot/Dodo is merchant of record. | 5 |
| Refunds revoke the license. | 4 |
| No active team-pack license on this device. | 7 |
| Team pack ready. | 3 |
| Download the AWS, Kubernetes, PostgreSQL, and HTTP starter rules with the team review checklist. | 14 |

No landing sentence exceeds 22 words. Buttons name an outcome: **Try it with
sample data**, **Scrub this fragment**, **Copy result**, **Download policy
pack**, and **Verify license**. The only copy flag is F-1-5’s out-of-context
workflow terminology. The merchant/refund lines are also claim flags in F-1-1.

### README sentences

| Sentence | Words |
|---|---:|
| Scrubbed Log Casefile is for engineers escalating a bug. | 9 |
| It replaces common credentials and identifiers while keeping repeated values useful inside one case. | 14 |
| The result is an encrypted ZIP with a value-free rule manifest. | 11 |
| It is a local CLI, not a log host or complete PII detector. | 13 |
| Review every casefile before sharing it. | 6 |
| Build the single `casefile` binary, then run the two-file sample. | 10 |
| The command prints its temporary sample directory, encrypted archive, and demo password. | 12 |
| The same sample is committed under `examples/incident/`. | 7 |
| The browser demo is available at its linked `/demo/` URL. | 9 |
| It works offline after the first visit. | 7 |
| Scrub input stays in the tab and is not saved. | 10 |
| Keep the password out of shell arguments. | 7 |
| The built-in policy covers common private keys, URL credentials, authorization headers, credential assignments, JWTs, emails, and IPv4 addresses. | 18 |
| Quoted JSON and YAML credential keys are supported. | 8 |
| Repeated values receive the same token inside one casefile. | 9 |
| Separate casefiles use different salts. | 5 |
| Existing output is preserved unless `--force` is present, and a failed pack leaves no temporary archive. | 15 |
| A named `value` capture replaces only the sensitive value. | 8 |
| `--json` writes one machine-readable success or error object. | 8 |
| Exit codes are `0` for success, `2` for invalid input, and `1` for a runtime failure. | 16 |
| The CLI package contains no network or telemetry client. | 9 |
| ZIP entries use AES-256 encryption with the user-held password. | 9 |
| The CLI reads that password from an environment variable and does not accept it as a command-line argument. | 18 |
| A manifest records file fingerprints, rule names, and hit counts without matched values. | 13 |
| Rules cannot detect every secret or identifier. | 7 |
| Inspect the scrub policy and send the archive password through a separate channel. | 13 |
| The CLI and safety features remain MIT-licensed. | 7 |
| A $19 one-time license adds four policy starters for AWS, Kubernetes, PostgreSQL, and HTTP traces, plus a team policy review checklist. | 21 |
| Payment and refunds use the Sociobot billing service. | 8 |
| Every public claim and its sandbox command is listed in `.factory/claims.json`. | 13 |
| Demo isolation is documented in `.factory/demo.md`. | 7 |
| `npm run build:site` writes the static site to `dist/site`. | 8 |
| The factory deploys that directory to the linked product URL. | 9 |
| This repository does not change DNS, billing, or other infrastructure. | 10 |

No README sentence exceeds 22 words. The payment/refund sentence is the
unlisted-claim finding F-1-1. Terminology is otherwise consistent: *casefile*
for the archive, *token* for a replacement, *demo* for the browser try-out,
*sample* for bundled data, *policy* for rules, and *team pack* for the paid
add-on.

## Demo, privacy, claims, and CLI checks

- One click from the landing page opens `/demo/`. Its first visible product
  screen already contains a realistic `INC-1842` fragment and a scrubbed
  result with emails, IP, password, API key, and bearer token replaced.
- The persistent banner reads “Demo — sample data, nothing is saved” and has
  **Reset demo** and **Start for real**. Reset restored the exact sample. The
  review did not observe demo data in localStorage, sessionStorage, IndexedDB,
  or Cache Storage; the cache contains only public shell resources.
- The live browser request log for load, edit, scrub, reset, and Privacy had
  only the product origin. Scrub did not add a request. There were no console
  errors.
- From a new clone at `/tmp/casefile-review-clean.kufX5v/repo` after `npm ci`,
  every command in `claims.json` passed independently: `browser-local`,
  `offline-reload`, `cli-demo`, `credential-redaction`, `encrypted-casefile`,
  `aes-256`, `password-env`, `machine-json`, `exit-codes`, `custom-rules`,
  `stable-tokens`, `atomic-output`, `single-binary`, `cli-local`,
  `team-policy-pack`, and `cli-recording`.
- The CLI claim command runs `casefile demo --json` in its own temporary
  directory and passed. The bundled sample has two inputs and the command
  produces the encrypted archive claimed.

## History recheck

There are no earlier `.factory/review-*.md` or `.factory/polish-*.md` files.
The existing handoff and verification records contain the earlier defects;
each was checked again live and in current code:

| Earlier finding | Current check |
|---|---|
| Missing/incomplete claim inventory; AES/password/exit coverage; machine JSON coverage | All 16 declared command tests passed from a clean clone. |
| Paid download lacked its review checklist | The current download fixture contains four named rules and four `review_checklist` entries. |
| Footer targets under 44px | Current CSS gives footer links `min-width` and `min-height` of 44px; the mobile test passes. |
| No real CLI recording | The landing page serves `/assets/casefile-demo.svg`; its matching claim passes. |
| Incomplete social/404 metadata and missing designed 404 | All checked routes have one h1/main, description, canonical, OG/Twitter image; an unknown live path returns the designed page with HTTP 404. |
| Offline reload and browser privacy behavior | `offline-reload` and `browser-local` pass; the separate live request/storage check above also passes. |
| JSON credential scrubbing and atomic output | The credential-redaction and atomic-output claims pass. |

These historical findings are fixed. F-1-1 through F-1-5 are new findings,
not regressions of an unfixed historical item.

## Structure and visual checks

The live routes `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each
returned the expected title, `lang="en"`, one h1, one main landmark,
description, canonical, OG/Twitter image, and local favicon/touch icon. An
unknown path returned the designed 404 with HTTP 404. The home, demo, legal,
robots, sitemap, manifest, asset, checkout, and source links all resolved.
The home response has CSP, frame denial, no-sniff, no-referrer, and a
permissions policy. The visual system is distinct from a generic SaaS
template: original concrete/moss evidence art, slab-serif/monospace system
type, hard rules, and stamp-like controls match `.factory/design.md`.

The header/focus and clipped-art exceptions are recorded as F-1-3 through
F-1-5. No extra AI feature is expected: the brief is an offline deterministic
redaction CLI, and an AI step would be decorative and less privacy-preserving.
Import/export is already addressed by CLI file/directory input and the
encrypted archive output.

## What would make this perfect

1. Make payment/refund language either demonstrably testable or absent.
2. Make the privacy regression inspect the actual scrub interaction and every
   relevant browser persistence surface.
3. Contain the hero’s readable art/caption at 390px and desktop widths.
4. Give all routes a consistent nav and an announced, focused h1 after every
   forward/back navigation.
5. Replace workflow jargon with a plain, out-of-context heading.
