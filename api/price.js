export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=60');
  
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'No ticker' });

  const sym = ticker.includes(':JSE') 
    ? ticker.replace(':JSE', '.JO')
    : ticker;

  try {
    const r = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?interval=1d&range=1d`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    );
    const data = await r.json();
    const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice
      || data?.chart?.result?.[0]?.meta?.previousClose;
    
    if (price) {
      return res.status(200).json({ price: price.toString() });
    }
    return res.status(404).json({ error: 'Price not found' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
