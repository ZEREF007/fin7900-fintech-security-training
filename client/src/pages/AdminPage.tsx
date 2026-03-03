import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import { Users, BarChart2, Video, Save, Loader2, CheckCircle, Shield } from 'lucide-react'
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
  const [tab, setTab] = useState<'stats' | 'videos' | 'users'>('stats')

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
          <div className="flex gap-2 mt-6">
            {[
              { id: 'stats', label: '📊 Analytics', icon: BarChart2 },
              { id: 'videos', label: '🎥 Videos', icon: Video },
              { id: 'users', label: '👥 Users', icon: Users },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as 'stats' | 'videos' | 'users')}
                className={clsx(
                  'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all',
                  tab === t.id ? 'bg-brand-600 text-white' : 'bg-slate-800/60 text-slate-400 hover:text-white',
                )}
              >
                {t.label}
              </button>
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
                { label: 'Total Users', value: stats.totals.users, emoji: '👥', color: 'text-blue-400' },
                { label: 'Page Visits', value: stats.totals.visits, emoji: '👁️', color: 'text-indigo-400' },
                { label: 'Quiz Attempts', value: stats.totals.quizzes, emoji: '🧠', color: 'text-purple-400' },
                { label: 'Game Attempts', value: stats.totals.games, emoji: '🎮', color: 'text-amber-400' },
              ].map((k, i) => (
                <div key={i} className="card text-center">
                  <div className="text-2xl mb-1">{k.emoji}</div>
                  <div className={clsx('text-3xl font-extrabold', k.color)}>{k.value}</div>
                  <div className="text-slate-400 text-xs mt-1">{k.label}</div>
                </div>
              ))}
            </div>

            {/* Rate cards */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Quiz Pass Rate', value: `${stats.rates.passRate}%`, color: stats.rates.passRate >= 70 ? 'text-emerald-400' : 'text-amber-400' },
                  { label: 'Average Quiz Score', value: `${stats.rates.avgQuizPct}%`, color: 'text-brand-400' },
                  { label: 'Average Game Score', value: stats.rates.avgGameScore, color: 'text-purple-400' },
                ].map((r, i) => (
                  <div key={i} className="card text-center">
                    <div className={clsx('text-4xl font-extrabold', r.color)}>{r.value}</div>
                    <div className="text-slate-400 text-xs mt-2">{r.label}</div>
                  </div>
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
      </div>
    </motion.div>
  )
}
