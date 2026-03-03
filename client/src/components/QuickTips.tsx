import { motion } from 'framer-motion'
import { Lightbulb, CheckCircle } from 'lucide-react'

interface QuickTipsProps {
  tips: string[]
  title?: string
}

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -15 },
  visible: { opacity: 1, x: 0 },
}

export default function QuickTips({ tips, title = 'Quick Tips You Can Use Right Now' }: QuickTipsProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="mt-14 mb-4 rounded-2xl border border-amber-200 dark:border-amber-700/40
                 bg-amber-50 dark:bg-amber-950/30 p-7 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-amber-400/20 dark:bg-amber-500/20
                        flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-lg font-bold text-amber-900 dark:text-amber-200">{title}</h2>
      </div>

      {/* Tips list */}
      <ul className="space-y-3">
        {tips.map((tip, i) => (
          <motion.li
            key={i}
            variants={itemVariants}
            className="flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <span className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">{tip}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
