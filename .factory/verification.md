# Independent product verification — FAIL

Date: 2026-08-28 UTC  
Candidate: `6eb2c42f69927be06262771ff4f8d0c5e6ec9327`  
Live URL: <https://scrubbed-log-casefile.sociobot.in>  
Work order: `scrubbed-log-casefile-verify-1`

## Verdict

**FAIL — do not release this candidate.** The mandatory claims gate and
first-read/demo gate both fail. Independent CLI testing also found that common
JSON password and API-key values survive in the decrypted casefile.

The checkout and live deployment are reachable. This is not a deployment-only
failure. The deployed home, legal pages, service worker, assets, manifest,
robots file, and sitemap are byte-for-byte identical to this candidate's fresh
production build.

## Mandatory gates

### Claims gate — FAIL (release blocker)

`.factory/claims.json` is absent. This was checked before installation or any
other repository task. Therefore there were no declared claim commands to run,
and the acceptance contract explicitly makes the missing file release-blocking.

The landing page and README contain many unlisted claims, including “LOCAL /
OFFLINE / ENCRYPTED,” “No telemetry,” “secrets do not [remain],” AES-256 ZIP,
stable identifiers, value-free manifests, atomic failure, local-only browser
processing, and per-case salts. None has a required `@claim:<id>` sandbox test.

### Cold first read and sample demo — FAIL (release blocker)

Cold read at 1440×900 and 390×844:

- What it does: the screen says it builds a vendor-ready incident bundle and
  removes unsafe values.
- For whom: the first screen never plainly says “engineers” or otherwise names
  the intended user.
- What to click first: it presents two competing actions, “Install the CLI” and
  “Test the scrubber,” rather than one primary first step.
- There is no “Try it with sample data” action on the first screen. The existing
  “Load example” control is 2,194 CSS px down the desktop page and 2,781 px down
  at 390 px.

The CLI also has no `casefile demo` or `--demo` entry point (`casefile demo`
exits 2 as an unrecognized subcommand), no `examples/` sample, and no
`.factory/demo.md`. `/demo` returns the ordinary homepage with a 200 status,
not a demo sandbox or demo-specific title/banner/reset flow.

## Defects

### Critical — standard JSON credentials are not scrubbed

The installed release package was given this representative configuration:

```json
{
  "owner": "ria@example.com",
  "server": "0.0.0.0",
  "password": "json-secret-value",
  "api_key": "quoted-api-key-value"
}
```

After packaging and AES decryption, the archive contained:

```json
{
  "owner": "<EMAIL:D9C819D8>",
  "server": "<IPV4:C10BC195>",
  "password": "json-secret-value",
  "api_key": "quoted-api-key-value"
}
```

The manifest recorded only the email and IPv4 hits for that file. The built-in
credential regex does not allow a quoted JSON key before the colon. This
violates the central job of safely packaging logs/configuration and contradicts
the first-screen statement that “secrets do not” remain. The product warns that
rules cannot detect everything, but password and API-key assignments are
explicit built-in classes and ordinary JSON is a promised input format.

### High — offline reload does not load the demo

The site installs a service worker and advertises offline operation. In a fresh
Chromium context, after the first visit and service-worker activation, the HTTP
browser cache was cleared, the context was taken offline, and the page was
reloaded. The HTML title loaded, but both hashed app assets failed:

```text
/assets/home-D9rzHveH.js    net::ERR_FAILED
/assets/styles-YMeZLRGx.css net::ERR_FAILED
```

The scrub button remained inert and the summary stayed “Waiting for input.”
`sw.js` precaches HTML and the hero but omits the hashed JS/CSS. Its fixed
`casefile-shell-v1` cache and cache-first HTML strategy also lack a build-bound
update path, so a later deployment can leave returning users on stale HTML.
The repository's current offline e2e test only toggles offline after the app is
already loaded; it does not test offline reload.

### Medium — live response policy does not apply the repository policy

