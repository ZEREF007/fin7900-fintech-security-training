import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Slide } from '../data/modules'
import clsx from 'clsx'

interface Props {
  slides: Slide[]
  color?: string
}

export default function SlideViewer({ slides, color = 'from-brand-600 to-accent-600' }: Props) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }
  const prev = () => current > 0 && goTo(current - 1)
  const next = () => current < slides.length - 1 && goTo(current + 1)

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -60 : 60, opacity: 0 }),
  }

  return (
    <div className="select-none">
      <div className="relative h-[420px] bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
        {/* Slide number badge */}
        <div className={clsx('absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r', color)}>
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>

        {/* Slide content */}
        <AnimatePresence custom={direction} mode="wait" initial={false}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 p-8 pt-14 overflow-y-auto"
          >
            <h2 className="text-xl font-bold text-white mb-4">{slides[current].title}</h2>
            <div
              className="text-slate-300 text-sm leading-relaxed space-y-2 prose-ul:space-y-1"
              dangerouslySetInnerHTML={{ __html: slides[current].content }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev/next arrow buttons */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-700/70 hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={next}
          disabled={current === slides.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-slate-700/70 hover:bg-slate-600 disabled:opacity-20 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={clsx(
              'transition-all rounded-full',
              i === current
                ? `w-6 h-2 bg-brand-400`
                : 'w-2 h-2 bg-slate-600 hover:bg-slate-500',
            )}
          />
        ))}
      </div>
    </div>
  )
}
