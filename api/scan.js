module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url, fileBase64, fileType, fileText } = req.body;
  if (!url && !fileBase64 && !fileText) return res.status(400).json({ error: "URL, file, or text required" });

  const prompt = `You are analyzing a Government e-Marketplace (GeM) tender document. Extract the following and respond in JSON format only, no markdown:

{
  "tenderId": "tender ID or bid number",
  "category": "product/service category",
  "deadline": "bid end date and time",
  "value": "estimated bid value",
  "buyer": "buying organization name",
  "mseQuota": "MSE purchase preference details",
  "requirements": ["complete list of required documents, certificates, and compliance items"]
}

If you cannot find specific info, use "Not specified". For requirements, extract ALL documents mentioned including certificates, bank guarantees, compliance documents, integrity pacts, questionnaires etc.`;

  try {
    let contents;

    if (fileBase64 && fileType) {
      // Send PDF/image directly to Gemini for native understanding
      contents = [{
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: fileType,
              data: fileBase64
            }
          }
        ]
      }];
    } else {
      // URL fetch or plain text fallback
      let pageText = fileText || '';
      if (!pageText && url) {
        try {
          const pageRes = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 Chrome/120" },
            signal: AbortSignal.timeout(8000)
          });
          const html = await pageRes.text();
          pageText = html
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 8000);
        } catch (err) {
          pageText = `Could not fetch page. URL: ${url}`;
        }
      }
      contents = [{ parts: [{ text: prompt + '\n\nDocument text:\n' + pageText }] }];
    }

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents })
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
