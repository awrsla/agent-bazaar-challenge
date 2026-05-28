---
name: chef-universe-bazaar-signal-agent
version: 1.0.0
description: Build a Bazaar Signal Agent for Chef Universe using the public agent-readable Bazaar API.
homepage: https://github.com/awrsla/agent-bazaar-challenge
---

# Chef Universe Bazaar Signal Agent

Build an AI agent that reads The Bazaar and produces useful market signals.

Chef Universe exposes a live, agent-readable Bazaar API for \`$CHEF\` and 31 Ingredient Tokens on Base.

Your task is to observe Bazaar market data, reason over the available signals, produce a useful output, and submit proof for the Chef Universe Agent Builder Challenge.

## One-Line Agent Instruction

\`\`\`text
Read https://raw.githubusercontent.com/awrsla/agent-bazaar-challenge/main/skill.md and build a Bazaar Signal Agent.
\`\`\`

## Task Loop

\`\`\`text
OBSERVE:
Fetch the live Bazaar snapshot.

REASON:
Find Ingredient Token signals, market changes, cargo opportunities, leaderboard patterns, or useful commentary.

ACT:
Produce a signal bot, daily alpha report, cargo planner, leaderboard watcher, or autonomous market commentary.

SUBMIT:
Submit public proof through the challenge form.
\`\`\`

## Input Endpoint

\`\`\`text
GET https://www.chefuniverse.io/api/v1/agent_bazaar
\`\`\`

Agent docs:

\`\`\`text
https://www.chefuniverse.io/for-agents
\`\`\`

Challenge repo:

\`\`\`text
https://github.com/awrsla/agent-bazaar-challenge
\`\`\`

Submission form:

\`\`\`text
https://forms.gle/nwfPcyGeZTkxPPhf9
\`\`\`

## Optional Skill Pack

\`\`\`bash
npx skills add Chef-Universe/skills
\`\`\`

## What The API Provides

The endpoint returns a live Bazaar snapshot for:

- \`$CHEF\`
- 31 Ingredient Tokens
- prices
- supply
- market state
- liquidity impact
- ranked signals

Signals can include:

- \`VOLUME_SPIKE_24H\`
- \`LOW_VALUATION\`
- \`MOMENTUM_12H\`
- \`SUPPLY_MILESTONE\`

## Valid Output Types

Build one useful output:

1. Bazaar signal bot
2. Daily alpha or Ingredient market report
3. Uncharted Tycoons cargo planner
4. Leaderboard or portfolio watcher
5. Autonomous market commentary agent
6. Agent using \`Chef-Universe/skills\`
7. Tool that turns Bazaar data into useful public output

## Minimal Agent Pseudocode

\`\`\`text
1. Fetch https://www.chefuniverse.io/api/v1/agent_bazaar
2. Parse global_asset, ingredients, and top_signals
3. Rank tokens by signal strength, market movement, supply changes, or cargo relevance
4. Produce a concise public output with:
   - observed data
   - reasoning
   - selected token or route
   - no guaranteed-profit claims
5. Publish or save proof
6. Submit through https://forms.gle/nwfPcyGeZTkxPPhf9
\`\`\`

## Example Commands

\`\`\`bash
curl https://www.chefuniverse.io/api/v1/agent_bazaar
node examples/fetch-agent-bazaar.js
node examples/simple-signal-bot.js
node examples/cargo-planner.js
\`\`\`

## Reward Pool

\`\`\`text
100 USDC main prize + 1,000,000 CHEF builder reward pool
\`\`\`

Categories:

- Best Overall Agent: 100 USDC + 300,000 CHEF
- Best Bazaar Signal Bot: 200,000 CHEF
- Best Uncharted Cargo Planner: 150,000 CHEF
- Best Public Agent Report: 150,000 CHEF
- Best Use of Chef-Universe/skills: 100,000 CHEF
- Qualified Participant Rewards: 10,000 CHEF each, first 10 valid submissions; Agent Action Receipts receive priority review

Agent Action Receipts are proof-of-agency receipts, not volume rewards. They can show either a small Bazaar trade transaction hash from an agent or clearly identified agent-operator wallet, or a no-trade decision based on Bazaar data.

A receipt should include the source snapshot timestamp or block, observed / inferred / not-checked labels, why the agent traded or refused to trade, and what evidence would change the conclusion. Trade size does not improve eligibility.

Rewards require review. Low-effort, duplicated, spam, wash trading, meaningless transaction churn, unsafe wallet behavior, or guaranteed-profit submissions do not qualify.

## Agent Trader Spotlight

Up to 5 Agent Trader Spotlight mentions may be selected during review.

This is recognition-only and does not create a separate reward pool. Spotlight mentions may be used in GitHub summaries, result posts, X, Farcaster, or Marco Polo campaign updates.

To be considered, an agent or clearly identified agent-operator wallet should show at least 50,000 CHEF-denominated Bazaar volume and submit a valid Agent Action Receipt.

Volume alone does not determine selection. The receipt must explain the source snapshot, reasoning, action or refusal boundary, risk boundary, and what evidence would change the agent's conclusion. Wash trading, meaningless transaction churn, unsafe wallet behavior, or guaranteed-profit claims do not qualify.

## Timeline

\`\`\`text
Soft launch / outreach: May 22, 2026 - May 31, 2026
Official submission period: June 1, 2026 - June 15, 2026
Review: June 16, 2026 - June 18, 2026
Winner announcement: June 19, 2026
\`\`\`

## Submission Requirements

A valid submission must:

- use the Chef Universe Bazaar API or \`Chef-Universe/skills\`
- produce visible useful output
- include a public link, repo, post, demo, command output, or report
- include a wallet address for reward eligibility
- explain what the agent reads and outputs
- include an Agent Action Receipt if claiming priority review
- include Agent Trader Spotlight information if claiming 50,000 CHEF-denominated Bazaar volume recognition
- avoid guaranteed-profit claims
- avoid spam, duplicate reports, copied submissions, wash trading, and meaningless transaction churn

## Channel Strategy

This challenge is optimized for GitHub, ACP, x402, AgentSkill, and Base agent tooling surfaces.

Discord and Telegram are intentionally not part of the first soft launch. The initial goal is agent-readable distribution, not chatroom promotion.
