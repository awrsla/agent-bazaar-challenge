const ENDPOINT = 'https://www.chefuniverse.io/api/v1/agent_bazaar';

async function main() {
  const response = await fetch(ENDPOINT);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  const bazaar = await response.json();

  console.log('Chef Universe Agent Bazaar snapshot');
  console.log('Endpoint:', ENDPOINT);
  console.log('Version:', bazaar.version ?? 'unknown');
  console.log('Block:', bazaar.block_number ?? 'unknown');
  console.log('Cache age:', bazaar.cache_age_sec ?? 'unknown');
  console.log('Top-level keys:', Object.keys(bazaar).join(', '));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
