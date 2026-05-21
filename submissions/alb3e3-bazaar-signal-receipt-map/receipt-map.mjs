#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_ENDPOINT = "https://www.chefuniverse.io/api/v1/agent_bazaar";
const DEFAULT_PROJECT_NAME = "Bazaar Signal Receipt Map";

const SIGNAL_NOTES = {
  VOLUME_SPIKE_24H: "volume spike",
  LOW_VALUATION: "low valuation",
  MOMENTUM_12H: "12h momentum",
  SUPPLY_MILESTONE: "supply milestone",
};

export function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value)
      .filter(([, entryValue]) => entryValue !== undefined)
      .sort(([left], [right]) => left.localeCompare(right));

    return `{${entries
      .map(([key, entryValue]) => `${JSON.stringify(key)}:${stableStringify(entryValue)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

export function hashString(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

export function normalizeSnapshot(snapshot) {
  const normalized = stripVolatileFields(snapshot);

  if (Array.isArray(normalized.ingredients)) {
    normalized.ingredients = normalized.ingredients
      .map((ingredient) => stripVolatileFields(ingredient))
      .sort(compareByTicker);
  }

  if (Array.isArray(normalized.top_signals)) {
    normalized.top_signals = normalized.top_signals
      .map((signal) => stripVolatileFields(signal))
      .sort(compareSignals);
  }

  return JSON.parse(stableStringify(normalized));
}

export function rankWatchlist(snapshot, limit = 5) {
  const signalByTicker = new Map();
  for (const signal of snapshot.top_signals ?? []) {
    const ticker = String(signal.ticker ?? "").toUpperCase();
    if (ticker && !signalByTicker.has(ticker)) {
      signalByTicker.set(ticker, signal);
    }
  }

  return [...(snapshot.ingredients ?? [])]
    .map((ingredient) => {
      const signal = signalByTicker.get(String(ingredient.ticker ?? "").toUpperCase());
      const score = scoreIngredient(ingredient, signal);
      const primarySignal = signal?.kind ?? "NO_TOP_SIGNAL";

      return {
        ticker: ingredient.ticker ?? "unknown",
        score: round(score, 4),
        primary_signal: primarySignal,
        signal_note: signal?.note ?? "No top-ranked signal in this snapshot.",
        market_cap_chef: ingredient.market_cap_chef ?? null,
        volume_24h_chef: ingredient.volume_24h_chef ?? null,
        price_change_12h_pct: ingredient.price_change_12h_pct ?? null,
        progress: ingredient.progress ?? null,
        agent_note: makeAgentNote(primarySignal, signal?.note),
      };
    })
    .sort((left, right) => right.score - left.score || String(left.ticker).localeCompare(String(right.ticker)))
    .slice(0, limit);
}

export function buildReceiptMap(snapshot, options = {}) {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT;
  const fetchedAt = options.fetchedAt ?? new Date().toISOString();
  const projectName = options.projectName ?? DEFAULT_PROJECT_NAME;
  const normalized = normalizeSnapshot(snapshot);
  const normalizedPayload = stableStringify(normalized);
  const snapshotHash = hashString(normalizedPayload);
  const watchlist = rankWatchlist(snapshot);
  const topSignal = snapshot.top_signals?.[0] ?? null;

  const receipt = {
    project_name: projectName,
    endpoint,
    fetched_at: fetchedAt,
    generated_at: snapshot.generated_at ?? null,
    block_number: snapshot.block_number ?? null,
    snapshot_sha256: snapshotHash,
    top_signal: topSignal,
    watchlist,
    unchecked_assumptions: [
      "Signal ranking depends on the public API payload at fetch time.",
      "No wallet balances, private order flow, or offchain social data are inspected.",
      "Output is a reviewer-readable market receipt, not a trading instruction.",
    ],
    reviewer_rule:
      "Pass if the endpoint is reachable, the report hash matches the Markdown artifact, and the report avoids guaranteed-profit claims.",
  };

  receipt.markdown = renderMarkdown(receipt);
  receipt.report_sha256 = hashString(receipt.markdown);
  receipt.normalized_snapshot = normalized;

  return receipt;
}

export function toSubmissionJson(receipt) {
  const { markdown, normalized_snapshot: normalizedSnapshot, ...submissionJson } = receipt;
  void markdown;
  void normalizedSnapshot;
  return submissionJson;
}

function renderMarkdown(receipt) {
  const topSignal = receipt.top_signal;
  const topSignalText = topSignal
    ? `${topSignal.kind} on ${topSignal.ticker} (${topSignal.note ?? "no note"})`
    : "No top signal returned.";

  const watchRows = receipt.watchlist
    .map((item, index) => {
      return `| ${index + 1} | ${item.ticker} | ${item.primary_signal} | ${item.score} | ${formatValue(
        item.volume_24h_chef,
      )} | ${formatValue(item.price_change_12h_pct)} | ${item.agent_note} |`;
    })
    .join("\n");

  return `# ${receipt.project_name}

## Receipt

- Endpoint URL: ${receipt.endpoint}
- Fetched at: ${receipt.fetched_at}
- Snapshot generated at: ${receipt.generated_at ?? "n/a"}
- Base block number: ${receipt.block_number ?? "n/a"}
- Normalized market snapshot SHA-256: \`${receipt.snapshot_sha256}\`

## Top Signal

${topSignalText}

## Watchlist

| Rank | Ingredient | Signal | Score | 24h volume CHEF | 12h change % | Agent note |
| --- | --- | --- | ---: | ---: | ---: | --- |
${watchRows}

## Unchecked Assumptions

${receipt.unchecked_assumptions.map((assumption) => `- ${assumption}`).join("\n")}

## Reviewer Rule

${receipt.reviewer_rule}

## Boundary

No guaranteed-profit claim is made here. This is an agent-generated market receipt for replayable review, not financial advice.
`;
}

function stripVolatileFields(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const copy = {};
  for (const [key, entryValue] of Object.entries(value)) {
    if (key === "cache_age_sec" || key === "generated_at_ms") {
      continue;
    }
    copy[key] = entryValue;
  }
  return copy;
}

function compareByTicker(left, right) {
  return String(left.ticker ?? left.symbol ?? "").localeCompare(String(right.ticker ?? right.symbol ?? ""));
}

function compareSignals(left, right) {
  return `${left.ticker ?? ""}:${left.kind ?? ""}`.localeCompare(`${right.ticker ?? ""}:${right.kind ?? ""}`);
}

function scoreIngredient(ingredient, signal) {
  const signalScore = Number(signal?.score ?? 0) * 100;
  const volume = Math.log10(Number(ingredient.volume_24h_chef ?? 0) + 1) * 10;
  const momentum = Math.max(Number(ingredient.price_change_12h_pct ?? 0), 0);
  const progress = Number(ingredient.progress ?? 0) * 10;
  return signalScore + volume + momentum + progress;
}

function makeAgentNote(signalKind, signalNote) {
  if (signalKind === "NO_TOP_SIGNAL") {
    return "Watch only; no top-ranked signal was attached to this ingredient.";
  }

  const label = SIGNAL_NOTES[signalKind] ?? String(signalKind).toLowerCase();
  return `Review ${label}: ${signalNote ?? "signal present without note"}.`;
}

function round(value, precision) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function formatValue(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "n/a";
  }
  return String(round(Number(value), 6));
}

async function fetchSnapshot(endpoint) {
  const response = await fetch(endpoint, {
    headers: {
      accept: "application/json",
      "user-agent": "bazaar-signal-receipt-map/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

function parseArgs(argv) {
  const args = {
    endpoint: DEFAULT_ENDPOINT,
    outDir: path.resolve("submissions/alb3e3-bazaar-signal-receipt-map/output"),
    projectName: DEFAULT_PROJECT_NAME,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--endpoint") {
      args.endpoint = argv[++index];
    } else if (arg === "--out-dir") {
      args.outDir = path.resolve(argv[++index]);
    } else if (arg === "--project-name") {
      args.projectName = argv[++index];
    } else if (arg === "--help") {
      args.help = true;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return args;
}

function printHelp() {
  console.log(`Usage: node receipt-map.mjs [options]

Options:
  --endpoint <url>       Bazaar API endpoint. Defaults to ${DEFAULT_ENDPOINT}
  --out-dir <path>       Directory for Markdown and JSON output.
  --project-name <name>  Name to show in the generated report.
  --help                 Show this help text.
`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const snapshot = await fetchSnapshot(args.endpoint);
  const receipt = buildReceiptMap(snapshot, {
    endpoint: args.endpoint,
    projectName: args.projectName,
  });

  await mkdir(args.outDir, { recursive: true });

  const markdownPath = path.join(args.outDir, "bazaar-signal-receipt-map.md");
  const jsonPath = path.join(args.outDir, "bazaar-signal-receipt-map.json");

  await writeFile(markdownPath, receipt.markdown, "utf8");
  await writeFile(
    jsonPath,
    `${JSON.stringify(toSubmissionJson(receipt), null, 2)}\n`,
    "utf8",
  );

  console.log(`Wrote ${markdownPath}`);
  console.log(`Wrote ${jsonPath}`);
  console.log(`Snapshot SHA-256: ${receipt.snapshot_sha256}`);
  console.log(`Report SHA-256: ${receipt.report_sha256}`);
}

const executedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (executedPath === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
