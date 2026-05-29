import * as Sentry from '@sentry/react'

// Initialize Sentry for error tracking
// To enable:
// 1. Create a Sentry account at https://sentry.io
// 2. Create a new React project
// 3. Copy the DSN and add it to .env as VITE_SENTRY_DSN

export const initSentry = () => {
  const dsn = import.meta.env.VITE_SENTRY_DSN

  if (!dsn) {
    console.log('Sentry DSN not configured. Error tracking disabled.')
    return
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    
    // Performance monitoring
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Capture 10% of sessions for replay
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Sample rates
    tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0, // 20% in prod, 100% in dev
    replaysSessionSampleRate: 0.1, // 10% of sessions
    replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
    
    // Filter out known non-issues
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      'ResizeObserver loop',
      // Network errors
      'Network request failed',
      'Failed to fetch',
      'Load failed',
      // Auth popups closed by user
      'popup-closed-by-user',
    ],
    
    // Before sending, filter sensitive data
    beforeSend(event) {
      // Remove sensitive user data
      if (event.user) {
        delete event.user.email
        delete event.user.ip_address
      }
      return event
    },
  })

  console.log('Sentry initialized for error tracking')
}

// Set user context (call after login)
export const setSentryUser = (userId: string, username?: string) => {
  Sentry.setUser({
    id: userId,
    username: username || undefined,
  })
}

// Clear user context (call after logout)
export const clearSentryUser = () => {
  Sentry.setUser(null)
}

// Capture custom errors
export const captureError = (error: Error, context?: Record<string, unknown>) => {
  Sentry.captureException(error, {
    extra: context,
  })
}

// Capture custom messages
export const captureMessage = (message: string, level: Sentry.SeverityLevel = 'info') => {
  Sentry.captureMessage(message, level)
}

// Add breadcrumb for debugging
export const addBreadcrumb = (
  message: string, 
  category: string, 
  data?: Record<string, unknown>
) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  })
}

// Export Sentry's ErrorBoundary for React
export const SentryErrorBoundary = Sentry.ErrorBoundary
