'use client'

import { useEffect, useState } from 'react'

type Props = {
  targetISO: string
  label?: string
}

function diffParts(target: number, now: number) {
  const diff = Math.max(0, target - now)
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    done: diff === 0,
  }
}

export default function PremiereCountdown({ targetISO, label = 'Bis zur Premiere' }: Props) {
  const target = new Date(targetISO).getTime()
  const [parts, setParts] = useState<ReturnType<typeof diffParts> | null>(null)

  useEffect(() => {
    setParts(diffParts(target, Date.now()))
    const t = setInterval(() => setParts(diffParts(target, Date.now())), 1000)
    return () => clearInterval(t)
  }, [target])

  if (!parts || parts.done) return null

  const units: { v: number; l: string }[] = [
    { v: parts.days, l: 'Tage' },
    { v: parts.hours, l: 'Std' },
    { v: parts.minutes, l: 'Min' },
    { v: parts.seconds, l: 'Sek' },
  ]

  return (
    <div className='inline-flex flex-col gap-2'>
      <div className='flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.4em] text-kolping-400'>
        <span className='w-1.5 h-1.5 rounded-full bg-kolping-400 animate-pulse' />
        {label}
      </div>
      <div className='flex items-baseline gap-3 sm:gap-5'>
        {units.map((u, i) => (
          <div key={u.l} className='flex items-baseline gap-3 sm:gap-5'>
            <div className='flex flex-col items-center'>
              <span
                className='cast-number font-display text-3xl sm:text-4xl italic leading-none tabular-nums'
                aria-hidden
              >
                {String(u.v).padStart(2, '0')}
              </span>
              <span className='mt-1 font-mono text-[9px] uppercase tracking-[0.3em] text-site-300'>
                {u.l}
              </span>
            </div>
            {i < units.length - 1 && (
              <span className='text-kolping-400/60 text-xl leading-none translate-y-[-2px]' aria-hidden>
                :
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
