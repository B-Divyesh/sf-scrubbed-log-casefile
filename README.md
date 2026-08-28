# Scrubbed Log Casefile

`casefile` turns logs, traces, and configuration into one password-encrypted
ZIP you can hand to a vendor or teammate. It runs locally, replaces repeated
values with stable tokens, and adds a manifest of rule hits without recording
the sensitive values.

It is for engineers who need a reproducible escalation artifact—not log
hosting, telemetry, or a claim of complete PII detection.

## Install

Build the single binary with stable Rust:

```sh
cargo install --path .
casefile --help
```

## Usage

Scrub a directory with the built-in policy. The password is read from an
environment variable so it does not enter shell history or process arguments:

```sh
export CASEFILE_PASSWORD='use-a-long-unique-passphrase'
casefile pack ./incident \
  --output vendor.casefile.zip \
  --password-env CASEFILE_PASSWORD
```

Inspect the safe summary from automation:

```sh
casefile pack app.log trace.json \
  --output issue-1842.zip \
  --password-env CASEFILE_PASSWORD \
  --json
```

Add project-owned rules in JSON. A named `value` capture keeps surrounding
context while replacing only the captured value:

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
casefile pack ./incident --policy casefile-policy.json \
  --output vendor.zip --password-env CASEFILE_PASSWORD
```

Use `--no-default-rules` only after reviewing your custom policy. Existing
outputs are never overwritten unless `--force` is supplied. Symlinks and
binary files are skipped and recorded in the manifest; incomplete temporary
archives are removed automatically.

Exit codes are `0` success, `2` invalid input/configuration, and `1` runtime
failure. `--json` writes a machine-readable success or error object to stdout.

## Archive contents

- scrubbed input files with the original relative layout
- `casefile-manifest.json` with file hashes, byte counts, skipped-file reasons,
  rule names and hit counts—never matched values

Stable placeholders such as `<EMAIL:8F10B4A7>` use a random per-casefile salt.
The same value maps to the same placeholder inside one archive, while separate
archives cannot be correlated.

## Develop and verify

```sh
cargo test
cargo clippy --all-targets -- -D warnings
npm ci
npm test
npm run build        # static site -> dist/site
npm run build:site   # equivalent explicit site build
cargo package --allow-dirty
npm pack --dry-run
```

Run the landing/docs site with `npm run dev`. It includes a browser-only live
redaction preview; entered text never leaves the page.

## Privacy and security notes

No telemetry or network calls exist in the CLI. ZIP entries use WinZip AES-256
encryption, and the password is user-held. Rule-based scrubbing cannot prove
that every secret or identifier was found: review the output policy and share
the password through a separate channel. See the site [privacy](site/privacy/index.html)
and [terms](site/terms/index.html) pages for the optional license unlock.

## Deploy

The factory deploys `dist/site`; this repository does not modify DNS, billing,
or infrastructure. The public site is intended for
<https://scrubbed-log-casefile.sociobot.in>.

## License

MIT — see [LICENSE](LICENSE).
