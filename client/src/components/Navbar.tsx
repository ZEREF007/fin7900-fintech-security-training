import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Shield, ChevronRight, Sun, Moon, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import clsx from 'clsx'

const MODULE_ITEMS = [
  { path: '/module/1', label: 'What is a Data Breach?',       short: 'Module 1', icon: '📖' },
  { path: '/module/2', label: 'Attack Vectors & Techniques',  short: 'Module 2', icon: '🔍' },
  { path: '/module/3', label: 'Regulatory Environment',       short: 'Module 3', icon: '📊' },
  { path: '/module/4', label: 'Security Controls & Defences', short: 'Module 4', icon: '🛡️' },
  { path: '/module/5', label: 'Case Studies & Governance',    short: 'Module 5', icon: '📋' },
]

const PRACTICE_ITEMS = [
  { path: '/quiz',  label: 'MCQ Quiz',     icon: '🧠', desc: '50-question final assessment' },
  { path: '/game',  label: 'Flash Cards',  icon: '🎮', desc: 'Fast-paced knowledge game'     },
]

const RESOURCE_ITEMS = [
  { path: '/glossary',   label: 'Glossary',     icon: '📚', desc: 'Key FinTech security terms', live: false },
  { path: '/laws',       label: 'Laws & Regs',  icon: '⚖️', desc: 'GDPR, PDPO, PCI DSS & more', live: false },
  { path: '/live',       label: 'Live Threats', icon: '🔴', desc: 'CISA KEV feed — real time',    live: true  },
  { path: '/references', label: 'References',   icon: '📑', desc: 'Academic & industry sources', live: false },
  { path: '/feedback',   label: 'Feedback',     icon: '💬', desc: 'Share your thoughts with us',  live: false },
]

type DropdownId = 'modules' | 'practice' | 'resources' | null

