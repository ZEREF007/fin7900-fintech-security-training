import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react'
import { MODULES } from '../data/modules'
import SlideViewer from '../components/SlideViewer'
import ModuleMCQ from '../components/ModuleMCQ'
import clsx from 'clsx'
import QuickTips from '../components/QuickTips'

const MODULE_TIPS: Record<number, string[]> = {
  1: [
    'Google your company name plus the words "data breach" to find out if you have been hit before',
    'Check your own email at haveibeenpwned.com to see if your data is already circulating online',
    'Ask your IT team today: "Do we have a written plan for what to do in the first hour of a breach?" If the answer is no, that is your next action',
    'Look at the PCPD website (pcpd.org.hk) to understand the 3-day mandatory breach reporting rule that now applies to your organisation',
  ],
  2: [
    'Never click a link in an unexpected email. Type the official address directly into your browser',
    'Turn on MFA (multi-factor authentication) for all work accounts today. It blocks over 99% of automated password attacks',
    'Ask your team: does everyone have a different password for every account? If not, a password manager like 1Password or Bitwarden fixes this for free',
    'Check that your organisation patches software within 30 days of a security update. Unpatched systems are the easiest entry point for attackers',
  ],
  3: [
    'Find out if your company holds data from EU citizens. If yes, GDPR applies to you even if you are based in Hong Kong',
    'Check whether your organisation has a valid PCI DSS certificate. If you process card payments without one, you face serious financial penalties',
    'Ask your compliance team when you last submitted a report under the HKMA Cyber Resilience Assessment Framework',
    'Read the PCPD guidance on mandatory breach notification so you know the exact steps before an incident happens',
  ],
  4: [
    'Enable MFA on every account your team uses today. This single step stops the majority of credential-based attacks',
    'Make sure your organisation encrypts sensitive data both in storage and during transfer. Ask your IT team to confirm this in writing',
    'Test your incident response plan with a tabletop exercise. Sit in a room, describe a breach scenario, and see what each person does. You will find the gaps',
    'Review who in your organisation has access to sensitive systems. Remove access for anyone who no longer needs it',
  ],
  5: [
    'Read the summary of the Equifax breach (2017) and ask yourself which of those mistakes your organisation could make today',
    'Check whether your organisation has done a penetration test in the last 12 months. If not, schedule one',
    'Look up the HKMA C-RAF framework and identify which of its 8 domains your organisation is weakest in',
    'Create a one-page incident response contact sheet and put it somewhere physical, not just digital, so it is accessible when systems are down',
  ],
}

export default function ModulePage() {
  const { id } = useParams()
  const num = parseInt(id ?? '1', 10)
  const mod = MODULES.find(m => m.number === num)

  if (!mod) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-white font-bold text-lg">Module not found</p>
          <Link to="/" className="btn-primary mt-4 inline-flex">Go Home</Link>
        </div>
      </div>
    )
  }

  const prevMod = MODULES.find(m => m.number === num - 1)
  const nextMod = MODULES.find(m => m.number === num + 1)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden mb-10 shadow-2xl shadow-black/30"
      >
        <img
          src={mod.heroImage}
          alt={mod.title}
          className="w-full h-64 object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent" />
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="badge badge-blue mb-3 w-fit">
            {mod.icon} Module {mod.number} · {mod.duration}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{mod.title}</h1>
          <p className="text-slate-300 text-base max-w-xl">{mod.subtitle}</p>

          {/* Key stats */}
          <div className="flex flex-wrap gap-4 mt-5">
            {mod.heroStats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl font-black text-white leading-none">{s.value}</div>
                <div className="text-slate-400 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Learning objectives */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <h2 className="section-title">🎯 Learning Objectives</h2>
        <p className="section-sub">After completing this module, you will be able to:</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {mod.objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-2.5 p-3 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span className="text-slate-300 text-sm">{obj}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Slide deck */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-10"
      >
        <h2 className="section-title">🎞 Slide Presentation</h2>
        <p className="section-sub">Navigate through key concepts using the arrows or dots below.</p>
        <SlideViewer slides={mod.slides} color={mod.color} />
      </motion.section>

      {/* Video section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.05 }}
        className="mb-10"
      >
        <h2 className="section-title">🎬 Module Video</h2>
        <p className="section-sub">Watch the instructor walkthrough for this module.</p>
        <div
          className="rounded-2xl overflow-hidden border border-slate-700/50 bg-slate-900/60 flex items-center justify-center"
          style={{ aspectRatio: '16/9' }}
          id={`${mod.id}VideoWrap`}
        >
          <div className="text-center text-slate-500">
            <div className="text-5xl mb-3">🎬</div>
            <p className="text-sm font-medium">Module {mod.number} — {mod.title}</p>
            <p className="text-xs mt-1">Video coming soon</p>
          </div>
        </div>
      </motion.section>

      {/* Key takeaways */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <div className="rounded-2xl bg-gradient-to-br from-brand-950/60 to-accent-900/30 border border-brand-700/30 p-8">
          <h2 className="text-xl font-bold text-white mb-5">🔑 Key Takeaways</h2>
          <ul className="space-y-3">
            {mod.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-brand-700/50 text-brand-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-300 text-sm leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* Mini MCQ Quiz */}
      <ModuleMCQ questions={mod.mcqs} moduleTitle={mod.title} />

      {/* Quick Tips */}
      <QuickTips tips={MODULE_TIPS[num] ?? MODULE_TIPS[1]} />

      {/* Module navigation */}
      <div className="mt-12 flex items-center justify-between gap-4">
        {prevMod ? (
          <Link
            to={`/module/${prevMod.number}`}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="text-left hidden sm:block">
              <div className="text-slate-400 text-xs">Previous</div>
              <div>Module {prevMod.number}: {prevMod.title}</div>
            </div>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <Link to="/" className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all text-sm">
            <ChevronLeft className="w-4 h-4" /> Overview
          </Link>
        )}

        {nextMod ? (
          <Link
            to={`/module/${nextMod.number}`}
            className={clsx('flex items-center gap-2 px-4 py-2.5 text-white rounded-xl transition-all text-sm font-medium bg-gradient-to-r', nextMod.color)}
          >
            <div className="text-right hidden sm:block">
              <div className="text-white/70 text-xs">Next</div>
              <div>Module {nextMod.number}: {nextMod.title}</div>
            </div>
            <span className="sm:hidden">Next Module</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <Link to="/quiz" className="btn-primary text-sm">
            🧠 Take Final Quiz <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}
