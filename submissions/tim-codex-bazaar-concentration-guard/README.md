# Bazaar Concentration Guard

Bazaar Concentration Guard is a no-dependency Node.js agent that reads the live Chef Universe Bazaar API and turns the snapshot into two reviewable outputs:

- a watchlist for Ingredient Tokens with notable signals or unusual market activity
- a guardrail table for concentration, liquidity, flow, curve, and data-quality risks

It is designed for the Chef Universe Bazaar Signal Agent challenge as a public report agent. It does not make buy calls, profit claims, or automated trade decisions.

## Data Source

The agent reads:

```text
https://www.chefuniverse.io/api/v1/agent_bazaar
```

It uses `global_asset`, `ingredients`, `top_signals`, `generated_at`, `block_number`, and each Ingredient Token's price, supply, liquidity impact, volume, buyer concentration, and short-horizon price-change fields.

## Run

From the repository root:

```bash
node submissions/tim-codex-bazaar-concentration-guard/concentration-guard.mjs \
  --out submissions/tim-codex-bazaar-concentration-guard/output \
  --limit 8
```

Use a saved snapshot instead of the live API:

```bash
node submissions/tim-codex-bazaar-concentration-guard/concentration-guard.mjs \
  --input snapshot.json \
  --out submissions/tim-codex-bazaar-concentration-guard/output
```

Run tests:

```bash
node --test submissions/tim-codex-bazaar-concentration-guard/concentration-guard.test.mjs
```

## Output

The CLI writes:

- `output/concentration-guard.md`
- `output/concentration-guard.json`

Both outputs include source metadata, block number, API snapshot timestamp, a source SHA-256 hash, and a report SHA-256 hash.

## Replay Trail

The committed sample output was generated from the repository root with:

```bash
node submissions/tim-codex-bazaar-concentration-guard/concentration-guard.mjs \
  --out submissions/tim-codex-bazaar-concentration-guard/output \
  --limit 8
```

The Markdown report repeats the exact command, output paths, source timestamp, block number, source hash, report hash, and report-hash scope so reviewers can replay the public artifact against a fresh or saved snapshot. The `report_sha256` value is computed from the JSON report object before the `report_sha256` field is attached; it is not a file digest of `concentration-guard.json`.

## Method

The watch score favors ranked API signals, activity heat, positive short-horizon momentum, low 10k CHEF slippage, and mid-curve tokens. The guard score flags concentrated buy flow, thin buyer sets, high volume versus market cap, fragile liquidity, sell pressure, late-curve status, and missing short-horizon price movement.

## Boundaries

Observed values are limited to the endpoint response, source timestamp, block number, and hashes. Scores, sorted tables, and flags are inferred from those fields.

Missing `price_change_12h_pct` or `price_change_24h_pct` means the endpoint snapshot did not expose the short-horizon field for that token; it is not interpreted as flat price movement or no momentum. A zero `liquidity_impact_10k_chef.slippage_pct` means the endpoint snapshot did not report measurable simulated impact; it is not a guarantee that a live trade can execute with zero slippage.

The agent does not check wallet balances, private order books, external exchange routes, live execution, future prices, profitability, or private Chef Universe state.

This is a monitoring aid for Chef Universe agents and builders, not financial advice.
