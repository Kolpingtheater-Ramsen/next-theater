"use client"

import { useState } from 'react'

type VIPCodeInputProps = {
  onSubmit: (code: string) => boolean
}

export default function VIPCodeInput({ onSubmit }: VIPCodeInputProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!code.trim()) {
      setError('Bitte geben Sie einen VIP-Code ein.')
      return
    }

    const isValid = onSubmit(code.trim())
    
    if (isValid) {
      setSuccess(true)
      setError('')
    } else {
      setError('Ungültiger VIP-Code. Bitte versuchen Sie es erneut.')
      setSuccess(false)
    }
  }

  if (success) {
    return (
      <div className='p-4 bg-green-900/30 border border-green-500/50 rounded-lg'>
        <p className='text-green-400 flex items-center gap-2'>
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
          VIP-Code akzeptiert! Sie können jetzt buchen.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-3'>
      <div>
        <label htmlFor='vip-code' className='block text-sm font-medium mb-2'>
          Haben Sie einen VIP-Code?
        </label>
        <div className='flex gap-2'>
          <input
            type='text'
            id='vip-code'
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={`
              flex-1 px-4 py-2 rounded-lg bg-site-800 border 
              ${error ? 'border-red-500' : 'border-site-700'} 
              text-site-50 placeholder-site-500
              focus:outline-none focus:ring-2 focus:ring-kolping-400
              transition-colors
            `}
            placeholder='VIP-Code eingeben'
          />
          <button
            type='submit'
            className='px-4 py-2 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-medium transition-colors'
          >
            Einlösen
          </button>
        </div>
        {error && (
          <p className='mt-2 text-sm text-red-400'>{error}</p>
        )}
      </div>
    </form>
  )
}
