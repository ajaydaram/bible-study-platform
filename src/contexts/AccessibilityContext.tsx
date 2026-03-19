import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type FontSize = 'small' | 'normal' | 'large' | 'x-large'
type ContrastMode = 'normal' | 'high'
type LineSpacing = 'normal' | 'relaxed' | 'loose'
type FontFamily = 'default' | 'dyslexic' | 'serif' | 'mono'

interface AccessibilityContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
  contrastMode: ContrastMode
  setContrastMode: (mode: ContrastMode) => void
  reduceMotion: boolean
  setReduceMotion: (reduce: boolean) => void
  screenReaderMode: boolean
  setScreenReaderMode: (enabled: boolean) => void
  lineSpacing: LineSpacing
  setLineSpacing: (spacing: LineSpacing) => void
  fontFamily: FontFamily
  setFontFamily: (family: FontFamily) => void
  focusIndicator: boolean
  setFocusIndicator: (enabled: boolean) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

const STORAGE_KEY = 'scriptorium_accessibility'

// Font size multipliers
const FONT_SIZE_SCALES: Record<FontSize, string> = {
  small: '0.875',   // 14px base
  normal: '1',      // 16px base
  large: '1.125',   // 18px base
  'x-large': '1.25' // 20px base
}

// Line spacing multipliers
const LINE_SPACING_VALUES: Record<LineSpacing, string> = {
  normal: '1.5',
  relaxed: '1.75',
  loose: '2'
}

// Font family values
const FONT_FAMILY_VALUES: Record<FontFamily, string> = {
  default: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  dyslexic: '"OpenDyslexic", "Comic Sans MS", sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>('normal')
  const [contrastMode, setContrastModeState] = useState<ContrastMode>('normal')
  const [reduceMotion, setReduceMotionState] = useState(false)
  const [screenReaderMode, setScreenReaderModeState] = useState(false)
  const [lineSpacing, setLineSpacingState] = useState<LineSpacing>('normal')
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('default')
  const [focusIndicator, setFocusIndicatorState] = useState(true)

  useEffect(() => {
    // Load saved preferences
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const prefs = JSON.parse(stored)
        if (prefs.fontSize) setFontSizeState(prefs.fontSize)
        if (prefs.contrastMode) setContrastModeState(prefs.contrastMode)
        if (prefs.reduceMotion !== undefined) setReduceMotionState(prefs.reduceMotion)
        if (prefs.screenReaderMode !== undefined) setScreenReaderModeState(prefs.screenReaderMode)
        if (prefs.lineSpacing) setLineSpacingState(prefs.lineSpacing)
        if (prefs.fontFamily) setFontFamilyState(prefs.fontFamily)
        if (prefs.focusIndicator !== undefined) setFocusIndicatorState(prefs.focusIndicator)
      } catch (e) {
        console.error('Failed to parse accessibility preferences:', e)
      }
    }

    // Check system preferences for reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) {
      setReduceMotionState(true)
    }
  }, [])

  // Apply font size
  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', FONT_SIZE_SCALES[fontSize])
    document.documentElement.setAttribute('data-font-size', fontSize)
  }, [fontSize])

  // Apply high contrast mode
  useEffect(() => {
    if (contrastMode === 'high') {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [contrastMode])

  // Apply reduced motion
  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion')
    } else {
      document.documentElement.classList.remove('reduce-motion')
    }
  }, [reduceMotion])

  // Screen reader optimizations
  useEffect(() => {
    if (screenReaderMode) {
      document.documentElement.setAttribute('data-screen-reader', 'true')
    } else {
      document.documentElement.removeAttribute('data-screen-reader')
    }
  }, [screenReaderMode])

  // Apply line spacing
  useEffect(() => {
    document.documentElement.style.setProperty('--line-height', LINE_SPACING_VALUES[lineSpacing])
    document.documentElement.setAttribute('data-line-spacing', lineSpacing)
  }, [lineSpacing])

  // Apply font family
  useEffect(() => {
    document.documentElement.style.setProperty('--font-family', FONT_FAMILY_VALUES[fontFamily])
    document.documentElement.setAttribute('data-font-family', fontFamily)
  }, [fontFamily])

  // Apply focus indicator preference
  useEffect(() => {
    if (focusIndicator) {
      document.documentElement.classList.add('enhanced-focus')
    } else {
      document.documentElement.classList.remove('enhanced-focus')
    }
  }, [focusIndicator])

  const savePreferences = (prefs: Partial<{
    fontSize: FontSize
    contrastMode: ContrastMode
    reduceMotion: boolean
    screenReaderMode: boolean
    lineSpacing: LineSpacing
    fontFamily: FontFamily
    focusIndicator: boolean
  }>) => {
    const current = localStorage.getItem(STORAGE_KEY)
    const existing = current ? JSON.parse(current) : {}
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...prefs }))
  }

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size)
    savePreferences({ fontSize: size })
  }

  const setContrastMode = (mode: ContrastMode) => {
    setContrastModeState(mode)
    savePreferences({ contrastMode: mode })
  }

  const setReduceMotion = (reduce: boolean) => {
    setReduceMotionState(reduce)
    savePreferences({ reduceMotion: reduce })
  }

  const setScreenReaderMode = (enabled: boolean) => {
    setScreenReaderModeState(enabled)
    savePreferences({ screenReaderMode: enabled })
  }

  const setLineSpacing = (spacing: LineSpacing) => {
    setLineSpacingState(spacing)
    savePreferences({ lineSpacing: spacing })
  }

  const setFontFamily = (family: FontFamily) => {
    setFontFamilyState(family)
    savePreferences({ fontFamily: family })
  }

  const setFocusIndicator = (enabled: boolean) => {
    setFocusIndicatorState(enabled)
    savePreferences({ focusIndicator: enabled })
  }

  return (
    <AccessibilityContext.Provider value={{
      fontSize,
      setFontSize,
      contrastMode,
      setContrastMode,
      reduceMotion,
      setReduceMotion,
      screenReaderMode,
      setScreenReaderMode,
      lineSpacing,
      setLineSpacing,
      fontFamily,
      setFontFamily,
      focusIndicator,
      setFocusIndicator
    }}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
