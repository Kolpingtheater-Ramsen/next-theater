"use client"

import { useEffect } from 'react'

type MessageModalProps = {
  message: string
  onClose: () => void
  type?: 'error' | 'success' | 'info'
}

export default function MessageModal({ message, onClose, type = 'info' }: MessageModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const getIconColor = () => {
    switch (type) {
      case 'error':
        return 'text-red-400'
      case 'success':
        return 'text-green-400'
      default:
        return 'text-kolping-400'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'error':
        return (
          <svg className={`w-8 h-8 ${getIconColor()}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        )
      case 'success':
        return (
          <svg className={`w-8 h-8 ${getIconColor()}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        )
      default:
        return (
          <svg className={`w-8 h-8 ${getIconColor()}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
          </svg>
        )
    }
  }

  return (
    <div 
      className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'
      onClick={onClose}
      role='dialog'
      aria-modal='true'
      aria-labelledby='message-title'
    >
      <div 
        className='glass rounded-xl max-w-md w-full p-6'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='flex flex-col items-center text-center mb-6'>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            type === 'error' ? 'bg-red-900/30' : 
            type === 'success' ? 'bg-green-900/30' : 
            'bg-kolping-900/30'
          }`}>
            {getIcon()}
          </div>
          <h3 
            id='message-title'
            className='font-display text-xl font-bold mb-2'
          >
            {type === 'error' ? 'Fehler' : type === 'success' ? 'Erfolg' : 'Hinweis'}
          </h3>
          <p className='text-site-100'>{message}</p>
        </div>
        <button
          onClick={onClose}
          className='w-full px-4 py-3 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white transition-colors font-semibold'
          autoFocus
        >
          OK
        </button>
      </div>
    </div>
  )
}

