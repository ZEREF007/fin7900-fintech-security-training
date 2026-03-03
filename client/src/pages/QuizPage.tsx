import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain, Trophy, RotateCcw, Filter, ChevronRight,
  CheckCircle, XCircle, BookOpen, Target, Zap,
} from 'lucide-react'
import { QUIZ_DATA, type Question } from '../data/quizData'
import clsx from 'clsx'
import QuickTips from '../components/QuickTips'

const QUIZ_TIPS = [
  'Read every question carefully before selecting an answer. Many wrong answers are designed to seem correct at first glance',
  'If you are unsure, eliminate the obviously wrong options first. Usually two answers can be ruled out immediately',
  'After finishing, review every question you got wrong. The explanations are where most of the real learning happens',
  'Aim for 80% or above. At that level you have genuinely understood the material, not just guessed your way through',
  'Retake the quiz one week later. You will be surprised how much sticks from spacing out your practice',
]

type Difficulty = 'all' | 'basic' | 'intermediate' | 'advanced'
type Answer = number | null

const DIFF_COLORS: Record<string, string> = {
  basic: 'bg-emerald-900/60 text-emerald-300 border-emerald-700/40',
  intermediate: 'bg-amber-900/60 text-amber-300 border-amber-700/40',
  advanced: 'bg-red-900/60 text-red-300 border-red-700/40',
}

