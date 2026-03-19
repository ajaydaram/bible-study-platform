import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initSentry, SentryErrorBoundary, captureError } from './lib/sentry'

// Initialize Sentry for error tracking
initSentry()

// Fallback Error Boundary Component (used when Sentry is not configured)
class FallbackErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error:', error, errorInfo)
    // Report to Sentry if available
    captureError(error, { componentStack: errorInfo.componentStack })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '50px auto' }}>
          <h1 style={{ color: '#dc2626' }}>Something went wrong</h1>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            We've been notified and are working to fix the issue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#2563eb',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Reload Page
          </button>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.href = '/'
            }}
            style={{
              background: '#e5e7eb',
              color: '#374151',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Go Home
          </button>
          {import.meta.env.DEV && this.state.error && (
            <details style={{ marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', color: '#6b7280' }}>Error Details (Dev Only)</summary>
              <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto', fontSize: '12px', marginTop: '10px' }}>
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }
    return this.props.children
  }
}

// Use Sentry's error boundary if DSN is configured, otherwise use fallback
const ErrorBoundary = import.meta.env.VITE_SENTRY_DSN 
  ? SentryErrorBoundary 
  : FallbackErrorBoundary

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary fallback={<FallbackErrorBoundary children={null} />}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)
