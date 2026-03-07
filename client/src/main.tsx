import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) { return { error: e.message } }
  render() {
    if (this.state.error) return (
      <div style={{ padding: 32, fontFamily: 'monospace', background: '#fff', color: '#c00', minHeight: '100vh' }}>
        <h2>App Error</h2>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{this.state.error}</pre>
        <p>Check browser console (F12) for full details.</p>
      </div>
    )
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
)
