#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const DEFAULT_ENDPOINT = 'https://www.chefuniverse.io/api/v1/agent_bazaar';
const DEFAULT_LIMIT = 8;
const SUBMISSION_DIR = 'submissions/tim-codex-bazaar-concentration-guard';

function asNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function round(value, digits = 2) {
  if (!Number.isFinite(value)) return null;
  const scale = 10 ** digits;
  const rounded = Math.round(value * scale) / scale;
  return Object.is(rounded, -0) ? 0 : rounded;
}

function hashText(text) {
  return createHash('sha256').update(text).digest('hex');
}

function replayCommand(limit = DEFAULT_LIMIT) {
  return `node ${SUBMISSION_DIR}/concentration-guard.mjs --out ${SUBMISSION_DIR}/output --limit ${limit}`;
}

function asciiText(value) {
  return String(value ?? '')
    .replace(/\u00d7/g, 'x')
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, '?');
}

function signalBoost(kind) {
  switch (kind) {
    case 'VOLUME_SPIKE_24H':
      return 22;
    case 'MOMENTUM_12H':
      return 18;
    case 'LOW_VALUATION':
      return 14;
    case 'SUPPLY_MILESTONE':
      return 10;
    default:
      return 8;
  }
}

function makeTopSignalMap(topSignals = []) {
  const map = new Map();

  for (const signal of topSignals) {
    const ticker = String(signal.ticker ?? '').toUpperCase();
    if (!ticker) continue;

    const existing = map.get(ticker) ?? [];
    existing.push({
      kind: asciiText(signal.kind ?? 'UNKNOWN'),
      score: asNumber(signal.score, 0),
      note: asciiText(signal.note ?? ''),
    });
    map.set(ticker, existing);
  }

  return map;
}

function getSignalScore(ingredient, topSignalMap) {
  const ticker = String(ingredient.ticker ?? '').toUpperCase();
  const topSignals = topSignalMap.get(ticker) ?? [];
  const localSignals = Array.isArray(ingredient.signals) ? ingredient.signals : [];

  const topScore = topSignals.reduce((sum, signal) => {
    return sum + signalBoost(signal.kind) * Math.max(1, signal.score || 1);
  }, 0);

  const localScore = localSignals.reduce((sum, signal) => {
    return sum + signalBoost(String(signal.kind ?? signal.type ?? 'UNKNOWN')) * 0.6;
  }, 0);

  return clamp(topScore + localScore, 0, 100);
}

