-- Test Data for Travel Platform
-- This script adds test users, roles, and travel packages for development

-- Connect to users database
\c travel_platform_users;

-- Insert test users with hashed passwords (using bcrypt hash for 'password123')
INSERT INTO users (email, username, password_hash, first_name, last_name, phone, date_of_birth, is_active, is_verified, tenant_id) VALUES 
('admin@travelplatform.com', 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Admin', 'User', '+359888123456', '1990-01-15', true, true, 'default'),
('john.doe@example.com', 'johndoe', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'John', 'Doe', '+359888111111', '1985-03-20', true, true, 'default'),
('jane.smith@example.com', 'janesmith', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Jane', 'Smith', '+359888222222', '1992-07-10', true, true, 'default'),
('bob.wilson@example.com', 'bobwilson', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Bob', 'Wilson', '+359888333333', '1988-11-05', true, false, 'default'),
('alice.brown@example.com', 'alicebrown', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Alice', 'Brown', '+359888444444', '1995-04-12', true, true, 'default'),
('moderator@travelplatform.com', 'moderator', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVEFDa', 'Content', 'Moderator', '+359888555555', '1987-09-18', true, true, 'default');

-- Insert additional permissions
INSERT INTO permissions (name, description) VALUES 
('DELETE_TRAVELS', 'Can delete travel packages'),
('APPROVE_BOOKINGS', 'Can approve travel bookings'),
('VIEW_REPORTS', 'Can view system reports'),
('MANAGE_ROLES', 'Can manage user roles'),
('EXPORT_DATA', 'Can export data');

-- Insert role-permission mappings
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
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM roles WHERE name = 'READ_TRAVELS')),
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM roles WHERE name = 'BOOK_TRAVELS')),
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM roles WHERE name = 'MANAGE_TRAVELS')),
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM roles WHERE name = 'VIEW_ANALYTICS')),
((SELECT id FROM roles WHERE name = 'MODERATOR'), (SELECT id FROM roles WHERE name = 'APPROVE_BOOKINGS')),

-- User gets basic permissions
((SELECT id FROM roles WHERE name = 'USER'), (SELECT id FROM roles WHERE name = 'READ_TRAVELS')),
((SELECT id FROM roles WHERE name = 'USER'), (SELECT id FROM roles WHERE name = 'BOOK_TRAVELS'));

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) VALUES 
-- Admin user gets ADMIN role
((SELECT id FROM users WHERE username = 'admin'), (SELECT id FROM roles WHERE name = 'ADMIN')),
-- Moderator user gets MODERATOR role
((SELECT id FROM users WHERE username = 'moderator'), (SELECT id FROM roles WHERE name = 'MODERATOR')),
-- Regular users get USER role
((SELECT id FROM users WHERE username = 'johndoe'), (SELECT id FROM roles WHERE name = 'USER')),
((SELECT id FROM users WHERE username = 'janesmith'), (SELECT id FROM roles WHERE name = 'USER')),
((SELECT id FROM users WHERE username = 'bobwilson'), (SELECT id FROM roles WHERE name = 'USER')),
((SELECT id FROM users WHERE username = 'alicebrown'), (SELECT id FROM roles WHERE name = 'USER'));

-- Connect to travels database
\c travel_platform_travels;

-- Insert test travel packages
INSERT INTO travel_packages (title, description, destination, price, duration_days, max_travelers, is_active, tenant_id) VALUES 
('Sunny Beach Paradise', 'Relaxing beach vacation with all-inclusive package', 'Bali, Indonesia', 1299.99, 7, 4, true, 'default'),
('Mountain Adventure', 'Hiking and outdoor activities in the Alps', 'Swiss Alps', 899.99, 5, 6, true, 'default'),
('City Break in Paris', 'Romantic getaway in the City of Light', 'Paris, France', 799.99, 4, 2, true, 'default'),
('Safari Experience', 'Wildlife safari in African savanna', 'Serengeti, Tanzania', 2499.99, 10, 8, true, 'default'),
('Island Hopping', 'Explore multiple Greek islands', 'Greek Islands', 1599.99, 8, 6, true, 'default'),
('Cultural Tour', 'Historical sites and local culture', 'Kyoto, Japan', 1199.99, 6, 4, true, 'default'),
('Luxury Cruise', 'Premium cruise experience', 'Mediterranean Sea', 3499.99, 12, 10, true, 'default'),
('Backpacking Europe', 'Budget-friendly European tour', 'Multiple European Cities', 699.99, 14, 12, true, 'default'),
('Tropical Paradise', 'Exotic beach destination', 'Maldives', 1899.99, 9, 4, true, 'default'),
('Winter Sports', 'Skiing and snowboarding adventure', 'Whistler, Canada', 1499.99, 7, 6, true, 'default');

-- Insert test bookings
INSERT INTO bookings (user_id, travel_package_id, booking_date, travelers_count, total_price, status, tenant_id) VALUES 
-- Use UUID for user_id (we'll get it from the users table)
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

-- Display summary
\c travel_platform_users;
SELECT 'Users Database Summary' as info;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_roles FROM roles;
SELECT COUNT(*) as total_permissions FROM permissions;

\c travel_platform_travels;
SELECT 'Travels Database Summary' as info;
SELECT COUNT(*) as total_travel_packages FROM travel_packages;
SELECT COUNT(*) as total_bookings FROM bookings;

-- Show test users
\c travel_platform_users;
SELECT 'Test Users:' as info;
SELECT username, email, first_name, last_name, is_verified FROM users ORDER BY username; 