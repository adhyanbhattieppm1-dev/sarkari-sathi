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

// ── LANGUAGE SYSTEM ───────────────────────────────────────────────────────────
let currentLang = 'en';

const LANG = {
  en: {
    label: 'EN',
    nav: ['Dashboard','Scanner','Checklist','Validator','DigiLocker','Alerts','AI Advisor'],
    heroTitle: 'Welcome back', heroSub: 'Your GeM compliance dashboard',
    dashStats: ['Active Tenders','Docs Expiring','Compliance Score','Bids Won'],
    scanTitle: 'Tender Scanner', scanBtn: 'Scan Tender', checkTitle: 'Compliance Checklist',
    valTitle: 'Document Validator', valSub: 'Auto-check', submitBtn: 'Submit bid package',
    buildBtn: 'Build checklist', signOut: 'Sign out', uploadProgress: 'Upload progress',
    scanPlaceholder: 'Paste GeM tender URL or upload PDF...',
    activeTenders: 'Active tenders', open: 'open', compliance: 'Compliance',
    checklist: 'Checklist', documents: 'Documents', aiHelp: 'AI help',
    statLabels: ['Docs uploaded','Expiring in 30d','Bids submitted','AI Advisor'],
    actionAlert: 'Action needed: Udyam Registration Certificate expires Jun 15, 2026. Open DigiLocker to renew it.',
    aiTip: 'AI Tip: Tender GEM-2026-B-4829201 needs a BIS quality certificate.',
    askAdvisor: 'Ask the advisor',
    statusLabels: { 'In progress': 'In progress', 'Ready': 'Ready', 'Incomplete': 'Incomplete' },
  },
  hi: {
    label: 'HI',
    nav: ['डैशबोर्ड','स्कैनर','चेकलिस्ट','सत्यापक','डिजिलॉकर','अलर्ट','AI सलाहकार'],
    heroTitle: 'वापस स्वागत है', heroSub: 'आपका GeM अनुपालन डैशबोर्ड',
    dashStats: ['सक्रिय निविदाएं','दस्तावेज़ समाप्ति','अनुपालन स्कोर','बोलियां जीती'],
    scanTitle: 'निविदा स्कैनर', scanBtn: 'स्कैन करें', checkTitle: 'अनुपालन चेकलिस्ट',
    valTitle: 'दस्तावेज़ सत्यापक', valSub: 'स्वतः जाँच', submitBtn: 'बोली पैकेज जमा करें',
    buildBtn: 'चेकलिस्ट बनाएं', signOut: 'साइन आउट', uploadProgress: 'अपलोड प्रगति',
    scanPlaceholder: 'GeM निविदा URL पेस्ट करें या PDF अपलोड करें...',
    activeTenders: 'सक्रिय निविदाएं', open: 'खुली', compliance: 'अनुपालन',
    checklist: 'चेकलिस्ट', documents: 'दस्तावेज़', aiHelp: 'AI सहायता',
    statLabels: ['दस्तावेज़ अपलोड','30 दिन में समाप्त','बोलियां जमा','AI सलाहकार'],
    actionAlert: 'कार्रवाई आवश्यक: उद्यम पंजीकरण प्रमाणपत्र 15 जून 2026 को समाप्त होगा।',
    aiTip: 'AI सुझाव: निविदा GEM-2026-B-4829201 के लिए BIS गुणवत्ता प्रमाणपत्र आवश्यक है।',
    askAdvisor: 'सलाहकार से पूछें',
    statusLabels: { 'In progress': 'जारी है', 'Ready': 'तैयार', 'Incomplete': 'अधूरा' },
  },
  pa: {
    label: 'PA',
    nav: ['ਡੈਸ਼ਬੋਰਡ','ਸਕੈਨਰ','ਚੈਕਲਿਸਟ','ਵੈਲੀਡੇਟਰ','ਡਿਜੀਲਾਕਰ','ਅਲਰਟ','AI ਸਲਾਹਕਾਰ'],
    heroTitle: 'ਵਾਪਸ ਸੁਆਗਤ ਹੈ', heroSub: 'ਤੁਹਾਡਾ GeM ਪਾਲਣਾ ਡੈਸ਼ਬੋਰਡ',
    dashStats: ['ਸਰਗਰਮ ਟੈਂਡਰ','ਦਸਤਾਵੇਜ਼ ਮਿਆਦ','ਪਾਲਣਾ ਸਕੋਰ','ਬੋਲੀਆਂ ਜਿੱਤੀਆਂ'],
    scanTitle: 'ਟੈਂਡਰ ਸਕੈਨਰ', scanBtn: 'ਸਕੈਨ ਕਰੋ', checkTitle: 'ਪਾਲਣਾ ਚੈਕਲਿਸਟ',
    valTitle: 'ਦਸਤਾਵੇਜ਼ ਵੈਲੀਡੇਟਰ', valSub: 'ਆਟੋ-ਜਾਂਚ', submitBtn: 'ਬੋਲੀ ਪੈਕੇਜ ਜਮ੍ਹਾਂ ਕਰੋ',
    buildBtn: 'ਚੈਕਲਿਸਟ ਬਣਾਓ', signOut: 'ਸਾਈਨ ਆਊਟ', uploadProgress: 'ਅਪਲੋਡ ਪ੍ਰਗਤੀ',
    scanPlaceholder: 'GeM ਟੈਂਡਰ URL ਪੇਸਟ ਕਰੋ ਜਾਂ PDF ਅਪਲੋਡ ਕਰੋ...',
    activeTenders: 'ਸਰਗਰਮ ਟੈਂਡਰ', open: 'ਖੁੱਲੇ', compliance: 'ਪਾਲਣਾ',
    checklist: 'ਚੈਕਲਿਸਟ', documents: 'ਦਸਤਾਵੇਜ਼', aiHelp: 'AI ਮਦਦ',
    statLabels: ['ਦਸਤਾਵੇਜ਼ ਅਪਲੋਡ','30 ਦਿਨਾਂ ਵਿੱਚ ਸਮਾਪਤ','ਬੋਲੀਆਂ ਜਮ੍ਹਾਂ','AI ਸਲਾਹਕਾਰ'],
    actionAlert: 'ਕਾਰਵਾਈ ਲੋੜੀਂਦੀ: ਉਦਯਮ ਰਜਿਸਟ੍ਰੇਸ਼ਨ ਸਰਟੀਫਿਕੇਟ 15 ਜੂਨ 2026 ਨੂੰ ਖਤਮ ਹੋਵੇਗਾ।',
    aiTip: 'AI ਸੁਝਾਅ: ਟੈਂਡਰ GEM-2026-B-4829201 ਲਈ BIS ਗੁਣਵੱਤਾ ਸਰਟੀਫਿਕੇਟ ਚਾਹੀਦਾ ਹੈ।',
    askAdvisor: 'ਸਲਾਹਕਾਰ ਤੋਂ ਪੁੱਛੋ',
    statusLabels: { 'In progress': 'ਜਾਰੀ ਹੈ', 'Ready': 'ਤਿਆਰ', 'Incomplete': 'ਅਧੂਰਾ' },
  },
  mr: {
    label: 'MR',
    nav: ['डॅशबोर्ड','स्कॅनर','चेकलिस्ट','व्हॅलिडेटर','डिजीलॉकर','अलर्ट','AI सल्लागार'],
    heroTitle: 'परत स्वागत आहे', heroSub: 'तुमचे GeM अनुपालन डॅशबोर्ड',
    dashStats: ['सक्रिय निविदा','कागदपत्रे कालबाह्य','अनुपालन स्कोर','बोली जिंकल्या'],
    scanTitle: 'निविदा स्कॅनर', scanBtn: 'स्कॅन करा', checkTitle: 'अनुपालन चेकलिस्ट',
    valTitle: 'कागदपत्र व्हॅलिडेटर', valSub: 'स्वयं-तपासणी', submitBtn: 'बोली पॅकेज सबमिट करा',
    buildBtn: 'चेकलिस्ट तयार करा', signOut: 'साइन आउट', uploadProgress: 'अपलोड प्रगती',
    scanPlaceholder: 'GeM निविदा URL पेस्ट करा किंवा PDF अपलोड करा...',
    activeTenders: 'सक्रिय निविदा', open: 'खुल्या', compliance: 'अनुपालन',
    checklist: 'चेकलिस्ट', documents: 'कागदपत्रे', aiHelp: 'AI मदत',
    statLabels: ['कागदपत्रे अपलोड','30 दिवसांत कालबाह्य','बोली सादर','AI सल्लागार'],
    actionAlert: 'कारवाई आवश्यक: उद्यम नोंदणी प्रमाणपत्र 15 जून 2026 रोजी कालबाह्य होईल.',
    aiTip: 'AI सूचना: निविदा GEM-2026-B-4829201 साठी BIS गुणवत्ता प्रमाणपत्र आवश्यक आहे.',
    askAdvisor: 'सल्लागाराला विचारा',
    statusLabels: { 'In progress': 'प्रगतीत', 'Ready': 'तयार', 'Incomplete': 'अपूर्ण' },
  },
  gu: {
    label: 'GU',
    nav: ['ડેશબોર્ડ','સ્કેનર','ચેકલિસ્ટ','વેલિડેટર','ડિજીલૉકર','એલર્ટ','AI સલાહકાર'],
    heroTitle: 'પાછા સ્વાગત છે', heroSub: 'તમારું GeM અનુપાલન ડેશબોર્ડ',
    dashStats: ['સક્રિય ટેન્ડર','દસ્તાવેજ સમાપ્તિ','અનુપાલન સ્કોર','બોલી જીતી'],
    scanTitle: 'ટેન્ડર સ્કેનર', scanBtn: 'સ્કેન કરો', checkTitle: 'અનુપાલન ચેકલિસ્ટ',
    valTitle: 'દસ્તાવેજ વેલિડેટર', valSub: 'સ્વતઃ-તપાસ', submitBtn: 'બોલી પેકેજ સબમિટ કરો',
    buildBtn: 'ચેકલિસ્ટ બનાવો', signOut: 'સાઇન આઉટ', uploadProgress: 'અપલોડ પ્રગતિ',
    scanPlaceholder: 'GeM ટેન્ડર URL પેસ્ટ કરો અથવા PDF અપલોડ કરો...',
    activeTenders: 'સક્રિય ટેન્ડર', open: 'ખુલ્લા', compliance: 'અનુપાલન',
    checklist: 'ચેકલિસ્ટ', documents: 'દસ્તાવેજો', aiHelp: 'AI મદદ',
    statLabels: ['દસ્તાવેજ અપલોડ','30 દિવસમાં સમાપ્ત','બોલી સબમિટ','AI સલાહકાર'],
    actionAlert: 'કાર્યવાહી જરૂરી: ઉદ્યમ નોંધણી પ્રમાણપત્ર 15 જૂન 2026ના રોજ સમાપ્ત થશે.',
    aiTip: 'AI સૂચન: ટેન્ડર GEM-2026-B-4829201 માટે BIS ગુણવત્તા પ્રમાણપત્ર જોઈએ.',
    askAdvisor: 'સલાહકારને પૂછો',
    statusLabels: { 'In progress': 'ચાલુ છે', 'Ready': 'તૈયાર', 'Incomplete': 'અધૂરું' },
  },
  ta: {
    label: 'TA',
    nav: ['டாஷ்போர்டு','ஸ்கேனர்','சரிபார்ப்பு பட்டியல்','சரிபார்ப்பாளர்','டிஜிலாக்கர்','எச்சரிக்கைகள்','AI ஆலோசகர்'],
    heroTitle: 'மீண்டும் வரவேற்கிறோம்', heroSub: 'உங்கள் GeM இணக்க டாஷ்போர்டு',
    dashStats: ['செயலில் டெண்டர்','ஆவணங்கள் காலாவதி','இணக்க மதிப்பெண்','வெற்றி ஏலங்கள்'],
    scanTitle: 'டெண்டர் ஸ்கேனர்', scanBtn: 'ஸ்கேன் செய்', checkTitle: 'இணக்க பட்டியல்',
    valTitle: 'ஆவண சரிபார்ப்பாளர்', valSub: 'தானியங்கி சரிபார்ப்பு', submitBtn: 'ஏல தொகுப்பை சமர்ப்பி',
    buildBtn: 'பட்டியலை உருவாக்கு', signOut: 'வெளியேறு', uploadProgress: 'பதிவேற்ற முன்னேற்றம்',
    scanPlaceholder: 'GeM டெண்டர் URL ஒட்டவும் அல்லது PDF பதிவேற்றவும்...',
    activeTenders: 'செயலில் டெண்டர்கள்', open: 'திறந்த', compliance: 'இணக்கம்',
    checklist: 'சரிபார்ப்பு பட்டியல்', documents: 'ஆவணங்கள்', aiHelp: 'AI உதவி',
    statLabels: ['ஆவணங்கள் பதிவேற்றம்','30 நாளில் காலாவதி','ஏலங்கள் சமர்ப்பிக்கப்பட்டது','AI ஆலோசகர்'],
    actionAlert: 'நடவடிக்கை தேவை: உத்யம் பதிவு சான்றிதழ் ஜூன் 15, 2026 அன்று காலாவதியாகும்.',
    aiTip: 'AI குறிப்பு: டெண்டர் GEM-2026-B-4829201 க்கு BIS தர சான்றிதழ் தேவை.',
    askAdvisor: 'ஆலோசகரிடம் கேளுங்கள்',
    statusLabels: { 'In progress': 'நடவடிக்கையில்', 'Ready': 'தயார்', 'Incomplete': 'முழுமையற்றது' },
  },
  te: {
    label: 'TE',
    nav: ['డాష్‌బోర్డ్','స్కానర్','చెక్‌లిస్ట్','వాలిడేటర్','డిజిలాకర్','హెచ్చరికలు','AI సలహాదారు'],
    heroTitle: 'తిరిగి స్వాగతం', heroSub: 'మీ GeM సమ్మతి డాష్‌బోర్డ్',
    dashStats: ['చురుకైన టెండర్లు','పత్రాల గడువు','సమ్మతి స్కోర్','గెలిచిన బిడ్లు'],
    scanTitle: 'టెండర్ స్కానర్', scanBtn: 'స్కాన్ చేయి', checkTitle: 'సమ్మతి చెక్‌లిస్ట్',
    valTitle: 'పత్రాల వాలిడేటర్', valSub: 'స్వయంచాలక తనిఖీ', submitBtn: 'బిడ్ ప్యాకేజీని సమర్పించు',
    buildBtn: 'చెక్‌లిస్ట్ నిర్మించు', signOut: 'సైన్ అవుట్', uploadProgress: 'అప్‌లోడ్ పురోగతి',
    scanPlaceholder: 'GeM టెండర్ URL అతికించండి లేదా PDF అప్‌లోడ్ చేయండి...',
    activeTenders: 'చురుకైన టెండర్లు', open: 'తెరిచిన', compliance: 'సమ్మతి',
    checklist: 'చెక్‌లిస్ట్', documents: 'పత్రాలు', aiHelp: 'AI సహాయం',
    statLabels: ['పత్రాలు అప్‌లోడ్','30 రోజులలో గడువు','బిడ్లు సమర్పించబడ్డాయి','AI సలహాదారు'],
    actionAlert: 'చర్య అవసరం: ఉద్యమ్ నమోదు సర్టిఫికేట్ జూన్ 15, 2026న గడువు తీరుతుంది.',
    aiTip: 'AI సూచన: టెండర్ GEM-2026-B-4829201కు BIS నాణ్యత సర్టిఫికేట్ అవసరం.',
    askAdvisor: 'సలహాదారుని అడగండి',
    statusLabels: { 'In progress': 'జరుగుతోంది', 'Ready': 'సిద్ధం', 'Incomplete': 'అసంపూర్ణం' },
  },
  kn: {
    label: 'KN',
    nav: ['ಡ್ಯಾಶ್‌ಬೋರ್ಡ್','ಸ್ಕ್ಯಾನರ್','ಚೆಕ್‌ಲಿಸ್ಟ್','ವ್ಯಾಲಿಡೇಟರ್','ಡಿಜಿಲಾಕರ್','ಎಚ್ಚರಿಕೆಗಳು','AI ಸಲಹೆಗಾರ'],
    heroTitle: 'ಮತ್ತೆ ಸ್ವಾಗತ', heroSub: 'ನಿಮ್ಮ GeM ಅನುಸರಣೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    dashStats: ['ಸಕ್ರಿಯ ಟೆಂಡರ್‌ಗಳು','ದಾಖಲೆಗಳ ಮುಕ್ತಾಯ','ಅನುಸರಣೆ ಸ್ಕೋರ್','ಗೆದ್ದ ಬಿಡ್‌ಗಳು'],
    scanTitle: 'ಟೆಂಡರ್ ಸ್ಕ್ಯಾನರ್', scanBtn: 'ಸ್ಕ್ಯಾನ್ ಮಾಡಿ', checkTitle: 'ಅನುಸರಣೆ ಚೆಕ್‌ಲಿಸ್ಟ್',
    valTitle: 'ದಾಖಲೆ ವ್ಯಾಲಿಡೇಟರ್', valSub: 'ಸ್ವಯಂ-ಪರಿಶೀಲನೆ', submitBtn: 'ಬಿಡ್ ಪ್ಯಾಕೇಜ್ ಸಲ್ಲಿಸಿ',
    buildBtn: 'ಚೆಕ್‌ಲಿಸ್ಟ್ ನಿರ್ಮಿಸಿ', signOut: 'ಸೈನ್ ಔಟ್', uploadProgress: 'ಅಪ್‌ಲೋಡ್ ಪ್ರಗತಿ',
    scanPlaceholder: 'GeM ಟೆಂಡರ್ URL ಅಂಟಿಸಿ ಅಥವಾ PDF ಅಪ್‌ಲೋಡ್ ಮಾಡಿ...',
    activeTenders: 'ಸಕ್ರಿಯ ಟೆಂಡರ್‌ಗಳು', open: 'ತೆರೆದ', compliance: 'ಅನುಸರಣೆ',
    checklist: 'ಚೆಕ್‌ಲಿಸ್ಟ್', documents: 'ದಾಖಲೆಗಳು', aiHelp: 'AI ಸಹಾಯ',
    statLabels: ['ದಾಖಲೆ ಅಪ್‌ಲೋಡ್','30 ದಿನಗಳಲ್ಲಿ ಮುಕ್ತಾಯ','ಬಿಡ್ ಸಲ್ಲಿಸಲಾಗಿದೆ','AI ಸಲಹೆಗಾರ'],
    actionAlert: 'ಕ್ರಮ ಅಗತ್ಯ: ಉದ್ಯಮ ನೋಂದಣಿ ಪ್ರಮಾಣಪತ್ರ ಜೂನ್ 15, 2026 ರಂದು ಅವಧಿ ಮೀರುತ್ತದೆ.',
    aiTip: 'AI ಸಲಹೆ: ಟೆಂಡರ್ GEM-2026-B-4829201 ಗೆ BIS ಗುಣಮಟ್ಟ ಪ್ರಮಾಣಪತ್ರ ಬೇಕು.',
    askAdvisor: 'ಸಲಹೆಗಾರರನ್ನು ಕೇಳಿ',
    statusLabels: { 'In progress': 'ಪ್ರಗತಿಯಲ್ಲಿದೆ', 'Ready': 'ಸಿದ್ಧ', 'Incomplete': 'ಅಪೂರ್ಣ' },
  },
  bn: {
    label: 'BN',
    nav: ['ড্যাশবোর্ড','স্ক্যানার','চেকলিস্ট','যাচাইকারী','ডিজিলকার','সতর্কতা','AI উপদেষ্টা'],
    heroTitle: 'আবার স্বাগতম', heroSub: 'আপনার GeM সম্মতি ড্যাশবোর্ড',
    dashStats: ['সক্রিয় টেন্ডার','নথি মেয়াদোত্তীর্ণ','সম্মতি স্কোর','জেতা বিড'],
    scanTitle: 'টেন্ডার স্ক্যানার', scanBtn: 'স্ক্যান করুন', checkTitle: 'সম্মতি চেকলিস্ট',
    valTitle: 'নথি যাচাইকারী', valSub: 'স্বয়ংক্রিয় যাচাই', submitBtn: 'বিড প্যাকেজ জমা দিন',
    buildBtn: 'চেকলিস্ট তৈরি করুন', signOut: 'সাইন আউট', uploadProgress: 'আপলোড অগ্রগতি',
    scanPlaceholder: 'GeM টেন্ডার URL পেস্ট করুন বা PDF আপলোড করুন...',
    activeTenders: 'সক্রিয় টেন্ডার', open: 'খোলা', compliance: 'সম্মতি',
    checklist: 'চেকলিস্ট', documents: 'নথি', aiHelp: 'AI সাহায্য',
    statLabels: ['নথি আপলোড','৩০ দিনে মেয়াদোত্তীর্ণ','বিড জমা দেওয়া','AI উপদেষ্টা'],
    actionAlert: 'পদক্ষেপ প্রয়োজন: উদ্যম নিবন্ধন সার্টিফিকেট ১৫ জুন ২০২৬ এ মেয়াদ শেষ হবে।',
    aiTip: 'AI পরামর্শ: টেন্ডার GEM-2026-B-4829201 এর জন্য BIS মান সার্টিফিকেট প্রয়োজন।',
    askAdvisor: 'উপদেষ্টাকে জিজ্ঞাসা করুন',
    statusLabels: { 'In progress': 'চলমান', 'Ready': 'প্রস্তুত', 'Incomplete': 'অসম্পূর্ণ' },
  },
  or: {
    label: 'OR',
    nav: ['ଡ୍ୟାଶବୋର୍ଡ','ସ୍କ୍ୟାନର','ଚେକଲିଷ୍ଟ','ଭ୍ୟାଲିଡେଟର','ଡିଜିଲକର','ସତର୍କତା','AI ପରାମର୍ଶଦାତା'],
    heroTitle: 'ପୁନଃ ସ୍ୱାଗତ', heroSub: 'ଆପଣଙ୍କ GeM ଅନୁପାଳନ ଡ୍ୟାଶବୋର୍ଡ',
    dashStats: ['ସକ୍ରିୟ ଟେଣ୍ଡର','ଦସ୍ତାବେଜ ସମାପ୍ତି','ଅନୁପାଳନ ସ୍କୋର','ଜିତିଥିବା ବିଡ'],
    scanTitle: 'ଟେଣ୍ଡର ସ୍କ୍ୟାନର', scanBtn: 'ସ୍କ୍ୟାନ କରନ୍ତୁ', checkTitle: 'ଅନୁପାଳନ ଚେକଲିଷ୍ଟ',
    valTitle: 'ଦସ୍ତାବେଜ ଭ୍ୟାଲିଡେଟର', valSub: 'ସ୍ୱତଃ-ଯାଞ୍ଚ', submitBtn: 'ବିଡ ପ୍ୟାକେଜ ଦାଖଲ କରନ୍ତୁ',
    buildBtn: 'ଚେକଲିଷ୍ଟ ତିଆରି କରନ୍ତୁ', signOut: 'ସାଇନ ଆଉଟ', uploadProgress: 'ଅପଲୋଡ ଅଗ୍ରଗତି',
    scanPlaceholder: 'GeM ଟେଣ୍ଡର URL ପେଷ୍ଟ କରନ୍ତୁ ବା PDF ଅପଲୋଡ କରନ୍ତୁ...',
    activeTenders: 'ସକ୍ରିୟ ଟେଣ୍ଡର', open: 'ଖୋଲା', compliance: 'ଅନୁପାଳନ',
    checklist: 'ଚେକଲିଷ୍ଟ', documents: 'ଦସ୍ତାବେଜ', aiHelp: 'AI ସହାୟତା',
    statLabels: ['ଦସ୍ତାବେଜ ଅପଲୋଡ','30 ଦିନରେ ସମାପ୍ତ','ବିଡ ଦାଖଲ','AI ପରାମର୍ଶଦାତା'],
    actionAlert: 'କାର୍ଯ୍ୟ ଆବଶ୍ୟକ: ଉଦ୍ୟମ ପଞ୍ଜୀକରଣ ପ୍ରମାଣପତ୍ର ଜୁନ 15, 2026 ରେ ସମାପ୍ତ ହେବ।',
    aiTip: 'AI ପରାମର୍ଶ: ଟେଣ୍ଡର GEM-2026-B-4829201 ପାଇଁ BIS ଗୁଣବତ୍ତା ପ୍ରମାଣପତ୍ର ଦରକାର।',
    askAdvisor: 'ପରାମର୍ଶଦାତାଙ୍କୁ ପଚାରନ୍ତୁ',
    statusLabels: { 'In progress': 'ଚାଲୁ ଅଛି', 'Ready': 'ପ୍ରସ୍ତୁତ', 'Incomplete': 'ଅସମ୍ପୂର୍ଣ୍ଣ' },
  },
};

