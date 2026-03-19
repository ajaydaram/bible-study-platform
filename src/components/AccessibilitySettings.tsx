import { Type, Contrast, Eye, Zap, Monitor } from 'lucide-react'
import { useAccessibility } from '../contexts/AccessibilityContext'

const FONT_SIZES = [
  { value: 'small', label: 'Small', preview: 'Aa' },
  { value: 'normal', label: 'Normal', preview: 'Aa' },
  { value: 'large', label: 'Large', preview: 'Aa' },
  { value: 'x-large', label: 'Extra Large', preview: 'Aa' }
] as const

export default function AccessibilitySettings() {
  const {
    fontSize,
    setFontSize,
    contrastMode,
    setContrastMode,
    reduceMotion,
    setReduceMotion,
    screenReaderMode,
    setScreenReaderMode
  } = useAccessibility()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Eye className="h-5 w-5" aria-hidden="true" />
        <span>Accessibility</span>
      </h2>
      
      <div className="space-y-6">
        {/* Font Size */}
        <div>
          <label 
            className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
            id="font-size-label"
          >
            <Type className="h-4 w-4" aria-hidden="true" />
            Text Size
          </label>
          <div 
            className="grid grid-cols-4 gap-2" 
            role="radiogroup" 
            aria-labelledby="font-size-label"
          >
            {FONT_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => setFontSize(size.value)}
                className={`
                  flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all
                  ${fontSize === size.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }
                `}
                role="radio"
                aria-checked={fontSize === size.value}
                aria-label={`${size.label} text size`}
              >
                <span 
                  className={`font-serif mb-1 ${
                    size.value === 'small' ? 'text-sm' :
                    size.value === 'normal' ? 'text-base' :
                    size.value === 'large' ? 'text-lg' :
                    'text-xl'
                  }`}
                  aria-hidden="true"
                >
                  {size.preview}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {size.label}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Adjusts the base text size throughout the app
          </p>
        </div>

        {/* High Contrast Mode */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Contrast className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                High Contrast
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Increases contrast for better readability
              </p>
            </div>
          </div>
          <button
            onClick={() => setContrastMode(contrastMode === 'normal' ? 'high' : 'normal')}
            className={`relative w-12 h-6 rounded-full transition-colors
              ${contrastMode === 'high' ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            role="switch"
            aria-checked={contrastMode === 'high'}
            aria-label="Toggle high contrast mode"
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                ${contrastMode === 'high' ? 'left-7' : 'left-1'}`}
            />
          </button>
        </div>

        {/* Reduce Motion */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Reduce Motion
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Minimizes animations and transitions
              </p>
            </div>
          </div>
          <button
            onClick={() => setReduceMotion(!reduceMotion)}
            className={`relative w-12 h-6 rounded-full transition-colors
              ${reduceMotion ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            role="switch"
            aria-checked={reduceMotion}
            aria-label="Toggle reduced motion"
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                ${reduceMotion ? 'left-7' : 'left-1'}`}
            />
          </button>
        </div>

        {/* Screen Reader Mode */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-start gap-3">
            <Monitor className="h-5 w-5 text-gray-400 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-medium text-gray-700 dark:text-gray-300">
                Screen Reader Optimized
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Enhances navigation for assistive technology
              </p>
            </div>
          </div>
          <button
            onClick={() => setScreenReaderMode(!screenReaderMode)}
            className={`relative w-12 h-6 rounded-full transition-colors
              ${screenReaderMode ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
            role="switch"
            aria-checked={screenReaderMode}
            aria-label="Toggle screen reader optimizations"
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                ${screenReaderMode ? 'left-7' : 'left-1'}`}
            />
          </button>
        </div>

        {/* Preview */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preview
          </p>
          <p 
            className="font-serif text-gray-600 dark:text-gray-400"
            style={{ fontSize: `calc(1rem * var(--font-scale, 1))` }}
          >
            "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
          </p>
          <p 
            className="text-sm text-primary-600 dark:text-primary-400 mt-2"
            style={{ fontSize: `calc(0.875rem * var(--font-scale, 1))` }}
          >
            — John 3:16 (KJV)
          </p>
        </div>
      </div>
    </div>
  )
}

// Skip link component for keyboard navigation
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 
        focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg
        focus:outline-none focus:ring-2 focus:ring-white"
    >
      Skip to main content
    </a>
  )
}

// Visually hidden but accessible to screen readers
export function VisuallyHidden({ children }: { children: React.ReactNode }) {
  return (
    <span className="sr-only">
      {children}
    </span>
  )
}

// Announce content to screen readers
export function LiveRegion({ 
  message, 
  politeness = 'polite' 
}: { 
  message: string
  politeness?: 'polite' | 'assertive' 
}) {
  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  )
}
