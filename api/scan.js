module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL required" });

  let pageText = "";

  try {
    const pageRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(8000)
    });
    const html = await pageRes.text();
    pageText = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 6000);
  } catch (err) {
    pageText = `Could not fetch page directly. URL provided: ${url}`;
  }

  const prompt = `You are analyzing a Government e-Marketplace (GeM) tender page. Extract the following from the text below and respond in JSON format only, no markdown:

{
  "tenderId": "tender ID or bid number",
  "category": "product/service category",
  "deadline": "submission deadline",
  "value": "estimated value",
  "buyer": "buying organization",
  "mseQuota": "MSE reservation if any",
  "requirements": ["list", "of", "required", "documents"]
}

If you cannot find specific info, use "Not specified". For requirements, list all documents, certificates, registrations mentioned.

Page text:
${pageText}`;

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await geminiRes.json();
    if (!data.candidates) {
      return res.json({ error: "Gemini error: " + JSON.stringify(data) });
    }

    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: "Failed to analyze: " + err.message });
  }
}
