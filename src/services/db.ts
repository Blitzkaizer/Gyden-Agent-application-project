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
  if (!localStorage.getItem('gyden2_initialized_v4')) {
    // 1. Listings Staging (LISTING_NEW) - Starts empty
    setLocal('listings_new', []);

    // 2. Master listings (MASTER) - SA001 to SA030 from Excel
    setLocal('master_listings', [
{
        id: 'mst-sa001',
        property_id: `SA001`,
        title: `PRIMA REGENCY`,
        address: `PRIMA REGENCY`,
        price: 268000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-intan`,
        salesperson_name: `Mindy`,
        verified_by: 'usr-melissa',
        owner_name: `R029`,
        owner_contact: ``,
        raw_wa_template: `For Sales SA001
Prima Regency
Google Map: https://maps.app.goo.gl/bG7MhFZRNHqK3yiq6
Property Type: Service Apartment
Selling Price: RM268,000
Bank Value: RMTBC
Build Up Area: 565sqft
Sub-Sales
Freehold
International Lot
Strata Title
Tenanted
Rental Income: RM1100
Tenancy Expired: TBC
Apartment Listing
Studio 1 Bathroom
Floor: Low
Pool View
Fully Furnished
1 Carparks
Maintenance Fee: RM187.08+

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1PTjSwcaEpnQzLDkBRwwzrmQQ_-6A1cqj
Can direct forward this message to customer`,
        market_rating: `G - NOT AVAILABLE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `STUDIO`,
        unit_no: `BLK 5 12-03`,
        size: `565SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1PTjSwcaEpnQzLDkBRwwzrmQQ_-6A1cqj`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa002',
        property_id: `SA002`,
        title: `KSL DAYA RESIDENCES`,
        address: `KSL DAYA RESIDENCES`,
        price: 421000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `ZHANG SHUQI`,
        owner_contact: `+62 813-6475-4887`,
        raw_wa_template: `For Sales SA002
KSL Daya Residences
Google Map: https://maps.app.goo.gl/6o6HfvCKM6mCghEDA
Property Type: Service Apartment
Selling Price: RM421,000
Bank Value: RM540,000
Build Up Area: 1097SQFT

Sub-Sales
Freehold
International Lot
Master Title
Vacant

Apartment Listing
3 Bedroom 3 Bathroom
Floor: High
City View
Fully Furnished
1 Carparks
Maintenance Fee: RM TBC
Remark
1.The owner has two units: one in Block A and one in Block C.
2.This unit is in Block A.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/15P8DaCU5giZ5DjtLRFZBZhbzUzRUlw1i
Can direct forward this message to customer`,
        market_rating: `G - NOT AVAILABLE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `3ROOM`,
        unit_no: `A 22-10`,
        size: `1097SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/15P8DaCU5giZ5DjtLRFZBZhbzUzRUlw1i`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa003',
        property_id: `SA003`,
        title: `MEDINI SIGNATURE`,
        address: `MEDINI SIGNATURE`,
        price: 950000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-intan`,
        salesperson_name: `Mindy`,
        verified_by: 'usr-melissa',
        owner_name: `L374`,
        owner_contact: ``,
        raw_wa_template: `For Sales SA003
Medini Signature
Google maps: https://maps.app.goo.gl/sHMkNQofh2vWJ1L28?g_st=ipc
Property Type: Service Apartment
Selling Price: RM 950,000
Bank Value: RM 950,000
Build Up Area: 1600sqft
Sub-Sales
Private lease
International Lot
Strata Title
Vacant
Apartment Listing
3+1 Bedroom 5 Bathroom
Floor: high
City View
Partial Furnished
Free parking
Maintenance Fee: RM528/month

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1yhs3wWgtVxcDX70c54Zi7fXGfefMAmeO
Can direct forward this message to customer`,
        market_rating: `D - UNKNOWN MARKET`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `3ROOM, +1ROOM`,
        unit_no: `T1-25-W1`,
        size: `1600SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1yhs3wWgtVxcDX70c54Zi7fXGfefMAmeO`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa004',
        property_id: `SA004`,
        title: `SOUTHERN MARINA`,
        address: `SOUTHERN MARINA`,
        price: 899000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-intan`,
        salesperson_name: `Mindy`,
        verified_by: 'usr-melissa',
        owner_name: `L363`,
        owner_contact: `017-7945668`,
        raw_wa_template: `For Sales SA004
Southern Marina
Google Map: https://maps.app.goo.gl/36TeMrgjH7fKbdLs5
Property Type: Service Apartment
Selling Price: RM899,000
Bank Value: RMTBC
Build Up Area: 840sqft
Sub-Sales
Freehold
International Lot
Strata Title
Vacant
Apartment Listing
1+1 Bedroom 1 Bathroom
Floor: High
City View
Fully Furnished
1 Carparks
Maintenance Fee: RMTBC

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1gQHq0L5kYGDTeCSPW3h-GTEpuDBIehbb
Can direct forward this message to customer`,
        market_rating: `D - UNKNOWN MARKET`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `1ROOM, +1ROOM`,
        unit_no: `18-XX`,
        size: `840SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1gQHq0L5kYGDTeCSPW3h-GTEpuDBIehbb`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa005',
        property_id: `SA005`,
        title: `TEBRAU CITY RESIDENCES, JALAN HARMONIUM 24/2`,
        address: `TEBRAU CITY RESIDENCES, JALAN HARMONIUM 24/2`,
        price: 498000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `CAVEN`,
        owner_contact: `127999288.0`,
        raw_wa_template: `For Sales SA005
Tebrau City Residences
Google Map: https://maps.app.goo.gl/KcafTHJmD2FRVXqE8
Property Type: Apartment
Selling Price: RM 498,000
Bank Value: RM550K
Build Up Area: 1404 SQFT
Sub-Sales
Freehold
International
Strata Title
Tenanted
Rental Income: RM1300
Tenancy Expired: Tenancy Expired
Apartment Listing
3+1 Bedroom 2 Bathroom
Floor: Low
unblock View
Fully Furnished
1 Carparks
Maintenance Fee: TBC

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1fn7YHDctRGjhMTS7kWIf3qjU0Ygo2TOz
Can direct forward this message to customer`,
        market_rating: `A - BELOW MARKET`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `3ROOM, +1ROOM`,
        unit_no: `E 05-21`,
        size: `1404SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1fn7YHDctRGjhMTS7kWIf3qjU0Ygo2TOz`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa006',
        property_id: `SA006`,
        title: `SAKURA RESIDENCE`,
        address: `SAKURA RESIDENCE`,
        price: 2900000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-jacqueen`,
        salesperson_name: `Jacqueen`,
        verified_by: 'usr-melissa',
        owner_name: `NATHAN TAN`,
        owner_contact: `+659386 9142`,
        raw_wa_template: `For Sales SA006
Sakura Residence
Google Map: https://maps.app.goo.gl/4a1u826RvFsemCf19
Property Type:  2 storey Semi D
Selling Price: RM 2,9mil
Bank Value: TBC
Build Up Area: 3,284 sq ft
Land Size & Area: 2,925 sq ft (39 ft x 75 ft)
Sub-Sales
Leasehold (Convertible to freehold)
International
Non Bumi Lot
Strata Title
Vacant
House Listing
5+1 Bedroom 5 Bathroom
Partial Furnished
Renovated Unit
Gated & Guarded: Yes
Maintenance Fee & Sinking Fund: RM 466.07

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1n2ArMQqAF5G_SrVb0j91MYNsv-z7cI7u
Can direct forward this message to customer`,
        market_rating: `B - AT MARKET PRICE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- SEMI-DETACHED HOUSE`,
        rooms_remarks: `2STOREY `,
        unit_no: `54`,
        size: `39X75SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1n2ArMQqAF5G_SrVb0j91MYNsv-z7cI7u`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa007',
        property_id: `SA007`,
        title: `JALAN GLASIAR, TAMAN TASEK `,
        address: `JALAN GLASIAR, TAMAN TASEK `,
        price: 1610000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Sarah Connor (Sales Team)`,
        verified_by: 'usr-melissa',
        owner_name: `SAM CHAN`,
        owner_contact: `132007755.0`,
        raw_wa_template: `For Sales SA007
Jalan Glasiar, Taman Tasek
Google Map: https://maps.app.goo.gl/dT8V7PNVWuSRBDyA8
Property Type: 2 Storey Shop Lot
Selling Price: RM 1,61 Mil
Bank Value:  TBC
Build Up Area: 3080SQFT
Land Size & Area: 22x70
Sub-Sales
Freehold
Non Bumi Lot
Individual title
Tenanted
Rental Income: RM 6,300
Tenancy Expired: June 2027
Shoplot Listing
Main Road

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1woc-JcvK47XhrkMyu6qgoMJ3VN-rnzlu
Can direct forward this message to customer`,
        market_rating: `C - OVERPRICED`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `C- SHOPLOT / RETAIL`,
        rooms_remarks: `2STOREY, SHOPLOT, MAIN ROAD`,
        unit_no: `175`,
        size: `3080SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1woc-JcvK47XhrkMyu6qgoMJ3VN-rnzlu`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa008',
        property_id: `SA008`,
        title: `COUNTRY GARDEN DANGA BAY@AMBERSIDE`,
        address: `COUNTRY GARDEN DANGA BAY@AMBERSIDE`,
        price: 498000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `JACKSON`,
        owner_contact: `+60 14-386 5939`,
        raw_wa_template: `For Sales SA008
Country Garden Danga Bay@Amberside
Google Map: https://maps.app.goo.gl/a9Qo9b9USqttUjrM7
Property Type: Service Apartment
Selling Price: RM498,000
Bank Value: RMTBC
Build Up Area: 840sqft
Sub-Sales
Freehold
International Lot
Strata Title
Vacant
Apartment Listing
2 Bedroom 2 Bathroom
Floor: Low
City View
Fully Furnished
1 Carparks
Maintenance Fee: RMTBC
Remark
1.Cannot Do Advertisement at iProperty & PropertyGuru & Facebook, Developer Will Complaint.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1sXgtgZuStRst9V4sxNwRvCNkYjZtEgT0
Can direct forward this message to customer`,
        market_rating: `G - NOT AVAILABLE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `2ROOM`,
        unit_no: `8A 05-05`,
        size: `840SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1sXgtgZuStRst9V4sxNwRvCNkYjZtEgT0`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa009',
        property_id: `SA009`,
        title: `COUNTRY GARDEN DANGA BAY@BAY POINT`,
        address: `COUNTRY GARDEN DANGA BAY@BAY POINT`,
        price: 498000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `JACKSON`,
        owner_contact: `+60 14-386 5939`,
        raw_wa_template: `For Sales SA009
Country Garden Danga Bay@Bay Point
Google Map: https://maps.app.goo.gl/fydzEvCpCPTAhbDEA
Property Type: Service Apartment
Selling Price: RM498,000
Bank Value: RMTBC
Build Up Area: 800sqft
Sub-Sales
Freehold
International Lot
Strata Title
Vacant
Apartment Listing
2 Bedroom 2 Bathroom
Floor: Low
Residence View
Fully Furnished
1 Carparks
Maintenance Fee: RMTBC
Remark
1.Cannot Do Advertisement at iProperty & PropertyGuru & Facebook, Developer Will Complaint.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1SA094NjJq9jG8Ko1tSeT3Bymu7g4hnxI
Can direct forward this message to customer`,
        market_rating: `A+ SUPER HOT DEAL`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `2ROOM`,
        unit_no: `4A 17-03`,
        size: `800SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1SA094NjJq9jG8Ko1tSeT3Bymu7g4hnxI`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa010',
        property_id: `SA010`,
        title: `COUNTRY GARDEN DANGA BAY@BAY POINT`,
        address: `COUNTRY GARDEN DANGA BAY@BAY POINT`,
        price: 490000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `JACKSON`,
        owner_contact: `+60 14-386 5939`,
        raw_wa_template: `For Sales SA010
Country Garden Danga Bay@Bay Point
Google Map: https://maps.app.goo.gl/fRQamF8vgHqeYwrk6
Property Type: Service Apartment
Selling Price: RM500k
Bank Value: RMTBC
Build Up Area: 893sqft
Sub-Sales
Freehold
International Lot
Strata Title
Vacant
Apartment Listing
2 Bedroom 2 Bathroom
Floor: High
Residential View
Fully Furnished
1 Carparks
Maintenance Fee: RMTBC
Remark
1.Call full loan or cash buy
2.Cannot Do Advertisement at iProperty & PropertyGuru & Facebook, Developer Will Complaint.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1rUXhJefaIQdyK9ZoCNW6ra3IGAayAbPT
Can direct forward this message to customer`,
        market_rating: `G - CASE COMPLETED`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `2ROOM`,
        unit_no: `5A 20-01`,
        size: `893SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1rUXhJefaIQdyK9ZoCNW6ra3IGAayAbPT`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa011',
        property_id: `SA011`,
        title: `JALAN KEPAYANG, TAMAN KOTA JAYA`,
        address: `JALAN KEPAYANG, TAMAN KOTA JAYA`,
        price: 448000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `WILSON LEE`,
        owner_contact: `177553933.0`,
        raw_wa_template: `For Sales SA011
Jalan Kepayang, Taman Kota Jaya
Google Map: https://maps.app.goo.gl/oyfaGVhwynU7sYQXA
Property Type: 1 Storey Terrace House
Selling Price: RM448,000
Bank Value: RMTBC
Build Up Area: 1600++sqft
Land Size & Area: 2615sqft
Sub-Sales
Freehold
International Lot
Individual Title
Vacant
House Listing
3+1 Bedroom 2 Bathroom
Partial Furnished
Original
South West Direction
Gated & Guarded: No
Remark
1.Can park more than 5 cars

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1vySfurTXC19YULe_SEhrCIxDvKLzkvOG
Can direct forward this message to customer`,
        market_rating: `B - AT MARKET PRICE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- TERRACE HOUSE`,
        rooms_remarks: `1STOREY `,
        unit_no: `104`,
        size: `1600SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1vySfurTXC19YULe_SEhrCIxDvKLzkvOG`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa012',
        property_id: `SA012`,
        title: `GREEN HAVEN`,
        address: `GREEN HAVEN`,
        price: 588000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `DYLAN`,
        owner_contact: `167153666.0`,
        raw_wa_template: `For Sales SA012
Green Haven
Google Map: https://maps.app.goo.gl/v39GB1azC41E6PSy9
Property Type: Condominium
Selling Price: RM588,000
Bank Value: RM650,000
Build Up Area: 1149sqft
Sub-Sales
Freehold
International Lot
Strata Title
Vacant
Apartment Listing
Dual Key Unit
Studio 1 Bathroom
Floor: High
TBC View
Partial Furnished
2 Carparks
Maintenance Fee: RMTBC
Remark
1.Photos for reference only.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1ijF39ma6wGHf1plsA6lF7N0R_TJQJSK4
Can direct forward this message to customer`,
        market_rating: `B - AT MARKET PRICE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `STUDIO / STUDIO, DUAL KEY`,
        unit_no: `C 27-06`,
        size: `1149SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1ijF39ma6wGHf1plsA6lF7N0R_TJQJSK4`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa013',
        property_id: `SA013`,
        title: `JALAN DATO JAAFAR 24, TAMAN MUTIARA DESARU`,
        address: `JALAN DATO JAAFAR 24, TAMAN MUTIARA DESARU`,
        price: 350000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `MR.GOOI`,
        owner_contact: `+60 12-777 1666`,
        raw_wa_template: `For Sales SA013
Jalan Dato Jaafar 24, Taman Mutiara Desaru
Google Map: https://maps.app.goo.gl/LmpC9mbLk6KmNQD48
Property Type: 1 Storey Shoplot (Endlot)
Selling Price: RM350,000
Bank Value: RMTBC
Build Up Area: 1400sqft
Land Size & Area: 20x70
Sub-Sales
Leasehold
International Lot
Individual Title
Tenanted
Rental Income: RM1700
Tenancy Expired: TBC
Shoplot Listing
Main Road

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1JUqrwTVt0uOtdCvx0LimydvrVCKmv2ND
Can direct forward this message to customer`,
        market_rating: `E - LISTING ON HOLD`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `C- SHOPLOT / RETAIL`,
        rooms_remarks: `1STOREY, SHOPLOT, ENDLOT, MAIN ROAD`,
        unit_no: `49`,
        size: `1400SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1JUqrwTVt0uOtdCvx0LimydvrVCKmv2ND`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa014',
        property_id: `SA014`,
        title: `SUNGAI SULOH BESAR, MUKIM MINYAK BEKU, SENGGARANG`,
        address: `SUNGAI SULOH BESAR, MUKIM MINYAK BEKU, SENGGARANG`,
        price: 3200000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `AH LUN`,
        owner_contact: `+60 16-753 5919`,
        raw_wa_template: `For Sales SA014
Sungai Suloh Besar, Mukim Minyak Beku, Senggarang
Google Map: https://maps.app.goo.gl/1yFQ55m2jBQy9JMDA
Property Type: Agriculture Land
Selling Price: RM3,200,000 nego
Bank Value: RMTBC
Land Size & Area: 16 acres
Sub-Sales
Freehold
International Lot
Individual Title
Vacant
Land Listing
Main Road
Layer: First
Land Type: TBC
Electricity Supply: TBC
Water Supply: TBC
Monthly Profit: RMTBC
7 Year Tree
Geran: 2 pcs
Remark
1.Monthly yield of Kelicap coconuts is around 10,000 to 14,000 nuts.
2.RM200k per acre

Unit Photo Inside This Link
https://drive.google.com/drive/folders/12sYjoUd2k6Tb5Ih-pnOKx5Gu45BAIvT4
Can direct forward this message to customer`,
        market_rating: `A - BELOW MARKET`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `A- AGRICULTURAL LAND`,
        rooms_remarks: `AGRICULTURAL LAND`,
        unit_no: `LOT 1072&1085`,
        size: `16ACRES`,
        gdrive_link: `https://drive.google.com/drive/folders/12sYjoUd2k6Tb5Ih-pnOKx5Gu45BAIvT4`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa015',
        property_id: `SA015`,
        title: `PARADIGM RESIDENCE`,
        address: `PARADIGM RESIDENCE`,
        price: 780000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-intan`,
        salesperson_name: `Mindy`,
        verified_by: 'usr-melissa',
        owner_name: `L314`,
        owner_contact: ``,
        raw_wa_template: `For Sales SA015
Paradigm Residence
Google Map: https://maps.app.goo.gl/urQQwaA7jmchZU4w8
Property Type: Service Apartment
Selling Price: RM780,000
Bank Value: RMTBC
Build Up Area: 962sqft
Sub-Sales
Freehold
International Lot
Strata Title
Owner Own Stay
Apartment Listing
2+1 Bedroom 2 Bathroom
Floor: High
City View
West Sun
Fully Furnished
1 Carparks
Maintenance Fee: RM TBC

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1dFwutMaerEPfQvQTIZO-5wiFk7IKegEK
Can direct forward this message to customer`,
        market_rating: `C - OVERPRICED`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `2ROOM, +1ROOM`,
        unit_no: `25-XX`,
        size: `962SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1dFwutMaerEPfQvQTIZO-5wiFk7IKegEK`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa016',
        property_id: `SA016`,
        title: `MEDINI SIGNATURE`,
        address: `MEDINI SIGNATURE`,
        price: 750000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-intan`,
        salesperson_name: `Mindy`,
        verified_by: 'usr-melissa',
        owner_name: `L362`,
        owner_contact: ``,
        raw_wa_template: `For Sales SA016
Medini Signature
Google Map: https://maps.app.goo.gl/cgst9UrfhKGUUqKb7
Property Type: Service Apartment
Selling Price: RM750,000
Bank Value: RMTBC
Build Up Area: 1395sqft
Sub-Sales
Private Lease
International Lot
Strata Title
Airbnb now
Apartment Listing
5 Bedroom 4 Bathroom
Floor: Middle
City View
Fully Furnished
1 Carparks
Maintenance Fee: RM560.35

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1bAKYmqLgsimQr7mMyCEVkUT0-ri8V65t
Can direct forward this message to customer`,
        market_rating: `D - UNKNOWN MARKET`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `5ROOM`,
        unit_no: `T2-15-W3`,
        size: `1395SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1bAKYmqLgsimQr7mMyCEVkUT0-ri8V65t`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa017',
        property_id: `SA017`,
        title: `JALAN KENANGA 29/11, KULAI`,
        address: `JALAN KENANGA 29/11, KULAI`,
        price: 1350000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `SHAUN LOW`,
        owner_contact: `+60197723689`,
        raw_wa_template: `For Sales SA017
Jalan Kenanga 29/11,Kulai
Google Map: https://maps.app.goo.gl/mLQzqZr6eACNR45c8
Property Type: 4 Storey ShopLot
Selling Price: RM1.35mil
Bank Value: RMTBC
Build Up Area: 1680 Sqft
Land Size & Area: 24 x 70
Sub-Sales
Freehold
International Lot
Individual Title
Tenanted
Shoplot Listing
Inner Road
Remark: Only 2nd Floor Available from October 2025 to rent

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1tdQgiktbHTxFCupll5yip7Ydn7yWcIcJ
Can direct forward this message to customer`,
        market_rating: `B - AT MARKET PRICE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `C- SHOPLOT / RETAIL`,
        rooms_remarks: `4STOREY, SHOPLOT, INNER ROAD`,
        unit_no: `442`,
        size: `1680SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1tdQgiktbHTxFCupll5yip7Ydn7yWcIcJ`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa018',
        property_id: `SA018`,
        title: `JALAN KENANGA 29/11, KULAI`,
        address: `JALAN KENANGA 29/11, KULAI`,
        price: 1350000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `SHAUN LOW`,
        owner_contact: `+60197723689`,
        raw_wa_template: `*For Sales SA018*
*Jalan Kenanga 29/11,Kulai*
Google Map: https://maps.app.goo.gl/mLQzqZr6eACNR45c8
Property Type: 4 Storey ShopLot
Selling Price: RM1.35mil
Bank Value: RMTBC
Build Up Area: 1680 Sqft
Land Size & Area: 24 x 70
Sub-Sales
Freehold
International Lot
Individual Title
Shoplot Listing
Inner Road
Remark: Only Ground Floor Occupied for rent.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/11D9xxd718XUA3_isJ1WloDTdzF906EPE
Can direct forward this message to customer`,
        market_rating: `B - AT MARKET PRICE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `C- SHOPLOT / RETAIL`,
        rooms_remarks: `4STOREY, SHOPLOT, INNER ROAD`,
        unit_no: `443`,
        size: `1680SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/11D9xxd718XUA3_isJ1WloDTdzF906EPE`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa019',
        property_id: `SA019`,
        title: `JALAN KENANGA 29/11, KULAI`,
        address: `JALAN KENANGA 29/11, KULAI`,
        price: 2700000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `SHAUN LOW`,
        owner_contact: `+60197723689`,
        raw_wa_template: `For Sales SA019
Jalan Kenanga 29/11,Kulai
Google Map: https://maps.app.goo.gl/mLQzqZr6eACNR45c8
Property Type: 2 Adjoining 4 Storey ShopLot
Selling Price: RM 2.7mil
Bank Value: RMTBC
Build Up Area: 1680 Sqft x2
Land Size & Area: 24x70 x2
Sub-Sales
Freehold
International Lot
Individual Title
Shoplot Listing
Inner Road
2 Adjoining Whole Block
Remark: Only Ground Floor Occupied for rent.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/12HtRh15f80tnV2olWw_NWmfEzLbuhvht
Can direct forward this message to customer`,
        market_rating: `B - AT MARKET PRICE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `C- SHOPLOT / RETAIL`,
        rooms_remarks: `2 ADJOINING, 4STOREY, SHOPLOT, INNER ROAD`,
        unit_no: `442 - 443`,
        size: `1680SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/12HtRh15f80tnV2olWw_NWmfEzLbuhvht`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa020',
        property_id: `SA020`,
        title: `MIDORI GREEN`,
        address: `MIDORI GREEN`,
        price: 499500,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `JEFFERY`,
        owner_contact: `+60 19-775 8055`,
        raw_wa_template: `For Sales SA020
Midori Green
Google Map: https://maps.app.goo.gl/w9iuQoUwyWK5yeG6A
Property Type: Service Apartment
Selling Price: RM499,500
Bank Value: RMTBC
Build Up Area: 1030sqft
Sub-Sales
Freehold
International Lot
Strata Title
Homestay now
Apartment Listing
3 Bedroom 2 Bathroom
Floor: Low
Pool View
Fully Furnished
1 Carparks
Maintenance Fee: RMTBC
Remark
1.All renovations, electrical fittings, and furniture are brand new.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1H1JrebJXBkyLBhELJjh8PeJCOPtxQWLf
Can direct forward this message to customer`,
        market_rating: `C - OVERPRICED`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `3ROOM`,
        unit_no: `B2 08-20`,
        size: `1030SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1H1JrebJXBkyLBhELJjh8PeJCOPtxQWLf`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa021',
        property_id: `SA021`,
        title: `RNF PRINCESS COVE PHASE 1`,
        address: `RNF PRINCESS COVE PHASE 1`,
        price: 1000300,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `LAHOME:
BENSON `,
        owner_contact: ``,
        raw_wa_template: `For Sales SA021
RNF Princess Phase 1
Google Map: https://maps.app.goo.gl/kifayXdsPd1VHePU9
Property Type: Service Apartment
Selling Price: RM 1,000,300
Bank Value:  RM 1,050,00
Build Up Area: 1,129 SQFT
Sub-Sales
Freehold
Non Bumi Lot
Master Title
Tenanted
Rental Income: RM3400(Not Included Carpark)
Tenancy Expired: 15/12/2026
Apartment Listing
3 Bedroom 2 Bathroom
Floor: Middle
Sea View
Fully Furnished
1 Carparks
Maintenance Fee + Sinking Fund:  RM330 + RM33

Unit Photo Inside This Link
https://drive.google.com/drive/folders/19zTSOkrVmoR20OGNO9hJpH5yOXepxdoJ
Can direct forward this message to customer`,
        market_rating: `G - CASE COMPLETED`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `3ROOM`,
        unit_no: `A5-2-1701`,
        size: `1129SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/19zTSOkrVmoR20OGNO9hJpH5yOXepxdoJ`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa022',
        property_id: `SA022`,
        title: `PARAGON RESIDENCE`,
        address: `PARAGON RESIDENCE`,
        price: 850000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-intan`,
        salesperson_name: `Mindy`,
        verified_by: 'usr-melissa',
        owner_name: `Y049`,
        owner_contact: `017-4353055`,
        raw_wa_template: `For Sales SA022
Paragon Residence
Google Map: https://maps.app.goo.gl/W7FzK4EM78mCKcKe7
Property Type: Service Apartment
Selling Price: RM850,000
Bank Value: RMTBC
Build Up Area: 1044sqft
Sub-Sales
Freehold
International Lot
Strata Title
Vacant
Apartment Listing
3 Bedroom 2 Bathroom
Floor: High
Sea View
Fully Furnished
1 Carparks
Maintenance Fee: RMTBC

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1KuFUmM0SVdgEbizQzmrN1kMUUSDq7NKc
Can direct forward this message to customer`,
        market_rating: `D - UNKNOWN MARKET`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `3ROOM`,
        unit_no: `A 25-08`,
        size: `1044SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1KuFUmM0SVdgEbizQzmrN1kMUUSDq7NKc`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa023',
        property_id: `SA023`,
        title: `D' AMBIENCE RESIDENCES`,
        address: `D' AMBIENCE RESIDENCES`,
        price: 438000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Sarah Connor (Sales Team)`,
        verified_by: 'usr-melissa',
        owner_name: `LISLIE`,
        owner_contact: ``,
        raw_wa_template: `For Sales SA023
D' Ambience Residences
Google Map: https://maps.app.goo.gl/ytro8c6N2BMxqSyN8
Property Type: Apartment
Selling Price: RM438,000
Bank Value: RM 500,000
Build Up Area: 1,114 SQFT
Sub-Sales
Freehold
International
Strata Title
Vacant
Apartment Listing
3 Bedroom 2 Bathroom
Floor: Low
Garden View
Fully Furnished
2 Carparks
Maintenance Fee: RM350
Remark :
1. Full Loan
2. Corner Lot

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1eOs51aBjUp0L89TDF8MMBPnu6KtarjSV
Can direct forward this message to customer`,
        market_rating: `G - CASE COMPLETED`,
        sale_rent: `sale - coagency`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `3ROOM, CORNER LOT`,
        unit_no: `B 05-01`,
        size: `1114 SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1eOs51aBjUp0L89TDF8MMBPnu6KtarjSV`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa024',
        property_id: `SA024`,
        title: `CUBE 166, JP PERDANA, JALAN JAYA PUTRA 3/2`,
        address: `CUBE 166, JP PERDANA, JALAN JAYA PUTRA 3/2`,
        price: 680000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Sarah Connor (Sales Team)`,
        verified_by: 'usr-melissa',
        owner_name: `EDWARD`,
        owner_contact: `165166214.0`,
        raw_wa_template: `For Sales SA024
CUBE 166 JP PERDANA
Google Map: https://maps.app.goo.gl/u92Xuj5qQFTk9N9s8
Property Type: 2 Storey Terrace House
Selling Price: RM680,000
Bank Value: RM 700,000
Build Up Area: 1588 sqft
Land Size & Area: 18 x 65
Sub-Sales
Freehold
International
Individual
Vacant
House Listing
4 Bedroom 3 Bathroom
Unfurnished
Original unit
Gated & Guarded: Yes
Maintenance Fee: RM 120
Remark
1. Direction: North

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1Y5qvtjWXNooZTFlf9uOxvUQRMWDq31dR
Can direct forward this message to customer`,
        market_rating: `G - CASE COMPLETED`,
        sale_rent: `sale - coagency`,
        state: `JOHOR`,
        property_type: `R- TERRACE HOUSE`,
        rooms_remarks: `2STOREY `,
        unit_no: `01-19`,
        size: `18X65SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1Y5qvtjWXNooZTFlf9uOxvUQRMWDq31dR`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa025',
        property_id: `SA025`,
        title: `WAVE MARINA COVE`,
        address: `WAVE MARINA COVE`,
        price: 420000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `BONG MY `,
        owner_contact: `+60168969629`,
        raw_wa_template: `For Sales SA025
WAVE MARINA COVE
Google Map: https://maps.app.goo.gl/yMKjmQo2Ugcqjz898
Property Type: Service Apartment
Selling Price: RM 420,000
Bank Value: TBC
Build Up Area: 526 sqft
Sub-Sales
Freehold
International
Strata Title
Tenanted
Rental Income: RM 1900
Tenancy Expired: Jan 2026
Apartment Listing
1Bedroom 1Bathroom
Floor: High
Sea View
Fully Furnished
1 Carparks
Maintenance Fee: RM 181.50
Remark:
1. The living room has floor-to-ceiling windows.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1mXPhC0J3GLpEbyEzNRXlzNMLEbFtGoys
Can direct forward this message to customer`,
        market_rating: `C - OVERPRICED`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `1ROOM`,
        unit_no: `D 28-04`,
        size: `526SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1mXPhC0J3GLpEbyEzNRXlzNMLEbFtGoys`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa026',
        property_id: `SA026`,
        title: `PANDAN RESIDENCE 2`,
        address: `PANDAN RESIDENCE 2`,
        price: 480000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `YOONSENG`,
        owner_contact: `167587620.0`,
        raw_wa_template: `For Sales SA026
Pandan Residence 2
Google Map:https://maps.app.goo.gl/hYESAGST6y8znvqGA
Property Type: Service Apartment
Selling Price: RM480,000
Bank Value: RM650,000
Build Up Area: 1405 sqft
Sub-Sales
Leasehold 99Years
International Lot
Strata Title
Tenanted
Rental Income: rm2000
Tenancy Expired: Sep 2025
Apartment Listing
3+1 bedrooms 2 bathrooms
Floor: High with skybridge connected
City View
Fully Furnished
2 Carparks
Maintenance Fee: RM 400++
Remark:
1.The owner has not completed the Perfection of Strata Title process.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1UcWmIvHaNodfN8klZ2XGjtCpmv3TKHnN
Can direct forward this message to customer`,
        market_rating: `G - NOT AVAILABLE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `3ROOM, +1ROOM`,
        unit_no: `22-08`,
        size: `1405SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1UcWmIvHaNodfN8klZ2XGjtCpmv3TKHnN`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa027',
        property_id: `SA027`,
        title: `COUNTRY GARDEN@CENTRAL PARK`,
        address: `COUNTRY GARDEN@CENTRAL PARK`,
        price: 250000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `JIA YIN`,
        owner_contact: `+60 11-2676 4542`,
        raw_wa_template: `For Sales SA027
Country Garden@Central Park
Google Map: https://maps.app.goo.gl/HEnrw95gBVFA4XQ48
Property Type: Service Apartment
Selling Price: RM250,000
Bank Value: RMTBC
Build Up Area: 403sqft
Sub-Sales
Freehold
Non Bumi Lot
Strata Title
Tenanted
Rental Income: RM1100
Tenancy Expired: TBC
Apartment Listing
Studio 1 Bathroom
Floor: Low
City View
Partial Furnished
1 Carparks
Maintenance Fee: RM 135
Remark:
1.MOT pending — to be completed concurrently with the sale transaction.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1GSJKDfLv_NpOiPtY3VY2WFHL0W8-lnCS
Can direct forward this message to customer`,
        market_rating: `G - NOT AVAILABLE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `STUDIO`,
        unit_no: `B-13-12`,
        size: `403SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1GSJKDfLv_NpOiPtY3VY2WFHL0W8-lnCS`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa028',
        property_id: `SA028`,
        title: `JALAN PERMAS 15/1, BANDAR PERMAS JAYA`,
        address: `JALAN PERMAS 15/1, BANDAR PERMAS JAYA`,
        price: 1750000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-sales-sarah`,
        salesperson_name: `Gyden`,
        verified_by: 'usr-melissa',
        owner_name: `RYAN ANG`,
        owner_contact: `167798666.0`,
        raw_wa_template: `For Sales SA028
Jalan Permas 15/1,Bandar Permas Jaya
Google Map: https://maps.app.goo.gl/QuMnUYAKbL8Ny2Ts6
Property Type: 3 Storey Shop Office
Selling Price: RM1.75mil
Bank Value: RM1.8mil
Build Up Area: 5040sqft
Land Size & Area: 24x70
Sub-Sales
Freehold
International Lot
Individual Title
Tenanted
Shoplot Listing
Main Road
Ground Floor Rental: RM4000
Tenancy Expired: 31 Dec 2026
1st Floor Rental: RM1800
Tenancy Expired: 30 Nov 2026
2nd Floor Rental: RM1000
Tenancy Expired: 30 Jun 2027
Remark:
1.Same row with Rozel & 7eleven

Unit Photo Inside This Link
https://drive.google.com/drive/folders/10yrQupVpowtVaFI0Gzt6qoF3c80C-7Nb
Can direct forward this message to customer`,
        market_rating: `G - CASE COMPLETED`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `C- SHOPLOT / RETAIL`,
        rooms_remarks: `3STOREY, SHOP OFFICE, MAIN ROAD`,
        unit_no: `10`,
        size: `24X70SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/10yrQupVpowtVaFI0Gzt6qoF3c80C-7Nb`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa029',
        property_id: `SA029`,
        title: `ENCORP MARINA`,
        address: `ENCORP MARINA`,
        price: 400000,
        status: `active`,
        photos: [],
        salesperson_id: `usr-intan`,
        salesperson_name: `Mindy`,
        verified_by: 'usr-melissa',
        owner_name: `Y103`,
        owner_contact: `016-7118215`,
        raw_wa_template: `For Sales SA029
Encorp Marina
Google Map: https://maps.app.goo.gl/S9K2vhpd3V2HgYtA8
Property Type: Service Apartment
Selling Price: RM400,000
Bank Value: RMTBC
Build Up Area: 716sqft
Sub-Sales
Freehold
International Lot
Strata Title
Vacant
Apartment Listing
Studio 1 Bathroom
Floor: Mid
Sea  View
Unblock View
Fully Furnished
1 Carparks
Maintenance Fee: RMTBC
Remark
1.Brand new unit
2.Photos for reference only.

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1EgBtGHgQiu6FNhA9a77OzgRgk5YKdmbj
Can direct forward this message to customer`,
        market_rating: `B - AT MARKET PRICE`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `STUDIO`,
        unit_no: `T2-18-03`,
        size: `716SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1EgBtGHgQiu6FNhA9a77OzgRgk5YKdmbj`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      },
      {
        id: 'mst-sa030',
        property_id: `SA030`,
        title: `ENCORP MARINA`,
        address: `ENCORP MARINA`,
        price: 450000,
        status: `inactive`,
        photos: [],
        salesperson_id: `usr-intan`,
        salesperson_name: `Mindy`,
        verified_by: 'usr-melissa',
        owner_name: `L205`,
        owner_contact: `+60 16-442 1088`,
        raw_wa_template: `For Sales SA030
Encorp Marina
Google Map: https://maps.app.goo.gl/S9K2vhpd3V2HgYtA8
Property Type: Service Apartment
Selling Price: RM450,000
Bank Value: RMTBC
Build Up Area: 749sqft
Sub-Sales
Freehold
International Lot
Strata Title
Vacant
Apartment Listing
Studio 1 Bathroom
Floor: High
Sea  View
Fully Furnished
1 Carparks
Maintenance Fee: RMTBC

Unit Photo Inside This Link
https://drive.google.com/drive/folders/1VighHYTaLcA3ikkas4UpUUUZBMQ7YcIZ
Can direct forward this message to customer`,
        market_rating: `E - LISTING ON HOLD`,
        sale_rent: `sale`,
        state: `JOHOR`,
        property_type: `R- APT/ CONDO / SR / FLAT`,
        rooms_remarks: `STUDIO`,
        unit_no: `T2-30-XX`,
        size: `749SQFT`,
        gdrive_link: `https://drive.google.com/drive/folders/1VighHYTaLcA3ikkas4UpUUUZBMQ7YcIZ`,
        final_wa_template: '',
        private_notes: '',
        created_at: `2026-04-01 00:00:00`
      }
    ]);

    // 3. Updates remarks (LISTING_UPDATE)
    setLocal('listing_updates', [
{
        id: 'upd-sa001',
        property_id: `SA001`,
        remarks: `SHARE 30% FOR INTRODUCER MR.GOOI`,
        updated_by: `usr-intan`,
        updated_by_name: `Mindy`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa002',
        property_id: `SA002`,
        remarks: `29/08/2025还没处理MOT
Under Master Title
-owner take back 360k`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa003',
        property_id: `SA003`,
        remarks: `take back RM868k`,
        updated_by: `usr-intan`,
        updated_by_name: `Mindy`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa004',
        property_id: `SA004`,
        remarks: `ONLY except Investor Buyer`,
        updated_by: `usr-intan`,
        updated_by_name: `Mindy`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa005',
        property_id: `SA005`,
        remarks: `-Can mark up 430k-450k
-Nett 380k

-----------------------------
⭕房源核心判断条件：
1.是否为市场最低价或接近最低价2.佣金是否高于 2%
3.该区域过去交易量是否活跃
4.价格是否低于该区域过往2年的成交价`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa007',
        property_id: `SA007`,
        remarks: `⭕房源核心判断条件：
1.该区域过去交易量是否活跃

❌不达标条件-1.3mil per unit最低价`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Sarah Connor (Sales Team)`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa008',
        property_id: `SA008`,
        remarks: `CANNOT DO ADVERTISEMENT AT IPROPERTY & PROPERTYGURU & FACEBOOK, DEVELOPER WILL COMPLAINT.

Owner take back 410k
markup portion need to deduct 20% for CIM, balance 80% share by agent
Use Vendor Agent lawyer`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa009',
        property_id: `SA009`,
        remarks: `CANNOT DO ADVERTISEMENT AT IPROPERTY & PROPERTYGURU & FACEBOOK, DEVELOPER WILL COMPLAINT.

Owner take back 410k
markup portion need to deduct 20% for CIM, balance 80% share by agent
Use Vendor Agent lawyer`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa010',
        property_id: `SA010`,
        remarks: `CANNOT DO ADVERTISEMENT AT IPROPERTY & PROPERTYGURU & FACEBOOK, DEVELOPER WILL COMPLAINT

Owner take back 430k
markup portion need to deduct 20% for CIM, balance 80% share by agent
Use Vendor Agent lawyer`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa011',
        property_id: `SA011`,
        remarks: `Owner will take 0.45% as referrals fee
Owner take back RM428k nett

-------------------------------
⭕房源核心判断条件：
1.价格是否低于该区域过往2年的成交价
2.佣金是否高于 2%

❌不达标条件-438k最低价 / 该区域过去交易量是否活跃(没有相关单位）`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa012',
        property_id: `SA012`,
        remarks: `1.Carpark No 1-120&1-121
2.Photos for reference only.

-------------------------------
⭕房源核心判断条件：
1.该区域过去交易量是否活跃
2.是否为市场最低价或接近最低价`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa013',
        property_id: `SA013`,
        remarks: `Owner Reply ：27/2/26
不好意思，我没有单位要出售`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa014',
        property_id: `SA014`,
        remarks: `RM200k per acre

Owner referral take 0.45%
Commission  2%-3%

--------------------------
⭕房源核心判断条件：
1.是否为市场最低价或接近最低价
2.该区域过去交易量是否活跃
3.价格是否低于该区域过往2年的成交价`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa015',
        property_id: `SA015`,
        remarks: `SELL OTHER SUMMERPARK UNIT FIRST
BANK VALUE 360K`,
        updated_by: `usr-intan`,
        updated_by_name: `Mindy`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa017',
        property_id: `SA017`,
        remarks: `⭕房源核心判断条件：
1.该区域过去交易量是否活跃
2.价格是否低于该区域过往2年的成交价

❌不达标条件-1.18mil最低价`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa018',
        property_id: `SA018`,
        remarks: `⭕房源核心判断条件：
1.该区域过去交易量是否活
2.价格是否低于该区域过往2年的成交价

❌不达标条件-1.18mil最低价`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa019',
        property_id: `SA019`,
        remarks: `⭕房源核心判断条件：
1.该区域过去交易量是否活跃
2.价格是否低于该区域过往2年的成交价

❌不达标条件-1.18mil/per unit最低价`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa020',
        property_id: `SA020`,
        remarks: `RM450K nett
---------------------------
⭕房源核心判断条件：
1.该区域过去交易量是否活跃`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa022',
        property_id: `SA022`,
        remarks: `Referral 0.5%`,
        updated_by: `usr-intan`,
        updated_by_name: `Mindy`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa023',
        property_id: `SA023`,
        remarks: `Open loan
Allow murkup up loan 
Bare owner legal fee

Owner take back Rm 420k 
Big commission 18k

Commission：
Exclusive unit investment lock 
Open loan
Owner take back Rm 420k 
Selling price Rm 438k  
Big commission 18k
Bank value Rm500k 

Use Vendor lawyer DGK`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Sarah Connor (Sales Team)`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa024',
        property_id: `SA024`,
        remarks: `Owner take back Rm 650k 
Big commission 30k

Open loan
Allow murkup up loan , RBGT 15% 
Bare owner legal fee`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Sarah Connor (Sales Team)`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa025',
        property_id: `SA025`,
        remarks: `Fully Furnished
Contract end Jan 2026
客厅是全落地玻璃.
照片的单位是D-2904的照片.
所以D2804 是全落地玻璃

-------------------------------
⭕房源核心判断条件：
1.该区域过去交易量是否活跃`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa026',
        property_id: `SA026`,
        remarks: `Owner take back 441k`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa027',
        property_id: `SA027`,
        remarks: `MOT pending — to be completed concurrently with the sale transaction`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      },
      {
        id: 'upd-sa028',
        property_id: `SA028`,
        remarks: `2.5% Com`,
        updated_by: `usr-sales-sarah`,
        updated_by_name: `Gyden`,
        updated_at: new Date().toISOString()
      }
    ]);

    // 4. Marketing ads (ADVERTISING)
    setLocal('advertising', [
{
        id: 'adv-sa001',
        property_id: `SA001`,
        title: `PRIMA REGENCY`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa002',
        property_id: `SA002`,
        title: `KSL DAYA RESIDENCES`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa003',
        property_id: `SA003`,
        title: `MEDINI SIGNATURE`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa004',
        property_id: `SA004`,
        title: `SOUTHERN MARINA`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa005',
        property_id: `SA005`,
        title: `TEBRAU CITY RESIDENCES, JALAN HARMONIUM 24/2`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa006',
        property_id: `SA006`,
        title: `SAKURA RESIDENCE`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa007',
        property_id: `SA007`,
        title: `JALAN GLASIAR, TAMAN TASEK `,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa008',
        property_id: `SA008`,
        title: `COUNTRY GARDEN DANGA BAY@AMBERSIDE`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa009',
        property_id: `SA009`,
        title: `COUNTRY GARDEN DANGA BAY@BAY POINT`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa010',
        property_id: `SA010`,
        title: `COUNTRY GARDEN DANGA BAY@BAY POINT`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa011',
        property_id: `SA011`,
        title: `JALAN KEPAYANG, TAMAN KOTA JAYA`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa012',
        property_id: `SA012`,
        title: `GREEN HAVEN`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa013',
        property_id: `SA013`,
        title: `JALAN DATO JAAFAR 24, TAMAN MUTIARA DESARU`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa014',
        property_id: `SA014`,
        title: `SUNGAI SULOH BESAR, MUKIM MINYAK BEKU, SENGGARANG`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa015',
        property_id: `SA015`,
        title: `PARADIGM RESIDENCE`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa016',
        property_id: `SA016`,
        title: `MEDINI SIGNATURE`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa017',
        property_id: `SA017`,
        title: `JALAN KENANGA 29/11, KULAI`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa018',
        property_id: `SA018`,
        title: `JALAN KENANGA 29/11, KULAI`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa019',
        property_id: `SA019`,
        title: `JALAN KENANGA 29/11, KULAI`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa020',
        property_id: `SA020`,
        title: `MIDORI GREEN`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa021',
        property_id: `SA021`,
        title: `RNF PRINCESS COVE PHASE 1`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa022',
        property_id: `SA022`,
        title: `PARAGON RESIDENCE`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa023',
        property_id: `SA023`,
        title: `D' AMBIENCE RESIDENCES`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa024',
        property_id: `SA024`,
        title: `CUBE 166, JP PERDANA, JALAN JAYA PUTRA 3/2`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa025',
        property_id: `SA025`,
        title: `WAVE MARINA COVE`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa026',
        property_id: `SA026`,
        title: `PANDAN RESIDENCE 2`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa027',
        property_id: `SA027`,
        title: `COUNTRY GARDEN@CENTRAL PARK`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa028',
        property_id: `SA028`,
        title: `JALAN PERMAS 15/1, BANDAR PERMAS JAYA`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa029',
        property_id: `SA029`,
        title: `ENCORP MARINA`,
        selected_by_sales: false,
        status: `published`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      },
      {
        id: 'adv-sa030',
        property_id: `SA030`,
        title: `ENCORP MARINA`,
        selected_by_sales: false,
        status: `pending`,
        iproperty_link: ``,
        propertyguru_link: ``,
        updated_at: new Date().toISOString()
      }
    ]);

    // 5. Co-Agency (MATCHING_COA)
    setLocal('matching_coa', [
{
        id: 'coa-sa001',
        property_id: `SA001`,
        external_agent_name: ``,
        external_agent_contact: '',
        commission_split: ``,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa002',
        property_id: `SA002`,
        external_agent_name: ``,
        external_agent_contact: '',
        commission_split: ``,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa003',
        property_id: `SA003`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa004',
        property_id: `SA004`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa005',
        property_id: `SA005`,
        external_agent_name: `JACQUEEN & BOON SIONG`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa006',
        property_id: `SA006`,
        external_agent_name: `JACQUEEN & BOON SIONG`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa007',
        property_id: `SA007`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa008',
        property_id: `SA008`,
        external_agent_name: ``,
        external_agent_contact: '',
        commission_split: ``,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa009',
        property_id: `SA009`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa010',
        property_id: `SA010`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa011',
        property_id: `SA011`,
        external_agent_name: `JACQUEEN & BOON SIONG`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa012',
        property_id: `SA012`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa013',
        property_id: `SA013`,
        external_agent_name: ``,
        external_agent_contact: '',
        commission_split: ``,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa014',
        property_id: `SA014`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa015',
        property_id: `SA015`,
        external_agent_name: `JACQUEEN & BOON SIONG`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa016',
        property_id: `SA016`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa017',
        property_id: `SA017`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa018',
        property_id: `SA018`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa019',
        property_id: `SA019`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa020',
        property_id: `SA020`,
        external_agent_name: `JACQUEEN`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa021',
        property_id: `SA021`,
        external_agent_name: ``,
        external_agent_contact: '',
        commission_split: ``,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa022',
        property_id: `SA022`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa023',
        property_id: `SA023`,
        external_agent_name: ``,
        external_agent_contact: '',
        commission_split: ``,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa024',
        property_id: `SA024`,
        external_agent_name: ``,
        external_agent_contact: '',
        commission_split: ``,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa025',
        property_id: `SA025`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa026',
        property_id: `SA026`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa027',
        property_id: `SA027`,
        external_agent_name: ``,
        external_agent_contact: '',
        commission_split: ``,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa028',
        property_id: `SA028`,
        external_agent_name: ``,
        external_agent_contact: '',
        commission_split: ``,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa029',
        property_id: `SA029`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      },
      {
        id: 'coa-sa030',
        property_id: `SA030`,
        external_agent_name: `✓ ALL OK`,
        external_agent_contact: '',
        commission_split: `50/50`,
        remarks: '',
        updated_at: new Date().toISOString()
      }
    ]);

    // 6. Resolving Sales (RESOLVING) - Starts empty
    setLocal('resolving_sales', []);

    // 7. Audit logs
    setLocal('audit_logs', [
      {
        id: 'log-01',
        timestamp: new Date().toISOString(),
        user_id: 'usr-admin-01',
        user_name: 'Commander Navin (Admin)',
        action: 'SYSTEM_STARTUP',
        details: 'GYDEN Property System 2.0 database nodes initialized with Excel SA001-SA030 test seed.'
      }
    ]);

    localStorage.setItem('gyden2_initialized_v4', 'true');
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
    privateNotes: string = '',
    customPropertyId?: string
  ): Promise<ListingNew> => {
    const user = dbService.getCurrentUser();
    
    // Auto generate property id: G-XXXX or use customPropertyId
    let propertyId = customPropertyId ? customPropertyId.trim().toUpperCase() : '';
    if (!propertyId) {
      const count = getLocal<ListingNew[]>('listings_new', []).length + getLocal<MasterListing[]>('master_listings', []).length + 1000;
      propertyId = `G-${count + 1}`;
    }

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
    let staging: ListingNew | undefined;

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('listings_new')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (!error && data) {
          staging = data as ListingNew;
        }
      } catch (err) {
        console.error('Supabase fetch staging for promotion failed:', err);
      }
    }

    if (!staging) {
      const stagingListings = getLocal<ListingNew[]>('listings_new', []);
      staging = stagingListings.find(l => l.id === id);
    }
    
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
        const { error: insertErr } = await supabase!.from('master_listings').insert([newMaster]);
        if (insertErr) throw insertErr;

        const { error: updateErr } = await supabase!.from('listings_new').update({ verification_status: 'promoted' }).eq('id', id);
        if (updateErr) throw updateErr;
        
        // Seed default blank values into advertising, coa, and resolving tables
        await supabase!.from('advertising').insert([{ property_id: staging.property_id, title: staging.title }]);
        await supabase!.from('matching_coa').insert([{ property_id: staging.property_id }]);
        await supabase!.from('resolving_sales').insert([{ property_id: staging.property_id, salesperson_id: staging.salesperson_id, salesperson_name: staging.salesperson_name }]);
      } catch (err: any) {
        console.error('Supabase promotion transaction failed:', err);
        throw new Error(`Supabase promotion transaction failed: ${err.message || err}`);
      }
    }

    // Local Storage logic
    // Add to Master list
    const currentMasters = getLocal<MasterListing[]>('master_listings', []);
    currentMasters.push(newMaster);
    setLocal('master_listings', currentMasters);

    // Update Staging status
    const localStaging = getLocal<ListingNew[]>('listings_new', []);
    const updatedStaging = localStaging.map((l: ListingNew) => l.id === id ? { ...l, verification_status: 'promoted' as const } : l);
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
