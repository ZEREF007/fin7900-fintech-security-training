import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ChevronRight, Trophy, RotateCcw, Brain } from 'lucide-react'
import clsx from 'clsx'

interface MCQ {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface Props {
  questions: MCQ[]
  moduleTitle: string
}

type Answer = number | null

export default function ModuleMCQ({ questions, moduleTitle }: Props) {
  const [started, setStarted] = useState(false)
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>(Array(questions.length).fill(null))
  const [showExplanation, setShowExplanation] = useState(false)
  const [finished, setFinished] = useState(false)

  const selected = answers[current]
  const isCorrect = selected === questions[current].correct

  const select = (idx: number) => {
    if (selected !== null) return
    const newAnswers = [...answers]
    newAnswers[current] = idx
    setAnswers(newAnswers)
    setShowExplanation(true)
  }

  const goNext = () => {
    setShowExplanation(false)
    if (current + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrent(c => c + 1)
    }
  }

  const restart = () => {
    setCurrent(0)
    setAnswers(Array(questions.length).fill(null))
    setShowExplanation(false)
    setFinished(false)
  }

  const score = answers.filter((a, i) => a === questions[i].correct).length

  if (!started) {
    return (
      <div className="mt-16 rounded-3xl overflow-hidden border border-purple-200 dark:border-purple-700/30 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/60 dark:to-indigo-950/60 backdrop-blur-sm">
        <div className="p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-600/20 border border-purple-300 dark:border-purple-500/30 flex items-center justify-center shrink-0">
            <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Did you grasp the content? Check it! 🧠</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-0">
              {questions.length} questions on <strong className="text-purple-700 dark:text-purple-300">{moduleTitle}</strong> — test your understanding before moving on.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStarted(true)}
            className="shrink-0 flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-900/40"
          >
            Start Quiz <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    )
  }

  if (finished) {
    const pct = Math.round((score / questions.length) * 100)
    const grade = pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good effort!' : 'Keep practising!'
    const gradeColor = pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'
    return (
      <div className="mt-16 rounded-3xl overflow-hidden border border-purple-200 dark:border-purple-700/30 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/60 dark:to-indigo-950/60 p-8 text-center">
        <Trophy className="w-14 h-14 text-yellow-500 dark:text-yellow-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Quiz Complete!</h3>
        <p className={clsx('text-3xl font-black mb-1', gradeColor)}>{grade}</p>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          You scored <span className="text-slate-900 dark:text-white font-bold">{score}</span> / {questions.length}{' '}
          <span className={gradeColor}>({pct}%)</span>
        </p>

        {/* Per-question summary */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-6 max-w-xs mx-auto">
          {answers.map((a, i) => (
            <div
              key={i}
              className={clsx(
                'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
                a === questions[i].correct
                  ? 'bg-emerald-100 dark:bg-emerald-700/60 text-emerald-700 dark:text-emerald-300 border border-emerald-400 dark:border-emerald-500/40'
                  : 'bg-red-100 dark:bg-red-800/60 text-red-700 dark:text-red-300 border border-red-400 dark:border-red-600/40',
              )}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <button
          onClick={restart}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all"
        >
          <RotateCcw className="w-4 h-4" /> Try Again
        </button>
      </div>
    )
  }

  const q = questions[current]

  return (
    <div className="mt-16 rounded-3xl overflow-hidden border border-purple-200 dark:border-purple-700/30 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/60 dark:to-indigo-950/60 backdrop-blur-sm">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-purple-200 dark:border-purple-700/30">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          <span className="text-purple-700 dark:text-purple-300 text-sm font-semibold">Knowledge Check</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-500 dark:text-slate-400 text-xs">
            Question {current + 1} of {questions.length}
          </span>
          <div className="w-24 h-1.5 bg-purple-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="p-6"
        >
          <p className="text-slate-900 dark:text-white font-semibold text-base leading-relaxed mb-5">{q.question}</p>

          <div className="space-y-2.5">
            {q.options.map((opt, i) => {
              let style = 'bg-white dark:bg-slate-800/60 border-slate-300 dark:border-slate-700/50 text-slate-700 dark:text-slate-300 hover:border-purple-400 dark:hover:border-purple-500/50 hover:bg-purple-50 dark:hover:bg-purple-950/30 cursor-pointer'
              if (selected !== null) {
                if (i === q.correct) style = 'bg-emerald-50 dark:bg-emerald-900/40 border-emerald-400 dark:border-emerald-500/60 text-emerald-800 dark:text-emerald-200 cursor-default'
                else if (i === selected) style = 'bg-red-50 dark:bg-red-900/40 border-red-400 dark:border-red-500/60 text-red-700 dark:text-red-200 cursor-default'
                else style = 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/30 text-slate-400 dark:text-slate-500 cursor-default'
              }
              return (
                <motion.button
                  key={i}
                  whileHover={selected === null ? { scale: 1.01 } : {}}
                  whileTap={selected === null ? { scale: 0.99 } : {}}
                  onClick={() => select(i)}
                  className={clsx('w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-sm', style)}
                >
                  <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {selected !== null && i === q.correct && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
                  {selected !== null && i === selected && i !== q.correct && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                </motion.button>
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className={clsx(
                  'mt-4 p-4 rounded-xl border text-sm leading-relaxed',
                  isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700/40 text-emerald-800 dark:text-emerald-200'
                    : 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700/40 text-blue-800 dark:text-blue-200',
                )}>
                  <p className="font-semibold mb-1">
                    {isCorrect ? '✅ Correct!' : `❌ Not quite — the correct answer is ${String.fromCharCode(65 + q.correct)}.`}
                  </p>
                  <p>{q.explanation}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-end"
            >
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl transition-all text-sm"
              >
                {current + 1 >= questions.length ? '🏁 Finish' : 'Next Question'} <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
