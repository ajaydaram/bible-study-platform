/**
 * Accessibility Utilities
 * 
 * Provides utilities for focus management, screen reader announcements,
 * and keyboard navigation.
 */

import { useEffect, useRef, useCallback } from 'react'

// Focus trap hook - keeps focus within a container (useful for modals)
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store the previously focused element
    previousFocusRef.current = document.activeElement as HTMLElement

    // Get all focusable elements within the container
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus the first element
    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab: moving backwards
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab: moving forwards
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus when trap is deactivated
      previousFocusRef.current?.focus()
    }
  }, [isActive])

  return containerRef
}

// Hook for roving tabindex (for toolbars, menus, etc.)
export function useRovingTabIndex(
  items: HTMLElement[],
  options: {
    direction?: 'horizontal' | 'vertical' | 'both'
    loop?: boolean
  } = {}
) {
  const { direction = 'horizontal', loop = true } = options
  const indexRef = useRef(0)

  useEffect(() => {
    if (!items.length) return

    // Set initial tabindex
    items.forEach((item, i) => {
      item.setAttribute('tabindex', i === indexRef.current ? '0' : '-1')
    })

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = indexRef.current
      let nextIndex = currentIndex

      const isHorizontal = direction === 'horizontal' || direction === 'both'
      const isVertical = direction === 'vertical' || direction === 'both'

      if ((e.key === 'ArrowRight' && isHorizontal) || (e.key === 'ArrowDown' && isVertical)) {
        nextIndex = currentIndex + 1
        if (nextIndex >= items.length) {
          nextIndex = loop ? 0 : items.length - 1
        }
      } else if ((e.key === 'ArrowLeft' && isHorizontal) || (e.key === 'ArrowUp' && isVertical)) {
        nextIndex = currentIndex - 1
        if (nextIndex < 0) {
          nextIndex = loop ? items.length - 1 : 0
        }
      } else if (e.key === 'Home') {
        nextIndex = 0
      } else if (e.key === 'End') {
        nextIndex = items.length - 1
      } else {
        return
      }

      e.preventDefault()

      // Update tabindex
      items[currentIndex].setAttribute('tabindex', '-1')
      items[nextIndex].setAttribute('tabindex', '0')
      items[nextIndex].focus()
      indexRef.current = nextIndex
    }

    items.forEach(item => {
      item.addEventListener('keydown', handleKeyDown)
    })

    return () => {
      items.forEach(item => {
        item.removeEventListener('keydown', handleKeyDown)
      })
    }
  }, [items, direction, loop])

  const setCurrentIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      items[indexRef.current]?.setAttribute('tabindex', '-1')
      items[index].setAttribute('tabindex', '0')
      items[index].focus()
      indexRef.current = index
    }
  }, [items])

  return { setCurrentIndex, getIndex: () => indexRef.current }
}

// Hook for managing announcements to screen readers
export function useAnnouncement() {
  const announcementRef = useRef<HTMLDivElement | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Create announcement container if it doesn't exist
    if (!announcementRef.current) {
      const container = document.createElement('div')
      container.setAttribute('aria-live', 'polite')
      container.setAttribute('aria-atomic', 'true')
      container.setAttribute('role', 'status')
      container.className = 'sr-only'
      container.id = 'a11y-announcement'
      document.body.appendChild(container)
      announcementRef.current = container
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announcementRef.current) return

    // Clear any pending announcements
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Update aria-live attribute based on priority
    announcementRef.current.setAttribute('aria-live', priority)

    // Clear and set message (this triggers screen reader announcement)
    announcementRef.current.textContent = ''
    
    // Small delay to ensure the clearing registers
    timeoutRef.current = setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message
      }
    }, 50)
  }, [])

  return { announce }
}

// Focus management utilities
export const focusUtils = {
  // Focus first focusable element within a container
  focusFirst(container: HTMLElement) {
    const focusable = container.querySelector<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    focusable?.focus()
  },

  // Focus last focusable element within a container
  focusLast(container: HTMLElement) {
    const focusable = container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    focusable[focusable.length - 1]?.focus()
  },

  // Get all focusable elements within a container
  getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ))
  },

  // Check if an element is focusable
  isFocusable(element: HTMLElement): boolean {
    const focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    return element.matches(focusableSelector)
  }
}

// Keyboard shortcut hook
export function useKeyboardShortcut(
  key: string,
  handler: () => void,
  options: {
    ctrl?: boolean
    meta?: boolean
    shift?: boolean
    alt?: boolean
    enabled?: boolean
  } = {}
) {
  const { ctrl, meta, shift, alt, enabled = true } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const matchKey = e.key.toLowerCase() === key.toLowerCase()
      const matchCtrl = ctrl ? e.ctrlKey : true
      const matchMeta = meta ? e.metaKey : true
      const matchShift = shift ? e.shiftKey : true
      const matchAlt = alt ? e.altKey : true

      // For shortcuts with modifiers, check that no extra modifiers are pressed
      if (ctrl || meta || shift || alt) {
        const noExtraModifiers = 
          (ctrl === e.ctrlKey) &&
          (meta === e.metaKey) &&
          (shift === e.shiftKey) &&
          (alt === e.altKey)
        
        if (matchKey && noExtraModifiers) {
          e.preventDefault()
          handler()
        }
      } else if (matchKey && matchCtrl && matchMeta && matchShift && matchAlt) {
        handler()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [key, handler, ctrl, meta, shift, alt, enabled])
}

// Generate unique IDs for ARIA relationships
let idCounter = 0
export function generateId(prefix = 'a11y'): string {
  return `${prefix}-${++idCounter}`
}

// Hook for managing ARIA described-by and labelled-by relationships
export function useAriaRelationship() {
  const id = useRef(generateId())
  
  return {
    labelId: `${id.current}-label`,
    descriptionId: `${id.current}-description`,
    errorId: `${id.current}-error`,
    getAriaProps: (options: {
      hasLabel?: boolean
      hasDescription?: boolean
      hasError?: boolean
    }) => ({
      'aria-labelledby': options.hasLabel ? `${id.current}-label` : undefined,
      'aria-describedby': [
        options.hasDescription && `${id.current}-description`,
        options.hasError && `${id.current}-error`
      ].filter(Boolean).join(' ') || undefined
    })
  }
}
