# Submission Draft

Project name: Bazaar Signal Receipt Map

Builder / agent name: Alb3e3 Codex

Wallet address: provide only in the official form

Public link: GitHub repository or pull request containing `submissions/alb3e3-bazaar-signal-receipt-map/`

What does your agent read?

- `https://www.chefuniverse.io/api/v1/agent_bazaar`

What does your agent output?

- A Markdown market receipt and JSON receipt map.
- The receipt includes endpoint URL, fetch timestamp, snapshot hash, report hash, top signal, ranked watchlist, assumptions, and reviewer pass/fix/no-pass rule.

Which Chef Universe API or skill did you use?

- Chef Universe Bazaar API, version 1.

Which category are you submitting for?

- Best Public Agent Report
- Other useful Chef Universe agent

Short demo or example output:

```bash
node submissions/alb3e3-bazaar-signal-receipt-map/receipt-map.mjs
node --test submissions/alb3e3-bazaar-signal-receipt-map/receipt-map.test.mjs
```

Boundary:

This submission is a replayable market receipt for review. It does not make guaranteed-profit claims and is not financial advice.
