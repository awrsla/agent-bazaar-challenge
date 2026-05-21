import assert from "node:assert/strict";
import { test } from "node:test";

import {
  buildReceiptMap,
  hashString,
  normalizeSnapshot,
  rankWatchlist,
  toSubmissionJson,
} from "./receipt-map.mjs";

const baseSnapshot = {
  version: 1,
  generated_at: "2026-05-21T09:46:39.781Z",
  block_number: 123456,
  cache_age_sec: 42,
  global_asset: {
    symbol: "CHEF",
    price_usd: 0.000000525508607109152,
  },
  ingredients: [
    {
      ticker: "cfBASIL",
      market_cap_chef: 100,
      volume_24h_chef: 2,
      price_change_12h_pct: -1,
      progress: 0.1,
    },
    {
      ticker: "cfAVOCADO",
      market_cap_chef: 50,
      volume_24h_chef: 16,
      price_change_12h_pct: 22,
      progress: 0.7,
    },
  ],
  top_signals: [
    {
      ticker: "cfAVOCADO",
      kind: "VOLUME_SPIKE_24H",
      score: 1,
      note: "24h vol 8.0x daily season avg",
    },
  ],
};

test("normalizeSnapshot removes volatile cache age and sorts ingredients", () => {
  const shuffled = {
    ...baseSnapshot,
    cache_age_sec: 99,
    ingredients: [...baseSnapshot.ingredients].reverse(),
  };

  assert.deepEqual(normalizeSnapshot(shuffled), normalizeSnapshot(baseSnapshot));
});

test("rankWatchlist promotes ingredients with explicit top signals", () => {
  const ranked = rankWatchlist(baseSnapshot);

  assert.equal(ranked[0].ticker, "cfAVOCADO");
  assert.equal(ranked[0].primary_signal, "VOLUME_SPIKE_24H");
  assert.match(ranked[0].agent_note, /volume spike/i);
});

test("buildReceiptMap emits replayable markdown and matching report hash", () => {
  const receipt = buildReceiptMap(baseSnapshot, {
    endpoint: "https://www.chefuniverse.io/api/v1/agent_bazaar",
    fetchedAt: "2026-05-21T09:47:00.000Z",
    projectName: "Bazaar Signal Receipt Map",
  });

  assert.equal(receipt.endpoint, "https://www.chefuniverse.io/api/v1/agent_bazaar");
  assert.equal(receipt.generated_at, baseSnapshot.generated_at);
  assert.equal(receipt.watchlist[0].ticker, "cfAVOCADO");
  assert.match(receipt.markdown, /Bazaar Signal Receipt Map/);
  assert.match(receipt.markdown, /No guaranteed-profit claim/);
  assert.equal(receipt.report_sha256, hashString(receipt.markdown));
});

test("toSubmissionJson omits bulky derived payloads", () => {
  const receipt = buildReceiptMap(baseSnapshot, {
    endpoint: "https://www.chefuniverse.io/api/v1/agent_bazaar",
    fetchedAt: "2026-05-21T09:47:00.000Z",
  });

  const submissionJson = toSubmissionJson(receipt);

  assert.equal(submissionJson.project_name, "Bazaar Signal Receipt Map");
  assert.equal(submissionJson.snapshot_sha256, receipt.snapshot_sha256);
  assert.equal("markdown" in submissionJson, false);
  assert.equal("normalized_snapshot" in submissionJson, false);
});
