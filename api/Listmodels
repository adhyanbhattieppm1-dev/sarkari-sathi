module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const key = process.env.GEMINI_API_KEY;

  // Try listing models on both endpoints
  const results = {};
  for (const ver of ['v1', 'v1beta']) {
    const r = await fetch(`https://generativelanguage.googleapis.com/${ver}/models?key=${key}`);
    const d = await r.json();
    results[ver] = d.models ? d.models.map(m => m.name) : d;
  }
  res.json({ keyPrefix: key.slice(0,6), results });
}
