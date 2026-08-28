# Independent product verification 2 — FAIL

Date: 2026-08-28 UTC
Candidate: `8b91b1da16cec7955b74f0afe9dd0f01dd19b6f3`
Live URL: <https://scrubbed-log-casefile.sociobot.in>
Work order: `scrubbed-log-casefile-verify-2`

## Verdict

**FAIL — do not release this candidate.** The repaired CLI, browser demo, live
deployment, offline flow, privacy behavior, and declared claim commands work.
However, the mandatory claim inventory is still incomplete, its
`machine-json` test does not exercise the whole declared claim, and the paid
card promises a review checklist that the only paid download does not contain.
The acceptance contract says any unlisted public claim fails review. There are
also smaller touch-target, CLI-demo presentation, and route-metadata defects.

This is not a deployment-only failure. Every deployed static artifact is
byte-for-byte identical to the fresh production build from this candidate.

## Mandatory gates

### Declared claim commands — PASS (12/12)

`.factory/claims.json` exists. Before installation or broader QA, each listed
command was run separately from the clean checkout. Each selected exactly one
test and passed:

| Claim | Result |
|---|---|
| `browser-local` | PASS |
| `offline-reload` | PASS |
| `cli-demo` | PASS |
| `credential-redaction` | PASS |
| `encrypted-casefile` | PASS |
| `machine-json` | PASS |
| `custom-rules` | PASS |
| `stable-tokens` | PASS |
| `atomic-output` | PASS |
| `single-binary` | PASS |
| `cli-local` | PASS |
| `team-policy-pack` | PASS |

The inventory/completeness gate nevertheless fails for the High defect below.

### Cold first read and one-click demo — PASS

At 1440×900 and 390×844, the cold first screen says:

- **What it does:** “Scrub incident logs before sharing.”
- **For whom/change:** engineers escalating bugs keep useful structure while
  common credentials and identifiers are replaced.
- **What to do first:** **Try it with sample data**, with adjacent copy saying
  that a ready example opens and nothing is saved.

The action is above the fold at both sizes. One click opens `/demo/`, whose
scrubbed result is already populated. The persistent banner says “Demo — sample
data, nothing is saved” and provides **Reset demo** and **Start for real**.

## Release-blocking defects

### High — public claims are absent from, or incompletely proved by, `claims.json`

The landing page and README make public statements that no claim entry tests:

- “AES-256” is stated on the landing page, in the CLI help, and in README. The
  `encrypted-casefile` claim and test prove encrypted/decryptable entries but
  do not name or assert the cipher strength.
- “Password stays out of arguments” is on the landing page but has no claim.
- README promises exact exit codes 0, 2, and 1. There is no exit-code claim.
- The Privacy page promises no analytics, ads, third-party fonts, or tracking
  scripts. The browser-local claim is narrower and only names scrub input.
- The $19 card promises a “Team policy review checklist” and “Future v1
  template updates.” The team claim covers only four policy starters.

In addition, the single `@claim:machine-json` test calls only
`json_flag_covers_command_line_parse_errors`. That Rust test asserts one parse
error. It does not test the success and validation-error cases named in the
claim. Independent manual calls showed those behaviors currently work, but the
required claim test does not prove them on every build.

The claims contract explicitly makes any unlisted claim a failed review until
copy is removed or test coverage is added.

### High — the paid download omits a listed purchase item

With a current cached-valid verdict, the live page unlocks and downloads
`casefile-team-policy-pack.json`. It contains exactly four rules and this note:

> Review and tailor these starters before use. No rule set guarantees complete detection.

It contains no team policy review checklist. No checklist exists elsewhere in
the package or repository; `rg` finds the phrase only in the pricing card. The
page therefore asks $19 for a listed item it does not deliver. Checkout itself
correctly redirects through the Sociobot API to hosted Dodo checkout; no charge
was made during verification.

## Other defects

### Medium — one mobile touch target is narrower than 44 px

At 390 px, the visible footer **Terms** link measures 38.4×44 CSS px. All other
visible controls measured at least 44 px in both dimensions. The contract
requires 44×44 px touch/click targets. Axe does not report this stricter
factory baseline.

### Medium — the CLI landing demo is not a recording of the real binary

`casefile demo` is real and works from the installed package, but the landing
page only shows a separate TypeScript preview and a static install command.
There is no self-hosted terminal recording of the real CLI completing the main
job, as required by the CLI demo contract.

### Medium — non-home routes have incomplete social metadata

`/demo/`, `/privacy/`, and `/terms/` declare only `twitter:card`; they omit
Twitter title, description, and image. `/404.html` has no canonical, Open
Graph, or Twitter metadata. Titles, descriptions, canonical URLs on the real
content routes, icons, and the 1200×630 image are otherwise correct.

## Fresh local verification

The checkout began clean at the exact candidate.

| Check | Result |
|---|---|
| `npm ci` | PASS; 61 packages installed, 0 vulnerabilities |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| `npm test` | PASS; 3/3 Vitest tests |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `cargo fmt --check` | PASS |
| `cargo clippy --all-targets -- -D warnings` | PASS |
| `cargo test --all-targets` | PASS; 4 library + 9 CLI/integration tests |
| `npm run test:e2e` | PASS; 22/22 Playwright tests |
| `npm run build` | PASS; exact production output in `dist/site` |
| `cargo package` | PASS; 12 files, 68.2 KiB unpacked / 19.5 KiB compressed |
| Install packaged crate into a fresh Cargo root | PASS; one `casefile` binary, v0.1.1 |

