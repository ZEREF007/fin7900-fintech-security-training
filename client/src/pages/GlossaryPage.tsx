import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, BookOpen, Tag } from 'lucide-react'
import clsx from 'clsx'
import QuickTips from '../components/QuickTips'

const GLOSSARY_TIPS = [
  'Pick three terms from this page that you did not know before today and share them with a colleague',
  'Search for "phishing" in the glossary and read the example. Then check: does your organisation have a procedure for reporting suspicious emails?',
  'Look up "MFA" and "encryption" to understand the two controls that provide the biggest security improvement for the smallest effort',
  'If you see a term in a news article about a cyber attack, come back here to look it up so you understand what really happened',
  'Share the "Data Breach" definition with your team during your next meeting. The clearer people are on what counts as a breach, the faster they report it',
]

interface Term {
  term: string
  tags: string[]
  module: string
  definition: string
  example?: string
}

const TERMS: Term[] = [
  {
    term: 'Data Breach',
    tags: ['concept'], module: 'Module 1',
    definition: 'Think of it as someone breaking into your office filing cabinet, photocopying every customer file, and walking out unnoticed. A data breach is any incident where private information is seen, copied, or stolen by someone who should not have it — whether by an outside hacker, a rogue employee, or simply a mistake.',
    example: 'A hacker steals 500,000 customer records from a digital wallet database — names, passwords, bank details — and sells them online.',
  },
  {
    term: 'PDPO',
    tags: ['regulation', 'hk'], module: 'Module 1',
    definition: "Hong Kong's rule book for personal data. Just like food hygiene laws tell restaurants how to handle ingredients safely, the Personal Data (Privacy) Ordinance tells every organisation in HK how they must collect, store, use, and protect people's personal information. Breaking it can lead to fines or criminal charges.",
    example: 'A company collecting customer ID card numbers must tell customers why it needs them — and cannot use that data for a different purpose without permission.',
  },
  {
    term: 'DPP4',
    tags: ['regulation', 'hk'], module: 'Module 1',
    definition: "Data Protection Principle 4 is the PDPO's 'lock your door' rule. It requires organisations to take all practical steps to stop personal data being accessed, changed, deleted, or leaked without permission. If you store people's information, you must protect it properly.",
    example: "Storing customer passwords in plain text (not encrypted) would likely violate DPP4 if a breach later exposes them.",
  },
  {
    term: 'PCPD',
    tags: ['regulation', 'hk'], module: 'Module 1',
    definition: "The Privacy Commissioner for Personal Data is like the referees of Hong Kong's data privacy game. It is an independent government body that makes sure organisations follow the PDPO rules. It can investigate complaints, audit companies, and issue enforceable orders.",
    example: 'After a major customer data breach, a FinTech company must notify and co-operate with the PCPD investigation.',
  },
  {
    term: 'GDPR',
    tags: ['regulation'], module: 'Module 3',
    definition: "Europe's strict privacy law — and it has a very long arm. Even if your company is based in Hong Kong, if you handle data of European customers you must follow GDPR. Think of it as the EU saying: 'Our citizens' data is protected wherever it travels.' Fines can reach €20 million or 4% of your global revenue.",
    example: "A Hong Kong digital wallet with EU customers must report a data breach to European regulators within 72 hours — even if the company has no office in Europe.",
  },
  {
    term: 'PCI DSS',
    tags: ['regulation', 'technology'], module: 'Module 4',
    definition: "The Payment Card Industry's safety checklist — think of it like a hygiene rating for any organisation that handles credit or debit card data. If your platform processes card payments, you must pass this standard. It covers 12 areas including encryption, network security, and regular testing.",
    example: 'Under PCI DSS, all stored card numbers must be encrypted with AES-256 — storing them in plain text is a serious violation.',
  },
  {
    term: 'HKMA',
    tags: ['regulation', 'hk'], module: 'Module 4',
    definition: "The Hong Kong Monetary Authority is like the health inspector for financial companies in HK. It oversees banks, digital payment operators, and stored value facilities. If you run a digital wallet or payment platform, the HKMA sets the cybersecurity and operational rules you must follow.",
    example: "Digital wallets in HK need an SVF licence from the HKMA — without it, your platform cannot legally hold customers' money.",
  },
  {
    term: 'CFI 2.0',
    tags: ['regulation', 'hk'], module: 'Module 5',
    definition: "The HKMA's Cybersecurity Fortification Initiative 2.0 is like an annual report card for how well a bank or FinTech defends itself from hackers. It includes a self-assessment framework, simulated real-world cyberattack testing, and a push to raise cyber skills across the industry.",
    example: "An SVF licence holder must complete HKMA's cyber maturity self-assessment — showing how strong their defences actually are, not just claiming they are fine.",
  },
  {
    term: 'SVF',
    tags: ['regulation', 'hk'], module: 'Module 1',
    definition: "A Stored Value Facility is any digital product that lets you top up money and spend it later — like a digital wallet or prepaid card. In Hong Kong, running one legally requires an SVF licence from the HKMA. Without it, you are operating an unlicensed financial institution.",
    example: "An app that lets users load HK$500 and pay at merchants is acting as an SVF — it must be licensed.",
  },
  {
    term: 'Phishing',
    tags: ['attack'], module: 'Module 2',
    definition: "A digital con trick. An attacker sends you an email that looks like it's from your bank, your boss, or a trusted government body. The goal is to trick you into clicking a fake link and entering your password — or calling a fake number. Spear phishing is the same trick but tailored personally to you using information the attacker already knows about you.",
    example: "An email appearing to come from HKMA asks staff to 'verify their system credentials' via a link. The link goes to a fake login page that steals their passwords.",
  },
  {
    term: 'Credential Stuffing',
    tags: ['attack'], module: 'Module 2',
    definition: "People reuse passwords across websites. Attackers know this. They take lists of millions of username-and-password combinations stolen from previous breaches elsewhere and automatically try them on your platform. It is like a thief who stole a key ring and is trying every key on every door in the city.",
    example: "50,000 login attempts per hour across your platform from scattered global IPs — each using a different email and password from a leaked database elsewhere.",
  },
  {
    term: 'SQL Injection',
    tags: ['attack', 'technology'], module: 'Module 2',
    definition: "Most apps talk to their database using a language called SQL. SQL Injection is like slipping a forged note into that conversation. An attacker types special characters into a login or search field that tricks the database into thinking it received a legitimate command — and it obeys, handing over data it should never share.",
    example: "Typing a specific character sequence into a login box can sometimes trick a poorly built system into logging you in without a password.",
  },
  {
    term: 'BOLA',
    tags: ['attack', 'technology'], module: 'Module 2',
    definition: "Broken Object Level Authorisation is the top API security risk. Imagine a hotel where every room uses a different door number in the URL. BOLA happens when the system does not check 'does this person own room 202?' — so you can change the number in the address bar and view anyone else's private account data.",
    example: "Changing /api/accounts/1001/balance to /api/accounts/1002/balance and seeing another customer's balance — that is BOLA.",
  },
  {
    term: 'Social Engineering',
    tags: ['attack'], module: 'Module 2',
    definition: "Rather than hacking the computer, the attacker hacks the person. Social engineering uses psychology — urgency, authority, fear, or helpfulness — to convince employees to hand over access or information. No technical skills required. The Revolut 2022 breach started this way: one employee was manipulated into helping.",
    example: "A caller claims to be from IT support and says your account will be suspended unless you confirm your password immediately.",
  },
  {
    term: 'Supply Chain Attack',
    tags: ['attack'], module: 'Module 2',
    definition: "Instead of attacking your company directly, attackers go for the software supplier you trust. They inject malicious code into a tool or library your developers use. When you update, you unknowingly install the attacker's backdoor too. It is like a criminal contaminating food in a factory supplying thousands of restaurants.",
    example: "An attacker compromises a KYC verification vendor's software update — all FinTechs using that vendor silently receive malware.",
  },
  {
    term: 'Zero Trust',
    tags: ['defense', 'concept'], module: 'Module 4',
    definition: "A security mindset that says: trust nobody, verify everyone, every time. Traditional security said 'once you are inside our network, we trust you.' Zero Trust says even your own staff, on your own internal network, must continually prove who they are and that they are authorised for each specific action. Assume hackers are already inside.",
    example: 'An internal server trying to access the payments database must still present a valid token and be verified — even though it sits on the same internal network.',
  },
  {
    term: 'MFA',
    tags: ['defense', 'technology'], module: 'Module 4',
    definition: "Multi-Factor Authentication is like having two locks on your front door. Even if a thief steals your key (password), they still cannot get in without the second lock (a one-time code sent to your phone, or your fingerprint). IBM research found MFA adoption saves organisations roughly US$500,000 per breach on average.",
    example: 'After typing your password, you are prompted to enter a 6-digit code from an authentication app on your phone. That is MFA.',
  },
  {
    term: 'PAM',
    tags: ['defense', 'technology'], module: 'Module 4',
    definition: "Privileged Access Management is a special vault for 'master keys' — the admin accounts that can access everything. PAM controls who can check out these super-powerful credentials, for how long, and records every action they take. Passwords rotate automatically after use so they cannot be reused.",
    example: 'A DBA can request temporary database admin access for 4 hours. The session is fully recorded, and the password changes once the session ends.',
  },
  {
    term: 'Least Privilege',
    tags: ['defense', 'concept'], module: 'Module 4',
    definition: "Every person and every system should only have access to the exact rooms they need — nothing more. Not a master key to the whole building. This way, if one account is compromised, the attacker is stuck in a small room and cannot roam freely. The 2019 Capital One breach became so large partly because one AWS role had far more permissions than it needed.",
    example: 'The customer service team can view accounts but cannot export them in bulk. The finance team can run reports but cannot change user data.',
  },
  {
    term: 'SIEM',
    tags: ['defense', 'technology'], module: 'Module 4',
    definition: "A Security Information and Event Management platform is like having a central security control room with hundreds of camera feeds all analysed at once. It collects logs from every system, looks for suspicious patterns, and fires an alert when something looks wrong — like 10,000 failed logins in 60 seconds.",
    example: "The SIEM spots that login attempts are coming from 200 different countries in the same minute and automatically raises a critical alert to the security team.",
  },
  {
    term: 'AES-256',
    tags: ['technology', 'defense'], module: 'Module 4',
    definition: "The gold-standard padlock for stored data. AES-256 is an encryption algorithm so strong that even with all the world's computers working together, it would take trillions of years to crack. Required by PCI DSS to protect stored card data. If attackers steal encrypted data but not the key, they have nothing.",
    example: 'Customer passport scans stored in the KYC database are encrypted with AES-256. Even if an attacker downloads the database, they cannot read the files without the key.',
  },
  {
    term: 'TLS',
    tags: ['technology', 'defense'], module: 'Module 4',
    definition: "Transport Layer Security is a sealed, tamper-proof envelope for data travelling across the internet. When your app sends a password or bank detail to a server, TLS scrambles it so anyone intercepting it mid-journey sees only meaningless gibberish. The padlock icon in your browser means TLS is active.",
    example: 'Your wallet app sends a payment request over TLS 1.3. Even a hacker monitoring the connection sees only encrypted noise.',
  },
  {
    term: 'Tokenisation',
    tags: ['technology', 'defense'], module: 'Module 4',
    definition: "Replace the real secret with a stand-in. Instead of storing your actual card number, the system stores a random substitute (a token) that only the secure vault knows how to exchange back. If attackers steal tokens, they are worthless — like stealing a cloakroom ticket with no coat.",
    example: "Your card number 4111-1111-1111-1111 is stored as token TKN-8R4Q-9P2X. The token works for payments but reveals nothing to a thief.",
  },
  {
    term: 'HSM',
    tags: ['technology', 'defense'], module: 'Module 4',
    definition: "A Hardware Security Module is a physical, tamper-resistant device — essentially a bank vault bolted to your server rack. It stores and manages the encryption keys that protect all your data. If someone tries to physically open it, it self-destructs its contents. Keys never leave the device unencrypted.",
    example: 'Encryption keys for the payment environment live inside the HSM — not on the application server where a software hack could steal them.',
  },
  {
    term: 'IRP',
    tags: ['defense', 'concept'], module: 'Module 4',
    definition: "An Incident Response Plan is your fire drill for cyberattacks. When a breach happens, panic is expensive — organisations without a plan do random things that make it worse. A tested IRP means everyone knows their role: who handles containment, who notifies regulators, who updates customers, and in what order. IBM (2024) found tested IRPs save an average of US$2.66M per breach.",
    example: "A breach is detected at 2am. Because there is an IRP, the security team immediately follows the plan: isolate affected servers, preserve evidence, notify the PCPD within the required window.",
  },
  {
    term: 'CVE',
    tags: ['technology', 'concept'], module: 'Module 2',
    definition: "Common Vulnerabilities and Exposures is a global catalogue of known software security flaws — like a product recall list for software bugs. Each entry has a severity score. When a CVE is published, it means the vulnerability is publicly known and attackers can look it up. Patching first is a race against criminals who read the same list.",
    example: 'CVE-2017-5638 was the Apache Struts flaw Equifax knew about but did not patch for 78 days. Attackers used it to steal 148 million records.',
  },
  {
    term: 'WAF',
    tags: ['technology', 'defense'], module: 'Module 5',
    definition: "A Web Application Firewall is a bouncer standing in front of your website or API. It reads every incoming request and blocks ones that look like attacks — SQL injections, scripting tricks, or known malicious patterns. However, a misconfigured bouncer can also wave threats straight through, as happened at Capital One.",
    example: "Capital One's WAF was misconfigured, allowing an attacker to use a server trick to reach internal AWS systems and steal 100 million customer records.",
  },
  {
    term: 'SSRF',
    tags: ['attack', 'technology'], module: 'Module 5',
    definition: "Server-Side Request Forgery is like convincing a trusted employee inside a secure building to fetch something from a restricted area on your behalf. The attacker tricks the company's own server into making requests to internal systems the attacker cannot reach directly — such as cloud configuration endpoints that return admin credentials.",
    example: "The Capital One attacker used SSRF to make an AWS server fetch its own internal metadata — revealing admin credentials that unlocked 100 million records.",
  },
  {
    term: 'API Gateway',
    tags: ['technology', 'defense'], module: 'Module 2',
    definition: "An API Gateway is the reception desk for your platform's back-end. Every external request — from your mobile app, a partner system, or a third-party — must pass through it. The gateway checks: is this person authenticated? Are they making too many requests? Is the data they are sending safe? Only then does it let the request through to the real systems.",
    example: 'Without an API gateway, each back-end service would need to handle security itself. With one, a single checkpoint enforces authentication and rate limiting for everyone.',
  },
  {
    term: 'Dark Web',
    tags: ['concept'], module: 'Module 1',
    definition: "A hidden layer of the internet that standard browsers cannot access, requiring special software. While it has legitimate privacy uses, it is also a black market where stolen data, hacking tools, and criminal services are bought and sold. Breached customer records from FinTechs routinely end up advertised here within hours of a hack.",
    example: "Privacy Affairs (2024) reports a complete digital wallet identity package — name, DOB, account number, passwords — sells for around US$310 on dark web marketplaces.",
  },
  {
    term: 'Fullz',
    tags: ['concept', 'attack'], module: 'Module 1',
    definition: "Criminal slang for a 'full package' of stolen identity information — everything needed to impersonate someone financially. This includes full name, date of birth, address, government ID number, bank account details, and card data. A fullz from a digital wallet is particularly valuable because it already has financial data bundled in.",
    example: "A stolen digital wallet record is sold as a 'fullz' because it contains identity, payment, and account data in one package.",
  },
  {
    term: 'Patch Management',
    tags: ['defense', 'concept'], module: 'Module 5',
    definition: "Software has cracks. Developers find them, publish fixes (patches), and the race begins — attackers try to exploit the crack before organisations install the fix. Patch management is the disciplined process of finding, testing, and applying these fixes on a schedule. The slower you are, the longer the window attackers have to walk through.",
    example: "The Equifax breach: hackers exploited a known flaw 78 days after the patch had been published and was sitting uninstalled.",
  },
  {
    term: 'Data Minimisation',
    tags: ['regulation', 'concept'], module: 'Module 4',
    definition: "The simplest security strategy: if you never collect it, you can never lose it. Data minimisation means only storing the personal information you genuinely need for a stated purpose. Required by both GDPR (Article 5) and PDPO (DPP1). The less data you hold, the smaller the damage if you are breached.",
    example: "If you only need to verify a customer's age, store only their date of birth — not their full passport scan, home address, and mother's maiden name.",
  },
  {
    term: 'Micro-segmentation',
    tags: ['defense', 'technology'], module: 'Module 4',
    definition: "Dividing your network into small, walled rooms. Even if an attacker breaks into one room, locked doors stop them moving freely through the rest of the building. In traditional flat networks, one compromised device could access everything. With micro-segmentation, a breach is kept small and contained.",
    example: 'The payment database sits in an isolated network segment. A compromised web server on another segment cannot connect to it — the wall stops lateral movement.',
  },
  {
    term: 'Ransomware',
    tags: ['attack'], module: 'Module 2',
    definition: "A digital kidnapping. Ransomware is malicious software that secretly encrypts all your files and systems, then demands a ransom payment (usually in cryptocurrency) for the key to unlock them. If you don't pay — or if backups are also encrypted — your entire operation grinds to a halt. Hospitals, pipelines, and banks have all been paralysed by it.",
    example: "In 2021, the Colonial Pipeline paid $4.4 million ransom after ransomware locked its systems, causing fuel shortages across the US East Coast.",
  },
  {
    term: 'Two-Factor Authentication (2FA)',
    tags: ['defense', 'technology'], module: 'Module 4',
    definition: "Two locks instead of one. Even if a thief steals your password, they cannot log in without a second proof of identity — typically a one-time code sent to your phone or generated by an app. 2FA is one of the single most effective defences against account takeover, which is why regulators strongly recommend it for financial platforms.",
    example: 'You enter your password, then receive a push notification on your phone to approve the login. Without your phone in hand, a stolen password is useless.',
  },
  {
    term: 'Firewall',
    tags: ['defense', 'technology'], module: 'Module 4',
    definition: "A security checkpoint at the border of your network — like a security guard who checks everyone's pass before letting them into the building. A firewall decides which connections are allowed in or out based on a set of rules. Suspicious or unauthorised traffic is blocked before it ever reaches your systems.",
    example: "The company firewall is configured to block all traffic except HTTPS on port 443 — a web server on port 8080 is invisible to the outside world.",
  },
  {
    term: 'VPN',
    tags: ['defense', 'technology'], module: 'Module 4',
    definition: "A Virtual Private Network is a private, encrypted tunnel through the internet. Imagine the difference between shouting across a public square versus speaking through a soundproof pipe. Anyone eavesdropping on a VPN connection sees only scrambled, unreadable data. Essential for staff accessing company systems from home, hotels, or airports.",
    example: 'An employee working from a café connects via VPN. Their traffic is encrypted — the café Wi-Fi operator sees only noise, not the sensitive client data being accessed.',
  },
  {
    term: 'Malware',
    tags: ['attack'], module: 'Module 2',
    definition: "Malware is the umbrella term for any software designed to cause harm — short for 'malicious software.' Just like there are many types of pests (ants, rats, termites), there are many types of malware: viruses that spread between files, ransomware that locks your data, spyware that watches silently, and trojans that pretend to be legitimate programs.",
    example: 'A staff member opens an infected email attachment. In the background, malware silently installs itself and begins logging every keystroke — including passwords.',
  },
]


