'use client'

import { useMemo } from 'react'

type ShowTime = {
  dateTime: string // ISO date string with timezone
  displayDate: string
  displayTime: string
}

const SHOWS: ShowTime[] = [
  { dateTime: '2025-08-23T20:00:00+02:00', displayDate: '23.08.25', displayTime: '20 Uhr' },
  { dateTime: '2025-08-24T19:00:00+02:00', displayDate: '24.08.25', displayTime: '19 Uhr' },
  { dateTime: '2025-08-30T20:00:00+02:00', displayDate: '30.08.25', displayTime: '20 Uhr' },
  { dateTime: '2025-08-31T19:00:00+02:00', displayDate: '31.08.25', displayTime: '19 Uhr' },
]

export default function ShowSchedule() {
  const now = Date.now()

  const upcomingShows = useMemo(() => {
    return SHOWS.filter((show) => new Date(show.dateTime).getTime() > now)
  }, [now])

  const allDone = upcomingShows.length === 0

  if (allDone) {
    return (
      <div className='rounded-lg border border-white/20 bg-black/70 p-4 backdrop-blur text-white'>
        <p className='font-medium'>Aufführungstermine</p>
        <div className='mt-3 rounded-md border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-300'>
          Danke fürs Vorbeischauen! Alle Aufführungen sind vorbei – bis zum nächsten Mal!
        </div>
      </div>
    )
  }

  return (
    <div className='rounded-lg border border-white/20 bg-black/70 p-4 backdrop-blur text-white'>
      <p className='font-medium'>Aufführungstermine</p>
      <ul className='text-sm space-y-1'>
        {upcomingShows.map((s, idx) => {
          const isNext = idx === 0
          return (
            <li key={idx} className={isNext ? 'font-semibold text-kolping-300' : ''}>
              <span className={isNext ? 'opacity-100' : 'opacity-90'}>{s.displayDate}</span> ·{' '}
              <span>{s.displayTime}</span>
              {isNext ? (
                <span className='ml-2 inline-flex items-center gap-1 rounded px-2 py-[2px] text-xs font-medium text-black bg-kolping-400'>
                  Nächste Vorstellung
                </span>
              ) : null}
            </li>
          )
        })}
      </ul>
      <div className='mt-2 text-sm opacity-95'>
        Open Air auf der <span className='font-medium'>Kolpingwiese in Ramsen</span>
      </div>
      <div className='text-sm mt-1'>Eintritt frei</div>
    </div>
  )
}