function scoreIngredient(ingredient, topSignalMap = new Map()) {
  const ticker = String(ingredient.ticker ?? 'UNKNOWN');
  const marketCap = asNumber(ingredient.market_cap_chef, 0);
  const volume24h = asNumber(ingredient.volume_24h_chef, 0);
  const buyVolume = asNumber(ingredient.buy_volume_24h_chef, 0);
  const sellVolume = asNumber(ingredient.sell_volume_24h_chef, 0);
  const buyUsers = asNumber(ingredient.buy_user_count_24h, 0);
  const concentration = asNumber(ingredient.top_buyer_concentration_24h_pct, 0);
  const progress = asNumber(ingredient.progress, 0);
  const momentum12h = asNumber(ingredient.price_change_12h_pct, 0);
  const momentum24h = asNumber(ingredient.price_change_24h_pct, 0);
  const liquidityImpact = ingredient.liquidity_impact_10k_chef ?? {};
  const slippage = asNumber(liquidityImpact.slippage_pct, 0);
  const partialFill = Boolean(liquidityImpact.partial_fill);
  const volumeToMarketCap = marketCap > 0 ? volume24h / marketCap : 0;
  const sellToBuy = buyVolume > 0 ? sellVolume / buyVolume : sellVolume > 0 ? 99 : 0;
  const hasPriceMomentum = ingredient.price_change_12h_pct !== null || ingredient.price_change_24h_pct !== null;
  const source = String(ingredient.volume_source ?? 'unknown');
  const signalScore = getSignalScore(ingredient, topSignalMap);

  let concentrationRisk = 0;
  if (concentration >= 90 && buyVolume > 0) concentrationRisk += 30;
  else if (concentration >= 70 && buyVolume > 0) concentrationRisk += 18;
  if (buyUsers > 0 && buyUsers <= 2 && buyVolume > 0) concentrationRisk += 16;

  const liquidityRisk = clamp(slippage * 12 + (partialFill ? 25 : 0), 0, 35);
  const flowRisk = clamp(volumeToMarketCap * 10 + Math.max(0, sellToBuy - 1) * 8, 0, 25);
  const curveRisk = progress >= 0.75 ? 10 : progress <= 0.02 ? 5 : 0;
  const dataRisk = hasPriceMomentum ? 0 : 8;
  const guardScore = clamp(concentrationRisk + liquidityRisk + flowRisk + curveRisk + dataRisk);

  const activityHeat = clamp(Math.log10(volume24h + 1) * 9 + volumeToMarketCap * 8, 0, 45);
  const momentumScore = clamp(Math.max(momentum12h, momentum24h, 0) * 2, 0, 18);
  const liquidityScore = clamp(16 - slippage * 5 - (partialFill ? 12 : 0), 0, 16);
  const curveScore = clamp((1 - Math.abs(progress - 0.35)) * 8, 0, 8);
  const watchScore = clamp(signalScore * 0.5 + activityHeat + momentumScore + liquidityScore + curveScore - guardScore * 0.25);

  const flags = [];
  if (signalScore >= 18) flags.push('top_signal_watch');
  if (concentration >= 85 && buyVolume > 0) flags.push('concentrated_buy_flow');
  if (buyUsers > 0 && buyUsers <= 2 && buyVolume > 0) flags.push('thin_buyer_set');
  if (slippage > 1 || partialFill) flags.push('liquidity_fragile');
  if (volumeToMarketCap >= 0.5) flags.push('high_volume_vs_cap');
  if (sellToBuy >= 2) flags.push('sell_pressure');
  if (!hasPriceMomentum) flags.push('missing_short_horizon_price_change');
  if (progress >= 0.75) flags.push('late_curve');
  if (volume24h <= 0) flags.push('quiet_tape');

  return {
    ticker,
    grade: ingredient.grade ?? null,
    current_price_chef: round(asNumber(ingredient.current_price_chef, 0), 8),
    progress_pct: round(progress * 100, 2),
    market_cap_chef: round(marketCap, 2),
    volume_24h_chef: round(volume24h, 2),
    volume_to_market_cap: round(volumeToMarketCap, 4),
    buy_user_count_24h: buyUsers,
    buy_volume_24h_chef: round(buyVolume, 2),
    sell_volume_24h_chef: round(sellVolume, 2),
    sell_to_buy_volume: round(sellToBuy, 4),
    top_buyer_concentration_24h_pct: round(concentration, 2),
    price_change_12h_pct: ingredient.price_change_12h_pct === null ? null : round(momentum12h, 2),
    price_change_24h_pct: ingredient.price_change_24h_pct === null ? null : round(momentum24h, 2),
    liquidity_impact_10k_chef: {
      slippage_pct: round(slippage, 4),
      avg_price_chef: round(asNumber(liquidityImpact.avg_price_chef, 0), 8),
      partial_fill: partialFill,
    },
    volume_source: source,
    signal_score: round(signalScore, 2),
    watch_score: round(watchScore, 2),
    guard_score: round(guardScore, 2),
    flags,
  };
}

