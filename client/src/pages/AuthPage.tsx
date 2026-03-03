import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'

const checks = [
  { label: '8+ characters', test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useAuth()
  const nav = useNavigate()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let res
      if (mode === 'login') {
        res = await login(email, password)
      } else {
        res = await register(name, email, password)
      }
      if (res.ok) {
        const userData = JSON.parse(localStorage.getItem('user') || '{}')
        nav(userData.role === 'admin' ? '/admin' : '/')
      } else {
        setError(res.error ?? 'Something went wrong')
      }
    } finally {
      setLoading(false)
    }
  }

  const pwStrength = password ? checks.filter(c => c.test(password)).length : 0
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength] ?? ''
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'][pwStrength] ?? ''

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg leading-none">FinTech Security</div>
              <div className="text-brand-400 text-sm">Training Platform</div>
            </div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/40"
        >
          {/* Tab switcher */}
          <div className="flex bg-slate-800/60 rounded-xl p-1 mb-7">
            {(['login', 'register'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={clsx(
                  'flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                  mode === m ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white',
                )}
              >
                {m === 'login' ? '🔑 Sign In' : '🆕 Register'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={submit}
              className="space-y-4"
            >
              {mode === 'register' && (
                <div>
                  <label className="block text-slate-400 text-xs font-medium mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    placeholder="Your name"
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@company.com"
                  className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs font-medium mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder={mode === 'register' ? 'Min 8 chars · Uppercase · Number · Special' : 'Your password'}
                    className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 pr-11 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength (register only) */}
                {mode === 'register' && password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-2"
                  >
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map(i => (
                        <div
                          key={i}
                          className={clsx(
                            'h-1 flex-1 rounded-full transition-all',
                            i < pwStrength ? strengthColor : 'bg-slate-700',
                          )}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{strengthLabel}</div>
                    <div className="grid grid-cols-2 gap-1">
                      {checks.map(c => (
                        <div key={c.label} className="flex items-center gap-1.5 text-xs">
                          {c.test(password)
                            ? <CheckCircle className="w-3 h-3 text-emerald-400" />
                            : <XCircle className="w-3 h-3 text-slate-600" />}
                          <span className={c.test(password) ? 'text-emerald-400' : 'text-slate-500'}>{c.label}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {error && (
                <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary justify-center py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  : mode === 'login' ? '🔑 Sign In' : '🚀 Create Account'}
              </button>
            </motion.form>
          </AnimatePresence>

          <p className="text-center text-slate-500 text-xs mt-6">
            {mode === 'login'
              ? "Don't have an account? "
              : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
              className="text-brand-400 hover:text-brand-300 font-semibold transition-colors"
            >
              {mode === 'login' ? 'Register here' : 'Sign in here'}
            </button>
          </p>
        </motion.div>

        <p className="text-center text-slate-600 text-xs mt-6">
          By signing in, you agree to our{' '}
          <Link to="/privacy" className="text-slate-500 hover:text-slate-400">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
