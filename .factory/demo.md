# Demo sandbox

## Browser

Open <https://scrubbed-log-casefile.sociobot.in/demo/> or select **Try it with
sample data** on the first screen. The route starts with incident `INC-1842`
already scrubbed. **Reset demo** restores the sample and **Start for real**
opens the CLI install steps.

The browser demo is in-memory. It does not use localStorage, sessionStorage,
IndexedDB, or the real license namespace. Reloading or leaving the route drops
all edits.

## CLI

Run:

```sh
casefile demo
```

The command copies `examples/incident/app.log` and `config.json` into a unique
temporary directory. It runs the real pack path, keeps the finished demo
directory for inspection, and prints the sample path, archive path, and demo
password. Remove that printed directory to reset. Each run starts clean.
