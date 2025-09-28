-- ============================================================================
-- Ethiopia Tourism - Wristband System Migration
-- ============================================================================
-- This migration adds tables for NFC wristband management, linking, and
-- authentication for the tourism platform
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- WRISTBAND MANAGEMENT TABLES
-- ============================================================================

-- NFC Wristbands inventory and management
CREATE TABLE wristbands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Hardware Information
    nfc_uid TEXT NOT NULL UNIQUE, -- Encrypted NFC UID
    hardware_version TEXT,
    manufacturer TEXT DEFAULT 'Generic NFC',
    battery_level INTEGER CHECK (battery_level BETWEEN 0 AND 100),
    
    -- Linking Information
    tourist_id UUID REFERENCES tourists(id) ON DELETE SET NULL,
    linked_at TIMESTAMP WITH TIME ZONE,
    unlinked_at TIMESTAMP WITH TIME ZONE,
    
    -- Wallet Information
    wallet_balance DECIMAL(12,2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
    currency TEXT DEFAULT 'ETB',
    
    -- Spending Limits
    daily_spending_limit DECIMAL(10,2) DEFAULT 1000.00,
    offline_spending_limit DECIMAL(10,2) DEFAULT 200.00,
    transaction_limit DECIMAL(10,2) DEFAULT 500.00,
    
    -- Security
    encryption_key_hash TEXT, -- Hash of encryption key for this wristband
    last_sync_at TIMESTAMP WITH TIME ZONE,
    security_version INTEGER DEFAULT 1,
    
    -- Status
    status TEXT DEFAULT 'available' CHECK (status IN (
        'available', 'linked', 'suspended', 'lost', 'damaged', 'retired'
    )),
    is_active BOOLEAN DEFAULT true,
    
    -- Location tracking
    last_seen_location TEXT,
    last_seen_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_linking CHECK (
        (tourist_id IS NULL AND linked_at IS NULL) OR 
        (tourist_id IS NOT NULL AND linked_at IS NOT NULL)
    ),
    CONSTRAINT valid_balance_limits CHECK (
        offline_spending_limit <= daily_spending_limit AND
        transaction_limit <= daily_spending_limit
    )
);

-- Wristband transaction history for offline reconciliation
CREATE TABLE wristband_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Transaction Information
    wristband_id UUID REFERENCES wristbands(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN (
        'payment', 'refund', 'top_up', 'fee', 'adjustment'
    )),
    
    -- Amount and Currency
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'ETB',
    
    -- Transaction Context
    merchant_id TEXT,
    merchant_name TEXT,
    merchant_category TEXT,
    location TEXT,
    
    -- Payment Details
    payment_method TEXT CHECK (payment_method IN (
        'wristband_nfc', 'mobile_money', 'card', 'cash', 'bank_transfer'
    )),
    external_transaction_id TEXT, -- PSP transaction ID
    
    -- Status and Timing
    status TEXT DEFAULT 'pending' CHECK (status IN (
        'pending', 'completed', 'failed', 'cancelled', 'refunded'
    )),
    is_offline BOOLEAN DEFAULT false,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    synced_at TIMESTAMP WITH TIME ZONE,
    
    -- Reconciliation
    reconciled BOOLEAN DEFAULT false,
    reconciled_at TIMESTAMP WITH TIME ZONE,
    reconciliation_batch_id UUID,
    
    -- Security and Audit
    device_id TEXT, -- Which reader/POS processed this
    operator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    signature TEXT, -- Cryptographic signature for offline transactions
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wristband access permissions for different attractions/services
CREATE TABLE wristband_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    wristband_id UUID REFERENCES wristbands(id) ON DELETE CASCADE,
    
    -- Permission Details
    permission_type TEXT NOT NULL CHECK (permission_type IN (
        'attraction_entry', 'transport', 'dining', 'shopping', 'vip_access'
    )),
    resource_id TEXT NOT NULL, -- Attraction ID, transport route, etc.
    resource_name TEXT,
    
    -- Validity
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER, -- Number of times this permission can be used
    usage_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    UNIQUE(wristband_id, permission_type, resource_id)
);

-- Device registry for NFC readers and POS terminals
CREATE TABLE nfc_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Device Information
    device_id TEXT NOT NULL UNIQUE,
    device_name TEXT NOT NULL,
    device_type TEXT NOT NULL CHECK (device_type IN (
        'nfc_reader', 'pos_terminal', 'entry_gate', 'mobile_reader'
    )),
    
    -- Location and Assignment
    location TEXT NOT NULL,
    destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
    merchant_id TEXT,
    
    -- Technical Specifications
    hardware_version TEXT,
    software_version TEXT,
    supported_protocols TEXT[], -- ['ISO14443A', 'ISO14443B', 'ISO15693']
    
    -- Network and Connectivity
    ip_address INET,
    mac_address MACADDR,
    connectivity_type TEXT CHECK (connectivity_type IN (
        'ethernet', 'wifi', 'cellular', 'offline'
    )),
    
    -- Status and Health
    status TEXT DEFAULT 'active' CHECK (status IN (
        'active', 'inactive', 'maintenance', 'error', 'retired'
    )),
    last_heartbeat TIMESTAMP WITH TIME ZONE,
    battery_level INTEGER CHECK (battery_level BETWEEN 0 AND 100),
    
    -- Security
    encryption_enabled BOOLEAN DEFAULT true,
    certificate_fingerprint TEXT,
    last_security_update TIMESTAMP WITH TIME ZONE,
    
    -- Operational
    operator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    installed_at TIMESTAMP WITH TIME ZONE,
    last_maintenance TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Wristband indexes
