-- Migration: Seed Initial Plays
-- Created: 2025-11-10
-- Description: Populates the plays table with the initial show dates

INSERT INTO plays (id, title, date, time, display_date, total_seats) VALUES
  ('play-1', 'Anno 1146', '2025-12-27', '17:00', 'Sa, 27.12.2025 - 17:00 Uhr', 70),
  ('play-2', 'Anno 1146', '2025-12-27', '20:00', 'Sa, 27.12.2025 - 20:00 Uhr', 70),
  ('play-3', 'Anno 1146', '2025-12-28', '14:30', 'So, 28.12.2025 - 14:30 Uhr', 70),
  ('play-4', 'Anno 1146', '2025-12-28', '17:00', 'So, 28.12.2025 - 17:00 Uhr', 70);