The live home response has HSTS, `X-Content-Type-Options`, and
`Referrer-Policy`, but no CSP, no `Permissions-Policy`, and no framing policy.
The checked-in `_headers` file declares these protections, so it is not being
honored by the deployment. Hashed JS, CSS, and image assets and `sw.js` all
receive `Cache-Control: public, must-revalidate, max-age=30`; hashed assets are
not immutable and the service worker is not `no-cache` as declared. The web
manifest is served as `application/octet-stream`.

### Medium — `--json` does not cover command-line parse errors

Runtime/validation errors such as a short password, missing file, bad policy,
wrong extension, existing output, and empty rule set correctly return a JSON
object on stdout with exit 2. However:

```text
casefile pack --json
```

exits 2 with zero stdout bytes and human-readable Clap usage on stderr. This
contradicts the documented statement that `--json` writes a machine-readable
success or error object.

### Medium — 200% text and touch targets miss the accessibility baseline

- At 390 px with root text resized to 200%, document width grows to 472 px.
  The header Install action extends to x=472 and content requires horizontal
  scrolling.
- Footer Privacy, Terms, and Source links are about 20 px tall rather than the
  required 44 px touch target.

Normal-size keyboard operation, focus rings, reduced motion, and automated axe
checks pass.

### Medium — required routes and metadata are incomplete

- An unknown path returns the homepage with status 200; there is no designed
  404 response.
- `/demo` is not a real demo route and keeps the home title.
- Canonical, Open Graph, Twitter-card, apple-touch-icon, and the required
  1200×630 share image metadata are absent. Legal pages also omit meta
  descriptions.
- The footer does not expose a version/build id.
- `.factory/copy-audit.md` is absent.

## Fresh local verification

The clone began clean on `main` at the exact candidate commit.

| Check | Result |
|---|---|
| `npm ci` | PASS; 60 packages audited, 0 vulnerabilities |
| `cargo test` | PASS; 3 library + 5 CLI/integration tests |
| `cargo clippy --all-targets -- -D warnings` | PASS |
| `cargo fmt --check` | PASS |
| `npm test` | PASS; 2 Vitest tests |
| `npm run test:e2e` | PASS; 4 Playwright tests |
| `npm audit --audit-level=high` | PASS; 0 vulnerabilities |
| `npm run build` | PASS; production output in `dist/site` |
| `cargo package --allow-dirty` | PASS; 10 files, 58.1 KiB unpacked / 17.6 KiB compressed |
| Install packaged crate into a fresh temporary Cargo root | PASS; `casefile 0.1.0` |
| `npm pack --dry-run` | PASS (site package is private; not published) |

There is no repository TypeScript typecheck or JavaScript lint script beyond
the Vite build and tests. No publishing was performed.

## CLI end-to-end evidence

Positive paths:

- A seeded file containing one example of each built-in class produced seven
  redactions: private key, URL credentials, authorization header, credential
  assignment, JWT, email, and IPv4. AES-decrypted contents contained tokens and
  none of the seeded values.
- The same email in three positions across two files produced the same token.
  A second archive produced a different token, confirming per-case salt.
- A named custom `tenant-id` rule preserved `tenant=` and replaced only its
  value.
- Archive entry and manifest decryption with the user-held password succeeded.
  The manifest contained rule/count provenance, salted fingerprints, and no
  matched values.
- An email in a filename was removed from the archive entry name.

Boundary, failure, and recovery paths:

- 11-character password: exit 2, JSON error, no output.
- Missing input, wrong output extension, invalid policy, and no active rules:
  exit 2 with actionable JSON errors.
- Existing output without `--force`: exit 2 and byte hash unchanged.
- Existing output with `--force`: exit 0 and a valid encrypted archive.
- All-binary input: exit 2; output directory remained empty, confirming temp
  cleanup.
- Symlink in a mixed directory: skipped and recorded in the manifest.
- Invalid IPv4 `999.999.999.999`: retained and not falsely counted.
- Browser preview empty input focuses the textarea, announces how to recover,
  and disables copy; unmatched input stays intact with a custom-policy hint.

