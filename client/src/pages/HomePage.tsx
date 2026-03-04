import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, BookOpen, Target, Award, Clock, ChevronRight, Play, CheckCircle } from 'lucide-react'
import { MODULES } from '../data/modules'
import clsx from 'clsx'
import QuickTips from '../components/QuickTips'

const STATS = [
  { value: 'US$4.45M', label: 'Average cost of one data breach (IBM 2024)', icon: '💸' },
  { value: '277 days', label: 'How long a typical breach goes undetected', icon: '⏱' },
  { value: '83%', label: 'Companies that were breached more than once', icon: '🔄' },
  { value: '74%', label: 'Breaches that start with a human mistake', icon: '👤' },
]

const FEATURES = [
  { icon: <BookOpen className="w-5 h-5" />, title: '5 Deep-Dive Modules', desc: 'From the basics of a breach to real-world case studies. No technical background needed.' },
  { icon: <Target className="w-5 h-5" />, title: '50 Practice Questions', desc: '10 questions per module with instant feedback and plain-English explanations.' },
  { icon: <Award className="w-5 h-5" />, title: '30-Question Final Quiz', desc: 'Three difficulty levels: Basic, Intermediate and Advanced, with your score tracked.' },
  { icon: <Clock className="w-5 h-5" />, title: '3-Hour Programme', desc: 'Learn at your own pace. Start, pause and come back whenever suits you.' },
]

const OUTCOMES = [
  'Spot a phishing email before it reaches your team',
  'Know exactly what to do inside the first 24 hours of a breach',
  'Understand which Hong Kong laws apply to your organisation',
  'Put real security controls in place without hiring a security team',
  'Read an incident report and act on it with confidence',
]

const MODULE_COLORS: Record<number, string> = {
  1: 'from-blue-600 to-indigo-700',
  2: 'from-red-600 to-rose-700',
  3: 'from-amber-600 to-orange-700',
  4: 'from-emerald-600 to-teal-700',
  5: 'from-purple-600 to-violet-700',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

function ModuleCard({ mod, index }: { mod: typeof MODULES[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      <Link
        to={`/module/${mod.number}`}
        className="group block card hover:shadow-xl dark:hover:shadow-black/20 transition-all duration-300 h-full"
      >
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 bg-gradient-to-br', MODULE_COLORS[mod.number])}>
          {mod.icon}
        </div>
        <div className="badge badge-blue mb-2">Module {mod.number}</div>
        <h3 className="text-slate-900 dark:text-white font-bold text-base mb-1 group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">{mod.title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-4">{mod.subtitle}</p>
        <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>⏱ {mod.duration}</span>
          <span>{mod.objectives.length} objectives</span>
          <span className="flex items-center gap-1 text-brand-500 dark:text-brand-400 group-hover:gap-2 transition-all">
            Start <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}

const HOME_TIPS = [
  'Visit haveibeenpwned.com right now and check whether your work email has already appeared in a data breach',
  'Turn on two-step login (also called MFA or 2FA) for your email, banking and any financial app you use today',
  'Use a password manager such as 1Password or Bitwarden so every account has its own strong, unique password',
  'Set a screen lock on every device you use for work, including your phone, so lost devices cannot be accessed by strangers',
  'Never click a link in an unexpected email. Type the website address directly into your browser instead',
  'Tell one colleague about this training after you finish. The more people in your organisation who know this, the safer everyone is',
]

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">

      {/* Hero */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center mb-16"
      >
        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-100 dark:bg-brand-900/40 border border-brand-200 dark:border-brand-700/40 rounded-full text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6">
          <Shield className="w-3.5 h-3.5" />
          GuardYourData
        </motion.div>

        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
          This course is for you.
          <br />
          <span className="bg-gradient-to-r from-brand-500 to-accent-400 bg-clip-text text-transparent">
            You will leave prepared.
          </span>
        </motion.h1>

        <motion.p variants={fadeUp} className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto mb-6 leading-relaxed">
          You do not need a technical background to protect your organisation. This programme gives you the knowledge, the language and the practical steps to stop a breach before it happens, and respond confidently if one does.
        </motion.p>

        <motion.div variants={fadeUp} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/40 rounded-2xl p-6 max-w-2xl mx-auto mb-8">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-4">After completing this programme, you will be able to:</p>
          <ul className="space-y-2 text-left">
            {OUTCOMES.map((o, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                {o}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/module/1" className="btn-primary text-sm">
            <Play className="w-4 h-4" /> Start Module 1
          </Link>
          <Link to="/quiz" className="btn-secondary text-sm">
            🧠 Take the Quiz
          </Link>
        </motion.div>
      </motion.div>

      {/* Video section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-xl dark:shadow-black/30"
        style={{ aspectRatio: '16/9', background: '#0f0c3c' }}
      >
        <iframe
          src="https://www.youtube.com/embed/iBBK7T7NQHI?autoplay=1&mute=1&loop=1&playlist=iBBK7T7NQHI&rel=0&modestbranding=1"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="FinTech Security Overview"
        />
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
      >
        {STATS.map((s, i) => (
          <motion.div key={i} variants={fadeUp} className="stat-card">
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-1">{s.value}</div>
            <div className="text-slate-500 dark:text-slate-400 text-xs leading-tight">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Why this matters to YOU */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 rounded-3xl bg-gradient-to-br from-brand-600 to-accent-600 p-10 text-center shadow-xl shadow-brand-600/20"
      >
        <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-3">Why this matters to you personally</p>
        <h2 className="text-2xl sm:text-3xl font-black text-white mb-4">
          74% of breaches start with a person, not a system.
        </h2>
        <p className="text-white/90 max-w-xl mx-auto text-sm leading-relaxed">
          That means the most powerful security tool in your organisation is not software. It is you. When you recognise an attack, say something about a suspicious email, or insist on proper controls, you make your entire company safer.
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16"
      >
        {FEATURES.map((f, i) => (
          <motion.div key={i} variants={fadeUp} whileHover={{ y: -3 }} className="card text-center">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/60 border border-brand-200 dark:border-brand-700/30 flex items-center justify-center text-brand-600 dark:text-brand-400 mx-auto mb-3">
              {f.icon}
            </div>
            <h3 className="text-slate-900 dark:text-white font-bold text-sm mb-2">{f.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Modules grid */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Training Modules</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Work through all 5 modules to build a complete picture of FinTech security</p>
          </div>
          <Link to="/quiz" className="hidden sm:flex items-center gap-1 text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 text-sm font-semibold transition-colors">
            Take final quiz <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {MODULES.map((mod, i) => <ModuleCard key={mod.id} mod={mod} index={i} />)}
        </div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/30 p-10 text-center"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Ready to test what you know?</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-lg mx-auto text-sm">
          After working through the modules, take the 30-question final quiz and see your results on your personal dashboard.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link to="/quiz" className="btn-primary">🧠 Final MCQ Quiz</Link>
          <Link to="/dashboard" className="btn-secondary">📈 My Dashboard</Link>
          <Link to="/thankyou" className="btn-secondary">🎉 Course Complete</Link>
        </div>
      </motion.div>

      {/* Quick Tips */}
      <QuickTips tips={HOME_TIPS} title="6 Steps You Can Take Before You Finish Reading This Page" />
    </div>
  )
}
