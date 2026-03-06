import { motion } from 'framer-motion'
import { ExternalLink, Heart, Shield, BookOpen, Target, Linkedin, Rocket, Star } from 'lucide-react'

const RESUME_DOWNLOAD_URL = 'https://lifehkbueduhk-my.sharepoint.com/:b:/g/personal/25449745_life_hkbu_edu_hk/IQBgRkmLJ7qFQqLhFLuO4UqqAf1amA5rxjIBS3Qkoz1eRTE?e=XJD2eE'

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
              I'm a finance and technology student with a deep passion for the intersection
              of FinTech and product development. I believe that technology should empower
              people — not overwhelm them — and that real financial education should be
              accessible, engaging, and practical.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              My focus is on FinTech innovation: how digital payments, security platforms,
              and data-driven tools are reshaping the financial services landscape. This
              platform is a direct expression of that passion — built from scratch, from
              UI design to backend APIs to cloud deployment.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
              I'm always looking for opportunities to bridge the gap between complex
              financial technology concepts and real-world business impact.
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

        {/* Resume — Hire Me CTA */}
        <motion.div
          custom={2}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-700/40 shadow-lg"
        >
          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-10 text-center">
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Hire Me — Seriously.
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-lg max-w-xl mx-auto mb-2 leading-relaxed">
              You've just seen what I can build. A full-stack FinTech learning platform —
              React, Node.js, cloud-deployed, live data integrations — all designed in
              one assignment.
            </p>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-lg mx-auto mb-8 leading-relaxed">
              Imagine what I'll build with your team behind me.
              <span className="text-amber-600 dark:text-amber-400 font-semibold"> Invest in my potential</span> — 
              you won't regret it. ✨
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={RESUME_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/40 text-lg"
              >
                <Rocket className="w-5 h-5" />
                Here's My Résumé →
              </a>
              <a
                href="https://www.linkedin.com/in/acebhatt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#0A66C2] hover:bg-[#0856a8] text-white font-bold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-[#0A66C2]/40 text-lg"
              >
                <Linkedin className="w-5 h-5" />
                Let's Talk on LinkedIn
              </a>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-6 flex items-center justify-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              Available for internships, part-time roles &amp; exciting FinTech opportunities
            </p>
          </div>
        </motion.div>

        {/* LinkedIn Activity */}
        <motion.div
          custom={2.5}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#0A66C2]/10 dark:bg-[#0A66C2]/20 flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-[#0A66C2]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My LinkedIn Activity</h2>
          </div>
          <div className="card flex flex-col sm:flex-row items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-[#0A66C2] flex items-center justify-center shrink-0 text-white text-4xl font-extrabold shadow-lg">
              A
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="font-bold text-slate-900 dark:text-white text-xl mb-1">Ace Bhatt</p>
              <p className="text-slate-500 dark:text-slate-400 text-base mb-4">
                Finance &amp; Technology · FinTech Enthusiast · Builder
              </p>
              <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-5">
                Follow me on LinkedIn to see my latest thoughts on FinTech, product
                development, and what I'm building next. I share insights, project
                updates, and connect with professionals across the industry.
              </p>
              <a
                href="https://www.linkedin.com/in/acebhatt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A66C2] hover:bg-[#0856a8] text-white font-semibold rounded-xl transition-all text-base"
              >
                <Linkedin className="w-5 h-5" />
                Follow &amp; See My Posts
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
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
          <div className="text-4xl mb-4">🤝</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Let's Connect
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg mb-6 max-w-xl mx-auto leading-relaxed">
            Have feedback, questions, or just want to say hi? I'd love to hear from you.
            Reach out on LinkedIn — I'm always happy to connect with fellow learners and
            professionals.
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
