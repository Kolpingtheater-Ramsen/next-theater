'use client'

import { useEffect } from 'react'

export function ViewTransitions() {
  useEffect(() => {
    // Check if View Transitions API is supported
    if (typeof document !== 'undefined' && 'startViewTransition' in document) {
      // Enable smooth view transitions for navigation
      const handleLinkClick = (e: MouseEvent) => {
        const target = (e.target as HTMLElement).closest('a')
        
        if (
          target &&
          target.href &&
          target.origin === window.location.origin &&
          !target.hasAttribute('target') &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey &&
          !e.altKey
        ) {
          // Let Next.js handle the navigation, view transitions will work via CSS
        }
      }

      document.addEventListener('click', handleLinkClick)
      
      return () => {
        document.removeEventListener('click', handleLinkClick)
      }
    }
  }, [])

  return null
}

