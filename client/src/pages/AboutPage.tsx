import { motion } from 'framer-motion'
import { ExternalLink, Heart, Shield, BookOpen, Target, Linkedin, TrendingUp, Globe, CreditCard } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
}

const WHAT_I_BUILT = [
  { icon: '🛡️', title: '5 Deep-Dive Modules', desc: 'Comprehensive learning content covering every angle of data-breach security in FinTech.' },
  { icon: '🎯', title: '50 Practice MCQs', desc: 'Carefully crafted questions with instant feedback and plain-English explanations.' },
  { icon: '📊', title: 'Live Threat Feed', desc: 'Real-time CISA KEV data so learners always see what attackers are exploiting right now.' },
  { icon: '⚖️', title: 'Laws & Regulations', desc: 'GDPR, PDPO, PCI-DSS and more — mapped to real compliance scenarios.' },
  { icon: '🌐', title: 'Multilingual Support', desc: 'Content available in English and Chinese to reach a wider audience.' },
  { icon: '📄', title: 'Full Progress Report', desc: 'A built-in academic report documenting the design and development of this platform.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20">

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-accent-600 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(124,58,237,0.3),transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center hero-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-6 text-4xl"
          >
            👋
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight"
          >
            Hi, I'm <span className="text-accent-400">Ace Bhatt</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-white/80 max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Developer & creator of GuardYourData — a FinTech security training
            platform built as part of my FIN7900 Individual Assignment.
          </motion.p>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            href="https://www.linkedin.com/in/acebhatt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#0A66C2] hover:bg-[#0856a8] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#0A66C2]/40 text-base"
          >
            <Linkedin className="w-5 h-5" />
            Connect on LinkedIn
            <ExternalLink className="w-4 h-4 opacity-70" />
          </motion.a>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Personal thank-you */}
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="card border-l-4 border-brand-500 bg-gradient-to-r from-brand-50 to-white dark:from-brand-950/40 dark:to-slate-800/60"
        >
          <div className="flex gap-4 items-start">
            <div className="text-3xl shrink-0 mt-1">💙</div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                A Personal Thank You
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg mb-4">
                I want to personally thank <strong>you</strong> — every single person who
                has taken the time to go through this platform. Whether you completed one
                module or worked through every quiz, you've invested in something that
                genuinely matters: protecting yourself and the people around you from
                cyber threats.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg mb-4">
                Data breaches aren't just headlines — they affect real people, real
                businesses, and real livelihoods. The fact that you're here, learning
                and engaging with this material, means the world to me. Security
                awareness starts with individuals who care enough to show up, and
                that's exactly what you've done.
              </p>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                This project was a labour of love, and your engagement makes every
                hour of work worth it. Thank you, sincerely. 🙏
              </p>
            </div>
          </div>
        </motion.div>

        {/* About me — LinkedIn bio */}
        <motion.div
          custom={1}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About Me</h2>
          </div>
          <div className="card space-y-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              Computer Science graduate currently pursuing an MSc in Finance at Hong Kong Baptist University,
              specializing in Algorithmic and High Frequency Trading. Achieved a 4.0 CGPA and recipient of
              the Hong Kong Future Talents Scholarship (HKD 100K).
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              I have experience on both the technology and finance side. I worked as a Financial Consultant
              at AMG Financial Group and as a Data Engineer at CedarGate Technologies, building reporting
              automation and data pipelines with Python, SQL, Excel, Airflow, PySpark, and Redshift.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              I genuinely enjoy keeping track of global markets. I follow news and pricing daily using
              Bloomberg Terminal, Reuters, and TradingView. I trade futures, crypto, and equities using
              IBKR and have a strong interest in macro strategy, rates, and interest rate trading.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              Outside work, I play poker and chess, and enjoy adventure sports.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              I am actively looking for trader, dealer, or data roles supporting trading and global markets
              teams. Happy to work day or night shifts. I thrive in high-intensity environments where I can
              put in 80 to 90 hours a week, take on real responsibilities, and contribute meaningfully to
              the team. I am also open to FinTech roles.
            </p>
            <a
              href="https://www.linkedin.com/in/acebhatt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0A66C2] hover:underline font-semibold text-base"
            >
              <Linkedin className="w-4 h-4" />
              View full profile on LinkedIn
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </motion.div>

        {/* Interests */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
              <Target className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interests</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            <div className="card flex flex-col items-center text-center gap-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Sales &amp; Trading</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Financial markets, trading strategies, derivatives, and the mechanics of price discovery.
              </p>
            </div>
            <div className="card flex flex-col items-center text-center gap-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Web 3.0</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Blockchain, decentralised finance, smart contracts, and the future of trustless infrastructure.
              </p>
            </div>
            <div className="card flex flex-col items-center text-center gap-3 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">FinTech</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Digital payments, neobanks, RegTech, and how technology is reshaping financial services.
              </p>
            </div>
          </div>
        </motion.div>

        {/* About the project */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-900/40 flex items-center justify-center">
              <Shield className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">About This Project</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg mb-6">
            GuardYourData was designed and developed from scratch as my FIN7900 Individual
            Assignment. The goal was simple: make data-security education genuinely
            accessible to finance professionals — no jargon, no barriers, just clear and
            actionable knowledge.
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
            I built everything you see here — the React front-end, the Node.js back-end,
            the database, the quiz engine, the live threat feed integration, theming
            system, and the report. It's been an incredible journey from blank canvas to
            a fully deployed learning platform.
          </p>
        </motion.div>

        {/* What I built grid */}
        <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">What's Inside</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_I_BUILT.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="card hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1 text-base">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tech stack */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Built With</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              'React 18', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion',
              'Node.js', 'Express', 'MySQL', 'Resend', 'Recharts', 'React Router',
              'Render (cloud)'
            ].map(tech => (
              <span
                key={tech}
                className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-medium shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Connect */}
        <motion.div
          custom={6}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="card text-center bg-gradient-to-br from-brand-50 to-accent-50/30 dark:from-brand-950/30 dark:to-accent-950/20 border-brand-200/60 dark:border-brand-700/30"
        >
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Get In Touch
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-2 max-w-xl mx-auto leading-relaxed">
            Have any queries? Hit me up — I'm always happy to help.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-base mb-6 max-w-xl mx-auto leading-relaxed">
            If you're a professional in the FinTech field — let's chat.
          </p>
          <a
            href="https://www.linkedin.com/in/acebhatt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#0A66C2] hover:bg-[#0856a8] text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-[#0A66C2]/40 text-base"
          >
            <Linkedin className="w-5 h-5" />
            linkedin.com/in/acebhatt
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
        </motion.div>

        {/* Footer note */}
        <motion.div
          custom={7}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-slate-400 dark:text-slate-500 text-sm flex items-center justify-center gap-1.5">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> by Ace Bhatt · FIN7900 Individual Assignment · 2026
          </p>
        </motion.div>

      </div>
    </div>
  )
}
