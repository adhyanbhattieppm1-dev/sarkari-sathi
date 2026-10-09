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
  "value": "total bid or contract value ONLY if explicitly stated in the document — do NOT calculate or estimate from quantity multiplied by price. Use 'Not specified' if no total value is stated.",
  "buyer": "buying organization name",
  "mseQuota": "MSE purchase preference details or 'Not specified'",
  "requirements": ["complete list of required documents, certificates, and compliance items"],
  "bidScore": <integer 0-100: how well-suited this tender is for a typical small Indian MSME. Score ONLY on MSME fit: category accessibility, documentation burden, EMD affordability, MSE preference, experience/turnover requirements, and competition level. Do NOT reduce the score based on deadline dates — deadline is shown separately and scoring on it causes confusion>,
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

    const key = process.env.GEMINI_API_KEY;

    const models = [
      { ver: 'v1', model: 'gemini-2.5-flash' },
      { ver: 'v1', model: 'gemini-2.0-flash' },
    ];

    let data = null;
    let lastError = '';
    for (const { ver, model } of models) {
      try {
        const r = await fetch(
          `https://generativelanguage.googleapis.com/${ver}/models/${model}:generateContent?key=${key}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents, generationConfig: { temperature: 0.1 } }),
            signal: AbortSignal.timeout(8000)
          }
        );
        const d = await r.json();
        if (d.candidates) { data = d; break; }
        lastError = `${model}@${ver}: ` + JSON.stringify(d).slice(0, 150);
      } catch(e) {
        lastError = `${model}@${ver}: timeout/network`;
      }
    }

    if (!data) {
      return res.json({ error: "Gemini error (all models failed). Last: " + lastError });
    }

    let text = data.candidates[0].content.parts[0].text;
    text = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);

    // Override daysLeft with accurate server-side calculation
    // Never trust Gemini to know today's date
    if (parsed.deadline) {
      const months = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11,
                       January:0,February:1,March:2,April:3,May:4,June:5,July:6,August:7,September:8,October:9,November:10,December:11 };
      let day, month, year;
      // Try "DD-Mon-YYYY" or "DD-Mon" e.g. "14-Oct-2026"
      const fmt1 = parsed.deadline.match(/(\d{1,2})[-\/]([A-Za-z]+)[-\/]?(\d{4})?/);
      // Try "Mon DD" or "Mon DD, YYYY" e.g. "Oct 14" or "October 14, 2026"
      const fmt2 = parsed.deadline.match(/([A-Za-z]+)\s+(\d{1,2})[,\s]*(\d{4})?/);
      if (fmt1) {
        day = parseInt(fmt1[1]); month = months[fmt1[2]]; year = fmt1[3] ? parseInt(fmt1[3]) : new Date().getFullYear();
      } else if (fmt2) {
        month = months[fmt2[1]]; day = parseInt(fmt2[2]); year = fmt2[3] ? parseInt(fmt2[3]) : new Date().getFullYear();
      }
      if (day && month !== undefined) {
        const now = new Date();
        const d = new Date(year || now.getFullYear(), month, day);
        parsed.daysLeft = Math.round((d - now) / 86400000);
      }
    }

    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: "Failed to analyze: " + err.message });
  }
}
