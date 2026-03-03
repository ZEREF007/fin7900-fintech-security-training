import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend,
} from 'recharts'
import {
  RefreshCw, AlertTriangle, Activity, ExternalLink,
  Clock, Filter, ShieldAlert, TrendingUp, Building2, Skull,
} from 'lucide-react'
import clsx from 'clsx'

interface CisaVuln {
  cveID: string
  vendorProject: string
  product: string
  vulnerabilityName: string
  dateAdded: string
  shortDescription: string
  requiredAction: string
  dueDate: string
  knownRansomwareCampaignUse: string
}

interface CisaFeed {
  title: string
  catalogVersion: string
  dateReleased: string
  count: number
  vulnerabilities: CisaVuln[]
}

const VENDOR_COLORS = [
  '#6366f1','#8b5cf6','#ec4899','#f59e0b','#10b981',
  '#3b82f6','#ef4444','#06b6d4','#84cc16','#f97316',
]

export default function LivePage() {
  const [data,       setData]       = useState<CisaFeed | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [refreshIn,  setRefreshIn]  = useState(60)
  const [search,     setSearch]     = useState('')
  const [ransomOnly, setRansomOnly] = useState(false)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const r = await fetch('/api/live/cisa')
      if (!r.ok) throw new Error(`HTTP ${r.status}`)
      const d: CisaFeed = await r.json()
      setData(d)
      setLastUpdate(new Date())
      setRefreshIn(60)
    } catch {
      setError('Could not load threat data. Check connection or try refreshing.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  // auto-refresh countdown
  useEffect(() => {
    const t = setInterval(() => {
      setRefreshIn(s => {
        if (s <= 1) { load(); return 60 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(t)
  }, [load])

  /* ── Derived stats ───────────────────────────── */
  const vulns = data?.vulnerabilities ?? []

  const now = new Date()
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const lastMonth = (() => {
    const d = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })()

  const addedThisMonth = vulns.filter(v => v.dateAdded.startsWith(thisMonth)).length
  const addedLastMonth = vulns.filter(v => v.dateAdded.startsWith(lastMonth)).length
  const ransomCount    = vulns.filter(v => v.knownRansomwareCampaignUse === 'Known').length

  // Top 10 vendors
  const vendorMap: Record<string, number> = {}
  vulns.forEach(v => { vendorMap[v.vendorProject] = (vendorMap[v.vendorProject] || 0) + 1 })
  const topVendors = Object.entries(vendorMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }))

  // Monthly trend (last 18 months)
  const monthMap: Record<string, number> = {}
  vulns.forEach(v => {
    const m = v.dateAdded.slice(0, 7)
    monthMap[m] = (monthMap[m] || 0) + 1
  })
  const monthlyTrend = Object.entries(monthMap)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-18)
    .map(([month, count]) => ({ month: month.slice(5), count }))

  // Ransomware pie
  const ransomPie = [
    { name: 'Ransomware-linked', value: ransomCount,        fill: '#ef4444' },
    { name: 'Other exploited',   value: vulns.length - ransomCount, fill: '#6366f1' },
  ]

  // Yearly breakdown (last 4 years)
  const yearMap: Record<string, number> = {}
  vulns.forEach(v => {
    const yr = v.dateAdded.slice(0, 4)
    yearMap[yr] = (yearMap[yr] || 0) + 1
  })
  const yearData = Object.entries(yearMap)
    .sort()
    .slice(-5)
    .map(([year, count]) => ({ year, count }))

  // Filtered list (newest first)
  const recent = [...vulns]
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded))
    .filter(v => {
      if (ransomOnly && v.knownRansomwareCampaignUse !== 'Known') return false
      if (search) {
        const s = search.toLowerCase()
        return (
          v.vendorProject.toLowerCase().includes(s) ||
          v.product.toLowerCase().includes(s) ||
          v.cveID.toLowerCase().includes(s) ||
          v.vulnerabilityName.toLowerCase().includes(s)
        )
      }
      return true
    })
    .slice(0, 40)

  const trendPct = addedLastMonth > 0
    ? Math.round(((addedThisMonth - addedLastMonth) / addedLastMonth) * 100)
    : 0

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto px-4 py-10">

      {/* ── Hero ──────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-700/40 rounded-full">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold text-red-700 dark:text-red-300 uppercase tracking-widest">Live</span>
          </div>
          <span className="text-slate-500 dark:text-slate-500 text-xs">
            Source: CISA Known Exploited Vulnerabilities Catalog · auto-refreshes every 60s
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-2">
          Live Threat Intelligence
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-base max-w-2xl leading-relaxed">
          Real-time feed of vulnerabilities actively exploited in the wild, published by the U.S.
          Cybersecurity &amp; Infrastructure Security Agency (CISA). This data directly supports
          what you learn in Modules 2 and 4.
        </p>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={clsx('w-4 h-4', loading && 'animate-spin')} />
            Refresh
          </button>
          {lastUpdate && (
            <span className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              Updated {lastUpdate.toLocaleTimeString()} · next in {refreshIn}s
            </span>
          )}
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────── */}
      {error && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-700/40 rounded-xl text-red-700 dark:text-red-300 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* ── Loading skeleton ───────────────────────────────── */}
      {loading && !data && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Activity className="w-10 h-10 text-brand-500 animate-pulse" />
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Fetching live threat data from CISA…
          </p>
        </div>
      )}

      {data && (
        <div className="space-y-8">

          {/* ── KPI Cards ─────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Known Exploited',
                value: data.count.toLocaleString(),
                icon: ShieldAlert,
                color: 'text-red-600 dark:text-red-400',
                bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800/30',
                emoji: '🚨',
              },
              {
                label: 'Added This Month',
                value: addedThisMonth,
                sub: trendPct !== 0 ? `${trendPct > 0 ? '+' : ''}${trendPct}% vs last month` : undefined,
                icon: TrendingUp,
                color: 'text-amber-600 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/30',
                emoji: '📅',
              },
              {
                label: 'Ransomware-Linked',
                value: ransomCount.toLocaleString(),
                sub: `${Math.round((ransomCount / vulns.length) * 100)}% of total`,
                icon: Skull,
                color: 'text-purple-600 dark:text-purple-400',
                bg: 'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/30',
                emoji: '💀',
              },
              {
                label: 'Vendors Affected',
                value: Object.keys(vendorMap).length,
                icon: Building2,
                color: 'text-brand-600 dark:text-brand-400',
                bg: 'bg-brand-50 dark:bg-brand-950/30 border-brand-200 dark:border-brand-800/30',
                emoji: '🏢',
              },
            ].map((k, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={clsx('rounded-2xl border p-5 text-center', k.bg)}
              >
                <div className="text-3xl mb-2">{k.emoji}</div>
                <div className={clsx('text-3xl sm:text-4xl font-black tabular-nums leading-none mb-1', k.color)}>
                  {k.value}
                </div>
                <div className="text-slate-600 dark:text-slate-400 text-xs font-semibold mt-1">{k.label}</div>
                {k.sub && <div className="text-slate-400 dark:text-slate-500 text-[11px] mt-1">{k.sub}</div>}
              </motion.div>
            ))}
          </div>

          {/* ── Charts row 1 ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Monthly trend area chart */}
            <div className="card">
              <h2 className="text-slate-900 dark:text-white font-bold text-base mb-1">
                New Exploited Vulnerabilities per Month
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">Last 18 months · CISA KEV additions</p>
              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={monthlyTrend} margin={{ left: -18, right: 4, top: 4 }}>
                  <defs>
                    <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--tt-bg,#fff)', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12 }}
                    formatter={(v: number) => [v, 'Additions']}
                  />
                  <Area type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2.5} fill="url(#redGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Top vendors bar chart */}
            <div className="card">
              <h2 className="text-slate-900 dark:text-white font-bold text-base mb-1">
                Top 10 Most-Targeted Vendors
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">By count of known exploited CVEs</p>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={topVendors} layout="vertical" margin={{ left: 4, right: 20, top: 4 }}>
                  <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis
                    type="category" dataKey="name"
                    tick={{ fill: '#64748b', fontSize: 10 }}
                    axisLine={false} tickLine={false} width={68}
                  />
                  <Tooltip
                    contentStyle={{ background: 'var(--tt-bg,#fff)', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12 }}
                    formatter={(v: number) => [v, 'CVEs']}
                  />
                  <Bar dataKey="count" radius={[0, 5, 5, 0]}>
                    {topVendors.map((_, i) => (
                      <Cell key={i} fill={VENDOR_COLORS[i % VENDOR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Charts row 2 ──────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Yearly bar */}
            <div className="card">
              <h2 className="text-slate-900 dark:text-white font-bold text-base mb-1">
                Additions by Year
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-5">Cumulative CVEs added to CISA catalog each year</p>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={yearData} margin={{ left: -18, right: 4, top: 4 }}>
                  <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--tt-bg,#fff)', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12 }}
                    formatter={(v: number) => [v, 'CVEs']}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[5, 5, 0, 0]}>
                    {yearData.map((_, i) => (
                      <Cell key={i} fill={`hsl(${240 - i * 12}, 65%, ${55 + i * 3}%)`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Ransomware pie */}
            <div className="card flex flex-col">
              <h2 className="text-slate-900 dark:text-white font-bold text-base mb-1">
                Ransomware Association
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
                CVEs known to be used in ransomware campaigns vs other exploitation
              </p>
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={ransomPie}
                      cx="50%" cy="45%"
                      innerRadius={52} outerRadius={78}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {ransomPie.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: 'var(--tt-bg,#fff)', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 12 }}
                    />
                    <Legend
                      iconType="circle" iconSize={8}
                      formatter={(value) => (
                        <span style={{ color: '#64748b', fontSize: 11 }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── CVE Table ──────────────────────────────────── */}
          <div className="card overflow-hidden p-0">

            {/* Table header + filters */}
            <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-slate-900 dark:text-white font-bold text-lg">Recently Added Exploited CVEs</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                    Newest first · showing {recent.length} entries · click a row to see details
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search vendor, CVE, product…"
                    className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-xl text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-brand-400 transition-all w-52"
                  />
                  <button
                    onClick={() => setRansomOnly(r => !r)}
                    className={clsx(
                      'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all',
                      ransomOnly
                        ? 'bg-purple-100 dark:bg-purple-900/40 border-purple-300 dark:border-purple-600/40 text-purple-700 dark:text-purple-300'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700',
                    )}
                  >
                    <Filter className="w-3.5 h-3.5" /> Ransomware only
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-500 text-xs uppercase tracking-wider">
                    <th className="text-left py-3 px-4 font-semibold w-32">CVE ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Vendor</th>
                    <th className="text-left py-3 px-4 font-semibold hidden md:table-cell">Product</th>
                    <th className="text-left py-3 px-4 font-semibold hidden xl:table-cell">Vulnerability Name</th>
                    <th className="text-left py-3 px-4 font-semibold w-24">Date Added</th>
                    <th className="text-center py-3 px-4 font-semibold w-20 hidden sm:table-cell">🔴 Ransom</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recent.map((v, i) => (
                      <>
                        <motion.tr
                          key={v.cveID}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: Math.min(i * 0.012, 0.4) }}
                          onClick={() => setExpandedRow(expandedRow === v.cveID ? null : v.cveID)}
                          className="border-t border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer"
                        >
                          <td className="py-3 px-4">
                            <a
                              href={`https://nvd.nist.gov/vuln/detail/${v.cveID}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="font-mono text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 text-xs flex items-center gap-1 group"
                            >
                              {v.cveID}
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </td>
                          <td className="py-3 px-4 text-slate-800 dark:text-slate-200 font-semibold text-xs">{v.vendorProject}</td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs hidden md:table-cell">{v.product}</td>
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-500 text-xs hidden xl:table-cell max-w-xs">
                            <span className="line-clamp-1">{v.vulnerabilityName}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 dark:text-slate-500 text-xs tabular-nums">{v.dateAdded}</td>
                          <td className="py-3 px-4 text-center hidden sm:table-cell">
                            {v.knownRansomwareCampaignUse === 'Known' && (
                              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-700/40">
                                ⚠︎ Yes
                              </span>
                            )}
                          </td>
                        </motion.tr>

                        {/* Expanded detail row */}
                        {expandedRow === v.cveID && (
                          <tr key={`${v.cveID}-detail`} className="bg-brand-50/60 dark:bg-slate-800/60">
                            <td colSpan={6} className="px-6 py-4">
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-3"
                              >
                                <div>
                                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Description</span>
                                  <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 leading-relaxed">{v.shortDescription}</p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                  <div>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Required Action</span>
                                    <p className="text-slate-700 dark:text-slate-300 text-sm mt-1">{v.requiredAction}</p>
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">CISA Due Date</span>
                                    <p className="text-red-600 dark:text-red-400 font-semibold text-sm mt-1">{v.dueDate}</p>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700/50 flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Source:{' '}
                <a
                  href="https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 dark:text-brand-400 hover:underline"
                >
                  CISA Known Exploited Vulnerabilities Catalog
                </a>
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                Catalog v{data.catalogVersion} · Released {new Date(data.dateReleased).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* ── Educational note ───────────────────────────── */}
          <div className="info-box info-box-info">
            <p className="font-bold mb-1 text-base">📘 What is the CISA KEV Catalog?</p>
            <p className="leading-relaxed">
              The U.S. Cybersecurity &amp; Infrastructure Security Agency maintains a real-time catalog
              of vulnerabilities that are confirmed to be actively exploited. Federal agencies are
              legally required to patch these within strict deadlines (typically 2–3 weeks). This feed
              directly illustrates the attack vectors covered in <strong>Module 2</strong> and the
              security controls discussed in <strong>Module 4</strong> of this course. Every row
              represents a real intrusion technique being used against real organisations right now.
            </p>
          </div>

          {/* ── Disclaimer ─────────────────────────────────── */}
          <p className="text-xs text-slate-400 dark:text-slate-500 text-center pb-2">
            Data fetched live from{' '}
            <a href="https://www.cisa.gov" target="_blank" rel="noopener noreferrer" className="hover:underline">
              cisa.gov
            </a>{' '}
            · Cached for 10 minutes per request · For educational use only.
          </p>
        </div>
      )}
    </motion.div>
  )
}