const MODULE_ICONS: Record<string, string> = {
  'Module 1': '📖', 'Module 2': '🔍', 'Module 3': '📊',
  'Module 4': '🛡️', 'Module 5': '📋', 'Multiple': '🌐',
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>('all')
  const [started, setStarted] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [finished, setFinished] = useState(false)

  const start = useCallback(() => {
    const pool = difficulty === 'all'
      ? QUIZ_DATA
      : QUIZ_DATA.filter(q => q.difficulty === difficulty)
    const qs = shuffle(pool).slice(0, Math.min(pool.length, difficulty === 'all' ? 30 : 15))
    setQuestions(qs)
    setAnswers(Array(qs.length).fill(null))
    setCurrent(0)
    setShowExplanation(false)
    setFinished(false)
    setStarted(true)
  }, [difficulty])

  const select = (idx: number) => {
    if (answers[current] !== null) return
    const next = [...answers]
    next[current] = idx
    setAnswers(next)
    setShowExplanation(true)
  }

  const goNext = () => {
    setShowExplanation(false)
    if (current + 1 >= questions.length) setFinished(true)
    else setCurrent(c => c + 1)
  }

  const restart = () => {
    setStarted(false)
    setFinished(false)
    setCurrent(0)
    setAnswers([])
    setShowExplanation(false)
  }

  const score = answers.filter((a, i) => a === questions[i]?.correct).length

  if (!started) {
    const counts: Record<string, number> = {
      all: QUIZ_DATA.length,
      basic: QUIZ_DATA.filter(q => q.difficulty === 'basic').length,
      intermediate: QUIZ_DATA.filter(q => q.difficulty === 'intermediate').length,
      advanced: QUIZ_DATA.filter(q => q.difficulty === 'advanced').length,
    }
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-brand-900/60 border border-brand-700/30 flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-brand-400" />
            </div>
            <h1 className="text-3xl font-black text-white mb-2">MCQ Quiz</h1>
            <p className="text-slate-400">
              Test your knowledge across all 5 modules. Choose a difficulty level to begin.
            </p>
          </div>

          {/* Difficulty selector */}
          <div className="card mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-white font-semibold text-sm">Select Difficulty</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['all', 'basic', 'intermediate', 'advanced'] as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={clsx(
                    'flex flex-col items-center gap-1 p-3 rounded-xl border text-sm font-semibold transition-all',
                    difficulty === d
                      ? 'bg-brand-600/20 border-brand-500/60 text-brand-300'
                      : 'bg-slate-800/60 border-slate-700/40 text-slate-400 hover:border-slate-500',
                  )}
                >
                  <span className="text-lg">
                    {d === 'all' ? '🌐' : d === 'basic' ? '🟢' : d === 'intermediate' ? '🟡' : '🔴'}
                  </span>
                  <span className="capitalize">{d}</span>
                  <span className="text-xs opacity-70">{counts[d]} Qs</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: <BookOpen className="w-4 h-4" />, label: 'Questions', value: difficulty === 'all' ? '30' : '≤15' },
              { icon: <Target className="w-4 h-4" />, label: 'Modules', value: '1 – 5' },
              { icon: <Zap className="w-4 h-4" />, label: 'Format', value: 'MCQ + Explanation' },
            ].map((item, i) => (
              <div key={i} className="card text-center py-4">
                <div className="text-brand-400 flex justify-center mb-1">{item.icon}</div>
                <div className="text-white font-bold text-sm">{item.value}</div>
                <div className="text-slate-500 text-xs">{item.label}</div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={start}
            className="w-full btn-primary justify-center py-4 text-base"
          >
            <Brain className="w-5 h-5" /> Start Quiz <ChevronRight className="w-4 h-4" />
          </motion.button>

          {/* Quick Tips */}
          <QuickTips tips={QUIZ_TIPS} title="Quiz Tips for Better Results" />
        </motion.div>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const grade = pct >= 80 ? '🏆 Excellent!' : pct >= 60 ? '👍 Good effort!' : '📚 Keep studying!'
    const gradeColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'
    const byModule: Record<string, { score: number; total: number }> = {}
    questions.forEach((q, i) => {
      const mod = q.module
      if (!byModule[mod]) byModule[mod] = { score: 0, total: 0 }
      byModule[mod].total++
      if (answers[i] === q.correct) byModule[mod].score++
    })
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="card text-center p-10 mb-6">
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-1">Quiz Complete!</h2>
            <p className={clsx('text-4xl font-black mb-2', gradeColor)}>{grade}</p>
            <p className="text-slate-400 mb-6">
              You scored <span className="text-white font-bold text-xl">{score}</span> /{' '}
              {questions.length} <span className={gradeColor}>({pct}%)</span>
            </p>

            {/* Q grid */}
            <div className="flex flex-wrap gap-1.5 justify-center mb-6">
              {answers.map((a, i) => (
                <div
                  key={i}
                  title={`Q${i + 1}: ${a === questions[i].correct ? 'Correct' : 'Incorrect'}`}
                  className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border',
                    a === questions[i].correct
                      ? 'bg-emerald-900/60 text-emerald-300 border-emerald-600/40'
                      : 'bg-red-900/60 text-red-300 border-red-600/40',
                  )}
                >
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={restart} className="btn-secondary flex items-center gap-2">
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </div>
          </div>

          {/* By module */}
          <div className="card">
            <h3 className="text-white font-bold mb-4">Performance by Module</h3>
            <div className="space-y-3">
              {Object.entries(byModule).map(([mod, { score: s, total }]) => (
                <div key={mod} className="flex items-center gap-3">
                  <span className="text-sm text-slate-400 w-24 shrink-0">{MODULE_ICONS[mod]} {mod}</span>
                  <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={clsx('h-full rounded-full transition-all', s / total >= 0.8 ? 'bg-emerald-500' : s / total >= 0.6 ? 'bg-amber-500' : 'bg-red-500')}
                      style={{ width: `${(s / total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-400 w-12 text-right">{s}/{total}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <QuickTips tips={QUIZ_TIPS} title="What to Do Next" />
        </motion.div>
      </div>
    )
  }

  const q = questions[current]
  const sel = answers[current]

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={clsx('badge border', DIFF_COLORS[q.difficulty])}>{q.difficulty}</span>
          <span className="text-slate-400 text-sm">{MODULE_ICONS[q.module]} {q.module}</span>
        </div>
        <span className="text-slate-400 text-sm">{current + 1} / {questions.length}</span>
      </div>
      <div className="h-1.5 bg-slate-800 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-brand-500 rounded-full transition-all duration-300"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <div className="card mb-4">
            <p className="text-xs text-slate-500 mb-3 font-medium">{q.objective}</p>
            <p className="text-white font-semibold text-lg leading-relaxed mb-5">{q.question}</p>

            <div className="space-y-2.5">
              {q.options.map((opt, i) => {
                let style = 'bg-slate-800/60 border-slate-700/40 text-slate-300 hover:border-brand-500/50 hover:bg-brand-950/30 cursor-pointer'
                if (sel !== null) {
                  if (i === q.correct) style = 'bg-emerald-900/40 border-emerald-500/60 text-emerald-200 cursor-default'
                  else if (i === sel) style = 'bg-red-900/40 border-red-500/60 text-red-200 cursor-default'
                  else style = 'bg-slate-800/30 border-slate-700/20 text-slate-500 cursor-default'
                }
                return (
                  <motion.button
                    key={i}
                    whileHover={sel === null ? { scale: 1.005 } : {}}
                    onClick={() => select(i)}
                    className={clsx('w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-sm', style)}
                  >
                    <span className="w-7 h-7 rounded-full border border-current flex items-center justify-center shrink-0 text-xs font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {sel !== null && i === q.correct && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {sel !== null && i === sel && i !== q.correct && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  </motion.button>
                )
              })}
            </div>
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="overflow-hidden"
              >
                <div className={clsx(
                  'rounded-2xl p-5 text-sm leading-relaxed mb-4 border',
                  sel === q.correct
                    ? 'bg-emerald-950/50 border-emerald-700/40 text-emerald-200'
                    : 'bg-blue-950/50 border-blue-700/40 text-blue-200',
                )}>
                  <p className="font-bold mb-2">
                    {sel === q.correct ? '✅ Correct!' : `❌ The correct answer is ${String.fromCharCode(65 + q.correct)}.`}
                  </p>
                  <p>{q.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {sel !== null && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={goNext}
              className="w-full btn-primary justify-center py-3.5"
            >
              {current + 1 >= questions.length ? '🏁 See Results' : 'Next Question'} <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