function summarizeMarket(bazaar, scored) {
  const ingredients = Array.isArray(bazaar.ingredients) ? bazaar.ingredients : [];
  const withConcentration = scored.filter((item) => item.flags.includes('concentrated_buy_flow')).length;
  const withSignal = scored.filter((item) => item.flags.includes('top_signal_watch')).length;
  const fragile = scored.filter((item) => item.flags.includes('liquidity_fragile')).length;
  const noMomentum = scored.filter((item) => item.flags.includes('missing_short_horizon_price_change')).length;
  const volumeBySource = {};

  for (const item of scored) {
    volumeBySource[item.volume_source] = (volumeBySource[item.volume_source] ?? 0) + 1;
  }

  return {
    ingredient_count: ingredients.length,
    top_signal_count: Array.isArray(bazaar.top_signals) ? bazaar.top_signals.length : 0,
    concentrated_buy_flow_count: withConcentration,
    top_signal_watch_count: withSignal,
    liquidity_fragile_count: fragile,
    missing_price_momentum_count: noMomentum,
    volume_source_counts: volumeBySource,
  };
}

function buildReport(rawJson, options = {}) {
  const bazaar = typeof rawJson === 'string' ? JSON.parse(rawJson) : rawJson;
  const sourceText = typeof rawJson === 'string' ? rawJson : JSON.stringify(rawJson);
  const sourceSha256 = hashText(sourceText);
  const topSignalMap = makeTopSignalMap(bazaar.top_signals);
  const scored = (bazaar.ingredients ?? []).map((ingredient) => scoreIngredient(ingredient, topSignalMap));
  const limit = options.limit ?? DEFAULT_LIMIT;

  const watchlist = [...scored]
    .sort((a, b) => b.watch_score - a.watch_score || a.guard_score - b.guard_score || a.ticker.localeCompare(b.ticker))
    .slice(0, limit);

  const guardrails = [...scored]
    .sort((a, b) => b.guard_score - a.guard_score || b.watch_score - a.watch_score || a.ticker.localeCompare(b.ticker))
    .slice(0, limit);

  const report = {
    project: 'Bazaar Concentration Guard',
    generated_at: new Date().toISOString(),
    endpoint: options.endpoint ?? DEFAULT_ENDPOINT,
    source_generated_at: bazaar.generated_at ?? null,
    block_number: bazaar.block_number ?? null,
    cache_age_sec: bazaar.cache_age_sec ?? null,
    source_sha256: sourceSha256,
    replay: {
      from: 'repository root',
      command: replayCommand(limit),
      output_files: [
        `${SUBMISSION_DIR}/output/concentration-guard.md`,
        `${SUBMISSION_DIR}/output/concentration-guard.json`,
      ],
      source_metadata: {
        endpoint: options.endpoint ?? DEFAULT_ENDPOINT,
        source_generated_at: bazaar.generated_at ?? null,
        block_number: bazaar.block_number ?? null,
        cache_age_sec: bazaar.cache_age_sec ?? null,
        source_sha256: sourceSha256,
      },
      report_sha256_scope: 'JSON report object before report_sha256 is attached; it is not a file digest of concentration-guard.json.',
    },
    methodology: {
      watch_score: 'Ranks signals, activity heat, positive momentum, liquidity, and curve position, then subtracts part of guard risk.',
      guard_score: 'Flags concentrated buy flow, fragile 10k CHEF liquidity, high volume versus market cap, sell pressure, late-curve status, and missing short-horizon price movement.',
      claim_limit: 'This is a monitoring report, not financial advice and not a guaranteed-profit system.',
    },
    interpretation: {
      observed: [
        'Endpoint response fields: global asset metadata, Ingredient Token prices, supply progress, liquidity impact, volume, buyer concentration, source timestamp, block number, and top signals.',
        'Source SHA-256 and report SHA-256 values in this report.',
      ],
      inferred: [
        'watch_score, guard_score, summary counts, sorted tables, and flags derived from the endpoint fields.',
        'Concentration, thin-buyer, fragile-liquidity, high-volume-versus-cap, sell-pressure, late-curve, and data-quality risk labels.',
      ],
      not_checked: [
        'Wallet balances, private order books, live trade execution, external exchange routes, future prices, profitability, or any private Chef Universe state.',
        'Whether another bot or human will act on the same signal after this snapshot.',
      ],
      missing_short_horizon_price_change: 'When price_change_12h_pct or price_change_24h_pct is null, the endpoint snapshot did not expose that short-horizon field for the token. This should not be interpreted as flat price movement or no momentum.',
      liquidity_impact_10k_chef: 'The 10k CHEF liquidity impact is the endpoint-provided simulated impact. A zero slippage value means the snapshot did not report measurable simulated impact, not that a live trade is guaranteed to execute with zero slippage. partial_fill=true or positive slippage marks the field as fragile.',
    },
    summary: summarizeMarket(bazaar, scored),
    top_signals: (bazaar.top_signals ?? []).map((signal) => ({
      ticker: asciiText(signal.ticker ?? ''),
      kind: asciiText(signal.kind ?? 'UNKNOWN'),
      score: signal.score ?? null,
      note: asciiText(signal.note ?? ''),
    })),
    watchlist,
    guardrails,
  };

  report.report_sha256 = hashText(JSON.stringify(report));
  return report;
}

