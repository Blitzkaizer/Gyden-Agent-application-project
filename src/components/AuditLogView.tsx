import React, { useState, useEffect } from 'react';
import { Database, Search, Shield, Clock, RefreshCw } from 'lucide-react';
import { dbService } from '../services/db';
import type { AuditLog } from '../services/db';

export const AuditLogView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await dbService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    const handleAuditUpdate = () => {
      fetchLogs();
    };
    window.addEventListener('gyden_audit_logged', handleAuditUpdate);
    return () => window.removeEventListener('gyden_audit_logged', handleAuditUpdate);
  }, []);

  const getActionBadgeClass = (action: string) => {
    switch (action) {
      case 'LOGIN': return 'cyber-badge-cyan';
      case 'UPLOAD_PHOTOS': return 'cyber-badge-cyan';
      case 'CREATE_CONTRACT': return 'cyber-badge-purple';
      case 'EDIT_CONTRACT': return 'cyber-badge-amber';
      case 'SHARE_CONTRACT': return 'cyber-badge-purple';
      case 'SIGN_CONTRACT': return 'cyber-badge-green';
      case 'SECURITY_ALERT': return 'cyber-badge-red';
      default: return 'cyber-badge-cyan';
    }
  };

  // Filter logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.details.toLowerCase().includes(search.toLowerCase()) || 
                          log.user_name.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter ? log.action === actionFilter : true;
    const matchesUser = userFilter ? log.user_id === userFilter : true;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
            SYSTEM LEDGER // <span className="text-glow-cyan" style={{ color: 'var(--color-cyan)' }}>AUDIT LOGS</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Decentralized, immutable ledger tracking all operations, modifications, and system events.
          </p>
        </div>

        <button 
          className="cyber-button cyber-button-secondary"
          onClick={fetchLogs}
          style={{ padding: '8px 16px' }}
        >
          <RefreshCw size={14} style={{ marginRight: '4px' }} /> Sync Node
        </button>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
        
        {/* Search */}
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="cyber-input" 
            placeholder="Search details or user signatures..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>

        {/* Action filter */}
        <div style={{ minWidth: '150px' }}>
          <select 
            className="cyber-input"
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
          >
            <option value="">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="UPLOAD_PHOTOS">UPLOAD_PHOTOS</option>
            <option value="CREATE_CONTRACT">CREATE_CONTRACT</option>
            <option value="EDIT_CONTRACT">EDIT_CONTRACT</option>
            <option value="SHARE_CONTRACT">SHARE_CONTRACT</option>
            <option value="SIGN_CONTRACT">SIGN_CONTRACT</option>
            <option value="SECURITY_ALERT">SECURITY_ALERT</option>
          </select>
        </div>

        {/* User Filter */}
        <div style={{ minWidth: '150px' }}>
          <select 
            className="cyber-input"
            value={userFilter}
            onChange={e => setUserFilter(e.target.value)}
          >
            <option value="">All Users</option>
            <option value="usr-admin-01">Commander Navin (Admin)</option>
            <option value="usr-melissa">Melissa (Listing Master)</option>
            <option value="usr-intan">Intan (Listing Ads)</option>
            <option value="usr-jacqueen">Jacqueen (Co-Agency)</option>
            <option value="usr-boonsiong">Boonsiong (Co-Agency)</option>
            <option value="usr-sales-sarah">Sarah Connor (Sales)</option>
          </select>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="glass-panel cyber-scanline" style={{ padding: '24px', overflowX: 'auto', background: '#0a0d16' }}>
        
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '3px solid rgba(6, 182, 212, 0.1)',
              borderTop: '3px solid var(--color-cyan)',
              borderRadius: '50%',
              animation: 'pulse-cyan 1s infinite linear'
            }} />
            <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--color-cyan)', fontSize: '0.85rem' }}>SYNCING NODES...</span>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            <Database size={48} style={{ opacity: 0.2, marginBottom: '12px', alignSelf: 'center' }} />
            <p>No audit events match current query parameters.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(6,182,212,0.3)', color: 'var(--color-cyan)', fontFamily: 'JetBrains Mono', fontSize: '0.8rem' }}>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>TIMESTAMP</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>ACTION CATEGORY</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>USER NODE</th>
                <th style={{ padding: '12px 16px', fontWeight: 600 }}>TRANSACTION DETAILS</th>
              </tr>
            </thead>
            <tbody style={{ fontFamily: 'JetBrains Mono', fontSize: '0.82rem' }}>
              {filteredLogs.map((log, idx) => (
                <tr 
                  key={log.id} 
                  style={{ 
                    borderBottom: '1px solid var(--border-glass)',
                    background: log.action === 'SECURITY_ALERT' ? 'rgba(244, 63, 94, 0.05)' : idx % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                  }}
                >
                  {/* Timestamp */}
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={12} style={{ color: 'var(--color-cyan)', opacity: 0.7 }} />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>

                  {/* Action Badge */}
                  <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
                    <span className={`cyber-badge ${getActionBadgeClass(log.action)}`}>
                      {log.action}
                    </span>
                  </td>

                  {/* User */}
                  <td style={{ padding: '14px 16px', color: 'var(--text-primary)', fontWeight: 650 }}>
                    {log.user_name}
                  </td>

                  {/* Details */}
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {log.action === 'SECURITY_ALERT' ? (
                      <span style={{ color: 'var(--color-red)', fontWeight: 600 }}>{log.details}</span>
                    ) : (
                      log.details
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* RLS Security Information */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', padding: '14px', borderRadius: '8px' }}>
        <Shield size={20} style={{ color: 'var(--color-green)' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <b>Ledger Immutability</b> is enforced at the database level. Audit records cannot be modified or deleted, preserving database operational compliance.
        </span>
      </div>

    </div>
  );
};
