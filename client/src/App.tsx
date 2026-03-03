import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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
import LivePage from './pages/LivePage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<Layout />}>
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
            <Route path="/thankyou" element={<ThankYouPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
