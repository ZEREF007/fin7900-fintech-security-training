import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Cell,
} from 'recharts'
import { Trophy, Zap, BookOpen, Target, TrendingUp, Calendar, LogIn, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'
import QuickTips from '../components/QuickTips'

const DASHBOARD_TIPS = [
  'Complete all 5 modules to unlock a full picture of your coverage. The dashboard tracks which ones you have visited',
  'Aim for at least 80% on the quiz. It means you genuinely understand the material, not just that you guessed well',
  'Come back and retake the quiz after a week. Research shows spacing out practice improves how much you retain long-term',
  'Share your quiz score with your manager or professor as evidence of your security training completion',
]

const ALL_PAGES = [
  { page: '/',        label: 'Overview',     emoji: '🏠' },
  { page: '/module/1', label: 'Module 1',    emoji: '📖' },
  { page: '/module/2', label: 'Module 2',    emoji: '🔍' },
  { page: '/module/3', label: 'Module 3',    emoji: '📊' },
  { page: '/module/4', label: 'Module 4',    emoji: '🛡️' },
  { page: '/module/5', label: 'Module 5',    emoji: '📋' },
  { page: '/quiz',     label: 'Quiz',        emoji: '🧠' },
  { page: '/game',     label: 'Game',        emoji: '🎮' },
  { page: '/glossary', label: 'Glossary',    emoji: '📚' },
  { page: '/live',     label: 'Live Threats', emoji: '🔴' },
]

interface ProgressData {
  visits: { page: string; visited_at: string }[]
  quizBest: { best_pct: number | null; attempts: number }
  gameBest: { best_score: number | null; attempts: number }
  quizHistory: { score: number; total: number; pct: number; passed: number; taken_at: string; filter: string }[]
  gameHistory: { score: number; correct: number; total: number; rank: string; played_at: string }[]
  created_at: string | null
}

export default function DashboardPage() {
  const { user, token } = useAuth()
  const [data, setData] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) { setLoading(false); return }
    fetch('/api/progress', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [token])

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <LogIn className="w-12 h-12 text-brand-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-2xl mb-2">Sign in to track your progress</h2>
          <p className="text-slate-400 text-base mb-6">Create an account to see your overall learning score, module completion, quiz history, and personalised next steps.</p>
          <Link to="/auth" className="btn-primary justify-center">Sign In / Register</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  const visitedPages = new Set(data?.visits.map(v => v.page) || [])
  const modulesVisited = ['/module/1', '/module/2', '/module/3', '/module/4', '/module/5'].filter(p => visitedPages.has(p)).length
  const pagesVisited = visitedPages.size
  const moduleProgress = (modulesVisited / 5) * 100

  const quizHistory = data?.quizHistory || []
  const chartData = quizHistory.slice(0, 8).reverse().map((q, i) => ({
    attempt: `#${i + 1}`,
    score: q.pct,
    passed: q.passed,
  }))

  const radialData = [
    { name: 'Modules', value: moduleProgress, fill: '#6366f1' },
  ]

  const bestQuiz = data?.quizBest.best_pct ?? 0
  const quizAttempts = data?.quizBest.attempts ?? 0
  const bestGame = data?.gameBest.best_score ?? 0
  const gameAttempts = data?.gameBest.attempts ?? 0

  const gradeLabel = bestQuiz >= 90 ? 'Distinction' : bestQuiz >= 70 ? 'Credit' : bestQuiz >= 50 ? 'Pass' : bestQuiz > 0 ? 'Attempting' : '—'
  const gradeColor = bestQuiz >= 90 ? 'text-emerald-400' : bestQuiz >= 70 ? 'text-blue-400' : bestQuiz >= 50 ? 'text-amber-400' : 'text-slate-400'

  // Overall progress score: modules 60% + best quiz 40%
  const overallPct = Math.round((modulesVisited / 5) * 60 + (bestQuiz / 100) * 40)
  const overallLabel =
    overallPct >= 90 ? '🏆 Distinction' :
    overallPct >= 70 ? '⭐ Credit' :
    overallPct >= 50 ? '✅ Pass' :
    overallPct > 0  ? '📚 In progress' : '🚀 Get started'

  const nextStep =
    modulesVisited < 5
      ? { label: `Read Module ${modulesVisited + 1}`, to: `/module/${modulesVisited + 1}`, icon: '📖' }
      : bestQuiz < 70
        ? { label: 'Improve your quiz score', to: '/quiz', icon: '🧠' }
        : { label: 'Browse the Glossary', to: '/glossary', icon: '📚' }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-brand-950/40 to-slate-900 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div className="text-white font-bold text-lg">{user.name}</div>
              <div className="text-slate-400 text-xs">{user.email}</div>
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white mt-4 mb-1">My Progress 📈</h1>
          <p className="text-slate-300 text-lg">Track how much you have learnt — modules studied, quiz results, and activities completed.</p>

          {/* Overall progress + next step */}
          <div className="mt-6 flex flex-wrap gap-4 items-stretch">
            {/* Score ring card */}
            <div className="flex items-center gap-5 bg-white/5 border border-white/10 rounded-2xl px-6 py-5">
              <div className="relative w-20 h-20 shrink-0">
                <svg viewBox="0 0 36 36" className="w-20 h-20 -rotate-90">
                  <circle cx="18" cy="18" r="15.9154" fill="none" stroke="#1e293b" strokeWidth="2.5" />
                  <circle
                    cx="18" cy="18" r="15.9154" fill="none" stroke="#6366f1" strokeWidth="2.5"
                    strokeDasharray={`${overallPct} 100`} strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-extrabold text-sm">{overallPct}%</span>
                </div>
              </div>
              <div>
                <div className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-1">Overall Score</div>
                <div className="text-white font-extrabold text-3xl leading-none">{overallPct}%</div>
                <div className="text-brand-400 text-base font-semibold mt-1">{overallLabel}</div>
                <div className="text-slate-500 text-xs mt-1">Modules 60 · Quiz 40</div>
              </div>
            </div>

            {/* Next step CTA */}
            <div className="flex items-center gap-4 bg-brand-600/20 border border-brand-500/30 rounded-2xl px-6 py-5 flex-1 min-w-[200px]">
              <span className="text-4xl shrink-0">{nextStep.icon}</span>
              <div>
                <div className="text-slate-400 text-sm font-semibold uppercase tracking-wide mb-1">Suggested Next Step</div>
                <div className="text-white font-bold text-xl leading-tight">{nextStep.label}</div>
                <Link to={nextStep.to} className="inline-flex items-center gap-1 text-brand-400 hover:text-brand-300 text-base font-medium mt-2 transition-colors">
                  Go there <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Pages Visited', value: pagesVisited, sub: `of ${ALL_PAGES.length} pages`, color: 'text-blue-400' },
            { icon: Target, label: 'Modules Done', value: `${modulesVisited}/5`, sub: `${Math.round(moduleProgress)}% complete`, color: 'text-indigo-400' },
            { icon: Trophy, label: 'Best Quiz Score', value: bestQuiz ? `${bestQuiz}%` : '—', sub: gradeLabel, color: gradeColor },
            { icon: Zap, label: 'Best Game Score', value: bestGame || '—', sub: `${gameAttempts} attempt${gameAttempts !== 1 ? 's' : ''}`, color: 'text-amber-400' },
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card text-center"
            >
              <kpi.icon className={clsx('w-6 h-6 mx-auto mb-2', kpi.color)} />
              <div className={clsx('text-2xl font-extrabold', kpi.color)}>{kpi.value}</div>
              <div className="text-white text-xs font-semibold mt-1">{kpi.label}</div>
              <div className="text-slate-500 text-[11px] mt-0.5">{kpi.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* Module progress + Quiz history */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Module completion radial */}
          <div className="card">
            <h2 className="text-white font-bold mb-4">Module Completion</h2>
            <div className="flex items-center gap-6">
              <div className="w-36 h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart innerRadius="60%" outerRadius="90%" data={radialData} startAngle={90} endAngle={-270}>
                    <RadialBar dataKey="value" cornerRadius={8} background={{ fill: '#1e293b' }}>
                      {radialData.map((_, i) => <Cell key={i} fill="#6366f1" />)}
                    </RadialBar>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1">
                {[1, 2, 3, 4, 5].map(n => {
                  const done = visitedPages.has(`/module/${n}`)
                  return (
                    <div key={n} className="flex items-center gap-3 mb-2">
                      <div className={clsx('w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0', done ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-500')}>
                        {done ? '✓' : n}
                      </div>
                      <span className={clsx('text-xs', done ? 'text-white' : 'text-slate-500')}>
                        Module {n}
                      </span>
                      {!done && (
                        <Link to={`/module/${n}`} className="text-[10px] text-brand-400 hover:text-brand-300 ml-auto">Start →</Link>
                      )}
                    </div>
                  )
                })}
                <div className="mt-3 pt-3 border-t border-slate-700/50 text-center">
                  <span className="text-brand-400 font-bold text-xl">{Math.round(moduleProgress)}%</span>
                  <span className="text-slate-500 text-xs ml-1">complete</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quiz history chart */}
          <div className="card">
            <h2 className="text-white font-bold mb-1">Quiz Score History</h2>
            <p className="text-slate-500 text-xs mb-4">{quizAttempts} attempt{quizAttempts !== 1 ? 's' : ''} total</p>
            {chartData.length === 0 ? (
              <div className="text-center py-10 text-slate-500">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No quiz attempts yet.</p>
                <Link to="/quiz" className="btn-primary mt-4 text-xs py-2 px-4 inline-flex">Take the Quiz →</Link>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="attempt" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#94a3b8' }}
                    formatter={(v: number) => [`${v}%`, 'Score']}
                  />
                  <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                    {chartData.map((d, i) => (
                      <Cell key={i} fill={d.passed ? '#6366f1' : '#ef4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pages visited */}
        <div className="card">
          <h2 className="text-white font-bold mb-4">Pages Visited</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
            {ALL_PAGES.map(p => {
              const done = visitedPages.has(p.page)
              return (
                <Link key={p.page} to={p.page} className={clsx(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all hover:-translate-y-1',
                  done
                    ? 'bg-brand-600/20 border-brand-500/40 text-brand-300'
                    : 'bg-slate-800/40 border-slate-700/50 text-slate-500 hover:text-slate-300',
                )}>
                  <span className="text-xl">{p.emoji}</span>
                  <span className="text-[11px] font-medium">{p.label}</span>
                  {done && <span className="text-[10px] text-emerald-400">✓</span>}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent game history */}
        {(data?.gameHistory?.length ?? 0) > 0 && (
          <div className="card">
            <h2 className="text-white font-bold mb-4">Recent Game Attempts</h2>
            <div className="space-y-2">
              {data!.gameHistory.slice(0, 5).map((g, i) => (
                <div key={i} className="flex items-center justify-between bg-slate-800/40 rounded-xl px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🎮</span>
                    <div>
                      <div className="text-white text-sm font-semibold">{g.correct}/{g.total} correct</div>
                      <div className="text-slate-500 text-xs">{new Date(g.played_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-400 font-bold">{g.score} pts</div>
                    <div className="text-slate-500 text-xs">{g.rank}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Member since */}
        {data?.created_at && (
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Calendar className="w-4 h-4" />
            Member since {new Date(data.created_at).toLocaleDateString('en-HK', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        )}

        {/* Quick Tips */}
        <QuickTips tips={DASHBOARD_TIPS} title="Making the Most of Your Progress" />
      </div>
    </motion.div>
  )
}