function formatNumber(value, digits = 2) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'n/a';
  return Number(value).toLocaleString('en-US', {
    maximumFractionDigits: digits,
    minimumFractionDigits: 0,
  });
}

function markdownTable(items, columns) {
  const header = `| ${columns.map((column) => column.label).join(' | ')} |`;
  const divider = `| ${columns.map(() => '---').join(' | ')} |`;
  const rows = items.map((item) => {
    return `| ${columns.map((column) => column.render(item)).join(' | ')} |`;
  });
  return [header, divider, ...rows].join('\n');
}

function markdownBullets(items) {
  return items.map((item) => `- ${item}`).join('\n');
}

function renderMarkdown(report) {
  const topSignalLines = report.top_signals.length
    ? report.top_signals.map((signal) => {
        return `- ${signal.ticker}: ${signal.kind} (${signal.note ?? 'no note'})`;
      })
    : ['- No top signals were returned in this snapshot.'];

  const watchColumns = [
    { label: 'Ticker', render: (item) => item.ticker },
    { label: 'Watch', render: (item) => formatNumber(item.watch_score, 1) },
    { label: 'Guard', render: (item) => formatNumber(item.guard_score, 1) },
    { label: '24h Volume CHEF', render: (item) => formatNumber(item.volume_24h_chef, 0) },
    { label: 'Vol/Cap', render: (item) => formatNumber(item.volume_to_market_cap, 3) },
    { label: 'Flags', render: (item) => item.flags.slice(0, 3).join(', ') || 'none' },
  ];

  const guardColumns = [
    { label: 'Ticker', render: (item) => item.ticker },
    { label: 'Guard', render: (item) => formatNumber(item.guard_score, 1) },
    { label: 'Top Buyer %', render: (item) => formatNumber(item.top_buyer_concentration_24h_pct, 1) },
    { label: 'Buy Users', render: (item) => formatNumber(item.buy_user_count_24h, 0) },
    { label: '10k Slippage %', render: (item) => formatNumber(item.liquidity_impact_10k_chef.slippage_pct, 2) },
    { label: 'Flags', render: (item) => item.flags.slice(0, 4).join(', ') || 'none' },
  ];
  const interpretation = report.interpretation ?? {};
  const replay = report.replay ?? {};
  const outputFiles = replay.output_files ?? [];

  return `# Chef Universe Bazaar Concentration Guard

Generated: ${report.generated_at}

Source: ${report.endpoint}

Snapshot: block ${report.block_number ?? 'n/a'}, source generated ${report.source_generated_at ?? 'n/a'}, cache age ${report.cache_age_sec ?? 'n/a'} seconds

Source SHA-256: \`${report.source_sha256}\`

Report SHA-256: \`${report.report_sha256}\`

## Replay Trail

From the repository root:

~~~bash
${replay.command ?? replayCommand()}
~~~

- Output Markdown: \`${outputFiles[0] ?? 'n/a'}\`
- Output JSON: \`${outputFiles[1] ?? 'n/a'}\`
- Source timestamp: ${report.source_generated_at ?? 'n/a'}
- Block number: ${report.block_number ?? 'n/a'}
- Source hash: \`${report.source_sha256}\`
- Report hash: \`${report.report_sha256}\`
- Report hash scope: ${replay.report_sha256_scope ?? 'n/a'}

## Summary

- Ingredients scored: ${report.summary.ingredient_count}
- Top signals returned: ${report.summary.top_signal_count}
- Concentrated buy-flow flags: ${report.summary.concentrated_buy_flow_count}
- Liquidity-fragile flags: ${report.summary.liquidity_fragile_count}
- Missing short-horizon price-change fields: ${report.summary.missing_price_momentum_count}

## Top Signals

${topSignalLines.join('\n')}

## Watchlist

These are monitoring candidates, not buy recommendations.

${markdownTable(report.watchlist, watchColumns)}

## Guardrails

These entries need extra human or agent review before any action because the snapshot shows concentration, liquidity, data-quality, or flow-risk flags.

${markdownTable(report.guardrails, guardColumns)}

## Method

The guard reads the Chef Universe Bazaar API, scores every Ingredient Token, and emits two public outputs:

- a watchlist for signals and unusual activity
- a guardrail table for concentration and liquidity risks

The watch score favors ranked API signals, activity heat, positive short-horizon momentum, low 10k CHEF slippage, and mid-curve tokens. The guard score flags concentrated buy flow, thin buyer sets, high volume versus market cap, fragile liquidity, sell pressure, late-curve status, and missing short-horizon price movement.

## Observed / Inferred / Not Checked

Observed:

${markdownBullets(interpretation.observed ?? [])}

Inferred:

${markdownBullets(interpretation.inferred ?? [])}

Not checked:

${markdownBullets(interpretation.not_checked ?? [])}

Field notes:

- Missing short-horizon price changes: ${interpretation.missing_short_horizon_price_change ?? 'n/a'}
- 10k CHEF slippage: ${interpretation.liquidity_impact_10k_chef ?? 'n/a'}

This report is not financial advice, does not claim guaranteed profit, and should be treated as a monitoring aid for Chef Universe agents and builders.
`;
}

