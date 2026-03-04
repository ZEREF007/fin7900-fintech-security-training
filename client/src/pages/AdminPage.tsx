import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'
import {
  Users, BarChart2, Video, Save, Loader2, CheckCircle, Shield,
  Settings, TrendingUp, Copy, ExternalLink, CheckCheck, Search,
  Trash2, ChevronUp, ChevronDown, Download, Crown, UserMinus,
  AlertTriangle, X,
} from 'lucide-react'
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
  pageStats: { page: string; visits: number }[]
}

interface UserRow {
  id: number; name: string; email: string; role: string; created_at: string
  last_ip: string; pages_visited: number; best_quiz_pct: number | null
  quiz_attempts: number; best_game_score: number | null
}

type SortCol = 'name' | 'email' | 'joined' | 'pages' | 'score'

function engagementBadge(pages: number) {
  if (pages === 0) return { label: 'Inactive',   color: 'bg-slate-700/50 text-slate-500' }
  if (pages < 4)   return { label: 'Low',        color: 'bg-amber-700/30 text-amber-400' }
  if (pages < 8)   return { label: 'Active',     color: 'bg-blue-700/30 text-blue-400'   }
  return             { label: 'Power User', color: 'bg-emerald-700/30 text-emerald-400' }
}

export default function AdminPage() {
  const { user, token } = useAuth()
  const nav = useNavigate()

  const [stats, setStats]           = useState<Stats | null>(null)
  const [allUsers, setAllUsers]     = useState<UserRow[]>([])
  const [videoUrls, setVideoUrls]   = useState<Record<string, string>>({})
  const [savingId, setSavingId]     = useState<string | null>(null)
  const [savedId, setSavedId]       = useState<string | null>(null)
  const [tab, setTab]               = useState<'stats' | 'videos' | 'users' | 'setup'>('stats')
  const [copied, setCopied]         = useState(false)

  // User management state
  const [userSearch, setUserSearch]           = useState('')
  const [sortCol, setSortCol]                 = useState<SortCol>('joined')
  const [sortDir, setSortDir]                 = useState<'asc' | 'desc'>('desc')
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [actionLoading, setActionLoading]     = useState<number | null>(null)

  const authHeaders = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const reload = () => {
    fetch('/api/admin/users', { headers: authHeaders }).then(r => r.json()).then(d => {
      if (d.users) setAllUsers(d.users)
    })
  }

  useEffect(() => {
    if (!user || user.role !== 'admin') { nav('/'); return }
    fetch('/api/admin/stats',  { headers: authHeaders }).then(r => r.json()).then(setStats)
    fetch('/api/admin/videos', { headers: authHeaders }).then(r => r.json()).then(d => {
      const map: Record<string, string> = {}
      d.videos?.forEach((v: { module_id: string; url: string }) => { map[v.module_id] = v.url })
      setVideoUrls(map)
    })
    reload()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, nav])

  // ── Computed / sorted user list ───────────────────────
  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase()
    const list = q
      ? allUsers.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      : [...allUsers]
    list.sort((a, b) => {
      let va: string | number = 0, vb: string | number = 0
      if (sortCol === 'name')   { va = a.name;          vb = b.name          }
      if (sortCol === 'email')  { va = a.email;         vb = b.email         }
      if (sortCol === 'joined') { va = a.created_at;    vb = b.created_at    }
      if (sortCol === 'pages')  { va = a.pages_visited; vb = b.pages_visited }
      if (sortCol === 'score')  { va = a.best_quiz_pct ?? -1; vb = b.best_quiz_pct ?? -1 }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [allUsers, userSearch, sortCol, sortDir])

  const toggleSort = (col: SortCol) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('desc') }
  }

  // ── User actions ──────────────────────────────────────
  const deleteUser = async (id: number) => {
    setActionLoading(id)
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE', headers: authHeaders })
    setConfirmDeleteId(null)
    setActionLoading(null)
    reload()
  }

  const promoteUser = async (id: number) => {
    setActionLoading(id)
    await fetch('/api/admin/promote', { method: 'POST', headers: authHeaders, body: JSON.stringify({ userId: id }) })
    setActionLoading(null)
    reload()
  }

  const demoteUser = async (id: number) => {
    setActionLoading(id)
    await fetch('/api/admin/demote', { method: 'POST', headers: authHeaders, body: JSON.stringify({ userId: id }) })
    setActionLoading(null)
    reload()
  }

  const exportCsv = () => {
    const link = document.createElement('a')
    link.href = `/api/admin/export-csv?token=${token}`
    link.download = 'users_export.csv'
    // Use fetch with auth header instead
    fetch('/api/admin/export-csv', { headers: authHeaders })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      })
  }

  // ── Video actions ─────────────────────────────────────
  const saveVideo = async (moduleId: string) => {
    setSavingId(moduleId)
    await fetch(`/api/admin/videos/${moduleId}`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ url: videoUrls[moduleId] || '' }),
    })
    setSavingId(null)
    setSavedId(moduleId)
    setTimeout(() => setSavedId(null), 2000)
  }

  // ── Chart data ────────────────────────────────────────
  const scoreBucketsData = stats ? [
    { label: '< 40%',  value: stats.scoreBuckets.below40, fill: '#ef4444' },
    { label: '40–70%', value: stats.scoreBuckets.p40_70,  fill: '#f59e0b' },
    { label: '70–90%', value: stats.scoreBuckets.p70_90,  fill: '#6366f1' },
    { label: '≥ 90%',  value: stats.scoreBuckets.above90, fill: '#10b981' },
  ] : []

  const pagePopularityData = stats?.pageStats?.slice(0, 8).map(p => ({
    page: p.page.replace(/^\//, '').replace(/^$/, 'home') || 'home',
    visits: p.visits,
  })) ?? []

  const GA_SNIPPET = `<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-T1V04S7612"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-T1V04S7612');
</script>`

  const copyGA = () => {
    navigator.clipboard.writeText(GA_SNIPPET)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Sort indicator helper ─────────────────────────────
  const SortIcon = ({ col }: { col: SortCol }) =>
    sortCol === col
      ? sortDir === 'asc' ? <ChevronUp className="w-3 h-3 inline ml-0.5" /> : <ChevronDown className="w-3 h-3 inline ml-0.5" />
      : <ChevronDown className="w-3 h-3 inline ml-0.5 opacity-20" />

  if (!user || user.role !== 'admin') return null

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-950">

      {/* ── Hero / Header ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-brand-400" />
            <div>
              <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 text-sm">GuardYourData — Administrator</p>
            </div>
          </div>
          <div className="flex gap-2 mt-6 flex-wrap">
            {([
              { id: 'stats',  label: '📊 Analytics' },
              { id: 'videos', label: '🎥 Videos'    },
              { id: 'users',  label: `👥 Users${allUsers.length ? ` (${allUsers.length})` : ''}` },
              { id: 'setup',  label: '⚙️ Setup'    },
            ] as const).map(t => (
              <motion.button
                key={t.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setTab(t.id)}
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

        {/* ══ STATS TAB ══════════════════════════════════════ */}
        {tab === 'stats' && (
          <div className="space-y-8">
            {/* KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats && [
                { label: 'Total Users',   value: stats.totals.users,   emoji: '👥', color: 'text-blue-400',   bg: 'from-blue-600/10 to-blue-600/0'     },
                { label: 'Page Visits',   value: stats.totals.visits,  emoji: '👁️', color: 'text-indigo-400', bg: 'from-indigo-600/10 to-indigo-600/0' },
                { label: 'Quiz Attempts', value: stats.totals.quizzes, emoji: '🧠', color: 'text-purple-400', bg: 'from-purple-600/10 to-purple-600/0' },
                { label: 'Game Attempts', value: stats.totals.games,   emoji: '🎮', color: 'text-amber-400',  bg: 'from-amber-600/10 to-amber-600/0'   },
              ].map((k, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
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
                  { label: 'Quiz Pass Rate',     value: `${stats.rates.passRate}%`,   color: stats.rates.passRate >= 70 ? 'text-emerald-400' : 'text-amber-400', icon: '🏆' },
                  { label: 'Average Quiz Score', value: `${stats.rates.avgQuizPct}%`, color: 'text-brand-400',   icon: '📊' },
                  { label: 'Average Game Score', value: stats.rates.avgGameScore,     color: 'text-purple-400',  icon: '🎮' },
                ].map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.08 }}
                    className="card text-center"
                  >
                    <div className="text-2xl mb-2">{r.icon}</div>
                    <div className={clsx('text-4xl font-extrabold', r.color)}>{r.value}</div>
                    <div className="text-slate-400 text-xs mt-1.5 font-medium">{r.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Page Popularity */}
            {stats && pagePopularityData.length > 0 && (
              <div className="card">
                <h2 className="text-white font-bold mb-1">Most Visited Pages</h2>
                <p className="text-slate-500 text-xs mb-4">Unique page events tracked since launch</p>
                <ResponsiveContainer width="100%" height={pagePopularityData.length * 36 + 20}>
                  <BarChart data={pagePopularityData} layout="vertical" margin={{ left: 0, right: 20 }}>
                    <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="page" width={100} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="visits" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Score Distribution */}
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

            {/* Reg Timeline */}
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

        {/* ══ VIDEOS TAB ═════════════════════════════════════ */}
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
                      'btn-primary py-2.5 px-5 text-sm shrink-0 disabled:opacity-50 flex items-center gap-1.5',
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

        {/* ══ USERS TAB ══════════════════════════════════════ */}
        {tab === 'users' && (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full bg-slate-800/70 border border-slate-700/50 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500/60 transition-all"
                />
                {userSearch && (
                  <button onClick={() => setUserSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={exportCsv}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-700/30 border border-emerald-700/40 rounded-xl text-emerald-300 text-sm font-semibold hover:bg-emerald-700/50 transition-all shrink-0"
              >
                <Download className="w-4 h-4" /> Export CSV
              </motion.button>
            </div>

            {/* User count hint */}
            <p className="text-slate-500 text-xs">
              {userSearch
                ? `${filteredUsers.length} of ${allUsers.length} users match`
                : `${allUsers.length} registered users`}
            </p>

            {/* Delete confirmation overlay */}
            {confirmDeleteId !== null && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="card border border-red-700/40 bg-red-950/20"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-white font-semibold mb-1">Delete this user?</div>
                    <div className="text-slate-400 text-sm mb-4">
                      All their progress, quiz scores, and page history will be permanently removed.
                      This action cannot be undone.
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => deleteUser(confirmDeleteId)}
                        disabled={actionLoading === confirmDeleteId}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-60 transition-all"
                      >
                        {actionLoading === confirmDeleteId
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <><Trash2 className="w-4 h-4" /> Delete permanently</>}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-semibold transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* User table */}
            <div className="card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-700/50">
                    {([
                      { col: 'name',   label: 'Name'       },
                      { col: 'email',  label: 'Email'      },
                      { col: null,     label: 'Role'       },
                      { col: null,     label: 'Engagement' },
                      { col: 'pages',  label: 'Pages'      },
                      { col: 'score',  label: 'Best Quiz'  },
                      { col: 'joined', label: 'Joined'     },
                      { col: null,     label: 'Actions'    },
                    ] as { col: SortCol | null; label: string }[]).map((h, i) => (
                      <th
                        key={i}
                        className={clsx('text-left py-2 pr-3 font-semibold text-xs uppercase tracking-wide', h.col && 'cursor-pointer select-none hover:text-slate-300')}
                        onClick={() => h.col && toggleSort(h.col)}
                      >
                        {h.label}{h.col && <SortIcon col={h.col} />}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => {
                    const badge = engagementBadge(u.pages_visited)
                    const isSelf = u.id === user?.id
                    return (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        className="border-b border-slate-800/40 last:border-0 group"
                      >
                        <td className="py-3 pr-3 text-white font-medium whitespace-nowrap">{u.name}</td>
                        <td className="py-3 pr-3 text-slate-400 text-xs">{u.email}</td>
                        <td className="py-3 pr-3">
                          <span className={clsx(
                            'px-2 py-0.5 rounded-full text-xs font-semibold',
                            u.role === 'admin' ? 'bg-brand-600/30 text-brand-300' : 'bg-slate-700/50 text-slate-400',
                          )}>
                            {u.role === 'admin' ? '👑 admin' : 'learner'}
                          </span>
                        </td>
                        <td className="py-3 pr-3">
                          <span className={clsx('px-2 py-0.5 rounded-full text-xs font-semibold', badge.color)}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 pr-3 text-slate-300 tabular-nums">{u.pages_visited}</td>
                        <td className="py-3 pr-3 tabular-nums">
                          {u.best_quiz_pct != null
                            ? <span className={clsx('font-semibold', u.best_quiz_pct >= 70 ? 'text-emerald-400' : 'text-amber-400')}>{u.best_quiz_pct}%</span>
                            : <span className="text-slate-600">—</span>}
                        </td>
                        <td className="py-3 pr-3 text-slate-500 text-xs whitespace-nowrap">{new Date(u.created_at).toLocaleDateString()}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-1.5">
                            {/* Promote / Demote */}
                            {!isSelf && (
                              u.role === 'admin'
                                ? (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => demoteUser(u.id)}
                                    disabled={actionLoading === u.id}
                                    title="Demote to learner"
                                    className="p-1.5 rounded-lg bg-amber-700/20 text-amber-400 hover:bg-amber-700/40 disabled:opacity-50 transition-all"
                                  >
                                    {actionLoading === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserMinus className="w-3.5 h-3.5" />}
                                  </motion.button>
                                ) : (
                                  <motion.button
                                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                    onClick={() => promoteUser(u.id)}
                                    disabled={actionLoading === u.id}
                                    title="Promote to admin"
                                    className="p-1.5 rounded-lg bg-brand-700/20 text-brand-400 hover:bg-brand-700/40 disabled:opacity-50 transition-all"
                                  >
                                    {actionLoading === u.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Crown className="w-3.5 h-3.5" />}
                                  </motion.button>
                                )
                            )}
                            {/* Delete */}
                            {!isSelf && u.role !== 'admin' && (
                              <motion.button
                                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                onClick={() => setConfirmDeleteId(u.id)}
                                title="Delete user"
                                className="p-1.5 rounded-lg bg-red-700/20 text-red-400 hover:bg-red-700/40 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </motion.button>
                            )}
                            {isSelf && <span className="text-xs text-slate-600 italic">you</span>}
                          </div>
                        </td>
                      </motion.tr>
                    )
                  })}
                </tbody>
              </table>
              {filteredUsers.length === 0 && !allUsers.length && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
                </div>
              )}
              {filteredUsers.length === 0 && allUsers.length > 0 && (
                <div className="text-center py-8 text-slate-500">No users match your search.</div>
              )}
            </div>
          </div>
        )}

        {/* ══ SETUP TAB ══════════════════════════════════════ */}
        {tab === 'setup' && (
          <div className="space-y-6">
            {/* GA4 */}
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
                {[
                  { num: 1, title: 'Create a GA4 Property', body: 'Go to analytics.google.com → click Admin (gear icon) → Create Property. Choose Web, enter your site URL.' },
                  { num: 2, title: 'Get your Measurement ID', body: 'In your property: Admin → Data Streams → click your web stream. Copy the Measurement ID (G-XXXXXXXXXX).' },
                  { num: 3, title: 'Add the tracking script', body: 'Open client/index.html. Find the commented-out GA block and uncomment it. Replace G-XXXXXXXXXX with your Measurement ID.' },
                  { num: 4, title: 'Rebuild and push', body: 'Run: cd client && npm run build — then commit and push. GitHub Actions will deploy to Render automatically.' },
                ].map(step => (
                  <div key={step.num} className="flex gap-4 p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
                    <div className="w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{step.num}</div>
                    <div>
                      <div className="text-white font-semibold text-sm mb-1">{step.title}</div>
                      <div className="text-slate-400 text-sm leading-relaxed">{step.body}</div>
                    </div>
                  </div>
                ))}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs uppercase tracking-widest font-semibold">Snippet (paste in client/index.html)</span>
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
<script async src="https://www.googletagmanager.com/gtag/js?id=G-T1V04S7612"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-T1V04S7612');
</script>`}
                  </pre>
                </div>
                <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex text-sm">
                  <ExternalLink className="w-4 h-4" /> Open Google Analytics
                </a>
              </div>
            </div>

            {/* Render Deploy */}
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
                  { num: 3, text: 'In GitHub: repo Settings → Secrets → New secret → RENDER_DEPLOY_HOOK_URL → paste URL' },
                  { num: 4, text: 'Done — every git push now rebuilds and deploys in ~2 minutes' },
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

