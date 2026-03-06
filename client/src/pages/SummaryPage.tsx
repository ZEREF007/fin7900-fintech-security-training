import React from 'react'
import { motion } from 'framer-motion'
import { Download, FileText, ChevronRight, TrendingUp, Shield, AlertTriangle, BookOpen, Gavel, Layers, Mouse } from 'lucide-react'

const PDF_FILE   = '/pptx/The_FinTech_Security_Imperative.pdf'
const PPTX_FILE  = 'https://docs.google.com/presentation/d/15MaVlIH6pqg3Rp9V8_5yZt2atBhZlkz8/export/pptx'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

const TIMELINE = [
  {
    number: '01',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'from-blue-600 to-indigo-600',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800/50',
    title: 'What is a Data Breach?',
    subtitle: 'Foundation',
    summary:
      'Defined the anatomy of a data breach — unauthorised access, exfiltration, or exposure of sensitive information. Introduced the four breach archetypes and the PDPO DPP1–DPP6 regulatory framework governing Hong Kong organisations.',
    stat: { value: 'US$4.45M', label: 'average breach cost (IBM 2024)' },
  },
  {
    number: '02',
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'from-red-600 to-rose-600',
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-800/50',
    title: 'How Hackers Break In',
    subtitle: 'Attack Vectors',
    summary:
      'Catalogued the principal attack techniques used against FinTech organisations: phishing, credential stuffing, supply-chain compromise, and unpatched vulnerabilities. Emphasised that 74% of breaches originate from human error — making people the primary control surface.',
    stat: { value: '74%', label: 'of breaches involve a human element' },
  },
  {
    number: '03',
    icon: <TrendingUp className="w-5 h-5" />,
    color: 'from-amber-600 to-orange-600',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    border: 'border-amber-200 dark:border-amber-800/50',
    title: 'The True Cost of a Breach',
    subtitle: 'Business Impact',
    summary:
      'Quantified the multi-layer impact: direct financial penalties under GDPR and PDPO, reputational attrition, customer churn, and operational disruption. Mapped regulatory obligations across HKMA C-RAF, PCI DSS, and MAS TRM to provide a compliance cost matrix.',
    stat: { value: '277 days', label: 'average detection time' },
  },
  {
    number: '04',
    icon: <Shield className="w-5 h-5" />,
    color: 'from-emerald-600 to-teal-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    border: 'border-emerald-200 dark:border-emerald-800/50',
    title: 'Building a Digital Fortress',
    subtitle: 'Mitigation',
    summary:
      'Presented a layered defence architecture: MFA deployment, least-privilege access, zero-trust segmentation, AES-256 encryption at rest and in transit, staff awareness training, and a 3-2-1 backup strategy. Each control was mapped to its regulatory requirement.',
    stat: { value: '99%+', label: 'of credential attacks blocked by MFA' },
  },
  {
    number: '05',
    icon: <Layers className="w-5 h-5" />,
    color: 'from-purple-600 to-violet-600',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    border: 'border-purple-200 dark:border-purple-800/50',
    title: 'A Million-Dollar Mistake',
    subtitle: 'Case Studies',
    summary:
      'Dissected high-profile incidents — Equifax, Capital One, and a local HKMA-regulated institution — to extract transferable governance lessons. Introduced the HKMA C-RAF 8-domain maturity model and demonstrated how board-level accountability translates into measurable risk reduction.',
    stat: { value: '8 domains', label: 'HKMA C-RAF maturity model' },
  },
]

