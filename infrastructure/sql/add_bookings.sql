-- Add bookings with correct user references

-- First, let's get the user IDs
\c travel_platform_users;
SELECT 'User IDs for bookings:' as info;
SELECT username, id FROM users WHERE username IN ('johndoe', 'janesmith', 'bobwilson', 'alicebrown') ORDER BY username;

-- Now connect to travels database and add bookings
\c travel_platform_travels;

-- Add bookings with hardcoded user IDs (we'll get them from the query above)
INSERT INTO bookings (user_id, travel_package_id, booking_date, travelers_count, total_price, status, tenant_id) VALUES 
-- These UUIDs will be replaced with actual user IDs from the query above
('550e8400-e29b-41d4-a716-446655440001', 
 (SELECT id FROM travel_packages WHERE title = 'Sunny Beach Paradise'), 
 '2024-09-15', 2, 2599.98, 'CONFIRMED', 'default'),
 
('550e8400-e29b-41d4-a716-446655440002', 
 (SELECT id FROM travel_packages WHERE title = 'Mountain Adventure'), 
 '2024-10-20', 3, 2699.97, 'PENDING', 'default'),
 
('550e8400-e29b-41d4-a716-446655440003', 
 (SELECT id FROM travel_packages WHERE title = 'City Break in Paris'), 
 '2024-08-05', 2, 1599.98, 'CONFIRMED', 'default'),
 
('550e8400-e29b-41d4-a716-446655440004', 
 (SELECT id FROM travel_packages WHERE title = 'Safari Experience'), 
 '2024-11-10', 4, 9999.96, 'PENDING', 'default'),
 
('550e8400-e29b-41d4-a716-446655440001', 
 (SELECT id FROM travel_packages WHERE title = 'Island Hopping'), 
 '2024-12-01', 2, 3199.98, 'CONFIRMED', 'default');

-- Show final summary
SELECT 'Final Database Summary' as info;
SELECT COUNT(*) as total_travel_packages FROM travel_packages;
SELECT COUNT(*) as total_bookings FROM bookings; 