function toggleLangMenu() {
  const m = document.getElementById('lang-menu');
  m.style.display = m.style.display === 'none' ? 'block' : 'none';
}

function setLang(lang) {
  currentLang = lang;
  const t = LANG[lang];

  document.getElementById('lang-label').textContent = t.label;
  ['en','hi','pa','mr','gu','ta','te','kn','bn','or'].forEach(l => {
    document.getElementById('lc-' + l).textContent = l === lang ? '✓' : '';
  });

  const tabs = document.querySelectorAll('.ntab');
  t.nav.forEach((label, i) => { if (tabs[i]) tabs[i].innerHTML = tabs[i].innerHTML.replace(/>[^<]+$/, '>' + label); });

  const heroH = document.querySelector('.hero h1');
  if (heroH) {
    const nameSpan = document.getElementById('dash-name');
    const userName = nameSpan ? nameSpan.textContent : '';
    heroH.innerHTML = t.heroTitle + (userName ? ', <span id="dash-name">' + userName + '</span>' : '') + '!';
  }
  const heroP = document.querySelector('.hero p');
  if (heroP) heroP.textContent = t.heroSub;

  const scanH = document.querySelector('#page-scanner .sec h2');
  if (scanH) scanH.textContent = t.scanTitle;
  const scanInp = document.getElementById('scan-url');
  if (scanInp) scanInp.placeholder = t.scanPlaceholder;
  const scanBtn = document.getElementById('scan-btn');
  if (scanBtn) scanBtn.innerHTML = `<i class="ti ti-scan"></i> ${t.scanBtn}`;

  const clH = document.querySelector('#page-checklist .sec h2');
  if (clH) clH.textContent = t.checkTitle;

  const valH = document.querySelector('#page-validator .sec h2');
  if (valH) valH.textContent = t.valTitle;
  const valBadge = document.querySelector('#page-validator .badge');
  if (valBadge) valBadge.textContent = t.valSub;
  const valProg = document.querySelector('#page-validator .prog-header span');
  if (valProg) valProg.textContent = t.uploadProgress;
  const submitBtn = document.querySelector('#page-validator .btn-gn');
  if (submitBtn) submitBtn.innerHTML = `<i class="ti ti-send"></i> ${t.submitBtn}`;

  const statLabels = document.querySelectorAll('#page-dash .sc-l');
  if (t.statLabels) t.statLabels.forEach((label, i) => { if (statLabels[i]) statLabels[i].textContent = label; });

  const actionEl = document.querySelector('#page-dash .al-warn span');
  if (actionEl && t.actionAlert) actionEl.textContent = t.actionAlert;
  const aiTipEl = document.querySelector('#page-dash .al-info');
  if (aiTipEl && t.aiTip) aiTipEl.innerHTML = `<i class="ti ti-bulb"></i><span>${t.aiTip} <a href="#" onclick="go('advisor')">${t.askAdvisor || 'Ask the advisor'}</a> how to get one fast.</span>`;

  const signOutBtn = document.querySelector('.signout-btn');
  if (signOutBtn) signOutBtn.innerHTML = `<i class="ti ti-logout"></i> ${t.signOut}`;

  renderDash();
  document.getElementById('lang-menu').style.display = 'none';
}

