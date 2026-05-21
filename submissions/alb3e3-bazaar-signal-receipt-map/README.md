# Bazaar Signal Receipt Map

This submission adds a small no-dependency Node.js CLI that turns the live Chef Universe Bazaar API into a replayable reviewer artifact.

The output is intentionally conservative:

- records the endpoint URL and fetch timestamp
- normalizes the Bazaar snapshot and hashes it with SHA-256
- ranks a short watchlist from public top signals and market fields
- emits a Markdown report plus JSON receipt data
- states the unchecked assumptions and a pass/fix/no-pass reviewer rule
- avoids guaranteed-profit claims

## Run

```bash
node submissions/alb3e3-bazaar-signal-receipt-map/receipt-map.mjs
```

Custom output directory:

```bash
node submissions/alb3e3-bazaar-signal-receipt-map/receipt-map.mjs \
  --out-dir submissions/alb3e3-bazaar-signal-receipt-map/output
```

## Test

```bash
node --test submissions/alb3e3-bazaar-signal-receipt-map/receipt-map.test.mjs
```

## Submission Category

Best Public Agent Report / Other useful Chef Universe agent.

Wallet information is intentionally not committed. It should be provided only through the official submission form.
