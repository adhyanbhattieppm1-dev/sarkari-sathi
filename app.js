// ── DATA ──────────────────────────────────────────────────────────────────────

const TENDERS = [
  { id: 'GEM-2026-B-4829201', title: 'Office Chairs (Ergonomic, 50 units)', buyer: 'DoPT, Govt. of India', val: '₹3,40,000', deadline: 'Jun 14', comp: 78, status: 'In progress' },
  { id: 'GEM-2026-B-4801033', title: 'Stationery & Office Supplies', buyer: 'Ministry of Finance', val: '₹85,000', deadline: 'Jun 9', comp: 95, status: 'Ready' },
  { id: 'GEM-2026-B-4755892', title: 'Printer Cartridges (LaserJet)', buyer: 'AIIMS Delhi', val: '₹1,20,000', deadline: 'Jun 21', comp: 42, status: 'Incomplete' },
  { id: 'GEM-2026-B-4710045', title: 'Wooden Storage Cabinets', buyer: 'NIT Kurukshetra', val: '₹2,80,000', deadline: 'Jun 28', comp: 60, status: 'In progress' },
];

const CL_ITEMS = [
  { n: 'Udyam Registration Certificate', d: 'Valid MSME registration. Mandatory for all bids.', t: 'Identity', s: 'done' },
  { n: 'GSTIN Certificate', d: 'GST registration for your state.', t: 'Tax', s: 'done' },
  { n: 'PAN Card', d: 'PAN of proprietor or company.', t: 'Identity', s: 'done' },
  { n: 'Cancelled cheque / Bank proof', d: 'For payment credit post-award.', t: 'Finance', s: 'pending' },
  { n: 'BIS/ISO Quality Certificate', d: 'Mandatory for furniture category bids.', t: 'Quality', s: 'missing' },
  { n: 'Delivery timeline declaration', d: 'Self-declaration of max delivery days.', t: 'Compliance', s: 'done' },
  { n: 'Price bid form', d: 'Unit price as per GeM rate card.', t: 'Pricing', s: 'pending' },
  { n: 'GeM T&C acceptance', d: 'Online checkbox on GeM portal.', t: 'Compliance', s: 'done' },
];

const OCR_REQS = [
  'Udyam Registration Certificate',
  'GSTIN Registration Certificate',
  'PAN Card (Proprietor/Company)',
  'Bank account proof (cancelled cheque)',
  'Product quality certificate (BIS/ISO)',
  'Factory license / trade license',
  'Delivery timeline declaration',
  'Price bid (per unit, inclusive of all taxes)',
  'Acceptance of GeM terms of service',
];

const DIGI_DOCS = [
  { n: 'Udyam Registration Certificate', src: 'MSME Ministry', status: 'ok', exp: 'Jun 15, 2026' },
  { n: 'GSTIN Certificate', src: 'GSTN Portal', status: 'ok', exp: 'Permanent' },
  { n: 'PAN Card', src: 'Income Tax Dept.', status: 'ok', exp: 'Permanent' },
  { n: 'Aadhaar Card', src: 'UIDAI', status: 'ok', exp: 'Lifetime' },
  { n: 'Driving Licence', src: 'MoRTH', status: 'warn', exp: 'Dec 2027' },
];

const ALERT_TRIGGERS = [
  { n: 'Document expiry (7 days ahead)', on: true },
  { n: 'Tender deadline reminder (48 hrs)', on: true },
  { n: 'New matching tenders', on: true },
  { n: 'Bid submission confirmation', on: false },
  { n: 'Compliance score drops below 70%', on: false },
];

