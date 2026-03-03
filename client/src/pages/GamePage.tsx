import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, Star, Trophy, RotateCcw, Clock, Flame } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import clsx from 'clsx'
import QuickTips from '../components/QuickTips'

const GAME_TIPS = [
  'Think about every scenario in the context of your real workplace. Ask yourself: could this happen to us?',
  'Pay attention to the explanations after each answer. They contain the practical knowledge that transfers directly to your job',
  'Share the phishing scenario with your team. Recognising a fake domain (like hkma-gov.net instead of hkma.gov.hk) is a critical skill everyone should practise',
  'After the game, write down the three scenarios you found hardest. Research each topic for 5 minutes to reinforce your understanding',
  'Play again with a colleague and discuss each answer together. Group discussion makes the lessons stick much longer than reading alone',
]

interface Scenario {
  id: number
  category: string
  situation: string
  question: string
  options: string[]
  correct: number
  explanation: string
  points: number
}

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    category: '📧 Phishing Attack',
    situation: 'You receive an email from "security@hkma-gov.net" warning your banking licence will be suspended. The email asks you to verify your credentials immediately via a link.',
    question: 'What should you do?',
    options: [
      'Click the link immediately — you cannot afford to lose your licence',
      'Check the sender domain carefully and visit the official HKMA website directly',
      'Forward the email to all colleagues to warn them',
      'Reply to the email asking for more information',
    ],
    correct: 1,
    explanation: 'The real HKMA domain is hkma.gov.hk — not hkma-gov.net. Always verify sender domains and navigate to official sites directly, never via email links. This is a classic spear phishing attempt.',
    points: 100,
  },
  {
    id: 2,
    category: '🔐 Password Security',
    situation: "A customer uses the password 'password123' for their digital wallet. They've used the same password on 5 other sites, one of which was breached last year.",
    question: "What is the PRIMARY risk here?",
    options: [
      'The password is too short',
      'Credential stuffing — attackers can use the breached password to access the wallet',
      'The customer should use their birthday as it is easier to remember',
      'Uppercase letters are missing',
    ],
    correct: 1,
    explanation: 'Credential stuffing attacks use breached username/password pairs to attempt login on other services. Password reuse is catastrophically dangerous — each service should have a unique, strong password.',
    points: 100,
  },
  {
    id: 3,
    category: '🏦 Incident Response',
    situation: 'Your FinTech wallet detects 50,000 failed login attempts in 10 minutes from IP addresses across 30 countries. Your SIEM has triggered an alert.',
    question: 'What is the CORRECT immediate response?',
    options: [
      'Wait 24 hours to confirm it is actually an attack',
      'Block all non-HK IP addresses permanently',
      'Activate IRP: implement rate limiting, CAPTCHA, multi-factor authentication challenge, and notify HKMA within 1 hour',
      'Send a press release to reassure customers',
    ],
    correct: 2,
    explanation: "HKMA's TM-E-1 requires reporting to HKMA within 1 hour. The Incident Response Plan should be activated immediately with rate limiting and MFA enforcement to stop the credential stuffing attack.",
    points: 150,
  },
  {
    id: 4,
    category: '🗄️ Data Storage',
    situation: "Your development team wants to store customer passport scans in the company's internal database for KYC verification purposes.",
    question: 'Which storage approach is most compliant with PCI DSS and PDPO?',
    options: [
      'Store passport images as plaintext files on the web server for easy access',
      'Encrypt passport images with AES-256, store in a segregated database, with access limited to KYC team only',
      'Store them in a shared Google Drive folder for convenience',
      "Don't store them — just ask customers to re-submit every time",
    ],
    correct: 1,
    explanation: 'Under PDPO DPP4 and PCI DSS, sensitive personal data must be encrypted at rest (AES-256) and storage segregated with least-privilege access. Plaintext storage is a direct PDPO violation.',
    points: 100,
  },
  {
    id: 5,
    category: '🔑 API Security',
    situation: "Your mobile wallet's API endpoint GET /api/transactions/12345 returns a list of transactions. A security researcher discovers that changing the ID to /api/transactions/12346 returns another user's transactions.",
    question: 'What vulnerability is this and how should it be fixed?',
    options: [
      'SQL Injection — add input validation',
      'BOLA (Broken Object Level Authorization) — verify that the authenticated user owns the requested resource before returning data',
      'SSRF — block internal network requests',
      'XSS — sanitise HTML output',
    ],
    correct: 1,
    explanation: "This is BOLA (Broken Object Level Authorization) — OWASP API Security #1. The fix is to always verify ownership: the API should check that the requesting user's ID matches the account owner's ID before returning any data.",
    points: 150,
  },
  {
    id: 6,
    category: '📋 GDPR Compliance',
    situation: 'Your HK FinTech acquires 10,000 European customers. On Day 3, you discover a data breach affecting some EU customer records. Your legal team is unsure about notification timelines.',
    question: 'What is the GDPR breach notification requirement?',
    options: [
      'Notify within 72 hours of becoming aware, to the relevant EU supervisory authority',
      'Notify within 30 days — you have plenty of time',
      'Notification is optional if fewer than 1,000 records are affected',
      'Only notify if customer payment data was stolen',
    ],
    correct: 0,
    explanation: 'GDPR Article 33 requires notification to the supervisory authority within 72 hours of becoming aware of a breach. Failure can result in fines up to €20M or 4% of global annual turnover.',
    points: 100,
  },
  {
    id: 7,
    category: '☁️ Cloud Security',
    situation: "A Capital One-style scenario: your cloud server has a WAF (Web Application Firewall) with an overly permissive IAM role. An attacker exploits an SSRF vulnerability to access the cloud metadata endpoint and obtain admin credentials.",
    question: "What BEST describes the primary security failure here?",
    options: [
      'The firewall was not installed properly',
      'Violation of Least Privilege — the WAF had far more permissions than needed; Zero Trust architecture was absent',
      'The server should have been on-premises instead of cloud',
      'Passwords were too short',
    ],
    correct: 1,
    explanation: "The Capital One breach ($80M+ fine) was primarily caused by a WAF IAM role with excessive permissions. Under Zero Trust and Least Privilege principles, the WAF should only have the minimal permissions required — not admin access to S3 buckets.",
    points: 200,
  },
  {
    id: 8,
    category: '🧑‍💼 Social Engineering',
    situation: "A caller identifies themselves as an HKMA inspector and asks your customer service rep to immediately provide a list of all accounts flagged for fraud review, saying it's urgent and classified.",
    question: "What should the customer service rep do?",
    options: [
      'Provide the list immediately — HKMA has authority over your institution',
      "Hang up, verify the caller's identity through official HKMA channels, and escalate to your compliance team before sharing any data",
      'Email the list to the caller to create a paper trail',
      'Provide a partial list as a compromise',
    ],
    correct: 1,
    explanation: 'This is a classic pretexting attack (social engineering). Legitimate regulators never demand immediate data disclosure by phone without formal written notice. Always verify identity through official channels and escalate sensitive requests to compliance.',
    points: 150,
  },
  {
    id: 9,
    category: '🔄 Business Continuity',
    situation: "The Equifax breach went undetected for 78 days. A critical Apache Struts CVE (CVE-2017-5638) had been known for months but wasn't patched.",
    question: "What patch management window should apply to Critical CVEs?",
    options: [
      'Critical CVEs should be patched within 7 days of disclosure',
      '30 days is the standard for all CVE severities',
      'Patch during the next quarterly maintenance window',
      'Only patch if the CVE has been actively exploited publicly',
    ],
    correct: 0,
    explanation: 'Security best practice and HKMA guidelines recommend: Critical CVEs within 7 days, High within 30 days, Medium within 90 days. Equifax\'s 78-day delay on a Critical CVE led to one of the largest breaches in history ($575M FTC settlement).',
    points: 100,
  },
  {
    id: 10,
    category: '🛡️ Zero Trust',
    situation: "Your IT team proposes a traditional perimeter security model: trust everything inside the corporate network, block everything outside.",
    question: "Why is the Zero Trust model superior for a FinTech company?",
    options: [
      "It isn't — perimeter security is perfectly adequate for modern threats",
      'Zero Trust is too expensive and only for large enterprises',
      'Zero Trust assumes breach by default, verifies every request regardless of network location, limiting damage from insider threats and lateral movement by compromised accounts',
      'Zero Trust only applies to external users, not internal employees',
    ],
    correct: 2,
    explanation: "Zero Trust (NIST SP 800-207: 'never trust, always verify') is superior because: (1) Perimeter models fail once the boundary is breached; (2) Insider threats are not stopped by perimeter controls; (3) Cloud workloads have no traditional perimeter. 70% of breaches involve insiders or compromised internal accounts.",
    points: 150,
  },
]

