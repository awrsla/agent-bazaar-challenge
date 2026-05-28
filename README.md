# Build a Bazaar Signal Agent

Build an AI agent that reads The Bazaar and produces useful market signals.

Chef Universe exposes a live, agent-readable Bazaar API for $CHEF and 31 Ingredient Tokens on Base.

Use it to build signal bots, daily alpha reports, Uncharted Tycoons cargo planners, leaderboard watchers, or autonomous market commentary agents.

Give this task to your agent:

    Read https://raw.githubusercontent.com/awrsla/agent-bazaar-challenge/main/skill.md and build a Bazaar Signal Agent.

Full LLM context:

    https://raw.githubusercontent.com/awrsla/agent-bazaar-challenge/main/llms.txt

Pilot reward pool:

    100 USDC main prize + 1,000,000 CHEF builder reward pool

Keywords: Base agents, onchain market data, autonomous trading agents, agent-readable game economy, Ingredient Token signals, cargo planning, market reports, The Bazaar, Chef Universe, $CHEF.

## Challenge Period

Soft launch / outreach: May 22, 2026 - May 31, 2026.

Official submission period: June 1, 2026 - June 15, 2026.

Review: June 16, 2026 - June 18, 2026.

Winner announcement: June 19, 2026.

Dates, reward amounts, and final eligibility rules are subject to official Chef Universe confirmation before launch.

## API

GET https://www.chefuniverse.io/api/v1/agent_bazaar

Agent docs:

https://www.chefuniverse.io/for-agents

Skill pack:

    npx skills add Chef-Universe/skills

Agent task file:

    https://raw.githubusercontent.com/awrsla/agent-bazaar-challenge/main/skill.md

LLM context file:

    https://raw.githubusercontent.com/awrsla/agent-bazaar-challenge/main/llms.txt

## What The API Gives Your Agent

The endpoint returns a live Bazaar snapshot for:

- 1 CHEF market asset
- 31 Ingredient Tokens
- prices
- supply
- market state
- liquidity impact
- ranked signals

Signals can include:

- VOLUME_SPIKE_24H
- LOW_VALUATION
- MOMENTUM_12H
- SUPPLY_MILESTONE

## What To Build

Qualified builds can include:

1. Bazaar signal bot
2. Daily alpha or Ingredient market report agent
3. Uncharted Tycoons cargo planner
4. Leaderboard or portfolio watcher
5. Autonomous market commentary agent
6. Agent that uses Chef-Universe/skills
7. Agent action receipt: a tiny Bazaar trade or a clear no-trade decision with replayable reasoning
8. Tool that turns Bazaar data into useful public output

## Rewards

Reward pool:

    100 USDC main prize + 1,000,000 CHEF builder reward pool

| Category | Reward |
| --- | --- |
| Best Overall Agent | 100 USDC + 300,000 CHEF |
| Best Bazaar Signal Bot | 200,000 CHEF |
| Best Uncharted Cargo Planner | 150,000 CHEF |
| Best Public Agent Report | 150,000 CHEF |
| Best Use of Chef-Universe/skills | 100,000 CHEF |
| Qualified Participant Rewards | 10,000 CHEF each, first 10 valid submissions; Agent Action Receipts receive priority review |

CHEF rewards are builder rewards for useful Chef Universe agent outputs. Qualified participant rewards are capped and require review.

Agent Action Receipts are not volume rewards. They are proof-of-agency receipts. A valid receipt can show either:

- a small Bazaar trade transaction hash from an agent or clearly identified agent-operator wallet; or
- a clear no-trade decision based on Bazaar data.

In both cases, the receipt should include the source snapshot timestamp or block, what the agent observed, what it inferred, what it did not check, and why the action or refusal was justified. Trade size does not improve eligibility.

Final reward amounts require official approval before launch.

## Qualified Submission Requirements

A qualified submission must:

1. Use https://www.chefuniverse.io/api/v1/agent_bazaar or Chef-Universe/skills.
2. Produce a visible useful output.
3. Include a short explanation of what the agent reads and produces.
4. Include a public link, repo, cast, post, demo, or command output.
5. Include a wallet address for reward eligibility.
6. If claiming Agent Action Receipt priority, include a transaction hash or no-trade receipt with the Bazaar source snapshot and reasoning trail.
7. Avoid guaranteed-profit claims.
8. Avoid spam, duplicate reports, copied submissions, wash trading, or meaningless transaction churn.

See SUBMISSION.md for the submission format.

Submission form:

https://forms.gle/nwfPcyGeZTkxPPhf9

## Judging Criteria

| Criteria | Weight |
| --- | --- |
| Uses real Chef Universe data | 30% |
| Usefulness to humans or agents | 25% |
| Public clarity and shareability | 20% |
| Technical execution | 15% |
| Bazaar or Uncharted relevance | 10% |

## Quick Start

Fetch the Bazaar snapshot:

    curl https://www.chefuniverse.io/api/v1/agent_bazaar

Run the example scripts:

    node examples/fetch-agent-bazaar.js
    node examples/simple-signal-bot.js
    node examples/cargo-planner.js

## Repository Structure

    README.md
    SUBMISSION.md
    REWARDS.md
    examples/
      fetch-agent-bazaar.js
      simple-signal-bot.js
      cargo-planner.js
    templates/
      market-report-template.md

## Important Notes

- This challenge is for agent builders and agent operators.
- Rewards are distributed after review, not instantly.
- The Chef Universe team may reject low-effort, duplicated, or abusive submissions.
- This repository is a public starter kit and challenge hub.
- Official campaign launch posts and final reward details will be confirmed before the campaign starts.
