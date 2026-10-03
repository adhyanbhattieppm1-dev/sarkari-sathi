module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { url, fileBase64, fileType, fileText } = req.body;
  if (!url && !fileBase64 && !fileText) return res.status(400).json({ error: "URL, file, or text required" });

  const prompt = `You are analyzing a Government e-Marketplace (GeM) tender document for an Indian MSME seller. Extract the following and respond in JSON format only, no markdown:

{
  "tenderId": "tender ID or bid number",
  "category": "product/service category",
  "deadline": "bid end date in format 'Mon DD' e.g. 'Jun 28'",
  "value": "estimated bid value in Indian Rupee format e.g. '₹3,40,000'",
  "buyer": "buying organization name",
  "mseQuota": "MSE purchase preference details or 'Not specified'",
  "requirements": ["complete list of required documents, certificates, and compliance items"],
  "bidScore": <integer 0-100: how well-suited this tender is for a typical small Indian MSME — consider value size, documentation burden, timeline, competition likely>,
  "competitionLevel": "<Low|Medium|High>: expected competition level based on category and buyer type",
  "msePref": <true|false: whether MSE price preference or purchase preference is explicitly mentioned>,
  "daysLeft": <integer: estimated days until bid deadline from today October 2026>,
  "emd": "Earnest Money Deposit amount if specified, else 'GeM Exempt'",
  "experienceRequired": <integer: years of prior supply experience required, 0 if none>,
  "turnoverRequired": "minimum annual turnover required e.g. '₹10,00,000' or 'Not specified'",
  "warnings": ["list of up to 3 important cautions or risks for MSME bidders"],
  "aiNote": "one short paragraph (2-3 sentences) of AI advice for an MSME bidder considering this tender"
}

If you cannot find specific info, use "Not specified" for strings, false for booleans, 0 for numbers. For requirements, extract ALL documents mentioned including certificates, bank guarantees, compliance documents, integrity pacts, questionnaires etc.`;

  try {
    let contents;

    if (fileBase64 && fileType) {
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
