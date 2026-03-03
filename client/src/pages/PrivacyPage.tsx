import { motion } from 'framer-motion'
import { Shield, Lock, Eye, Database, Clock, Mail } from 'lucide-react'
import QuickTips from '../components/QuickTips'

const PRIVACY_TIPS = [
  'Log out of this platform when using a shared or public computer so your training record cannot be viewed by others',
  'Use a strong, unique password for your account here, and never reuse it on another site',
  'If you stop using this platform, contact the administrator to have your account and all associated data deleted permanently',
  'This platform stores your progress in a database. Ask the administrator what happens to your data after the course period ends',
]

const sections = [
  {
    icon: Database,
    title: 'Data We Collect',
    content: 'We collect the following types of information when you use this training platform: (1) Account data — your name, email address, and a securely hashed password stored using bcrypt with 12 rounds; (2) Learning activity — pages visited, modules completed, quiz scores, and game results; (3) No payment data — this platform does not process payments or store financial information of any kind.',
  },
  {
    icon: Lock,
    title: 'How Passwords Are Protected',
    content: "Your password is never stored in plaintext. It is hashed using bcrypt with a salt factor of 12, making it computationally infeasible to reverse even with modern hardware. This means even the platform administrator cannot see your original password. If you forget your password, it must be reset — it cannot be 'looked up'.",
  },
  {
    icon: Shield,
    title: 'Authentication & Sessions',
    content: 'We use JSON Web Tokens (JWT) for session management. Tokens are signed with a secure secret key and expire after 7 days. Your token is stored in your browser\'s localStorage. We recommend logging out when using shared computers. Tokens are not automatically refreshed — you will be prompted to sign in again after expiry.',
  },
  {
    icon: Eye,
    title: 'How We Use Your Data',
    content: 'Your learning activity data is used exclusively to: (1) Power your personal Dashboard showing module completion and quiz performance; (2) Allow the training administrator to monitor aggregate platform engagement (no personal content is viewed); (3) Improve course content based on quiz performance patterns. Your email address is never shared with third parties, not used for marketing, and not sold.',
  },
  {
    icon: Clock,
    title: 'Data Retention',
    content: 'Your account and learning records are retained for the duration of the course period. You may request deletion of your account and all associated data at any time by contacting the course administrator. Deletion is permanent and includes all visit records, quiz attempts, and game history.',
  },
  {
    icon: Database,
    title: 'Cookies & Tracking',
    content: 'This platform does not use tracking cookies. Google Analytics is configured with a placeholder ID only (G-XXXXXXXXXX) in the HTML templates and does not collect real data unless configured with a valid measurement ID. No third-party advertising trackers are used on this educational platform.',
  },
  {
    icon: Shield,
    title: 'Data Security Measures',
    content: 'Security controls in place include: (1) All passwords hashed with bcrypt 12 rounds; (2) JWT tokens with expiry for session management; (3) Role-based access control (learner vs. admin); (4) SQLite database with WAL mode and referential integrity constraints; (5) Input validation on all API endpoints; (6) CORS restrictions on API access.',
  },
  {
    icon: Lock,
    title: 'PDPO Compliance',
    content: "This platform is designed to comply with Hong Kong's Personal Data (Privacy) Ordinance (Cap. 486). Under Data Protection Principle 1 (DPP1), data collection is limited to what is necessary for the training purpose. Under DPP4, all practicable steps are taken to protect personal data from unauthorised access. Under DPP3, your data is not used for any purpose other than the training programme.",
  },
  {
    icon: Eye,
    title: 'Your Rights',
    content: 'Under PDPO, you have the right to: (1) Request access to personal data we hold about you; (2) Request correction of inaccurate personal data; (3) Request deletion of your account and all associated data; (4) Enquire about the types of personal data we hold. To exercise any of these rights, please contact the course administrator.',
  },
  {
    icon: Mail,
    title: 'Contact',
    content: 'If you have concerns about how your data is handled, or wish to exercise your data rights, please contact the platform administrator at the email address shown on the contact page. We aim to respond to all data requests within 10 business days.',
  },
]

export default function PrivacyPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-slate-950">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800/40 to-slate-900 border-b border-slate-800/60">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <span className="badge badge-green mb-4 inline-block">Privacy Policy</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
            🔏 Privacy &amp; <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Data Policy</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl leading-relaxed">
            How the FinTech Security Training Platform collects, uses, and protects your personal data — in full compliance with PDPO (Cap. 486).
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <span className="bg-emerald-900/30 border border-emerald-700/40 text-emerald-300 text-xs px-3 py-1.5 rounded-full font-medium">✅ PDPO Compliant</span>
            <span className="bg-blue-900/30 border border-blue-700/40 text-blue-300 text-xs px-3 py-1.5 rounded-full font-medium">🔒 bcrypt 12 rounds</span>
            <span className="bg-purple-900/30 border border-purple-700/40 text-purple-300 text-xs px-3 py-1.5 rounded-full font-medium">🛡️ JWT Auth</span>
            <span className="bg-slate-700/40 border border-slate-600/40 text-slate-300 text-xs px-3 py-1.5 rounded-full font-medium">📅 Last updated: 2024</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="card"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center shrink-0 mt-0.5">
                  <section.icon className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base mb-2">
                    {idx + 1}. {section.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed">{section.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 text-center text-slate-500 text-xs space-y-1">
          <p>This privacy policy applies to the FinTech Security Training Platform.</p>
          <p>Last reviewed: 2025</p>
        </div>

        {/* Quick Tips */}
        <QuickTips tips={PRIVACY_TIPS} title="Protect Your Account on This Platform" />
      </div>
    </motion.div>
  )
}
