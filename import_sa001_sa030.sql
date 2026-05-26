-- SQL Seed Script for SA001 - SA030 listings
BEGIN;
TRUNCATE public.master_listings CASCADE;
TRUNCATE public.listings_new CASCADE;
TRUNCATE public.listing_updates CASCADE;
TRUNCATE public.advertising CASCADE;
TRUNCATE public.matching_coa CASCADE;
TRUNCATE public.resolving_sales CASCADE;

INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa001', 'SA001', 'PRIMA REGENCY', 'PRIMA REGENCY', 268000, 'inactive', 'usr-intan', 'Mindy', 'usr-melissa', 'R029', '', 'For Sales SA001
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
Can direct forward this message to customer', 'G - NOT AVAILABLE', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', 'STUDIO', 'BLK 5 12-03', '565SQFT', 'https://drive.google.com/drive/folders/1PTjSwcaEpnQzLDkBRwwzrmQQ_-6A1cqj', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa001', 'SA001', 'PRIMA REGENCY', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa001', 'SA001', '', '');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa001', 'SA001', 'SHARE 30% FOR INTRODUCER MR.GOOI', 'usr-intan', 'Mindy');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa002', 'SA002', 'KSL DAYA RESIDENCES', 'KSL DAYA RESIDENCES', 421000, 'inactive', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'ZHANG SHUQI', '+62 813-6475-4887', 'For Sales SA002
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
Can direct forward this message to customer', 'G - NOT AVAILABLE', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '3ROOM', 'A 22-10', '1097SQFT', 'https://drive.google.com/drive/folders/15P8DaCU5giZ5DjtLRFZBZhbzUzRUlw1i', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa002', 'SA002', 'KSL DAYA RESIDENCES', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa002', 'SA002', '', '');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa002', 'SA002', '29/08/2025还没处理MOT
Under Master Title
-owner take back 360k', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa003', 'SA003', 'MEDINI SIGNATURE', 'MEDINI SIGNATURE', 950000, 'active', 'usr-intan', 'Mindy', 'usr-melissa', 'L374', '', 'For Sales SA003
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
Can direct forward this message to customer', 'D - UNKNOWN MARKET', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '3ROOM, +1ROOM', 'T1-25-W1', '1600SQFT', 'https://drive.google.com/drive/folders/1yhs3wWgtVxcDX70c54Zi7fXGfefMAmeO', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa003', 'SA003', 'MEDINI SIGNATURE', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa003', 'SA003', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa003', 'SA003', 'take back RM868k', 'usr-intan', 'Mindy');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa004', 'SA004', 'SOUTHERN MARINA', 'SOUTHERN MARINA', 899000, 'active', 'usr-intan', 'Mindy', 'usr-melissa', 'L363', '017-7945668', 'For Sales SA004
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
Can direct forward this message to customer', 'D - UNKNOWN MARKET', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '1ROOM, +1ROOM', '18-XX', '840SQFT', 'https://drive.google.com/drive/folders/1gQHq0L5kYGDTeCSPW3h-GTEpuDBIehbb', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa004', 'SA004', 'SOUTHERN MARINA', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa004', 'SA004', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa004', 'SA004', 'ONLY except Investor Buyer', 'usr-intan', 'Mindy');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa005', 'SA005', 'TEBRAU CITY RESIDENCES, JALAN HARMONIUM 24/2', 'TEBRAU CITY RESIDENCES, JALAN HARMONIUM 24/2', 498000, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'CAVEN', '127999288.0', 'For Sales SA005
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
Can direct forward this message to customer', 'A - BELOW MARKET', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '3ROOM, +1ROOM', 'E 05-21', '1404SQFT', 'https://drive.google.com/drive/folders/1fn7YHDctRGjhMTS7kWIf3qjU0Ygo2TOz', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa005', 'SA005', 'TEBRAU CITY RESIDENCES, JALAN HARMONIUM 24/2', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa005', 'SA005', 'JACQUEEN & BOON SIONG', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa005', 'SA005', '-Can mark up 430k-450k
-Nett 380k