type State = 'intro' | 'playing' | 'finished'

export default function GamePage() {
  const { user, token } = useAuth()
  const [state, setState] = useState<State>('intro')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [score, setScore] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [maxStreak, setMaxStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [timerActive, setTimerActive] = useState(false)
  const [answers, setAnswers] = useState<Record<number, { selected: number; isCorrect: boolean }>>({})

  const scenario = SCENARIOS[currentIdx]

  // Timer
  useEffect(() => {
    if (!timerActive || revealed) return
    if (timeLeft <= 0) { handleAnswer(-1); return }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(id)
  }, [timerActive, timeLeft, revealed])

  const handleAnswer = useCallback((optIdx: number) => {
    if (revealed) return
    setSelected(optIdx)
    setRevealed(true)
    setTimerActive(false)

    const isCorrect = optIdx === scenario.correct
    const timeBonus = Math.floor(timeLeft * 3)
    const pts = isCorrect ? scenario.points + timeBonus : 0

    setAnswers(prev => ({ ...prev, [scenario.id]: { selected: optIdx, isCorrect } }))

    if (isCorrect) {
      setScore(s => s + pts)
      setCorrect(c => c + 1)
      setStreak(s => {
        const ns = s + 1
        setMaxStreak(m => Math.max(m, ns))
        return ns
      })
    } else {
      setStreak(0)
    }
  }, [revealed, scenario, timeLeft])

  const next = () => {
    if (currentIdx + 1 >= SCENARIOS.length) {
      finishGame()
    } else {
      setCurrentIdx(i => i + 1)
      setSelected(null)
      setRevealed(false)
      setTimeLeft(30)
    }
  }

  const finishGame = async () => {
    setState('finished')
    if (user && token) {
      const rank = score >= 1200 ? 'Security Expert' : score >= 800 ? 'Security Pro' : score >= 400 ? 'Security Trainee' : 'Rookie'
      await fetch('/api/progress/game', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ score, correct, total: SCENARIOS.length, max_streak: maxStreak, rank }),
      }).catch(() => {})
    }
  }

  const restart = () => {
    setState('intro')
    setCurrentIdx(0)
    setSelected(null)
    setRevealed(false)
    setScore(0)
    setCorrect(0)
    setStreak(0)
    setMaxStreak(0)
    setTimeLeft(30)
    setTimerActive(false)
    setAnswers({})
  }

  const startGame = () => {
    setState('playing')
    setTimerActive(true)
  }

  const pct = Math.round((correct / SCENARIOS.length) * 100)
  const rank = score >= 1200 ? { label: '🏆 Security Expert', color: 'text-amber-400' }
    : score >= 800 ? { label: '⭐ Security Pro', color: 'text-blue-400' }
    : score >= 400 ? { label: '🎯 Security Trainee', color: 'text-indigo-400' }
    : { label: '📚 Rookie', color: 'text-slate-400' }

  return (
    <div className="min-h-screen bg-slate-950">
      <AnimatePresence mode="wait">

        {/* INTRO */}
        {state === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen px-6">
            <div className="max-w-lg w-full text-center">
              <motion.div
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.4 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-600 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand-600/30"
              >
                <Shield className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-4xl font-extrabold text-white mb-3">Security Challenge 🎮</h1>
              <p className="text-slate-300 text-lg mb-6 leading-relaxed">
                Face <strong className="text-white">10 real-world cybersecurity scenarios</strong> and make the right call. Faster answers earn bonus points!
              </p>
              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { icon: Zap, label: '10 Scenarios', color: 'text-amber-400' },
                  { icon: Clock, label: '30s per question', color: 'text-blue-400' },
                  { icon: Star, label: 'Time bonus points', color: 'text-purple-400' },
                ].map((item, i) => (
                  <div key={i} className="card text-center py-4">
                    <item.icon className={clsx('w-6 h-6 mx-auto mb-1', item.color)} />
                    <div className="text-white text-xs font-semibold">{item.label}</div>
                  </div>
                ))}
              </div>
              <button onClick={startGame} className="btn-primary justify-center w-full py-4 text-lg">
                🚀 Start Challenge
              </button>
              {!user && (
                <p className="text-slate-500 text-xs mt-4">Sign in to save your scores to the leaderboard</p>
              )}

              {/* Quick Tips */}
              <QuickTips tips={GAME_TIPS} title="Getting the Most from This Game" />
            </div>
          </motion.div>
        )}

        {/* PLAYING */}
        {state === 'playing' && (
          <motion.div key={`q-${currentIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
            className="max-w-3xl mx-auto px-6 py-10">

            {/* Top bar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-sm">{currentIdx + 1}/{SCENARIOS.length}</span>
                <div className="h-2 w-36 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / SCENARIOS.length) * 100}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-4">
                {streak >= 2 && (
                  <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                    <Flame className="w-4 h-4" /> {streak}x streak
                  </div>
                )}
                <div className="text-brand-400 font-bold">{score} pts</div>
                <div className={clsx(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all',
                  timeLeft <= 10 ? 'border-red-500 text-red-400 animate-pulse' : 'border-brand-500 text-brand-300',
                )}>
                  {timeLeft}
                </div>
              </div>
            </div>

            {/* Category badge */}
            <div className="badge badge-blue mb-4 inline-block">{scenario.category}</div>

            {/* Situation */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 mb-5">
              <p className="text-slate-200 leading-relaxed text-sm">{scenario.situation}</p>
            </div>

            {/* Question */}
            <h2 className="text-white font-bold text-lg mb-4">{scenario.question}</h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {scenario.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => !revealed && handleAnswer(i)}
                  disabled={revealed}
                  className={clsx(
                    'w-full text-left px-5 py-4 rounded-2xl border text-sm font-medium transition-all',
                    !revealed && 'hover:border-brand-500/60 hover:bg-brand-900/20 bg-slate-800/40 border-slate-700/50 text-slate-200',
                    revealed && i === scenario.correct && 'bg-emerald-900/40 border-emerald-500/60 text-emerald-200',
                    revealed && selected === i && i !== scenario.correct && 'bg-red-900/40 border-red-500/60 text-red-200',
                    revealed && selected !== i && i !== scenario.correct && 'bg-slate-800/20 border-slate-800/40 text-slate-500',
                    !revealed && selected === i && 'bg-brand-900/30 border-brand-500/60',
                  )}
                >
                  <span className="inline-block w-6 h-6 rounded-lg bg-slate-700/60 text-center text-xs font-bold mr-3 text-slate-400 leading-6">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {revealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className={clsx(
                    'rounded-2xl p-5 mb-6 border',
                    selected === scenario.correct
                      ? 'bg-emerald-950/40 border-emerald-700/40'
                      : 'bg-red-950/40 border-red-700/40',
                  )}
                >
                  <div className="font-bold text-sm mb-2">
                    {selected === scenario.correct
                      ? `✅ Correct! +${scenario.points + Math.floor(timeLeft * 3)} pts`
                      : '❌ Incorrect'}
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{scenario.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {revealed && (
              <button onClick={next} className="btn-primary w-full justify-center py-4">
                {currentIdx + 1 < SCENARIOS.length ? 'Next Scenario →' : '🏁 See Results'}
              </button>
            )}
          </motion.div>
        )}

        {/* FINISHED */}
        {state === 'finished' && (
          <motion.div key="finished" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center min-h-screen px-6">
            <div className="max-w-lg w-full text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-600/30">
                <Trophy className="w-10 h-10 text-white" />
              </div>

              <h2 className="text-4xl font-extrabold text-white mb-2">Challenge Complete!</h2>
              <div className={clsx('text-2xl font-bold mb-1', rank.color)}>{rank.label}</div>
              <div className="text-amber-400 text-3xl font-extrabold mb-6">{score} points</div>

              <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                  { label: 'Score', value: `${pct}%` },
                  { label: 'Correct', value: `${correct}/${SCENARIOS.length}` },
                  { label: 'Max Streak', value: `${maxStreak}🔥` },
                ].map((s, i) => (
                  <div key={i} className="card text-center py-4">
                    <div className="text-white font-extrabold text-xl">{s.value}</div>
                    <div className="text-slate-400 text-xs mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Per-question summary */}
              <div className="grid grid-cols-5 gap-2 mb-8">
                {SCENARIOS.map(s => {
                  const a = answers[s.id]
                  return (
                    <div key={s.id} title={s.category}
                      className={clsx('h-2 rounded-full', a?.isCorrect ? 'bg-emerald-500' : 'bg-red-500')} />
                  )
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={restart} className="btn-secondary flex-1 justify-center py-3.5">
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}
