-- Ticket lifecycle, separate admission codes and revocable admin sessions.
ALTER TABLE plays ADD COLUMN published INTEGER NOT NULL DEFAULT 1;
ALTER TABLE plays ADD COLUMN booking_open INTEGER NOT NULL DEFAULT 1;
ALTER TABLE plays ADD COLUMN venue TEXT NOT NULL DEFAULT 'Klosterhof 7, 67305 Ramsen';
ALTER TABLE plays ADD COLUMN timezone TEXT NOT NULL DEFAULT 'Europe/Berlin';
ALTER TABLE plays ADD COLUMN duration_minutes INTEGER;
ALTER TABLE bookings ADD COLUMN admission_token TEXT;
ALTER TABLE bookings ADD COLUMN request_key TEXT;
ALTER TABLE bookings ADD COLUMN email_status TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE bookings ADD COLUMN version INTEGER NOT NULL DEFAULT 0;
ALTER TABLE bookings ADD COLUMN wallet_sync_pending INTEGER NOT NULL DEFAULT 0;
ALTER TABLE bookings ADD COLUMN wallet_issued INTEGER NOT NULL DEFAULT 0;
UPDATE bookings SET admission_token = lower(hex(randomblob(24))) WHERE admission_token IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_admission_token ON bookings(admission_token);
CREATE UNIQUE INDEX IF NOT EXISTS idx_request_key ON bookings(request_key);
CREATE TABLE IF NOT EXISTS admin_sessions (
  token_hash TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS ticket_rate_limits (
  key TEXT PRIMARY KEY,
  hits INTEGER NOT NULL,
  resets_at INTEGER NOT NULL
);
-- Enforce the one-active-booking rule atomically, without altering old data.
CREATE TRIGGER IF NOT EXISTS booking_email_guard BEFORE INSERT ON bookings
WHEN EXISTS (SELECT 1 FROM bookings WHERE play_id = NEW.play_id
  AND lower(email) = lower(NEW.email) AND status IN ('confirmed', 'checked_in'))
BEGIN SELECT RAISE(ABORT, 'duplicate_booking'); END;
