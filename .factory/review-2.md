# Adversarial first-read review 2 — FAIL

Date: 2026-08-28 UTC

Live URL: <https://scrubbed-log-casefile.sociobot.in>

Reviewed commit: `59a3167fbfb9fc753008d907e84c522c6ba60560`

## Verdict

**FAIL.** The cold landing page answers the three basic questions, every one
of the 17 listed claim commands passes, and the live demo keeps entered data
local. The product still has six blocking findings: two earlier fixes are
only partial, the phone demo hides the scrubbed result below the first screen,
an offline license message promises behavior that does not occur, and the
stable-token claim test does not exercise real CLI casefiles. Browser
recognition is also absent from the claim inventory. There are further
unlisted claims, mobile accessibility defects, plain-language defects, and one
obvious missing review step. Zero-findings acceptance is not met.

## Cold first read

Fresh Chromium contexts opened the live root at 390×844 and 1440×900 with
empty storage. No scrolling occurred before this assessment.

| Question | First-read answer | Evidence |
|---|---|---|
| What does this do? | It removes common sensitive values from incident logs before they are shared. | “Scrub incident logs before sharing” |
| For whom? | Engineers escalating a bug. | “For engineers escalating bugs…” |
| What should I click first? | Open the ready example. | “Try it with sample data” and “Opens a ready example. Nothing is saved.” |

All three answers are clear on both viewports, so the cold landing comprehension
gate passes. The phone layout does not keep the three required facts in the
first screen; that separate finding is F-2-9.

## Findings

### F-1-2 — BLOCKING — reopened: the browser-local test still omits a claimed scrub surface

**Locations:** `.factory/claims.json` `browser-local`; `e2e/site.spec.ts`
`@claim:browser-local`; live landing section “Test your own fragment.”

The claim applies to the “landing preview, demo banner, privacy page, README,”
but its regression opens only `/demo/` and `/privacy/`. It never enters a
sentinel into the landing-page preview or clicks the landing **Scrub this
fragment** button. It also does not load all routes when asserting that “the
site loads no third-party tracking resources.”

The current live landing behavior is safe: a unique sentinel was scrubbed with
no request or storage write. That manual result does not make the regression
complete.

**Why this remains blocking:** the earlier F-1-2 required the claim test to
exercise the claimed scrub interaction. The repair protects the demo route but
not the separately named landing interaction, so the finding is only
half-fixed.

**Concrete fix:** in the one tagged test, visit `/`, scrub a unique sentinel,
and inspect request URLs/bodies plus localStorage, sessionStorage, IndexedDB,
and Cache Storage. Then repeat the isolated demo flow and load every public
route while asserting the tracking-resource allowlist.

### F-1-4 — BLOCKING — reopened: footer and wordmark navigation still lose route focus

**Locations:** `site/src/route-focus.ts`; live footer links and header wordmark.

The repair attaches its navigation marker only to `header nav a`. Fresh live
checks produced:

- Home footer **Terms** → `/terms/`: `document.activeElement` was `BODY`; the
  route announcer was empty.
- Privacy wordmark → `/`: `document.activeElement` was `BODY`; the route
  announcer was empty.
- Header **Privacy** → `/privacy/` and browser Back did focus and announce the
  new h1, which confirms that only the tested path works.

**Why this remains blocking:** the prior finding required every route change,
not only links inside one navigation element. Keyboard and screen-reader users
still receive silent route changes from normal site links.

**Concrete fix:** mark every same-origin route link, or centralize navigation
focus through a document-level same-origin link handler. Add forward and Back
tests for header nav, footer Privacy/Terms, and the wordmark.

### F-2-1 — BLOCKING — the phone demo does not show the scrubbed result in its first screen

**Location:** live `/demo/` at 390×844 after one click from the landing page.

The first screen shows the banner, navigation, heading, and part of the raw
sample. The ready scrubbed output starts at y=1125 and the summary at y=1407,
both below the 844px viewport. Even the rerun button starts at y=993. The
visible sentence “The scrubbed result is ready below” asks the visitor to
scroll before seeing any value replaced.

Desktop shows part of the output beside the input, but the requested primary
scenario is a phone with 30 seconds.

