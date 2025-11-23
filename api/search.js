// api/search.js - Vercel Serverless Function
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { q, categories = 'general', language = 'en' } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    // Build SearXNG URL
    const searchParams = new URLSearchParams({
      q,
      categories,
      language,
    });

    const searxngUrl = `https://search.rhscz.eu/search?${searchParams.toString()}`;

    // Fetch from SearXNG
    const response = await fetch(searxngUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`SearXNG returned status ${response.status}`);
    }

    const html = await response.text();

    // Return HTML
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch search results',
      message: error.message 
    });
  }
}
