import React, { useState, useEffect } from 'react';
import { Search, Lock, Edit2, MessageSquare, Send, Save, X, Upload } from 'lucide-react';
import { dbService } from '../services/db';
import type { MasterListing, ListingUpdate, User, Advertising, MatchingCoa, ResolvingSale } from '../services/db';
import { CsvImporterModal } from './CsvImporterModal';

interface MasterLedgerProps {
  currentUser: User;
}

export const MasterLedgerView: React.FC<MasterLedgerProps> = ({ currentUser }) => {
  const [listings, setListings] = useState<MasterListing[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showImporter, setShowImporter] = useState(false);

  // Follow-up drawer states
  const [selectedPropId, setSelectedPropId] = useState<string | null>(null);
  const [updates, setUpdates] = useState<ListingUpdate[]>([]);
  const [newRemark, setNewRemark] = useState('');
  const [loadingUpdates, setLoadingUpdates] = useState(false);

  // Copy states
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const triggerCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };
 
  // Inline edit state (Melissa / Admin only)
  const [editPropId, setEditPropId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStatus, setEditStatus] = useState<'active' | 'sold' | 'rented' | 'inactive'>('active');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Joined table states
  const [allUpdates, setAllUpdates] = useState<ListingUpdate[]>([]);
  const [allAds, setAllAds] = useState<Advertising[]>([]);
  const [allCoas, setAllCoas] = useState<MatchingCoa[]>([]);
  const [allResolving, setAllResolving] = useState<ResolvingSale[]>([]);

  const fetchMaster = async () => {
    try {
      const [listingsData, updatesData, adsData, coaData, resolvingData] = await Promise.all([
        dbService.getMasterListings(),
        dbService.getAllListingUpdates ? dbService.getAllListingUpdates() : dbService.getListingUpdates(''),
        dbService.getAdvertisingListings(),
        dbService.getMatchingCoaListings(),
        dbService.getResolvingSales()
      ]);
      setListings(listingsData);
      setAllUpdates(updatesData);
      setAllAds(adsData);
      setAllCoas(coaData);
      setAllResolving(resolvingData);
    } catch (err) {
      console.error('Error fetching master listings telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaster();
  }, []);

  // Fetch follow up logs when drawer opens
  const openFollowUpDrawer = async (propertyId: string) => {
    setSelectedPropId(propertyId);
    setNewRemark('');
    setLoadingUpdates(true);
    try {
      const data = await dbService.getListingUpdates(propertyId);
      setUpdates(data);
    } catch (err) {
      console.error('Error loading remarks updates:', err);
    } finally {
      setLoadingUpdates(false);
    }
  };

  const handleAddRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropId || !newRemark.trim()) return;

    try {
      await dbService.createListingUpdate(selectedPropId, newRemark.trim());
      setNewRemark('');
      // Reload
      const data = await dbService.getListingUpdates(selectedPropId);
      setUpdates(data);
    } catch (err) {
      console.error('Remarks logging failed:', err);
    }
  };

  // Start inline editing
  const startEdit = (listing: MasterListing) => {
    setEditPropId(listing.property_id);
    setEditPrice(listing.price.toString());
    setEditStatus(listing.status);
    setError('');
  };

  const saveEdit = async (propertyId: string) => {
    setError('');
    setSuccess('');
    const parsedPrice = parseFloat(editPrice.replace(/,/g, ''));
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      setError('Invalid price parameter.');
      return;
    }

    try {
      await dbService.updateMasterListing(propertyId, parsedPrice, editStatus);
      setSuccess(`Property ${propertyId} updated successfully.`);
      setEditPropId(null);
      fetchMaster();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Verification update failed.');
    }
  };

  // Timing-based Follow-up status checker (Excel Q Tracker logic)
  const getFollowUpStatus = (item: MasterListing, propUpdates: ListingUpdate[]): 'NOT NEEDED' | 'FOLLOW UP NEEDED' | 'FOLLOW UP SOON' | 'UP TO DATE' => {
    const rating = (item.market_rating || '').toUpperCase();
    if (!rating || rating.includes('COAGENCY')) {
      return 'NOT NEEDED';
    }

    const validRatings = [
      'A+ SUPER HOT DEAL', 'A+','SUPER HOT DEAL',
      'A - BELOW MARKET', 'A', 'BELOW MARKET',
      'B+ - CASH OUT', 'B+', 'CASH OUT',
      'B - AT MARKET PRICE', 'B', 'AT MARKET PRICE',
      'C - OVERPRICED', 'C', 'OVERPRICED',
      'D - UNKNOWN MARKET', 'D', 'UNKNOWN MARKET',
      'E - LISTING ON HOLD', 'E', 'ON HOLD', 'LISTING ON HOLD'
    ];

    const isValidRating = validRatings.some(vr => rating.includes(vr));
    if (!isValidRating) {
      return 'NOT NEEDED';
    }

    if (propUpdates.length === 0) {
      return 'FOLLOW UP NEEDED';
    }

    const lastDate = new Date(propUpdates[0].updated_at);
    const diffTime = Math.abs(new Date().getTime() - lastDate.getTime());
    const elapsedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const isSale = (item.sale_rent || '').toLowerCase() === 'sale';
    const isOverpricedOrHold = rating.includes('C - OVERPRICED') || rating.includes('C ') || rating.includes('E - LISTING ON HOLD') || rating.includes('E ');
    const isResidentialRental = !isSale && (
      (item.property_type || '').toUpperCase().startsWith('R') ||
      (item.property_id || '').toUpperCase().startsWith('R')
    );

    if (isSale) {
      if (elapsedDays > 60) return 'FOLLOW UP NEEDED';
      if (elapsedDays > 46) return 'FOLLOW UP SOON';
      return 'UP TO DATE';
    } else {
      if (isOverpricedOrHold) {
        if (elapsedDays > 180) return 'FOLLOW UP NEEDED';
        if (elapsedDays > 90) return 'FOLLOW UP SOON';
        return 'UP TO DATE';
      } else if (isResidentialRental) {
        if (elapsedDays > 30) return 'FOLLOW UP NEEDED';
        if (elapsedDays > 21) return 'FOLLOW UP SOON';
        return 'UP TO DATE';
      } else {
        if (elapsedDays > 60) return 'FOLLOW UP NEEDED';
        if (elapsedDays > 46) return 'FOLLOW UP SOON';
        return 'UP TO DATE';
      }
    }
  };

  // Cross-sheet sheets existence checker (Excel Column V logic)
  const getAllSheetsStatus = (item: MasterListing): string => {
    const existsCoa = allCoas.some(c => c.property_id === item.property_id);
    const existsUpdate = allUpdates.some(u => u.property_id === item.property_id);
    const existsAd = allAds.some(a => a.property_id === item.property_id);
    const existsResolving = allResolving.some(r => r.property_id === item.property_id);

    if (!existsCoa) return 'Missing Coagency';
    if (!existsUpdate) return 'Missing Listing Update';
    if (!existsResolving) return 'Missing Resolving';
    if (!existsAd) return 'Missing Listing';
    return '✓';
  };

  // Filter listings
  const filteredListings = listings.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase()) || 
                          l.property_id.toLowerCase().includes(search.toLowerCase()) ||
                          l.address.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? l.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  // Sort listings: SA -> SZ -> RA -> RZ, then numerically (Excel sorting alignment)
  const sortedListings = [...filteredListings].sort((a, b) => {
    const getSortWeight = (code: string) => {
      const upper = code.toUpperCase();
      if (upper.startsWith('SA')) return 1;
      if (upper.startsWith('SZ')) return 2;
      if (upper.startsWith('RA')) return 3;
      if (upper.startsWith('RZ')) return 4;
      return 5;
    };

    const weightA = getSortWeight(a.property_id);
    const weightB = getSortWeight(b.property_id);

    if (weightA !== weightB) {
      return weightA - weightB;
    }

    const numA = parseInt(a.property_id.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.property_id.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });

  const isMelissaOrAdmin = currentUser.role === 'listing_melissa' || currentUser.role === 'admin';
  const selectedListing = listings.find(l => l.property_id === selectedPropId);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
            MASTER REGISTRY // <span className="text-glow-cyan" style={{ color: 'var(--color-cyan)' }}>MASTER DATABASE</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Single source of truth for properties. Prices and statuses are protected. Listing Team (Melissa) manages master listings.
          </p>
        </div>
        <button 
          onClick={() => setShowImporter(true)}
          className="cyber-button"
          type="button"
          style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Upload size={14} /> Import Bulk CSV
        </button>
      </div>

      {success && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--color-green)', padding: '10px 14px', borderRadius: '6px', color: 'var(--color-green)', fontSize: '0.8rem' }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid var(--color-red)', padding: '10px 14px', borderRadius: '6px', color: 'var(--color-red)', fontSize: '0.8rem' }}>
          {error}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="cyber-input" 
            placeholder="Search by Property ID, Title, or Coordinates..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ minWidth: '150px' }}>
          <select 
            className="cyber-input"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Grid: Master table + Follow up log drawer */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedPropId ? '1.2fr 0.8fr' : '1fr', gap: '24px', transition: 'grid-template-columns 0.3s ease' }}>
        
        {/* Ledger Table */}
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto', maxHeight: '72vh', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center' }}>Syncing data node records...</div>
          ) : filteredListings.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No verified properties match query.
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.2)', color: 'var(--color-cyan)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                  <th className="cyber-table-header-cell">MARKET RATING</th>
                  <th className="cyber-table-header-cell">CODE</th>
                  <th className="cyber-table-header-cell">STATUS</th>
                  <th className="cyber-table-header-cell">SALE/ RENT</th>
                  <th className="cyber-table-header-cell">STATE</th>
                  <th className="cyber-table-header-cell">PROPERTY TYPE</th>
                  <th className="cyber-table-header-cell">ROOMS / REMARKS</th>
                  <th className="cyber-table-header-cell">ADDRESS</th>
                  <th className="cyber-table-header-cell">UNIT NO</th>
                  <th className="cyber-table-header-cell">SIZE</th>
                  <th className="cyber-table-header-cell">OWNER/ AGENT NAME</th>
                  <th className="cyber-table-header-cell">CONTACT</th>
                  <th className="cyber-table-header-cell">PIC</th>
                  <th className="cyber-table-header-cell">GDRIVE LINK</th>
                  <th className="cyber-table-header-cell">WA TEMPLATE</th>
                  <th className="cyber-table-header-cell">PRICE</th>
                  <th className="cyber-table-header-cell">REMARK</th>
                  <th className="cyber-table-header-cell">LAST FOLLOW UP</th>
                  <th className="cyber-table-header-cell">FOLLOW UP</th>
                  <th className="cyber-table-header-cell">AD</th>
                  <th className="cyber-table-header-cell">CO-AGENCY DUE</th>
                  <th className="cyber-table-header-cell">ALL SHEETS</th>
                  <th className="cyber-table-header-cell">DATE ADDED</th>
                  <th className="cyber-table-header-cell">PRIVATE REMARKS</th>
                  <th className="cyber-table-header-cell">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {sortedListings.map(item => {
                  const isEditing = editPropId === item.property_id;
                  
                  // Mapped follow ups & updates
                  const propUpdates = allUpdates.filter(u => u.property_id === item.property_id);
                  const latestRemark = propUpdates.length > 0 ? propUpdates[0].remarks : '';
                  const lastFollowUpDate = propUpdates.length > 0 ? new Date(propUpdates[0].updated_at).toLocaleDateString('en-GB') : '';

                  // Mapped ads
                  const adItem = allAds.find(a => a.property_id === item.property_id);
                  const adText = adItem ? adItem.status.toUpperCase() : 'PENDING';

                  // Mapped coagency
                  const coaItem = allCoas.find(c => c.property_id === item.property_id);
                  const coaText = coaItem && coaItem.external_agent_name 
                    ? `${coaItem.external_agent_name} (${coaItem.commission_split})` 
                    : 'None';
                  
                  return (
                    <tr 
                      key={item.id}
                      className="cyber-table-row"
                      style={{ 
                        borderBottom: '1px solid var(--border-glass)',
                        background: selectedPropId === item.property_id ? 'rgba(6,182,212,0.06)' : 'transparent',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {/* 1. MARKET RATING */}
                      <td style={{ padding: '12px', fontWeight: 700, color: 'var(--color-amber)', textShadow: (item.market_rating === 'A+' || item.market_rating === 'A') ? '0 0 8px var(--color-amber-glow)' : 'none' }}>
                        {item.market_rating || 'D'}
                      </td>
 
                      {/* 2. CODE */}
                      <td style={{ padding: '12px' }}>
                        <span 
                          onClick={() => openFollowUpDrawer(item.property_id)}
                          className="cyber-code-badge"
                          style={{ cursor: 'pointer' }}
                        >
                          {item.property_id}
                        </span>
                      </td>

                      {/* 2.5 STATUS */}
                      <td style={{ padding: '12px' }}>
                        {isEditing ? (
                          <select
                            className="cyber-input"
                            value={editStatus}
                            onChange={e => setEditStatus(e.target.value as any)}
                            style={{ padding: '2px 6px', fontSize: '0.8rem', background: '#090d16', color: 'white', width: '90px' }}
                          >
                            <option value="active">Active</option>
                            <option value="sold">Sold</option>
                            <option value="rented">Rented</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        ) : (
                          <span className={`cyber-badge ${
                            item.status === 'active' ? 'cyber-badge-green' :
                            item.status === 'sold' ? 'cyber-badge-amber' :
                            item.status === 'rented' ? 'cyber-badge-cyan' :
                            'cyber-badge-red'
                          }`} style={{ fontSize: '0.65rem' }}>
                            {item.status ? item.status.toUpperCase() : 'ACTIVE'}
                          </span>
                        )}
                      </td>
 
                      {/* 3. SALE/ RENT */}
                      <td style={{ padding: '12px', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 600 }}>
                        {item.sale_rent || 'SALE'}
                      </td>
 
                      {/* 4. STATE */}
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {item.state || 'Selangor'}
                      </td>
 
                      {/* 5. PROPERTY TYPE */}
                      <td style={{ padding: '12px' }}>
                        {item.property_type || 'N/A'}
                      </td>
 
                      {/* 6. ROOMS / REMARKS */}
                      <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.rooms_remarks}>
                        {item.rooms_remarks || 'N/A'}
                      </td>
 
                      {/* 7. ADDRESS */}
                      <td style={{ padding: '12px', maxWidth: '185px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.address}>
                        {item.address}
                      </td>
 
                      {/* 8. UNIT NO */}
                      <td style={{ padding: '12px', fontFamily: 'JetBrains Mono' }}>
                        {item.unit_no || 'N/A'}
                      </td>
 
                      {/* 9. SIZE */}
                      <td style={{ padding: '12px' }}>
                        {item.size || 'N/A'}
                      </td>
 
                      {/* 10. OWNER/ AGENT NAME */}
                      <td style={{ padding: '12px' }}>
                        {item.owner_name || 'N/A'}
                      </td>
 
                      {/* 11. CONTACT */}
                      <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>
                        {item.owner_contact || 'N/A'}
                      </td>
 
                      {/* 12. PIC */}
                      <td style={{ padding: '12px', fontWeight: 500 }}>
                        {item.salesperson_name}
                      </td>
 
                      {/* 13. GDRIVE LINK */}
                      <td style={{ padding: '12px' }}>
                        {item.gdrive_link ? (
                          <a 
                            href={item.gdrive_link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={{ color: 'var(--color-cyan)', textDecoration: 'underline' }}
                          >
                            🔗 View Drive
                          </a>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
 
                      {/* 14. WA TEMPLATE */}
                      <td style={{ padding: '12px' }}>
                        {item.final_wa_template ? (
                          <button
                            type="button"
                            onClick={() => triggerCopy(item.final_wa_template, item.property_id)}
                            className="cyber-button cyber-button-secondary"
                            style={{ padding: '2px 8px', fontSize: '0.65rem' }}
                          >
                            {copiedField === item.property_id ? 'COPIED!' : '📋 COPY'}
                          </button>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>None</span>
                        )}
                      </td>
 
                      {/* 15. PRICE */}
                      <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', fontWeight: 650 }}>
                        {isEditing ? (
                          <input 
                            type="text"
                            className="cyber-input"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                            style={{ width: '90px', padding: '2px 6px', fontSize: '0.8rem' }}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span>RM {item.price.toLocaleString()}</span>
                            {!isMelissaOrAdmin && <Lock size={10} style={{ color: 'var(--text-muted)' }} />}
                          </div>
                        )}
                      </td>
 
                      {/* 16. REMARK */}
                      <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={latestRemark}>
                        {latestRemark || <span style={{ color: 'var(--text-muted)' }}>No follow-up</span>}
                      </td>
 
                      {/* 17. LAST FOLLOW UP */}
                      <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>
                        {lastFollowUpDate || 'Never'}
                      </td>
 
                      {/* 18. FOLLOW UP */}
                      <td style={{ padding: '12px' }}>
                        {(() => {
                          const status = getFollowUpStatus(item, propUpdates);
                          if (status === 'NOT NEEDED') {
                            return <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>NOT NEEDED</span>;
                          }
                          if (status === 'UP TO DATE') {
                            return <span className="cyber-badge cyber-badge-green" style={{ fontSize: '0.65rem' }}>✓ UP TO DATE</span>;
                          }
                          if (status === 'FOLLOW UP SOON') {
                            return <span className="cyber-badge cyber-badge-amber" style={{ fontSize: '0.65rem' }}>⚠ SOON</span>;
                          }
                          return <span className="cyber-badge cyber-badge-red" style={{ fontSize: '0.65rem' }}>FOLLOW UP NEEDED</span>;
                        })()}
                      </td>
 
                      {/* 19. AD */}
                      <td style={{ padding: '12px' }}>
                        {adText === 'PUBLISHED' ? (
                          <span className="cyber-badge cyber-badge-green" style={{ fontSize: '0.65rem' }}>✓ PUBLISHED</span>
                        ) : (
                          <span className="cyber-badge cyber-badge-purple" style={{ fontSize: '0.65rem' }}>PENDING</span>
                        )}
                      </td>
 
                      {/* 20. CO-AGENCY DUE */}
                      <td style={{ padding: '12px', color: 'var(--text-secondary)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={coaText}>
                        {coaText}
                      </td>
 
                      {/* 21. ALL SHEETS */}
                      <td style={{ padding: '12px' }}>
                        {(() => {
                          const status = getAllSheetsStatus(item);
                          if (status === '✓') {
                            return <span className="cyber-badge cyber-badge-green" style={{ fontSize: '0.65rem' }}>✓ OK</span>;
                          }
                          return <span className="cyber-badge cyber-badge-amber" style={{ fontSize: '0.65rem' }}>{status.toUpperCase()}</span>;
                        })()}
                      </td>
 
                      {/* 22. DATE ADDED */}
                      <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>
                        {new Date(item.created_at).toLocaleDateString('en-GB')}
                      </td>
 
                      {/* 23. PRIVATE REMARKS */}
                      <td style={{ padding: '12px', color: 'var(--text-muted)', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }} title={item.private_notes}>
                        {item.private_notes || 'None'}
                      </td>
 
                      {/* Actions */}
                      <td style={{ padding: '12px' }}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => openFollowUpDrawer(item.property_id)}
                            style={{ background: 'transparent', border: 'none', color: 'var(--color-purple)', cursor: 'pointer', display: 'flex', padding: '4px' }}
                            title="View Spec Dashboard & Remarks"
                          >
                            <MessageSquare size={14} />
                          </button>
 
                          {isMelissaOrAdmin && (
                            isEditing ? (
                              <div style={{ display: 'flex', gap: '4px' }}>
                                <button 
                                  onClick={() => saveEdit(item.property_id)}
                                  style={{ background: 'transparent', border: 'none', color: 'var(--color-green)', cursor: 'pointer' }}
                                >
                                  <Save size={14} />
                                </button>
                                <button 
                                  onClick={() => setEditPropId(null)}
                                  style={{ background: 'transparent', border: 'none', color: 'var(--color-red)', cursor: 'pointer' }}
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ) : (
                              <button 
                                onClick={() => startEdit(item)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--color-cyan)', cursor: 'pointer' }}
                                title="Edit Price & Status"
                              >
                                <Edit2 size={14} />
                              </button>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Drawer: Spec Sheet Summary Dashboard + LISTING_UPDATE Follow-up Remarks list */}
        {selectedPropId && (
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: '82vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.8rem', color: 'var(--color-purple)' }}>
                SPEC SHEET DASHBOARD // {selectedPropId}
              </span>
              <button 
                onClick={() => setSelectedPropId(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', paddingRight: '4px' }}>
              {/* Spec Sheet Summary Grid */}
            {selectedListing && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', fontSize: '0.75rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>Property ID</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: 'var(--color-cyan)' }}>{selectedListing.property_id}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>Transaction Type</span>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{selectedListing.sale_rent}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>Property Type</span>
                    <span style={{ fontWeight: 600 }}>{selectedListing.property_type || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>State</span>
                    <span style={{ fontWeight: 600 }}>{selectedListing.state || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>Unit No</span>
                    <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600 }}>{selectedListing.unit_no || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>Size</span>
                    <span style={{ fontWeight: 600 }}>{selectedListing.size || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>Market Rating</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-amber)' }}>{selectedListing.market_rating || 'N/A'}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', display: 'block', textTransform: 'uppercase' }}>PIC (Salesperson)</span>
                    <span style={{ fontWeight: 600 }}>{selectedListing.salesperson_name}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Address</span>
                  <span style={{ background: 'rgba(0,0,0,0.15)', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    {selectedListing.address}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Rooms / Remarks</span>
                  <span style={{ background: 'rgba(0,0,0,0.15)', padding: '6px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)' }}>
                    {selectedListing.rooms_remarks || 'No remarks recorded.'}
                  </span>
                </div>

                {/* Google Drive folder link */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Google Drive Photos Folder</span>
                  {selectedListing.gdrive_link ? (
                    <a 
                      href={selectedListing.gdrive_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover-bright"
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        background: 'rgba(6,182,212,0.1)', 
                        border: '1px solid rgba(6,182,212,0.3)', 
                        padding: '8px 12px', 
                        borderRadius: '6px', 
                        color: 'var(--color-cyan)',
                        textDecoration: 'none',
                        fontFamily: 'JetBrains Mono',
                        fontSize: '0.7rem',
                        wordBreak: 'break-all'
                      }}
                    >
                      <span>🔗 VIEW PHOTOS ON GOOGLE DRIVE</span>
                    </a>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.7rem' }}>No Drive Link attached.</span>
                  )}
                </div>

                {/* Private notes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Private Notes (Confidential)</span>
                  <div style={{ 
                    background: 'rgba(239,68,68,0.05)', 
                    border: '1px solid rgba(239,68,68,0.2)', 
                    padding: '8px 12px', 
                    borderRadius: '6px', 
                    color: 'rgba(255, 255, 255, 0.8)',
                    lineHeight: '1.4'
                  }}>
                    {selectedListing.private_notes || 'No confidential remarks.'}
                  </div>
                </div>

                {/* Whatsapp copy templates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Raw WhatsApp Template</span>
                      <button 
                        type="button" 
                        onClick={() => triggerCopy(selectedListing.raw_wa_template, 'raw')}
                        style={{ background: 'none', border: 'none', color: 'var(--color-cyan)', fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'JetBrains Mono' }}
                      >
                        {copiedField === 'raw' ? 'COPIED!' : 'COPY'}
                      </button>
                    </div>
                    <textarea 
                      readOnly 
                      className="cyber-input font-mono" 
                      rows={3} 
                      value={selectedListing.raw_wa_template || ''} 
                      style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.2)', resize: 'none', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }} 
                      placeholder="No raw template available."
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.65rem', textTransform: 'uppercase' }}>Final WhatsApp Template</span>
                      <button 
                        type="button" 
                        onClick={() => triggerCopy(selectedListing.final_wa_template, 'final')}
                        style={{ background: 'none', border: 'none', color: 'var(--color-cyan)', fontSize: '0.65rem', cursor: 'pointer', fontFamily: 'JetBrains Mono' }}
                      >
                        {copiedField === 'final' ? 'COPIED!' : 'COPY'}
                      </button>
                    </div>
                    <textarea 
                      readOnly 
                      className="cyber-input font-mono" 
                      rows={3} 
                      value={selectedListing.final_wa_template || ''} 
                      style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.2)', resize: 'none', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }} 
                      placeholder="No final template available."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Follow-up logs section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: 'var(--color-purple)', borderBottom: '1px solid rgba(168,85,247,0.2)', paddingBottom: '4px' }}>
                ACTIVITY LOGS & REMARKS
              </span>

              {/* List updates */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                {loadingUpdates ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Syncing remarks...</span>
                ) : updates.length === 0 ? (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>No remarks recorded for this property.</span>
                ) : (
                  updates.map(log => (
                    <div key={log.id} style={{ display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '4px', border: '1px solid var(--border-glass)', fontSize: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.65rem', marginBottom: '2px' }}>
                        <span>{log.updated_by_name}</span>
                        <span>{new Date(log.updated_at).toLocaleDateString()}</span>
                      </div>
                      <span style={{ color: 'var(--text-secondary)', lineHeight: '1.3' }}>{log.remarks}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Add new update remark form (Open to ALL) */}
              <form onSubmit={handleAddRemark} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="cyber-input" 
                  placeholder="Type follow-up remark..."
                  value={newRemark}
                  onChange={e => setNewRemark(e.target.value)}
                  style={{ fontSize: '0.8rem', padding: '6px 10px' }}
                />
                <button type="submit" className="cyber-button" style={{ padding: '6px 10px', background: 'var(--color-purple)' }}>
                  <Send size={12} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      </div>

      {showImporter && (
        <CsvImporterModal 
          currentUser={currentUser} 
          onClose={() => setShowImporter(false)} 
          onImportComplete={fetchMaster} 
        />
      )}

    </div>
  );
};
