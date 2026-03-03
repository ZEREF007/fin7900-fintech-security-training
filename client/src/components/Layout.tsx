import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import CustomCursor from './CustomCursor'

export default function Layout() {
  const location = useLocation()
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <CustomCursor />
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="pt-14"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