The production build has 3.0 KB gzip of initial JS across the home/shared
chunks, 3.2 KB gzip CSS, no web fonts, and a 105,038-byte hero image. These are
well below the 200 KB JS, 50 KB CSS, 120 KB fonts, and 300 KB hero budgets.

## CLI end-to-end evidence

The clean consumer installation exposed one binary. `casefile demo --json`
copied the two bundled sample files into a unique temporary directory and
created a three-entry encrypted archive with eight redactions. Package contents
include both `examples/incident/app.log` and `config.json`.

The shipped binary was also exercised independently:

- normal forced packing: exit 0, two files, eight redactions;
- existing output without `--force`: exit 2 and the SHA-256 stayed unchanged;
- missing arguments, missing input, wrong extension, 9-character password, and
  no active rules: exit 2, one JSON object on stdout, empty stderr, no output;
- unwritable `/proc` destination: exit 1 with a JSON runtime error;
- no unexpected archive or temporary file remained after failures.

The Rust integration tests decrypt the entries and manifest using the
user-held password. They confirm removal of private keys, URL/header
credentials, quoted JSON/YAML assignments, JWTs, emails, and IPv4 addresses;
stable same-case tokens; different cross-case salts; value-free manifests;
custom named captures; and atomic existing-output behavior.

## Live deployment and browser evidence

### Candidate identity, routes, headers, and caching

All generated HTML, JS, CSS, images, service worker, manifest, robots, and
sitemap files match the live bytes. Examples:

- home SHA-256:
  `24d159b1d29ccd0c20da87019c944694c9b0d3bbab051aa80648b84f8ee54cc1`
- home JS SHA-256:
  `50cc640a55d1e679db9aa9dadecffec9706a94862359bc2c9da95da358699ff9`
- service worker SHA-256:
  `a8ded0951ea23206b1bdc021ad3b4bf770603487ff08db22962e7b618293d934`

Home, Demo, Privacy, Terms, manifest, robots, sitemap, and all assets return
200 with correct MIME types. An unknown route returns the designed HTML with
HTTP 404. Every crawled link/fragment resolves; checkout returns 303 and the
source repository returns 200.

Live HTML and `sw.js` use `Cache-Control: no-cache`; hashed assets use one-year
`immutable`; the manifest is cached for one hour. CSP allows only self plus the
documented Sociobot API connection. HSTS, `Permissions-Policy`,
`Referrer-Policy: no-referrer`, no-sniff, and `X-Frame-Options: DENY` are live.

### Browser, accessibility, privacy, and offline

- Independent WCAG 2 AA axe scans at desktop and 390 px found zero violations
  on `/`, `/demo/`, `/privacy/`, `/terms/`, and `/404.html`.
- Factory `verify-url.sh`: HTTP 200 in 706 ms, correct title/lang, one h1/main,
  zero missing alt/unnamed buttons, and no console errors.
- Keyboard-only skip navigation and the sample-data action work. Focus is a
  visible 3 px moss outline. There is no trap.
- At 390 px, normal and 200% text both remain 390 px wide with no horizontal
  overflow. Reduced motion changes smooth scrolling to `auto` and transition/
  animation durations to 0.01 ms.
- Empty browser input focuses the textarea, disables copy, and announces the
  recovery step. Unmatched input is preserved with a custom-policy suggestion.
- A complete sample/edit/scrub/reset flow made only same-origin requests.
  Scrubbing made no request. localStorage/sessionStorage were empty,
  `indexedDB.databases()` was empty, and the public shell cache contained none
  of a unique test input. There were no console, page, or request errors.
- The content-addressed `casefile-shell-599d340bf314` service worker updated
  successfully with no waiting worker. After clearing HTTP cache and going
  offline, `/demo/` reloaded and scrubbed a newly entered email.

### Paid unlock and request allowance

An invalid returned license was stored under the required key, stripped from
the URL, verified only with `api.sociobot.in`, and relocked with a clear notice.
A current cached-valid verdict unlocked immediately without a network request.
No sign-in is required, so the Entra-authority condition is not applicable.

The verification endpoint returned invalid-license JSON with origin-specific
CORS and `Cache-Control: no-store`. A fresh 80-request single-client burst
produced 30 × 200 and 50 × 429; every 429 had `Retry-After` (observed 0–3
seconds) and `X-RateLimit-After`. The observed burst allowance is therefore 30
successful requests before active throttling.

## Performance

Lighthouse 12.8.2 mobile against the live site exited 0:

- Performance 100
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 0.9 s, LCP 1.4 s, TBT 70 ms, CLS 0

## Required remediation

1. Inventory and test every public claim. Expand the machine-JSON claim test
   to success, validation, and parse errors; directly test AES-256 if retained;
   add or remove the remaining unlisted statements.
2. Deliver a real review checklist with the paid pack, or remove it from the
   purchase card. Make any update entitlement concrete and testable.
3. Give the Terms link at least a 44×44 px target.
4. Add the required self-hosted recording of the real CLI demo.
5. Complete Twitter metadata on Demo/Privacy/Terms and route metadata on 404.
