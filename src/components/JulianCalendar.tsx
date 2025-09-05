'use client'

import { useState } from 'react'

interface PerformanceDate {
  date: number
  month: number
  year: number
  title: string
  time: string
  location: string
  type: 'performance' | 'rehearsal' | 'special'
}

// Mock data for performances
const mockPerformances: PerformanceDate[] = [
  { date: 15, month: 3, year: 2025, title: 'Anno 1146 - Premiere', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 16, month: 3, year: 2025, title: 'Anno 1146', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 22, month: 3, year: 2025, title: 'Anno 1146', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 23, month: 3, year: 2025, title: 'Anno 1146', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 29, month: 3, year: 2025, title: 'Anno 1146', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 30, month: 3, year: 2025, title: 'Anno 1146', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 5, month: 4, year: 2025, title: 'Anno 1146', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 6, month: 4, year: 2025, title: 'Anno 1146', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 12, month: 4, year: 2025, title: 'Anno 1146', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 13, month: 4, year: 2025, title: 'Anno 1146', time: '19:30', location: 'Open Air Bühne Ramsen', type: 'performance' },
  { date: 8, month: 2, year: 2025, title: 'Hauptprobe', time: '18:00', location: 'Probenraum', type: 'rehearsal' },
  { date: 22, month: 2, year: 2025, title: 'Kostümprobe', time: '18:00', location: 'Probenraum', type: 'rehearsal' },
  { date: 1, month: 3, year: 2025, title: 'Technische Probe', time: '18:00', location: 'Open Air Bühne Ramsen', type: 'rehearsal' },
  { date: 8, month: 3, year: 2025, title: 'Generalprobe', time: '18:00', location: 'Open Air Bühne Ramsen', type: 'rehearsal' },
  { date: 20, month: 4, year: 2025, title: 'Nachspielparty', time: '20:00', location: 'Kolpinghaus Ramsen', type: 'special' },
]

const monthNames = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
]

const dayNames = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']

export default function JulianCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<PerformanceDate | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay()

  // Create calendar grid
  const calendarDays = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const getPerformanceForDate = (day: number) => {
    return mockPerformances.find(perf => 
      perf.date === day && perf.month === month + 1 && perf.year === year
    )
  }

  const getPerformanceTypeColor = (type: string) => {
    switch (type) {
      case 'performance':
        return 'bg-kolping-500 text-white'
      case 'rehearsal':
        return 'bg-blue-600 text-white'
      case 'special':
        return 'bg-purple-600 text-white'
      default:
        return 'bg-site-700 text-site-100'
    }
  }

  const getPerformanceTypeLabel = (type: string) => {
    switch (type) {
      case 'performance':
        return 'Aufführung'
      case 'rehearsal':
        return 'Probe'
      case 'special':
        return 'Special'
      default:
        return 'Event'
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-site-800 rounded-lg border border-site-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-site-50">
            Spielplan {monthNames[month]} {year}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded border border-site-700 hover:border-kolping-500 bg-site-900 text-site-100 hover:text-kolping-400 transition-colors"
              aria-label="Vorheriger Monat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded border border-site-700 hover:border-kolping-500 bg-site-900 text-site-100 hover:text-kolping-400 transition-colors"
              aria-label="Nächster Monat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-semibold text-site-300">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const performance = day ? getPerformanceForDate(day) : null
            const isToday = day && new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year
            
            return (
              <div
                key={index}
                className={`
                  aspect-square p-1 border border-site-700 rounded
                  ${day ? 'bg-site-900 hover:bg-site-800 cursor-pointer' : 'bg-site-950'}
                  ${isToday ? 'ring-2 ring-kolping-500' : ''}
                  transition-colors
                `}
                onClick={() => performance && setSelectedDate(performance)}
              >
                {day && (
                  <div className="h-full flex flex-col">
                    <div className={`text-sm font-medium ${isToday ? 'text-kolping-400' : 'text-site-100'}`}>
                      {day}
                    </div>
                    {performance && (
                      <div className="mt-1">
                        <div className={`
                          text-xs px-1 py-0.5 rounded text-center truncate
                          ${getPerformanceTypeColor(performance.type)}
                        `}>
                          {performance.type === 'performance' ? '🎭' : performance.type === 'rehearsal' ? '🎪' : '🎉'}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-kolping-500 rounded"></div>
            <span className="text-site-100">Aufführung</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span className="text-site-100">Probe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded"></div>
            <span className="text-site-100">Special Event</span>
          </div>
        </div>
      </div>

      {/* Performance Details Modal */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-site-800 rounded-lg border border-site-700 p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-site-50">{selectedDate.title}</h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-site-300 hover:text-site-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-site-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-site-100">
                  {selectedDate.date}. {monthNames[selectedDate.month - 1]} {selectedDate.year}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-site-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-site-100">{selectedDate.time} Uhr</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-site-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-site-100">{selectedDate.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceTypeColor(selectedDate.type)}`}>
                  {getPerformanceTypeLabel(selectedDate.type)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}