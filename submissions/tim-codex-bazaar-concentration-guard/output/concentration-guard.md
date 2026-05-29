# Chef Universe Bazaar Concentration Guard

Generated: 2026-05-22T00:47:07.932Z

Source: https://www.chefuniverse.io/api/v1/agent_bazaar

Snapshot: block 46310718, source generated 2026-05-22T00:46:29.673Z, cache age 0 seconds

Source SHA-256: `865c6f9b7ed819efabd967c4ac5c47449525be74aa4e131d56ee2ade189bada4`

Report SHA-256: `878b9440506c44c71df00f0166dd23530ca8f7327fcbb4dae8021dd7a8bb5e2d`

## Replay Trail

From the repository root:

~~~bash
node submissions/tim-codex-bazaar-concentration-guard/concentration-guard.mjs --out submissions/tim-codex-bazaar-concentration-guard/output --limit 8
~~~

- Output Markdown: `submissions/tim-codex-bazaar-concentration-guard/output/concentration-guard.md`
- Output JSON: `submissions/tim-codex-bazaar-concentration-guard/output/concentration-guard.json`
- Source timestamp: 2026-05-22T00:46:29.673Z
- Block number: 46310718
- Source hash: `865c6f9b7ed819efabd967c4ac5c47449525be74aa4e131d56ee2ade189bada4`
- Report hash: `878b9440506c44c71df00f0166dd23530ca8f7327fcbb4dae8021dd7a8bb5e2d`
- Report hash scope: JSON report object before report_sha256 is attached; it is not a file digest of concentration-guard.json.

## Summary

- Ingredients scored: 31
- Top signals returned: 1
- Concentrated buy-flow flags: 12
- Liquidity-fragile flags: 0
- Missing short-horizon price-change fields: 28

## Top Signals

- cfAVOCADO: VOLUME_SPIKE_24H (24h vol 5.9x daily season avg)

## Watchlist

These are monitoring candidates, not buy recommendations.

| Ticker | Watch | Guard | 24h Volume CHEF | Vol/Cap | Flags |
| --- | --- | --- | --- | --- | --- |
| cfAVOCADO | 84.1 | 6 | 3,020,447 | 0.31 | top_signal_watch |
| cfBEEF | 65.4 | 11.4 | 5,873,562 | 0.335 | missing_short_horizon_price_change |
| cfROSEMARY | 65 | 13.7 | 13,275,221 | 0.574 | high_volume_vs_cap, missing_short_horizon_price_change |
| cfBUTTER | 63.9 | 13.2 | 2,970,443 | 0.523 | high_volume_vs_cap, missing_short_horizon_price_change |
| cfMILK | 63.8 | 13.8 | 5,608,496 | 0.579 | high_volume_vs_cap, missing_short_horizon_price_change |
| cfTOMATO | 63.7 | 14.4 | 6,917,955 | 0.639 | high_volume_vs_cap, missing_short_horizon_price_change |
| cfCHICKEN | 63.5 | 14.9 | 6,667,154 | 0.686 | high_volume_vs_cap, missing_short_horizon_price_change |
| cfEGG | 63.5 | 14.9 | 6,577,995 | 0.693 | high_volume_vs_cap, missing_short_horizon_price_change |

## Guardrails

These entries need extra human or agent review before any action because the snapshot shows concentration, liquidity, data-quality, or flow-risk flags.

| Ticker | Guard | Top Buyer % | Buy Users | 10k Slippage % | Flags |
| --- | --- | --- | --- | --- | --- |
| cfWHEAT | 79 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfCHILI | 69.6 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfFRUITMIX | 63.7 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, missing_short_horizon_price_change |
| cfSESAME | 63.6 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfLAMB | 62.4 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfSALT | 61.5 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfOLIVE | 59.3 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfGOCHUJANG | 59.3 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |

## Method

The guard reads the Chef Universe Bazaar API, scores every Ingredient Token, and emits two public outputs:

- a watchlist for signals and unusual activity
- a guardrail table for concentration and liquidity risks

The watch score favors ranked API signals, activity heat, positive short-horizon momentum, low 10k CHEF slippage, and mid-curve tokens. The guard score flags concentrated buy flow, thin buyer sets, high volume versus market cap, fragile liquidity, sell pressure, late-curve status, and missing short-horizon price movement.

## Observed / Inferred / Not Checked

Observed:

- Endpoint response fields: global asset metadata, Ingredient Token prices, supply progress, liquidity impact, volume, buyer concentration, source timestamp, block number, and top signals.
- Source SHA-256 and report SHA-256 values in this report.

Inferred:

- watch_score, guard_score, summary counts, sorted tables, and flags derived from the endpoint fields.
- Concentration, thin-buyer, fragile-liquidity, high-volume-versus-cap, sell-pressure, late-curve, and data-quality risk labels.

Not checked:

- Wallet balances, private order books, live trade execution, external exchange routes, future prices, profitability, or any private Chef Universe state.
- Whether another bot or human will act on the same signal after this snapshot.

Field notes:

- Missing short-horizon price changes: When price_change_12h_pct or price_change_24h_pct is null, the endpoint snapshot did not expose that short-horizon field for the token. This should not be interpreted as flat price movement or no momentum.
- 10k CHEF slippage: The 10k CHEF liquidity impact is the endpoint-provided simulated impact. A zero slippage value means the snapshot did not report measurable simulated impact, not that a live trade is guaranteed to execute with zero slippage. partial_fill=true or positive slippage marks the field as fragile.

This report is not financial advice, does not claim guaranteed profit, and should be treated as a monitoring aid for Chef Universe agents and builders.