const EMAIL_MESSAGES = {
  en: { subject: 'Action Required: Udyam Certificate Expiring in 7 Days', body: `Dear Rajesh Kumar,\n\nThis is an important reminder from SarkariSathi.\n\nYour Udyam Registration Certificate is expiring in 7 days (Jun 15, 2026). Without a valid Udyam certificate, you will be unable to submit bids on the Government e-Marketplace (GeM).\n\nAction required:\n1. Visit the Udyam portal: udyamregistration.gov.in\n2. Renew your certificate\n3. Upload the renewed certificate to your SarkariSathi vault\n\nBid opportunities currently active: 4\nTotal bid value at risk: ₹7,25,000\n\nLogin to your dashboard to take action.\n\nRegards,\nSarkariSathi Compliance Team` },
  hi: { subject: 'तत्काल कार्रवाई: उद्यम प्रमाणपत्र 7 दिनों में समाप्त हो रहा है', body: `प्रिय राजेश कुमार,\n\nSarkariSathi की ओर से महत्वपूर्ण सूचना।\n\nआपका उद्यम पंजीकरण प्रमाणपत्र 7 दिनों में (15 जून 2026) समाप्त हो रहा है। वैध उद्यम प्रमाणपत्र के बिना आप GeM पर बोलियां नहीं लगा पाएंगे।\n\nकृपया तुरंत नवीनीकरण करें: udyamregistration.gov.in\n\nSarkariSathi अनुपालन टीम` },
  pa: { subject: 'ਤੁਰੰਤ ਕਾਰਵਾਈ: ਉਦਯਮ ਸਰਟੀਫਿਕੇਟ 7 ਦਿਨਾਂ ਵਿੱਚ ਖਤਮ ਹੋ ਰਿਹਾ ਹੈ', body: `ਪਿਆਰੇ ਰਾਜੇਸ਼ ਕੁਮਾਰ,\n\nSarkariSathi ਵੱਲੋਂ ਮਹੱਤਵਪੂਰਨ ਸੂਚਨਾ।\n\nਤੁਹਾਡਾ ਉਦਯਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਰਟੀਫਿਕੇਟ 7 ਦਿਨਾਂ ਵਿੱਚ ਖਤਮ ਹੋ ਰਿਹਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਨਵਿਆਓ: udyamregistration.gov.in` },
  mr: { subject: 'तातडीची कारवाई: उद्यम प्रमाणपत्र 7 दिवसांत संपणार', body: `प्रिय राजेश कुमार,\n\nSarkariSathi कडून महत्त्वाची सूचना.\n\nतुमचे उद्यम नोंदणी प्रमाणपत्र 7 दिवसांत (15 जून 2026) संपणार आहे. कृपया त्वरित नूतनीकरण करा: udyamregistration.gov.in` },
};

// ── STATE ─────────────────────────────────────────────────────────────────────
let chatHistory = [];

// ── NAVIGATION ────────────────────────────────────────────────────────────────
function go(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.ntab').forEach(x => x.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');
  const ps = ['dash', 'scanner', 'checklist', 'validator', 'digilocker', 'alerts', 'advisor'];
  const i = ps.indexOf(p);
  if (i >= 0) document.querySelectorAll('.ntab')[i].classList.add('active');
  // close mobile menu
  document.getElementById('ntabs').classList.remove('open');
  window.scrollTo(0, 0);
}

