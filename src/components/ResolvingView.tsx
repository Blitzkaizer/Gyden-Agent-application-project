import React, { useState, useEffect } from 'react';
import { Search, Lock, ShieldCheck, Save, Edit, RefreshCw, AlertCircle } from 'lucide-react';
import { dbService } from '../services/db';
import type { ResolvingSale, MasterListing, User } from '../services/db';

interface ResolvingViewProps {
  currentUser: User;
}

export const ResolvingView: React.FC<ResolvingViewProps> = ({ currentUser }) => {
  const [deals, setDeals] = useState<ResolvingSale[]>([]);
  const [properties, setProperties] = useState<MasterListing[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Error/Success state
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Row Edit state
  const [editPropId, setEditPropId] = useState<string | null>(null);

  // Edit sub-states
  const [dealStage, setDealStage] = useState<'booking' | 'spa_signed' | 'loan_approved' | 'closed_sold' | 'closed_rented'>('booking');
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [legalStatus, setLegalStatus] = useState('');
  const [bankingStatus, setBankingStatus] = useState('');
  const [totalComm, setTotalComm] = useState('0');
  const [companyShare, setCompanyShare] = useState('0');
  const [agentShare, setAgentShare] = useState('0');

  const loadData = async () => {
    try {
      const [dealsData, propsData] = await Promise.all([
        dbService.getResolvingSales(),
        dbService.getMasterListings()
      ]);
      setDeals(dealsData);
      setProperties(propsData);
    } catch (err) {
      console.error('Error fetching resolving deals data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartEdit = (deal: ResolvingSale) => {
    setEditPropId(deal.property_id);
    setDealStage(deal.deal_stage);
    setBuyerName(deal.buyer_name);
    setBuyerContact(deal.buyer_contact);
    setLegalStatus(deal.legal_status);
    setBankingStatus(deal.banking_status);
    setTotalComm(deal.total_commission.toString());
    setCompanyShare(deal.company_share.toString());
    setAgentShare(deal.agent_share.toString());
    setError('');
  };

  const handleRecalculateSplits = (totalValStr: string) => {
    setTotalComm(totalValStr);
    const total = parseFloat(totalValStr);
    if (!isNaN(total) && total > 0) {
      // Calculate standard splits: 40% company, 60% agent
      setCompanyShare((total * 0.4).toFixed(2));
      setAgentShare((total * 0.6).toFixed(2));
    } else {
      setCompanyShare('0');
      setAgentShare('0');
    }
  };

  const handleSaveDeals = async (propertyId: string) => {
    setError('');
    setSuccess('');

    const parsedComm = parseFloat(totalComm);
    const parsedCompany = parseFloat(companyShare);
    const parsedAgent = parseFloat(agentShare);

    if (isNaN(parsedComm) || isNaN(parsedCompany) || isNaN(parsedAgent)) {
      setError('Invalid numeric formatting inside financial values.');
      return;
    }

    try {
      await dbService.updateResolvingSale(
        propertyId,
        dealStage,
        buyerName,
        buyerContact,
        legalStatus,
        bankingStatus,
        parsedComm,
        parsedCompany,
        parsedAgent
      );

      setSuccess(`Transaction resolution file saved. Master sync processed.`);
      setEditPropId(null);
      loadData();
      
      // Clear success notification
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Deal resolving file failed.');
    }
  };

  // Enforce ADMIN role security checks in component
  if (currentUser.role !== 'admin') {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--color-red)' }}>
        <Lock size={48} style={{ color: 'var(--color-red)', alignSelf: 'center' }} />
        <h3 className="text-glow-red" style={{ fontSize: '1.25rem', color: 'var(--color-red)' }}>ACCESS RESTRICTED</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Your user profile <b>{currentUser.email}</b> is not authorized to access deal resolving database nodes.
        </p>
      </div>
    );
  }

  const filteredDeals = deals.filter(d => d.property_id.toLowerCase().includes(search.toLowerCase()) || d.buyer_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
            TRANSACTION CLOSINGS // <span className="text-glow-cyan" style={{ color: 'var(--color-cyan)' }}>RESOLVING & SALES</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Verify deal closures, banking processes, legal timelines, and finalize transaction sheets.
          </p>
        </div>

        <button 
          className="cyber-button cyber-button-secondary"
          onClick={loadData}
          style={{ fontSize: '0.8rem', padding: '8px 16px' }}
        >
          <RefreshCw size={14} style={{ marginRight: '4px' }} /> Sync Table
        </button>
      </div>

      {success && (
        <div style={{ 
          background: 'rgba(16, 185, 129, 0.1)', 
          border: '1px solid var(--color-green)', 
          padding: '12px 16px', 
          borderRadius: '6px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          color: 'var(--color-green)',
          fontSize: '0.85rem'
        }}>
          <ShieldCheck size={16} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{ 
          background: 'rgba(244, 63, 94, 0.1)', 
          border: '1px solid var(--color-red)', 
          padding: '12px 16px', 
          borderRadius: '6px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          color: 'var(--color-red)',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="cyber-input" 
            placeholder="Search transactions by Property ID or Buyer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Deals list table */}
      <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Syncing deals...</div>
        ) : filteredDeals.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No deals resolved under search criteria.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.2)', color: 'var(--color-cyan)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                <th style={{ padding: '10px 12px' }}>PROP ID</th>
                <th style={{ padding: '10px 12px' }}>DEAL STAGE</th>
                <th style={{ padding: '10px 12px' }}>BUYER DETAIL</th>
                <th style={{ padding: '10px 12px' }}>LEGAL & BANKING</th>
                <th style={{ padding: '10px 12px' }}>COMMISSION (TOTAL/SPLIT)</th>
                <th style={{ padding: '10px 12px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map(item => {
                const isEditing = editPropId === item.property_id;
                const prop = properties.find(p => p.property_id === item.property_id);
                
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    
                    {/* ID */}
                    <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--color-cyan)', fontWeight: 600 }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>{item.property_id}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{prop?.title}</span>
                      </div>
                    </td>

                    {/* Deal Stage */}
                    <td style={{ padding: '12px' }}>
                      {isEditing ? (
                        <select 
                          className="cyber-input"
                          value={dealStage}
                          onChange={e => setDealStage(e.target.value as any)}
                          style={{ padding: '4px', fontSize: '0.75rem' }}
                        >
                          <option value="booking">BOOKING</option>
                          <option value="spa_signed">SPA SIGNED</option>
                          <option value="loan_approved">LOAN APPROVED</option>
                          <option value="closed_sold">CLOSED SOLD</option>
                          <option value="closed_rented">CLOSED RENTED</option>
                        </select>
                      ) : (
                        <span className={`cyber-badge ${
                          item.deal_stage.startsWith('closed') ? 'cyber-badge-green' : 'cyber-badge-purple'
                        }`}>
                          {item.deal_stage.toUpperCase()}
                        </span>
                      )}
                    </td>

                    {/* Buyer Details */}
                    <td style={{ padding: '12px' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input 
                            type="text" 
                            className="cyber-input" 
                            value={buyerName} 
                            onChange={e => setBuyerName(e.target.value)}
                            placeholder="Name"
                            style={{ fontSize: '0.75rem', padding: '4px' }}
                          />
                          <input 
                            type="text" 
                            className="cyber-input" 
                            value={buyerContact} 
                            onChange={e => setBuyerContact(e.target.value)}
                            placeholder="Contact"
                            style={{ fontSize: '0.75rem', padding: '4px' }}
                          />
                        </div>
                      ) : (
                        item.buyer_name ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 550 }}>{item.buyer_name}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{item.buyer_contact}</span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>[Awaiting Buyer]</span>
                        )
                      )}
                    </td>

                    {/* Legal & Banking */}
                    <td style={{ padding: '12px' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <input 
                            type="text" 
                            className="cyber-input" 
                            value={legalStatus} 
                            onChange={e => setLegalStatus(e.target.value)}
                            placeholder="Legal status"
                            style={{ fontSize: '0.75rem', padding: '4px' }}
                          />
                          <input 
                            type="text" 
                            className="cyber-input" 
                            value={bankingStatus} 
                            onChange={e => setBankingStatus(e.target.value)}
                            placeholder="Banking status"
                            style={{ fontSize: '0.75rem', padding: '4px' }}
                          />
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          <span>Legal: {legalStatus || item.legal_status}</span>
                          <span>Bank: {bankingStatus || item.banking_status}</span>
                        </div>
                      )}
                    </td>

                    {/* Commission */}
                    <td style={{ padding: '12px', fontFamily: 'JetBrains Mono' }}>
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Total Commission</label>
                          <input 
                            type="text" 
                            className="cyber-input" 
                            value={totalComm} 
                            onChange={e => handleRecalculateSplits(e.target.value)}
                            placeholder="Total Comm"
                            style={{ fontSize: '0.75rem', padding: '4px' }}
                          />
                          <div style={{ display: 'flex', gap: '6px', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            <span>Co: RM{companyShare}</span>
                            <span>Ag: RM{agentShare}</span>
                          </div>
                        </div>
                      ) : (
                        item.total_commission ? (
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 550 }}>RM {item.total_commission.toLocaleString()}</span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              Co: {item.company_share.toLocaleString()} // Ag: {item.agent_share.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>RM 0</span>
                        )
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '12px' }}>
                      {isEditing ? (
                        <button 
                          onClick={() => handleSaveDeals(item.property_id)}
                          className="cyber-button"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          <Save size={12} /> Save
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleStartEdit(item)}
                          className="cyber-button cyber-button-secondary"
                          style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          <Edit size={12} /> Edit File
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
