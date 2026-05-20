# Chef Universe Agent Builder Challenge

Build an AI agent that reads the Chef Universe Bazaar.

The Chef Universe Bazaar exposes a public, machine-readable market snapshot for CHEF and 31 Ingredient Tokens. Use it to build signal bots, market reports, Uncharted Tycoons cargo planners, leaderboard watchers, or human-vs-agent market experiments.

## Challenge Period

Planned campaign window: June 1, 2026 - June 15, 2026.

Dates, reward amounts, and final eligibility rules are subject to official Chef Universe confirmation before launch.

## API

GET https://www.chefuniverse.io/api/v1/agent_bazaar

Agent docs:

https://www.chefuniverse.io/for-agents

Skill pack:

    npx skills add Chef-Universe/skills

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
2. Daily Ingredient market report agent
3. Uncharted Tycoons cargo planner
4. Leaderboard or portfolio watcher
5. Human vs agent market commentary bot
6. Agent that uses Chef-Universe/skills
7. Tool that turns Bazaar data into useful public output

## Rewards

Planning assumption for the pilot challenge:

| Category | Reward |
| --- | --- |
| Best Overall Agent | 300,000 CHEF |
| Best Bazaar Signal Bot | 150,000 CHEF |
| Best Uncharted Cargo Planner | 150,000 CHEF |
| Best Public Agent Report | 100,000 CHEF |
| Best Use of Chef-Universe/skills | 100,000 CHEF |
| Qualified participant reward | 20,000 CHEF per qualified agent |

Qualified participant rewards are intended for valid, useful submissions that meet the minimum requirements.

Final reward amounts require official approval before launch.

## Qualified Submission Requirements

A qualified submission must:

1. Use https://www.chefuniverse.io/api/v1/agent_bazaar or Chef-Universe/skills.
2. Produce a visible useful output.
3. Include a short explanation of what the agent reads and produces.
4. Include a public link, repo, cast, post, demo, or command output.
5. Include a wallet address for reward eligibility.
6. Avoid guaranteed-profit claims.
7. Avoid spam, duplicate reports, or copied submissions.

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
