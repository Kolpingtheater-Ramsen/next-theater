-- Remove Tuesday 29.12.2026 performances (only if unbooked), expand the 4 remaining
-- performances to 78 seats (adding row H), and record duration (~50 min) and subtitle.
DELETE FROM plays
WHERE id IN ('romeo-julia-2026-12-29-1700', 'romeo-julia-2026-12-29-1930')
  AND NOT EXISTS (SELECT 1 FROM bookings WHERE play_id = plays.id);

UPDATE plays
SET title = 'Romeo & Julia – Ein Minidrama',
    total_seats = 78,
    duration_minutes = 50
WHERE id IN (
  'romeo-julia-2026-12-27-1700',
  'romeo-julia-2026-12-27-1930',
  'romeo-julia-2026-12-28-1700',
  'romeo-julia-2026-12-28-1930'
);