CREATE INDEX idx_wristbands_nfc_uid ON wristbands(nfc_uid);
CREATE INDEX idx_wristbands_tourist ON wristbands(tourist_id) WHERE tourist_id IS NOT NULL;
CREATE INDEX idx_wristbands_status ON wristbands(status, is_active);
CREATE INDEX idx_wristbands_location ON wristbands(last_seen_location, last_seen_at);

-- Transaction indexes
CREATE INDEX idx_wristband_transactions_wristband ON wristband_transactions(wristband_id);
CREATE INDEX idx_wristband_transactions_status ON wristband_transactions(status, processed_at);
CREATE INDEX idx_wristband_transactions_merchant ON wristband_transactions(merchant_id, processed_at);
CREATE INDEX idx_wristband_transactions_offline ON wristband_transactions(is_offline, synced_at) 
    WHERE is_offline = true;
CREATE INDEX idx_wristband_transactions_reconciliation ON wristband_transactions(reconciled, reconciled_at);

-- Permission indexes
CREATE INDEX idx_wristband_permissions_wristband ON wristband_permissions(wristband_id);
CREATE INDEX idx_wristband_permissions_resource ON wristband_permissions(resource_id, permission_type);
CREATE INDEX idx_wristband_permissions_validity ON wristband_permissions(valid_from, valid_until, is_active);

-- Device indexes
CREATE INDEX idx_nfc_devices_device_id ON nfc_devices(device_id);
CREATE INDEX idx_nfc_devices_location ON nfc_devices(location, device_type);
CREATE INDEX idx_nfc_devices_status ON nfc_devices(status, last_heartbeat);
CREATE INDEX idx_nfc_devices_destination ON nfc_devices(destination_id) WHERE destination_id IS NOT NULL;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE wristbands ENABLE ROW LEVEL SECURITY;
ALTER TABLE wristband_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE wristband_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE nfc_devices ENABLE ROW LEVEL SECURITY;

-- Admin full access policies
CREATE POLICY "admin_full_access_wristbands" ON wristbands
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "admin_full_access_wristband_transactions" ON wristband_transactions
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Operator access to wristbands in their region
CREATE POLICY "operator_regional_wristbands" ON wristbands
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN destinations d ON d.region_id = ANY(p.allowed_regions)
            WHERE p.id = auth.uid() 
            AND p.role IN ('admin', 'partner')
            AND wristbands.last_seen_location = d.location
        )
    );

-- Tourist can view their own wristband
CREATE POLICY "tourist_own_wristband" ON wristbands
    FOR SELECT TO authenticated
    USING (
        tourist_id IN (
            SELECT t.id FROM tourists t 
            WHERE t.registration_agent_id = auth.uid()
        )
    );

-- Operators can view transactions for their devices
CREATE POLICY "operator_device_transactions" ON wristband_transactions
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM nfc_devices nd
            JOIN profiles p ON p.id = auth.uid()
            WHERE nd.device_id = wristband_transactions.device_id
            AND (p.role = 'admin' OR nd.operator_id = auth.uid())
        )
    );

