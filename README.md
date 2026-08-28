# Scrub incident logs before sharing

Scrubbed Log Casefile is for engineers escalating a bug. It replaces common
credentials and identifiers while keeping repeated values useful inside one
casefile. A casefile is an AES-256 encrypted ZIP. Its manifest lists rule
names and counts, not matched values.

It is a local CLI, not a log host or complete personal-data detector. Review
every casefile before sharing it.

## Try the bundled demo

Build the single `casefile` binary, then run the two-file sample:

```sh
cargo install --path .
casefile demo
```

The command creates a new temporary directory. It prints the sample path,
casefile path, and demo password. The same sample is committed under
`examples/incident/`.

Try the isolated browser sample at
<https://scrubbed-log-casefile.sociobot.in/?demo=1>. It starts ready, stores
edits only in memory, and resets without touching license data. Landing and
demo scrubbing send no input. The demo works offline after the first visit.

The browser rules cover emails, IPv4 addresses, credentials, bearer tokens,
and JWTs. Repeated values match within one demo page. A new page uses different
replacements.

## Pack an incident

Keep the password out of shell arguments:

```sh
export CASEFILE_PASSWORD='use-a-long-unique-passphrase'
casefile pack ./incident \
  --output vendor.casefile.zip \
  --password-env CASEFILE_PASSWORD
```

The built-in policy file covers private keys, URL credentials, authorization
headers, credential assignments, JWTs, emails, and IPv4 addresses. It also
supports quoted JSON and YAML credential keys.

The same value gets the same replacement within one casefile. A second
casefile uses different replacements. A failed pack keeps existing output and
leaves no partial casefile.

## Review a casefile

Read the manifest before sharing:

```sh
casefile inspect vendor.casefile.zip \
  --password-env CASEFILE_PASSWORD
```

Add `--extract` to write scrubbed files into a new temporary review directory.
Safe relative paths are preserved. Extraction starts in a new empty directory.

The manifest records a one-way file fingerprint that differs between
casefiles. It also records rule names and hit counts without matched values.

## Add a project rule

A named `value` capture replaces only the sensitive value:

```json
{
  "rules": [
    {
      "name": "tenant-id",
      "kind": "TENANT",
      "pattern": "tenant=(?P<value>[A-Z0-9]{8})"
    }
  ]
}
```

```sh
casefile pack ./incident \
  --policy casefile-policy.json \
  --output vendor.casefile.zip
```

`pack --json` writes one machine-readable success or error object. Exit codes
are `0` for success, `2` for invalid input, and `1` for a runtime failure.

## Privacy and security limits

The CLI package contains no network or telemetry client. Every ZIP entry uses
AES-256 encryption with the user-held password. The CLI accepts that password
only through an environment variable.

Rules cannot detect every secret or identifier. Inspect the policy file and
send the casefile password through a separate channel.

## Optional team pack

The CLI and safety features remain MIT-licensed. A $19 one-time license adds
four policy starters and a team review checklist.

## Develop and verify

```sh
cargo test --all-targets
cargo fmt --check
cargo clippy --all-targets -- -D warnings
npm ci
npm test
npm run typecheck
npm run test:e2e
npm run build:site
cargo package --allow-dirty
```

Every public claim and its sandbox command is listed in
`.factory/claims.json`. Demo isolation is documented in `.factory/demo.md`.

## Deploy

`npm run build:site` writes the static site to `dist/site`. The factory deploys
that directory to <https://scrubbed-log-casefile.sociobot.in>. This repository
does not change DNS, billing, or other infrastructure.

## License

MIT. See [LICENSE](LICENSE).
