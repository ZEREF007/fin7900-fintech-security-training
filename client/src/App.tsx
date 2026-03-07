import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ModulePage from './pages/ModulePage'
import QuizPage from './pages/QuizPage'
import GlossaryPage from './pages/GlossaryPage'
import DashboardPage from './pages/DashboardPage'
import LawsPage from './pages/LawsPage'
import ReferencesPage from './pages/ReferencesPage'
import PrivacyPage from './pages/PrivacyPage'
import AuthPage from './pages/AuthPage'
import AdminPage from './pages/AdminPage'
import GamePage from './pages/GamePage'
import ThankYouPage from './pages/ThankYouPage'
import FeedbackPage from './pages/FeedbackPage'
import LivePage from './pages/LivePage'
import SummaryPage from './pages/SummaryPage'
import AboutPage from './pages/AboutPage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/module/:id" element={<ModulePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/laws" element={<LawsPage />} />
            <Route path="/references" element={<ReferencesPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/summary" element={<SummaryPage />} />
            <Route path="/thankyou" element={<ThankYouPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
