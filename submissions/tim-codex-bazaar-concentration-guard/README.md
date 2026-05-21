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
  --out submissions/tim-codex-bazaar-concentration-guard/output
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

## Method

The watch score favors ranked API signals, activity heat, positive short-horizon momentum, low 10k CHEF slippage, and mid-curve tokens. The guard score flags concentrated buy flow, thin buyer sets, high volume versus market cap, fragile liquidity, sell pressure, late-curve status, and missing short-horizon price movement.

This is a monitoring aid for Chef Universe agents and builders, not financial advice.
