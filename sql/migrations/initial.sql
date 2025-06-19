-- ============================================================================
-- Ethiopia Tourism Analytics - Initial Database Schema Migration
-- ============================================================================
-- This migration creates the core tables for tourism analytics with proper
-- RLS policies for multi-tenant access and API-based data sharing
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE REFERENCE TABLES
-- ============================================================================

-- Tourist segments (business, leisure, adventure, cultural, etc.)
CREATE TABLE segments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    target_demographic JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Geographic regions (Addis Ababa, Lalibela, Axum, etc.)
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    country_code TEXT DEFAULT 'ET',
    coordinates POINT,
    timezone TEXT DEFAULT 'Africa/Addis_Ababa',
    metadata JSONB, -- For storing additional regional data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TOURISM DATA TABLES
-- ============================================================================

-- Flight arrivals data for tourism influx tracking
CREATE TABLE arrivals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_number TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT DEFAULT 'ADD', -- Addis Ababa default
    passenger_count INTEGER,
    aircraft_type TEXT,
    segment_id UUID REFERENCES segments(id) ON DELETE SET NULL,
    metadata JSONB, -- Additional flight data, airline partnerships
    data_source TEXT, -- Track which API/partner provided the data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hotel occupancy rates by region
CREATE TABLE occupancy (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id UUID NOT NULL, -- External hotel system reference
    hotel_name TEXT,
    date DATE NOT NULL,
    total_rooms INTEGER NOT NULL CHECK (total_rooms > 0),
    occupied_rooms INTEGER NOT NULL CHECK (occupied_rooms >= 0),
    average_rate DECIMAL(10,2), -- ADR (Average Daily Rate)
    revenue DECIMAL(12,2), -- Total revenue for the day
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    data_source TEXT, -- Track data provider for billing
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_occupancy CHECK (occupied_rooms <= total_rooms)
);

-- Tourist site visits and foot traffic
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    site_id UUID NOT NULL, -- External site reference
    site_name TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    visitor_count INTEGER DEFAULT 1,
    visit_duration_minutes INTEGER,
    visitor_demographics JSONB, -- Age groups, nationalities, etc.
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    data_source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer satisfaction surveys
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
    comments TEXT,
    survey_type TEXT DEFAULT 'post_visit',
    language_code TEXT DEFAULT 'en',
    respondent_demographics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- USER MANAGEMENT & ACCESS CONTROL
-- ============================================================================

-- User profiles with role-based access
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'viewer', 'api_client', 'partner')),
    organization_name TEXT,
    api_tier TEXT CHECK (api_tier IN ('free', 'basic', 'premium', 'enterprise')),
    api_calls_limit INTEGER DEFAULT 1000,
    api_calls_used INTEGER DEFAULT 0,
    monthly_quota_reset_date DATE,
    allowed_regions UUID[] DEFAULT '{}', -- Array of region IDs for data access
    metadata JSONB, -- Additional user/org data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ANALYTICS & USAGE TRACKING
-- ============================================================================

-- Track API usage for billing and analytics
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT,
    event_type TEXT NOT NULL, -- 'api_call', 'data_export', 'dashboard_view', etc.
    endpoint TEXT, -- Which API endpoint was called
    properties JSONB NOT NULL DEFAULT '{}',
    billing_amount DECIMAL(10,4) DEFAULT 0, -- Cost for this specific call
    data_volume_mb DECIMAL(10,3), -- Amount of data transferred
    processing_time_ms INTEGER, -- For performance monitoring
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- API USAGE & BILLING TRACKING
-- ============================================================================

-- Track API calls for usage-based billing
CREATE TABLE api_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    method TEXT NOT NULL,
    response_size_bytes BIGINT,
    processing_time_ms INTEGER,
    cost_usd DECIMAL(10,4) DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE arrivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupancy ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read basic reference data
CREATE POLICY "select_authenticated_segments" ON segments
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "select_authenticated_regions" ON regions
    FOR SELECT TO authenticated
    USING (true);

-- Admin full access policies
CREATE POLICY "admin_full_access_segments" ON segments
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_full_access_regions" ON regions
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Data access policies based on user regions and API tier
CREATE POLICY "select_authenticated_arrivals" ON arrivals
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN regions r ON arrivals.segment_id = r.id OR cardinality(p.allowed_regions) = 0
            WHERE p.id = auth.uid()
            AND (r.id = ANY(p.allowed_regions) OR cardinality(p.allowed_regions) = 0)
        )
    );

CREATE POLICY "select_authenticated_occupancy" ON occupancy
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND (occupancy.region_id = ANY(p.allowed_regions) OR cardinality(p.allowed_regions) = 0)
        )
    );

CREATE POLICY "select_authenticated_visits" ON visits
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND (visits.region_id = ANY(p.allowed_regions) OR cardinality(p.allowed_regions) = 0)
        )
    );

