import React, { useState, useEffect } from 'react';
import { TrendingUp, Coins, ShieldAlert, Award, Search, RefreshCw } from 'lucide-react';
import { dbService } from '../services/db';
import type { ResolvingSale, User } from '../services/db';

interface CommissionsViewProps {
  currentUser: User;
}

export const CommissionsView: React.FC<CommissionsViewProps> = ({ currentUser }) => {
  const [deals, setDeals] = useState<ResolvingSale[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    try {
      const data = await dbService.getResolvingSales();
      // Only show closed deals with commissions
      const closedDeals = data.filter(d => (d.deal_stage === 'closed_sold' || d.deal_stage === 'closed_rented') && d.total_commission > 0);
      setDeals(closedDeals);
    } catch (err) {
      console.error('Error fetching commission deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  // Enforce ADMIN role check
  if (currentUser.role !== 'admin') {
    return (
      <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--color-red)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--color-red)', alignSelf: 'center' }} />
        <h3 className="text-glow-red" style={{ fontSize: '1.25rem', color: 'var(--color-red)' }}>ACCESS RESTRICTED</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Your user profile <b>{currentUser.email}</b> is not authorized to access commission logs and ledger nodes.
        </p>
      </div>
    );
  }

  // Financial aggregates
  const totalVolume = deals.reduce((sum, d) => sum + d.total_commission, 0);
  const companyRetained = deals.reduce((sum, d) => sum + d.company_share, 0);
  const agentPayouts = deals.reduce((sum, d) => sum + d.agent_share, 0);

  const filteredDeals = deals.filter(d => 
    d.property_id.toLowerCase().includes(search.toLowerCase()) || 
    d.salesperson_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
            FINANCIAL CENTER // <span className="text-glow-cyan" style={{ color: 'var(--color-cyan)' }}>SALES COMM DASHBOARD</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Operational commission calculations, splits allocations, and verified payout ledgers.
          </p>
        </div>

        <button 
          className="cyber-button cyber-button-secondary"
          onClick={fetchDeals}
          style={{ fontSize: '0.8rem', padding: '8px 16px' }}
        >
          <RefreshCw size={14} style={{ marginRight: '4px' }} /> Sync Logs
        </button>
      </div>

      {/* Financial aggregate cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        
        {/* Total Commission Pool */}
        <div className="glass-panel-cyan" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-cyan)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
            TOTAL COMMISSION VOLUME
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>
              RM {totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <Coins size={20} style={{ color: 'var(--color-cyan)' }} />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Sum volume of closed transactions.</p>
        </div>

        {/* Company Retained */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-purple)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
            COMPANY RETAINED SHARE (40%)
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>
              RM {companyRetained.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <TrendingUp size={20} style={{ color: 'var(--color-purple)' }} />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Retained company split earnings.</p>
        </div>

        {/* Agent Payouts */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-green)', fontFamily: 'JetBrains Mono', textTransform: 'uppercase' }}>
            AGENT DISBURSED PAYOUT (60%)
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'JetBrains Mono' }}>
              RM {agentPayouts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <Award size={20} style={{ color: 'var(--color-green)' }} />
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Total payouts disbursed to active salespersons.</p>
        </div>

      </div>

      {/* Filter search */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="cyber-input" 
            placeholder="Search commissions by ID or Salesperson..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
          />
        </div>
      </div>

      {/* Commission Ledger Table */}
      <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center' }}>Syncing finances...</div>
        ) : filteredDeals.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No closed transaction files found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.2)', color: 'var(--color-cyan)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                <th style={{ padding: '10px 12px' }}>PROP ID</th>
                <th style={{ padding: '10px 12px' }}>SALES PERSON</th>
                <th style={{ padding: '10px 12px' }}>DEAL TYPE</th>
                <th style={{ padding: '10px 12px' }}>CLOSED TIMESTAMPTZ</th>
                <th style={{ padding: '10px 12px' }}>TOTAL COMMISSION</th>
                <th style={{ padding: '10px 12px' }}>COMPANY SPLIT (40%)</th>
                <th style={{ padding: '10px 12px' }}>AGENT SPLIT (60%)</th>
              </tr>
            </thead>
            <tbody style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>
              {filteredDeals.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  {/* ID */}
                  <td style={{ padding: '12px', color: 'var(--color-cyan)', fontWeight: 600 }}>{item.property_id}</td>
                  {/* Sales Person */}
                  <td style={{ padding: '12px', fontWeight: 550 }}>{item.salesperson_name}</td>
                  {/* Deal Type */}
                  <td style={{ padding: '12px' }}>
                    <span className="cyber-badge cyber-badge-green">{item.deal_stage.replace('closed_', '').toUpperCase()}</span>
                  </td>
                  {/* Date */}
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{new Date(item.closed_at).toLocaleDateString()}</td>
                  {/* Total */}
                  <td style={{ padding: '12px', fontWeight: 600 }}>RM {item.total_commission.toLocaleString()}</td>
                  {/* Company */}
                  <td style={{ padding: '12px', color: 'var(--color-purple)' }}>RM {item.company_share.toLocaleString()}</td>
                  {/* Agent */}
                  <td style={{ padding: '12px', color: 'var(--color-green)' }}>RM {item.agent_share.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};
