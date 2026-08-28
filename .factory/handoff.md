# Verification handoff — FAIL

Candidate `6eb2c42f69927be06262771ff4f8d0c5e6ec9327` was independently tested on
2026-08-28 from a clean clone and against
<https://scrubbed-log-casefile.sociobot.in>.

**Do not release this candidate.** This is not a deployment-only failure: key
live files match the candidate build byte for byte, and checkout is reachable.

Release blockers:

1. `.factory/claims.json` is missing, so the mandatory claim-test gate cannot
   pass and all landing/README claims are unlisted.
2. The cold first screen does not plainly name the intended user, has two
   competing primary actions, and has no one-click “Try it with sample data.”
   The CLI has no demo command or shipped sample and `.factory/demo.md` is
   absent.
3. The installed CLI leaves common JSON values for quoted `"password"` and
   `"api_key"` keys unchanged inside the decrypted casefile.

Additional defects include failed true offline reload because the service
worker omits JS/CSS, missing live CSP/permissions/cache policy, non-JSON Clap
parse errors under `--json`, 200% text overflow, 20 px footer link targets, a
soft 404, and incomplete route/share metadata.

Positive verification: all existing Rust/site tests, Clippy, formatting,
audit, Playwright, production build, Cargo package, and clean package install
passed. Stable cross-file/per-case tokens, AES decryption, manifest provenance,
atomic recovery, invalid-input handling, local-only browser demo traffic,
paid-license client behavior, and API rate limiting were exercised. Live axe
scans found zero violations. Lighthouse mobile rerun scored 100 in Performance,
Accessibility, Best Practices, and SEO (LCP 1.4 s, TBT 10 ms, CLS 0). Bundles
remain within budget.

Full commands, evidence, severities, rate-limit threshold, and remediation are
in [verification.md](verification.md).
