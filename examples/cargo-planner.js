const ENDPOINT = 'https://www.chefuniverse.io/api/v1/agent_bazaar';

function scoreCargoCandidate(ingredient) {
  const volume = Number(ingredient.volume_24h_chef ?? 0);
  const momentum = Number(ingredient.price_change_12h_pct ?? 0);
  const progress = Number(ingredient.progress ?? 0);

  return volume * 0.5 + momentum * 100 + progress * 1000;
}

async function main() {
  const response = await fetch(ENDPOINT);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const bazaar = await response.json();
  const ingredients = bazaar.ingredients ?? [];

  const ranked = ingredients
    .map((ingredient) => ({
      ticker: ingredient.ticker,
      score: scoreCargoCandidate(ingredient),
      volume_24h_chef: ingredient.volume_24h_chef,
      price_change_12h_pct: ingredient.price_change_12h_pct,
      progress: ingredient.progress,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  console.log('Uncharted Cargo Planner');
  console.log('These are example cargo candidates based on Bazaar data.');
  console.table(ranked);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
