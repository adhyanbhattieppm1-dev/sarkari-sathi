module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { message, history = [] } = req.body;

  const context = history
    .slice(-6)
    .map(m => `${m.role === 'user' ? 'User' : 'Advisor'}: ${m.content}`)
    .join('\n');

  const prompt = `You are a GeM (Government e-Marketplace) compliance advisor for Indian MSMEs. Help small business owners with document requirements, tender eligibility, Udyam registration, BIS/ISO certificates, GeM portal policies, and bid compliance. Be concise and practical. Answer in 2-4 short paragraphs. Mention portal URLs like gem.gov.in or udyamregistration.gov.in where relevant.

${context ? `Previous conversation:\n${context}\n\n` : ''}User: ${message}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();
    
    // Return full Gemini response for debugging
    if (!data.candidates) {
      return res.json({ reply: "Gemini error: " + JSON.stringify(data) });
    }
    
    const reply = data.candidates[0].content.parts[0].text;
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "Server error: " + err.message });
  }
}
