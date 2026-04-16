export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { ticker } = req.query;
  if (!ticker) return res.status(400).json({ error: 'No ticker' });
  
  const key = 'aa85591c77bc4e75a72b53d601f42869';
  const url = `https://api.twelvedata.com/price?symbol=${ticker}&apikey=${key}`;
  
  try {
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
}
