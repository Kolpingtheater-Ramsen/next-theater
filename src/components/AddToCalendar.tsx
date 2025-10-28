"use client"

import { useState, useEffect } from 'react'

type AddToCalendarProps = {
  eventTitle: string
  eventDescription: string
  startDate: string // ISO date string (YYYY-MM-DD)
  startTime: string // HH:MM format
  location: string
  seats: string[]
  bookingId: string
  name: string
  email: string
}

export default function AddToCalendar({
  eventTitle,
  eventDescription,
  startDate,
  startTime,
  location,
  seats,
  bookingId,
  name,
}: AddToCalendarProps) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other')

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios')
    } else if (/android/.test(userAgent)) {
      setPlatform('android')
    } else {
      setPlatform('other')
    }
  }, [])

  const generateICS = () => {
    // Parse the date and time
    const [year, month, day] = startDate.split('-')
    const [hours, minutes] = startTime.split(':')
    
    // Create start datetime (event start time)
    const startDateTime = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours),
      parseInt(minutes)
    )
    
    // Create end datetime (2 hours after start)
    const endDateTime = new Date(startDateTime.getTime() + 2 * 60 * 60 * 1000)
    
    // Format dates for ICS (YYYYMMDDTHHmmss)
    const formatICSDate = (date: Date) => {
      const pad = (n: number) => n.toString().padStart(2, '0')
      return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}T${pad(date.getHours())}${pad(date.getMinutes())}00`
    }
    
    const icsStart = formatICSDate(startDateTime)
    const icsEnd = formatICSDate(endDateTime)
    
    const seatsText = seats.join(', ')
    const description = `${eventDescription}\\n\\nPlätze: ${seatsText}\\nName: ${name}\\nBuchungs-ID: ${bookingId}\\n\\nBitte zeigen Sie Ihr Ticket am Eingang vor.`
    
    // Create ICS file content
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kolping Jugend Ramsen//Winterstück 2025//DE
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${bookingId}@kolping-jugend.de
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${icsStart}
DTEND:${icsEnd}
SUMMARY:${eventTitle}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-PT2H
DESCRIPTION:Erinnerung: ${eventTitle} in 2 Stunden
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR`

    return icsContent
  }

  const handleAddToCalendar = () => {
    const icsContent = generateICS()
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    
    // Use a friendly filename
    const filename = `winterstück-2025-${bookingId}.ics`
    link.download = filename
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const getButtonText = () => {
    switch (platform) {
      case 'ios':
        return 'Zu Apple Kalender hinzufügen'
      case 'android':
        return 'Zu Google Kalender hinzufügen'
      default:
        return 'Zu Kalender hinzufügen'
    }
  }

  const getIcon = () => {
    switch (platform) {
      case 'ios':
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z'/>
          </svg>
        )
      case 'android':
        return (
          <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M6.5 10.5v-4h11v4m-11 0l-2 2v7h15v-7l-2-2m-11 0h11M12 8.5v1.5m-5 4.5h10m-5 0v4'/>
          </svg>
        )
      default:
        return (
          <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
          </svg>
        )
    }
  }

  return (
    <button
      onClick={handleAddToCalendar}
      className='px-6 py-3 rounded-lg border border-site-700 hover:border-kolping-400 bg-site-800 transition-colors font-medium'
    >
      <span className='flex items-center gap-2'>
        {getIcon()}
        {getButtonText()}
      </span>
    </button>
  )
}
