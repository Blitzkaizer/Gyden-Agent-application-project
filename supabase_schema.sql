-- SQL Migration File for GYDEN Property Database System v2.0
-- Execute this script in your Supabase SQL Editor to initialize tables

-- 1. STAGING INTAKE TABLE (LISTING_NEW)
CREATE TABLE IF NOT EXISTS public.listings_new (
    id TEXT PRIMARY KEY,
    property_id TEXT UNIQUE NOT NULL, -- Format: G-XXXX (e.g. G-1001)
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    price_requested NUMERIC NOT NULL,
    owner_name TEXT NOT NULL,
    owner_contact TEXT NOT NULL,
    photos TEXT[] DEFAULT '{}',
    salesperson_id TEXT NOT NULL,
    salesperson_name TEXT NOT NULL,
    is_checklist_passed BOOLEAN DEFAULT false NOT NULL,
    verification_status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'promoted', 'rejected'
    -- spreadsheet fields
    raw_wa_template TEXT DEFAULT '' NOT NULL,
    market_rating TEXT DEFAULT '' NOT NULL,
    sale_rent TEXT DEFAULT 'sale' NOT NULL,
    state TEXT DEFAULT '' NOT NULL,
    property_type TEXT DEFAULT '' NOT NULL,
    rooms_remarks TEXT DEFAULT '' NOT NULL,
    unit_no TEXT DEFAULT '' NOT NULL,
    size TEXT DEFAULT '' NOT NULL,
    gdrive_link TEXT DEFAULT '' NOT NULL,
    final_wa_template TEXT DEFAULT '' NOT NULL,
    private_notes TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. MASTER DATABASE TABLE (MASTER)
CREATE TABLE IF NOT EXISTS public.master_listings (
    id TEXT PRIMARY KEY,
    property_id TEXT UNIQUE NOT NULL, -- Links to listings_new.property_id
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    price NUMERIC NOT NULL, -- Editable by Melissa (Listing Team)
    status TEXT DEFAULT 'active' NOT NULL, -- 'active', 'sold', 'rented', 'inactive' (Editable by Melissa & Auto-sync)
    photos TEXT[] DEFAULT '{}',
    salesperson_id TEXT NOT NULL,
    salesperson_name TEXT NOT NULL,
    verified_by TEXT NOT NULL, -- Melissa's user ID
    owner_name TEXT DEFAULT '' NOT NULL,
    owner_contact TEXT DEFAULT '' NOT NULL,
    -- spreadsheet fields
    raw_wa_template TEXT DEFAULT '' NOT NULL,
    market_rating TEXT DEFAULT '' NOT NULL,
    sale_rent TEXT DEFAULT 'sale' NOT NULL,
    state TEXT DEFAULT '' NOT NULL,
    property_type TEXT DEFAULT '' NOT NULL,
    rooms_remarks TEXT DEFAULT '' NOT NULL,
    unit_no TEXT DEFAULT '' NOT NULL,
    size TEXT DEFAULT '' NOT NULL,
    gdrive_link TEXT DEFAULT '' NOT NULL,
    final_wa_template TEXT DEFAULT '' NOT NULL,
    private_notes TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. FOLLOW-UPS TABLE (LISTING_UPDATE)
CREATE TABLE IF NOT EXISTS public.listing_updates (
    id TEXT PRIMARY KEY,
    property_id TEXT NOT NULL, -- Links to property_id
    remarks TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    updated_by_name TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. MARKETING TABLE (ADVERTISING)
CREATE TABLE IF NOT EXISTS public.advertising (
    id TEXT PRIMARY KEY,
    property_id TEXT UNIQUE NOT NULL, -- Links to property_id
    title TEXT NOT NULL,
    selected_by_sales BOOLEAN DEFAULT false NOT NULL, -- Flagged by sales
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'published' (Managed by Intan)
    iproperty_link TEXT DEFAULT '' NOT NULL, -- (Managed by Intan)
    propertyguru_link TEXT DEFAULT '' NOT NULL, -- (Managed by Intan)
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. CO-AGENCY TABLE (MATCHING_COA)
CREATE TABLE IF NOT EXISTS public.matching_coa (
    id TEXT PRIMARY KEY,
    property_id TEXT UNIQUE NOT NULL, -- Links to property_id
    external_agent_name TEXT DEFAULT '' NOT NULL, -- (Managed by Jacqueen/Boonsiong)
    external_agent_contact TEXT DEFAULT '' NOT NULL, -- (Managed by Jacqueen/Boonsiong)
    commission_split TEXT DEFAULT '' NOT NULL, -- e.g. "50/50" (Managed by Jacqueen/Boonsiong)
    remarks TEXT DEFAULT '' NOT NULL, -- (Managed by Jacqueen/Boonsiong)
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TRANSACTION RESOLUTION TABLE (RESOLVING & ON-GOING SALES)
CREATE TABLE IF NOT EXISTS public.resolving_sales (
    id TEXT PRIMARY KEY,
    property_id TEXT UNIQUE NOT NULL, -- Links to property_id
    deal_stage TEXT DEFAULT 'booking' NOT NULL, -- 'booking', 'spa_signed', 'loan_approved', 'closed_sold', 'closed_rented' (Managed by Admin)
    buyer_name TEXT DEFAULT '' NOT NULL,
    buyer_contact TEXT DEFAULT '' NOT NULL,
    legal_status TEXT DEFAULT 'pending_documentation' NOT NULL,
    banking_status TEXT DEFAULT 'pending_approval' NOT NULL,
    salesperson_id TEXT NOT NULL,
    salesperson_name TEXT NOT NULL,
    total_commission NUMERIC DEFAULT 0 NOT NULL, -- (Managed by Admin)
    company_share NUMERIC DEFAULT 0 NOT NULL,
    agent_share NUMERIC DEFAULT 0 NOT NULL,
    closed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. SYSTEM COMPLIANCE LEDGER (AUDIT LOGS)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    action TEXT NOT NULL,
    details TEXT NOT NULL
);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS across all operational tables
ALTER TABLE public.listings_new ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.master_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advertising ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matching_coa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resolving_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Staging Intake policies
CREATE POLICY "Enable read for all" ON public.listings_new FOR SELECT USING (true);
CREATE POLICY "Enable write for all" ON public.listings_new FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.listings_new FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all" ON public.listings_new FOR DELETE USING (true);

-- Master Listings policies
CREATE POLICY "Enable read for all" ON public.master_listings FOR SELECT USING (true);
CREATE POLICY "Enable write for all" ON public.master_listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.master_listings FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Enable delete for all" ON public.master_listings FOR DELETE USING (true);

-- Follow-ups remarks policies
CREATE POLICY "Enable read for all" ON public.listing_updates FOR SELECT USING (true);
CREATE POLICY "Enable write for all" ON public.listing_updates FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.listing_updates FOR UPDATE USING (true) WITH CHECK (true);

-- Advertising policies
CREATE POLICY "Enable read for all" ON public.advertising FOR SELECT USING (true);
CREATE POLICY "Enable write for all" ON public.advertising FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.advertising FOR UPDATE USING (true) WITH CHECK (true);

-- Co-agency policies
CREATE POLICY "Enable read for all" ON public.matching_coa FOR SELECT USING (true);
CREATE POLICY "Enable write for all" ON public.matching_coa FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.matching_coa FOR UPDATE USING (true) WITH CHECK (true);

-- Resolving Sales policies
CREATE POLICY "Enable read for all" ON public.resolving_sales FOR SELECT USING (true);
CREATE POLICY "Enable write for all" ON public.resolving_sales FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all" ON public.resolving_sales FOR UPDATE USING (true) WITH CHECK (true);

-- Audit logs policies (Append-only)
CREATE POLICY "Enable read for all" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Enable write for all" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Disable edit on audit logs" ON public.audit_logs FOR UPDATE USING (false);
CREATE POLICY "Disable delete on audit logs" ON public.audit_logs FOR DELETE USING (false);

-- 9. PORTAL ACCOUNTS TABLE (Restricted Signups)
CREATE TABLE IF NOT EXISTS public.portal_accounts (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'sales' NOT NULL,
    status TEXT DEFAULT 'pending_approval' NOT NULL, -- 'pending_approval', 'approved', 'rejected'
    avatar_url TEXT DEFAULT '' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.portal_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable select access for authenticated users" ON public.portal_accounts FOR SELECT USING (true);
CREATE POLICY "Enable insert for registration signups" ON public.portal_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for admin approval vetting" ON public.portal_accounts FOR UPDATE USING (true);

