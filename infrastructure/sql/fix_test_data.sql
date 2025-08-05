-- Fix test data issues and add bookings

-- Connect to users database
\c travel_platform_users;

-- Fix role-permission mappings (the previous ones had errors)
DELETE FROM role_permissions;

-- Insert correct role-permission mappings
INSERT INTO role_permissions (role_id, permission_id) VALUES 
-- Admin gets all permissions
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'READ_TRAVELS')),
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'BOOK_TRAVELS')),
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'MANAGE_USERS')),
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'MANAGE_TRAVELS')),
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'VIEW_ANALYTICS')),
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'DELETE_TRAVELS')),
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'APPROVE_BOOKINGS')),
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'VIEW_REPORTS')),
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'MANAGE_ROLES')),
((SELECT id FROM roles WHERE name = 'ADMIN'), (SELECT id FROM permissions WHERE name = 'EXPORT_DATA')),

-- Moderator gets moderate permissions
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM permissions WHERE name = 'READ_TRAVELS')),
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM permissions WHERE name = 'BOOK_TRAVELS')),
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM permissions WHERE name = 'MANAGE_TRAVELS')),
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM permissions WHERE name = 'VIEW_ANALYTICS')),
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM permissions WHERE name = 'APPROVE_BOOKINGS')),

-- User gets basic permissions
((SELECT id FROM roles WHERE name = 'USER'), (SELECT id FROM permissions WHERE name = 'READ_TRAVELS')),
((SELECT id FROM roles WHERE name = 'USER'), (SELECT id FROM permissions WHERE name = 'BOOK_TRAVELS'));

-- Connect to travels database
\c travel_platform_travels;

-- Add bookings with correct user references
INSERT INTO bookings (user_id, travel_package_id, booking_date, travelers_count, total_price, status, tenant_id) VALUES 
-- Get user IDs from the users database
((SELECT id FROM travel_platform_users.users WHERE username = 'johndoe'), 
 (SELECT id FROM travel_packages WHERE title = 'Sunny Beach Paradise'), 
 '2024-09-15', 2, 2599.98, 'CONFIRMED', 'default'),
 
((SELECT id FROM travel_platform_users.users WHERE username = 'janesmith'), 
 (SELECT id FROM travel_packages WHERE title = 'Mountain Adventure'), 
 '2024-10-20', 3, 2699.97, 'PENDING', 'default'),
 
((SELECT id FROM travel_platform_users.users WHERE username = 'bobwilson'), 
 (SELECT id FROM travel_packages WHERE title = 'City Break in Paris'), 
 '2024-08-05', 2, 1599.98, 'CONFIRMED', 'default'),
 
((SELECT id FROM travel_platform_users.users WHERE username = 'alicebrown'), 
 (SELECT id FROM travel_packages WHERE title = 'Safari Experience'), 
 '2024-11-10', 4, 9999.96, 'PENDING', 'default'),
 
((SELECT id FROM travel_platform_users.users WHERE username = 'johndoe'), 
 (SELECT id FROM travel_packages WHERE title = 'Island Hopping'), 
 '2024-12-01', 2, 3199.98, 'CONFIRMED', 'default');

-- Show final summary
SELECT 'Final Database Summary' as info;
SELECT COUNT(*) as total_travel_packages FROM travel_packages;
SELECT COUNT(*) as total_bookings FROM bookings; 