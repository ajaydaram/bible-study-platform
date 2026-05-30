import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics, logEvent, setUserId, setUserProperties } from 'firebase/analytics'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'

// Your web app's Firebase configuration - read from env for safety
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ''
}

export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId)

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize App Check for API protection (prevents unauthorized API usage)
// To enable: 
// 1. Go to Firebase Console > App Check
// 2. Register your app with reCAPTCHA Enterprise
// 3. Add the site key to .env as VITE_RECAPTCHA_SITE_KEY
if (firebaseEnabled && typeof window !== 'undefined' && import.meta.env.VITE_RECAPTCHA_SITE_KEY) {
  // Enable debug token for localhost development
  if (import.meta.env.DEV) {
    // @ts-expect-error - Debug token for development
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true
  }
  
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(import.meta.env.VITE_RECAPTCHA_SITE_KEY),
    isTokenAutoRefreshEnabled: true
  })
}

// Initialize services
export const auth = firebaseEnabled ? getAuth(app) : ({} as ReturnType<typeof getAuth>)
export const db = firebaseEnabled ? getFirestore(app) : ({} as ReturnType<typeof getFirestore>)
export const googleProvider = new GoogleAuthProvider()

// Initialize Analytics
export const analytics = firebaseEnabled && typeof window !== 'undefined' ? getAnalytics(app) : null

// Analytics helper functions
export const trackEvent = (eventName: string, params?: Record<string, unknown>) => {
  if (analytics) {
    logEvent(analytics, eventName, params)
  }
}

export const identifyUser = (userId: string, properties?: Record<string, unknown>) => {
  if (analytics) {
    setUserId(analytics, userId)
    if (properties) {
      setUserProperties(analytics, properties)
    }
  }
}

// Common events to track
export const AnalyticsEvents = {
  // Reading events
  READING_STARTED: 'reading_started',
  READING_COMPLETED: 'reading_completed',
  DAY_MARKED_COMPLETE: 'day_marked_complete',
  
  // Journal events
  JOURNAL_CREATED: 'journal_created',
  JOURNAL_EDITED: 'journal_edited',
  
  // Prayer events
  PRAYER_CREATED: 'prayer_created',
  PRAYER_ANSWERED: 'prayer_answered',
  
  // Feature usage
  AUDIO_PLAYED: 'audio_played',
  SEARCH_PERFORMED: 'search_performed',
  SEARCH: 'search',
  CROSS_REFERENCE_VIEWED: 'cross_reference_viewed',
  WORD_STUDY_VIEWED: 'word_study_viewed',
  
  // Sharing & social
  NOTE_SHARED: 'note_shared',
  USER_FOLLOWED: 'user_followed',
  ANNOTATION_CREATED: 'annotation_created',
  PDF_EXPORT: 'pdf_export',
  
  // Reading plans
  READING_PLAN_CREATED: 'reading_plan_created',
  READING_PLAN_STARTED: 'reading_plan_started',
  READING_PLAN_DAY_COMPLETED: 'reading_plan_day_completed',
  
  // Engagement
  SESSION_START: 'session_start',
  STREAK_MILESTONE: 'streak_milestone'
}

export default app