const FINDINGS = [
  {
    icon: '🎯',
    title: 'The Human Element is the Greatest Risk',
    body: 'Across all five modules, one finding is unambiguous: technology alone does not protect organisations. In 74% of documented incidents, a human action — clicking a link, reusing a password, or misconfiguring a server — opened the door. Investing in people and process yields a higher return than any single technology purchase.',
  },
  {
    icon: '⚖️',
    title: 'Regulatory Exposure is Real and Growing',
    body: 'Hong Kong FinTech organisations face a converging web of obligations: PDPO mandatory breach notification (72 hours), HKMA C-RAF annual self-assessment, PCI DSS Level 1 audit cycles, and potential GDPR extraterritorial reach. Non-compliance amplifies financial loss by an average of 23% above baseline breach cost.',
  },
  {
    icon: '🔐',
    title: 'Three Controls Deliver Disproportionate Protection',
    body: 'Multi-factor authentication, prompt patch management (within 30 days of release), and privileged-access governance collectively neutralise the majority of attack vectors covered in this programme. These are low-cost, high-impact interventions available to any organisation regardless of size.',
  },
  {
    icon: '⏱',
    title: 'Detection Lag is the Silent Multiplier',
    body: 'At 277 days average detection time, attackers operate uncontested for nearly nine months. Each day of undetected access compounds data loss, regulatory exposure, and remediation cost. Organisations should treat SIEM deployment and regular tabletop exercises as urgent priorities, not roadmap items.',
  },
]

