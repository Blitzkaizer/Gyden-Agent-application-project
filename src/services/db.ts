import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'listing_melissa' | 'listing_intan' | 'coagency' | 'sales' | 'admin';
  avatarUrl?: string;
}

export interface PortalAccount {
  id: string;
  email: string;
  password?: string;
  name: string;
  role: 'listing_melissa' | 'listing_intan' | 'coagency' | 'sales' | 'admin';
  status: 'pending_approval' | 'approved' | 'rejected';
  avatarUrl?: string;
  createdAt: string;
}

export interface ListingNew {
  id: string;
  property_id: string; // Format: G-XXXX (e.g. G-1001)
  title: string;
  address: string;
  price_requested: number;
  owner_name: string;
  owner_contact: string;
  photos: string[];
  salesperson_id: string;
  salesperson_name: string;
  is_checklist_passed: boolean;
  verification_status: 'pending' | 'promoted' | 'rejected';
  // Excel alignment fields
  raw_wa_template: string;
  market_rating: string;
  sale_rent: string;
  state: string;
  property_type: string;
  rooms_remarks: string;
  unit_no: string;
  size: string;
  gdrive_link: string;
  final_wa_template: string;
  private_notes: string;
  created_at: string;
}

export interface MasterListing {
  id: string;
  property_id: string;
  title: string;
  address: string;
  price: number;
  status: 'active' | 'sold' | 'rented' | 'inactive';
  photos: string[];
  salesperson_id: string;
  salesperson_name: string;
  verified_by: string; // User ID
  owner_name: string;
  owner_contact: string;
  // Excel alignment fields
  raw_wa_template: string;
  market_rating: string;
  sale_rent: string;
  state: string;
  property_type: string;
  rooms_remarks: string;
  unit_no: string;
  size: string;
  gdrive_link: string;
  final_wa_template: string;
  private_notes: string;
  created_at: string;
}

export interface ListingUpdate {
  id: string;
  property_id: string;
  remarks: string;
  updated_by: string;
  updated_by_name: string;
  updated_at: string;
}

export interface Advertising {
  id: string;
  property_id: string;
  title: string;
  selected_by_sales: boolean;
  status: 'pending' | 'published';
  iproperty_link: string;
  propertyguru_link: string;
  updated_at: string;
}

export interface MatchingCoa {
  id: string;
  property_id: string;
  external_agent_name: string;
  external_agent_contact: string;
  commission_split: string; // e.g. "50/50"
  remarks: string;
  updated_at: string;
}

export interface ResolvingSale {
  id: string;
  property_id: string;
  deal_stage: 'booking' | 'spa_signed' | 'loan_approved' | 'closed_sold' | 'closed_rented';
  buyer_name: string;
  buyer_contact: string;
  legal_status: string;
  banking_status: string;
  salesperson_id: string;
  salesperson_name: string;
  total_commission: number;
  company_share: number;
  agent_share: number;
  closed_at: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user_id: string;
  user_name: string;
  action: string;
  details: string;
}

