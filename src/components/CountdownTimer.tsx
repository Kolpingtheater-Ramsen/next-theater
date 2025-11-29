'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  targetDate: string // ISO date string
  title: string
  containerClassName?: string
}

export default function CountdownTimer({
  targetDate,
  title,
  containerClassName,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  } | null>(null)
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime()
      const now = new Date().getTime()
      const diff = target - now

      if (diff <= 0) {
        setIsExpired(true)
        return null
      }

      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      }
    }

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  if (isExpired || timeLeft === null) return null

  return (
    <div className={containerClassName || 'relative mx-auto max-w-3xl px-4'}>
      <div className='countdown-container relative overflow-hidden rounded-xl border border-site-700 bg-site-800 px-5 py-6 backdrop-blur'>
        <div className='mb-4 text-center text-sm font-semibold tracking-wide text-kolping-400'>
          🎭 {title}
        </div>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          <TimeUnit label='Tage' value={timeLeft.days} />
          <TimeUnit label='Std' value={timeLeft.hours} />
          <TimeUnit label='Min' value={timeLeft.minutes} />
          <TimeUnit label='Sek' value={timeLeft.seconds} pulse />
        </div>
      </div>
    </div>
  )
}

function TimeUnit({
  label,
  value,
  pulse,
}: {
  label: string
  value: number
  pulse?: boolean
}) {
  const display = value.toString().padStart(2, '0')

  return (
    <div className='countdown-unit relative overflow-hidden rounded-lg border border-site-700 bg-site-900 p-3'>
      <div className='relative z-10'>
        <div
          className={`
            mb-1 text-center font-extrabold tracking-wider text-transparent 
            bg-gradient-to-b from-kolping-400 to-orange-300 bg-clip-text 
            drop-shadow-[0_2px_8px_rgba(255,122,0,0.25)]
            ${pulse ? 'animate-pop' : ''}
          `}
          key={display}
        >
          <span className='text-4xl sm:text-5xl tabular-nums'>{display}</span>
        </div>
        <div className='text-center text-[11px] font-medium uppercase tracking-wide text-site-50'>
          {label}
        </div>
      </div>

      <style jsx>{`
        .animate-pop {
          animation: pop 900ms ease-out;
        }
        @keyframes pop {
          0% {
            transform: translateZ(0) scale(1);
            opacity: 0.9;
          }
          35% {
            transform: translateZ(0) scale(1.08);
            opacity: 1;
          }
          100% {
            transform: translateZ(0) scale(1);
            opacity: 1;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-pop {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}