document.addEventListener('click', function(e) {
  const sel = document.querySelector('.lang-sel');
  if (sel && !sel.contains(e.target)) {
    document.getElementById('lang-menu').style.display = 'none';
  }
});

// ── STATE ─────────────────────────────────────────────────────────────────────
let chatHistory = [];
let scannedRequirements = null;

// ── NAVIGATION ────────────────────────────────────────────────────────────────
function go(p) {
  document.querySelectorAll('.page').forEach(x => x.classList.remove('active'));
  document.querySelectorAll('.ntab').forEach(x => x.classList.remove('active'));
  document.getElementById('page-' + p).classList.add('active');
  const ps = ['dash', 'scanner', 'checklist', 'validator', 'digilocker', 'alerts', 'advisor'];
  const i = ps.indexOf(p);
  if (i >= 0) document.querySelectorAll('.ntab')[i].classList.add('active');
  if (p === 'validator') renderValidator();
  document.getElementById('ntabs').classList.remove('open');
  window.scrollTo(0, 0);
}

function toggleMenu() {
  document.getElementById('ntabs').classList.toggle('open');
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function renderDash() {
  const lang = LANG[currentLang] || LANG['en'];
  const statusLabels = lang.statusLabels || { 'In progress': 'In progress', 'Ready': 'Ready', 'Incomplete': 'Incomplete' };
  const container = document.getElementById('dash-tenders');
  if (!container) return;
  container.innerHTML = TENDERS.map(tender => `
    <div class="tender-card">
      <div class="tender-card-top">
        <div>
          <div class="tender-title">${tender.title}</div>
          <div class="tender-sub">${tender.buyer} · Closes ${tender.deadline} · ${tender.val}</div>
        </div>
        <span class="badge ${tender.status === 'Ready' ? 'b-gn' : tender.status === 'Incomplete' ? 'b-or' : 'b-nv'}">${statusLabels[tender.status] || tender.status}</span>
      </div>
      <div style="margin-bottom:10px">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--txm);margin-bottom:3px">
          <span>${lang.compliance || 'Compliance'}</span><span>${tender.comp}%</span>
        </div>
        <div class="pb"><div class="pbf ${tender.comp < 50 ? 'or' : ''}" style="width:${tender.comp}%"></div></div>
      </div>
      <div class="btn-row">
        <button class="btn btn-sm" onclick="go('checklist')"><i class="ti ti-checklist"></i> ${lang.checklist || 'Checklist'}</button>
        <button class="btn btn-sm" onclick="go('validator')"><i class="ti ti-files"></i> ${lang.documents || 'Documents'}</button>
        <button class="btn btn-sm" onclick="go('advisor')"><i class="ti ti-robot"></i> ${lang.aiHelp || 'AI help'}</button>
      </div>
    </div>`).join('');
}

// ── SCANNER ───────────────────────────────────────────────────────────────────
async function runScan() {
  const url = document.getElementById('gem-url').value.trim();
  const fileInput = document.getElementById('scan-file');
  const file = fileInput && fileInput.files[0];
  if (!url && !file) { alert('Please enter a GeM tender URL or upload a file.'); return; }
  const bar = document.getElementById('scan-bar');
  const res = document.getElementById('scan-result');
  res.style.display = 'none';
  bar.classList.add('show');
  const msgs = ['Reading document...', 'Applying OCR...', 'AI extracting requirements...', 'Parsing details...'];
  let i = 0;
  const iv = setInterval(() => {
    document.getElementById('scan-status').textContent = msgs[Math.min(i, msgs.length-1)];
    i++;
  }, 700);
  try {
    let body = { url: url || '' };
    if (file) {
      const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
      const isImage = file.type.startsWith('image/');
      if (isPDF || isImage) {
        const base64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result.split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        body = { fileBase64: base64, fileType: file.type || 'application/pdf' };
      } else {
        const text = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = e => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsText(file);
        });
        body = { fileText: text };
      }
    }
    const response = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    clearInterval(iv);
    bar.classList.remove('show');
    if (data.error) { alert('Scan failed: ' + data.error); return; }
    document.getElementById('scan-meta').innerHTML = [
      { l: 'Tender ID', v: data.tenderId || (url ? url.split('/').pop() : 'From file') },
      { l: 'Category', v: data.category || 'Not specified' },
      { l: 'Deadline', v: data.deadline || 'Not specified' },
      { l: 'Est. value', v: data.value || 'Not specified' },
      { l: 'Buyer', v: data.buyer || 'Not specified' },
      { l: 'MSE quota', v: data.mseQuota || 'Not specified' },
    ].map(f => `<div class="meta-field"><div class="mf-l">${f.l}</div><div class="mf-v">${f.v}</div></div>`).join('');
    const reqs = data.requirements || OCR_REQS;
    scannedRequirements = reqs;
    document.getElementById('ocr-reqs').innerHTML = reqs.map(r => `
      <div class="req-row">
        <i class="ti ti-file-text" style="font-size:15px;color:var(--nv-m);flex-shrink:0"></i>
        <span>${r}</span>
      </div>`).join('');
    res.style.display = 'block';
  } catch (err) {
    clearInterval(iv);
    bar.classList.remove('show');
    alert('Error: ' + err.message);
  }
}