const SUMMARY_PATH = '/summary'

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [openMenu, setOpenMenu]       = useState<DropdownId>(null)
  const [scrolled, setScrolled]       = useState(false)
  const [progress, setProgress]       = useState(0)
  const { user, logout }              = useAuth()
  const { isDark, toggle }            = useTheme()
  const location                      = useLocation()
  const navRef                        = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const doc = document.documentElement
      const pct = (window.scrollY / (doc.scrollHeight - doc.clientHeight)) * 100
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false); setOpenMenu(null) }, [location.pathname])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenMenu(null)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggle_menu = (id: DropdownId) => setOpenMenu(o => o === id ? null : id)

  const isModuleActive   = MODULE_ITEMS.some(m => location.pathname === m.path)
  const isPracticeActive = PRACTICE_ITEMS.some(m => location.pathname.startsWith(m.path))
  const isResourceActive = RESOURCE_ITEMS.some(m => location.pathname.startsWith(m.path))
  const isSummaryActive  = location.pathname === SUMMARY_PATH

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const baseLinkCls = 'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 whitespace-nowrap'
  const activeCls   = 'bg-brand-50 dark:bg-brand-600/20 text-brand-600 dark:text-brand-300 border border-brand-200 dark:border-brand-600/30'
  const idleCls     = 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'

  return (
    <>
      <nav
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/97 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/60 shadow-sm dark:shadow-xl'
            : 'bg-white/92 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200/60 dark:border-slate-800/50',
        )}
      >
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center">
          {/* Brand — left column, flex-1 so it mirrors right side */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">Guard<span className="text-brand-600 dark:text-brand-400">YourData</span></div>
              </div>
            </Link>
          </div>

          {/* Desktop nav — true centre */}
          <ul className="hidden lg:flex items-center gap-3" ref={navRef}>

            {/* Home */}
            <li>
              <Link to="/" className={clsx(baseLinkCls, location.pathname === '/' ? activeCls : idleCls)}>
                <span className="text-sm">🏠</span>
                <span>Home</span>
              </Link>
            </li>

            {/* Modules dropdown */}
            <li className="relative">
              <button
                onClick={() => toggle_menu('modules')}
                className={clsx(baseLinkCls, isModuleActive ? activeCls : idleCls)}
              >
                <span className="text-sm">📚</span>
                <span>Modules</span>
                <ChevronDown className={clsx('w-3 h-3 transition-transform duration-200', openMenu === 'modules' && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {openMenu === 'modules' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      {MODULE_ITEMS.map(m => (
                        <Link key={m.path} to={m.path}
                          className={clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                            location.pathname === m.path
                              ? 'bg-brand-50 dark:bg-brand-600/15 text-brand-700 dark:text-brand-300'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                          )}
                        >
                          <span className="text-base w-6 text-center shrink-0">{m.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{m.short}</div>
                            <div className="text-xs font-medium leading-snug truncate">{m.label}</div>
                          </div>
                          {location.pathname === m.path && <ChevronRight className="w-3 h-3 text-brand-500 shrink-0" />}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Practice dropdown */}
            <li className="relative">
              <button
                onClick={() => toggle_menu('practice')}
                className={clsx(baseLinkCls, isPracticeActive ? activeCls : idleCls)}
              >
                <span className="text-sm">🎯</span>
                <span>Practice</span>
                <ChevronDown className={clsx('w-3 h-3 transition-transform duration-200', openMenu === 'practice' && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {openMenu === 'practice' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1.5 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      {PRACTICE_ITEMS.map(m => (
                        <Link key={m.path} to={m.path}
                          className={clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                            isActive(m.path)
                              ? 'bg-brand-50 dark:bg-brand-600/15 text-brand-700 dark:text-brand-300'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                          )}
                        >
                          <span className="text-base shrink-0">{m.icon}</span>
                          <div>
                            <div className="text-xs font-semibold">{m.label}</div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">{m.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* Summary */}
            <li>
              <Link to={SUMMARY_PATH} className={clsx(baseLinkCls, isSummaryActive ? activeCls : idleCls)}>
                <span className="text-sm">📋</span>
                <span>Summary</span>
              </Link>
            </li>

            {/* Resources dropdown */}
            <li className="relative">
              <button
                onClick={() => toggle_menu('resources')}
                className={clsx(baseLinkCls, isResourceActive ? activeCls : idleCls)}
              >
                <span className="text-sm">🔎</span>
                <span>Resources</span>
                <ChevronDown className={clsx('w-3 h-3 transition-transform duration-200', openMenu === 'resources' && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {openMenu === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1.5 w-60 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl shadow-xl dark:shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-1.5">
                      {RESOURCE_ITEMS.map(m => (
                        <Link key={m.path} to={m.path}
                          className={clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                            isActive(m.path)
                              ? 'bg-brand-50 dark:bg-brand-600/15 text-brand-700 dark:text-brand-300'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                          )}
                        >
                          <span className="text-base shrink-0">{m.icon}</span>
                          <div className="flex-1">
                            <div className="text-xs font-semibold flex items-center gap-1.5">
                              {m.label}
                              {m.live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                            </div>
                            <div className="text-[10px] text-slate-400 dark:text-slate-500">{m.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>

            {/* My Progress */}
            <li>
              <Link to="/dashboard" className={clsx(baseLinkCls, isActive('/dashboard') ? activeCls : idleCls)}>
                <span className="text-sm">📈</span>
                <span>My Progress</span>
              </Link>
            </li>

            {/* About */}
            <li>
              <Link to="/about" className={clsx(baseLinkCls, isActive('/about') ? activeCls : idleCls)}>
                <span className="text-sm">👋</span>
                <span>About</span>
              </Link>
            </li>

          </ul>

          {/* Right actions — flex-1 justify-end mirrors left brand column */}
          <div className="flex-1 flex items-center justify-end gap-1.5">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-600/20 dark:hover:bg-amber-600/30 text-amber-700 dark:text-amber-300 text-xs font-semibold rounded-lg border border-amber-200 dark:border-amber-600/30 transition-all"
                  >
                    ⚙️ Admin
                  </Link>
                )}
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700/60">
                  <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={logout}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold rounded-lg transition-all"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg transition-all"
              >
                Sign In <ChevronRight className="w-3 h-3" />
              </Link>
            )}

            {/* Theme toggle */}
            <button
              onClick={toggle}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 transition-all"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700 hidden lg:block" />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition-all"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-brand-500 to-accent-500"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700/60 max-h-[80vh] overflow-y-auto shadow-lg dark:shadow-2xl"
          >
            {/* Modules */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">📚 Modules</p>
              <ul className="space-y-0.5">
                {MODULE_ITEMS.map(m => (
                  <li key={m.path}>
                    <Link to={m.path}
                      className={clsx(
                        'flex items-center gap-2.5 px-3 py-2 rounded-xl transition-all',
                        location.pathname === m.path
                          ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                      )}
                    >
                      <span>{m.icon}</span>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{m.short}</div>
                        <div className="text-xs font-medium">{m.label}</div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice + Summary + Resources */}
            <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800">
              <div className="p-3">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">🎯 Practice</p>
                <ul className="space-y-0.5">
                  {PRACTICE_ITEMS.map(item => (
                    <li key={item.path}>
                      <Link to={item.path}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                          isActive(item.path)
                            ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                        )}
                      >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link to="/dashboard"
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                        isActive('/dashboard')
                          ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                      )}
                    >
                      <span>📈</span>
                      <span>My Progress</span>
                    </Link>
                  </li>
                </ul>
              </div>
              {/* Summary column */}
              <div className="p-3">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">📋 Summary</p>
                <ul className="space-y-0.5">
                  <li>
                    <Link to="/about"
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                        isActive('/about')
                          ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                      )}
                    >
                      <span>👋</span>
                      <span>About</span>
                    </Link>
                  </li>
                  <li>
                    <Link to={SUMMARY_PATH}
                      className={clsx(
                        'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                        isSummaryActive
                          ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                      )}
                    >
                      <span>📋</span>
                      <span>Exec Summary</span>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="p-3">
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 mb-2">🔎 Resources</p>
                <ul className="space-y-0.5">
                  {RESOURCE_ITEMS.map(item => (
                    <li key={item.path}>
                      <Link to={item.path}
                        className={clsx(
                          'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all',
                          isActive(item.path)
                            ? 'bg-brand-50 dark:bg-brand-600/20 text-brand-700 dark:text-brand-300'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800',
                        )}
                      >
                        <span>{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                        {item.live && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {user && (
              <div className="px-3 pb-3 flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                {user.role === 'admin' && (
                  <Link to="/admin" className="flex-1 btn-secondary text-center justify-center text-sm py-2">⚙️ Admin</Link>
                )}
                <button onClick={logout} className="flex-1 btn-secondary text-sm py-2">Sign out</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
