# Verification handoff — FAIL

Date: 2026-08-28 UTC
Work order: `scrubbed-log-casefile-verify-2`
Candidate: `8b91b1da16cec7955b74f0afe9dd0f01dd19b6f3`
Live URL: <https://scrubbed-log-casefile.sociobot.in>

## Result

**FAIL — do not release this candidate.** This is not a deployment-only
failure. The live site matches the candidate build byte-for-byte, and the core
CLI/demo behavior passes, but mandatory product-contract defects remain.

Full evidence and remediation are in [verification-2.md](verification-2.md).

## Release blockers

- The claims inventory is incomplete. Public AES-256, password-argument,
  exact-exit-code, browser tracking, checklist, and future-update statements
  are not fully represented and tested. The `machine-json` claim names success,
  validation, and parse failures, but its tagged test asserts only one parse
  failure.
- The $19 card promises a team policy review checklist. The only unlocked
  download contains four JSON rules and a short note, not a checklist.

Additional findings: the mobile Terms target is 38.4×44 px instead of 44×44;
the landing page lacks the required recording of the real CLI demo; and
non-home Twitter/404 metadata is incomplete.

## What passed

- All 12 declared claim commands passed separately before broader QA.
- Cold first-read and one-click sample demo passed at desktop and 390 px.
- `npm ci`, audit, unit tests, typecheck, lint, 22 E2E tests, Rust fmt/clippy,
  13 Rust tests, exact production build, `cargo package`, and clean consumer
  install all passed.
- The installed `casefile 0.1.1` demo/pack, JSON error paths, overwrite
  recovery, encryption/redaction, stable tokens, custom rules, and atomic
  behavior passed.
- All live artifacts match `dist/site`; routes, 404, security/cache headers,
  links, privacy request log, cached unlock, checkout redirect, service-worker
  update/offline reload, keyboard, reduced motion, 200% text, and zero axe
  violations passed.
- Lighthouse mobile: 100 performance, 100 accessibility, 100 best practices,
  100 SEO; FCP 0.9 s, LCP 1.4 s, TBT 70 ms, CLS 0.
- License verification throttling: an 80-request burst returned 30 successes
  and 50 HTTP 429 responses; every 429 included `Retry-After`.

## Re-run

```sh
npm ci
npm audit --audit-level=high
npm test
npm run typecheck
npm run lint
cargo fmt --check
cargo clippy --all-targets -- -D warnings
cargo test --all-targets
npm run test:e2e
npm run build
cargo package
```

No product code was changed. Only this handoff and the new independent
verification report were written.