async function fetchSnapshot(endpoint) {
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function parseArgs(argv) {
  const args = {
    endpoint: DEFAULT_ENDPOINT,
    outDir: null,
    input: null,
    limit: DEFAULT_LIMIT,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--endpoint') args.endpoint = argv[++index];
    else if (arg === '--input') args.input = argv[++index];
    else if (arg === '--out') args.outDir = argv[++index];
    else if (arg === '--limit') args.limit = Number(argv[++index]);
    else if (arg === '--help' || arg === '-h') args.help = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }

  if (!Number.isFinite(args.limit) || args.limit <= 0) {
    throw new Error('--limit must be a positive number');
  }

  return args;
}

function printHelp() {
  console.log(`Chef Universe Bazaar Concentration Guard

Usage:
  node concentration-guard.mjs [--out output-dir] [--limit 8]
  node concentration-guard.mjs --input snapshot.json [--out output-dir]

Options:
  --endpoint URL   Bazaar API endpoint to fetch
  --input FILE     Read a saved Bazaar snapshot instead of fetching
  --out DIR        Write concentration-guard.md and concentration-guard.json
  --limit N        Number of watchlist and guardrail rows
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  const raw = args.input ? await readFile(args.input, 'utf8') : await fetchSnapshot(args.endpoint);
  const report = buildReport(raw, { endpoint: args.endpoint, limit: args.limit });
  const markdown = renderMarkdown(report);

  if (args.outDir) {
    await mkdir(args.outDir, { recursive: true });
    await writeFile(join(args.outDir, 'concentration-guard.json'), `${JSON.stringify(report, null, 2)}\n`);
    await writeFile(join(args.outDir, 'concentration-guard.md'), markdown);
  }

  console.log(markdown);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

export {
  asNumber,
  buildReport,
  clamp,
  makeTopSignalMap,
  replayCommand,
  renderMarkdown,
  scoreIngredient,
};
