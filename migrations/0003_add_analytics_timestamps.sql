-- Migration: Add Analytics Timestamps
-- Created: 2025-12-28
-- Description: Adds cancelled_at and checked_in_at timestamps for analytics tracking

-- Add cancelled_at timestamp to track when bookings were cancelled
ALTER TABLE bookings ADD COLUMN cancelled_at DATETIME;

-- Add checked_in_at timestamp to track when guests checked in
ALTER TABLE bookings ADD COLUMN checked_in_at DATETIME;

-- Create index for analytics queries on timestamps
CREATE INDEX IF NOT EXISTS idx_bookings_cancelled_at ON bookings(cancelled_at);
CREATE INDEX IF NOT EXISTS idx_bookings_checked_in_at ON bookings(checked_in_at);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
