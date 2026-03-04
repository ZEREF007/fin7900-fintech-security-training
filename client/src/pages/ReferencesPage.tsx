import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, BookOpen } from 'lucide-react'
import clsx from 'clsx'
import QuickTips from '../components/QuickTips'

const REFERENCES_TIPS = [
  'Read the IBM Cost of a Data Breach report (free at ibm.com/reports/data-breach) for the latest global statistics on breach costs and timelines',
  'Bookmark the Verizon Data Breach Investigations Report (DBIR) and read the executive summary each year. Two pages will keep you informed on current threats',
  'Visit the PCPD website (pcpd.org.hk) and read their most recent enforcement notices to understand what kinds of mistakes organisations are being penalised for',
  'Look up the NIST Cybersecurity Framework online. It is free and gives you a clear checklist of controls your organisation should have',
]

interface Ref {
  num: string
  citation: string
  url?: string
}

interface RefGroup {
  emoji: string
  title: string
  refs: Ref[]
}

const GROUPS: RefGroup[] = [
  {
    emoji: '📖',
    title: 'Module 1 — What is a Data Breach?',
    refs: [
      { num: '[1]', citation: 'IBM Security. (2024). Cost of a data breach report 2024. IBM Corporation.', url: 'https://www.ibm.com/reports/data-breach' },
      { num: '[2]', citation: 'Verizon. (2024). 2024 Data breach investigations report. Verizon Communications.', url: 'https://www.verizon.com/business/resources/reports/dbir/' },
      { num: '[3]', citation: 'Privacy Commissioner for Personal Data, Hong Kong. (2024). Annual report 2023/2024. PCPD.', url: 'https://www.pcpd.org.hk' },
      { num: '[4]', citation: 'Hong Kong Monetary Authority. (2023). Cyber resilience assessment framework. HKMA.', url: 'https://www.hkma.gov.hk' },
      { num: '[5]', citation: 'National Institute of Standards and Technology. (2018). NIST cybersecurity framework version 1.1. U.S. Department of Commerce.', url: 'https://www.nist.gov/cyberframework' },
      { num: '[6]', citation: 'Ponemon Institute. (2024). 2024 State of cybersecurity in the financial services industry. Ponemon Institute LLC.' },
    ]
  },
  {
    emoji: '🔍',
    title: 'Module 2 — Root Causes & Attack Vectors',
    refs: [
      { num: '[1]', citation: 'OWASP Foundation. (2023). OWASP Mobile Security Testing Guide. OWASP Foundation.', url: 'https://owasp.org/www-project-mobile-security-testing-guide/' },
      { num: '[2]', citation: 'Verizon. (2024). 2024 Data breach investigations report. Verizon Communications.', url: 'https://www.verizon.com/business/resources/reports/dbir/' },
      { num: '[3]', citation: 'CrowdStrike. (2024). 2024 Global threat report. CrowdStrike Holdings.', url: 'https://www.crowdstrike.com/en-us/resources/reports/global-threat-report/' },
      { num: '[4]', citation: 'Mitnick, K. D., & Simon, W. L. (2003). The art of deception: Controlling the human element of security. Wiley.' },
      { num: '[5]', citation: 'SANS Institute. (2023). Security awareness report: Managing human cyber risk. SANS Institute.' },
      { num: '[6]', citation: 'Akamai Technologies. (2024). State of the Internet / security: Financial services attack economy. Akamai Technologies.' },
    ]
  },
  {
    emoji: '📊',
    title: 'Module 3 — Business Impact Analysis',
    refs: [
      { num: '[1]', citation: 'IBM Security. (2024). Cost of a data breach report 2024. IBM Corporation.', url: 'https://www.ibm.com/reports/data-breach' },
      { num: '[2]', citation: 'Gartner. (2023). Market guide for security operations: SOC modernisation. Gartner, Inc.' },
      { num: '[3]', citation: 'McKinsey & Company. (2022). Financial-services regulation: How digital trust can improve compliance and CX. McKinsey Institute.' },
      { num: '[4]', citation: 'Privacy Commissioner for Personal Data, Hong Kong. (2024). PDPO enforcement: 2023 enforcement actions & statistics. PCPD.', url: 'https://www.pcpd.org.hk' },
      { num: '[5]', citation: 'PwC. (2024). Global economic crime and fraud survey 2024. PricewaterhouseCoopers International.' },
      { num: '[6]', citation: 'Deloitte. (2023). 2023 Financial services cybersecurity regulatory update. Deloitte Touche Tohmatsu Limited.' },
    ]
  },
  {
    emoji: '🛡️',
    title: 'Module 4 — Mitigation Strategies',
    refs: [
      { num: '[1]', citation: 'National Institute of Standards and Technology. (2020). Zero trust architecture (NIST SP 800-207). U.S. Department of Commerce.', url: 'https://doi.org/10.6028/NIST.SP.800-207' },
      { num: '[2]', citation: 'PCI Security Standards Council. (2022). Payment card industry data security standard v4.0. PCI SSC.', url: 'https://www.pcisecuritystandards.org' },
      { num: '[3]', citation: 'OWASP Foundation. (2023). OWASP Top 10 2023. OWASP Foundation.', url: 'https://owasp.org/Top10/' },
      { num: '[4]', citation: 'Hong Kong Monetary Authority. (2021). Cybersecurity Fortification Initiative 2.0. HKMA.', url: 'https://www.hkma.gov.hk' },
      { num: '[5]', citation: 'Microsoft. (2023). Digital defense report 2023. Microsoft Corporation.', url: 'https://www.microsoft.com/en-us/security/security-insider/microsoft-digital-defense-report-2023' },
      { num: '[6]', citation: 'CISA. (2023). Zero trust maturity model v2.0. Cybersecurity and Infrastructure Security Agency.', url: 'https://www.cisa.gov/zero-trust-maturity-model' },
    ]
  },
  {
    emoji: '📋',
    title: 'Module 5 — Real-World Case Studies',
    refs: [
      { num: '[1]', citation: 'FTC. (2019). Federal Trade Commission v. Equifax: Settlement agreement and consent order. Federal Trade Commission.', url: 'https://www.ftc.gov/enforcement/cases-proceedings/refunds/equifax-data-breach-settlement' },
      { num: '[2]', citation: "UK Information Commissioner's Office. (2020). ICO fines British Airways £20 million for data breach affecting more than 400,000 customers. ICO.", url: 'https://ico.org.uk' },
      { num: '[3]', citation: 'Krebs, B. (2021). Robinhood discloses data breach affecting 7 million users. KrebsOnSecurity.', url: 'https://krebsonsecurity.com' },
      { num: '[4]', citation: 'Mandiant. (2024). M-Trends 2024: Special report. Google Cloud / Mandiant.', url: 'https://www.mandiant.com/m-trends' },
      { num: '[5]', citation: 'Oltsik, J. (2022). The life and times of cybersecurity professionals. ESG / ISSA International.' },
      { num: '[6]', citation: 'Schneier, B. (2015). Data and Goliath: The hidden battles to collect your data and control your world. W. W. Norton & Company.' },
    ]
  },
  {
    emoji: '⚖️',
    title: 'Laws, Regulations & Frameworks',
    refs: [
      { num: '[1]', citation: 'European Parliament. (2016). Regulation (EU) 2016/679 — General Data Protection Regulation. Official Journal of the European Union.' },
      { num: '[2]', citation: 'Laws of Hong Kong. (Cap. 486). Personal Data (Privacy) Ordinance. Department of Justice, HKSAR.', url: 'https://www.elegislation.gov.hk/hk/cap486' },
      { num: '[3]', citation: 'Hong Kong Monetary Authority. (2023). Supervisory Policy Manual TM-G-1: General principles for technology risk management. HKMA.' },
      { num: '[4]', citation: 'Securities and Futures Commission. (2022). Circular on cybersecurity measures. SFC Hong Kong.', url: 'https://www.sfc.hk' },
      { num: '[5]', citation: 'National Institute of Standards and Technology. (2018). NIST cybersecurity framework version 1.1. U.S. Department of Commerce.', url: 'https://www.nist.gov/cyberframework' },
      { num: '[6]', citation: 'International Organisation for Standardisation. (2022). ISO/IEC 27001:2022 — Information security management systems. ISO.' },
    ]
  },
]