**Why this is blocking:** the required demo must show the product already
being used with realistic sample data on the first screen. A raw log alone
does not demonstrate scrubbing.

**Concrete fix:** on phone, put a compact before/after excerpt immediately
under the demo banner and before the editor, with at least one repeated token
and one removed credential visible. Keep the full editable input/output below.
Add a 390×844 assertion that a redacted token and the result summary intersect
the initial viewport.

### F-2-2 — BLOCKING — “License checks resume when connected” is unlisted and false

**Location and exact text:** landing offline bar: “License checks resume when
connected.”

From a primed service-worker context, the review stored a stale license verdict,
loaded the home page offline, then restored the connection. The offline bar
disappeared, but no Sociobot verification request occurred and the license
status remained inactive. `updateConnection()` only hides the bar; it does not
call `verifyLicense()`.

**Why this is blocking:** this is an unlisted claim about paid-license state,
and observed behavior contradicts it.

**Concrete fix:** either change the copy to “Reconnect, then reload to verify
your license,” or trigger verification on the `online` event. Add a dedicated
claim entry and test an offline-to-online transition with the fixture endpoint.

### F-2-3 — BLOCKING — the stable-token claim test does not create two CLI casefiles

**Locations:** `.factory/claims.json` `stable-tokens`; the tagged wrapper in
`e2e/site.spec.ts`; `src/lib.rs` test `repeated_values_get_stable_tokens`;
README: “Separate casefiles use different salts.”

The declared sandbox says to scrub values “in two cases.” The tagged test only
runs a library unit test that constructs two `Redactor` instances with
hard-coded `[7; 32]` and `[8; 32]` salts. It never invokes `casefile pack`, never
creates two archives, and cannot catch the CLI accidentally reusing a salt.

**Why this is blocking:** the public promise concerns real casefiles, while
the test proves only that different caller-provided salts change a library
token.

**Concrete fix:** run `casefile pack` twice against the same repeated value,
decrypt both outputs, assert same-value stability inside each archive and
different tokens across the two archives, and assert the manifests describe
case-scoped salting.

### F-2-4 — BLOCKING — browser recognition is a public feature with no claim entry

**Location and exact text:** landing preview hint: “Recognizes common emails,
IPv4 addresses, credentials, bearer tokens, and JWTs.”

No `claims.json` entry names browser redaction coverage. The browser-local
claim tests transmission and persistence, not all five recognition classes.
The Vitest preview tests cover email, IPv4, and credentials, but are untagged
and do not cover bearer tokens or JWTs.

**Why this is blocking:** this feature claim is unlisted and therefore remains
untested by the mandatory claim gate.

**Concrete fix:** add a `browser-redaction` claim and exactly one tagged test
that submits all five representative values through `/demo/`, verifies their
absence and typed replacements, and confirms repeated-value correlation.

### F-2-5 — MEDIUM — the browser demo silently differs from case-scoped CLI token behavior

**Locations:** live `/demo/`; `site/src/demo.ts`; landing claim “case-scoped
tokens.”

Two fresh browser contexts produced byte-identical tokens for the same sample,
including `<EMAIL:2814566E>`. The browser `token()` function hashes only the
value with unsalted FNV-1a. The CLI creates a random 32-byte salt per casefile.
The demo does not disclose that it is a simplified recognizer with different
token semantics.

**Why this matters:** the primary try-out looks like the product but does not
demonstrate its stated case boundary. A visitor can reasonably infer that the
visible tokens represent CLI output.

**Concrete fix:** run the production redactor in the browser (for example via
Wasm), or generate an in-memory per-demo salt and plainly label unsupported
differences. Add a test that fresh demo cases do not reuse tokens.

### F-2-6 — MEDIUM — demo output-location and password statements are not in the claim contract

**Locations and exact text:** landing caption: “It writes two sample files and
one encrypted archive in a new temporary directory.” README: “The command
prints its temporary sample directory, encrypted archive, and demo password.”

The `cli-demo` claim says only that a real casefile is created from two sample
files. Its tagged test asserts file count, redaction count, and output archive;
it does not assert a new temporary directory, `sample_directory`, the printed
password, or the human-readable command output.

**Concrete fix:** extend the claim text and tagged test to assert each published
field and that the output is under a newly created temporary root, or remove
the extra promises.

