# SarkariSathi — GeM Compliance Platform
### Free deployment guide (10 minutes, ₹0 cost)

---

## What's included
- `index.html` — full app UI (7 screens)
- `style.css` — complete styling, mobile-responsive
- `app.js` — all logic + real Claude AI advisor

## Features
- OCR Tender Scanner (simulated pipeline, real in production)
- Compliance Checklist with progress tracking
- Document Validator with drag & drop
- DigiLocker integration (simulated)
- Email alerts in 4 languages (English, Hindi, Punjabi, Marathi)
- AI Compliance Advisor — powered by real Claude API

---

## Deploy on Vercel (FREE — recommended)

### Step 1: Create GitHub repo
1. Go to github.com → New repository → name it `sarkari-sathi`
2. Upload all 3 files: `index.html`, `style.css`, `app.js`
3. Click "Commit changes"

### Step 2: Deploy on Vercel
1. Go to vercel.com → Sign up with GitHub (free)
2. Click "Add New Project"
3. Import your `sarkari-sathi` repo
4. Click "Deploy" — that's it!
5. Your app will be live at: `sarkari-sathi.vercel.app`

### Step 3: Custom domain (optional, ₹800/year)
- In Vercel dashboard → Domains → Add domain
- Buy `sarkari-sathi.in` at namecheap.com or GoDaddy

---

## Deploy on Netlify (alternative, also FREE)

1. Go to netlify.com → Sign up
2. Drag & drop your project folder onto the Netlify dashboard
3. Done — live in 30 seconds at `random-name.netlify.app`

---

## Free stack breakdown

| Service         | What it does              | Cost  |
|----------------|--------------------------|-------|
| Vercel/Netlify | Hosting + CDN             | FREE  |
| GitHub         | Code storage              | FREE  |
| Claude API     | AI Advisor responses      | Free credits to start, then ~₹1-2/conversation |
| SendGrid       | Email alerts (100/day)    | FREE  |
| MongoDB Atlas  | Database (if needed later)| FREE  |
| DigiLocker API | Govt doc fetch            | FREE  |

**Total monthly cost for MVP: ₹0**

---

## To enable real email alerts (SendGrid)

1. Sign up at sendgrid.com (free, 100 emails/day)
2. Get your API key from Settings → API Keys
3. Replace the `testEmail()` function in `app.js` with:

```javascript
async function testEmail(btn) {
  const email = document.getElementById('alert-email').value;
  await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_SENDGRID_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email }] }],
      from: { email: 'alerts@sarkari-sathi.in' },
      subject: 'SarkariSathi: Document Expiry Alert',
      content: [{ type: 'text/plain', value: 'Your Udyam certificate expires in 7 days.' }]
    })
  });
}
```

---

## To enable real GeM OCR scanning (production)

Install Node.js backend:
```
npm install express puppeteer tesseract.js cors
```

Use Puppeteer to fetch the GeM page, Tesseract.js for OCR on PDFs.
Deploy backend on Railway.app (free tier: $5 credit/month, enough for MVP).

---

Built for GeM SarkariSathi Capstone Project 2026
