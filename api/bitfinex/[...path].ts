import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const { path } = req.query;
    const query = { ...req.query };
    delete query.path;

    if (!path || path.length === 0) {
      return res.status(400).json({ error: 'Missing Bitfinex endpoint path' });
    }

    const endpoint = `https://api-pub.bitfinex.com/${path.join('/')}`;

    const url =
      query && Object.keys(query).length > 0
        ? `${endpoint}?${new URLSearchParams(query).toString()}`
        : endpoint;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Bitfinex API error' });
    }

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    console.error('Bitfinex proxy error:', err);
    res.status(500).json({ error: 'Server error' });
  }
}