export default function SummaryPage() {
  const [slideActivated, setSlideActivated] = React.useState(false)

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">

      {/* ── Header ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-14"
      >
        {/* Deloitte-style top rule */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-0.5 w-10 bg-brand-600" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-600 dark:text-brand-400">GuardYourData · FIN7900</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight mb-4">
          Executive<br />
          <span className="text-brand-600 dark:text-brand-400">Summary</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl leading-relaxed">
          A structured review of the five-module FinTech Data Security programme —
          key findings, learning outcomes, and recommended actions for senior managers
          and compliance professionals.
        </p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-4 mt-6 text-xs text-slate-400 dark:text-slate-500">
          <span className="flex items-center gap-1.5"><Gavel className="w-3.5 h-3.5" /> Prepared for FIN7900 Assessment</span>
          <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> March 2026</span>
          <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Confidential</span>
        </div>

        {/* Report CTA */}
        <div className="mt-6">
          <a
            href="/report/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold shadow-lg shadow-brand-600/20 transition-all hover:-translate-y-0.5"
          >
            <FileText className="w-4 h-4" />
            See the detailed Project Progress Report →
          </a>
          <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
            Full research methodology, GenAI prompts, user testing rounds &amp; quality enhancements
          </p>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-700/60 mt-8" />
      </motion.div>

      {/* ── PPTX Viewer + Download ─────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="mb-14"
      >
        <div className="flex items-center gap-2 mb-5">
          <div className="h-0.5 w-6 bg-brand-600" />
          <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400">Slide Deck — Click inside, then use ← → keys</h2>
        </div>

        {/* Canva Slide Deck Embed */}
        <div
          className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/60 shadow-xl dark:shadow-black/30 mb-2"
          style={{ position: 'relative', paddingTop: '56.25%', background: '#1e293b' }}
        >
          <iframe
            src="https://www.canva.com/design/DAHDJg5iiCY/Gi3XhtgBU5uN3PlZuhELgg/view?embed"
            allowFullScreen
            allow="fullscreen"
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            title="The FinTech Security Imperative — Slide Deck"
          />
          {/* Click-to-activate overlay */}
          {!slideActivated && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-end pb-5 cursor-pointer"
              style={{ background: 'transparent' }}
              onClick={() => setSlideActivated(true)}
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-semibold border border-white/20">
                <Mouse className="w-3.5 h-3.5" />
                Click presentation, then use ← → arrow keys to navigate
              </div>
            </div>
          )}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-center mb-4">
          Tip: click anywhere inside the slides first, then press ← → to flip pages
        </p>

        {/* Info + download bar */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700/60 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800/60 p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 dark:bg-brand-500/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-accent-600 flex items-center justify-center shrink-0 shadow-lg shadow-brand-600/20">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold tracking-widest uppercase text-brand-600 dark:text-brand-400 mb-0.5">Full Programme Presentation</p>
              <h3 className="text-base font-black text-slate-900 dark:text-white leading-tight mb-1">
                The FinTech Security Imperative
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {['Module 1–5', 'PDPO · GDPR · HKMA', 'Case Studies', 'Deloitte-style'].map(tag => (
                  <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <a
              href={PPTX_FILE}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-brand-600/25 hover:-translate-y-0.5 shrink-0"
            >
              <Download className="w-4 h-4" />
              Download PPTX
            </a>
          </div>
        </div>
      </motion.section>

      {/* ── Programme Overview ─────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="h-0.5 w-6 bg-brand-600" />
          <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400">Programme Overview</h2>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
          Equipping FinTech leaders to own their security posture
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-3xl">
          GuardYourData is a practitioner-focused programme designed for non-technical managers operating in Hong Kong's
          FinTech sector. Over five progressive modules — spanning 30 minutes each — participants move from definitional
          foundations through to actionable governance frameworks, supported by live threat intelligence, 50 progressive
          assessment questions, and case studies drawn from publicly reported incidents.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { v: '5', l: 'Deep-dive modules' },
            { v: '50', l: 'MCQ questions' },
            { v: '3 hrs', l: 'Total learning time' },
            { v: '100%', l: 'Self-paced' },
          ].map(s => (
            <div key={s.l} className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-900/50 p-4 text-center">
              <div className="text-2xl font-black text-brand-600 dark:text-brand-400 mb-1">{s.v}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{s.l}</div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Module Timeline ────────────────────────────── */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-0.5 w-6 bg-brand-600" />
          <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400">Module Journey</h2>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
          From awareness to action — five stages
        </h3>

        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-7 top-10 bottom-10 w-px bg-gradient-to-b from-blue-500 via-amber-500 to-purple-500 opacity-20 hidden sm:block" />

          <div className="space-y-5">
            {TIMELINE.map((m, i) => (
              <motion.div
                key={m.number}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className={`relative rounded-2xl border ${m.border} ${m.bg} p-5 sm:pl-20`}
              >
                {/* Number badge */}
                <div className={`absolute left-4 top-5 sm:left-5 w-9 h-9 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white shadow-md`}>
                  {m.icon}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                        Module {m.number} · {m.subtitle}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white mb-2">{m.title}</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{m.summary}</p>
                  </div>
                  {/* Stat chip */}
                  <div className="sm:shrink-0 sm:text-right">
                    <div className={`inline-flex flex-col items-center sm:items-end bg-white/70 dark:bg-slate-900/50 rounded-xl px-3 py-2 border ${m.border}`}>
                      <span className="text-xl font-black text-slate-900 dark:text-white leading-none">{m.stat.value}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 max-w-[120px] text-center sm:text-right leading-snug">{m.stat.label}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-3">
                  <a href={`/module/${parseInt(m.number)}`} className="flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                    Open module <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Key Findings ───────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="h-0.5 w-6 bg-brand-600" />
          <h2 className="text-xs font-bold tracking-[0.18em] uppercase text-slate-500 dark:text-slate-400">Key Findings</h2>
        </div>
        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8">
          Four findings every FinTech leader must act on
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          {FINDINGS.map((f, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUp}
              className="rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/50 p-6"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h4 className="text-sm font-black text-slate-900 dark:text-white mb-2 leading-snug">{f.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ── Conclusion ─────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 border border-slate-700/60 p-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-600/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-600/10 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-0.5 w-6 bg-brand-400" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-brand-400">Conclusion</span>
            </div>
            <h3 className="text-2xl font-black text-white mb-4 leading-tight">
              Security is a board-level conversation,<br className="hidden sm:block" /> not an IT ticket.
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl mb-6">
              The organisations that recover fastest from incidents are not necessarily those with the most advanced
              technology. They are the ones where every layer of the business — from the help desk to the boardroom —
              understands its role, has rehearsed its response, and treats data as the strategic asset it is.
              This programme exists to make that outcome more likely for you and your team.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="/module/1" className="flex items-center gap-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl transition-all">
                Start Module 1 <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="/pptx/The_FinTech_Security_Imperative.pptx"
                download
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Download Slides
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer note */}
      <p className="text-[11px] text-slate-400 dark:text-slate-600 text-center">
        GuardYourData · FIN7900 Individual Assignment · March 2026 · All statistics sourced from IBM Cost of a Data Breach Report 2024, PDPO, HKMA C-RAF, and Verizon DBIR 2024.
      </p>
    </div>
  )
}
