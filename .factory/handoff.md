# Handoff — Scrubbed Log Casefile v0.1.0

## What shipped

- A Rust `casefile` single-binary CLI with a focused `pack` command.
- Recursive files/directories, deterministic archive paths, symlink refusal,
  binary/non-UTF-8 skip records, and collision-safe entry names.
- Conservative built-in rules for private keys, URL credentials,
  authorization headers, credential assignments, JWTs, email addresses, and
  IPv4 addresses.
- User-owned JSON rules, including a named `value` capture that preserves safe
  surrounding context.
- Stable per-casefile placeholders derived with a random salt. Repeated values
  remain correlatable inside a casefile and not across separate casefiles.
- WinZip AES-256 encrypted ZIP output. The password comes from a named
  environment variable and never from an argument or hosted service.
- A value-free encrypted manifest with salted source fingerprints, byte counts,
  rule names/counts, skipped-file reasons, tool version, and explicit safety
  disclaimer.
- Atomic output through a same-directory temporary file; failures clean up and
  existing files require `--force`.
- `--json` success/runtime-error output and documented exit codes.
- A Vite landing/docs site in `dist/site`, with a browser-only scrub preview,
  offline state, responsive 390px layout, keyboard paths, privacy/terms pages,
  PWA shell cache, and no analytics, runtime CDN, or remote font.
- $19 one-time Team Policy Pack checkout/restore flow via Sociobot only. License
  tokens use the required localStorage key, URL tokens are stripped, cached
  verdicts are optimistic and refreshed at most daily, and the free safety core
  remains complete.
- Original concrete evidence-slab hero generated with the requested Param
  Factory image deployment and optimized to a 103 KB WebP. Prompt/deployment
  provenance is stored beside it and in `.factory/design.md`.

## How to run

```sh
cargo install --path .
export CASEFILE_PASSWORD='a-long-unique-passphrase'
casefile pack ./incident --output vendor.zip

npm ci
npm run dev
```

The exact static build command is `npm run build` (or the equivalent explicit
`npm run build:site`), and the deploy root is `dist/site` with `index.html` at
that root.

## Verification completed 2026-08-28

- `cargo test`: pass (3 library tests, 5 CLI/integration tests, doc tests).
- Integration test decrypts both an AES-256 file entry and the manifest,
  confirms values are absent, validates stable replacement, and exercises the
  documented custom-policy example.
- `cargo clippy --all-targets -- -D warnings`: pass.
- `cargo package --allow-dirty`: pass; publishable crate produced under
  `target/package/` (factory owns registry credentials; nothing was published).
- `npm test`: pass (2 browser redaction unit tests).
- `npm run test:e2e`: pass (4 Playwright tests): keyboard operation at 390px,
  offline behavior, no console errors, and axe scans for home/privacy/terms.
- `npm audit --audit-level=high`: pass, zero vulnerabilities.
- `npm run build`: pass; output confirmed in `dist/site`.
- `npm pack --dry-run`: pass; 140 KB package tarball estimate.
- Lighthouse 12.8.2 mobile production build: Performance 100,
  Accessibility 100, Best Practices 100, SEO 100; FCP 0.9 s, LCP 1.7 s,
  total blocking time 0 ms, CLS 0.
- Initial assets: JS 5.71 KB raw / 2.82 KB gzip; CSS 10.36 KB raw / 2.97 KB
  gzip; hero 103 KB. These are below the 200/50/300 KB budgets.
- Manual full-page visual inspection completed at 390×844 and 1440×900.

## Known gaps and next steps

- Rule-based matching is intentionally not described as complete PII detection.
  Teams should add and test project-specific rules and review casefiles before
  sharing them.
- The factory still needs to register the production paid product and return
  URL. No product ID or payment-provider credential is embedded here.
- Release binaries are not attached from this worker. The crate is ready for
  `cargo package`; CI/release automation can cross-compile signed binaries.
- The team pack is a compact v1 starter policy. Future releases can expand it
  with fixture-tested vendor-specific variants without changing the core file
  format.