// ── CHECKLIST ─────────────────────────────────────────────────────────────────
function inferTag(name) {
  const n = name.toLowerCase();
  if (n.includes('udyam') || n.includes('msme') || n.includes('pan') || n.includes('aadhaar')) return 'Identity';
  if (n.includes('gst') || n.includes('tax') || n.includes('itr') || n.includes('income')) return 'Tax';
  if (n.includes('bank') || n.includes('cheque') || n.includes('guarantee') || n.includes('emd') || n.includes('cpbg')) return 'Finance';
  if (n.includes('iso') || n.includes('bis') || n.includes('quality') || n.includes('test certificate') || n.includes('sa8000')) return 'Quality';
  if (n.includes('integrity') || n.includes('ehs') || n.includes('compliance') || n.includes('terms') || n.includes('gtc') || n.includes('atc')) return 'Compliance';
  if (n.includes('price') || n.includes('boq') || n.includes('bid value') || n.includes('rate')) return 'Pricing';
  if (n.includes('registration') || n.includes('empanelment') || n.includes('nalco') || n.includes('experience')) return 'Eligibility';
  if (n.includes('warranty') || n.includes('delivery') || n.includes('supply')) return 'Supply';
  return 'Document';
}

function buildChecklistFromScan() {
  if (!scannedRequirements || scannedRequirements.length === 0) { go('checklist'); return; }
  CL_ITEMS.length = 0;
  scannedRequirements.forEach(req => {
    CL_ITEMS.push({ n: req, d: 'Required for this tender submission.', t: inferTag(req), s: 'pending' });
  });
  go('checklist');
  renderChecklist();
}

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
const valUploads = {};