function toggleMenu() {
  document.getElementById('ntabs').classList.toggle('open');
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function renderDash() {
  document.getElementById('dash-tenders').innerHTML = TENDERS.map(t => `
    <div class="tender-card">
      <div class="tender-card-top">
        <div>
          <div class="tender-title">${t.title}</div>
          <div class="tender-sub">${t.buyer} · Closes ${t.deadline} · ${t.val}</div>
        </div>
        <span class="badge ${t.status === 'Ready' ? 'b-gn' : t.status === 'Incomplete' ? 'b-or' : 'b-nv'}">${t.status}</span>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--txm);margin-bottom:3px"><span>Compliance</span><span>${t.comp}%</span></div>
        <div class="pb"><div class="pbf ${t.comp < 50 ? 'or' : ''}" style="width:${t.comp}%"></div></div>
      </div>
      <div class="btn-row">
        <button class="btn btn-sm" onclick="go('checklist')">Checklist</button>
        <button class="btn btn-sm" onclick="go('validator')">Documents</button>
        <button class="btn btn-sm" onclick="go('advisor')"><i class="ti ti-robot"></i> AI help</button>
      </div>
    </div>`).join('');
}

// ── SCANNER ───────────────────────────────────────────────────────────────────
function runScan() {
  const url = document.getElementById('gem-url').value.trim();
  if (!url) { alert('Please enter a GeM tender URL.'); return; }
  const bar = document.getElementById('scan-bar');
  const res = document.getElementById('scan-result');
  res.style.display = 'none';
  bar.classList.add('show');
  const msgs = ['Fetching tender page...', 'Applying OCR on attachments...', 'AI extracting requirements...', 'Parsing deadlines & categories...'];
  let i = 0;
  const iv = setInterval(() => {
    document.getElementById('scan-status').textContent = msgs[i] || msgs[msgs.length - 1];
    i++;
    if (i >= msgs.length) {
      clearInterval(iv);
      setTimeout(() => {
        bar.classList.remove('show');
        // Populate meta
        const tId = url.split('/').pop() || 'GEM-2026-B-4829201';
        document.getElementById('scan-meta').innerHTML = [
          { l: 'Tender ID', v: tId },
          { l: 'Category', v: 'Office Furniture' },
          { l: 'Deadline', v: 'Jun 14, 2026 · 5PM' },
          { l: 'Est. value', v: '₹3,40,000' },
          { l: 'Buyer', v: 'DoPT, Govt. of India' },
          { l: 'MSE quota', v: '25% reserved' },
        ].map(f => `<div class="meta-field"><div class="mf-l">${f.l}</div><div class="mf-v">${f.v}</div></div>`).join('');
        // Populate requirements
        document.getElementById('ocr-reqs').innerHTML = OCR_REQS.map(r => `
          <div class="req-row">
            <i class="ti ti-file-text" style="font-size:15px;color:var(--nv-m);flex-shrink:0"></i>
            <span>${r}</span>
          </div>`).join('');
        res.style.display = 'block';
      }, 400);
    }
  }, 700);
}

// ── CHECKLIST ─────────────────────────────────────────────────────────────────
function renderChecklist() {
  const done = CL_ITEMS.filter(x => x.s === 'done').length;
  const pct = Math.round(done / CL_ITEMS.length * 100);
  document.getElementById('cl-bar').style.width = pct + '%';
  document.getElementById('cl-pct').textContent = pct + '%';
  document.getElementById('cl-badge').textContent = `${done}/${CL_ITEMS.length} done`;
  document.getElementById('cl-items').innerHTML = CL_ITEMS.map((it, i) => `
    <div class="ci">
      <div class="cbox ${it.s}" onclick="toggleCl(${i})" role="checkbox" tabindex="0" aria-checked="${it.s === 'done'}">
        <i class="ti ${it.s === 'done' ? 'ti-check' : it.s === 'missing' ? 'ti-x' : 'ti-dots'}" style="font-size:11px"></i>
      </div>
      <div>
        <div class="ct" style="${it.s === 'done' ? 'text-decoration:line-through;color:var(--txm)' : ''}">${it.n}</div>
        <div class="cd">${it.d}</div>
        <span class="ctag">${it.t}</span>
      </div>
    </div>`).join('');
}

function toggleCl(i) {
  CL_ITEMS[i].s = CL_ITEMS[i].s === 'done' ? 'pending' : 'done';
  renderChecklist();
}

// ── VALIDATOR ─────────────────────────────────────────────────────────────────
function handleFiles(files) {
  if (!files || files.length === 0) return;
  showValidationResults(Array.from(files).map(f => f.name));
}

function handleDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  if (files.length) showValidationResults(Array.from(files).map(f => f.name));
}

