# Chef Universe Bazaar Concentration Guard

Generated: 2026-05-21T23:02:48.232Z

Source: https://www.chefuniverse.io/api/v1/agent_bazaar

Snapshot: block 46307595, source generated 2026-05-21T23:02:18.243Z, cache age 0 seconds

Source SHA-256: `bd57aa404dada516adcb73eea72892e5950b1a1ed2d49944efe5f7381cd01d5f`

Report SHA-256: `e67c8f487ea65457c32a0b35acb03f6cc8a16100eb4058dadc1c29a5b0132f0b`

## Summary

- Ingredients scored: 31
- Top signals returned: 1
- Concentrated buy-flow flags: 12
- Liquidity-fragile flags: 0
- Missing short-horizon price-change fields: 28

## Top Signals

- cfAVOCADO: VOLUME_SPIKE_24H (24h vol 8.2x daily season avg)

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
| cfCHILI | 69.3 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfSESAME | 63.6 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfLAMB | 62.3 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfSALT | 61.4 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfGOCHUJANG | 59.2 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, high_volume_vs_cap, missing_short_horizon_price_change |
| cfFRUITMIX | 59 | 100 | 1 | 0 | concentrated_buy_flow, thin_buyer_set, missing_short_horizon_price_change, quiet_tape |
| cfSUGAR | 57.9 | 99.9 | 2 | 0 | concentrated_buy_flow, thin_buyer_set, missing_short_horizon_price_change |

## Method

The guard reads the Chef Universe Bazaar API, scores every Ingredient Token, and emits two public outputs:

- a watchlist for signals and unusual activity
- a guardrail table for concentration and liquidity risks

The watch score favors ranked API signals, activity heat, positive short-horizon momentum, low 10k CHEF slippage, and mid-curve tokens. The guard score flags concentrated buy flow, thin buyer sets, high volume versus market cap, fragile liquidity, sell pressure, late-curve status, and missing short-horizon price movement.

This report is not financial advice, does not claim guaranteed profit, and should be treated as a monitoring aid for Chef Universe agents and builders.