function mockStatus(i) {
  return { s: 'pass', label: 'Valid · Verified', icon: 'ti-check' };
}

function renderValidator() {
  const noScan = document.getElementById('val-no-scan');
  const main = document.getElementById('val-main');
  if (!CL_ITEMS || CL_ITEMS.length === 0) {
    noScan.style.display = 'block';
    main.style.display = 'none';
    return;
  }
  noScan.style.display = 'none';
  main.style.display = 'block';
  const uploaded = Object.keys(valUploads).length;
  const total = CL_ITEMS.length;
  const pct = total ? Math.round(uploaded / total * 100) : 0;
  document.getElementById('val-count').textContent = `${uploaded} of ${total} uploaded`;
  document.getElementById('val-bar').style.width = pct + '%';
  document.getElementById('val-rows').innerHTML = CL_ITEMS.map((item, i) => {
    const up = valUploads[i];
    const st = up ? mockStatus(i) : null;
    return `
    <div class="doc-row" id="vrow-${i}">
      <i class="ti ti-file-text" style="font-size:19px;color:var(--nv-m);flex-shrink:0"></i>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:500">${item.n}</div>
        <div style="font-size:11px;color:var(--txm)">${up ? up.name : 'No file uploaded'}</div>
      </div>
      <div id="vstatus-${i}">
        ${up
          ? `<div class="${st.s === 'pass' ? 'vp' : 'vw'}"><i class="ti ${st.icon}"></i> ${st.label}</div>`
          : `<label class="btn btn-sm" style="cursor:pointer">
               <i class="ti ti-upload"></i> Upload
               <input type="file" accept=".pdf,.jpg,.jpeg,.png" style="display:none" onchange="handleValUpload(${i}, this)">
             </label>`
        }
      </div>
    </div>`;
  }).join('');
}

