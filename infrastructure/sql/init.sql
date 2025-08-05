-- Performance optimizations for PostgreSQL
-- Set performance-related parameters
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;
ALTER SYSTEM SET work_mem = '4MB';
ALTER SYSTEM SET min_wal_size = '1GB';
ALTER SYSTEM SET max_wal_size = '4GB';
ALTER SYSTEM SET max_worker_processes = 8;
ALTER SYSTEM SET max_parallel_workers_per_gather = 4;
ALTER SYSTEM SET max_parallel_workers = 8;
ALTER SYSTEM SET max_parallel_maintenance_workers = 4;

-- Reload configuration
SELECT pg_reload_conf();

-- Create databases with optimized settings
CREATE DATABASE travel_platform_users WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

CREATE DATABASE travel_platform_travels WITH 
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TEMPLATE = template0;

-- Connect to users database
\c travel_platform_users;

-- Create extensions for performance
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create users table with optimized structure
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    date_of_birth DATE,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'default'
);

-- Create performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Create roles table
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_roles junction table
CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id)
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Create performance indexes for junction tables
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Enable row level security for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation
CREATE POLICY users_tenant_isolation ON users
    FOR ALL USING (tenant_id = current_setting('app.current_tenant', true));

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
('USER', 'Regular user'),
('ADMIN', 'Administrator'),
('MODERATOR', 'Content moderator');

-- Insert default permissions
INSERT INTO permissions (name, description) VALUES 
('READ_TRAVELS', 'Can view travel packages'),
('BOOK_TRAVELS', 'Can book travel packages'),
('MANAGE_USERS', 'Can manage user accounts'),
('MANAGE_TRAVELS', 'Can manage travel packages'),
('VIEW_ANALYTICS', 'Can view analytics data');

-- Connect to travels database
\c travel_platform_travels;

-- Create extensions for performance
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create travel packages table with optimized structure
CREATE TABLE travel_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    destination VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    max_travelers INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'default'
);

-- Create performance indexes for travel packages
CREATE INDEX idx_travel_packages_destination ON travel_packages(destination);
CREATE INDEX idx_travel_packages_price ON travel_packages(price);
CREATE INDEX idx_travel_packages_is_active ON travel_packages(is_active);
CREATE INDEX idx_travel_packages_tenant_id ON travel_packages(tenant_id);
CREATE INDEX idx_travel_packages_created_at ON travel_packages(created_at);

-- Create bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    travel_package_id UUID REFERENCES travel_packages(id),
    booking_date DATE NOT NULL,
    travelers_count INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tenant_id VARCHAR(100) NOT NULL DEFAULT 'default'
);

-- Create performance indexes for bookings
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_travel_package_id ON bookings(travel_package_id);
CREATE INDEX idx_bookings_booking_date ON bookings(booking_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_tenant_id ON bookings(tenant_id);
CREATE INDEX idx_bookings_created_at ON bookings(created_at);

-- Create composite indexes for common queries
CREATE INDEX idx_bookings_user_status ON bookings(user_id, status);
CREATE INDEX idx_bookings_package_date ON bookings(travel_package_id, booking_date);

-- Enable row level security for multi-tenancy
ALTER TABLE travel_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant isolation
CREATE POLICY travel_packages_tenant_isolation ON travel_packages
    FOR ALL USING (tenant_id = current_setting('app.current_tenant', true));

CREATE POLICY bookings_tenant_isolation ON bookings
    FOR ALL USING (tenant_id = current_setting('app.current_tenant', true));

-- Create function to set current tenant
CREATE OR REPLACE FUNCTION set_current_tenant(tenant_id VARCHAR)
RETURNS VOID AS $$
BEGIN
    PERFORM set_config('app.current_tenant', tenant_id, false);
END;
$$ LANGUAGE plpgsql;

-- Create function to get current tenant
CREATE OR REPLACE FUNCTION get_current_tenant()
RETURNS VARCHAR AS $$
BEGIN
    RETURN current_setting('app.current_tenant', true);
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO postgres;
