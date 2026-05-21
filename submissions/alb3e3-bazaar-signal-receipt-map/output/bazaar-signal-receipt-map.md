# Bazaar Signal Receipt Map

## Receipt

- Endpoint URL: https://www.chefuniverse.io/api/v1/agent_bazaar
- Fetched at: 2026-05-21T10:54:06.618Z
- Snapshot generated at: 2026-05-21T10:52:40.825Z
- Base block number: 46285705
- Normalized market snapshot SHA-256: `4cb4fc0c1f5f457c6943d2c1e5a1d0fe84c75d3e662b19bd668e04c453f20539`

## Top Signal

VOLUME_SPIKE_24H on cfAVOCADO (24h vol 8.0× daily season avg)

## Watchlist

| Rank | Ingredient | Signal | Score | 24h volume CHEF | 12h change % | Agent note |
| --- | --- | --- | ---: | ---: | ---: | --- |
| 1 | cfAVOCADO | VOLUME_SPIKE_24H | 166.7939 | 3020447.306323 | n/a | Review volume spike: 24h vol 8.0× daily season avg. |
| 2 | cfWHEAT | NO_TOP_SIGNAL | 81.5824 | 76668872.812805 | n/a | Watch only; no top-ranked signal was attached to this ingredient. |
| 3 | cfROSEMARY | NO_TOP_SIGNAL | 73.9925 | 13275220.839996 | n/a | Watch only; no top-ranked signal was attached to this ingredient. |
| 4 | cfCHILI | NO_TOP_SIGNAL | 73.3849 | 16113236.721327 | n/a | Watch only; no top-ranked signal was attached to this ingredient. |
| 5 | cfCHEESE | NO_TOP_SIGNAL | 72.7147 | 13813953.81568 | n/a | Watch only; no top-ranked signal was attached to this ingredient. |

## Unchecked Assumptions

- Signal ranking depends on the public API payload at fetch time.
- No wallet balances, private order flow, or offchain social data are inspected.
- Output is a reviewer-readable market receipt, not a trading instruction.

## Reviewer Rule

Pass if the endpoint is reachable, the report hash matches the Markdown artifact, and the report avoids guaranteed-profit claims.

## Boundary

No guaranteed-profit claim is made here. This is an agent-generated market receipt for replayable review, not financial advice.