function handleValUpload(i, input) {
  const file = input.files[0];
  if (!file) return;
  document.getElementById(`vstatus-${i}`).innerHTML =
    `<span style="font-size:12px;color:var(--txm);display:flex;align-items:center;gap:6px"><div class="dot-loader"><span></span><span></span><span></span></div> Validating...</span>`;
  setTimeout(() => {
    valUploads[i] = { name: file.name };
    renderValidator();
  }, 1500);
}

function handleFiles(files) {}
function handleDrop(e) { e.preventDefault(); }

function submitBid() {
  const uploaded = Object.keys(valUploads).length;
  const total = CL_ITEMS.length;
  const score = total ? Math.round((uploaded / total) * 100) : 100;
  const tenderEl = document.querySelector('.mf-v');
  const tenderId = tenderEl ? tenderEl.textContent : 'Current Tender';
  document.getElementById('modal-tender-id').textContent = tenderId;
  document.getElementById('modal-docs').textContent = `${uploaded}/${total} passed`;
  document.getElementById('modal-score').textContent = score + '%';
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

// ── AI ADVISOR ────────────────────────────────────────────────────────────────
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
  const userMsg = document.createElement('div');
  userMsg.className = 'msg user';
  userMsg.textContent = q;
  wrap.appendChild(userMsg);
  const aiMsg = document.createElement('div');
  aiMsg.className = 'msg ai';
  aiMsg.innerHTML = `<div class="msg-sender"><i class="ti ti-robot"></i> GeM Advisor</div><div class="thinking"><div class="dot-loader"><span></span><span></span><span></span></div> Thinking...</div>`;
  wrap.appendChild(aiMsg);
  wrap.scrollTop = wrap.scrollHeight;
  chatHistory.push({ role: 'user', content: q });
  try {
    const res = await fetch('/api/advisor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: q, history: chatHistory })
    });
    const data = await res.json();
    const reply = data.reply || 'Sorry, I could not get a response. Please try again.';
    chatHistory.push({ role: 'assistant', content: reply });
    aiMsg.innerHTML = `<div class="msg-sender"><i class="ti ti-robot"></i> GeM Advisor</div>${reply.replace(/\n/g, '<br>')}`;
  } catch (e) {
    aiMsg.innerHTML = `<div class="msg-sender"><i class="ti ti-robot"></i> GeM Advisor</div>Connection error. Check your internet and try again.`;
  }
  wrap.scrollTop = wrap.scrollHeight;
}

// ── INIT ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderDash();
  renderChecklist();
  renderDigi();
  renderAlerts();
  renderValidator();
});
