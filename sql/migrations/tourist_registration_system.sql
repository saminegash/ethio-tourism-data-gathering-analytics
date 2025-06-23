-- ============================================================================
-- Ethiopia Tourism - Tourist Registration System Migration
-- ============================================================================
-- This migration creates tables for tourist registration with support for 
-- quick registration via passport/national ID and external system integration
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- DESTINATION MANAGEMENT TABLES
-- ============================================================================

-- Tourist destinations/sites (Wonchi, Lalibela, etc.)
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    location TEXT,
    coordinates POINT,
    region_id UUID REFERENCES regions(id) ON DELETE CASCADE,
    capacity INTEGER, -- Maximum tourists at once
    entry_fee DECIMAL(10,2),
    operating_hours JSONB, -- {monday: "08:00-18:00", ...}
    amenities TEXT[],
    safety_requirements TEXT[],
    is_active BOOLEAN DEFAULT true,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TOURIST REGISTRATION TABLES
-- ============================================================================

-- Main tourist registration table
CREATE TABLE tourists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identity Information
    passport_number TEXT UNIQUE,
    national_id TEXT UNIQUE,
    document_type TEXT NOT NULL CHECK (document_type IN ('passport', 'national_id', 'both')),
    
    -- Personal Information
    full_name TEXT NOT NULL,
    date_of_birth DATE,
    nationality TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
    phone_number TEXT,
    email TEXT,
    
    -- Travel Information
    purpose_of_visit TEXT CHECK (purpose_of_visit IN ('leisure', 'business', 'cultural', 'adventure', 'religious', 'other')),
    intended_stay_duration INTEGER, -- days
    group_size INTEGER DEFAULT 1,
    special_requirements TEXT[],
    emergency_contact JSONB,
    
    -- Registration Details
    registration_source TEXT DEFAULT 'on_site' CHECK (registration_source IN ('on_site', 'online', 'mobile_app', 'immigration', 'fayda')),
    registration_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    registration_location TEXT,
    
    -- External System Integration
    immigration_data JSONB, -- Data fetched from immigration office
    fayda_data JSONB, -- Data fetched from Fayda platform
    last_external_sync TIMESTAMP WITH TIME ZONE,
    
    -- Privacy & Consent
    data_collection_consent BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    photo_consent BOOLEAN DEFAULT false,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'expired')),
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- Registration expiry
    
    -- Constraints
    CONSTRAINT at_least_one_id CHECK (passport_number IS NOT NULL OR national_id IS NOT NULL),
    CONSTRAINT valid_group_size CHECK (group_size > 0),
    CONSTRAINT valid_stay_duration CHECK (intended_stay_duration > 0)
);

-- Tourist group management (for families/tour groups)
CREATE TABLE tourist_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_name TEXT,
    group_leader_id UUID REFERENCES tourists(id) ON DELETE CASCADE,
    group_type TEXT CHECK (group_type IN ('family', 'tour_group', 'business', 'educational', 'other')),
    total_members INTEGER NOT NULL CHECK (total_members > 0),
    tour_operator TEXT,
    guide_contact JSONB,
    special_arrangements TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link tourists to groups
CREATE TABLE tourist_group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID REFERENCES tourist_groups(id) ON DELETE CASCADE,
    tourist_id UUID REFERENCES tourists(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('leader', 'member', 'child', 'dependent')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(group_id, tourist_id)
);

-- ============================================================================
-- ANALYTICS & REPORTING TABLES
-- ============================================================================