function showValidationResults(fileNames) {
  const template = [
    { ic: 'ti-certificate', s: 'warn', sl: 'Valid · Expires Jun 15' },
    { ic: 'ti-receipt-tax', s: 'pass', sl: 'Valid · Permanent' },
    { ic: 'ti-id', s: 'pass', sl: 'Valid · Format OK' },
    { ic: 'ti-rosette', s: 'pass', sl: 'Valid · Mar 2027' },
  ];
  document.getElementById('val-result').style.display = 'block';
  document.getElementById('val-list').innerHTML = fileNames.slice(0, 6).map((name, i) => {
    const t = template[i % template.length];
    const kb = Math.round(Math.random() * 300 + 80);
    return `<div class="doc-row">
      <i class="ti ${t.ic}" style="font-size:19px;color:var(--nv-m);flex-shrink:0"></i>
      <div style="flex:1"><div style="font-size:13px;font-weight:500">${name}</div><div style="font-size:11px;color:var(--txm)">PDF · ${kb} KB</div></div>
      <div class="${t.s === 'pass' ? 'vp' : t.s === 'warn' ? 'vw' : 'vf'}">
        <i class="ti ${t.s === 'pass' ? 'ti-check' : t.s === 'warn' ? 'ti-alert-triangle' : 'ti-x'}"></i>${t.sl}
      </div>
    </div>`;
  }).join('');
}

function submitBid() {
  document.getElementById('success-modal').classList.add('show');
}

// ── DIGILOCKER ────────────────────────────────────────────────────────────────
function renderDigi() {
  document.getElementById('digi-list').innerHTML = DIGI_DOCS.map(d => `
    <div class="digi-card">
      <div class="dot ${d.status === 'ok' ? 'dot-gn' : 'dot-or'}"></div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500">${d.n}</div>
        <div style="font-size:11px;color:var(--txm)">${d.src} · Exp: ${d.exp}</div>
      </div>
      <span class="badge ${d.status === 'ok' ? 'b-gn' : 'b-or'}">${d.status === 'ok' ? 'Valid' : 'Expiring'}</span>
    </div>`).join('');
}

function syncDigi(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = '<div class="dot-loader"><span></span><span></span><span></span></div> Syncing...';
  btn.disabled = true;
  setTimeout(() => { btn.innerHTML = '<i class="ti ti-check"></i> Synced!'; btn.disabled = false; }, 1800);
}

function autoImport() {
  const ok = document.getElementById('digi-ok');
  ok.style.display = 'flex';
  setTimeout(() => ok.style.display = 'none', 4000);
}

// ── ALERTS ────────────────────────────────────────────────────────────────────
function renderAlerts() {
  document.getElementById('alert-triggers').innerHTML = ALERT_TRIGGERS.map((a, i) => `
    <div class="trigger-row">
      <span>${a.n}</span>
      <button class="toggle ${a.on ? 'on' : 'off'}" onclick="toggleAlert(${i})" aria-label="toggle ${a.n}"></button>
    </div>`).join('');
  renderEmailPreview();
}

function toggleAlert(i) {
  ALERT_TRIGGERS[i].on = !ALERT_TRIGGERS[i].on;
  renderAlerts();
}

function renderEmailPreview() {
  const lang = document.getElementById('alert-lang')?.value || 'en';
  const msg = EMAIL_MESSAGES[lang] || EMAIL_MESSAGES.en;
  document.getElementById('email-preview').innerHTML = `
    <div class="email-preview">
      <div class="ep-header">
        <i class="ti ti-mail" style="color:#fff;font-size:16px"></i>
        <span>From: noreply@sarkari-sathi.in · To: rajesh.kumar@gmail.com</span>
      </div>
      <div class="ep-body">
        <h3>${msg.subject}</h3>
        <pre style="font-family:'DM Sans',sans-serif;white-space:pre-wrap;font-size:13px;line-height:1.7">${msg.body}</pre>
      </div>
    </div>`;
}

