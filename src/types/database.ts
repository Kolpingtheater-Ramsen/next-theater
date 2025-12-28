// Database types for D1 and application models

export interface Play {
  id: string
  title: string
  date: string
  time: string
  display_date: string
  total_seats: number
  created_at: string
}

export interface Booking {
  id: string
  play_id: string
  name: string
  email: string
  created_at: string
  status: 'confirmed' | 'cancelled' | 'checked_in'
  cancelled_at: string | null
  checked_in_at: string | null
}

export interface BookedSeat {
  id: number
  booking_id: string
  play_id: string
  seat_number: number
  created_at: string
}

export interface BookingWithSeats extends Booking {
  seats: number[]
  play?: Play
}

export interface PlayWithAvailability extends Play {
  booked_seats: number
  available_seats: number
  is_sold_out: boolean
}