### F-2-7 — MEDIUM — the documented manifest fingerprint is unlisted and untested

**Location and exact text:** README: “A manifest records file fingerprints,
rule names, and hit counts without matched values.”

The encrypted-casefile claim covers a value-free manifest. Its tagged test
checks one hit count and absence of one raw email, but neither the claim entry
nor the test asserts that every file has a fingerprint.

**Concrete fix:** add a `manifest-contents` claim that decrypts the manifest
and verifies a salted fingerprint, rule names, counts, and absence of every
seeded value; otherwise remove “file fingerprints.”

### F-2-8 — MEDIUM — public-page offline caching is an unlisted claim

**Location and exact text:** Privacy: “The service worker caches public pages
for offline use.”

The listed offline claim covers only the demo after the first visit. An
untagged structural test inspects generated service-worker text, but no claim
entry proves that the public routes reload offline.

**Concrete fix:** either narrow the sentence to the tested demo behavior or add
one claim that primes and reloads `/`, `/privacy/`, and `/terms/` offline.

### F-2-9 — MEDIUM — the required three facts do not fit in the phone first screen

**Location:** landing at 390×844.

“Runs in your browser” is visible at y=808–827. “Works offline after one visit”
starts at y=839 and is clipped. “CLI free · team pack $19 once” is entirely
below the fold.

**Concrete fix:** reduce the phone hero’s vertical footprint or move the three
facts above the CTA. Add a 390×844 test that all three fact rows are fully
inside the initial viewport.

### F-2-10 — MEDIUM — the mobile Demo navigation target is only 26px wide

**Location:** header **Demo** link at 390px.

Its live bounding box is 26.1×44px. CSS sets `min-height: 44px` but no minimum
width or horizontal padding. The current touch-target test first doubles the
root font size, then measures targets, so it misses the default-size failure.

**Concrete fix:** make each navigation link at least 44×44px at the default
font size and measure targets before enabling the 200% text fixture.

### F-2-11 — MEDIUM — the footer omits the required product one-liner

