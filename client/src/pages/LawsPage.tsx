import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import clsx from 'clsx'
import QuickTips from '../components/QuickTips'

const LAWS_TIPS = [
  'Find out which laws apply to your specific organisation. Most FinTechs in Hong Kong must comply with both PDPO and HKMA C-RAF as a minimum',
  'Check when your PCPD registration was last updated. Changes to how you process personal data require you to update your registration',
  'Ask your legal or compliance team if your organisation has a written data breach notification procedure that meets the 3-day PDPO requirement',
  'If your platform processes any EU customer data, appoint a GDPR data protection representative before you are subject to a compliance investigation',
  'Bookmark the official PCPD website (pcpd.org.hk) and sign up for their newsletter. They publish guidance notes that tell you exactly what is expected',
]

interface LawCard {
  abbr: string
  name: string
  jurisdiction: string
  jurisdictionFlag: string
  icon: string
  desc: string
  keyFacts: string[]
  links: { label: string; url: string }[]
  keywords: string
}

const LAWS: LawCard[] = [
  {
    abbr: 'PDPO',
    name: 'Personal Data (Privacy) Ordinance',
    jurisdiction: 'Hong Kong',
    jurisdictionFlag: '🇭🇰',
    icon: '🏛️',
    desc: "Hong Kong's primary data privacy law. Governs the collection, holding, processing, and use of personal data. Administered by the PCPD. Applies to all organisations handling HK residents' data.",
    keyFacts: [
      '6 Data Protection Principles (DPPs)',
      'Mandatory breach notification to PCPD within 3 days of discovery',
      'Fines up to HKD 1 million and criminal liability',
      'Enhanced rules on doxxing, direct marketing and CCTV',
      '2021 amendments strengthened enforcement powers',
    ],
    links: [
      { label: '📜 Full Ordinance', url: 'https://www.pcpd.org.hk/english/data_privacy_law/ordinance_at_a_Glance/ordinance.html' },
      { label: '🌐 PCPD Website', url: 'https://www.pcpd.org.hk' },
    ],
    keywords: 'pdpo pcpd personal data privacy ordinance hong kong data protection',
  },
  {
    abbr: 'HKMA C-RAF',
    name: 'Cyber Resilience Assessment Framework',
    jurisdiction: 'Hong Kong',
    jurisdictionFlag: '🇭🇰',
    icon: '🏦',
    desc: "The HKMA's comprehensive framework for assessing Authorized Institutions' cyber resilience. Mandates regular intelligence-led cyber exercises (iCAST) and proportionate controls.",
    keyFacts: [
      '8 domains: Govern, Identify, Protect, Detect, Respond, Recover, Test, Situational Awareness',
      'iCAST (Intelligence-led Cyber Attack Simulation Testing) mandatory',
      'Applies to all HKMA-authorised banks and payment institutions',
      'Annual reporting requirement to HKMA',
    ],
    links: [
      { label: '📜 C-RAF Document', url: 'https://www.hkma.gov.hk/media/eng/doc/key-functions/fisc/20161003e1.pdf' },
      { label: '🌐 HKMA Website', url: 'https://www.hkma.gov.hk' },
    ],
    keywords: 'hkma hong kong monetary authority c-raf cyber resilience assessment fintech',
  },
  {
    abbr: 'TM-E-1',
    name: 'HKMA SPM — Risk Management of e-Banking',
    jurisdiction: 'Hong Kong',
    jurisdictionFlag: '🇭🇰',
    icon: '📋',
    desc: "HKMA's supervisory guidance on managing risks associated with electronic banking services, including mobile banking and digital wallets. Covers authentication, data security, and vendor management.",
    keyFacts: [
      'Two-factor authentication requirements for high-risk transactions',
      'Customer notification within 24 hours of suspicious activity',
      'Incident reporting to HKMA within 1 hour of discovery',
      'Annual security testing of e-banking systems',
    ],
    links: [
      { label: '📜 Policy Manual', url: 'https://www.hkma.gov.hk/media/eng/doc/key-information/guidelines-and-circular/2015/20150918e2.pdf' },
      { label: '🌐 HKMA SPM', url: 'https://www.hkma.gov.hk/eng/key-functions/banking-stability/regulatory-framework/supervisory-policy-manual/' },
    ],
    keywords: 'tm-e-1 hkma e-banking risk management supervisory policy manual',
  },
  {
    abbr: 'SFC Circular',
    name: 'SFC — Cybersecurity Guidelines for Licensed Corporations',
    jurisdiction: 'Hong Kong',
    jurisdictionFlag: '🇭🇰',
    icon: '📈',
    desc: "The Securities and Futures Commission's cybersecurity guidelines applying to all licensed corporations conducting regulated activities in Hong Kong's capital markets.",
    keyFacts: [
      'Mandatory cybersecurity baseline controls',
      'Annual penetration testing and vulnerability assessments',
      'Incident reporting to SFC within 1 business day',
      'Client data segregation requirements',
      'Employee cybersecurity awareness training mandatory',
    ],
    links: [
      { label: '📜 SFC TRM Guidelines', url: 'https://www.sfc.hk/en/Regulatory-functions/Intermediaries/Technology-risk-management' },
      { label: '🌐 SFC Website', url: 'https://www.sfc.hk' },
    ],
    keywords: 'sfc securities futures commission hong kong cybersecurity',
  },
  {
    abbr: 'SVF Ordinance',
    name: 'Stored Value Facilities Regulation',
    jurisdiction: 'Hong Kong',
    jurisdictionFlag: '🇭🇰',
    icon: '💳',
    desc: 'Governs the licensing and regulation of stored value facilities (digital wallets, prepaid cards) in Hong Kong. All SVF licensees must meet cybersecurity and data protection standards set by HKMA.',
    keyFacts: [
      'Multi-purpose SVF licence required for digital wallet operations',
      'Minimum capital requirements and float safeguarding',
      'HKMA security standards must be maintained',
      'Customer funds must be held in segregated accounts',
    ],
    links: [
      { label: '📜 SVF Licences', url: 'https://www.hkma.gov.hk/eng/key-functions/international-financial-centre/fintech/stored-value-facilities/' },
      { label: '🌐 Cap. 584', url: 'https://www.legislation.gov.hk/hk/cap584' },
    ],
    keywords: 'svf stored value facility digital wallet hong kong hkma',
  },
  {
    abbr: 'GDPR',
    name: 'General Data Protection Regulation',
    jurisdiction: 'European Union',
    jurisdictionFlag: '🇪🇺',
    icon: '🇪🇺',
    desc: "The world's strongest data privacy regulation, enacted in 2018. Sets strict rules for any organisation processing EU residents' data, regardless of where the organisation is based.",
    keyFacts: [
      'Breach notification to supervisory authority within 72 hours',
      'Fines up to €20 million or 4% of global annual revenue',
      'Right to erasure ("right to be forgotten")',
      'Data minimisation and purpose limitation principles',
      'Mandatory Data Protection Officer (DPO) for certain processors',
      'Privacy by design and by default requirements',
    ],
    links: [
      { label: '📜 Full Regulation', url: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj' },
      { label: '🌐 GDPR.eu', url: 'https://gdpr.eu' },
      { label: '🏛️ EDPB', url: 'https://www.edpb.europa.eu' },
    ],
    keywords: 'gdpr general data protection regulation eu europe personal data privacy',
  },
  {
    abbr: 'NIS2 Directive',
    name: 'Network and Information Security Directive 2',
    jurisdiction: 'European Union',
    jurisdictionFlag: '🇪🇺',
    icon: '🔒',
    desc: 'EU directive expanding cybersecurity requirements across critical sectors including financial services. Enforces incident reporting, supply chain security, and management accountability for cyber risks (effective Oct 2024).',
    keyFacts: [
      'Initial notification within 24 hours of major incident',
      'Full incident report within 72 hours',
      'Management boards held personally accountable',
      'Covers banking, financial market infrastructure, payment providers',
      'Fines up to €10 million or 2% of global turnover',
    ],
    links: [
      { label: '📜 Full Directive', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022L2555' },
      { label: '🌐 ENISA', url: 'https://www.enisa.europa.eu/topics/cybersecurity-policy/nis-directive-new' },
    ],
    keywords: 'nis2 network information security directive eu cyber critical infrastructure',
  },
  {
    abbr: 'DORA',
    name: 'Digital Operational Resilience Act',
    jurisdiction: 'European Union',
    jurisdictionFlag: '🇪🇺',
    icon: '🏛️',
    desc: 'EU regulation specifically targeting ICT risk management in financial services, effective January 2025. Covers banks, insurers, investment firms, crypto-asset service providers, and critical third-party ICT providers.',
    keyFacts: [
      'Mandatory ICT risk management framework',
      'Annual digital operational resilience testing',
      'Mandatory reporting of major ICT incidents',
      'Oversight of critical third-party ICT service providers',
      'Covers crypto-asset service providers (CASPs)',
    ],
    links: [
      { label: '📜 DORA Regulation', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554' },
    ],
    keywords: 'dora digital operational resilience act eu financial services ict risk',
  },
  {
    abbr: 'PCI DSS v4.0',
    name: 'Payment Card Industry Data Security Standard',
    jurisdiction: 'International',
    jurisdictionFlag: '🌍',
    icon: '💳',
    desc: 'Technical security standard for organisations processing, storing, or transmitting payment card data. Version 4.0 (effective March 2024) includes enhanced controls for e-commerce, authentication, and continuous monitoring.',
    keyFacts: [
      '12 requirements across 6 control objectives',
      'AES-256 or equivalent encryption for stored cardholder data',
      'Multi-factor authentication for all access to cardholder data environment',
      'Annual penetration testing requirement',
      'Applies to any entity that stores, processes, or transmits card data',
      'Non-compliance can result in fines from card brands (Visa/Mastercard)',
    ],
    links: [
      { label: '📜 PCI DSS v4.0', url: 'https://www.pcisecuritystandards.org' },
      { label: '🌐 PCI SSC', url: 'https://www.pcisecuritystandards.org' },
    ],
    keywords: 'pci dss payment card industry data security standard v4 credit card',
  },
  {
    abbr: 'NIST CSF',
    name: 'NIST Cybersecurity Framework',
    jurisdiction: 'International',
    jurisdictionFlag: '🌍',
    icon: '🇺🇸',
    desc: "The US National Institute of Standards and Technology's voluntary cybersecurity framework widely adopted globally. Version 2.0 (2024) adds a 'Govern' function and expands supply chain risk guidance.",
    keyFacts: [
      "6 core functions: Govern, Identify, Protect, Detect, Respond, Recover",
      'Risk-based approach adaptable to any organisation size',
      'Widely referenced by HKMA\'s C-RAF framework',
      'NIST SP 800-207 defines Zero Trust Architecture',
      'NIST SP 800-61r2 defines Incident Response lifecycle',
    ],
    links: [
      { label: '📜 NIST CSF', url: 'https://www.nist.gov/cyberframework' },
      { label: '🌐 NIST.gov', url: 'https://www.nist.gov' },
    ],
    keywords: 'nist cybersecurity framework csf identify protect detect respond recover',
  },
]

const JURISDICTIONS = ['All', 'Hong Kong', 'European Union', 'International']

export default function LawsPage() {
  const [search, setSearch] = useState('')
  const [jurisdiction, setJurisdiction] = useState('All')
  const [expanded, setExpanded] = useState<string | null>(null)

  const filtered = LAWS.filter(l => {
    const jOk = jurisdiction === 'All' || l.jurisdiction === jurisdiction
    const q = search.toLowerCase().trim()
    if (!jOk) return false
    if (!q) return true
    return l.keywords.includes(q) || l.name.toLowerCase().includes(q) || l.abbr.toLowerCase().includes(q)
  })

  const jColor: Record<string, string> = {
    'Hong Kong': 'bg-rose-900/30 border-rose-700/40 text-rose-300',
    'European Union': 'bg-blue-900/30 border-blue-700/40 text-blue-300',
    'International': 'bg-amber-900/30 border-amber-700/40 text-amber-300',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900 border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-red">Regulatory Reference</span>
            <span className="text-slate-400 text-sm">4 Jurisdictions · {LAWS.length}+ Regulations</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            ⚖️ Laws &amp; <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">Regulations</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            The full set of cybersecurity, data privacy, and financial regulation laws applicable to FinTech mobile apps in Hong Kong and globally, with official source links.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Search laws by name, abbreviation, keyword…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/60 transition-all"
            />
          </div>
          <div className="flex gap-2">
            {JURISDICTIONS.map(j => (
              <button
                key={j}
                onClick={() => setJurisdiction(j)}
                className={clsx(
                  'px-3 py-2 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap',
                  jurisdiction === j
                    ? 'bg-brand-600 border-brand-500 text-white'
                    : 'bg-slate-800/60 border-slate-700/50 text-slate-400 hover:text-white',
                )}
              >
                {j}
              </button>
            ))}
          </div>
        </div>

        {/* Law cards */}
        <div className="space-y-4">
          {filtered.map((law, idx) => {
            const isOpen = expanded === law.abbr
            return (
              <motion.div
                key={law.abbr}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-slate-900/60 border border-slate-700/50 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : law.abbr)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-slate-800/30 transition-colors"
                >
                  <span className="text-2xl shrink-0">{law.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-bold">{law.abbr}</span>
                      <span className={clsx('text-[10px] font-semibold px-2 py-0.5 rounded-full border', jColor[law.jurisdiction])}>
                        {law.jurisdictionFlag} {law.jurisdiction}
                      </span>
                    </div>
                    <div className="text-slate-400 text-xs truncate">{law.name}</div>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-5 pb-5 border-t border-slate-700/50"
                  >
                    <p className="text-slate-300 text-sm leading-relaxed mt-4 mb-4">{law.desc}</p>
                    <h3 className="text-white font-semibold text-xs uppercase tracking-widest mb-2">Key Requirements</h3>
                    <ul className="space-y-1.5 mb-5">
                      {law.keyFacts.map((fact, i) => (
                        <li key={i} className="flex items-start gap-2 text-slate-400 text-xs">
                          <span className="text-brand-400 mt-0.5">▸</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-2">
                      {law.links.map(link => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 btn-secondary text-xs py-2 px-4"
                        >
                          {link.label}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <p className="text-4xl mb-3">⚖️</p>
            <p>No laws matched your search. Try different keywords.</p>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <QuickTips tips={LAWS_TIPS} title="Practical Steps for Staying Compliant" />
      </div>
    </motion.div>
  )
}
