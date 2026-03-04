import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Slide } from '../data/modules'
import clsx from 'clsx'

interface Props {
  slides: Slide[]
  color?: string
  onAllSlidesViewed?: () => void
}

export default function SlideViewer({ slides, color = 'from-brand-600 to-accent-600', onAllSlidesViewed }: Props) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const visited = useRef<Set<number>>(new Set([0]))
  const firedRef = useRef(false)

  const goTo = (idx: number) => {
    setDirection(idx > current ? 1 : -1)
    visited.current.add(idx)
    setCurrent(idx)
    if (!firedRef.current && onAllSlidesViewed && visited.current.size >= slides.length) {
      firedRef.current = true
      onAllSlidesViewed()
    }
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
      {/* Slide box — grows to fit content, no internal scroll */}
      <div className="relative bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">

        {/* Slide number badge */}
        <div className={clsx('absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r', color)}>
          {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>

        {/* Slide content — grows to fit content, no scroll */}
        <div className="min-h-[480px]">
          <AnimatePresence custom={direction} mode="wait" initial={false}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="px-8 pt-14 pb-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-5 leading-snug">
                {slides[current].title}
              </h2>
              <div
                className="text-slate-700 dark:text-slate-200 text-[17px] leading-relaxed space-y-3 [&_strong]:text-slate-900 [&_strong]:dark:text-white [&_li]:text-slate-700 [&_li]:dark:text-slate-200"
                dangerouslySetInnerHTML={{ __html: slides[current].content }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation bar pinned to bottom of card */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-700/40 bg-slate-50 dark:bg-slate-900/40">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700/70 dark:hover:bg-slate-600 disabled:opacity-25 disabled:cursor-not-allowed text-slate-700 dark:text-white text-sm font-medium transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={clsx(
                  'transition-all rounded-full',
                  i === current ? `w-5 h-2 bg-brand-500 dark:bg-brand-400` : 'w-2 h-2 bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500',
                )}
              />
            ))}
          </div>

          <button
            onClick={next}
            disabled={current === slides.length - 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700/70 dark:hover:bg-slate-600 disabled:opacity-25 disabled:cursor-not-allowed text-slate-700 dark:text-white text-sm font-medium transition-all"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
