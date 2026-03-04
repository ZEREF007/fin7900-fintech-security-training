import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy, BookOpen, Brain, BarChart2, ArrowRight, Star, GraduationCap, Heart } from 'lucide-react'
import QuickTips from '../components/QuickTips'

// ── Confetti piece ──────────────────────────────────────────
const COLORS = ['#6366f1','#f59e0b','#10b981','#ef4444','#8b5cf6','#ec4899','#3b82f6','#f97316']
const PIECES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  delay: Math.random() * 3,
  duration: 2.5 + Math.random() * 3,
  size: 6 + Math.random() * 8,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  rotate: Math.random() * 360,
  shape: Math.random() > 0.5 ? 'rounded-sm' : 'rounded-full',
}))

function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {PIECES.map(p => (
        <motion.div
          key={p.id}
          className={p.shape}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size * (Math.random() > 0.5 ? 1 : 0.5),
            background: p.color,
            rotate: p.rotate,
          }}
          animate={{ y: typeof window !== 'undefined' ? window.innerHeight + 100 : 900, rotate: p.rotate + 360 * 3 }}
          transition={{ delay: p.delay, duration: p.duration, ease: 'linear', repeat: 1, repeatDelay: 1 }}
        />
      ))}
    </div>
  )
}

const modules = [
  { num: 1, title: 'What is a Data Breach?', icon: '📖', color: 'from-blue-600 to-indigo-600' },
  { num: 2, title: 'Root Causes and Attack Vectors', icon: '🔍', color: 'from-red-600 to-rose-600' },
  { num: 3, title: 'Business Impact Analysis', icon: '📊', color: 'from-amber-600 to-orange-600' },
  { num: 4, title: 'Mitigation Strategies', icon: '🛡️', color: 'from-emerald-600 to-teal-600' },
  { num: 5, title: 'Real-World Case Studies', icon: '📋', color: 'from-purple-600 to-violet-600' },
]

const achievements = [
  { icon: '📖', label: '5 Modules Completed' },
  { icon: '🧩', label: '50 Practice MCQs' },
  { icon: '🧠', label: '30 Quiz Questions' },
  { icon: '🎮', label: 'Security Game' },
  { icon: '📚', label: '37 Glossary Terms' },
  { icon: '⚖️', label: 'Laws and Regulations' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

const THANKYOU_TIPS = [
  'Take one idea from every module and write it as a one-sentence action for your organisation. Five sentences. One week to act on them',
  'Send your quiz score to your manager or professor as proof of completion. A screenshot of the dashboard works perfectly',
  'Schedule a 15-minute team briefing to share the three things you found most surprising in this course',
  'Set a reminder to retake the quiz in one month to see how much of the material you have retained',
  'Bookmark the PCPD website and the IBM Cost of a Data Breach annual report. Read each once a year to stay current',
  'If your organisation does not have an incident response plan, offer to help create one. You now have enough knowledge to start',
]

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
      <Confetti />
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-600/10 dark:bg-brand-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 dark:bg-purple-600/8 rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl w-full relative z-10"
      >
        {/* Trophy */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-600/30">
              <Trophy className="w-14 h-14 text-white" />
            </div>
            {/* Stars */}
            {[-60, 0, 60].map((x, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ top: -10, left: `calc(50% + ${x}px)` }}
                animate={{ y: [-4, 4, -4], rotate: [0, 15, 0] }}
                transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
              >
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </motion.div>
            ))}
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4">
            🎉 Course <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Complete!</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed max-w-2xl mx-auto">
            Congratulations on completing the <strong className="text-slate-900 dark:text-white">GuardYourData</strong> programme. You now have a solid understanding of data breach prevention and cybersecurity in FinTech.
          </p>
        </motion.div>

        {/* Achievements */}
        <motion.div variants={itemVariants} className="mb-10">
          <h2 className="text-center text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest mb-4">What you've achieved</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {achievements.map((a, i) => (
              <div key={i} className="card text-center py-4">
                <div className="text-2xl mb-2">{a.icon}</div>
                <div className="text-slate-900 dark:text-white text-xs font-semibold">{a.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Modules recap */}
        <motion.div variants={itemVariants} className="mb-10">
          <h2 className="text-center text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest mb-4">Modules Covered</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {modules.map(m => (
              <Link
                key={m.num}
                to={`/module/${m.num}`}
                className="flex items-center gap-3 card hover:-translate-y-1 transition-transform group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-lg shrink-0`}>
                  {m.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-slate-400 text-xs mb-0.5">Module {m.num}</div>
                  <div className="text-slate-900 dark:text-white text-sm font-semibold truncate">{m.title}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-600 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/quiz" className="btn-primary justify-center py-4 text-base">
            <Brain className="w-5 h-5" /> Take the Final Quiz
          </Link>
          <Link to="/dashboard" className="btn-secondary justify-center py-4 text-base">
            <BarChart2 className="w-5 h-5" /> My Progress
          </Link>
          <Link to="/glossary" className="btn-secondary justify-center py-4 text-base">
            <BookOpen className="w-5 h-5" /> Browse Glossary
          </Link>
        </motion.div>

        {/* Quick Tips */}
        <QuickTips tips={THANKYOU_TIPS} title="Your Next Steps After Completing This Course" />

        {/* Professor Thank You */}
        <motion.div
          variants={itemVariants}
          className="mt-10 rounded-3xl border border-amber-200/60 dark:border-amber-700/30 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950/30 dark:via-amber-950/20 dark:to-slate-900 p-8 text-center shadow-sm"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
            A Special Thank You
          </h3>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed max-w-lg mx-auto">
            A heartfelt thank you to{' '}
            <span className="font-bold text-amber-600 dark:text-amber-400">Professor Emil</span>{' '}
            for the opportunity to explore this topic and for the guidance throughout the course.
            Your passion for cybersecurity and FinTech made this an incredibly worthwhile learning journey.
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-4 text-amber-500">
            {[0,1,2,3,4].map(i => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ delay: i * 0.15, duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
              >
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </motion.div>
            ))}
          </div>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-amber-600 dark:text-amber-400"
          >
            <Heart className="w-4 h-4 fill-current" /> Made with care for this course
          </motion.div>
        </motion.div>

        {/* Footer message */}
        <motion.div variants={itemVariants} className="text-center mt-8 text-slate-500 dark:text-slate-600 text-sm">
          <p className="mt-1">GuardYourData Training Platform</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-700">This platform originated as an academic project and has since grown into a standalone professional learning resource.</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