The standard-JSON credential failure above prevents the success measure from
passing even though repeated-identifier correlation itself passed.

## Live deployment, browser, privacy, and paid flow

Deployment identity:

- Live `index.html`, privacy/terms HTML, hashed JS/CSS, hero WebP, `sw.js`,
  robots, sitemap, and manifest all matched fresh `dist/site` files byte for
  byte. Example SHA-256 prefixes: home `45ca14db54921431`, JS
  `1a82b5a19a6e0fac`, CSS `b927d632b3125b8f`, hero `576dfc834b068c28`.

Browser/accessibility passes:

- Desktop 1440×900 and mobile 390×844 have no normal-size horizontal overflow,
  console errors, page errors, or failed initial requests.
- Home, Privacy, and Terms each have `lang="en"`, one `h1`, and one `main`.
- Independent axe scans found zero violations on all three live routes.
- Keyboard-only demo operation works; the skip link is first, Enter bypasses
  header navigation, all tested controls have a visible 3 px focus ring, and
  there is no trap.
- `prefers-reduced-motion: reduce` changes smooth scrolling to auto and reduces
  transitions to 0.01 ms.
- Normal mobile layout visually stacks intentionally and keeps width at 390 px.

Privacy and unlock passes:

- Initial load and the complete sample scrub flow requested only the product's
  own origin; scrubbing triggered zero requests.
- After demo use, localStorage and sessionStorage were empty. The CLI source has
  no HTTP client dependency or network call; the only browser `fetch` is the
  documented Sociobot license verification.
- A fresh invalid return token was saved under the required key, removed from
  the address bar, verified, and relocked with a clear notice.
- A current cached valid verdict unlocked immediately, made no verification
  request, and downloaded the four-rule AWS/Kubernetes/PostgreSQL/HTTP policy
  pack. Core export/safety remains free.
- Checkout responds 303 from the Sociobot API to hosted Dodo checkout. No
  provider is embedded directly. Privacy and terms routes are reachable.
- No sign-in is required, so the Entra-authority condition is not applicable.

Rate limiting:

- A single invalid verification returned 200 JSON with `valid:false`,
  `reason:"invalid"`, `Cache-Control: no-store`, and correct origin-specific
  CORS.
- A rapid parallel burst of 100 verification requests produced 31 × 200 and
  69 × 429. The first indexed 429 was request 27 (parallel completion order is
  nondeterministic). Every sampled 429 included `Retry-After: 3` and
  `X-RateLimit-After: 3`. Rate limiting therefore passes.

Links and routes:

- Home, Privacy, Terms, robots, sitemap, manifest, and all candidate assets
  return 200. The source repository returns 200. Checkout returns 303.
- The soft-404 and fake `/demo` behavior remain defects as listed above.

## Performance and budgets

Fresh Lighthouse 12.8.2 mobile rerun against the live URL:

- Performance 100
- Accessibility 100
- Best Practices 100
- SEO 100
- FCP 0.9 s, LCP 1.4 s, TBT 10 ms, CLS 0

Build assets are within contract budgets: JS 5.71 KB raw / 2.82 KB gzip, CSS
10.36 KB raw / 2.97 KB gzip, hero 105,038 bytes, and no web fonts. The cache
policy defect is separate from the size/performance pass.

## Required remediation before another candidate

1. Add `.factory/claims.json` and one real sandbox test per landing/README
   claim, including privacy and an offline reload—not merely offline use of an
   already loaded page.
2. Add the mandatory first-screen “Try it with sample data” path, a shipped CLI
   demo/sample in a temporary directory, and `.factory/demo.md`.
3. Fix and regression-test credential rules for common quoted JSON/YAML keys;
   use seeded decrypted-archive tests for every configured secret class.
4. Precache the complete PWA shell with a build-versioned update strategy.
5. Ensure the production host applies CSP, framing, permissions, and intended
   cache headers.
6. Make all `--json` failures JSON, repair resize/touch issues, and complete
   404/metadata/copy-audit requirements.