-----------------------------
⭕房源核心判断条件：
1.是否为市场最低价或接近最低价2.佣金是否高于 2%
3.该区域过去交易量是否活跃
4.价格是否低于该区域过往2年的成交价', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa006', 'SA006', 'SAKURA RESIDENCE', 'SAKURA RESIDENCE', 2900000, 'active', 'usr-jacqueen', 'Jacqueen', 'usr-melissa', 'NATHAN TAN', '+659386 9142', 'For Sales SA006
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
Can direct forward this message to customer', 'B - AT MARKET PRICE', 'sale', 'JOHOR', 'R- SEMI-DETACHED HOUSE', '2STOREY ', '54', '39X75SQFT', 'https://drive.google.com/drive/folders/1n2ArMQqAF5G_SrVb0j91MYNsv-z7cI7u', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa006', 'SA006', 'SAKURA RESIDENCE', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa006', 'SA006', 'JACQUEEN & BOON SIONG', '50/50');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa007', 'SA007', 'JALAN GLASIAR, TAMAN TASEK ', 'JALAN GLASIAR, TAMAN TASEK ', 1610000, 'active', 'usr-sales-sarah', 'Sarah Connor (Sales Team)', 'usr-melissa', 'SAM CHAN', '132007755.0', 'For Sales SA007
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
Can direct forward this message to customer', 'C - OVERPRICED', 'sale', 'JOHOR', 'C- SHOPLOT / RETAIL', '2STOREY, SHOPLOT, MAIN ROAD', '175', '3080SQFT', 'https://drive.google.com/drive/folders/1woc-JcvK47XhrkMyu6qgoMJ3VN-rnzlu', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa007', 'SA007', 'JALAN GLASIAR, TAMAN TASEK ', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa007', 'SA007', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa007', 'SA007', '⭕房源核心判断条件：
1.该区域过去交易量是否活跃

❌不达标条件-1.3mil per unit最低价', 'usr-sales-sarah', 'Sarah Connor (Sales Team)');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa008', 'SA008', 'COUNTRY GARDEN DANGA BAY@AMBERSIDE', 'COUNTRY GARDEN DANGA BAY@AMBERSIDE', 498000, 'inactive', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'JACKSON', '+60 14-386 5939', 'For Sales SA008
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
Can direct forward this message to customer', 'G - NOT AVAILABLE', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '2ROOM', '8A 05-05', '840SQFT', 'https://drive.google.com/drive/folders/1sXgtgZuStRst9V4sxNwRvCNkYjZtEgT0', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa008', 'SA008', 'COUNTRY GARDEN DANGA BAY@AMBERSIDE', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa008', 'SA008', '', '');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa008', 'SA008', 'CANNOT DO ADVERTISEMENT AT IPROPERTY & PROPERTYGURU & FACEBOOK, DEVELOPER WILL COMPLAINT.

Owner take back 410k
markup portion need to deduct 20% for CIM, balance 80% share by agent
Use Vendor Agent lawyer', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa009', 'SA009', 'COUNTRY GARDEN DANGA BAY@BAY POINT', 'COUNTRY GARDEN DANGA BAY@BAY POINT', 498000, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'JACKSON', '+60 14-386 5939', 'For Sales SA009
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
Can direct forward this message to customer', 'A+ SUPER HOT DEAL', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '2ROOM', '4A 17-03', '800SQFT', 'https://drive.google.com/drive/folders/1SA094NjJq9jG8Ko1tSeT3Bymu7g4hnxI', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa009', 'SA009', 'COUNTRY GARDEN DANGA BAY@BAY POINT', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa009', 'SA009', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa009', 'SA009', 'CANNOT DO ADVERTISEMENT AT IPROPERTY & PROPERTYGURU & FACEBOOK, DEVELOPER WILL COMPLAINT.

Owner take back 410k
markup portion need to deduct 20% for CIM, balance 80% share by agent
Use Vendor Agent lawyer', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa010', 'SA010', 'COUNTRY GARDEN DANGA BAY@BAY POINT', 'COUNTRY GARDEN DANGA BAY@BAY POINT', 490000, 'inactive', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'JACKSON', '+60 14-386 5939', 'For Sales SA010
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
Can direct forward this message to customer', 'G - CASE COMPLETED', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '2ROOM', '5A 20-01', '893SQFT', 'https://drive.google.com/drive/folders/1rUXhJefaIQdyK9ZoCNW6ra3IGAayAbPT', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa010', 'SA010', 'COUNTRY GARDEN DANGA BAY@BAY POINT', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa010', 'SA010', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa010', 'SA010', 'CANNOT DO ADVERTISEMENT AT IPROPERTY & PROPERTYGURU & FACEBOOK, DEVELOPER WILL COMPLAINT

