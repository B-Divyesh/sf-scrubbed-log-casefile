# Scrub incident logs before sharing

Scrubbed Log Casefile is for engineers escalating a bug. It replaces common
credentials and identifiers while keeping repeated values useful inside one
case. The result is an encrypted ZIP with a value-free rule manifest.

It is a local CLI, not a log host or complete PII detector. Review every
casefile before sharing it.

## Try the bundled demo

Build the single `casefile` binary, then run the two-file sample:

```sh
cargo install --path .
casefile demo
```

The command prints its temporary sample directory, encrypted archive, and demo
password. The same sample is committed under `examples/incident/`.

The browser demo is available at
<https://scrubbed-log-casefile.sociobot.in/demo/>. It works offline after the
first visit. Scrub input stays in the tab and is not saved.

## Pack an incident

Keep the password out of shell arguments:

```sh
export CASEFILE_PASSWORD='use-a-long-unique-passphrase'
casefile pack ./incident \
  --output vendor.casefile.zip \
  --password-env CASEFILE_PASSWORD
```

The built-in policy covers common private keys, URL credentials,
authorization headers, credential assignments, JWTs, emails, and IPv4
addresses. Quoted JSON and YAML credential keys are supported.

Repeated values receive the same token inside one casefile. Separate
casefiles use different salts. Existing output is preserved unless `--force`
is present, and a failed pack leaves no temporary archive.

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
  --output vendor.zip
```

`--json` writes one machine-readable success or error object. Exit codes are
`0` for success, `2` for invalid input, and `1` for a runtime failure.

## Privacy and security limits

The CLI package contains no network or telemetry client. ZIP entries use
AES-256 encryption with the user-held password. The CLI reads that password
from an environment variable and does not accept it as a command-line argument. A manifest records file
fingerprints, rule names, and hit counts without matched values.

Rules cannot detect every secret or identifier. Inspect the scrub policy and
send the archive password through a separate channel.

## Optional team pack

The CLI and safety features remain MIT-licensed. A $19 one-time license adds
four policy starters for AWS, Kubernetes, PostgreSQL, and HTTP traces, plus a
team policy review checklist.

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
