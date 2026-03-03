import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { Users, BarChart2, Video, Save, Loader2, CheckCircle, Shield, Settings, TrendingUp, Copy, ExternalLink, CheckCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

const VIDEO_MODULES = [
  { id: 'overview', label: 'Overview / Introduction' },
  { id: 'module1', label: 'Module 1 — What is a Data Breach?' },
  { id: 'module2', label: 'Module 2 — Root Causes & Attack Vectors' },
  { id: 'module3', label: 'Module 3 — Business Impact Analysis' },
  { id: 'module4', label: 'Module 4 — Mitigation Strategies' },
  { id: 'module5', label: 'Module 5 — Real-World Case Studies' },
]

interface Stats {
  totals: { users: number; visits: number; quizzes: number; games: number }
  rates: { passRate: number; avgQuizPct: number; avgGameScore: number }
  recentUsers: { id: number; name: string; email: string; role: string; created_at: string; pages_visited: number }[]
  regTimeline: { day: string; count: number }[]
  scoreBuckets: { below40: number; p40_70: number; p70_90: number; above90: number }
}

export default function AdminPage() {
  const { user, token } = useAuth()
  const nav = useNavigate()

  const [stats, setStats] = useState<Stats | null>(null)
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const [tab, setTab] = useState<'stats' | 'videos' | 'users' | 'setup'>('stats')
  const [copied, setCopied] = useState(false)

  const GA_SNIPPET = `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`

  const copyGA = () => {
    navigator.clipboard.writeText(GA_SNIPPET)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') { nav('/'); return }
    const h = { Authorization: `Bearer ${token}` }

    fetch('/api/admin/stats', { headers: h }).then(r => r.json()).then(setStats)
    fetch('/api/admin/videos', { headers: h }).then(r => r.json()).then(d => {
      const map: Record<string, string> = {}
      d.videos?.forEach((v: { module_id: string; url: string }) => { map[v.module_id] = v.url })
      setVideoUrls(map)
    })
  }, [user, token, nav])

  const saveVideo = async (moduleId: string) => {
    setSavingId(moduleId)
    await fetch(`/api/admin/videos/${moduleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url: videoUrls[moduleId] || '' }),
    })
    setSavingId(null)
    setSavedId(moduleId)
    setTimeout(() => setSavedId(null), 2000)
  }

  const scoreBucketsData = stats ? [
    { label: '< 40%', value: stats.scoreBuckets.below40, fill: '#ef4444' },
    { label: '40–70%', value: stats.scoreBuckets.p40_70, fill: '#f59e0b' },
    { label: '70–90%', value: stats.scoreBuckets.p70_90, fill: '#6366f1' },
    { label: '≥ 90%', value: stats.scoreBuckets.above90, fill: '#10b981' },
  ] : []

  if (!user || user.role !== 'admin') return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-brand-400" />
            <div>
              <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">FinTech Security Training — Administrator</p>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex gap-2 mt-6 flex-wrap">
            {[
              { id: 'stats',  label: '📊 Analytics', icon: BarChart2 },
              { id: 'videos', label: '🎥 Videos',    icon: Video },
              { id: 'users',  label: '👥 Users',     icon: Users },
              { id: 'setup',  label: '⚙️ Setup',     icon: Settings },
            ].map(t => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.id as 'stats' | 'videos' | 'users' | 'setup')}
                className={clsx(
                  'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  tab === t.id
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-700/60',
                )}
              >
                {t.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── STATS TAB ── */}
        {tab === 'stats' && (
          <div className="space-y-8">
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats && [
                { label: 'Total Users',   value: stats.totals.users,   emoji: '👥', color: 'text-blue-400',   bg: 'from-blue-600/10 to-blue-600/0' },
                { label: 'Page Visits',   value: stats.totals.visits,  emoji: '👁️', color: 'text-indigo-400', bg: 'from-indigo-600/10 to-indigo-600/0' },
                { label: 'Quiz Attempts', value: stats.totals.quizzes, emoji: '🧠', color: 'text-purple-400', bg: 'from-purple-600/10 to-purple-600/0' },
                { label: 'Game Attempts', value: stats.totals.games,   emoji: '🎮', color: 'text-amber-400',  bg: 'from-amber-600/10 to-amber-600/0' },
              ].map((k, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`card text-center bg-gradient-to-b ${k.bg}`}
                >
                  <div className="text-3xl mb-2">{k.emoji}</div>
                  <div className={clsx('text-4xl font-extrabold tabular-nums', k.color)}>{k.value}</div>
                  <div className="text-slate-400 text-xs mt-1.5 font-medium">{k.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Rate cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Quiz Pass Rate',     value: `${stats.rates.passRate}%`,    color: stats.rates.passRate >= 70 ? 'text-emerald-400' : 'text-amber-400', icon: '🏆' },
                  { label: 'Average Quiz Score', value: `${stats.rates.avgQuizPct}%`,  color: 'text-brand-400', icon: '📊' },
                  { label: 'Average Game Score', value: stats.rates.avgGameScore,      color: 'text-purple-400', icon: '🎮' },
                ].map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="card text-center"
                  >
                    <div className="text-2xl mb-2">{r.icon}</div>
                    <div className={clsx('text-4xl font-extrabold', r.color)}>{r.value}</div>
                    <div className="text-slate-400 text-xs mt-1.5 font-medium">{r.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Score distribution */}
            {stats && (
              <div className="card">
                <h2 className="text-white font-bold mb-4">Quiz Score Distribution</h2>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={scoreBucketsData} margin={{ left: -20 }}>
                    <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {scoreBucketsData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Registration timeline */}
            {stats && stats.regTimeline.length > 0 && (
              <div className="card">
                <h2 className="text-white font-bold mb-4">Registrations (Last 14 Days)</h2>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={stats.regTimeline} margin={{ left: -20 }}>
                    <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {!stats && (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
              </div>
            )}
          </div>
        )}

        {/* ── VIDEOS TAB ── */}
        {tab === 'videos' && (
          <div className="space-y-4">
            <div className="bg-blue-950/30 border border-blue-700/30 rounded-2xl p-4 text-blue-200 text-sm mb-6">
              💡 Enter a YouTube URL or embed URL for each module. Leave blank to show "Coming Soon". Changes take effect immediately for all users.
            </div>
            {VIDEO_MODULES.map(mod => (
              <div key={mod.id} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <Video className="w-5 h-5 text-brand-400" />
                  <span className="text-white font-semibold text-sm">{mod.label}</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={videoUrls[mod.id] || ''}
                    onChange={e => setVideoUrls(prev => ({ ...prev, [mod.id]: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=…"
                    className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-2.5 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/60 transition-all"
                  />
                  <button
                    onClick={() => saveVideo(mod.id)}
                    disabled={savingId === mod.id}
                    className={clsx(
                      'btn-primary py-2.5 px-5 text-sm shrink-0 disabled:opacity-50',
                      savedId === mod.id && 'bg-emerald-600 border-emerald-500',
                    )}
                  >
                    {savingId === mod.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : savedId === mod.id
                        ? <><CheckCircle className="w-4 h-4" /> Saved</>
                        : <><Save className="w-4 h-4" /> Save</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === 'users' && (
          <div className="card overflow-x-auto">
            <h2 className="text-white font-bold mb-4">Recent Users</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-700/50">
                  <th className="text-left py-2 pr-4 font-semibold">Name</th>
                  <th className="text-left py-2 pr-4 font-semibold">Email</th>
                  <th className="text-left py-2 pr-4 font-semibold">Role</th>
                  <th className="text-left py-2 pr-4 font-semibold">Pages</th>
                  <th className="text-left py-2 font-semibold">Joined</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentUsers.map(u => (
                  <tr key={u.id} className="border-b border-slate-800/40 last:border-0">
                    <td className="py-2.5 pr-4 text-white font-medium">{u.name}</td>
                    <td className="py-2.5 pr-4 text-slate-400">{u.email}</td>
                    <td className="py-2.5 pr-4">
                      <span className={clsx(
                        'px-2 py-0.5 rounded-full text-xs font-semibold',
                        u.role === 'admin' ? 'bg-brand-600/30 text-brand-300' : 'bg-slate-700/50 text-slate-400',
                      )}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 pr-4 text-slate-300">{u.pages_visited}</td>
                    <td className="py-2.5 text-slate-500 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!stats && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
              </div>
            )}
          </div>
        )}
        {/* ── SETUP TAB ── */}
        {tab === 'setup' && (
          <div className="space-y-6">
            {/* GA4 Setup */}
            <div className="card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">Google Analytics 4 (GA4)</h2>
                  <p className="text-slate-400 text-xs">Track page views, user engagement, quiz completions and more</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Steps */}
                {[
                  { num: 1, title: 'Create a GA4 Property', body: 'Go to analytics.google.com → click Admin (gear icon) → Create Property. Choose Web, enter your site URL.' },
                  { num: 2, title: 'Get your Measurement ID', body: 'In your property: Admin → Data Streams → click your web stream. Copy the Measurement ID — it looks like G-XXXXXXXXXX.' },
                  { num: 3, title: 'Add the tracking script', body: 'Open client/index.html in this project. Find the commented-out Google Analytics block and uncomment it. Replace both G-XXXXXXXXXX values with your real Measurement ID.' },
                  { num: 4, title: 'Rebuild and push', body: 'Run: cd client && npm run build  — then commit and push. GitHub Actions will deploy it to Render automatically.' },
                ].map(step => (
                  <div key={step.num} className="flex gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{step.num}</div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">{step.title}</div>
                      <div className="text-slate-400 text-sm leading-relaxed">{step.body}</div>
                    </div>
                  </div>
                ))}

                {/* Code snippet */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Snippet to paste in client/index.html</span>
                    <motion.button
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={copyGA}
                      className={clsx('flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all', copied ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600')}
                    >
                      {copied ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                    </motion.button>
                  </div>
                  <pre className="bg-slate-950 border border-slate-700/50 rounded-xl p-4 text-xs text-emerald-300 overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap">
{`<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`}
                  </pre>
                </div>

                <a
                  href="https://analytics.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex text-sm"
                >
                  <ExternalLink className="w-4 h-4" /> Open Google Analytics
                </a>
              </div>
            </div>

            {/* Render Deploy Hook */}
            <div className="card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center shrink-0">
                  <Settings className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">Auto-Deploy Webhook (Render)</h2>
                  <p className="text-slate-400 text-xs">Every push to GitHub triggers a live deploy automatically</p>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { num: 1, text: 'Deploy to Render (render.com → New → Web Service → connect your GitHub repo)' },
                  { num: 2, text: 'In Render dashboard: Settings → Deploy Hook → copy the URL' },
                  { num: 3, text: 'In GitHub: repo Settings → Secrets → New secret → name: RENDER_DEPLOY_HOOK_URL → paste the URL' },
                  { num: 4, text: 'Done. Every git push now rebuilds and deploys your site automatically in ~2 minutes' },
                ].map(s => (
                  <div key={s.num} className="flex gap-3 text-sm text-slate-400">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 text-xs font-bold flex items-center justify-center shrink-0">{s.num}</span>
                    {s.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
