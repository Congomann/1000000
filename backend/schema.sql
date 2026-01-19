
-- Enable UUID extension for secure IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- USERS (Advisors, Admins, Managers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Nullable if using SSO
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Administrator', 'Manager', 'Sub-Admin', 'Advisor', 'Client')),
    category VARCHAR(50) DEFAULT 'Insurance & General',
    title VARCHAR(100),
    years_of_experience INT,
    phone VARCHAR(50),
    avatar TEXT,
    bio TEXT,
    microsite_enabled BOOLEAN DEFAULT FALSE,
    products_sold TEXT[], -- Array of strings e.g. ['Life Insurance', 'Real Estate']
    languages TEXT[],
    social_links JSONB,
    license_states TEXT[],
    contract_level INT,
    calendar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- LEADS (Unified Table for all verticals)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    interest VARCHAR(100), -- ProductType
    status VARCHAR(50) DEFAULT 'New',
    score INT DEFAULT 50,
    qualification VARCHAR(20) CHECK (qualification IN ('Hot', 'Warm', 'Cold')),
    source VARCHAR(100),
    assigned_to UUID REFERENCES users(id),
    message TEXT,
    notes TEXT,
    priority VARCHAR(20) DEFAULT 'Low',
    
    -- Flexible Data Storage for Vertical Specifics
    -- Stores DOB, SSN, Health info for Life Insurance
    life_details JSONB, 
    -- Stores Property Type, Budget, Location for Real Estate/Mortgage
    real_estate_details JSONB, 
    -- Stores Risk Tolerance, AUM, Experience for Securities
    securities_details JSONB,
    -- Stores VIN, Business Revenue, etc.
    custom_details JSONB,
    
    -- Marketing Attribution
    campaign_id VARCHAR(255),
    ad_group_id VARCHAR(255),
    ad_id VARCHAR(255),
    platform_data JSONB, -- Raw webhook payload for debugging
    
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_set_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- COMPANY SETTINGS
CREATE TABLE company_settings (
    id TEXT PRIMARY KEY DEFAULT 'global_config',
    data JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER company_settings_set_updated_at
BEFORE UPDATE ON company_settings
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- CLIENTS (Active Policies & Accounts)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisor_id UUID REFERENCES users(id),
    user_id UUID REFERENCES users(id), -- Optional link if client has login
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    
    -- Policy / Account Info
    product VARCHAR(100),
    policy_number VARCHAR(100),
    carrier VARCHAR(100),
    premium NUMERIC(12, 2),
    renewal_date DATE,
    commission_amount NUMERIC(12, 2),
    
    address JSONB, -- { street, city, state, zip }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- APPLICATIONS (Pending Insurance/Mortgage deals)
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id),
    advisor_id UUID REFERENCES users(id),
    client_name VARCHAR(255),
    carrier VARCHAR(100),
    policy_number VARCHAR(100),
    status VARCHAR(50), -- Pending, Underwriting, Approved, Issued, Declined
    premium NUMERIC(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- REAL ESTATE TRANSACTIONS
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisor_id UUID REFERENCES users(id),
    property_address VARCHAR(255),
    client_name VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('Buyer', 'Seller')),
    amount NUMERIC(15, 2),
    status VARCHAR(50), -- Open, Closed, Cancelled
    stage VARCHAR(50), -- Offer Accepted, Inspection, etc.
    closing_date DATE,
    earnest_money NUMERIC(12, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- PORTFOLIOS (Securities & Wealth Mgmt)
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advisor_id UUID REFERENCES users(id),
    client_name VARCHAR(255),
    total_value NUMERIC(15, 2),
    ytd_return NUMERIC(5, 2),
    risk_profile VARCHAR(50),
    holdings JSONB, -- Array of { ticker, shares, value }
    last_rebalanced TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INTEGRATION LOGS (Webhooks)
CREATE TABLE integration_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform VARCHAR(50),
    event_type VARCHAR(100),
    status VARCHAR(20),
    payload JSONB,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- COMPANY SETTINGS
CREATE TABLE company_settings (
    id TEXT PRIMARY KEY,
    settings JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_assigned ON leads(assigned_to);
CREATE INDEX idx_clients_advisor ON clients(advisor_id);
