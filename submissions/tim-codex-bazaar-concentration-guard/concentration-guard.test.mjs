import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildReport,
  makeTopSignalMap,
  replayCommand,
  renderMarkdown,
  scoreIngredient,
} from './concentration-guard.mjs';

const baseIngredient = {
  ticker: 'cfTEST',
  grade: 2,
  current_price_chef: 0.01,
  current_supply: 1000000,
  max_supply: 8000000,
  progress: 0.125,
  market_cap_chef: 10000,
  reserve_balance_chef: 5000,
  liquidity_impact_10k_chef: {
    chef_in: 10000,
    tokens_received: 1000000,
    avg_price_chef: 0.01,
    slippage_pct: 0,
    partial_fill: false,
  },
  volume_24h_chef: 2500,
  price_change_24h_pct: 1.5,
  price_change_12h_pct: 2,
  volume_source: 'gecko_ohlcv',
  buy_user_count_24h: 8,
  buy_volume_24h_chef: 1400,
  sell_volume_24h_chef: 300,
  top_buyer_concentration_24h_pct: 24,
  signals: [],
};

test('top API signals increase watch score', () => {
  const plain = scoreIngredient(baseIngredient, makeTopSignalMap([]));
  const signaled = scoreIngredient(baseIngredient, makeTopSignalMap([
    {
      ticker: 'cfTEST',
      kind: 'VOLUME_SPIKE_24H',
      score: 1,
      note: 'test spike',
    },
  ]));

  assert.ok(signaled.watch_score > plain.watch_score);
  assert.ok(signaled.flags.includes('top_signal_watch'));
});

test('concentrated thin buying increases guard score', () => {
  const normal = scoreIngredient(baseIngredient, makeTopSignalMap([]));
  const concentrated = scoreIngredient({
    ...baseIngredient,
    buy_user_count_24h: 1,
    buy_volume_24h_chef: 2000,
    top_buyer_concentration_24h_pct: 100,
  }, makeTopSignalMap([]));

  assert.ok(concentrated.guard_score > normal.guard_score + 20);
  assert.ok(concentrated.flags.includes('concentrated_buy_flow'));
  assert.ok(concentrated.flags.includes('thin_buyer_set'));
});

test('report sorts watchlist and guardrails separately', () => {
  const snapshot = {
    generated_at: '2026-05-21T00:00:00.000Z',
    block_number: 123,
    cache_age_sec: 0,
    top_signals: [
      { ticker: 'cfHOT', kind: 'VOLUME_SPIKE_24H', score: 1, note: 'hot' },
    ],
    ingredients: [
      { ...baseIngredient, ticker: 'cfCALM' },
      { ...baseIngredient, ticker: 'cfHOT', volume_24h_chef: 50000 },
      {
        ...baseIngredient,
        ticker: 'cfRISK',
        buy_user_count_24h: 1,
        buy_volume_24h_chef: 9000,
        top_buyer_concentration_24h_pct: 99,
        liquidity_impact_10k_chef: {
          ...baseIngredient.liquidity_impact_10k_chef,
          slippage_pct: 3,
        },
      },
    ],
  };

  const report = buildReport(JSON.stringify(snapshot), { limit: 2 });

  assert.equal(report.watchlist[0].ticker, 'cfHOT');
  assert.equal(report.guardrails[0].ticker, 'cfRISK');
  assert.equal(report.summary.ingredient_count, 3);
  assert.equal(report.watchlist.length, 2);
  assert.equal(report.guardrails.length, 2);
});

test('markdown includes hashes and no guaranteed-profit language', () => {
  const report = buildReport(JSON.stringify({
    generated_at: '2026-05-21T00:00:00.000Z',
    block_number: 123,
    cache_age_sec: 0,
    top_signals: [],
    ingredients: [baseIngredient],
  }));
  const markdown = renderMarkdown(report);

  assert.match(markdown, /Source SHA-256/);
  assert.match(markdown, /Replay Trail/);
  assert.match(markdown, /--limit 8/);
  assert.match(markdown, /Observed \/ Inferred \/ Not Checked/);
  assert.match(markdown, /Missing short-horizon price changes/);
  assert.match(markdown, /10k CHEF slippage/);
  assert.match(markdown, /not financial advice/);
  assert.match(markdown, /does not claim guaranteed profit/);
});

test('replay command points to the submitted agent path', () => {
  assert.equal(
    replayCommand(5),
    'node submissions/tim-codex-bazaar-concentration-guard/concentration-guard.mjs --out submissions/tim-codex-bazaar-concentration-guard/output --limit 5',
  );
});
