"use client"

import { useState } from 'react'

type BookingFormProps = {
  onSubmit: (name: string, email: string) => void
}

export default function BookingForm({ onSubmit }: BookingFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const validateForm = (): boolean => {
    const newErrors: { name?: string; email?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Bitte geben Sie Ihren Namen ein.'
    }

    if (!email.trim()) {
      newErrors.email = 'Bitte geben Sie Ihre E-Mail-Adresse ein.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(name.trim(), email.trim())
    }
  }

  return (
    <div className='glass rounded-xl p-6 md:p-8 max-w-xl mx-auto'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium mb-2'>
            Name *
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg bg-site-800 border 
              ${errors.name ? 'border-red-500' : 'border-site-700'} 
              text-site-50 placeholder-site-500
              focus:outline-none focus:ring-2 focus:ring-kolping-400
              transition-colors
            `}
            placeholder='Ihr vollständiger Name'
          />
          {errors.name && (
            <p className='mt-2 text-sm text-red-400'>{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor='email' className='block text-sm font-medium mb-2'>
            E-Mail-Adresse *
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`
              w-full px-4 py-3 rounded-lg bg-site-800 border 
              ${errors.email ? 'border-red-500' : 'border-site-700'} 
              text-site-50 placeholder-site-500
              focus:outline-none focus:ring-2 focus:ring-kolping-400
              transition-colors
            `}
            placeholder='ihre.email@beispiel.de'
          />
          {errors.email && (
            <p className='mt-2 text-sm text-red-400'>{errors.email}</p>
          )}
          <p className='mt-2 text-xs text-site-300'>
            Sie erhalten Ihre Buchungsbestätigung an diese E-Mail-Adresse.
          </p>
        </div>

        <div className='pt-4'>
          <button
            type='submit'
            className='w-full py-3 px-6 rounded-lg bg-kolping-500 hover:bg-kolping-600 text-white font-semibold shadow-lg transition-colors'
          >
            Buchung abschließen
          </button>
        </div>

        <p className='text-xs text-site-300 text-center'>
          * Pflichtfelder
        </p>
      </form>
    </div>
  )
}
