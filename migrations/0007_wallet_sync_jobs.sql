-- Serialize writes to each Google pass and schedule failed attempts fairly.
-- Booking mutations keep their existing durable wallet_sync_pending flag.
CREATE TABLE IF NOT EXISTS wallet_sync_jobs (
  booking_id TEXT PRIMARY KEY REFERENCES bookings(id) ON DELETE CASCADE,
  lease_token TEXT,
  lease_until INTEGER NOT NULL DEFAULT 0,
  retry_at INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_wallet_pending ON bookings(wallet_sync_pending, wallet_issued);
