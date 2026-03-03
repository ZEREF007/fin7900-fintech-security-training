import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trophy, BookOpen, Brain, BarChart2, ArrowRight, Star } from 'lucide-react'
import QuickTips from '../components/QuickTips'

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
            Congratulations on completing the <strong className="text-slate-900 dark:text-white">FIN7900 FinTech Security Training</strong> programme. You now have a solid understanding of data breach prevention and cybersecurity in FinTech.
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
            <BarChart2 className="w-5 h-5" /> View My Dashboard
          </Link>
          <Link to="/glossary" className="btn-secondary justify-center py-4 text-base">
            <BookOpen className="w-5 h-5" /> Browse Glossary
          </Link>
        </motion.div>

        {/* Quick Tips */}
        <QuickTips tips={THANKYOU_TIPS} title="Your Next Steps After Completing This Course" />

        {/* Footer message */}
        <motion.div variants={itemVariants} className="text-center mt-8 text-slate-500 dark:text-slate-600 text-sm">
          <p>FIN7900 Individual Assignment — Hong Kong Baptist University</p>
          <p className="mt-1">FinTech Security Training Platform</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
