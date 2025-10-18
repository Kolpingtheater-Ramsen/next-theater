"use client"

import { useState } from 'react'

type SeatSelectionProps = {
  playId: string
  bookedSeats: number[]
  selectedSeats: number[]
  onSeatSelection: (seats: number[]) => void
  maxSeats: number
}

const ROWS = 7
const SEATS_PER_SIDE = 5
const TOTAL_SEATS_PER_ROW = SEATS_PER_SIDE * 2

export default function SeatSelection({
  bookedSeats,
  selectedSeats,
  onSeatSelection,
  maxSeats,
}: SeatSelectionProps) {
  const [tempSelectedSeats, setTempSelectedSeats] = useState<number[]>(selectedSeats)

  const getSeatNumber = (row: number, seat: number): number => {
    return row * TOTAL_SEATS_PER_ROW + seat
  }

  const isSeatBooked = (seatNumber: number): boolean => {
    return bookedSeats.includes(seatNumber)
  }

  const isSeatSelected = (seatNumber: number): boolean => {
    return tempSelectedSeats.includes(seatNumber)
  }

  const handleSeatClick = (seatNumber: number) => {
    if (isSeatBooked(seatNumber)) return

    let newSelection: number[]
    
    if (isSeatSelected(seatNumber)) {
      // Deselect seat
      newSelection = tempSelectedSeats.filter((s) => s !== seatNumber)
    } else {
      // Select seat (if not exceeding max)
      if (tempSelectedSeats.length >= maxSeats) {
        alert(`Sie können maximal ${maxSeats} Plätze auswählen.`)
        return
      }
      newSelection = [...tempSelectedSeats, seatNumber]
    }

    setTempSelectedSeats(newSelection)
  }

  const handleConfirm = () => {
    if (tempSelectedSeats.length === 0) {
      alert('Bitte wählen Sie mindestens einen Sitzplatz aus.')
      return
    }
    onSeatSelection(tempSelectedSeats)
  }

  const getSeatLabel = (seatNumber: number): string => {
    const row = Math.floor(seatNumber / TOTAL_SEATS_PER_ROW)
    const seatInRow = seatNumber % TOTAL_SEATS_PER_ROW
    return `${String.fromCharCode(65 + row)}${seatInRow + 1}`
  }

  return (
    <div className='glass rounded-xl p-4 md:p-8'>
      {/* Stage */}
      <div className='mb-8'>
        <div className='bg-gradient-to-b from-kolping-500 to-kolping-600 text-white text-center py-3 rounded-lg font-semibold shadow-lg'>
          BÜHNE
        </div>
      </div>

      {/* Seating area */}
      <div className='mb-6 overflow-x-auto'>
        <div className='min-w-[350px] max-w-2xl mx-auto'>
          {Array.from({ length: ROWS }).map((_, rowIndex) => (
            <div key={rowIndex} className='flex items-center justify-center gap-2 mb-3'>
              {/* Row label */}
              <div className='w-8 text-center text-site-100 font-semibold text-sm'>
                {String.fromCharCode(65 + rowIndex)}
              </div>

              {/* Left side seats */}
              <div className='flex gap-1.5'>
                {Array.from({ length: SEATS_PER_SIDE }).map((_, seatIndex) => {
                  const seatNumber = getSeatNumber(rowIndex, seatIndex)
                  const booked = isSeatBooked(seatNumber)
                  const selected = isSeatSelected(seatNumber)

                  return (
                    <button
                      key={seatNumber}
                      onClick={() => handleSeatClick(seatNumber)}
                      disabled={booked}
                      className={`
                        w-8 h-8 md:w-10 md:h-10 rounded-md text-xs font-medium transition-all
                        ${booked 
                          ? 'bg-site-700 text-site-500 cursor-not-allowed' 
                          : selected
                          ? 'bg-kolping-500 text-white shadow-lg scale-105'
                          : 'bg-site-800 hover:bg-site-700 text-site-100 hover:scale-105'
                        }
                      `}
                      aria-label={`Platz ${getSeatLabel(seatNumber)} ${booked ? 'belegt' : selected ? 'ausgewählt' : 'verfügbar'}`}
                      title={getSeatLabel(seatNumber)}
                    >
                      {seatIndex + 1}
                    </button>
                  )
                })}
              </div>

              {/* Middle pathway */}
              <div className='w-6 md:w-8' />

              {/* Right side seats */}
              <div className='flex gap-1.5'>
                {Array.from({ length: SEATS_PER_SIDE }).map((_, seatIndex) => {
                  const seatNumber = getSeatNumber(rowIndex, SEATS_PER_SIDE + seatIndex)
                  const booked = isSeatBooked(seatNumber)
                  const selected = isSeatSelected(seatNumber)

                  return (
                    <button
                      key={seatNumber}
                      onClick={() => handleSeatClick(seatNumber)}
                      disabled={booked}
                      className={`
                        w-8 h-8 md:w-10 md:h-10 rounded-md text-xs font-medium transition-all
                        ${booked 
                          ? 'bg-site-700 text-site-500 cursor-not-allowed' 
                          : selected
                          ? 'bg-kolping-500 text-white shadow-lg scale-105'
                          : 'bg-site-800 hover:bg-site-700 text-site-100 hover:scale-105'
                        }
                      `}
                      aria-label={`Platz ${getSeatLabel(seatNumber)} ${booked ? 'belegt' : selected ? 'ausgewählt' : 'verfügbar'}`}
                      title={getSeatLabel(seatNumber)}
                    >
                      {SEATS_PER_SIDE + seatIndex + 1}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className='flex flex-wrap items-center justify-center gap-4 md:gap-6 mb-6 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 bg-site-800 rounded-md' />
          <span className='text-site-100'>Verfügbar</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 bg-kolping-500 rounded-md' />
          <span className='text-site-100'>Ausgewählt</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-6 h-6 bg-site-700 rounded-md' />
          <span className='text-site-100'>Belegt</span>
        </div>
      </div>

      {/* Selection summary */}
      {tempSelectedSeats.length > 0 && (
        <div className='mb-4 p-4 bg-site-800 rounded-lg'>
          <div className='text-sm text-site-100 mb-2'>
            Ausgewählte Plätze ({tempSelectedSeats.length}/{maxSeats}):
          </div>
          <div className='flex flex-wrap gap-2'>
            {tempSelectedSeats.sort((a, b) => a - b).map((seatNumber) => (
              <span
                key={seatNumber}
                className='px-3 py-1 bg-kolping-500 text-white rounded-md text-sm font-medium'
              >
                {getSeatLabel(seatNumber)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        disabled={tempSelectedSeats.length === 0}
        className={`
          w-full py-3 rounded-lg font-semibold transition-all
          ${tempSelectedSeats.length === 0
            ? 'bg-site-700 text-site-500 cursor-not-allowed'
            : 'bg-kolping-500 hover:bg-kolping-600 text-white shadow-lg'
          }
        `}
      >
        Weiter zur Buchung ({tempSelectedSeats.length} Plätze)
      </button>
    </div>
  )
}
