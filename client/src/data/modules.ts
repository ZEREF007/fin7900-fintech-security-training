export interface Slide {
  title: string
  content: string // HTML string
  type?: 'info' | 'warning' | 'danger' | 'success'
}

export interface ModuleData {
  id: string
  number: number
  title: string
  subtitle: string
  icon: string
  color: string
  duration: string
  objectives: string[]
  heroImage: string
  heroStats: { value: string; label: string }[]
  slides: Slide[]
  keyTakeaways: string[]
  mcqs: { question: string; options: string[]; correct: number; explanation: string }[]
}

export const MODULES: ModuleData[] = [
  {
    id: 'mod1',
    number: 1,
    title: 'What is a Data Breach?',
    subtitle: 'An executive primer for non-technical managers',
    icon: '📖',
    color: 'from-blue-600 to-indigo-700',
    duration: '30 min',
    objectives: [
      'Define a data breach in FinTech context',
      'Identify the four types of breaches',
      'Understand what data attackers target',
      'Know the PDPO DPP1–DPP6 framework',
      'Understand why detection time matters',
      'Recognise dark web data valuations',
    ],
    heroImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80',
    heroStats: [
      { value: 'US$4.45M', label: 'Avg breach cost 2023 (IBM)' },
      { value: '277 days', label: 'Avg time to identify breach' },
      { value: '83%', label: 'Orgs breached more than once' },
      { value: '74%', label: 'Involve the human element' },
    ],
    slides: [
      {
        title: 'What is a Data Breach?',
        content: `<p>A <strong>data breach</strong> is any security incident in which <strong>sensitive, protected, or confidential information</strong> is accessed, disclosed, or stolen by an <strong>unauthorised party</strong>.</p>
        <p class="mt-3">This includes: names, passwords, credit card numbers, bank account details, transaction histories, and KYC documents.</p>
        <div class="info-box info-box-info mt-4 rounded-xl p-4"><strong>💡 For Digital Wallet Managers —</strong> Your app holds the most sensitive data imaginable — identity documents, payment credentials, biometrics, and financial histories. A breach is not just an IT problem; it is an <em>existential business risk</em>.</div>`,
      },
      {
        title: 'Types of Data Breaches',
        content: `<ul class="space-y-2">
          <li>🔴 <strong>External Attack</strong> — Hackers exploit technical vulnerabilities (~55% of incidents)</li>
          <li>🟠 <strong>Insider Threat</strong> — Malicious or negligent employees with system access (~20%)</li>
          <li>🟡 <strong>Accidental Disclosure</strong> — Misconfigured databases, wrong email recipients (~15%)</li>
          <li>🟤 <strong>Physical Theft</strong> — Stolen laptops, storage devices, paper records (~10%)</li>
        </ul>
        <div class="info-box info-box-warning mt-4 rounded-xl p-4">⚠️ All four types apply to wallet apps — connecting to payment networks, employing support staff, using cloud storage, and operating in shared offices.</div>`,
      },
      {
        title: 'What Data Do Attackers Want?',
        content: `<ul class="space-y-2">
          <li>🔑 <strong>Authentication credentials</strong> — usernames, passwords, PINs, OTPs</li>
          <li>💳 <strong>Payment card data</strong> — PAN, CVV, expiry ("fullz" sold for US$50–200 each)</li>
          <li>📋 <strong>KYC/identity documents</strong> — HKID, passport, selfie photos</li>
          <li>💰 <strong>Transaction histories</strong> — to enable targeted fraud</li>
          <li>📱 <strong>Device tokens</strong> — to hijack mobile sessions</li>
        </ul>
        <div class="info-box info-box-danger mt-4 rounded-xl p-4">🚨 <strong>Dark Web Reality</strong> — A complete "fullz" identity package sells for ~US$310 on dark web markets (Privacy Affairs, 2024).</div>`,
      },
      {
        title: "Hong Kong's PDPO Framework",
        content: `<ul class="space-y-2">
          <li>📌 <strong>DPP1</strong> — Collection limited to lawful, necessary purposes</li>
          <li>📌 <strong>DPP2</strong> — Data accurate and not retained longer than necessary</li>
          <li>📌 <strong>DPP3</strong> — Data only used for the original collection purpose</li>
          <li>📌 <strong>DPP4</strong> — <strong>Security obligations</strong> — all practicable steps to prevent unauthorised access</li>
          <li>📌 <strong>DPP5</strong> — Transparency — privacy policy must be available</li>
          <li>📌 <strong>DPP6</strong> — Individuals may access and correct their own data</li>
        </ul>
        <div class="info-box info-box-info mt-4 rounded-xl p-4">💡 <strong>DPP4 is most directly relevant to cybersecurity</strong> — it creates the legal obligation to implement security controls. A breach may trigger PCPD investigation and enforcement action.</div>`,
      },
      {
        title: 'The Breach Lifecycle',
        content: `<ol class="space-y-3 list-decimal list-inside">
          <li><strong>Initial Access</strong> — Attacker exploits a vulnerability or steals credentials</li>
          <li><strong>Lateral Movement</strong> — Attacker moves through systems to find valuable data</li>
          <li><strong>Data Exfiltration</strong> — Data is copied or transmitted to the attacker</li>
          <li><strong>Discovery</strong> — Breach is detected (often NOT by the victim organisation)</li>
          <li><strong>Containment</strong> — Affected systems are isolated</li>
          <li><strong>Notification</strong> — Regulators and customers are notified</li>
          <li><strong>Recovery</strong> — Systems are restored; forensic investigation begins</li>
        </ol>
        <div class="info-box info-box-warning mt-4 rounded-xl p-4">⏱ IBM (2024): Average 277 days to identify and contain a breach. The longer the dwell time, the higher the cost.</div>`,
      },
      {
        title: 'Why Detection Speed Matters',
        content: `<p>Every day an attacker remains undetected in your systems:</p>
        <ul class="space-y-2 mt-3">
          <li>📈 More data is stolen (more customers affected)</li>
          <li>🔓 More systems may be compromised</li>
          <li>💸 Regulatory fines increase with delayed notification</li>
          <li>📉 Reputational damage compounds</li>
          <li>🔍 Forensic evidence becomes harder to preserve</li>
        </ul>
        <div class="info-box info-box-success mt-4 rounded-xl p-4">✅ <strong>IBM (2024)</strong> — Organisations with automated breach detection reduced breach costs by an average of US$1.68M compared to organisations with manual detection only.</div>`,
      },
    ],
    keyTakeaways: [
      'A data breach is any incident of unauthorised access to sensitive, protected, or confidential information.',
      'Digital wallets are high-value targets because they aggregate identity, payment, and biometric data in one location.',
      'The four types of breaches are: external attack, insider threat, accidental disclosure, and physical theft.',
      "Hong Kong's PDPO DPP4 creates a legal obligation to implement security controls to protect personal data.",
      'Average breach detection time is 277 days — every day of undetected access increases total cost.',
      'Dark web "fullz" packages sell for ~US$310 — direct evidence of the commercial incentive to breach digital wallets.',
    ],
    mcqs: [
      {
        question: 'Which of the following is NOT a type of data breach?',
        options: ['External cyberattack by hackers','Accidental disclosure via misconfigured cloud storage','A planned system maintenance window','Insider threat by a disgruntled employee'],
        correct: 2,
        explanation: 'A planned system maintenance window is an authorised, intentional action and does not constitute a data breach. All other options involve unauthorised or unintended exposure of data.',
      },
      {
        question: 'Which PDPO Data Protection Principle is most directly relevant to cybersecurity obligations?',
        options: ['DPP1 — Purpose limitation','DPP3 — Use limitation','DPP4 — Data security','DPP5 — Openness'],
        correct: 2,
        explanation: 'DPP4 specifically requires data users to take "all practicable steps" to protect personal data from unauthorised or accidental access, processing, erasure, loss, or use — the core legal basis for cybersecurity obligations.',
      },
      {
        question: 'According to IBM (2024), what is the average time to identify and contain a data breach?',
        options: ['30 days','100 days','277 days','365 days'],
        correct: 2,
        explanation: 'IBM\'s 2024 Cost of a Data Breach Report found the average time to identify and contain a breach is 277 days. This extended dwell time significantly increases the total breach cost.',
      },
      {
        question: 'Which type of data most commonly held by digital wallets is uniquely valuable because it enables immediate financial fraud?',
        options: ['Users\' app preferences and settings','Full identity, payment credentials, and transaction histories combined','Users\' push notification history','App version and device model information'],
        correct: 1,
        explanation: 'Digital wallets uniquely aggregate full identity (KYC), payment credentials, and behavioural data — all needed for immediate financial fraud and identity theft. This combination is what makes them disproportionate attack targets.',
      },
      {
        question: 'Privacy Affairs (2024) reports a complete "fullz" identity package sells on dark web markets for approximately:',
        options: ['US$5','US$50','US$310','US$5,000'],
        correct: 2,
        explanation: 'A "fullz" package containing ID document, bank account, and credit card details sells for approximately US$310 — demonstrating the direct commercial incentive for attackers to target digital wallet platforms.',
      },
      {
        question: 'Under DPP4 of the PDPO, what are data users required to do regarding personal data security?',
        options: ['Notify the PCPD of all potential security risks annually','Take all practicable steps to protect personal data from unauthorised or accidental access','Hire certified cybersecurity professionals for all roles','Encrypt all data using government-approved algorithms'],
        correct: 1,
        explanation: 'DPP4 requires data users to take "all practicable steps" to ensure personal data is protected against unauthorised or accidental access, processing, erasure, loss, or use. The obligation is principles-based, not prescriptive.',
      },
      {
        question: 'In the data breach lifecycle, "lateral movement" refers to:',
        options: ['The attacker publicly disclosing stolen data','The attacker moving data to external servers','The attacker navigating through systems after initial access to reach more valuable targets','The company\'s IT team moving systems to a backup data centre'],
        correct: 2,
        explanation: 'Lateral movement is the attacker\'s navigation through internal systems after gaining initial access, expanding their foothold towards higher-value systems and data. It occurs before data exfiltration.',
      },
      {
        question: 'Which of the following represents about 55% of data breach incidents according to Module 1?',
        options: ['Insider threats','External attacks exploiting technical vulnerabilities','Accidental disclosures','Physical theft of devices'],
        correct: 1,
        explanation: 'External attacks exploiting technical vulnerabilities represent approximately 55% of data breach incidents — making them the most common type, though insider threats and accidental disclosures are significant contributors.',
      },
      {
        question: 'Why does IBM\'s data show that automated breach detection provides a significant cost advantage?',
        options: ['Automated detection tools are cheaper to maintain than human security teams','Automated detection reduces breach costs by US$1.68M on average by shortening dwell time','Automated detection eliminates the need for incident response planning','Automated detection prevents all breaches from occurring'],
        correct: 1,
        explanation: 'Automated detection tools identify breaches much faster than manual monitoring, reducing "dwell time" — the period attackers remain undetected. Shorter dwell time = less data stolen = lower total breach cost. IBM found this advantage averages US$1.68M per breach.',
      },
      {
        question: 'A digital wallet company discovers a breach has been ongoing for 60 days. Which factor was most directly responsible for the extended timeline?',
        options: ['The company did not have a privacy policy','There was no monitoring or detection capability in place — attackers were not identified based on suspicious behaviour','The company\'s password policy was too weak','The regulation did not require breach disclosure'],
        correct: 1,
        explanation: 'Extended breach dwell time is primarily caused by absence of detection and monitoring capabilities. Without Security Information and Event Management (SIEM) tools, anomaly detection, and real-time alerting, attackers can remain undetected for months.',
      },
    ],
  },
  {
    id: 'mod2',
    number: 2,
    title: 'Root Causes & Attack Vectors',
    subtitle: 'How attackers actually breach digital wallet systems',
    icon: '🔍',
    color: 'from-red-600 to-rose-700',
    duration: '35 min',
    objectives: [
      'Identify the top attack vectors targeting FinTech',
      'Understand phishing and social engineering techniques',
      'Recognise credential stuffing and brute force attacks',
      'Understand SQL injection and API vulnerabilities',
      'Know supply chain and insider threat risks',
      'Apply OWASP Top 10 to wallet app context',
    ],
    heroImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80',
    heroStats: [
      { value: '36%', label: 'Breaches via phishing (Verizon 2024)' },
      { value: '65%', label: 'People reuse passwords' },
      { value: '287 days', label: 'Avg dwell time (phishing breach)' },
      { value: 'US$4.88M', label: 'Avg cost of phishing breach' },
    ],
    slides: [
      {
        title: 'Attack Vector #1: Phishing & Social Engineering',
        content: `<p>Phishing is the #1 initial attack vector globally — <strong>36% of all breaches</strong> (Verizon DBIR 2024).</p>
        <ul class="space-y-2 mt-3">
          <li>📧 <strong>Phishing</strong> — mass emails impersonating trusted entities</li>
          <li>🎯 <strong>Spear Phishing</strong> — targeted attacks against specific individuals</li>
          <li>🐳 <strong>Whaling</strong> — targeting C-suite executives</li>
          <li>📱 <strong>Vishing</strong> — voice phishing via phone calls</li>
          <li>💬 <strong>Smishing</strong> — SMS-based phishing</li>
        </ul>
        <div class="info-box info-box-danger mt-4 rounded-xl p-4">🚨 Red flags: urgency, unusual requests, mismatched sender domains, links to unfamiliar sites. ALWAYS verify sensitive requests via an independent channel.</div>`,
      },
      {
        title: 'Attack Vector #2: Credential Stuffing',
        content: `<p>Attackers buy leaked username/password databases (billions available) and test them automatically against your login endpoint.</p>
        <ul class="space-y-2 mt-3">
          <li>🤖 Automated bots test thousands of credentials per second</li>
          <li>📡 Distributed across thousands of IPs to evade rate limiting</li>
          <li>🔄 Relies on ~65% of users reusing passwords across services</li>
        </ul>
        <div class="info-box info-box-warning mt-4 rounded-xl p-4">⚠️ Signature: High volume login failures from distributed IPs using valid email formats. Defences: rate limiting, CAPTCHA, device fingerprinting, MFA.</div>`,
      },
      {
        title: 'Attack Vector #3: SQL Injection',
        content: `<p>SQL injection occurs when user input is directly incorporated into database queries without sanitisation.</p>
        <pre class="bg-black/40 rounded-lg p-3 text-xs font-mono mt-3 overflow-x-auto">-- Vulnerable query:
SELECT * FROM users WHERE email='[INPUT]' AND pwd='[INPUT]'

-- Attacker input: ' OR 1=1 --
-- Results in: WHERE email='' OR 1=1 --' AND pwd=...
-- Returns ALL users!</pre>
        <div class="info-box info-box-success mt-4 rounded-xl p-4">✅ Fix: Use parameterised queries / prepared statements. Input is treated as data, never as executable code.</div>`,
      },
      {
        title: 'Attack Vector #4: API & Access Control Failures',
        content: `<p>OWASP API Security Top 10 identifies these as critical risks for FinTech apps:</p>
        <ul class="space-y-2 mt-3">
          <li>🔓 <strong>BOLA</strong> — Broken Object Level Authorisation (accessing other users' data by changing IDs)</li>
          <li>🔑 <strong>Broken Authentication</strong> — Weak token validation, JWT flaws</li>
          <li>📊 <strong>Excessive Data Exposure</strong> — API returns more data than the app displays</li>
          <li>⚡ <strong>Rate Limiting Missing</strong> — Enables brute force and credential stuffing</li>
        </ul>
        <div class="info-box info-box-danger mt-4 rounded-xl p-4">🚨 For digital wallets, BOLA is critical — can an authenticated user access another user's account balance just by changing an ID number in the request?</div>`,
      },
      {
        title: 'Attack Vector #5: Supply Chain & Cloud Misconfig',
        content: `<ul class="space-y-3">
          <li>🔗 <strong>Supply Chain Attacks</strong> — Compromising a trusted third-party vendor's product to attack downstream customers (SolarWinds 2020: 18,000+ organisations affected)</li>
          <li>☁️ <strong>Cloud Misconfiguration</strong> — Public S3 buckets, overly permissive IAM roles — #1 source of cloud breaches</li>
          <li>👥 <strong>Insider Threats</strong> — Malicious or negligent employees with legitimate access</li>
        </ul>
        <div class="info-box info-box-info mt-4 rounded-xl p-4">💡 AWS tip: Enable "Block Public Access" at the organisation level — prevents any bucket from being accidentally made public regardless of individual developer settings.</div>`,
      },
    ],
    keyTakeaways: [
      'Phishing is the #1 attack vector — 36% of all breaches start with a deceptive email or message.',
      'Credential stuffing automates testing of leaked passwords against your login endpoint — MFA defeats it.',
      'SQL injection is entirely preventable: use parameterised queries and prepared statements.',
      'BOLA (Broken Object Level Authorisation) is the #1 API security risk — always verify resource ownership.',
      'Supply chain attacks compromise trusted third-party vendors to reach downstream targets.',
      'Cloud misconfiguration (especially public storage buckets) is a leading source of accidental breaches.',
    ],
    mcqs: [
      {
        question: 'According to Verizon DBIR 2024, phishing and social engineering account for what percentage of all data breaches?',
        options: ['About 10%','About 36%','About 55%','About 80%'],
        correct: 1,
        explanation: 'Verizon\'s 2024 Data Breach Investigations Report identifies phishing and social engineering as the initial attack vector in approximately 36% of all data breaches — making it the single most common entry point.',
      },
      {
        question: 'A customer support agent gives their login credentials to someone claiming to be "IT support" over the phone. This is an example of:',
        options: ['SQL injection','Credential stuffing','Vishing (voice phishing / social engineering)','A brute force attack'],
        correct: 2,
        explanation: 'This is vishing — voice phishing — a form of social engineering where attackers impersonate trusted parties (IT support, banks, regulators) over the phone to extract credentials or sensitive information.',
      },
      {
        question: 'The OWASP API Security Top 10 risk where an attacker changes a customer ID in an API request to access another customer\'s account is called:',
        options: ['SQL injection','Broken Object Level Authorisation (BOLA)','Excessive data exposure','Server-side request forgery'],
        correct: 1,
        explanation: 'Broken Object Level Authorisation (BOLA) occurs when an API does not verify that the requesting user is authorised to access the specific object (e.g., account, record) being requested — allowing horizontal privilege escalation.',
      },
      {
        question: 'A developer accidentally sets an AWS S3 bucket containing customer KYC documents to "Public." How quickly can this typically be discovered by automated scanners?',
        options: ['Usually takes months — the internet is very large','Within hours of the misconfiguration being made','Only if the data is specifically searched for in Google','It cannot be discovered without insider knowledge'],
        correct: 1,
        explanation: 'Automated internet scanners continuously probe for publicly accessible cloud storage. A public S3 bucket can typically be found within hours of creation by security researchers and attackers alike — making rapid detection and prevention critical.',
      },
      {
        question: 'Which defence directly defeats credential stuffing attacks even if an attacker has the user\'s correct password?',
        options: ['Requiring longer passwords (16+ characters)','Regular password expiry (every 30 days)','Multi-Factor Authentication (MFA)','Whitelisting approved IP addresses'],
        correct: 2,
        explanation: 'MFA directly defeats credential stuffing because possession of the correct password alone is insufficient to authenticate. Credential stuffing relies entirely on reused passwords — MFA makes those passwords worthless without the second factor.',
      },
      {
        question: 'The SolarWinds attack (2020) is a prominent example of which attack type?',
        options: ['Phishing attack targeting SolarWinds employees','Supply chain attack — malicious code inserted into trusted software update','SQL injection attack against SolarWinds databases','Credential stuffing against SolarWinds customers'],
        correct: 1,
        explanation: 'The SolarWinds attack was a supply chain attack where adversaries inserted malicious code ("SUNBURST") into SolarWinds\' Orion software update pipeline. When 18,000+ organisations installed the trusted update, they installed the malware.',
      },
      {
        question: 'Which of the following CORRECTLY describes a parameterised query?',
        options: ['A query that accepts any input and runs it as-is in the database','A query template where user input is passed as a separate parameter, preventing it from being executed as code','A query that automatically encrypts database results','A query that only works with specific SQL database vendors'],
        correct: 1,
        explanation: 'A parameterised query (also called a prepared statement) separates the SQL code from the user input. The input is treated as data only — it cannot alter the query structure, completely preventing SQL injection.',
      },
      {
        question: 'In a credential stuffing attack, what data do the attackers start with?',
        options: ['Custom-generated password guesses based on target profiles','Leaked username/password databases from previous breaches at OTHER services','Passwords recovered by brute-force testing every combination','Information gathered from the target\'s publicly available social media profiles'],
        correct: 1,
        explanation: 'Credential stuffing attacks use databases of real username/password pairs leaked from previous breaches at other services. Attackers rely on password reuse — if a user\'s LinkedIn password was leaked, maybe that same password works on their digital wallet account.',
      },
      {
        question: 'Your digital wallet integrates a third-party biometric verification SDK. What is the MOST important vendor risk management step before integration?',
        options: ['Check the SDK\'s star rating on GitHub','Verify the vendor\'s security certifications (ISO 27001, SOC 2), data handling practices, and contractual security obligations','Test the SDK only in your development environment','Ask the vendor\'s sales team for a product demo'],
        correct: 1,
        explanation: 'HKMA SPM TM-G-1 requires vendor risk assessment before integration. Biometric data is among the most sensitive data types — the vendor\'s security certifications, data handling, breach notification commitments, and right-to-audit clauses are all essential due diligence requirements.',
      },
      {
        question: 'Which action by a legitimate employee would most likely constitute an insider threat that results in a data breach?',
        options: ['An employee uses the company\'s VPN to access internal systems remotely','An employee downloads all 200,000 customer records to their personal laptop without a valid business reason','An employee sets a strong, unique password for their work account','An employee reports a suspected phishing email to the security team'],
        correct: 1,
        explanation: 'Downloading bulk customer data to a personal device without a valid business reason is a classic insider data breach — even if the employee had legitimate system access. It violates the principle of least privilege and data minimisation under PDPO DPP1 and DPP4.',
      },
    ],
  },
  {
    id: 'mod3',
    number: 3,
    title: 'Business Impact Analysis',
    subtitle: 'Quantifying the true cost of data breaches',
    icon: '📊',
    color: 'from-amber-600 to-orange-700',
    duration: '30 min',
    objectives: [
      'Understand all components of breach costs',
      'Apply IBM cost analysis to FinTech scenarios',
      'Calculate regulatory fine exposure (PDPO, GDPR)',
      'Quantify reputational and customer churn impact',
      'Understand stock price and market cap effects',
      'Build a business case for security investment',
    ],
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80',
    heroStats: [
      { value: 'US$6.08M', label: 'Avg breach cost (Financial Services)' },
      { value: '39%', label: 'Cost from lost business' },
      { value: '87%', label: 'Customers who would stop using breached FinTech' },
      { value: '€20M', label: 'Max GDPR fine (or 4% global revenue)' },
    ],
    slides: [
      {
        title: 'The Four Cost Categories',
        content: `<p>IBM (2024) decomposes breach costs into four categories:</p>
        <div class="grid grid-cols-2 gap-3 mt-4">
          <div class="bg-red-950/50 border border-red-700/30 rounded-xl p-3">
            <div class="text-red-300 font-bold text-lg">39%</div>
            <div class="text-sm font-semibold text-white">Lost Business</div>
            <div class="text-xs text-slate-400">Customer churn, brand damage, revenue loss</div>
          </div>
          <div class="bg-orange-950/50 border border-orange-700/30 rounded-xl p-3">
            <div class="text-orange-300 font-bold text-lg">28%</div>
            <div class="text-sm font-semibold text-white">Detection & Escalation</div>
            <div class="text-xs text-slate-400">Forensic investigation, incident management</div>
          </div>
          <div class="bg-amber-950/50 border border-amber-700/30 rounded-xl p-3">
            <div class="text-amber-300 font-bold text-lg">27%</div>
            <div class="text-sm font-semibold text-white">Post-Breach Response</div>
            <div class="text-xs text-slate-400">Legal, credit monitoring, regulatory compliance</div>
          </div>
          <div class="bg-yellow-950/50 border border-yellow-700/30 rounded-xl p-3">
            <div class="text-yellow-300 font-bold text-lg">6%</div>
            <div class="text-sm font-semibold text-white">Notification Costs</div>
            <div class="text-xs text-slate-400">Customer communications, PCPD notification</div>
          </div>
        </div>`,
      },
      {
        title: 'Customer Trust Impact',
        content: `<p>PwC Global Consumer Insights Survey (2023) on FinTech breach response:</p>
        <ul class="space-y-3 mt-3">
          <li>😤 <strong>87%</strong> would stop using a FinTech service that mishandled their data</li>
          <li>😡 <strong>65%</strong> would not return even if compensated financially</li>
          <li>📢 <strong>72%</strong> would share negative reviews on social media</li>
          <li>🔍 <strong>44%</strong> would report the company to a regulator</li>
        </ul>
        <div class="info-box info-box-warning mt-4 rounded-xl p-4">⚠️ Customers do not distinguish between direct data misuse and "potential exposure." The mere news of a breach triggers churn — regardless of actual harm.</div>`,
      },
      {
        title: 'Regulatory Fine Exposure',
        content: `<table class="w-full text-sm mt-2 border-collapse">
          <thead><tr class="border-b border-slate-600">
            <th class="text-left py-2 text-slate-300">Framework</th>
            <th class="text-left py-2 text-slate-300">Maximum Penalty</th>
            <th class="text-left py-2 text-slate-300">Applies To</th>
          </tr></thead>
          <tbody class="text-slate-300">
            <tr class="border-b border-slate-700/50"><td class="py-2">GDPR (EU)</td><td class="py-2 text-red-400 font-bold">€20M or 4% global revenue</td><td class="py-2">Any org processing EU residents' data</td></tr>
            <tr class="border-b border-slate-700/50"><td class="py-2">PDPO (HK)</td><td class="py-2 text-amber-400 font-bold">HK$50,000 + imprisonment</td><td class="py-2">Data users handling HK resident data</td></tr>
            <tr class="border-b border-slate-700/50"><td class="py-2">HKMA</td><td class="py-2 text-orange-400 font-bold">Licence revocation</td><td class="py-2">Licensed payment service providers</td></tr>
            <tr><td class="py-2">PCI DSS</td><td class="py-2 text-yellow-400 font-bold">US$100K/month</td><td class="py-2">Any org processing payment cards</td></tr>
          </tbody>
        </table>
        <div class="info-box info-box-danger mt-4 rounded-xl p-4">🌏 An HK-based FinTech serving EU customers faces BOTH PDPO and GDPR — regulatory exposure is compounded.</div>`,
      },
      {
        title: 'Real World Cost Benchmarks',
        content: `<ul class="space-y-3">
          <li>💸 <strong>Equifax (2017)</strong> — US$702M settlement; share price fell 35% in 1 week</li>
          <li>💸 <strong>Capital One (2019)</strong> — US$190M class action + US$80M regulator fine</li>
          <li>💸 <strong>Medibank (2022)</strong> — AUD$250M remediation costs; share price fell 25%</li>
          <li>💸 <strong>British Airways (2019)</strong> — £20M GDPR fine; 500,000 customers affected</li>
          <li>💸 <strong>Meta/Facebook (2023)</strong> — €1.2B GDPR fine (largest ever)</li>
        </ul>
        <div class="info-box info-box-info mt-4 rounded-xl p-4">💡 Note: These figures exclude intangible costs — damaged brand equity, executive time diverted, and years of rebuilding customer trust.</div>`,
      },
      {
        title: 'The Expected Value Framework',
        content: `<p>How to build a security investment business case:</p>
        <pre class="bg-black/40 rounded-lg p-3 text-xs font-mono mt-3">Expected Annual Loss =
  Breach Probability (%) × Average Breach Cost

Example for a mid-size FinTech:
  15% probability × US$6M average cost
  = US$900K expected annual loss

Over 5 years = US$4.5M expected loss
↓
A HK$5M (≈US$640K) security investment
is ROI-positive in expected value terms.</pre>
        <div class="info-box info-box-success mt-4 rounded-xl p-4">✅ IBM (2024) identifies specific investments: Incident Response Plan saves US$2.66M/breach; Zero Trust saves US$2.22M/breach; SIEM saves US$1.68M/breach.</div>`,
      },
    ],
    keyTakeaways: [
      '"Lost business" (churn + brand damage) represents 39% of total breach costs — the largest single category.',
      'PwC (2023): 87% of customers would stop using a FinTech that mishandled their data; 65% would not return even if compensated.',
      'GDPR maximum fine: €20M or 4% of global annual revenue — applicable to any FinTech processing EU residents\' data.',
      'Financial services sector faces the highest average breach cost at US$6.08M (IBM 2024).',
      'Real-world breaches (Equifax, Capital One, Medibank) show stock price impacts of 25-35% within one week of disclosure.',
      'Expected value analysis: a 15% breach probability × US$6M average = US$900K/year expected loss — making security investment ROI-positive.',
    ],
    mcqs: [
      {
        question: 'According to IBM (2024), which component of data breach costs is consistently the LARGEST?',
        options: ['Detection and escalation costs','Post-breach response (legal, credit monitoring)','Lost business — customer churn and brand damage','Notification costs'],
        correct: 2,
        explanation: '"Lost business" — encompassing customer churn, brand damage remediation, and lost revenue — represents approximately 39% of total breach costs, consistently the largest category. For FinTech, where competitive advantage is trust, this proportion can be even higher.',
      },
      {
        question: 'What is the average data breach cost in the financial services sector according to IBM (2024)?',
        options: ['US$2.5M','US$4.45M','US$6.08M','US$10M'],
        correct: 2,
        explanation: 'IBM\'s 2024 Cost of a Data Breach Report identified the financial services sector as having the highest average breach cost at US$6.08M — reflecting the high value of financial data and the intense regulatory scrutiny of this sector.',
      },
      {
        question: 'Under GDPR Article 83, what is the maximum fine for serious infringements (e.g., inadequate security leading to a breach)?',
        options: ['€500,000','€5 million','€10 million or 2% of global revenue','€20 million or 4% of global revenue, whichever is higher'],
        correct: 3,
        explanation: 'GDPR Article 83(4) prescribes the highest penalty tier: €20 million OR 4% of total global annual turnover of the preceding year — whichever is HIGHER. For a growing FinTech, this can be company-threatening.',
      },
      {
        question: 'Equifax\'s 2017 breach resulted in their share price falling approximately how much in the week following disclosure?',
        options: ['5%','15%','35%','65%'],
        correct: 2,
        explanation: 'Equifax\'s share price fell approximately 35% in the week following its breach disclosure, wiping billions of dollars of market capitalisation. This is typical of major breaches — market participants price in expected regulatory fines, legal costs, and long-term revenue loss.',
      },
      {
        question: 'PwC (2023) found that what percentage of consumers would NOT return to a FinTech even if offered financial compensation after a breach?',
        options: ['15%','35%','65%','87%'],
        correct: 2,
        explanation: 'PwC Global Consumer Insights Survey (2023) found that 65% of consumers would not return to a FinTech that mishandled their data, even if offered financial compensation. This underscores that trust, once lost, is extremely difficult to rebuild financially.',
      },
      {
        question: 'An HK-based FinTech with EU customers suffers a breach. Which regulatory frameworks can BOTH impose penalties?',
        options: ['Only PDPO — GDPR applies only to EU-based companies','Only GDPR — PDPO only applies to physical breaches','Both PDPO (for HK residents\' data) and GDPR (for EU residents\' data) can apply simultaneously','Only PCI DSS — financial data breaches are handled exclusively by payment card regulators'],
        correct: 2,
        explanation: 'GDPR has extra-territorial scope — it applies to any organisation processing EU residents\' data regardless of where the company is based. PDPO simultaneously applies to HK resident data. Both can impose penalties concurrently for the same breach event.',
      },
      {
        question: 'In the expected value framework for security investment, if a company has a 15% annual breach probability and an expected breach cost of US$6M, what is the expected annual loss?',
        options: ['US$150,000','US$600,000','US$900,000','US$6,000,000'],
        correct: 2,
        explanation: '15% × US$6,000,000 = US$900,000 expected annual loss. This calculation demonstrates why security investment up to US$900K/year would be expected-value neutral, and investments in controls that reduce breach probability or severity are ROI-positive.',
      },
      {
        question: 'IBM (2024) identifies that having a tested Incident Response Plan saves approximately how much per breach on average?',
        options: ['US$250,000','US$1M','US$2.66M','US$5M'],
        correct: 2,
        explanation: 'IBM\'s 2024 data shows organisations with a tested Incident Response Plan save an average of US$2.66M per breach compared to organisations without one. This is one of the highest-ROI individual security investments identified.',
      },
      {
        question: 'Which of these best describes "reputational damage" as a breach cost category?',
        options: ['The cost of issuing press releases about the breach','Future revenue lost because customers and prospects lose confidence in the company\'s ability to protect their data','The cost of security consultants who assess the breach aftermath','The legal fees incurred defending the company against regulatory action'],
        correct: 1,
        explanation: 'Reputational damage encompasses future revenue loss from customer churn, reduced customer acquisition rates, and longer-term brand damage. For FinTech companies where the entire value proposition is data security, reputational damage can be the most financially significant long-term cost.',
      },
      {
        question: 'The PCI DSS standard primarily governs the security of which type of data?',
        options: ['Employee payroll records','Payment card data (cardholder data environment)','Government identification documents','Medical records'],
        correct: 1,
        explanation: 'PCI DSS (Payment Card Industry Data Security Standard) was created by major payment card brands (Visa, Mastercard, Amex) to govern the security of payment card data — specifically cardholder data including card numbers (PANs), CVVs, and expiry dates.',
      },
    ],
  },
  {
    id: 'mod4',
    number: 4,
    title: 'Mitigation Strategies',
    subtitle: 'Building a layered defence for digital wallet security',
    icon: '🛡️',
    color: 'from-emerald-600 to-teal-700',
    duration: '40 min',
    objectives: [
      'Implement a Zero Trust security architecture',
      'Apply the Principle of Least Privilege',
      'Deploy Multi-Factor Authentication effectively',
      'Understand encryption at rest and in transit',
      'Build and test an Incident Response Plan',
      'Apply HKMA CFI 2.0 compliance requirements',
    ],
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80',
    heroStats: [
      { value: 'US$2.22M', label: 'Saved per breach with Zero Trust (IBM)' },
      { value: 'US$2.66M', label: 'Saved per breach with tested IRP' },
      { value: 'US$500K', label: 'Saved per breach with MFA (IBM)' },
      { value: '29', label: 'Domains assessed in HKMA C-RAF' },
    ],
    slides: [
      {
        title: 'Layer 1: Zero Trust Architecture',
        content: `<p><strong>"Never trust, always verify"</strong> — assume breach by default and verify everything.</p>
        <ul class="space-y-2 mt-3">
          <li>🆔 <strong>Identity verification</strong> — every user authenticated, every time</li>
          <li>📱 <strong>Device health checks</strong> — only compliant devices granted access</li>
          <li>🔒 <strong>Least privilege access</strong> — minimum permissions for each role</li>
          <li>🕸️ <strong>Micro-segmentation</strong> — isolate systems to contain breaches</li>
          <li>📡 <strong>Continuous monitoring</strong> — detect anomalies in real time</li>
        </ul>
        <div class="info-box info-box-success mt-4 rounded-xl p-4">✅ IBM (2024): Mature Zero Trust implementation saves US$2.22M per breach on average.</div>`,
      },
      {
        title: 'Layer 2: Identity & Access Management (IAM)',
        content: `<ul class="space-y-3">
          <li>🔑 <strong>Principle of Least Privilege</strong> — only minimum access required for each role</li>
          <li>👥 <strong>Role-Based Access Control (RBAC)</strong> — permissions tied to job function, not individuals</li>
          <li>⏱ <strong>Just-In-Time Access</strong> — temporary elevated permissions for specific tasks</li>
          <li>📋 <strong>Access Reviews</strong> — quarterly reviews to remove unnecessary permissions</li>
          <li>🚫 <strong>Privileged Account Management</strong> — admin accounts used only for admin tasks, not daily work</li>
        </ul>
        <div class="info-box info-box-warning mt-4 rounded-xl p-4">⚠️ Capital One breach (2019): A single misconfigured IAM role in AWS allowed an attacker to access 100M+ customer records.</div>`,
      },
      {
        title: 'Layer 3: Multi-Factor Authentication (MFA)',
        content: `<p>MFA requires verification using ≥2 independent factors:</p>
        <ul class="space-y-2 mt-3">
          <li>🧠 <strong>Something you KNOW</strong> — password, PIN, security question</li>
          <li>📱 <strong>Something you HAVE</strong> — authenticator app OTP, hardware token (FIDO2/YubiKey)</li>
          <li>👁 <strong>Something you ARE</strong> — fingerprint, face ID, voice recognition</li>
        </ul>
        <div class="info-box info-box-success mt-4 rounded-xl p-4">✅ HKMA requires MFA for all internet-facing systems. IBM: MFA saves US$500K per breach. FIDO2/hardware tokens provide highest security; SMS OTP is weakest (vulnerable to SIM swapping).</div>`,
      },
      {
        title: 'Layer 4: Encryption Standards',
        content: `<table class="w-full text-sm border-collapse">
          <thead><tr class="border-b border-slate-600">
            <th class="text-left py-2 text-slate-300">Use Case</th>
            <th class="text-left py-2 text-slate-300">Standard</th>
            <th class="text-left py-2 text-slate-300">Notes</th>
          </tr></thead>
          <tbody class="text-slate-300">
            <tr class="border-b border-slate-700/50"><td class="py-2">Data at rest</td><td class="py-2 text-emerald-400">AES-256</td><td class="py-2">PCI DSS Req. 3 mandate</td></tr>
            <tr class="border-b border-slate-700/50"><td class="py-2">Data in transit</td><td class="py-2 text-emerald-400">TLS 1.2+</td><td class="py-2">All API/app traffic</td></tr>
            <tr class="border-b border-slate-700/50"><td class="py-2">Passwords</td><td class="py-2 text-emerald-400">bcrypt/Argon2</td><td class="py-2">One-way hashing, 10+ rounds</td></tr>
            <tr><td class="py-2">Card numbers</td><td class="py-2 text-emerald-400">Tokenisation</td><td class="py-2">Remove from scope where possible</td></tr>
          </tbody>
        </table>
        <div class="info-box info-box-danger mt-4 rounded-xl p-4">🚨 MD5 and SHA-1 are cryptographically broken — NEVER use for password storage or sensitive data. Base64 is encoding, NOT encryption.</div>`,
      },
      {
        title: 'Layer 5: Security Monitoring (SIEM)',
        content: `<p>Security Information and Event Management (SIEM) provides centralised log management and real-time threat detection.</p>
        <ul class="space-y-2 mt-3">
          <li>📊 Aggregates logs from all systems into an immutable, centralised repository</li>
          <li>🔔 Real-time alerting on suspicious patterns (bulk access at unusual hours, lateral movement)</li>
          <li>🕒 Minimum 12 months log retention (PCI DSS Req. 10.7)</li>
          <li>🤖 Correlation rules identify multi-stage attack patterns</li>
        </ul>
        <div class="info-box info-box-info mt-4 rounded-xl p-4">💡 IBM: SIEM/automated detection reduces average breach costs by US$1.68M vs manual detection by enabling faster identification and containment.</div>`,
      },
      {
        title: 'Layer 6: Incident Response Plan (IRP)',
        content: `<p>A documented, <em>tested</em> IRP is the highest-ROI security investment (IBM: saves US$2.66M/breach).</p>
        <ol class="space-y-1 mt-3 list-decimal list-inside text-sm">
          <li><strong>Preparation</strong> — Define team roles, procedures, communication templates, legal contacts</li>
          <li><strong>Detection</strong> — SIEM alerting, threat hunting, user reporting channels</li>
          <li><strong>Containment</strong> — Isolate affected systems while preserving forensic evidence</li>
          <li><strong>Eradication</strong> — Remove attacker access and malware from all systems</li>
          <li><strong>Recovery</strong> — Restore systems from clean backups; verify integrity</li>
          <li><strong>Notification</strong> — Regulators (PCPD, HKMA), affected customers, public disclosure</li>
        </ol>`,
      },
    ],
    keyTakeaways: [
      'Zero Trust ("never trust, always verify") saves US$2.22M per breach on average — assume breach by default.',
      'The Principle of Least Privilege limits "blast radius" — one compromised account should not provide access to everything.',
      'MFA directly defeats credential stuffing and phishing credential theft — the #1 and #2 attack vectors.',
      'AES-256 for data at rest, TLS 1.2+ for data in transit, bcrypt/Argon2 for passwords — never use MD5, SHA-1, or Base64 for security.',
      'SIEM with 12-month log retention enables forensic investigation and reduces breach cost by US$1.68M on average.',
      'A tested Incident Response Plan is the single highest-ROI security investment (US$2.66M saved per breach).',
    ],
    mcqs: [
      {
        question: 'The Zero Trust security model is based on which core principle?',
        options: ['Trust users inside the corporate network; only verify remote connections','Assume every user, device, and request is potentially hostile — never trust, always verify','Focus all security investment on perimeter firewalls and VPNs','All employees must have zero digital access to company systems by default'],
        correct: 1,
        explanation: '"Never trust, always verify" — Zero Trust assumes breach by default and requires continuous verification of every user, device, application, and network flow regardless of network location. Traditional perimeter security failed when attackers gained initial access.',
      },
      {
        question: 'The Principle of Least Privilege states that:',
        options: ['All employees should have the least possible salary','Security controls should be minimal to avoid hampering productivity','Every user, system, or application should only have the minimum access needed for their specific function','Only privileged users (administrators) should be allowed internet access'],
        correct: 2,
        explanation: 'Least Privilege limits the "blast radius" of any security incident. If an account is compromised, an attacker can only access what that account could access — not everything. Applied consistently, it means a support agent\'s compromise cannot reach production databases.',
      },
      {
        question: 'Which MFA factor type is MOST resistant to SIM swapping attacks?',
        options: ['SMS one-time passwords (OTPs) sent to your mobile number','Email verification codes','FIDO2 hardware security keys (e.g., YubiKey)','Security questions ("What was your first pet\'s name?")'],
        correct: 2,
        explanation: 'FIDO2 hardware security keys (YubiKey, etc.) are resistant to phishing, SIM swapping, and man-in-the-middle attacks because they use public key cryptography tied to the specific website\'s domain. SMS OTP is the weakest MFA factor due to SIM swapping vulnerability.',
      },
      {
        question: 'PCI DSS v4.0 requires which encryption standard for stored payment card data?',
        options: ['AES-128','AES-256','3DES','RSA-2048'],
        correct: 1,
        explanation: 'PCI DSS v4.0 Requirement 3 mandates AES-256 for stored cardholder data. Tokenisation (replacing card numbers with non-sensitive tokens) is also required where possible to minimise the cardholder data environment (CDE) scope.',
      },
      {
        question: 'What does the HKMA\'s Cybersecurity Resilience Assessment Framework (C-RAF) assess?',
        options: ['Employee password strength across an organisation','An institution\'s cybersecurity maturity across 29 domains using a structured, tiered framework','The market capitalisation of cybersecurity vendors in Hong Kong','An organisation\'s compliance with GDPR requirements'],
        correct: 1,
        explanation: 'C-RAF (part of HKMA CFI 2.0) provides a structured assessment of an institution\'s cybersecurity posture across 29 domains, producing a maturity rating. Institutions are assigned to one of three benchmark tiers based on systemic importance and operational risk profile.',
      },
      {
        question: 'According to the NIST Incident Response Framework, what is the FIRST operational step when a breach is detected?',
        options: ['Notify the PCPD immediately','Delete affected files to prevent further data loss','Contain the breach by isolating affected systems while preserving forensic evidence','Issue a public statement to prevent media speculation'],
        correct: 2,
        explanation: 'NIST IR phases: Preparation → Detection/Analysis → Containment → Eradication → Recovery → Post-Incident Activity. Containment is the first operational step — stopping ongoing damage while preserving evidence. Notification follows after initial assessment of scope.',
      },
      {
        question: 'Which password storage approach is currently recommended for FinTech applications?',
        options: ['MD5 hashing (fast and widely supported)','SHA-1 hashing','Base64 encoding for easy reversibility','bcrypt or Argon2 with sufficient work factor/cost parameter'],
        correct: 3,
        explanation: 'bcrypt and Argon2 are purpose-designed password hashing functions that are computationally expensive — making brute-force attacks impractical. MD5 and SHA-1 are cryptographically broken and can be reversed for many common passwords using rainbow tables. Base64 is merely encoding, not hashing.',
      },
      {
        question: 'What is the minimum log retention period required by PCI DSS for audit logs?',
        options: ['30 days','90 days','6 months','12 months (with 3 months immediately available)'],
        correct: 3,
        explanation: 'PCI DSS Requirement 10.7 specifies that audit logs must be retained for at least 12 months, with at least the most recent 3 months available for immediate analysis. This enables forensic investigation of breaches that may have begun months before discovery.',
      },
      {
        question: 'IBM (2024) data shows which security investment saves the MOST per data breach?',
        options: ['Antivirus software upgrade','Employee security awareness training','Tested Incident Response Plan ($2.66M saved per breach)','Firewall hardware upgrade'],
        correct: 2,
        explanation: 'IBM\'s 2024 analysis found that having a tested Incident Response Plan saves an average of US$2.66M per breach — the highest-ROI individual investment. Zero Trust saves US$2.22M; MFA saves US$500K; SIEM saves US$1.68M.',
      },
      {
        question: 'What is "micro-segmentation" in a Zero Trust architecture?',
        options: ['Dividing employees into small security training groups','Splitting network/systems into isolated zones so that a breach in one zone cannot automatically spread to others','Encrypting data in small chunks for extra security','Applying security patches in small batches to minimise disruption'],
        correct: 1,
        explanation: 'Micro-segmentation isolates systems, applications, and data into granular zones with separate access controls. Even after gaining initial access, an attacker cannot automatically reach all other systems — they would need to re-authenticate for each segment, limiting lateral movement and blast radius.',
      },
    ],
  },
  {
    id: 'mod5',
    number: 5,
    title: 'Case Studies & Lessons Learned',
    subtitle: 'Real-world breaches and what FinTechs can learn from them',
    icon: '📋',
    color: 'from-purple-600 to-violet-700',
    duration: '35 min',
    objectives: [
      'Analyse the Equifax breach and root causes',
      'Understand the Capital One cloud misconfiguration',
      'Study the Medibank ransomware incident',
      'Apply lessons learned to digital wallet context',
      'Map case study failures to mitigation controls',
      'Build a prioritised action roadmap',
    ],
    heroImage: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&q=80',
    heroStats: [
      { value: '147M', label: 'Records exposed (Equifax)' },
      { value: '106M', label: 'Records exposed (Capital One)' },
      { value: '9.7M', label: 'Records exposed (Medibank)' },
      { value: 'US$702M', label: 'Equifax settlement cost' },
    ],
    slides: [
      {
        title: 'Case Study 1: Equifax (2017)',
        content: `<div class="space-y-3">
          <div class="bg-red-950/50 border border-red-700/30 rounded-xl p-3">
            <div class="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Root Cause</div>
            <p class="text-sm">An unpatched Apache Struts vulnerability (CVE-2017-5638). Equifax was warned by US-CERT to patch it within 48 hours. It remained unpatched for 78 days. Attackers exploited it to gain access to 51 internal databases.</p>
          </div>
          <div class="bg-orange-950/50 border border-orange-700/30 rounded-xl p-3">
            <div class="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Key Failures</div>
            <ul class="text-sm space-y-1">
              <li>❌ Patch management failure — critical patch ignored for 78 days</li>
              <li>❌ No network segmentation — access to 51 databases from one entry point</li>
              <li>❌ Unencrypted data at rest in multiple databases</li>
              <li>❌ Inspection certificate expired — encrypted traffic not monitored</li>
            </ul>
          </div>
          <div class="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-3">
            <div class="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Lessons → Wallet Controls</div>
            <p class="text-sm">Urgent patching within 24–48 hours; network micro-segmentation; AES-256 encryption at rest; certificate management processes.</p>
          </div>
        </div>`,
      },
      {
        title: 'Case Study 2: Capital One (2019)',
        content: `<div class="space-y-3">
          <div class="bg-red-950/50 border border-red-700/30 rounded-xl p-3">
            <div class="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Root Cause</div>
            <p class="text-sm">AWS Web Application Firewall (WAF) misconfiguration. An attacker sent a crafted request that exploited a Server-Side Request Forgery (SSRF) vulnerability, then used a misconfigured IAM role to access S3 buckets containing 106M+ customer records.</p>
          </div>
          <div class="bg-orange-950/50 border border-orange-700/30 rounded-xl p-3">
            <div class="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Key Failures</div>
            <ul class="text-sm space-y-1">
              <li>❌ Overly permissive IAM role (violated Least Privilege)</li>
              <li>❌ WAF not configured to block SSRF attacks</li>
              <li>❌ Insufficient monitoring — breach ran undetected for 4+ months</li>
              <li>❌ Discovered by an external researcher, not internal monitoring</li>
            </ul>
          </div>
          <div class="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-3">
            <div class="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Lessons → Wallet Controls</div>
            <p class="text-sm">Strict IAM Least Privilege reviews; WAF with SSRF protections; SIEM real-time alerting; regular cloud configuration audits.</p>
          </div>
        </div>`,
      },
      {
        title: 'Case Study 3: Medibank (2022)',
        content: `<div class="space-y-3">
          <div class="bg-red-950/50 border border-red-700/30 rounded-xl p-3">
            <div class="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Root Cause</div>
            <p class="text-sm">Stolen VPN credentials (no MFA on VPN). Attacker accessed 9.7M patient records. When Medibank refused ransom payment, attackers published sensitive data (mental health diagnoses, HIV status) progressively on dark web forums.</p>
          </div>
          <div class="bg-orange-950/50 border border-orange-700/30 rounded-xl p-3">
            <div class="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Key Failures</div>
            <ul class="text-sm space-y-1">
              <li>❌ No MFA on VPN — stolen password = full access</li>
              <li>❌ No data classification — all data equally accessible</li>
              <li>❌ No behavioural detection — large data export not flagged</li>
              <li>❌ Insufficient encryption on patient records</li>
            </ul>
          </div>
          <div class="bg-emerald-950/50 border border-emerald-700/30 rounded-xl p-3">
            <div class="text-xs text-emerald-400 font-bold uppercase tracking-wider mb-1">Lessons → Wallet Controls</div>
            <p class="text-sm">MFA on ALL remote access; data classification and tiered access; DLP to alert on bulk exports; encryption of all sensitive fields.</p>
          </div>
        </div>`,
      },
      {
        title: 'Mapping Failures to Controls',
        content: `<table class="w-full text-xs border-collapse">
          <thead><tr class="border-b border-slate-600">
            <th class="text-left py-2 text-slate-300">Breach</th>
            <th class="text-left py-2 text-slate-300">Core Failure</th>
            <th class="text-left py-2 text-slate-300">Control That Would Have Prevented It</th>
          </tr></thead>
          <tbody class="text-slate-300">
            <tr class="border-b border-slate-700/50"><td class="py-2">Equifax</td><td class="py-2">Unpatched vulnerability</td><td class="py-2">72-hour critical patch SLA</td></tr>
            <tr class="border-b border-slate-700/50"><td class="py-2">Equifax</td><td class="py-2">No segmentation</td><td class="py-2">Network micro-segmentation</td></tr>
            <tr class="border-b border-slate-700/50"><td class="py-2">Capital One</td><td class="py-2">IAM over-permission</td><td class="py-2">Least Privilege + quarterly access reviews</td></tr>
            <tr class="border-b border-slate-700/50"><td class="py-2">Capital One</td><td class="py-2">No real-time detection</td><td class="py-2">SIEM with 24/7 alerting</td></tr>
            <tr class="border-b border-slate-700/50"><td class="py-2">Medibank</td><td class="py-2">No MFA on VPN</td><td class="py-2">MFA on all remote access</td></tr>
            <tr><td class="py-2">Medibank</td><td class="py-2">Bulk export not detected</td><td class="py-2">Data Loss Prevention (DLP) rules</td></tr>
          </tbody>
        </table>`,
      },
      {
        title: 'Your Prioritised Action Roadmap',
        content: `<div class="space-y-2">
          <div class="flex items-start gap-3 bg-red-950/40 border border-red-700/30 rounded-xl p-3">
            <span class="text-red-400 font-bold text-xs shrink-0">IMMEDIATE<br/>(0–30 days)</span>
            <ul class="text-xs space-y-1">
              <li>• Enable MFA on ALL staff accounts and remote access tools</li>
              <li>• Audit and remediate overly permissive IAM roles in cloud environments</li>
              <li>• Verify critical patch SLA is ≤ 48 hours; patch any current open criticals</li>
            </ul>
          </div>
          <div class="flex items-start gap-3 bg-orange-950/40 border border-orange-700/30 rounded-xl p-3">
            <span class="text-orange-400 font-bold text-xs shrink-0">SHORT-TERM<br/>(30–90 days)</span>
            <ul class="text-xs space-y-1">
              <li>• Deploy SIEM with real-time alerting; set 12-month log retention</li>
              <li>• Implement network micro-segmentation to isolate customer data</li>
              <li>• Write and table-top test an Incident Response Plan</li>
            </ul>
          </div>
          <div class="flex items-start gap-3 bg-emerald-950/40 border border-emerald-700/30 rounded-xl p-3">
            <span class="text-emerald-400 font-bold text-xs shrink-0">ONGOING</span>
            <ul class="text-xs space-y-1">
              <li>• Quarterly IAM access reviews and privilege certifications</li>
              <li>• Annual penetration testing and red team exercises (HKMA iCAST)</li>
              <li>• Monthly security awareness training for all staff</li>
            </ul>
          </div>
        </div>`,
      },
    ],
    keyTakeaways: [
      'Equifax (2017): 147M records exposed due to a single unpatched vulnerability left open for 78 days — patch management is non-negotiable.',
      'Capital One (2019): 106M records exposed via a misconfigured IAM role — Least Privilege and cloud configuration audits are essential.',
      'Medibank (2022): 9.7M records stolen via stolen VPN credentials — MFA on all remote access is the baseline control.',
      'Common thread across all three breaches: a single preventable control failure cascaded into catastrophic loss of data.',
      'The mapping exercise shows that every major breach could have been prevented — these are not sophisticated, inevitable attacks.',
      'Prioritised roadmap: MFA immediately (0 days), SIEM and IRP in 90 days, ongoing quarterly reviews and annual penetration testing.',
    ],
    mcqs: [
      {
        question: 'In the Equifax (2017) breach, what was the root cause?',
        options: ['A phishing attack targeting Equifax executives','An unpatched Apache Struts vulnerability that was not addressed for 78 days after a warning','A rogue insider employee who downloaded customer records','A supply chain attack through a third-party data provider'],
        correct: 1,
        explanation: 'Equifax was warned by US-CERT to patch the Apache Struts vulnerability (CVE-2017-5638) within 48 hours. The patch remained unapplied for 78 days, during which attackers exploited it to access 51 internal databases containing 147M records.',
      },
      {
        question: 'The Capital One (2019) breach was primarily caused by:',
        options: ['Weak customer passwords enabling account takeover','An overly permissive AWS IAM role combined with a WAF misconfiguration that allowed SSRF exploitation','A phishing email sent to Capital One\'s CEO','Malware installed through a compromised software update'],
        correct: 1,
        explanation: 'Capital One\'s breach resulted from two compounding failures: a Web Application Firewall misconfiguration allowed a Server-Side Request Forgery (SSRF) attack, which the attacker then combined with an overly permissive IAM role to access S3 buckets containing 106M+ customer records — a classic Least Privilege violation.',
      },
      {
        question: 'The Medibank (2022) attack began with:',
        options: ['A zero-day exploit in Medibank\'s custom software','Stolen VPN credentials with no MFA in place','A SQL injection attack against Medibank\'s patient portal','A physical theft of server hardware from a data centre'],
        correct: 1,
        explanation: 'The Medibank breach began with stolen VPN credentials — because there was no MFA on the VPN, stolen credentials alone provided full access. This allowed attackers to move laterally and access 9.7M patient records, which were subsequently published on dark web forums after Medibank refused ransom.',
      },
      {
        question: 'In the Equifax breach, why was the fact that one vulnerability provided access to 51 databases particularly significant?',
        options: ['It showed that all 51 databases contained identical data','It demonstrated a critical failure of network segmentation — the attacker could move laterally from a single entry point to access all databases','It proved that encryption is unnecessary for large databases','It showed that the breach was conducted by a nation-state actor'],
        correct: 1,
        explanation: 'Access to 51 databases from a single entry point demonstrates a catastrophic failure of network micro-segmentation. Proper segmentation would have isolated each database/system so that compromising one entry point would not automatically provide access to all others.',
      },
      {
        question: 'Medibank (2022) is particularly notable because after the breach, the attacker:',
        options: ['Quietly sold the data to other criminal organisations without public disclosure','Progressively published highly sensitive patient data (mental health diagnoses, HIV status) on dark web forums when ransom was refused','Returned all the data after receiving a private settlement','Used the data to create fraudulent insurance claims'],
        correct: 1,
        explanation: 'Medibank\'s breach escalated because the company refused to pay the ransom demand. In retaliation, the attacker progressively published sensitive patient data — including mental health diagnoses and HIV status — on dark web forums, causing severe ongoing harm to individuals. This illustrates why data classification and selective encryption of the most sensitive fields is critical.',
      },
      {
        question: 'Based on the case study mapping exercise, which single control would have prevented BOTH the Medibank breach and most credential theft-based attacks?',
        options: ['AES-256 encryption of all databases','Multi-Factor Authentication (MFA) on all remote access systems','Network firewall upgrade','Monthly security awareness training'],
        correct: 1,
        explanation: 'MFA on all remote access (VPN, admin systems) directly defeats attacks that begin with stolen credentials — which is the initial access method in Medibank and in a very large proportion of all breaches. Even with valid stolen credentials, an attacker cannot authenticate without the second factor.',
      },
      {
        question: 'The Capital One breach went undetected for over 4 months. What monitoring control would most have reduced this dwell time?',
        options: ['Stronger password policies for Capital One employees','SIEM with real-time alerting for anomalous data access patterns (large queries at unusual times, unexpected data movements)','More frequent penetration testing','Stricter customer data entry validation'],
        correct: 1,
        explanation: 'Capital One\'s breach was eventually discovered by an external security researcher, not by Capital One\'s own monitoring. SIEM with real-time anomaly detection would have flagged the unusual data access patterns associated with the attacker\'s reconnaissance and exfiltration activities, enabling earlier detection and containment.',
      },
      {
        question: 'Which of the following is the correct sequence for addressing security gaps, based on the Module 5 prioritised action roadmap?',
        options: ['Annual penetration testing → SIEM deployment → MFA rollout → IAM audit','MFA immediately + IAM audit (0–30 days), then SIEM and IRP (30–90 days), then ongoing review and testing','Write IRP first → patch management → SIEM → MFA last','Begin with annual penetration testing to identify all gaps before implementing any controls'],
        correct: 1,
        explanation: 'The roadmap prioritises controls that prevent the most common, highest-impact breach entry points first: MFA and IAM audit (0–30 days) address the specific failures in Medibank and Capital One immediately. SIEM and IRP (30–90 days) address detection and response. Ongoing activities sustain and improve the programme.',
      },
      {
        question: 'The common thread across Equifax, Capital One, and Medibank\'s breaches is best described as:',
        options: ['All three involved highly sophisticated nation-state attacks that were essentially impossible to prevent','All three involved preventable control failures — a single missed patch, a misconfigured IAM role, and missing MFA','All three resulted from insider threats by malicious employees','All three involved zero-day exploits that were previously unknown to the security community'],
        correct: 1,
        explanation: 'Despite their different technical mechanisms, all three breaches shared a common characteristic: each was the result of a single preventable control failure. Equifax: a known vulnerability not patched for 78 days. Capital One: a misconfigured IAM role violating Least Privilege. Medibank: no MFA on VPN access. None required sophisticated attacks.',
      },
      {
        question: 'A digital wallet company suffers a breach where an attacker exported all customer data. Post-breach forensic analysis reveals the export was not flagged despite occurring over 3 days. Which control\'s absence allowed this exfiltration to go undetected?',
        options: ['Firewall missing on the external network perimeter','Data Loss Prevention (DLP) rules and SIEM anomaly detection that would have flagged bulk data movement','Insufficient password complexity requirements','Lack of customer-facing two-factor authentication'],
        correct: 1,
        explanation: 'Data Loss Prevention (DLP) tools monitor and restrict movement of sensitive data, and SIEM anomaly detection would flag bulk export behaviour (unusual query volume, large data transfers at atypical times) as suspicious. This is the direct lesson from the Medibank case, where no DLP/behavioural detection was in place.',
      },
    ],
  },
]