-- Device management policies
CREATE POLICY "operator_manage_devices" ON nfc_devices
    FOR ALL TO authenticated
    USING (
        operator_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- ============================================================================
-- FUNCTIONS FOR WRISTBAND OPERATIONS
-- ============================================================================

-- Function to link wristband to tourist
CREATE OR REPLACE FUNCTION link_wristband_to_tourist(
    p_nfc_uid TEXT,
    p_tourist_id UUID,
    p_initial_balance DECIMAL DEFAULT 0.00,
    p_daily_limit DECIMAL DEFAULT 1000.00,
    p_offline_limit DECIMAL DEFAULT 200.00
)
RETURNS UUID AS $$
DECLARE
    wristband_id UUID;
    encrypted_uid TEXT;
BEGIN
    -- Encrypt the NFC UID (in real implementation, use proper encryption)
    encrypted_uid := encode(digest(p_nfc_uid || 'salt', 'sha256'), 'hex');
    
    -- Check if wristband exists and is available
    SELECT id INTO wristband_id
    FROM wristbands
    WHERE nfc_uid = encrypted_uid AND status = 'available';
    
    IF wristband_id IS NULL THEN
        -- Create new wristband if it doesn't exist
        INSERT INTO wristbands (
            nfc_uid, tourist_id, linked_at, wallet_balance,
            daily_spending_limit, offline_spending_limit, status
        ) VALUES (
            encrypted_uid, p_tourist_id, NOW(), p_initial_balance,
            p_daily_limit, p_offline_limit, 'linked'
        ) RETURNING id INTO wristband_id;
    ELSE
        -- Link existing wristband
        UPDATE wristbands
        SET tourist_id = p_tourist_id,
            linked_at = NOW(),
            wallet_balance = p_initial_balance,
            daily_spending_limit = p_daily_limit,
            offline_spending_limit = p_offline_limit,
            status = 'linked',
            updated_at = NOW()
        WHERE id = wristband_id;
    END IF;
    
    RETURN wristband_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to process wristband payment
CREATE OR REPLACE FUNCTION process_wristband_payment(
    p_nfc_uid TEXT,
    p_amount DECIMAL,
    p_merchant_id TEXT,
    p_device_id TEXT,
    p_is_offline BOOLEAN DEFAULT false
)
RETURNS UUID AS $$
DECLARE
    wristband_record RECORD;
    transaction_id UUID;
    daily_spent DECIMAL;
    encrypted_uid TEXT;
BEGIN
    -- Encrypt the NFC UID
    encrypted_uid := encode(digest(p_nfc_uid || 'salt', 'sha256'), 'hex');
    
    -- Get wristband details
    SELECT * INTO wristband_record
    FROM wristbands
    WHERE nfc_uid = encrypted_uid AND status = 'linked' AND is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Wristband not found or not active';
    END IF;
    
    -- Check wallet balance
    IF wristband_record.wallet_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient wallet balance';
    END IF;
    
    -- Check daily spending limit
    SELECT COALESCE(SUM(amount), 0) INTO daily_spent
    FROM wristband_transactions
    WHERE wristband_id = wristband_record.id
    AND DATE(processed_at) = CURRENT_DATE
    AND status = 'completed'
    AND transaction_type = 'payment';
    
    IF daily_spent + p_amount > wristband_record.daily_spending_limit THEN
        RAISE EXCEPTION 'Daily spending limit exceeded';
    END IF;
    
    -- Check offline limit if offline transaction
    IF p_is_offline AND p_amount > wristband_record.offline_spending_limit THEN
        RAISE EXCEPTION 'Offline spending limit exceeded';
    END IF;
    
    -- Create transaction record
    INSERT INTO wristband_transactions (
        wristband_id, transaction_type, amount, merchant_id,
        device_id, status, is_offline, processed_at
    ) VALUES (
        wristband_record.id, 'payment', p_amount, p_merchant_id,
        p_device_id, 'completed', p_is_offline, NOW()
    ) RETURNING id INTO transaction_id;
    
    -- Update wallet balance
    UPDATE wristbands
    SET wallet_balance = wallet_balance - p_amount,
        last_seen_at = NOW(),
        updated_at = NOW()
    WHERE id = wristband_record.id;
    
    RETURN transaction_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get wristband daily spending
CREATE OR REPLACE FUNCTION get_wristband_daily_spending(p_wristband_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    daily_spent DECIMAL;
BEGIN
    SELECT COALESCE(SUM(amount), 0) INTO daily_spent
    FROM wristband_transactions
    WHERE wristband_id = p_wristband_id
    AND DATE(processed_at) = CURRENT_DATE
    AND status = 'completed'
    AND transaction_type = 'payment';
    
    RETURN daily_spent;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- TRIGGERS FOR AUDIT AND UPDATES
-- ============================================================================

-- Update timestamp trigger for wristbands
CREATE OR REPLACE FUNCTION update_wristband_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER wristband_update_timestamp
    BEFORE UPDATE ON wristbands
    FOR EACH ROW
    EXECUTE FUNCTION update_wristband_timestamp();

-- ============================================================================
-- SAMPLE DATA FOR DEVELOPMENT
-- ============================================================================

-- Insert sample NFC devices
INSERT INTO nfc_devices (device_id, device_name, device_type, location, connectivity_type) VALUES 
    ('reader_001', 'Entoto Park Entry Gate', 'entry_gate', 'Entoto Park Main Entrance', 'wifi'),
    ('pos_001', 'Souvenir Shop POS', 'pos_terminal', 'Entoto Park Gift Shop', 'ethernet'),
    ('reader_002', 'Lalibela Church Entry', 'nfc_reader', 'Lalibela Rock Churches', 'cellular'),
    ('mobile_001', 'Mobile Reader Unit 1', 'mobile_reader', 'Various Locations', 'cellular');

-- Insert sample wristbands (for testing)
INSERT INTO wristbands (nfc_uid, status, wallet_balance, daily_spending_limit) VALUES 
    (encode(digest('TEST_UID_001' || 'salt', 'sha256'), 'hex'), 'available', 0.00, 1000.00),
    (encode(digest('TEST_UID_002' || 'salt', 'sha256'), 'hex'), 'available', 0.00, 1000.00),
    (encode(digest('TEST_UID_003' || 'salt', 'sha256'), 'hex'), 'available', 0.00, 1000.00);

COMMENT ON TABLE wristbands IS 'NFC wristbands for tourist payments and access control';
COMMENT ON TABLE wristband_transactions IS 'Transaction history for wristband payments';
COMMENT ON TABLE wristband_permissions IS 'Access permissions for wristband holders';
COMMENT ON TABLE nfc_devices IS 'Registry of NFC readers and POS terminals';