-- Basic destination statistics
CREATE TABLE destination_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Registration statistics
    total_registrations INTEGER DEFAULT 0,
    unique_tourists INTEGER DEFAULT 0,
    group_registrations INTEGER DEFAULT 0,
    
    -- Demographics
    nationality_breakdown JSONB, -- {"US": 10, "UK": 5, ...}
    purpose_breakdown JSONB, -- {"leisure": 15, "business": 3, ...}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(destination_id, date)
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Tourist identification indexes
CREATE INDEX idx_tourists_passport ON tourists(passport_number) WHERE passport_number IS NOT NULL;
CREATE INDEX idx_tourists_national_id ON tourists(national_id) WHERE national_id IS NOT NULL;
CREATE INDEX idx_tourists_phone ON tourists(phone_number) WHERE phone_number IS NOT NULL;
CREATE INDEX idx_tourists_nationality ON tourists(nationality);
CREATE INDEX idx_tourists_registration_date ON tourists(created_at);
CREATE INDEX idx_tourists_active ON tourists(is_active) WHERE is_active = true;

-- Group indexes
CREATE INDEX idx_tourist_groups_leader ON tourist_groups(group_leader_id);
CREATE INDEX idx_tourist_group_members_group ON tourist_group_members(group_id);
CREATE INDEX idx_tourist_group_members_tourist ON tourist_group_members(tourist_id);

-- Stats indexes
CREATE INDEX idx_destination_stats_date ON destination_stats(destination_id, date);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Disable RLS for now (can be enabled later when needed)
ALTER TABLE destinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE tourists DISABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_groups DISABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_group_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE destination_stats DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- UTILITY FUNCTIONS
-- ============================================================================

-- Function to update destination statistics
CREATE OR REPLACE FUNCTION update_destination_stats(
    destination_uuid UUID,
    stats_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
DECLARE
    total_regs INTEGER;
    unique_count INTEGER;
    group_count INTEGER;
    nationality_data JSONB;
    purpose_data JSONB;
BEGIN
    -- Calculate basic statistics
    SELECT 
        COUNT(*),
        COUNT(DISTINCT id),
        COUNT(*) FILTER (WHERE group_size > 1)
    INTO total_regs, unique_count, group_count
    FROM tourists
    WHERE DATE(created_at) = stats_date;
    
    -- Calculate nationality breakdown
    SELECT jsonb_object_agg(nationality, count)
    INTO nationality_data
    FROM (
        SELECT nationality, COUNT(*) as count
        FROM tourists
        WHERE DATE(created_at) = stats_date
        GROUP BY nationality
    ) subq;
    
    -- Calculate purpose breakdown  
    SELECT jsonb_object_agg(purpose_of_visit, count)
    INTO purpose_data
    FROM (
        SELECT purpose_of_visit, COUNT(*) as count
        FROM tourists
        WHERE DATE(created_at) = stats_date
        GROUP BY purpose_of_visit
    ) subq;
    
    -- Insert or update stats
    INSERT INTO destination_stats (
        destination_id, date, total_registrations, unique_tourists,
        group_registrations, nationality_breakdown, purpose_breakdown
    ) VALUES (
        destination_uuid, stats_date, total_regs, unique_count,
        group_count, nationality_data, purpose_data
    )
    ON CONFLICT (destination_id, date) 
    DO UPDATE SET
        total_registrations = EXCLUDED.total_registrations,
        unique_tourists = EXCLUDED.unique_tourists,
        group_registrations = EXCLUDED.group_registrations,
        nationality_breakdown = EXCLUDED.nationality_breakdown,
        purpose_breakdown = EXCLUDED.purpose_breakdown,
        created_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA FOR DEVELOPMENT
-- ============================================================================

-- Insert sample destinations
INSERT INTO destinations (name, description, location, capacity, entry_fee, region_id) 
SELECT 
    'Wonchi Crater Lake',
    'Beautiful volcanic crater lake with boating and hiking opportunities',
    'Wonchi, Oromia',
    500,
    250.00,
    r.id
FROM regions r WHERE r.name = 'Addis Ababa' LIMIT 1;

INSERT INTO destinations (name, description, location, capacity, entry_fee, region_id)
SELECT 
    'Lalibela Rock Churches',
    'Ancient rock-hewn churches and UNESCO World Heritage site',
    'Lalibela, Amhara',
    300,
    400.00,
    r.id
FROM regions r WHERE r.name = 'Lalibela' LIMIT 1; 