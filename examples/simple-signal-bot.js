const ENDPOINT = 'https://www.chefuniverse.io/api/v1/agent_bazaar';

function findIngredient(bazaar, ticker) {
  return (bazaar.ingredients ?? []).find((ingredient) => {
    return String(ingredient.ticker).toUpperCase() === String(ticker).toUpperCase();
  });
}

async function main() {
  const response = await fetch(ENDPOINT);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const bazaar = await response.json();
  const topSignal = bazaar.top_signals?.[0];

  if (!topSignal) {
    console.log('No top signals returned yet.');
    return;
  }

  const ingredient = findIngredient(bazaar, topSignal.ticker);

  console.log('Chef Universe Bazaar Signal');
  console.log('Signal:', topSignal.kind);
  console.log('Ticker:', topSignal.ticker);
  console.log('Score:', topSignal.score ?? 'n/a');
  console.log('Note:', topSignal.note ?? 'n/a');

  if (ingredient) {
    console.log('Market cap in CHEF:', ingredient.market_cap_chef ?? 'n/a');
    console.log('24h volume in CHEF:', ingredient.volume_24h_chef ?? 'n/a');
    console.log('Price change 12h:', ingredient.price_change_12h_pct ?? 'n/a');
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