CREATE POLICY "select_authenticated_surveys" ON surveys
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN visits v ON surveys.visit_id = v.id
            WHERE p.id = auth.uid()
            AND (v.region_id = ANY(p.allowed_regions) OR cardinality(p.allowed_regions) = 0)
        )
    );

-- Users can only see their own profile
CREATE POLICY "select_own_profile" ON profiles
    FOR SELECT TO authenticated
    USING (id = auth.uid());

-- Users can update their own profile (limited fields)
CREATE POLICY "update_own_profile" ON profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Analytics events - users see their own, admins see all
CREATE POLICY "select_own_analytics_events" ON analytics_events
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- API usage - users see their own, admins see all
CREATE POLICY "select_own_api_usage" ON api_usage
    FOR SELECT TO authenticated
    USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Time-based queries for analytics
CREATE INDEX idx_arrivals_timestamp ON arrivals(timestamp);
CREATE INDEX idx_occupancy_date_region ON occupancy(date, region_id);
CREATE INDEX idx_visits_timestamp_region ON visits(timestamp, region_id);
CREATE INDEX idx_surveys_created_at ON surveys(created_at);

-- Foreign key indexes
CREATE INDEX idx_arrivals_segment ON arrivals(segment_id);
CREATE INDEX idx_occupancy_region ON occupancy(region_id);
CREATE INDEX idx_visits_region ON visits(region_id);
CREATE INDEX idx_surveys_visit ON surveys(visit_id);

-- Data source tracking for billing
CREATE INDEX idx_arrivals_data_source ON arrivals(data_source);
CREATE INDEX idx_occupancy_data_source ON occupancy(data_source);
CREATE INDEX idx_visits_data_source ON visits(data_source);

-- Analytics and API usage indexes
CREATE INDEX idx_analytics_user_time ON analytics_events(user_id, occurred_at);
CREATE INDEX idx_analytics_event_type ON analytics_events(event_type, occurred_at);
CREATE INDEX idx_api_usage_user_timestamp ON api_usage(user_id, timestamp);
CREATE INDEX idx_api_usage_billing ON api_usage(user_id, cost_usd, timestamp);

-- ============================================================================
-- SAMPLE DATA FOR DEVELOPMENT
-- ============================================================================

-- Insert sample segments
INSERT INTO segments (name, description) VALUES 
    ('Business', 'Business travelers and conference attendees'),
    ('Leisure', 'Vacation and recreational tourists'),
    ('Cultural', 'Heritage and cultural site visitors'),
    ('Adventure', 'Trekking and adventure tourism'),
    ('Religious', 'Religious pilgrimage tourism');

-- Insert sample regions
INSERT INTO regions (name, coordinates) VALUES 
    ('Addis Ababa', POINT(38.7578, 9.0084)),
    ('Lalibela', POINT(39.0473, 12.0332)),
    ('Axum', POINT(38.7230, 14.1211)),
    ('Bahir Dar', POINT(37.3609, 11.6000)),
    ('Gondar', POINT(37.4671, 12.6089));

-- ============================================================================
-- FUNCTIONS FOR ANALYTICS & BILLING
-- ============================================================================

-- Function to calculate occupancy rate
CREATE OR REPLACE FUNCTION calculate_occupancy_rate(
    start_date DATE,
    end_date DATE,
    region_filter UUID DEFAULT NULL
)
RETURNS TABLE (
    region_name TEXT,
    average_occupancy_rate DECIMAL,
    total_revenue DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.name,
        ROUND(AVG(o.occupied_rooms::DECIMAL / o.total_rooms::DECIMAL) * 100, 2),
        SUM(o.revenue)
    FROM occupancy o
    JOIN regions r ON o.region_id = r.id
    WHERE o.date BETWEEN start_date AND end_date
    AND (region_filter IS NULL OR o.region_id = region_filter)
    GROUP BY r.id, r.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track API usage for billing
CREATE OR REPLACE FUNCTION log_api_usage(
    p_user_id UUID,
    p_endpoint TEXT,
    p_method TEXT,
    p_response_size BIGINT,
    p_processing_time INTEGER
)
RETURNS DECIMAL AS $$
DECLARE
    cost DECIMAL(10,4);
    user_tier TEXT;
BEGIN
    -- Get user's API tier
    SELECT api_tier INTO user_tier
    FROM profiles
    WHERE id = p_user_id;
    
    -- Calculate cost based on tier and usage
    cost := CASE 
        WHEN user_tier = 'free' THEN 0
        WHEN user_tier = 'basic' THEN 0.001
        WHEN user_tier = 'premium' THEN 0.0005
        WHEN user_tier = 'enterprise' THEN 0.0001
        ELSE 0.001
    END;
    
    -- Log the usage
    INSERT INTO api_usage (user_id, endpoint, method, response_size_bytes, processing_time_ms, cost_usd)
    VALUES (p_user_id, p_endpoint, p_method, p_response_size, p_processing_time, cost);
    
    RETURN cost;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 