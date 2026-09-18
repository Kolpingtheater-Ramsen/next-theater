-- Check the exact occupancy snapshot inside the same transaction as the booking.
-- The guard row is removed by the final statement; failed batches roll it back.
CREATE TABLE IF NOT EXISTS seat_layout_checks (
  id TEXT PRIMARY KEY,
  play_id TEXT NOT NULL REFERENCES plays(id) ON DELETE CASCADE,
  expected_seats TEXT NOT NULL
);
CREATE TRIGGER IF NOT EXISTS seat_layout_snapshot_guard
BEFORE INSERT ON seat_layout_checks
WHEN NEW.expected_seats <> (
  SELECT json_group_array(seat_number) FROM (
    SELECT seat_number FROM booked_seats WHERE play_id = NEW.play_id ORDER BY seat_number
  )
)
BEGIN SELECT RAISE(ABORT, 'seat_layout_changed'); END;
