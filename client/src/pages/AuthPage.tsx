import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Eye, EyeOff, CheckCircle, XCircle, Loader2, KeyRound, RotateCcw, ShieldCheck, Mail } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import clsx from 'clsx'

const API = '/api'

const checks = [
  { label: '8+ characters',     test: (p: string) => p.length >= 8 },
  { label: 'Uppercase letter',  test: (p: string) => /[A-Z]/.test(p) },
  { label: 'Number',            test: (p: string) => /[0-9]/.test(p) },
  { label: 'Special character', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

type Mode = 'login' | 'register' | 'forgot' | 'forgot-reset' | 'otp-verify' | 'registered'

function DemoCodeBox({ code }: { code: string }) {
  if (!code) return null
  return (
    <div className="mb-4 rounded-xl overflow-hidden border border-indigo-500/40">
      <div className="bg-indigo-900/60 px-4 py-2 flex items-center gap-2">
        <span className="text-base">📋</span>
        <p className="text-indigo-300 text-xs font-semibold uppercase tracking-wide">Demo Mode — Verification Code</p>
      </div>
      <div className="bg-slate-900/80 px-4 py-4 text-center">
        <p className="text-indigo-200 font-mono text-3xl font-black tracking-[0.5em] select-all">{code}</p>
        <p className="text-slate-500 text-xs mt-2">Copy and paste this code into the field below</p>
      </div>
    </div>
  )
}

export default function AuthPage() {
  const [mode, setMode]            = useState<Mode>('login')
  const [tab,  setTab]             = useState<'login' | 'register'>('login')
  const [name, setName]            = useState('')
  const [email, setEmail]          = useState('')
  const [password, setPassword]    = useState('')
  const [showPw, setShowPw]        = useState(false)
  const [otp, setOtp]              = useState('')
  const [demoCode, setDemoCode]    = useState('')
  const [newPassword, setNewPw]    = useState('')
  const [showNewPw, setShowNewPw]  = useState(false)
  const [pendingEmail, setPending] = useState('')
  const [loading, setLoading]      = useState(false)
  const [error, setError]          = useState('')
  const [redirectRole, setRedirectRole] = useState<'admin' | 'learner'>('learner')
  const { register, completeLogin, login } = useAuth()
  const { isDark } = useTheme()
  const nav = useNavigate()

  // Clean redirect on unmount — avoids updating state on unmounted component
  useEffect(() => {
    if (mode !== 'registered') return
    const t = setTimeout(() => nav(redirectRole === 'admin' ? '/admin' : '/'), 2500)
    return () => clearTimeout(t)
  }, [mode, redirectRole, nav])

  const resetState = (m: Mode) => { setMode(m); setError(''); setOtp(''); setDemoCode('') }
  const switchTab  = (t: 'login' | 'register') => { setTab(t); resetState(t); setName(''); setEmail(''); setPassword('') }

  /* ─── Login: direct email + password ─ no OTP on every login ─── */
  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await login(email, password)
      if (res.ok) {
        // completeLogin already called inside login()
        const u = JSON.parse(localStorage.getItem('user') || '{}')
        nav(u.role === 'admin' ? '/admin' : '/')
      } else if (res.pending) {
        // Unverified email — redirect to OTP verification
        setDemoCode(res.demo_code || '')
        setPending(res.email || email)
        setOtp('')
        setMode('otp-verify')
      } else {
        setError(res.error || 'Invalid credentials')
      }
    } catch {
      setError('Cannot reach the server. Please check your connection or try again.')
    } finally { setLoading(false) }
  }

  /* ─── Register ─── */
  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await register(name, email, password)
      if (!res.ok) return setError(res.error ?? 'Something went wrong')
      if (res.auto_login) {
        setRedirectRole(res.user?.role === 'admin' ? 'admin' : 'learner')
        setMode('registered')
      } else if (res.pending) {
        setDemoCode(res.demo_code || '')
        setPending(res.email || email)
        setOtp('')
        setMode('otp-verify')
      } else {
        const u = JSON.parse(localStorage.getItem('user') || '{}')
        nav(u.role === 'admin' ? '/admin' : '/')
      }
    } catch {
      setError('Cannot reach the server. Please check your connection or try again.')
    } finally { setLoading(false) }
  }

  /* ─── Verify email OTP (used after registration) ─── */
  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const r = await fetch(`${API}/auth/verify-email`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, code: otp }),
      })
      const data = await r.json()
      if (!r.ok) return setError(data.error || 'Invalid code')
      completeLogin(data.token, data.user)
      nav(data.user.role === 'admin' ? '/admin' : '/')
    } finally { setLoading(false) }
  }

  /* ─── Resend email verification OTP ─── */
  const resendOtp = async () => {
    setError(''); setLoading(true); setOtp('')
    try {
      const r = await fetch(`${API}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, password }),
      })
      const data = await r.json()
      if (r.status === 403 && data.pending) { setDemoCode(data.demo_code || '') }
      else if (!r.ok) setError(data.error || 'Could not resend')
    } finally { setLoading(false) }
  }

  /* ─── Forgot password step 1 ─── */
  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const r = await fetch(`${API}/auth/forgot`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await r.json()
      if (!r.ok) return setError(data.error || 'Something went wrong')
      setDemoCode(data.demo_code || '')
      setPending(email); setOtp(''); setNewPw('')
      setMode('forgot-reset')
    } finally { setLoading(false) }
  }

  /* ─── Forgot password step 2 ─── */
  const submitReset = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const r = await fetch(`${API}/auth/reset-password`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingEmail, code: otp, newPassword }),
      })
      const data = await r.json()
      if (!r.ok) return setError(data.error || 'Something went wrong')
      completeLogin(data.token, data.user)
      nav(data.user.role === 'admin' ? '/admin' : '/')
    } finally { setLoading(false) }
  }

  const pwStrength = password   ? checks.filter(c => c.test(password)).length   : 0
  const npStrength = newPassword? checks.filter(c => c.test(newPassword)).length : 0
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][pwStrength] ?? ''
  const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500']
  const inputCls = clsx(
    'w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/30 transition-all border',
    isDark
      ? 'bg-slate-800/60 border-slate-700/50 text-white placeholder:text-slate-500'
      : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
  )

  return (
    <div className={clsx('auth-page-wrap bg-slate-950 min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12', isDark && 'dark')}>
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center group-hover:bg-brand-500 transition-colors">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <div className="text-white font-bold text-lg leading-none">Guard<span className="text-brand-400">YourData</span></div>
              <div className="text-brand-400 text-sm">Training Platform</div>
            </div>
          </Link>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/40">
          <AnimatePresence mode="wait">

            {/* ═══ LOGIN ═══ */}
            {mode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex bg-slate-800/60 rounded-xl p-1 mb-7">
                  {(['login', 'register'] as const).map(t => (
                    <button key={t} onClick={() => switchTab(t)}
                      className={clsx('flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                        tab === t ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white')}>
                      {t === 'login' ? '🔑 Sign In' : '🆕 Register'}
                    </button>
                  ))}
                </div>

                <form onSubmit={submitLogin} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" className={inputCls} />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-slate-400 text-xs font-medium">Password</label>
                      <button type="button" onClick={() => { setPending(email); resetState('forgot') }}
                        className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors">
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                        placeholder="Your password"
                        className={clsx(inputCls, 'pr-11')} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">{error}</div>}

                  <button type="submit" disabled={loading}
                    className="w-full btn-primary justify-center py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading
                      ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                      : <><ShieldCheck className="w-4 h-4" /> Sign In</> }
                  </button>
                </form>

                <p className="text-center text-slate-500 text-xs mt-6">
                  Don't have an account?{' '}
                  <button onClick={() => { setTab('register'); resetState('register') }}
                    className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                    Register here
                  </button>
                </p>
              </motion.div>
            )}

            {/* ═══ REGISTER ═══ */}
            {mode === 'register' && (
              <motion.div key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="flex bg-slate-800/60 rounded-xl p-1 mb-7">
                  {(['login', 'register'] as const).map(t => (
                    <button key={t} onClick={() => switchTab(t)}
                      className={clsx('flex-1 py-2 rounded-lg text-sm font-semibold transition-all',
                        tab === t ? 'bg-brand-600 text-white shadow-lg' : 'text-slate-400 hover:text-white')}>
                      {t === 'login' ? '🔑 Sign In' : '🆕 Register'}
                    </button>
                  ))}
                </div>
                <form onSubmit={submitRegister} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Full Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Password</label>
                    <div className="relative">
                      <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                        placeholder="Min 8 chars · Uppercase · Number · Special" className={clsx(inputCls, 'pr-11')} />
                      <button type="button" onClick={() => setShowPw(!showPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-3 space-y-2">
                        <div className="flex gap-1.5">
                          {[0,1,2,3].map(i => <div key={i} className={clsx('h-1 flex-1 rounded-full transition-all', i < pwStrength ? strengthColor[pwStrength] : 'bg-slate-700')} />)}
                        </div>
                        <div className="text-xs text-slate-400 font-medium">{strengthLabel}</div>
                        <div className="grid grid-cols-2 gap-1">
                          {checks.map(c => (
                            <div key={c.label} className="flex items-center gap-1.5 text-xs">
                              {c.test(password) ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-slate-600" />}
                              <span className={c.test(password) ? 'text-emerald-400' : 'text-slate-500'}>{c.label}</span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                  {error && <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">{error}</div>}
                  <button type="submit" disabled={loading}
                    className="w-full btn-primary justify-center py-3.5 mt-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : '🚀 Create Account'}
                  </button>
                </form>
                <p className="text-center text-slate-500 text-xs mt-6">
                  Already have an account?{' '}
                  <button onClick={() => { setTab('login'); resetState('login') }}
                    className="text-brand-400 hover:text-brand-300 font-semibold transition-colors">
                    Sign in here
                  </button>
                </p>
              </motion.div>
            )}

            {/* ═══ REGISTERED — auto-login success screen ═══ */}
            {mode === 'registered' && (
              <motion.div key="registered" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                  <h2 className="text-white font-bold text-xl">Account Created!</h2>
                  <p className="text-slate-400 text-sm mt-1.5">You're all set. Taking you in now…</p>
                </div>
                <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium mt-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Logging you in…</span>
                </div>
              </motion.div>
            )}

            {/* ═══ OTP VERIFY (email verification after registration) ═══ */}
            {mode === 'otp-verify' && (
              <motion.div key="otp-verify" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-brand-400" />
                  </div>
                  <h2 className="text-white font-bold text-xl">Verify Your Email</h2>
                  <p className="text-slate-400 text-sm mt-1.5">
                    A 6-digit code was sent to confirm your email<br />
                    <span className="text-brand-300 font-semibold">{pendingEmail}</span>
                  </p>
                  <p className="text-slate-500 text-xs mt-2">You only need to do this once.</p>
                </div>
                <DemoCodeBox code={demoCode} />
                <form onSubmit={submitOtp} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">6-Digit Verification Code</label>
                    <input type="text" inputMode="numeric" value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                      required maxLength={6} placeholder="000000" autoFocus
                      className={clsx(inputCls, 'text-center font-mono text-xl tracking-[0.4em]')} />
                  </div>
                  {error && <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">{error}</div>}
                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="w-full btn-primary justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</> : <><ShieldCheck className="w-4 h-4" /> Verify Email &amp; Sign In</>}
                  </button>
                </form>
                <div className="mt-5 text-center space-y-2">
                  <button onClick={resendOtp} disabled={loading}
                    className="text-brand-400 hover:text-brand-300 text-xs font-medium transition-colors disabled:opacity-50">
                    Didn't receive it? Resend code
                  </button>
                  <br />
                  <button onClick={() => resetState('login')} className="text-slate-500 hover:text-slate-400 text-xs transition-colors">
                    ← Back to sign in
                  </button>
                </div>
              </motion.div>
            )}

            {/* ═══ FORGOT — email step ═══ */}
            {mode === 'forgot' && (
              <motion.div key="forgot" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-7 h-7 text-blue-400" />
                  </div>
                  <h2 className="text-white font-bold text-xl">Reset Password</h2>
                  <p className="text-slate-400 text-sm mt-1">We'll send a 6-digit code to your email</p>
                </div>
                <form onSubmit={submitForgot} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">Email Address</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@company.com" className={inputCls} />
                  </div>
                  {error && <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">{error}</div>}
                  <button type="submit" disabled={loading}
                    className="w-full btn-primary justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : <><KeyRound className="w-4 h-4" /> Send Reset Code</>}
                  </button>
                </form>
                <button onClick={() => resetState('login')} className="w-full text-center text-slate-500 text-xs mt-4 hover:text-slate-400 transition-colors">← Back to sign in</button>
              </motion.div>
            )}

            {/* ═══ FORGOT — OTP + new password ═══ */}
            {mode === 'forgot-reset' && (
              <motion.div key="forgot-reset" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-4">
                    <RotateCcw className="w-7 h-7 text-emerald-400" />
                  </div>
                  <h2 className="text-white font-bold text-xl">Set New Password</h2>
                  <p className="text-slate-400 text-sm mt-1">Code sent to <span className="text-brand-400">{pendingEmail}</span></p>
                </div>
                <DemoCodeBox code={demoCode} />
                <form onSubmit={submitReset} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">6-Digit Verification Code</label>
                    <input type="text" inputMode="numeric" value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                      required maxLength={6} placeholder="000000" autoFocus
                      className={clsx(inputCls, 'text-center font-mono text-xl tracking-[0.4em]')} />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs font-medium mb-1.5">New Password</label>
                    <div className="relative">
                      <input type={showNewPw ? 'text' : 'password'} value={newPassword} onChange={e => setNewPw(e.target.value)} required
                        placeholder="Min 8 chars · Uppercase · Number · Special"
                        className={clsx(inputCls, 'pr-11')} />
                      <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                        {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {newPassword && (
                      <>
                        <div className="mt-2 flex gap-1.5">
                          {[0,1,2,3].map(i => <div key={i} className={clsx('h-1 flex-1 rounded-full transition-all', i < npStrength ? strengthColor[npStrength] : 'bg-slate-700')} />)}
                        </div>
                        <div className="mt-1.5 grid grid-cols-2 gap-1">
                          {checks.map(c => (
                            <div key={c.label} className="flex items-center gap-1.5 text-xs">
                              {c.test(newPassword) ? <CheckCircle className="w-3 h-3 text-emerald-400" /> : <XCircle className="w-3 h-3 text-slate-600" />}
                              <span className={c.test(newPassword) ? 'text-emerald-400' : 'text-slate-500'}>{c.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  {error && <div className="px-4 py-3 bg-red-950/60 border border-red-700/40 rounded-xl text-red-300 text-sm">{error}</div>}
                  <button type="submit" disabled={loading || npStrength < 4}
                    className="w-full btn-primary justify-center py-3.5 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Resetting...</> : <><RotateCcw className="w-4 h-4" /> Reset Password</>}
                  </button>
                </form>
                <button onClick={() => resetState('forgot')} className="w-full text-center text-slate-500 text-xs mt-4 hover:text-slate-400 transition-colors">← Re-send code</button>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        <p className="text-center text-slate-600 text-xs mt-6">
          By signing in, you agree to our{' '}
          <Link to="/privacy" className="text-slate-500 hover:text-slate-400">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
