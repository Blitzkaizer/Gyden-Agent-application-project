import React, { useState, useEffect } from 'react';
import { Megaphone, Users, Search, Lock, Save, ExternalLink, Activity } from 'lucide-react';
import { dbService } from '../services/db';
import type { Advertising, MatchingCoa, User } from '../services/db';

const extractAdId = (link: string | null | undefined): string | null => {
  if (!link) return null;
  const match = link.match(/\d+/);
  return match ? match[0] : null;
};


interface AdsCoAgencyProps {
  currentUser: User;
}

export const AdsCoAgencyView: React.FC<AdsCoAgencyProps> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'ads' | 'coa'>('ads');
  const [adsList, setAdsList] = useState<Advertising[]>([]);
  const [coaList, setCoaList] = useState<MatchingCoa[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Error/Success state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Row Edit state
  const [editPropId, setEditPropId] = useState<string | null>(null);

  // Sub-states for Ads editing
  const [adStatus, setAdStatus] = useState<'pending' | 'published'>('pending');
  const [iproperty, setIproperty] = useState('');
  const [propertyguru, setPropertyguru] = useState('');

  // Sub-states for COA editing
  const [coaAgentName, setCoaAgentName] = useState('');
  const [coaAgentContact, setCoaAgentContact] = useState('');
  const [coaSplit, setCoaSplit] = useState('');
  const [coaRemarks, setCoaRemarks] = useState('');

  const loadData = async () => {
    try {
      const [adsData, coaData] = await Promise.all([
        dbService.getAdvertisingListings(),
        dbService.getMatchingCoaListings()
      ]);
      setAdsList(adsData);
      setCoaList(coaData);
    } catch (err) {
      console.error('Error fetching Ads/Coa data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 1. ADVERTISING ACTION HANDLERS
  const handleToggleSalesSelection = async (propertyId: string, currentVal: boolean) => {
    try {
      await dbService.updateAdvertisingSelection(propertyId, !currentVal);
      loadData();
    } catch (err) {
      console.error('Sales selection update failed:', err);
    }
  };

  const startEditAd = (item: Advertising) => {
    setEditPropId(item.property_id);
    setAdStatus(item.status);
    setIproperty(item.iproperty_link);
    setPropertyguru(item.propertyguru_link);
    setError('');
  };

  const saveAdChanges = async (propertyId: string) => {
    setError('');
    setSuccess('');
    try {
      await dbService.updateAdvertisingLinks(propertyId, adStatus, iproperty, propertyguru);
      setSuccess(`Advertising links saved for property ${propertyId}`);
      setEditPropId(null);
      loadData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Advertising links save failed.');
    }
  };

  // 2. CO-AGENCY ACTION HANDLERS
  const startEditCoa = (item: MatchingCoa) => {
    setEditPropId(item.property_id);
    setCoaAgentName(item.external_agent_name);
    setCoaAgentContact(item.external_agent_contact);
    setCoaSplit(item.commission_split);
    setCoaRemarks(item.remarks);
    setError('');
  };

  const saveCoaChanges = async (propertyId: string) => {
    setError('');
    setSuccess('');
    try {
      await dbService.updateMatchingCoa(propertyId, coaAgentName, coaAgentContact, coaSplit, coaRemarks);
      setSuccess(`Co-broke broker details saved for property ${propertyId}`);
      setEditPropId(null);
      loadData();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Co-agency details save failed.');
    }
  };

  // Filters
  const filteredAds = adsList.filter(a => a.property_id.toLowerCase().includes(search.toLowerCase()) || a.title.toLowerCase().includes(search.toLowerCase()));
  const filteredCoa = coaList.filter(c => c.property_id.toLowerCase().includes(search.toLowerCase()) || c.external_agent_name.toLowerCase().includes(search.toLowerCase()));

  // RBAC checks
  const isIntanOrAdmin = currentUser.role === 'listing_intan' || currentUser.role === 'admin';
  const isCoaOrAdmin = currentUser.role === 'coagency' || currentUser.role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
            OPERATIONAL TRACKS // <span className="text-glow-cyan" style={{ color: 'var(--color-cyan)' }}>PARALLEL PATHS</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Flag active properties for marketing links (Intan) or map co-broker matches (Jacqueen/Boonsiong).
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', padding: '4px', borderRadius: '8px', display: 'flex', gap: '4px' }}>
          <button 
            className={`cyber-button ${activeTab === 'ads' ? '' : 'cyber-button-secondary'}`}
            onClick={() => { setActiveTab('ads'); setSearch(''); setEditPropId(null); }}
            style={{ padding: '6px 16px', fontSize: '0.8rem' }}
          >
            <Megaphone size={14} /> Marketing (ADVERTISING)
          </button>
          <button 
            className={`cyber-button ${activeTab === 'coa' ? '' : 'cyber-button-secondary'}`}
            onClick={() => { setActiveTab('coa'); setSearch(''); setEditPropId(null); }}
            style={{ padding: '6px 16px', fontSize: '0.8rem' }}
          >
            <Users size={14} /> Co-Agency (MATCHING_COA)
          </button>
        </div>
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

      {/* Search Filter */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="cyber-input" 
            placeholder={activeTab === 'ads' ? "Search advertising properties..." : "Search co-agency records by ID or broker..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Tab 1: Advertising sheet view */}
      {activeTab === 'ads' && (
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Syncing ads records...</div>
          ) : filteredAds.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No advertising files match search query.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.2)', color: 'var(--color-cyan)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                  <th style={{ padding: '10px 12px' }}>FLAG</th>
                  <th style={{ padding: '10px 12px' }}>PROP ID</th>
                  <th style={{ padding: '10px 12px' }}>TITLE</th>
                  <th style={{ padding: '10px 12px' }}>AD LINKS (IPROPERTY / PROPERTYGURU)</th>
                  <th style={{ padding: '10px 12px' }}>ADS STATUS</th>
                  <th style={{ padding: '10px 12px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredAds.map(item => {
                  const isEditing = editPropId === item.property_id;
                  
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      {/* Flag Checkbox (Sales edits selection) */}
                      <td style={{ padding: '12px' }}>
                        <input 
                          type="checkbox"
                          checked={item.selected_by_sales}
                          onChange={() => handleToggleSalesSelection(item.property_id, item.selected_by_sales)}
                          style={{ accentColor: 'var(--color-purple)', cursor: 'pointer' }}
                          title="Toggle Sales Selection"
                        />
                      </td>

                      {/* Prop ID */}
                      <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--color-cyan)', fontWeight: 600 }}>
                        {item.property_id}
                      </td>

                      {/* Title */}
                      <td style={{ padding: '12px', fontWeight: 550 }}>
                        {item.title}
                      </td>

                      {/* Links */}
                      <td style={{ padding: '12px' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <input 
                              type="text" 
                              className="cyber-input" 
                              value={iproperty}
                              onChange={e => setIproperty(e.target.value)}
                              placeholder="iProperty URL"
                              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                            />
                            <input 
                              type="text" 
                              className="cyber-input" 
                              value={propertyguru}
                              onChange={e => setPropertyguru(e.target.value)}
                              placeholder="PropertyGuru URL"
                              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                            />
                          </div>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                            {item.iproperty_link ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <a 
                                  href={item.iproperty_link} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="cyber-badge cyber-badge-cyan" 
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                >
                                  iProperty <ExternalLink size={10} />
                                </a>
                                {extractAdId(item.iproperty_link) && (
                                  <a 
                                    href={`https://www.iproperty.com.my/pro/v2/add-listing/${extractAdId(item.iproperty_link)}#/gallery`}
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="cyber-badge cyber-badge-purple" 
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                    title="Edit Gallery"
                                  >
                                    Gallery Editor <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>[iProperty link pending]</span>
                            )}
                            {item.propertyguru_link ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <a 
                                  href={item.propertyguru_link} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="cyber-badge cyber-badge-green" 
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                >
                                  PropertyGuru <ExternalLink size={10} />
                                </a>
                                {extractAdId(item.propertyguru_link) && (
                                  <a 
                                    href={`https://agentnet.propertyguru.com.my/v3/create-listing/${extractAdId(item.propertyguru_link)}#/gallery`}
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="cyber-badge cyber-badge-purple" 
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
                                    title="Edit Gallery"
                                  >
                                    Gallery Editor <ExternalLink size={10} />
                                  </a>
                                )}
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>[PropertyGuru link pending]</span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Ads Status */}
                      <td style={{ padding: '12px' }}>
                        {isEditing ? (
                          <select 
                            className="cyber-input"
                            value={adStatus}
                            onChange={e => setAdStatus(e.target.value as any)}
                            style={{ padding: '4px', fontSize: '0.75rem' }}
                          >
                            <option value="pending">PENDING</option>
                            <option value="published">PUBLISHED</option>
                          </select>
                        ) : (
                          <span className={`cyber-badge ${item.status === 'published' ? 'cyber-badge-green' : 'cyber-badge-purple'}`}>
                            {item.status}
                          </span>
                        )}
                      </td>

                      {/* Edit buttons */}
                      <td style={{ padding: '12px' }}>
                        {isIntanOrAdmin ? (
                          isEditing ? (
                            <button 
                              onClick={() => saveAdChanges(item.property_id)}
                              className="cyber-button"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              <Save size={12} /> Save
                            </button>
                          ) : (
                            <button 
                              onClick={() => startEditAd(item)}
                              className="cyber-button cyber-button-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              Update Link
                            </button>
                          )
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            <Lock size={10} /> Locked (Intan)
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Tab 2: Co-Agency sheet view */}
      {activeTab === 'coa' && (
        <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center' }}>Syncing COA records...</div>
          ) : filteredCoa.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No co-agency match files.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.2)', color: 'var(--color-cyan)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                  <th style={{ padding: '10px 12px' }}>PROP ID</th>
                  <th style={{ padding: '10px 12px' }}>EXTERNAL BROKER</th>
                  <th style={{ padding: '10px 12px' }}>AGENT CONTACT</th>
                  <th style={{ padding: '10px 12px' }}>COMMISSION SPLIT</th>
                  <th style={{ padding: '10px 12px' }}>CO-BROKE REMARKS</th>
                  <th style={{ padding: '10px 12px' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoa.map(item => {
                  const isEditing = editPropId === item.property_id;
                  
                  return (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      {/* ID */}
                      <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--color-cyan)', fontWeight: 600 }}>
                        {item.property_id}
                      </td>

                      {/* Agent Name */}
                      <td style={{ padding: '12px' }}>
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="cyber-input" 
                            value={coaAgentName}
                            onChange={e => setCoaAgentName(e.target.value)}
                            placeholder="Agent Name"
                            style={{ fontSize: '0.75rem', padding: '4px' }}
                          />
                        ) : (
                          item.external_agent_name || <span style={{ color: 'var(--text-muted)' }}>[Pending]</span>
                        )}
                      </td>

                      {/* Contact */}
                      <td style={{ padding: '12px', fontFamily: 'JetBrains Mono' }}>
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="cyber-input" 
                            value={coaAgentContact}
                            onChange={e => setCoaAgentContact(e.target.value)}
                            placeholder="Contact Number"
                            style={{ fontSize: '0.75rem', padding: '4px' }}
                          />
                        ) : (
                          item.external_agent_contact || <span style={{ color: 'var(--text-muted)' }}>-</span>
                        )}
                      </td>

                      {/* Commission split */}
                      <td style={{ padding: '12px' }}>
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="cyber-input" 
                            value={coaSplit}
                            onChange={e => setCoaSplit(e.target.value)}
                            placeholder="Split (e.g. 50/50)"
                            style={{ fontSize: '0.75rem', padding: '4px' }}
                          />
                        ) : (
                          item.commission_split ? (
                            <span className="cyber-badge cyber-badge-purple">{item.commission_split}</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>-</span>
                          )
                        )}
                      </td>

                      {/* Remarks */}
                      <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>
                        {isEditing ? (
                          <input 
                            type="text" 
                            className="cyber-input" 
                            value={coaRemarks}
                            onChange={e => setCoaRemarks(e.target.value)}
                            placeholder="Viewing rules..."
                            style={{ fontSize: '0.75rem', padding: '4px' }}
                          />
                        ) : (
                          item.remarks || <span style={{ color: 'var(--text-muted)' }}>No co-broker notes.</span>
                        )}
                      </td>

                      {/* Edit actions */}
                      <td style={{ padding: '12px' }}>
                        {isCoaOrAdmin ? (
                          isEditing ? (
                            <button 
                              onClick={() => saveCoaChanges(item.property_id)}
                              className="cyber-button"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              <Save size={12} /> Save
                            </button>
                          ) : (
                            <button 
                              onClick={() => startEditCoa(item)}
                              className="cyber-button cyber-button-secondary"
                              style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                            >
                              Update Match
                            </button>
                          )
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            <Lock size={10} /> Locked (Jacqueen)
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Advisor panel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', padding: '14px', borderRadius: '8px' }}>
        <Activity size={18} style={{ color: 'var(--color-purple)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <b>Security Audit:</b> Changes to marketing links and co-broke commissionsSplit values are recorded and attributed to verification keys instantly.
        </span>
      </div>

    </div>
  );
};
