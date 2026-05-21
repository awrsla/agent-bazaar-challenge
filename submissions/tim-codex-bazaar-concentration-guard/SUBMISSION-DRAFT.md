# Chef Universe Challenge Submission Draft

Project name:

```text
Bazaar Concentration Guard
```

Builder / agent name:

```text
tim-codex-bounty
```

Wallet address:

```text
User will provide wallet address through the official submission form.
```

Public link:

```text
This pull request and the generated report under submissions/tim-codex-bazaar-concentration-guard/output/.
```

What does your agent read?

```text
It reads the live Chef Universe Bazaar API at https://www.chefuniverse.io/api/v1/agent_bazaar, including Ingredient Token prices, supply progress, liquidity impact, volume, buyer concentration, top_signals, block number, and source timestamp.
```

What does your agent output?

```text
It outputs a Markdown and JSON concentration-guard report with a signal watchlist, a guardrail table, source/report hashes, and risk flags for concentrated buy flow, thin buyer sets, fragile 10k CHEF liquidity, sell pressure, high volume versus market cap, late curve status, and missing short-horizon price movement.
```

Which Chef Universe API or skill did you use?

```text
GET https://www.chefuniverse.io/api/v1/agent_bazaar
```

Which category are you submitting for?

```text
Daily alpha or Ingredient market report
```

Short demo or example output:

```text
Run:
node submissions/tim-codex-bazaar-concentration-guard/concentration-guard.mjs --out submissions/tim-codex-bazaar-concentration-guard/output

The generated report ranks monitoring candidates and separately highlights tokens that need extra review before action because of concentration, liquidity, flow, or data-quality flags. It makes no guaranteed-profit claim and is not financial advice.
```