function testEmail(btn) {
  const orig = btn.innerHTML;
  btn.innerHTML = '<div class="dot-loader"><span></span><span></span><span></span></div> Sending...';
  btn.disabled = true;
  const email = document.getElementById('alert-email').value || 'your email';
  setTimeout(() => { btn.innerHTML = `<i class="ti ti-check"></i> Sent to ${email}`; btn.disabled = false; }, 1600);
}

// ── AI ADVISOR (REAL CLAUDE API) ──────────────────────────────────────────────
function quickQ(q) {
  document.getElementById('chat-inp').value = q;
  sendChat();
}

async function sendChat() {
  const inp = document.getElementById('chat-inp');
  const q = inp.value.trim();
  if (!q) return;
  inp.value = '';
  const wrap = document.getElementById('chat-wrap');

  // Add user message
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.textContent = q;
  wrap.appendChild(userMsg);

  // Add thinking indicator
  const aiMsg = document.createElement('div');
  aiMsg.className = 'msg ai';
  aiMsg.innerHTML = `<div class="msg-sender"><i class="ti ti-robot"></i> GeM Advisor</div><div class="thinking"><div class="dot-loader"><span></span><span></span><span></span></div> Thinking...</div>`;
  wrap.appendChild(aiMsg);
  wrap.scrollTop = wrap.scrollHeight;

  chatHistory.push({ role: 'user', content: q });

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a GeM (Government e-Marketplace) compliance advisor for Indian MSMEs. You help small business owners understand document requirements, tender eligibility, Udyam registration, BIS/ISO certificates, GeM portal policies, and bid compliance. Be concise, practical, and specific to Indian government procurement rules. Use simple language. Answer in 2-4 short paragraphs max. If relevant, mention specific portal URLs like gem.gov.in or udyamregistration.gov.in.`,
        messages: chatHistory
      })
    });
    const data = await res.json();
    const reply = data.content?.map(b => b.type === 'text' ? b.text : '').join('') || 'Sorry, I could not get a response. Please try again.';
    chatHistory.push({ role: 'assistant', content: reply });
    aiMsg.innerHTML = `<div class="msg-sender"><i class="ti ti-robot"></i> GeM Advisor</div>${reply.replace(/\n/g, '<br>')}`;
  } catch (e) {
    aiMsg.innerHTML = `<div class="msg-sender"><i class="ti ti-robot"></i> GeM Advisor</div>Connection error. Check your internet and try again.`;
  }
  wrap.scrollTop = wrap.scrollHeight;
}


// ── USER PERSONALIZATION ──────────────────────────────────────────────────────
function updateUserUI() {
  const session = typeof getSession === 'function' ? getSession() : null;
  if (!session) return;
  const name = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'User';
  const email = session?.user?.email || '';
  // Dashboard
  const dashName = document.getElementById('dash-name');
  if (dashName) dashName.textContent = name;
  // Nav
  const userName = document.getElementById('user-name');
  if (userName) userName.textContent = name;
  // Initials
  const initials = document.getElementById('user-initials');
  if (initials) initials.textContent = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  // DigiLocker
  const digiName = document.getElementById('digi-name');
  if (digiName) digiName.textContent = name + ' · Aadhaar linked';
  const digiEmail = document.getElementById('digi-email');
  if (digiEmail) digiEmail.textContent = email.replace('@', '.digilocker@') || 'user@digilocker.gov.in';
  const digiAvatar = document.getElementById('digi-avatar');
  if (digiAvatar) digiAvatar.textContent = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
  // Alerts email
  const alertEmail = document.getElementById('alert-email');
  if (alertEmail && !alertEmail.value) alertEmail.value = email;
}

// ── INIT ──────────────────────────────────────────────────────────────────────
renderDash();
renderChecklist();
renderDigi();
renderAlerts();
updateUserUI();