export default function ReferencesPage() {
  const [activeGroup, setActiveGroup] = useState<number | null>(null)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-950/30 to-slate-900 border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge badge-purple">Sources &amp; References</span>
            <span className="text-slate-400 text-sm">Industry &amp; Regulatory Sources</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            📑 Course <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">References</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            Research sources and further reading for the GuardYourData programme. All references link to publicly available reports, regulatory documents, and industry publications.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Citation note */}
        <div className="bg-amber-950/30 border border-amber-700/30 rounded-2xl p-5 mb-10">
          <p className="text-amber-200 text-sm leading-relaxed">
            <strong>📌 Sources:</strong> All references link to publicly available reports, regulatory documents, and industry publications. DOI or URL is included where available.{' '}
            AI tools were used to assist with drafting — all factual claims are verified against the sources listed below.
          </p>
        </div>

        {/* Reference groups */}
        <div className="space-y-4">
          {GROUPS.map((group, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <button
                onClick={() => setActiveGroup(activeGroup === idx ? null : idx)}
                className={clsx(
                  'w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-left transition-all border',
                  activeGroup === idx
                    ? 'bg-brand-600/20 border-brand-500/40 text-white'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-300 hover:bg-slate-800/70 hover:text-white',
                )}
              >
                <span className="flex items-center gap-3">
                  <span className="text-xl">{group.emoji}</span>
                  <span>{group.title}</span>
                </span>
                <span className={clsx(
                  'text-xs px-2 py-1 rounded-full',
                  activeGroup === idx ? 'bg-brand-600 text-white' : 'bg-slate-700 text-slate-400',
                )}>
                  {group.refs.length} refs
                </span>
              </button>

              {activeGroup === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-900/60 border border-slate-700/50 border-t-0 rounded-b-2xl px-6 py-4"
                >
                  <ol className="space-y-4">
                    {group.refs.map(ref => (
                      <li key={ref.num} className="flex gap-3 text-sm">
                        <span className="text-brand-400 font-bold font-mono shrink-0 w-8">{ref.num}</span>
                        <div className="text-slate-300 leading-relaxed">
                          {ref.citation}
                          {ref.url && (
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 ml-2 text-brand-400 hover:text-brand-300 transition-colors text-xs"
                            >
                              <ExternalLink className="w-3 h-3" />
                              {ref.url}
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Quick Tips */}
        <QuickTips tips={REFERENCES_TIPS} title="How to Stay Updated After This Course" />

        {/* AI note */}
        <div className="mt-10 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🤖</span>
            <div>
              <div className="text-white font-semibold mb-1">Note on Generative AI Use</div>
              <p className="text-slate-400 text-sm leading-relaxed">
                AI tools were used to assist with drafting explanations and structuring content for clarity. All factual claims, statistics, and regulatory references are drawn from the primary and secondary sources listed above. AI-generated content was reviewed, edited, and verified against authoritative sources.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
