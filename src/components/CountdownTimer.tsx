'use client'

import { useState, useEffect, useMemo } from 'react'

interface CountdownTimerProps {
  targetDate: string // ISO date string
  title: string
}

export default function CountdownTimer({
  targetDate,
  title,
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

  const progress = useMemo(() => {
    if (!timeLeft) return { hour: 0, minute: 0, second: 0 }
    return {
      hour: (timeLeft.minutes * 60 + timeLeft.seconds) / 3600,
      minute: timeLeft.seconds / 60,
      second: 1 - (timeLeft.seconds % 1),
    }
  }, [timeLeft])

  if (isExpired || timeLeft === null) return null

  return (
    <div className='relative mx-auto max-w-3xl px-4'>
      <div className='relative overflow-hidden rounded-xl p-[2px] epic-card'>
        <div className='relative rounded-[10px] border border-white/10 bg-site-900/70 px-5 py-6 backdrop-blur'>
          <div className='mb-4 text-center text-sm font-semibold tracking-wide text-kolping-400'>
            🎭 {title}
          </div>
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
            <TimeUnit label='Tage' value={timeLeft.days} />
            <TimeUnit
              label='Std'
              value={timeLeft.hours}
              progress={progress.hour}
            />
            <TimeUnit
              label='Min'
              value={timeLeft.minutes}
              progress={progress.minute}
            />
            <TimeUnit
              label='Sek'
              value={timeLeft.seconds}
              progress={progress.minute}
              pulse
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .epic-card::before {
          content: '';
          position: absolute;
          inset: -200%;
          background: conic-gradient(
            from 0deg,
            rgba(255, 122, 0, 0.6),
            rgba(255, 176, 73, 0.4),
            rgba(255, 122, 0, 0.6)
          );
          animation: spin 8s linear infinite;
          filter: blur(20px);
        }
        @keyframes spin {
          to {
            transform: rotate(1turn);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .epic-card::before {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

function TimeUnit({
  label,
  value,
  progress,
  pulse,
}: {
  label: string
  value: number
  progress?: number
  pulse?: boolean
}) {
  const display = value.toString().padStart(2, '0')
  const barWidth = Math.max(0, Math.min(1, progress ?? 0)) * 100

  return (
    <div className='relative overflow-hidden rounded-lg border border-site-700 bg-site-800/80 p-3'>
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
        <div className='text-center text-[11px] font-medium uppercase tracking-wide text-white'>
          {label}
        </div>
      </div>
      {progress !== undefined ? (
        <div className='absolute inset-x-2 bottom-2 h-1 overflow-hidden rounded bg-black/30'>
          <div
            className='h-full rounded bg-gradient-to-r from-kolping-500 via-orange-400 to-orange-300 transition-[width] duration-300'
            style={{ width: `${barWidth}%` }}
          />
        </div>
      ) : null}

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