**Location:** footer on every route: “[////] Scrubbed Log Casefile.”

This repeats the name but does not state what the product does.

**Concrete fix:** use “Scrub incident logs locally before sharing” beside the
wordmark, while retaining Privacy, Terms, Param Factory, and the version.

### F-2-12 — MEDIUM — the CLI tells users to review a casefile but provides no review path

**Locations:** README “Review every casefile before sharing it”; `casefile
--help`, which exposes only `pack` and `demo`.

The brief requires a safe shareable bundle, and the product repeatedly tells
the user to review it. There is no `inspect`, `review`, `verify`, or documented
decrypt command. A user must discover a compatible external ZIP workflow.

**Concrete fix:** add `casefile inspect <archive> --password-env <NAME>` to
list the manifest and optionally extract scrubbed files to a new temporary
directory without overwriting existing data. Test password errors, manifest
display, safe paths, and cleanup. AI or sync is not appropriate for this
offline deterministic tool.

### F-2-13 — MINOR — “Test your own fragment” lacks the object in its heading

**Location and exact text:** landing h2: “Test your own fragment.”

“Fragment” makes no sense in a heading list without the surrounding hero.

**Rewrite:** “Test an incident log fragment.”

### F-2-14 — MINOR — “Seal and share” is a metaphor, not a result

**Location and exact text:** How it works step heading: “Seal and share.”

**Rewrite:** “Create the encrypted ZIP.”

### F-2-15 — MINOR — “Know what it does not do” has an unclear antecedent

**Location and exact text:** limits h2: “Know what it does not do.”

**Rewrite:** “Limits of rule-based log scrubbing.”

### F-2-16 — MINOR — the art stamp is decorative casefile lore

**Location and exact text:** hero-art stamp: “EVIDENCE / SCRUBBED.”

It does not identify the image as an example or teach the reader anything
about the result.

**Rewrite:** “EXAMPLE REDACTED LOG.”

### F-2-17 — MINOR — the hero caption uses invented case lore and a metaphor

**Location and exact text:** “CASE 001” and “structure retained / values
sealed.”

**Rewrite:** “Repeated values keep matching replacement tokens.”

### F-2-18 — MINOR — “Failure stays atomic” is unexplained jargon

**Location and exact text:** install note: “Failure stays atomic.”

**Rewrite:** “A failed run leaves no partial archive.” Delete the following
duplicate sentence or combine the two.

### F-2-19 — MINOR — “Keep the safety core free” is a slogan, not a pricing heading

**Location and exact text:** pricing h2: “Keep the safety core free.”

**Rewrite:** “Free CLI and $19 team policy pack.”

### F-2-20 — MINOR — README uses the unexplained acronym “PII”

**Location and exact text:** “It is a local CLI, not a log host or complete PII
detector.”

**Rewrite:** “It is a local CLI, not a log host or complete personal-data
detector.”

### F-2-21 — MINOR — “case-scoped tokens” is avoidable jargon

**Location and exact text:** “Named rules give repeated values stable,
case-scoped tokens.”

**Rewrite:** “The same value gets the same replacement within one casefile.”

### F-2-22 — MINOR — “value-free rule manifest” does not explain the artifact

**Locations:** landing and README.

**Rewrite:** “Get an AES-256 ZIP and a manifest with rule names and counts, not
matched values.” Use the same explanation in the README introduction.

### F-2-23 — MINOR — the packaged output has three names

**Locations:** landing and README use “casefile,” “encrypted ZIP,” and
“archive” for the same output.

**Concrete fix:** define it once as “a casefile (an encrypted ZIP),” then use
“casefile” consistently. Reserve “ZIP entry” for a file inside it.

### F-2-24 — MINOR — detector terminology shifts between rule, pattern, and policy

**Locations and exact text:** “Named rules…”, “No built-in pattern matched,”
and “Add a custom CLI policy…”

**Concrete fix:** call each detector a “rule” and the JSON collection a
“policy file.” Rewrite the empty result as: “No built-in rule matched. Add a
project rule in a policy file.”

## Copy audit

Words are split on whitespace; hyphenated terms count as one word. Repeated
sentences are listed once. Code blocks and log payloads are not prose. The
landing table includes reachable error and license states from `site/src/main.ts`.
No sentence exceeds 22 words and no banned marketing adjective appears.

### Landing-page sentences

| Sentence | Words |
|---|---:|
| Offline. | 1 |
| The sample scrubber still works. | 5 |
| License checks resume when connected. | 5 |
| For engineers escalating bugs, it keeps useful structure while replacing common credentials and identifiers. | 14 |
| Opens a ready example. | 4 |
| Nothing is saved. | 3 |
| Test your own fragment. | 4 |
| The preview changes text in this tab. | 7 |
| It sends no scrub input and saves no scrub input. | 10 |
| Recognizes common emails, IPv4 addresses, credentials, bearer tokens, and JWTs. | 10 |
| Run the scrubber to create a preview. | 7 |
| Waiting for input. | 3 |
| Scrub and package an incident log. | 6 |
| Point one command at files or directories. | 7 |
| Named rules give repeated values stable, case-scoped tokens. | 8 |
| Get an AES-256 ZIP and a value-free rule manifest. | 9 |
| Know what it does not do. | 6 |
| Rules cannot find every secret or identifier. | 7 |
| Review the result before sharing. | 5 |
| This is not a log host or cloud scrubber. | 9 |
| Build one local binary. | 4 |
| Run the bundled sample first, then pack your own incident files. | 11 |
| Recorded from the shipped casefile demo command. | 7 |
| It writes two sample files and one encrypted archive in a new temporary directory. | 14 |
| Password stays out of arguments. | 5 |
| Read it from CASEFILE_PASSWORD or another variable. | 7 |
| Failure stays atomic. | 3 |
| Incomplete archives are removed. | 4 |
| Existing output remains unless you pass --force. | 7 |
| Keep the safety core free. | 5 |
| The CLI stays MIT-licensed. | 4 |
| The optional team pack adds four policy starters and a review checklist. | 12 |
| No active team-pack license on this device. | 7 |
| Team pack ready. | 3 |
| Download the AWS, Kubernetes, PostgreSQL, and HTTP starter rules with the team review checklist. | 14 |
| Nothing to scrub yet. | 4 |
| Paste a log fragment or load the example, then try again. | 11 |
| No built-in pattern matched. | 4 |
| Add a custom CLI policy for project-specific values. | 8 |
| Copy was blocked by the browser. | 6 |
| Select the text and copy it manually. | 7 |
| The saved verdict is unchanged; verification will resume when connected. | 10 |
| Team-pack license active on this device. | 6 |
| License no longer active. | 4 |
| You can purchase or paste another token. | 7 |
| Could not reach license verification. | 5 |
| The saved verdict is unchanged; try again when connected. | 9 |
| License received. | 2 |
| Confirming it with Sociobot… | 4 |
| Verifying license… | 2 |

The generated success status has a four-word base (“N sensitive values
replaced”) plus two words per matched rule; all five built-in rules produce at
most 14 words. Copy flags are F-2-13 through F-2-24. All action labels name an
outcome or the expected demo transition: **Try it with sample data**, **Load
sample**, **Scrub this fragment**, **Copy result**, **Copy command**, **Install
the CLI**, **Buy the team pack**, **Verify license**, and **Download policy
pack**.

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
| The browser demo is available at <https://scrubbed-log-casefile.sociobot.in/demo/>. | 7 |
| It works offline after the first visit. | 7 |
| Scrub input stays in the tab and is not saved. | 10 |
| Keep the password out of shell arguments. | 7 |
| The built-in policy covers common private keys, URL credentials, authorization headers, credential assignments, JWTs, emails, and IPv4 addresses. | 18 |
| Quoted JSON and YAML credential keys are supported. | 8 |
| Repeated values receive the same token inside one casefile. | 9 |
| Separate casefiles use different salts. | 5 |
| Existing output is preserved unless `--force` is present, and a failed pack leaves no temporary archive. | 16 |
| A named `value` capture replaces only the sensitive value. | 9 |
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
| Every public claim and its sandbox command is listed in `.factory/claims.json`. | 11 |
| Demo isolation is documented in `.factory/demo.md`. | 6 |
| `npm run build:site` writes the static site to `dist/site`. | 9 |
| The factory deploys that directory to <https://scrubbed-log-casefile.sociobot.in>. | 7 |
| This repository does not change DNS, billing, or other infrastructure. | 10 |
| MIT. | 1 |
| See LICENSE. | 2 |

The sentence “Every public claim and its sandbox command is listed” is
currently false because of F-2-2, F-2-4, F-2-6, F-2-7, and F-2-8.

## Demo and sandbox evidence

- One click opens `/demo/` with incident `INC-1842`, realistic raw data, a
  precomputed scrubbed output, “Demo — sample data, nothing is saved,” **Reset
  demo**, and **Start for real**.
- Reset restored the exact original input and output. Start for real opened
  `/#install`. No license or other real-data key was touched.
- A unique email/password/IP input scrubbed locally. Nineteen observed requests
  across landing and demo had only the product origin; no URL or body contained
  the sentinel. localStorage and sessionStorage were empty, IndexedDB had no
  database, and Cache Storage contained no sentinel.
- After service-worker activation, HTTP-cache clearing, and offline mode,
  `/demo/` reloaded and scrubbed a new email.
- `casefile demo --json` ran from `/tmp/casefile-review2-cli.RVLvpI` and created
  two sample files, eight redactions, an encrypted archive, and a printed demo
  password under a separate generated temporary directory.
- The phone first-screen and browser/CLI semantic exceptions are findings
  F-2-1 and F-2-5.

## Declared claims

Fresh clone: `/tmp/casefile-review2-clean.BsThPT/repo`, at reviewed commit,
followed by `npm ci`. Every command string in `.factory/claims.json` ran
independently.

| Claim | Result |
|---|---|
| `browser-local` | PASS, with incomplete scope recorded as reopened F-1-2 |
| `license-storage` | PASS |
| `offline-reload` | PASS |
| `cli-demo` | PASS, with extra unlisted details in F-2-6 |
| `credential-redaction` | PASS |
| `encrypted-casefile` | PASS, with fingerprint detail unlisted in F-2-7 |
| `aes-256` | PASS |
| `password-env` | PASS |
| `machine-json` | PASS |
| `exit-codes` | PASS |
| `custom-rules` | PASS |
| `stable-tokens` | PASS command, inadequate observable scope in F-2-3 |
| `atomic-output` | PASS |
| `single-binary` | PASS |
| `cli-local` | PASS |
| `team-policy-pack` | PASS |
| `cli-recording` | PASS |

No listed command failed. The unlisted and inadequately covered claims above
still prevent a claim-complete result.

## History recheck

The review read `.factory/review-1.md`, `.factory/polish-1.md`, and the prior
`.factory/handoff.md`, then rechecked every earlier finding live and in code.

| Earlier finding | Round-2 result |
|---|---|
| F-1-1 payment/refund claims | Fixed. The promises are absent from landing, README, Terms, and claims copy. |
| F-1-2 browser-local regression | **Half-fixed; reopened as BLOCKING.** Demo scrub/storage coverage exists, but the named landing preview and all-site tracking scope are omitted. |
| F-1-3 clipped hero art | Fixed. Figure, image, caption, and stamp fit at 390 and 1440. |
| F-1-4 route focus/announcement | **Half-fixed; reopened as BLOCKING.** Header-nav paths work; footer and wordmark paths do not. |
| F-1-5 nav consistency and workflow jargon | Fixed for the original scope. All normal routes show the same four header links, and the workflow now says “How it works” / “Scrub and package an incident log.” New copy flags are separately identified above. |

## Structure, links, accessibility, and visual identity

- `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html` each have `lang=en`,
  one h1, one main, a route title, description, canonical, OG/Twitter metadata,
  local favicon, and local social art. Home title is 49 characters. Unknown
  routes return the designed 404 with HTTP 404.
- All 14 unique discovered links returned HTTP 200 after redirects, including
  the Sociobot checkout and source repository. Hash targets exist.
- The header navigation is consistent. Footer and focus exceptions are F-2-11
  and reopened F-1-4.
- Live `@axe-core/playwright` WCAG 2 AA scans found zero violations on all five
  routes at 390 and 1440. Reduced motion removes the 180ms transition. The
  default-size touch-target exception is F-2-10.
- `verify-url.sh` passed live in 823ms with no console errors, one h1, `lang`,
  `main`, labelled buttons, and no missing image alt. The standalone axe CLI
  could not create its Selenium Chrome session; the pinned Playwright axe scan
  above is the successful equivalent.
- The concrete/moss evidence-slab art, slab-serif/monospace typography, hard
  borders, and stamp controls are visually distinct and match
  `.factory/design.md`; this is not a generic gradient/card SaaS template.

## Verification summary

| Command/check | Result |
|---|---|
| 17 individual claim commands from clean clone | PASS |
| `npm test` | PASS, 3/3 |
| `npm run typecheck`; `npm run lint` | PASS |
| `npm run build` | PASS; `dist/site`; home JS 2.28 KiB gzip, CSS 3.30 KiB gzip |
| `npm run test:e2e -- --reporter=line` | PASS, 31/31; test gaps are findings above |
| `cargo fmt --check` | PASS |
| `cargo clippy --all-targets -- -D warnings` | PASS |
| `cargo test --all-targets` | PASS, 4 library + 12 integration |
| Live request/storage/offline checks | PASS, except false reconnect copy F-2-2 |
| Live metadata/404/link crawl | PASS |
| Live Playwright axe, five routes × two viewports | PASS, zero violations |

## What would make this perfect

1. Put a real scrubbed before/after result in the phone demo’s initial
   viewport and disclose or remove the browser/CLI token-semantic difference.
2. Complete both reopened fixes: cover landing privacy in the claim regression
   and focus/announce routes reached through footer and wordmark links.
3. Remove or implement the false reconnect promise, then list and test every
   remaining public claim at its actual product boundary.
4. Test stable tokens by packing and decrypting two real CLI casefiles.
5. Keep all three first-screen facts visible and make every touch target at
   least 44×44px at the default phone size.
6. Add an inspect/review command so the documented “review before sharing” step
   is executable without an undocumented external workflow.
7. Apply every proposed copy rewrite and use one term each for the casefile,
   rules, and policy file.
8. Add the product one-liner to every footer. After those changes, rerun this
   entire checklist from fresh contexts rather than only the changed tests.