const CATEGORIES = [
  { key: 'all', label: 'All', emoji: '🔍' },
  { key: 'attack', label: 'Attack Vectors', emoji: '⚡' },
  { key: 'defense', label: 'Defence', emoji: '🛡️' },
  { key: 'regulation', label: 'Regulation', emoji: '📋' },
  { key: 'technology', label: 'Technology', emoji: '⚙️' },
  { key: 'hk', label: 'HK-Specific', emoji: '🇭🇰' },
  { key: 'concept', label: 'Concepts', emoji: '💡' },
]

const TAG_COLOR: Record<string, string> = {
  regulation: 'bg-indigo-900/40 text-indigo-300 border-indigo-700/40',
  attack:     'bg-red-900/40 text-red-300 border-red-700/40',
  defense:    'bg-emerald-900/40 text-emerald-300 border-emerald-700/40',
  technology: 'bg-amber-900/40 text-amber-300 border-amber-700/40',
  concept:    'bg-purple-900/40 text-purple-300 border-purple-700/40',
  hk:         'bg-rose-900/40 text-rose-300 border-rose-700/40',
}

export default function GlossaryPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return TERMS
      .filter(t => {
        const catOk = filter === 'all' || t.tags.includes(filter)
        if (!catOk) return false
        if (!q) return true
        return (
          t.term.toLowerCase().includes(q) ||
          t.definition.toLowerCase().includes(q) ||
          (t.example?.toLowerCase().includes(q)) ||
          t.tags.some(tag => tag.includes(q))
        )
      })
      .sort((a, b) => a.term.localeCompare(b.term))
  }, [search, filter])

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900/30 via-slate-900/60 to-emerald-900/20 border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-blue">Reference</span>
            <span className="text-slate-400 text-sm">{TERMS.length} Terms</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Cybersecurity <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Glossary</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            Key terminology for data breach prevention, regulatory compliance, and FinTech security — searchable reference for all training modules.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            placeholder="Search terms, definitions, tags…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800/60 border border-slate-700/50 rounded-2xl pl-12 pr-5 py-3.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all max-w-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map(c => (
            <button
              key={c.key}
              onClick={() => setFilter(c.key)}
              className={clsx(
                'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all',
                filter === c.key
                  ? 'bg-brand-600 border-brand-500 text-white'
                  : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white hover:border-slate-600',
              )}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* Stats */}
        <p className="text-slate-500 text-xs mb-8">
          <span className="text-brand-400 font-bold text-sm">{filtered.length}</span> terms shown
        </p>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-20 text-slate-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No terms matched <strong className="text-slate-400">"{search}"</strong>. Try a different search.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((t, i) => (
                <motion.div
                  key={t.term}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="card group hover:-translate-y-1 transition-transform"
                >
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <span className="font-mono font-bold text-white text-base">{t.term}</span>
                    <div className="flex flex-wrap gap-1 justify-end shrink-0">
                      {t.tags.map(tag => (
                        <span key={tag} className={clsx('px-1.5 py-0.5 text-[10px] font-semibold rounded border', TAG_COLOR[tag])}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed mb-3">{t.definition}</p>
                  {t.example && (
                    <div className="bg-slate-800/60 border-l-2 border-brand-500/60 px-3 py-2 rounded-r-lg text-slate-400 text-xs italic mb-3">
                      📌 {t.example}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-brand-400" />
                    <span className="text-brand-400 text-[11px] font-semibold">{t.module}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Tips */}
      <div className="max-w-4xl mx-auto px-4 pb-10">
        <QuickTips tips={GLOSSARY_TIPS} title="Tips for Using This Glossary" />
      </div>
    </motion.div>
  )
}