Owner take back 430k
markup portion need to deduct 20% for CIM, balance 80% share by agent
Use Vendor Agent lawyer', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa011', 'SA011', 'JALAN KEPAYANG, TAMAN KOTA JAYA', 'JALAN KEPAYANG, TAMAN KOTA JAYA', 448000, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'WILSON LEE', '177553933.0', 'For Sales SA011
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
Can direct forward this message to customer', 'B - AT MARKET PRICE', 'sale', 'JOHOR', 'R- TERRACE HOUSE', '1STOREY ', '104', '1600SQFT', 'https://drive.google.com/drive/folders/1vySfurTXC19YULe_SEhrCIxDvKLzkvOG', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa011', 'SA011', 'JALAN KEPAYANG, TAMAN KOTA JAYA', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa011', 'SA011', 'JACQUEEN & BOON SIONG', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa011', 'SA011', 'Owner will take 0.45% as referrals fee
Owner take back RM428k nett

-------------------------------
⭕房源核心判断条件：
1.价格是否低于该区域过往2年的成交价
2.佣金是否高于 2%

❌不达标条件-438k最低价 / 该区域过去交易量是否活跃(没有相关单位）', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa012', 'SA012', 'GREEN HAVEN', 'GREEN HAVEN', 588000, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'DYLAN', '167153666.0', 'For Sales SA012
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
Can direct forward this message to customer', 'B - AT MARKET PRICE', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', 'STUDIO / STUDIO, DUAL KEY', 'C 27-06', '1149SQFT', 'https://drive.google.com/drive/folders/1ijF39ma6wGHf1plsA6lF7N0R_TJQJSK4', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa012', 'SA012', 'GREEN HAVEN', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa012', 'SA012', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa012', 'SA012', '1.Carpark No 1-120&1-121
2.Photos for reference only.

-------------------------------
⭕房源核心判断条件：
1.该区域过去交易量是否活跃
2.是否为市场最低价或接近最低价', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa013', 'SA013', 'JALAN DATO JAAFAR 24, TAMAN MUTIARA DESARU', 'JALAN DATO JAAFAR 24, TAMAN MUTIARA DESARU', 350000, 'inactive', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'MR.GOOI', '+60 12-777 1666', 'For Sales SA013
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
Can direct forward this message to customer', 'E - LISTING ON HOLD', 'sale', 'JOHOR', 'C- SHOPLOT / RETAIL', '1STOREY, SHOPLOT, ENDLOT, MAIN ROAD', '49', '1400SQFT', 'https://drive.google.com/drive/folders/1JUqrwTVt0uOtdCvx0LimydvrVCKmv2ND', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa013', 'SA013', 'JALAN DATO JAAFAR 24, TAMAN MUTIARA DESARU', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa013', 'SA013', '', '');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa013', 'SA013', 'Owner Reply ：27/2/26
不好意思，我没有单位要出售', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa014', 'SA014', 'SUNGAI SULOH BESAR, MUKIM MINYAK BEKU, SENGGARANG', 'SUNGAI SULOH BESAR, MUKIM MINYAK BEKU, SENGGARANG', 3200000, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'AH LUN', '+60 16-753 5919', 'For Sales SA014
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
Can direct forward this message to customer', 'A - BELOW MARKET', 'sale', 'JOHOR', 'A- AGRICULTURAL LAND', 'AGRICULTURAL LAND', 'LOT 1072&1085', '16ACRES', 'https://drive.google.com/drive/folders/12sYjoUd2k6Tb5Ih-pnOKx5Gu45BAIvT4', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa014', 'SA014', 'SUNGAI SULOH BESAR, MUKIM MINYAK BEKU, SENGGARANG', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa014', 'SA014', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa014', 'SA014', 'RM200k per acre

Owner referral take 0.45%
Commission  2%-3%

--------------------------
⭕房源核心判断条件：
1.是否为市场最低价或接近最低价
2.该区域过去交易量是否活跃
3.价格是否低于该区域过往2年的成交价', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa015', 'SA015', 'PARADIGM RESIDENCE', 'PARADIGM RESIDENCE', 780000, 'active', 'usr-intan', 'Mindy', 'usr-melissa', 'L314', '', 'For Sales SA015
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
Can direct forward this message to customer', 'C - OVERPRICED', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '2ROOM, +1ROOM', '25-XX', '962SQFT', 'https://drive.google.com/drive/folders/1dFwutMaerEPfQvQTIZO-5wiFk7IKegEK', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa015', 'SA015', 'PARADIGM RESIDENCE', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa015', 'SA015', 'JACQUEEN & BOON SIONG', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa015', 'SA015', 'SELL OTHER SUMMERPARK UNIT FIRST
BANK VALUE 360K', 'usr-intan', 'Mindy');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa016', 'SA016', 'MEDINI SIGNATURE', 'MEDINI SIGNATURE', 750000, 'active', 'usr-intan', 'Mindy', 'usr-melissa', 'L362', '', 'For Sales SA016
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
Can direct forward this message to customer', 'D - UNKNOWN MARKET', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '5ROOM', 'T2-15-W3', '1395SQFT', 'https://drive.google.com/drive/folders/1bAKYmqLgsimQr7mMyCEVkUT0-ri8V65t', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa016', 'SA016', 'MEDINI SIGNATURE', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa016', 'SA016', '✓ ALL OK', '50/50');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa017', 'SA017', 'JALAN KENANGA 29/11, KULAI', 'JALAN KENANGA 29/11, KULAI', 1350000, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'SHAUN LOW', '+60197723689', 'For Sales SA017
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
Can direct forward this message to customer', 'B - AT MARKET PRICE', 'sale', 'JOHOR', 'C- SHOPLOT / RETAIL', '4STOREY, SHOPLOT, INNER ROAD', '442', '1680SQFT', 'https://drive.google.com/drive/folders/1tdQgiktbHTxFCupll5yip7Ydn7yWcIcJ', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa017', 'SA017', 'JALAN KENANGA 29/11, KULAI', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa017', 'SA017', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa017', 'SA017', '⭕房源核心判断条件：
1.该区域过去交易量是否活跃
2.价格是否低于该区域过往2年的成交价

❌不达标条件-1.18mil最低价', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa018', 'SA018', 'JALAN KENANGA 29/11, KULAI', 'JALAN KENANGA 29/11, KULAI', 1350000, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'SHAUN LOW', '+60197723689', '*For Sales SA018*
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
Can direct forward this message to customer', 'B - AT MARKET PRICE', 'sale', 'JOHOR', 'C- SHOPLOT / RETAIL', '4STOREY, SHOPLOT, INNER ROAD', '443', '1680SQFT', 'https://drive.google.com/drive/folders/11D9xxd718XUA3_isJ1WloDTdzF906EPE', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa018', 'SA018', 'JALAN KENANGA 29/11, KULAI', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa018', 'SA018', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa018', 'SA018', '⭕房源核心判断条件：
1.该区域过去交易量是否活
2.价格是否低于该区域过往2年的成交价

❌不达标条件-1.18mil最低价', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa019', 'SA019', 'JALAN KENANGA 29/11, KULAI', 'JALAN KENANGA 29/11, KULAI', 2700000, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'SHAUN LOW', '+60197723689', 'For Sales SA019
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
Can direct forward this message to customer', 'B - AT MARKET PRICE', 'sale', 'JOHOR', 'C- SHOPLOT / RETAIL', '2 ADJOINING, 4STOREY, SHOPLOT, INNER ROAD', '442 - 443', '1680SQFT', 'https://drive.google.com/drive/folders/12HtRh15f80tnV2olWw_NWmfEzLbuhvht', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa019', 'SA019', 'JALAN KENANGA 29/11, KULAI', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa019', 'SA019', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa019', 'SA019', '⭕房源核心判断条件：
1.该区域过去交易量是否活跃
2.价格是否低于该区域过往2年的成交价

❌不达标条件-1.18mil/per unit最低价', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa020', 'SA020', 'MIDORI GREEN', 'MIDORI GREEN', 499500, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'JEFFERY', '+60 19-775 8055', 'For Sales SA020
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
Can direct forward this message to customer', 'C - OVERPRICED', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '3ROOM', 'B2 08-20', '1030SQFT', 'https://drive.google.com/drive/folders/1H1JrebJXBkyLBhELJjh8PeJCOPtxQWLf', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa020', 'SA020', 'MIDORI GREEN', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa020', 'SA020', 'JACQUEEN', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa020', 'SA020', 'RM450K nett
---------------------------
⭕房源核心判断条件：
1.该区域过去交易量是否活跃', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa021', 'SA021', 'RNF PRINCESS COVE PHASE 1', 'RNF PRINCESS COVE PHASE 1', 1000300, 'inactive', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'LAHOME:
BENSON ', '', 'For Sales SA021
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
Can direct forward this message to customer', 'G - CASE COMPLETED', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '3ROOM', 'A5-2-1701', '1129SQFT', 'https://drive.google.com/drive/folders/19zTSOkrVmoR20OGNO9hJpH5yOXepxdoJ', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa021', 'SA021', 'RNF PRINCESS COVE PHASE 1', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa021', 'SA021', '', '');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa022', 'SA022', 'PARAGON RESIDENCE', 'PARAGON RESIDENCE', 850000, 'active', 'usr-intan', 'Mindy', 'usr-melissa', 'Y049', '017-4353055', 'For Sales SA022
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
Can direct forward this message to customer', 'D - UNKNOWN MARKET', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '3ROOM', 'A 25-08', '1044SQFT', 'https://drive.google.com/drive/folders/1KuFUmM0SVdgEbizQzmrN1kMUUSDq7NKc', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa022', 'SA022', 'PARAGON RESIDENCE', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa022', 'SA022', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa022', 'SA022', 'Referral 0.5%', 'usr-intan', 'Mindy');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa023', 'SA023', 'D'' AMBIENCE RESIDENCES', 'D'' AMBIENCE RESIDENCES', 438000, 'inactive', 'usr-sales-sarah', 'Sarah Connor (Sales Team)', 'usr-melissa', 'LISLIE', '', 'For Sales SA023
D'' Ambience Residences
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
Can direct forward this message to customer', 'G - CASE COMPLETED', 'sale - coagency', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '3ROOM, CORNER LOT', 'B 05-01', '1114 SQFT', 'https://drive.google.com/drive/folders/1eOs51aBjUp0L89TDF8MMBPnu6KtarjSV', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa023', 'SA023', 'D'' AMBIENCE RESIDENCES', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa023', 'SA023', '', '');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa023', 'SA023', 'Open loan
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

Use Vendor lawyer DGK', 'usr-sales-sarah', 'Sarah Connor (Sales Team)');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa024', 'SA024', 'CUBE 166, JP PERDANA, JALAN JAYA PUTRA 3/2', 'CUBE 166, JP PERDANA, JALAN JAYA PUTRA 3/2', 680000, 'inactive', 'usr-sales-sarah', 'Sarah Connor (Sales Team)', 'usr-melissa', 'EDWARD', '165166214.0', 'For Sales SA024
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
Can direct forward this message to customer', 'G - CASE COMPLETED', 'sale - coagency', 'JOHOR', 'R- TERRACE HOUSE', '2STOREY ', '01-19', '18X65SQFT', 'https://drive.google.com/drive/folders/1Y5qvtjWXNooZTFlf9uOxvUQRMWDq31dR', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa024', 'SA024', 'CUBE 166, JP PERDANA, JALAN JAYA PUTRA 3/2', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa024', 'SA024', '', '');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa024', 'SA024', 'Owner take back Rm 650k 
Big commission 30k

Open loan
Allow murkup up loan , RBGT 15% 
Bare owner legal fee', 'usr-sales-sarah', 'Sarah Connor (Sales Team)');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa025', 'SA025', 'WAVE MARINA COVE', 'WAVE MARINA COVE', 420000, 'active', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'BONG MY ', '+60168969629', 'For Sales SA025
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
Can direct forward this message to customer', 'C - OVERPRICED', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '1ROOM', 'D 28-04', '526SQFT', 'https://drive.google.com/drive/folders/1mXPhC0J3GLpEbyEzNRXlzNMLEbFtGoys', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa025', 'SA025', 'WAVE MARINA COVE', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa025', 'SA025', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa025', 'SA025', 'Fully Furnished
Contract end Jan 2026
客厅是全落地玻璃.
照片的单位是D-2904的照片.
所以D2804 是全落地玻璃

-------------------------------
⭕房源核心判断条件：
1.该区域过去交易量是否活跃', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa026', 'SA026', 'PANDAN RESIDENCE 2', 'PANDAN RESIDENCE 2', 480000, 'inactive', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'YOONSENG', '167587620.0', 'For Sales SA026
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
Can direct forward this message to customer', 'G - NOT AVAILABLE', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', '3ROOM, +1ROOM', '22-08', '1405SQFT', 'https://drive.google.com/drive/folders/1UcWmIvHaNodfN8klZ2XGjtCpmv3TKHnN', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa026', 'SA026', 'PANDAN RESIDENCE 2', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa026', 'SA026', '✓ ALL OK', '50/50');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa026', 'SA026', 'Owner take back 441k', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa027', 'SA027', 'COUNTRY GARDEN@CENTRAL PARK', 'COUNTRY GARDEN@CENTRAL PARK', 250000, 'inactive', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'JIA YIN', '+60 11-2676 4542', 'For Sales SA027
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
Can direct forward this message to customer', 'G - NOT AVAILABLE', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', 'STUDIO', 'B-13-12', '403SQFT', 'https://drive.google.com/drive/folders/1GSJKDfLv_NpOiPtY3VY2WFHL0W8-lnCS', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa027', 'SA027', 'COUNTRY GARDEN@CENTRAL PARK', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa027', 'SA027', '', '');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa027', 'SA027', 'MOT pending — to be completed concurrently with the sale transaction', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa028', 'SA028', 'JALAN PERMAS 15/1, BANDAR PERMAS JAYA', 'JALAN PERMAS 15/1, BANDAR PERMAS JAYA', 1750000, 'inactive', 'usr-sales-sarah', 'Gyden', 'usr-melissa', 'RYAN ANG', '167798666.0', 'For Sales SA028
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
Can direct forward this message to customer', 'G - CASE COMPLETED', 'sale', 'JOHOR', 'C- SHOPLOT / RETAIL', '3STOREY, SHOP OFFICE, MAIN ROAD', '10', '24X70SQFT', 'https://drive.google.com/drive/folders/10yrQupVpowtVaFI0Gzt6qoF3c80C-7Nb', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa028', 'SA028', 'JALAN PERMAS 15/1, BANDAR PERMAS JAYA', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa028', 'SA028', '', '');
INSERT INTO public.listing_updates (id, property_id, remarks, updated_by, updated_by_name) VALUES ('upd-sa028', 'SA028', '2.5% Com', 'usr-sales-sarah', 'Gyden');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa029', 'SA029', 'ENCORP MARINA', 'ENCORP MARINA', 400000, 'active', 'usr-intan', 'Mindy', 'usr-melissa', 'Y103', '016-7118215', 'For Sales SA029
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
Can direct forward this message to customer', 'B - AT MARKET PRICE', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', 'STUDIO', 'T2-18-03', '716SQFT', 'https://drive.google.com/drive/folders/1EgBtGHgQiu6FNhA9a77OzgRgk5YKdmbj', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa029', 'SA029', 'ENCORP MARINA', false, 'published', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa029', 'SA029', '✓ ALL OK', '50/50');
INSERT INTO public.master_listings (id, property_id, title, address, price, status, salesperson_id, salesperson_name, verified_by, owner_name, owner_contact, raw_wa_template, market_rating, sale_rent, state, property_type, rooms_remarks, unit_no, size, gdrive_link, created_at) VALUES ('mst-sa030', 'SA030', 'ENCORP MARINA', 'ENCORP MARINA', 450000, 'inactive', 'usr-intan', 'Mindy', 'usr-melissa', 'L205', '+60 16-442 1088', 'For Sales SA030
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
Can direct forward this message to customer', 'E - LISTING ON HOLD', 'sale', 'JOHOR', 'R- APT/ CONDO / SR / FLAT', 'STUDIO', 'T2-30-XX', '749SQFT', 'https://drive.google.com/drive/folders/1VighHYTaLcA3ikkas4UpUUUZBMQ7YcIZ', '2026-04-01 00:00:00');
INSERT INTO public.advertising (id, property_id, title, selected_by_sales, status, iproperty_link, propertyguru_link) VALUES ('adv-sa030', 'SA030', 'ENCORP MARINA', false, 'pending', '', '');
INSERT INTO public.matching_coa (id, property_id, external_agent_name, commission_split) VALUES ('coa-sa030', 'SA030', '✓ ALL OK', '50/50');
COMMIT;