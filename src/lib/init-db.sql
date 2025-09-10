-- Smart Cars Elite Database Schema
-- This file contains the SQL to create the database tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT,
    picture TEXT,
    role TEXT NOT NULL DEFAULT 'customer',
    is_active BOOLEAN DEFAULT true,
    preferences JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    vin TEXT,
    color TEXT,
    mileage INTEGER,
    fuel_type TEXT,
    transmission TEXT,
    engine_size TEXT,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price DECIMAL(10,2),
    estimated_duration INTEGER,
    is_active BOOLEAN DEFAULT true,
    requires_pickup BOOLEAN DEFAULT false,
    luxury_level TEXT DEFAULT 'standard',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
    service_id UUID REFERENCES services(id) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    scheduled_date TIMESTAMP NOT NULL,
    estimated_completion TIMESTAMP,
    actual_completion TIMESTAMP,
    total_price DECIMAL(10,2),
    notes TEXT,
    technician_notes TEXT,
    pickup_address TEXT,
    delivery_address TEXT,
    priority TEXT DEFAULT 'normal',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Service history table
CREATE TABLE IF NOT EXISTS service_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) NOT NULL,
    service_id UUID REFERENCES services(id) NOT NULL,
    completed_date TIMESTAMP NOT NULL,
    rating INTEGER,
    review TEXT,
    total_price DECIMAL(10,2),
    technician_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Content management table
CREATE TABLE IF NOT EXISTS content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    category TEXT NOT NULL,
    is_public BOOLEAN DEFAULT true,
    updated_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_booking_id UUID REFERENCES bookings(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert initial luxury services
INSERT INTO services (name, description, category, price, estimated_duration, luxury_level) VALUES
('Premium Detailing', 'Complete exterior and interior detailing with premium products', 'detailing', 299.99, 240, 'premium'),
('Elite Paint Protection', 'Ceramic coating and paint protection film application', 'detailing', 1299.99, 480, 'elite'),
('Comprehensive Diagnostics', 'Advanced computer diagnostics and inspection', 'diagnostics', 199.99, 90, 'standard'),
('Performance Optimization', 'Engine tuning and performance enhancement', 'maintenance', 899.99, 180, 'premium'),
('Luxury Interior Restoration', 'Premium leather and interior component restoration', 'customization', 1899.99, 360, 'elite'),
('Concierge Oil Service', 'Premium oil change with pickup and delivery', 'maintenance', 149.99, 60, 'premium')
ON CONFLICT (name) DO NOTHING;

-- Insert sample content
INSERT INTO content (key, value, category) VALUES
('hero_title', 'Luxury Automotive Excellence', 'general'),
('hero_subtitle', 'Premium care for premium vehicles', 'general'),
('contact_phone', '+1 (555) 123-4567', 'contact'),
('contact_email', 'elite@smartcars.com', 'contact'),
('about_text', 'Smart Cars Elite provides world-class automotive services for luxury vehicles.', 'about')
ON CONFLICT (key) DO NOTHING;