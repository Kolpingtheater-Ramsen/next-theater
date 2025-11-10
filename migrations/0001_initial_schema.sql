-- Migration: Initial Schema
-- Created: 2025-11-10
-- Description: Creates tables for plays, bookings, and seat management

-- Plays/Shows table
CREATE TABLE IF NOT EXISTS plays (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  display_date TEXT NOT NULL,
  total_seats INTEGER DEFAULT 68,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  play_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'confirmed', -- confirmed, cancelled, checked_in
  FOREIGN KEY (play_id) REFERENCES plays(id) ON DELETE CASCADE
);

-- Seats table (one row per seat in a booking)
CREATE TABLE IF NOT EXISTS booked_seats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  booking_id TEXT NOT NULL,
  play_id TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  FOREIGN KEY (play_id) REFERENCES plays(id) ON DELETE CASCADE,
  UNIQUE(play_id, seat_number) -- Prevent double-booking
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_booked_seats_play ON booked_seats(play_id);
CREATE INDEX IF NOT EXISTS idx_booked_seats_booking ON booked_seats(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_play ON bookings(play_id);
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_plays_date ON plays(date, time);