// Pre-defined users based on the DASHBOARD role indexes
export const MOCK_USERS: User[] = [
  { id: 'usr-admin-01', name: 'Commander Navin (Admin)', email: 'admin@gyden.com', role: 'admin', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
  { id: 'usr-melissa', name: 'Melissa (Listing Master Team)', email: 'melissa@gyden.com', role: 'listing_melissa', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
  { id: 'usr-intan', name: 'Intan (Listing Advertising Team)', email: 'intan@gyden.com', role: 'listing_intan', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80' },
  { id: 'usr-jacqueen', name: 'Jacqueen (Co-Agency Team)', email: 'jacqueen@gyden.com', role: 'coagency', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80' },
  { id: 'usr-boonsiong', name: 'Boonsiong (Co-Agency Team)', email: 'boonsiong@gyden.com', role: 'coagency', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80' },
  { id: 'usr-sales-sarah', name: 'Sarah Connor (Sales Team)', email: 'sarah@gyden.com', role: 'sales', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80' }
];

const getLocal = <T>(key: string, defaultValue: T): T => {
  const data = localStorage.getItem(`gyden2_${key}`);
  return data ? JSON.parse(data) : defaultValue;
};

const setLocal = <T>(key: string, value: T): void => {
  localStorage.setItem(`gyden2_${key}`, JSON.stringify(value));
};

// Initial Mock Seed Data
const initMockData = () => {
  if (!localStorage.getItem('gyden2_initialized')) {
    // 1. Listings Staging (LISTING_NEW)
    setLocal('listings_new', [
      {
        id: 'stg-01',
        property_id: 'G-1001',
        title: 'Cyberjaya Smarthome Condominium',
        address: 'Cyberjaya Block C, Level 15',
        price_requested: 550000,
        owner_name: 'Dr. Evelyn Shaw',
        owner_contact: '+6012-345-6789',
        photos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'],
        salesperson_id: 'usr-sales-sarah',
        salesperson_name: 'Sarah Connor (Sales Team)',
        is_checklist_passed: true,
        verification_status: 'pending',
        raw_wa_template: 'WTS condo Cyberjaya. Asking price RM550k.',
        market_rating: 'A',
        sale_rent: 'sale',
        state: 'Selangor',
        property_type: 'Condominium',
        rooms_remarks: '3R 2B, High Floor',
        unit_no: 'C-15-04',
        size: '1,050 sqft',
        gdrive_link: 'https://drive.google.com/drive/folders/mock1',
        final_wa_template: 'WTS Bangsar horizontally aligned copy here.',
        private_notes: 'Owner is very urgent to sell.',
        created_at: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'stg-02',
        property_id: 'G-1002',
        title: 'Mont Kiara Glass Skyvilla',
        address: 'Villa Heights, Block B-04',
        price_requested: 1200000,
        owner_name: 'Arthur Pendelton',
        owner_contact: '+6011-9988-7766',
        photos: ['https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'],
        salesperson_id: 'usr-sales-sarah',
        salesperson_name: 'Sarah Connor (Sales Team)',
        is_checklist_passed: false, // Missing owner documentation check
        verification_status: 'pending',
        raw_wa_template: '',
        market_rating: 'B',
        sale_rent: 'sale',
        state: 'Kuala Lumpur',
        property_type: 'Condominium',
        rooms_remarks: '4R 4B',
        unit_no: 'B-04-12',
        size: '2,200 sqft',
        gdrive_link: '',
        final_wa_template: '',
        private_notes: 'Wants to upgrade to bungalow.',
        created_at: new Date().toISOString()
      }
    ]);

    // 2. Master listings (MASTER)
    setLocal('master_listings', [
      {
        id: 'mst-01',
        property_id: 'G-9001',
        title: 'Bangsar Horizon Luxury Penthouse',
        address: 'Jalan Bangsar Utama, Residences Peak 1',
        price: 2400000,
        status: 'active',
        photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'],
        salesperson_id: 'usr-sales-sarah',
        salesperson_name: 'Sarah Connor (Sales Team)',
        verified_by: 'usr-melissa',
        owner_name: 'Dato Jimmy',
        owner_contact: '+6019-222-3333',
        raw_wa_template: 'Horizon penthouse Bangsar.',
        market_rating: 'A+',
        sale_rent: 'sale',
        state: 'Kuala Lumpur',
        property_type: 'Penthouse',
        rooms_remarks: '5R 6B, private pool',
        unit_no: 'Peak-35-01',
        size: '4,500 sqft',
        gdrive_link: 'https://drive.google.com/drive/folders/mock2',
        final_wa_template: 'Horizon WTS Bangsar compile.',
        private_notes: 'Fully furnished, viewing key with Melissa.',
        created_at: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: 'mst-02',
        property_id: 'G-9002',
        title: 'KLCC Twin Towers Executive Suite',
        address: 'KLCC Avenue, Tower 3, Level 50',
        price: 3200000,
        status: 'active',
        photos: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'],
        salesperson_id: 'usr-sales-sarah',
        salesperson_name: 'Sarah Connor (Sales Team)',
        verified_by: 'usr-melissa',
        owner_name: 'Madam Lee',
        owner_contact: '+6012-777-8888',
        raw_wa_template: 'KLCC level 50 executive WTS.',
        market_rating: 'A',
        sale_rent: 'sale',
        state: 'Kuala Lumpur',
        property_type: 'Serviced Residence',
        rooms_remarks: '2R 2B, twin towers view',
        unit_no: 'T3-50-08',
        size: '1,200 sqft',
        gdrive_link: 'https://drive.google.com/drive/folders/mock3',
        final_wa_template: 'KLCC final draft WA copy.',
        private_notes: 'Tenanted until Dec 2026.',
        created_at: new Date(Date.now() - 3600000 * 72).toISOString()
      }
    ]);

    // 3. Updates remarks (LISTING_UPDATE)
    setLocal('listing_updates', [
      {
        id: 'upd-01',
        property_id: 'G-9001',
        remarks: 'Owner remarked that listing can accept a 5% negotiation window.',
        updated_by: 'usr-sales-sarah',
        updated_by_name: 'Sarah Connor',
        updated_at: new Date(Date.now() - 3600000 * 12).toISOString()
      }
    ]);

    // 4. Marketing ads (ADVERTISING)
    setLocal('advertising', [
      {
        id: 'adv-01',
        property_id: 'G-9001',
        title: 'Bangsar Horizon Luxury Penthouse',
        selected_by_sales: true,
        status: 'published',
        iproperty_link: 'https://iproperty.com.my/property/G-9001-bangsar-residence',
        propertyguru_link: 'https://propertyguru.com.my/listing/G-9001-bangsar',
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-02',
        property_id: 'G-9002',
        title: 'KLCC Twin Towers Executive Suite',
        selected_by_sales: false,
        status: 'pending',
        iproperty_link: '',
        propertyguru_link: '',
        updated_at: new Date().toISOString()
      }
    ]);

    // 5. Co-Agency (MATCHING_COA)
    setLocal('matching_coa', [
      {
        id: 'coa-01',
        property_id: 'G-9001',
        external_agent_name: 'Raffael Miller (Vantage Prop)',
        external_agent_contact: '+6017-4433-221',
        commission_split: '50/50 co-broke',
        remarks: 'Shared keys. Viewings must be booked 24 hours prior.',
        updated_at: new Date().toISOString()
      }
    ]);

    // 6. Resolving Sales (RESOLVING)
    setLocal('resolving_sales', [
      {
        id: 'rsl-01',
        property_id: 'G-9001',
        deal_stage: 'booking',
        buyer_name: 'Chloe Tan',
        buyer_contact: '+6016-1122-334',
        legal_status: 'drafting_agreement',
        banking_status: 'applying_loan',
        salesperson_id: 'usr-sales-sarah',
        salesperson_name: 'Sarah Connor',
        total_commission: 48000, // 2% of 2.4M
        company_share: 19200, // 40%
        agent_share: 28800, // 60%
        closed_at: new Date().toISOString()
      }
    ]);

    // 7. Audit logs
    setLocal('audit_logs', [
      {
        id: 'log-01',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        user_id: 'usr-admin-01',
        user_name: 'Commander Navin (Admin)',
        action: 'SYSTEM_STARTUP',
        details: 'GYDEN Property System 2.0 database nodes initialized successfully.'
      }
    ]);

    localStorage.setItem('gyden2_initialized', 'true');
  }

  // Seeding portal accounts independently if they do not exist or are missing defaults (prevents local storage cache bypass)
  const currentAccounts = getLocal<PortalAccount[]>('portal_accounts', []);
  const hasAdmin = currentAccounts.some(a => a.email.toLowerCase() === 'admin@gyden.com');
  if (!hasAdmin) {
    const mockAccounts: PortalAccount[] = [
      { id: 'usr-admin-01', name: 'Commander Navin (Admin)', email: 'admin@gyden.com', password: 'admin123', role: 'admin', status: 'approved', createdAt: new Date().toISOString() },
      { id: 'usr-melissa', name: 'Melissa (Listing Master Team)', email: 'melissa@gyden.com', password: 'melissa123', role: 'listing_melissa', status: 'approved', createdAt: new Date().toISOString() },
      { id: 'usr-intan', name: 'Intan (Listing Advertising Team)', email: 'intan@gyden.com', password: 'intan123', role: 'listing_intan', status: 'approved', createdAt: new Date().toISOString() },
      { id: 'usr-jacqueen', name: 'Jacqueen (Co-Agency Team)', email: 'jacqueen@gyden.com', password: 'jacqueen123', role: 'coagency', status: 'approved', createdAt: new Date().toISOString() },
      { id: 'usr-boonsiong', name: 'Boonsiong (Co-Agency Team)', email: 'boonsiong@gyden.com', password: 'boonsiong123', role: 'coagency', status: 'approved', createdAt: new Date().toISOString() },
      { id: 'usr-sales-sarah', name: 'Sarah Connor (Sales Team)', email: 'sarah@gyden.com', password: 'sarah123', role: 'sales', status: 'approved', createdAt: new Date().toISOString() },
      { id: 'usr-pending-john', name: 'John Doe', email: 'john@gyden.com', password: 'john123', role: 'sales', status: 'pending_approval', createdAt: new Date().toISOString() },
      { id: 'usr-pending-jane', name: 'Jane Smith', email: 'jane@gyden.com', password: 'jane123', role: 'listing_melissa', status: 'pending_approval', createdAt: new Date().toISOString() }
    ];
    
    // Merge mock accounts, preserving any existing custom signups
    const merged = [...currentAccounts];
    mockAccounts.forEach(mock => {
      if (!merged.some(m => m.email.toLowerCase() === mock.email.toLowerCase())) {
        merged.push(mock);
      }
    });
    setLocal('portal_accounts', merged);
  }
};

initMockData();

// Session User Cache
let activeUser: User = MOCK_USERS[0]; // defaults to Admin

export const dbService = {
  // Get active session user
  getCurrentUser: (): User => {
    const savedUserId = localStorage.getItem('gyden2_current_user_id');
    if (savedUserId) {
      // First check mock users
      const foundMock = MOCK_USERS.find(u => u.id === savedUserId);
      if (foundMock) {
        activeUser = foundMock;
      } else {
        // Then check registered portal accounts
        const accounts = getLocal<PortalAccount[]>('portal_accounts', []);
        const accFound = accounts.find(a => a.id === savedUserId);
        if (accFound) {
          activeUser = {
            id: accFound.id,
            name: accFound.name,
            email: accFound.email,
            role: accFound.role,
            avatarUrl: accFound.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
          };
        }
      }
    }
    return activeUser;
  },

  // Set active user (for impersonating or normal logins)
  setCurrentUser: (userId: string): User => {
    const foundMock = MOCK_USERS.find(u => u.id === userId);
    if (foundMock) {
      activeUser = foundMock;
      localStorage.setItem('gyden2_current_user_id', userId);
      dbService.logAction('AUTH_SWITCH', `Switched session identity to: ${foundMock.name} [Role: ${foundMock.role.toUpperCase()}].`);
    } else {
      const accounts = getLocal<PortalAccount[]>('portal_accounts', []);
      const accFound = accounts.find(a => a.id === userId);
      if (accFound) {
        activeUser = {
          id: accFound.id,
          name: accFound.name,
          email: accFound.email,
          role: accFound.role,
          avatarUrl: accFound.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        };
        localStorage.setItem('gyden2_current_user_id', userId);
        dbService.logAction('AUTH_SWITCH', `Switched session identity to: ${accFound.name} [Role: ${accFound.role.toUpperCase()}].`);
      }
    }
    return activeUser;
  },

  // Logs
  getAuditLogs: async (): Promise<AuditLog[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('audit_logs')
          .select('*')
          .order('timestamp', { ascending: false });
        if (!error && data) return data as AuditLog[];
      } catch (err) {
        console.error('Supabase fetch logs error:', err);
      }
    }
    return getLocal<AuditLog[]>('audit_logs', []).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },

  logAction: async (action: string, details: string): Promise<AuditLog> => {
    const user = dbService.getCurrentUser();
    const newLog: AuditLog = {
      id: `log-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      user_id: user.id,
      user_name: user.name,
      action,
      details
    };

    if (isSupabaseConfigured) {
      try {
        await supabase!
          .from('audit_logs')
          .insert([{
            user_id: newLog.user_id,
            user_name: newLog.user_name,
            action: newLog.action,
            details: newLog.details
          }]);
      } catch (err) {
        console.error('Supabase write log error:', err);
      }
    }

    const currentLogs = getLocal<AuditLog[]>('audit_logs', []);
    currentLogs.push(newLog);
    setLocal('audit_logs', currentLogs);
    
    // dispatch event for telemetry UI tickers
    window.dispatchEvent(new CustomEvent('gyden_audit_logged', { detail: newLog }));
    return newLog;
  },

  // Image Upload helper (returns simulated DataURL, or uploads to Supabase storage)
  uploadPhoto: async (file: File): Promise<string> => {
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `photos/${fileName}`;

        const { error: uploadError } = await supabase!
          .storage
          .from('property-photos')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase!
          .storage
          .from('property-photos')
          .getPublicUrl(filePath);

        return data.publicUrl;
      } catch (err) {
        console.error('Supabase photo upload failed, using local base64 fallback:', err);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  // 1. INTAKE TRACK (LISTING_NEW)
  getListingsNew: async (): Promise<ListingNew[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('listings_new').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as ListingNew[];
      } catch (err) {
        console.error('Supabase getListingsNew failed:', err);
      }
    }
    return getLocal<ListingNew[]>('listings_new', []);
  },

  createListingNew: async (
    title: string,
    address: string,
    priceRequested: number,
    ownerName: string,
    ownerContact: string,
    photos: string[],
    rawWaTemplate: string = '',
    marketRating: string = '',
    saleRent: string = 'sale',
    state: string = '',
    propertyType: string = '',
    roomsRemarks: string = '',
    unitNo: string = '',
    size: string = '',
    gdriveLink: string = '',
    finalWaTemplate: string = '',
    privateNotes: string = ''
  ): Promise<ListingNew> => {
    const user = dbService.getCurrentUser();
    
    // Auto generate property id: G-XXXX
    const count = getLocal<ListingNew[]>('listings_new', []).length + getLocal<MasterListing[]>('master_listings', []).length + 1000;
    const propertyId = `G-${count + 1}`;

    // Staging checklist validation check (GDrive photo link counts if no physical photos are attached)
    const isChecklistPassed = !!(title && address && priceRequested > 0 && ownerName && ownerContact && (photos.length > 0 || gdriveLink));

    const newStaging: ListingNew = {
      id: `stg-${Math.random().toString(36).substr(2, 9)}`,
      property_id: propertyId,
      title,
      address,
      price_requested: priceRequested,
      owner_name: ownerName,
      owner_contact: ownerContact,
      photos,
      salesperson_id: user.id,
      salesperson_name: user.name,
      is_checklist_passed: isChecklistPassed,
      verification_status: 'pending',
      raw_wa_template: rawWaTemplate,
      market_rating: marketRating,
      sale_rent: saleRent,
      state,
      property_type: propertyType,
      rooms_remarks: roomsRemarks,
      unit_no: unitNo,
      size,
      gdrive_link: gdriveLink,
      final_wa_template: finalWaTemplate,
      private_notes: privateNotes,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('listings_new')
          .insert([newStaging])
          .select()
          .single();
        if (!error && data) {
          dbService.logAction('LISTING_NEW', `Staged new intake listing: "${title}" under Property ID ${propertyId}. Checklist: ${isChecklistPassed ? 'PASSED' : 'PENDING'}`);
          return data as ListingNew;
        }
      } catch (err) {
        console.error('Supabase createListingNew failed:', err);
      }
    }

    const current = getLocal<ListingNew[]>('listings_new', []);
    current.push(newStaging);
    setLocal('listings_new', current);

    dbService.logAction('LISTING_NEW', `Staged new intake listing: "${title}" under Property ID ${propertyId}. Checklist: ${isChecklistPassed ? 'PASSED' : 'PENDING'}`);
    return newStaging;
  },

  // Toggle custom parameters in intake staging to satisfy validation rules
  validateChecklist: async (id: string, isChecklistPassed: boolean): Promise<ListingNew | null> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('listings_new')
          .update({ is_checklist_passed: isChecklistPassed })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) return data as ListingNew;
      } catch (err) {
        console.error('Supabase update checklist status failed:', err);
      }
    }

    const current = getLocal<ListingNew[]>('listings_new', []);
    const idx = current.findIndex(l => l.id === id);
    if (idx !== -1) {
      current[idx].is_checklist_passed = isChecklistPassed;
      setLocal('listings_new', current);
      return current[idx];
    }
    return null;
  },

  // Verify and promote listing (Moves from LISTING_NEW to MASTER)
  verifyAndPromoteListing: async (id: string): Promise<MasterListing | null> => {
    const user = dbService.getCurrentUser();
    
    // RBAC validation: Only Melissa (listing_melissa) or Admin can promote
    if (user.role !== 'listing_melissa' && user.role !== 'admin') {
      dbService.logAction('SECURITY_ALERT', `Unauthorized attempt by ${user.name} to verify and promote listing ID ${id}. Denied.`);
      throw new Error('Access denied: Only Listing Verification Team (Melissa) or Admins can promote staging properties.');
    }

    // Retrieve staging listing
    const stagingListings = getLocal<ListingNew[]>('listings_new', []);
    const staging = stagingListings.find(l => l.id === id);
    
    if (!staging) throw new Error('Staging listing not found.');

    // Checklist constraint validation
    if (!staging.is_checklist_passed) {
      throw new Error('Checklist validation failed: Mandatory data documents (photos, contacts, title) are incomplete.');
    }

    // Create Master Listing
    const newMaster: MasterListing = {
      id: `mst-${Math.random().toString(36).substr(2, 9)}`,
      property_id: staging.property_id,
      title: staging.title,
      address: staging.address,
      price: staging.price_requested,
      status: 'active',
      photos: staging.photos,
      salesperson_id: staging.salesperson_id,
      salesperson_name: staging.salesperson_name,
      verified_by: user.name,
      owner_name: staging.owner_name || '',
      owner_contact: staging.owner_contact || '',
      // spreadsheet fields
      raw_wa_template: staging.raw_wa_template || '',
      market_rating: staging.market_rating || '',
      sale_rent: staging.sale_rent || 'sale',
      state: staging.state || '',
      property_type: staging.property_type || '',
      rooms_remarks: staging.rooms_remarks || '',
      unit_no: staging.unit_no || '',
      size: staging.size || '',
      gdrive_link: staging.gdrive_link || '',
      final_wa_template: staging.final_wa_template || '',
      private_notes: staging.private_notes || '',
      created_at: new Date().toISOString()
    };

    // Promote in database
    if (isSupabaseConfigured) {
      try {
        // Start promotion transactions on Supabase
        await supabase!.from('master_listings').insert([newMaster]);
        await supabase!.from('listings_new').update({ verification_status: 'promoted' }).eq('id', id);
        
        // Seed default blank values into advertising, coa, and resolving tables
        await supabase!.from('advertising').insert([{ property_id: staging.property_id, title: staging.title }]);
        await supabase!.from('matching_coa').insert([{ property_id: staging.property_id }]);
        await supabase!.from('resolving_sales').insert([{ property_id: staging.property_id, salesperson_id: staging.salesperson_id, salesperson_name: staging.salesperson_name }]);
      } catch (err) {
        console.error('Supabase promotion transaction failed:', err);
      }
    }

    // Local Storage logic
    // Add to Master list
    const currentMasters = getLocal<MasterListing[]>('master_listings', []);
    currentMasters.push(newMaster);
    setLocal('master_listings', currentMasters);

    // Update Staging status
    const updatedStaging = stagingListings.map(l => l.id === id ? { ...l, verification_status: 'promoted' as const } : l);
    setLocal('listings_new', updatedStaging);

    // Automatically seed other parallel operational databases for this Property ID
    // Seed Advertising status
    const currentAds = getLocal<Advertising[]>('advertising', []);
    currentAds.push({
      id: `adv-${Math.random().toString(36).substr(2, 9)}`,
      property_id: staging.property_id,
      title: staging.title,
      selected_by_sales: false,
      status: 'pending',
      iproperty_link: '',
      propertyguru_link: '',
      updated_at: new Date().toISOString()
    });
    setLocal('advertising', currentAds);

    // Seed Co-Agency
    const currentCoa = getLocal<MatchingCoa[]>('matching_coa', []);
    currentCoa.push({
      id: `coa-${Math.random().toString(36).substr(2, 9)}`,
      property_id: staging.property_id,
      external_agent_name: '',
      external_agent_contact: '',
      commission_split: '',
      remarks: '',
      updated_at: new Date().toISOString()
    });
    setLocal('matching_coa', currentCoa);

    // Seed Resolving Stage
    const currentResolving = getLocal<ResolvingSale[]>('resolving_sales', []);
    currentResolving.push({
      id: `rsl-${Math.random().toString(36).substr(2, 9)}`,
      property_id: staging.property_id,
      deal_stage: 'booking',
      buyer_name: '',
      buyer_contact: '',
      legal_status: 'pending_documentation',
      banking_status: 'pending_approval',
      salesperson_id: staging.salesperson_id,
      salesperson_name: staging.salesperson_name,
      total_commission: 0,
      company_share: 0,
      agent_share: 0,
      closed_at: new Date().toISOString()
    });
    setLocal('resolving_sales', currentResolving);

    dbService.logAction('VERIFICATION_PROMOTE', `Verified and promoted staging ID ${id} to MASTER database under Property ID ${staging.property_id}.`);
    return newMaster;
  },

  // 2. MASTER DATABASE ACCESS (MASTER)
  getMasterListings: async (): Promise<MasterListing[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('master_listings').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as MasterListing[];
      } catch (err) {
        console.error('Supabase getMasterListings failed:', err);
      }
    }
    return getLocal<MasterListing[]>('master_listings', []);
  },

  updateMasterListing: async (propertyId: string, price: number, status: 'active' | 'sold' | 'rented' | 'inactive'): Promise<MasterListing | null> => {
    const user = dbService.getCurrentUser();
    
    // RBAC: Only Melissa (listing_melissa) or Admin can update Master prices and status
    if (user.role !== 'listing_melissa' && user.role !== 'admin') {
      dbService.logAction('SECURITY_ALERT', `Unauthorized attempt by ${user.name} to modify master listing ${propertyId}. Denied.`);
      throw new Error('Access denied: Only Listing verification team (Melissa) or Admins can edit Master parameters.');
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('master_listings')
          .update({ price, status })
          .eq('property_id', propertyId)
          .select()
          .single();
        if (!error && data) {
          dbService.logAction('MASTER_EDIT', `Updated master listing ${propertyId}: price set to ${price}, status set to ${status.toUpperCase()}.`);
          return data as MasterListing;
        }
      } catch (err) {
        console.error('Supabase updateMasterListing failed:', err);
      }
    }

    const current = getLocal<MasterListing[]>('master_listings', []);
    const idx = current.findIndex(m => m.property_id === propertyId);
    if (idx !== -1) {
      current[idx].price = price;
      current[idx].status = status;
      setLocal('master_listings', current);
      dbService.logAction('MASTER_EDIT', `Updated master listing ${propertyId}: price set to ${price}, status set to ${status.toUpperCase()}.`);
      return current[idx];
    }
    return null;
  },

  // 3. REMARKS/FOLLOW-UP TRACK (LISTING_UPDATE)
  getListingUpdates: async (propertyId: string): Promise<ListingUpdate[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('listing_updates')
          .select('*')
          .eq('property_id', propertyId)
          .order('updated_at', { ascending: false });
        if (!error && data) return data as ListingUpdate[];
      } catch (err) {
        console.error('Supabase getListingUpdates failed:', err);
      }
    }
    
    const logs = getLocal<ListingUpdate[]>('listing_updates', []);
    return logs.filter(l => l.property_id === propertyId).sort((a,b) => b.updated_at.localeCompare(a.updated_at));
  },

  getAllListingUpdates: async (): Promise<ListingUpdate[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('listing_updates')
          .select('*')
          .order('updated_at', { ascending: false });
        if (!error && data) return data as ListingUpdate[];
      } catch (err) {
        console.error('Supabase getAllListingUpdates failed:', err);
      }
    }
    return getLocal<ListingUpdate[]>('listing_updates', []);
  },

  createListingUpdate: async (propertyId: string, remarks: string): Promise<ListingUpdate> => {
    const user = dbService.getCurrentUser();
    const newUpdate: ListingUpdate = {
      id: `upd-${Math.random().toString(36).substr(2, 9)}`,
      property_id: propertyId,
      remarks,
      updated_by: user.id,
      updated_by_name: user.name,
      updated_at: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('listing_updates')
          .insert([newUpdate])
          .select()
          .single();
        if (!error && data) {
          dbService.logAction('LISTING_UPDATE', `Logged follow-up remark on property ${propertyId}: "${remarks}".`);
          return data as ListingUpdate;
        }
      } catch (err) {
        console.error('Supabase createListingUpdate failed:', err);
      }
    }

    const current = getLocal<ListingUpdate[]>('listing_updates', []);
    current.push(newUpdate);
    setLocal('listing_updates', current);
    
    dbService.logAction('LISTING_UPDATE', `Logged follow-up remark on property ${propertyId}: "${remarks}".`);
    return newUpdate;
  },

  // 4. MARKETING TRACK (ADVERTISING)
  getAdvertisingListings: async (): Promise<Advertising[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('advertising').select('*');
        if (!error && data) return data as Advertising[];
      } catch (err) {
        console.error('Supabase getAdvertisingListings failed:', err);
      }
    }
    return getLocal<Advertising[]>('advertising', []);
  },

  updateAdvertisingSelection: async (propertyId: string, selectedBySales: boolean): Promise<Advertising | null> => {
    // Open to all Sales agents
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('advertising')
          .update({ selected_by_sales: selectedBySales })
          .eq('property_id', propertyId)
          .select()
          .single();
        if (!error && data) return data as Advertising;
      } catch (err) {
        console.error('Supabase updateAdvertisingSelection failed:', err);
      }
    }

    const current = getLocal<Advertising[]>('advertising', []);
    const idx = current.findIndex(a => a.property_id === propertyId);
    if (idx !== -1) {
      current[idx].selected_by_sales = selectedBySales;
      setLocal('advertising', current);
      dbService.logAction('ADVERTISING_FLAG', `Sales flagged property ${propertyId} for marketing tracks.`);
      return current[idx];
    }
    return null;
  },

  updateAdvertisingLinks: async (propertyId: string, status: 'pending' | 'published', iproperty: string, propertyguru: string): Promise<Advertising | null> => {
    const user = dbService.getCurrentUser();
    
    // RBAC: Only Intan (listing_intan) or Admin can write marketing links
    if (user.role !== 'listing_intan' && user.role !== 'admin') {
      dbService.logAction('SECURITY_ALERT', `Unauthorized attempt by ${user.name} to write advertising links on ${propertyId}. Denied.`);
      throw new Error('Access denied: Only Advertising Team (Intan) or Admins can modify external links.');
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('advertising')
          .update({ status, iproperty_link: iproperty, propertyguru_link: propertyguru, updated_at: new Date().toISOString() })
          .eq('property_id', propertyId)
          .select()
          .single();
        if (!error && data) {
          dbService.logAction('ADVERTISING_PUBLISH', `Advertising team published external links for property ${propertyId}.`);
          return data as Advertising;
        }
      } catch (err) {
        console.error('Supabase updateAdvertisingLinks failed:', err);
      }
    }

    const current = getLocal<Advertising[]>('advertising', []);
    const idx = current.findIndex(a => a.property_id === propertyId);
    if (idx !== -1) {
      current[idx].status = status;
      current[idx].iproperty_link = iproperty;
      current[idx].propertyguru_link = propertyguru;
      current[idx].updated_at = new Date().toISOString();
      setLocal('advertising', current);
      dbService.logAction('ADVERTISING_PUBLISH', `Advertising team published external links for property ${propertyId}.`);
      return current[idx];
    }
    return null;
  },

  // 5. CO-AGENCY TRACK (MATCHING_COA)
  getMatchingCoaListings: async (): Promise<MatchingCoa[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('matching_coa').select('*');
        if (!error && data) return data as MatchingCoa[];
      } catch (err) {
        console.error('Supabase getMatchingCoaListings failed:', err);
      }
    }
    return getLocal<MatchingCoa[]>('matching_coa', []);
  },

  updateMatchingCoa: async (propertyId: string, agentName: string, agentContact: string, split: string, remarks: string): Promise<MatchingCoa | null> => {
    const user = dbService.getCurrentUser();
    
    // RBAC: Only Co-Agency Team (Jacqueen/Boonsiong) or Admin can update COA sheets
    if (user.role !== 'coagency' && user.role !== 'admin') {
      dbService.logAction('SECURITY_ALERT', `Unauthorized attempt by ${user.name} to modify co-agency records on ${propertyId}. Denied.`);
      throw new Error('Access denied: Only Co-Agency team (Jacqueen/Boonsiong) or Admins can edit co-agency collaborations.');
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('matching_coa')
          .update({ external_agent_name: agentName, external_agent_contact: agentContact, commission_split: split, remarks, updated_at: new Date().toISOString() })
          .eq('property_id', propertyId)
          .select()
          .single();
        if (!error && data) {
          dbService.logAction('COA_EDIT', `Updated co-agency settings for property ${propertyId} (Agent: ${agentName}).`);
          return data as MatchingCoa;
        }
      } catch (err) {
        console.error('Supabase updateMatchingCoa failed:', err);
      }
    }

    const current = getLocal<MatchingCoa[]>('matching_coa', []);
    const idx = current.findIndex(c => c.property_id === propertyId);
    if (idx !== -1) {
      current[idx].external_agent_name = agentName;
      current[idx].external_agent_contact = agentContact;
      current[idx].commission_split = split;
      current[idx].remarks = remarks;
      current[idx].updated_at = new Date().toISOString();
      setLocal('matching_coa', current);
      dbService.logAction('COA_EDIT', `Updated co-agency settings for property ${propertyId} (Agent: ${agentName}).`);
      return current[idx];
    }
    return null;
  },

  // 6. DEALS & RESOLVING (RESOLVING & SALES COMM DASHBOARD)
  getResolvingSales: async (): Promise<ResolvingSale[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.from('resolving_sales').select('*').order('closed_at', { ascending: false });
        if (!error && data) return data as ResolvingSale[];
      } catch (err) {
        console.error('Supabase getResolvingSales failed:', err);
      }
    }
    return getLocal<ResolvingSale[]>('resolving_sales', []);
  },

  updateResolvingSale: async (
    propertyId: string, 
    dealStage: 'booking' | 'spa_signed' | 'loan_approved' | 'closed_sold' | 'closed_rented',
    buyerName: string,
    buyerContact: string,
    legalStatus: string,
    bankingStatus: string,
    totalComm: number,
    companyShare: number,
    agentShare: number
  ): Promise<ResolvingSale | null> => {
    const user = dbService.getCurrentUser();
    
    // RBAC: Only Admin/Management can resolve deals and view/edit commissions
    if (user.role !== 'admin') {
      dbService.logAction('SECURITY_ALERT', `Unauthorized attempt by ${user.name} to resolve deal transaction on ${propertyId}. Denied.`);
      throw new Error('Access denied: Only Administration / Management have write access to resolving transactions.');
    }

    // Perform promotion-saving sync transaction
    if (isSupabaseConfigured) {
      try {
        // Update resolving
        await supabase!.from('resolving_sales')
          .update({ deal_stage: dealStage, buyer_name: buyerName, buyer_contact: buyerContact, legal_status: legalStatus, banking_status: bankingStatus, total_commission: totalComm, company_share: companyShare, agent_share: agentShare, closed_at: new Date().toISOString() })
          .eq('property_id', propertyId);
        
        // Auto-synchronization trigger: if stage changes to sold/rented, listing must change to inactive in MASTER
        if (dealStage === 'closed_sold' || dealStage === 'closed_rented') {
          await supabase!.from('master_listings').update({ status: 'inactive' }).eq('property_id', propertyId);
          dbService.logAction('AUTO_SYNC', `Deal resolved. System auto-sync set Property ID ${propertyId} to INACTIVE in MASTER listing ledger.`);
        }
      } catch (err) {
        console.error('Supabase updateResolvingSale transactions failed:', err);
      }
    }

    const current = getLocal<ResolvingSale[]>('resolving_sales', []);
    const idx = current.findIndex(r => r.property_id === propertyId);
    if (idx !== -1) {
      current[idx].deal_stage = dealStage;
      current[idx].buyer_name = buyerName;
      current[idx].buyer_contact = buyerContact;
      current[idx].legal_status = legalStatus;
      current[idx].banking_status = bankingStatus;
      current[idx].total_commission = totalComm;
      current[idx].company_share = companyShare;
      current[idx].agent_share = agentShare;
      current[idx].closed_at = new Date().toISOString();
      setLocal('resolving_sales', current);

      dbService.logAction('DEAL_EDIT', `Transaction details updated for property ${propertyId}. Deal stage: ${dealStage.toUpperCase()}.`);

      // TRIGGER SYNC LOGIC
      if (dealStage === 'closed_sold' || dealStage === 'closed_rented') {
        const masters = getLocal<MasterListing[]>('master_listings', []);
        const mIdx = masters.findIndex(m => m.property_id === propertyId);
        if (mIdx !== -1) {
          masters[mIdx].status = 'inactive';
          setLocal('master_listings', masters);
          dbService.logAction('AUTO_SYNC', `Sync Active: Deal resolved as ${dealStage.toUpperCase()} on property ${propertyId}. Master listing status updated to INACTIVE.`);
        }
      }
      
      return current[idx];
    }
    return null;
  },

  bulkInsertStagingListings: async (
    listings: Omit<ListingNew, 'id' | 'created_at'>[]
  ): Promise<ListingNew[]> => {
    const user = dbService.getCurrentUser();
    const created: ListingNew[] = listings.map(l => ({
      ...l,
      id: `stg-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    }));

    if (isSupabaseConfigured) {
      try {
        await supabase!.from('listings_new').insert(created);
      } catch (err) {
        console.error('Supabase bulkInsertStagingListings failed:', err);
      }
    }

    const currentStaging = getLocal<ListingNew[]>('listings_new', []);
    currentStaging.push(...created);
    setLocal('listings_new', currentStaging);

    dbService.logAction(
      'BULK_IMPORT',
      `Imported ${created.length} listings to Staging Intake database by ${user.name}.`
    );

    return created;
  },

  bulkInsertMasterListings: async (
    listings: Omit<MasterListing, 'id' | 'created_at'>[]
  ): Promise<MasterListing[]> => {
    const user = dbService.getCurrentUser();

    // RBAC Check
    if (user.role !== 'listing_melissa' && user.role !== 'admin') {
      dbService.logAction('SECURITY_ALERT', `Unauthorized attempt by ${user.name} to bulk import directly to Master Ledger. Denied.`);
      throw new Error('Access denied: Only Listing Master Team (Melissa) or Admins can bulk import directly to Master Ledger.');
    }

    const created: MasterListing[] = listings.map(l => ({
      ...l,
      id: `mst-${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString()
    }));

    if (isSupabaseConfigured) {
      try {
        await supabase!.from('master_listings').insert(created);
        
        // Also auto-seed advertising, coa, and resolving tables for all imported master properties
        const ads = created.map(l => ({ property_id: l.property_id, title: l.title }));
        const coa = created.map(l => ({ property_id: l.property_id }));
        const resolving = created.map(l => ({ 
          property_id: l.property_id, 
          salesperson_id: l.salesperson_id, 
          salesperson_name: l.salesperson_name 
        }));

        await supabase!.from('advertising').insert(ads);
        await supabase!.from('matching_coa').insert(coa);
        await supabase!.from('resolving_sales').insert(resolving);
      } catch (err) {
        console.error('Supabase bulkInsertMasterListings failed:', err);
      }
    }

    // Local Storage logic
    const currentMasters = getLocal<MasterListing[]>('master_listings', []);
    currentMasters.push(...created);
    setLocal('master_listings', currentMasters);

    // Seed others locally
    const currentAds = getLocal<Advertising[]>('advertising', []);
    const currentCoa = getLocal<MatchingCoa[]>('matching_coa', []);
    const currentResolving = getLocal<ResolvingSale[]>('resolving_sales', []);

    created.forEach(l => {
      currentAds.push({
        id: `adv-${Math.random().toString(36).substr(2, 9)}`,
        property_id: l.property_id,
        title: l.title,
        selected_by_sales: false,
        status: 'pending',
        iproperty_link: '',
        propertyguru_link: '',
        updated_at: new Date().toISOString()
      });

      currentCoa.push({
        id: `coa-${Math.random().toString(36).substr(2, 9)}`,
        property_id: l.property_id,
        external_agent_name: '',
        external_agent_contact: '',
        commission_split: '',
        remarks: '',
        updated_at: new Date().toISOString()
      });

      currentResolving.push({
        id: `rsl-${Math.random().toString(36).substr(2, 9)}`,
        property_id: l.property_id,
        deal_stage: 'booking',
        buyer_name: '',
        buyer_contact: '',
        legal_status: 'pending_documentation',
        banking_status: 'pending_approval',
        salesperson_id: l.salesperson_id,
        salesperson_name: l.salesperson_name,
        total_commission: 0,
        company_share: 0,
        agent_share: 0,
        closed_at: new Date().toISOString()
      });
    });

    setLocal('advertising', currentAds);
    setLocal('matching_coa', currentCoa);
    setLocal('resolving_sales', currentResolving);

    dbService.logAction(
      'BULK_IMPORT',
      `Imported ${created.length} listings directly to MASTER ledger by ${user.name}. Auto-seeded operational tracks.`
    );

    return created;
  },

  registerPortalAccount: async (
    name: string,
    email: string,
    passwordHash: string,
    role: 'listing_melissa' | 'listing_intan' | 'coagency' | 'sales' | 'admin'
  ): Promise<PortalAccount> => {
    const newAccount: PortalAccount = {
      id: `usr-reg-${Math.random().toString(36).substr(2, 9)}`,
      email,
      password: passwordHash,
      name,
      role,
      status: 'pending_approval',
      createdAt: new Date().toISOString()
    };

    const currentAccounts = getLocal<PortalAccount[]>('portal_accounts', []);
    if (currentAccounts.some(a => a.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email address already exists.');
    }

    if (isSupabaseConfigured) {
      try {
        await supabase!.from('portal_accounts').insert([{
          id: newAccount.id,
          email: newAccount.email,
          password: newAccount.password,
          name: newAccount.name,
          role: newAccount.role,
          status: newAccount.status,
          created_at: newAccount.createdAt
        }]);
      } catch (err) {
        console.error('Supabase registerPortalAccount failed:', err);
      }
    }

    currentAccounts.push(newAccount);
    setLocal('portal_accounts', currentAccounts);

    dbService.logAction('REGISTRATION_REQUEST', `User ${name} [${email}] requested access as ${role.toUpperCase()}. Status: PENDING.`);
    return newAccount;
  },

  getPendingPortalAccounts: async (): Promise<PortalAccount[]> => {
    const user = dbService.getCurrentUser();
    if (user.role !== 'admin') {
      throw new Error('Access denied: Vetting queue is restricted to Administrators.');
    }

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('portal_accounts')
          .select('*')
          .eq('status', 'pending_approval')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map((d: any) => ({
            id: d.id,
            email: d.email,
            name: d.name,
            role: d.role,
            status: d.status,
            createdAt: d.created_at
          }));
        }
      } catch (err) {
        console.error('Supabase getPendingPortalAccounts failed:', err);
      }
    }

    const currentAccounts = getLocal<PortalAccount[]>('portal_accounts', []);
    return currentAccounts.filter(a => a.status === 'pending_approval');
  },

  updatePortalAccountStatus: async (
    id: string,
    status: 'approved' | 'rejected',
    role?: 'listing_melissa' | 'listing_intan' | 'coagency' | 'sales' | 'admin'
  ): Promise<PortalAccount | null> => {
    const user = dbService.getCurrentUser();
    if (user.role !== 'admin') {
      throw new Error('Access denied: Admin approvals required.');
    }

    if (isSupabaseConfigured) {
      try {
        const updateData: Record<string, any> = { status };
        if (role) updateData.role = role;
        
        await supabase!.from('portal_accounts')
          .update(updateData)
          .eq('id', id);
      } catch (err) {
        console.error('Supabase updatePortalAccountStatus failed:', err);
      }
    }

    const currentAccounts = getLocal<PortalAccount[]>('portal_accounts', []);
    const idx = currentAccounts.findIndex(a => a.id === id);
    if (idx !== -1) {
      currentAccounts[idx].status = status;
      if (role) currentAccounts[idx].role = role;
      setLocal('portal_accounts', currentAccounts);

      const targetAcc = currentAccounts[idx];
      dbService.logAction(
        status === 'approved' ? 'ACCOUNT_APPROVED' : 'ACCOUNT_REJECTED',
        `Account ${targetAcc.email} was ${status.toUpperCase()} as ${targetAcc.role.toUpperCase()} by ${user.name}.`
      );
      return targetAcc;
    }
    return null;
  },

  authenticatePortalAccount: async (
    email: string,
    passwordHash: string
  ): Promise<PortalAccount | null> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('portal_accounts')
          .select('*')
          .eq('email', email)
          .eq('password', passwordHash)
          .maybeSingle();
        if (!error && data) {
          return {
            id: data.id,
            email: data.email,
            name: data.name,
            role: data.role,
            status: data.status,
            createdAt: data.created_at
          } as PortalAccount;
        }
      } catch (err) {
        console.error('Supabase authenticatePortalAccount failed:', err);
      }
    }

    const currentAccounts = getLocal<PortalAccount[]>('portal_accounts', []);
    const found = currentAccounts.find(
      a => a.email.toLowerCase() === email.toLowerCase() && a.password === passwordHash
    );
    return found || null;
  }
};
