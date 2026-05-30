import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth'
import { auth, googleProvider, identifyUser, trackEvent, AnalyticsEvents } from '../lib/firebase'
import { firebaseEnabled } from '../lib/firebase'
import { setSentryUser, clearSentryUser } from '../lib/sentry'
import type { User } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isGuest: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signInAsGuest: () => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Convert Firebase user to our User type
const formatUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || (firebaseUser.isAnonymous ? 'Guest' : 'User'),
  image: firebaseUser.photoURL || undefined,
  createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
  isGuest: firebaseUser.isAnonymous
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!firebaseEnabled) {
      setUser(null)
      setIsLoading(false)
      clearSentryUser()
      return
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const formattedUser = formatUser(firebaseUser)
        setUser(formattedUser)
        
        // Set user context for analytics and error tracking
        identifyUser(firebaseUser.uid, { name: formattedUser.name })
        setSentryUser(firebaseUser.uid, formattedUser.name)
        trackEvent(AnalyticsEvents.SESSION_START)
      } else {
        setUser(null)
        clearSentryUser()
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!firebaseEnabled) {
      return { success: false, error: 'Authentication is unavailable until Firebase is configured.' }
    }

    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error: any) {
      console.error('Sign in error:', error)
      let errorMessage = 'Failed to sign in'
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const signUp = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    if (!firebaseEnabled) {
      return { success: false, error: 'Authentication is unavailable until Firebase is configured.' }
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the display name
      await updateProfile(credential.user, { displayName: name })
      
      // Refresh the user state with the updated profile
      setUser(formatUser(credential.user))
      
      return { success: true }
    } catch (error: any) {
      console.error('Sign up error:', error)
      let errorMessage = 'Failed to create account'
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email already registered'
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address'
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (!firebaseEnabled) {
      return { success: false, error: 'Google sign-in is unavailable until Firebase is configured.' }
    }

    try {
      await signInWithPopup(auth, googleProvider)
      return { success: true }
    } catch (error: any) {
      console.error('Google sign in error:', error)
      let errorMessage = 'Failed to sign in with Google'
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign in cancelled'
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked. Please allow popups for this site.'
      }
      
      return { success: false, error: errorMessage }
    }
  }

  const signInAsGuest = async (): Promise<{ success: boolean; error?: string }> => {
    if (!firebaseEnabled) {
      setUser({
        id: 'guest',
        email: '',
        name: 'Guest',
        isGuest: true,
        createdAt: new Date().toISOString()
      })
      setIsLoading(false)
      return { success: true }
    }

    try {
      await signInAnonymously(auth)
      trackEvent(AnalyticsEvents.SESSION_START, { auth_method: 'guest' })
      return { success: true }
    } catch (error: any) {
      console.error('Guest sign in error:', error)
      return { success: false, error: 'Failed to continue as guest. Please try again.' }
    }
  }

  const signOut = async () => {
    if (!firebaseEnabled) {
      setUser(null)
      return
    }

    await firebaseSignOut(auth)
    setUser(null)
    clearSentryUser()
  }

  const isGuest = user?.isGuest ?? false

  return (
    <AuthContext.Provider value={{ user, isLoading, isGuest, signIn, signUp, signInWithGoogle, signInAsGuest, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
