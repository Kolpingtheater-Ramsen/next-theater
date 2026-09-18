-- Six independent performances. Safe to rerun; never modifies existing bookings.
INSERT OR IGNORE INTO plays (id,title,date,time,display_date,total_seats,published,booking_open) VALUES
('romeo-julia-2026-12-27-1700','Romeo und Julia','2026-12-27','17:00','So, 27.12.2026 · 17:00 Uhr',68,1,1),
('romeo-julia-2026-12-27-1930','Romeo und Julia','2026-12-27','19:30','So, 27.12.2026 · 19:30 Uhr',68,1,1),
('romeo-julia-2026-12-28-1700','Romeo und Julia','2026-12-28','17:00','Mo, 28.12.2026 · 17:00 Uhr',68,1,1),
('romeo-julia-2026-12-28-1930','Romeo und Julia','2026-12-28','19:30','Mo, 28.12.2026 · 19:30 Uhr',68,1,1),
('romeo-julia-2026-12-29-1700','Romeo und Julia','2026-12-29','17:00','Di, 29.12.2026 · 17:00 Uhr',68,1,1),
('romeo-julia-2026-12-29-1930','Romeo und Julia','2026-12-29','19:30','Di, 29.12.2026 · 19:30 Uhr',68,1,1);
