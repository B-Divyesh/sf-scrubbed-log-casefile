# Demo sandbox

## Browser

Open <https://scrubbed-log-casefile.sociobot.in/demo/> or
<https://scrubbed-log-casefile.sociobot.in/?demo=1>, or select **Try it with
sample data** on the first screen. The query shortcut redirects to the demo
route, which starts with incident `INC-1842` already scrubbed. The ready phone
view shows a credential and repeated email replaced before the full editor.
**Reset demo** restores the sample and **Start for real** opens the CLI install
steps.

The browser demo is in-memory. Repeated values match within one demo page. A
new page or reset uses different replacements. It does not use localStorage,
sessionStorage, IndexedDB, or the real license namespace. Reloading or leaving
the route drops all edits.

## CLI

Run:

```sh
casefile demo
```

The command copies `examples/incident/app.log` and `config.json` into a unique
temporary directory. It runs the real pack path, keeps the finished demo
directory for inspection, and prints the sample path, archive path, and demo
password. Remove that printed directory to reset. Each run starts clean.

Review the created casefile with:

```sh
casefile inspect /path/to/sample.casefile.zip \
  --password-env CASEFILE_PASSWORD \
  --extract
```

Extraction creates another unique temporary directory. It never reads or
writes a browser or real-user storage namespace.
