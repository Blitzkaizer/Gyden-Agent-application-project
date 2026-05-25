import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Check, X, Clock, Users, UserCheck } from 'lucide-react';
import { dbService } from '../services/db';
import type { PortalAccount, User } from '../services/db';

interface ApprovalsViewProps {
  currentUser: User;
}

export const ApprovalsView: React.FC<ApprovalsViewProps> = ({ currentUser }) => {
  const [pendingList, setPendingList] = useState<PortalAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Editable roles state per pending request (key is account ID, value is the active dropdown role)
  const [adjustedRoles, setAdjustedRoles] = useState<Record<string, string>>({});

  const fetchPending = async () => {
    try {
      const data = await dbService.getPendingPortalAccounts();
      setPendingList(data);
      
      // Initialize adjusted roles maps
      const roleMap: Record<string, string> = {};
      data.forEach(acc => {
        roleMap[acc.id] = acc.role;
      });
      setAdjustedRoles(roleMap);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch pending approval list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser.role === 'admin') {
      fetchPending();
    }
  }, [currentUser]);

  const handleDecision = async (id: string, decision: 'approved' | 'rejected') => {
    setError('');
    setSuccess('');
    try {
      const chosenRole = adjustedRoles[id];
      await dbService.updatePortalAccountStatus(id, decision, chosenRole as any);
      setSuccess(`Account status has been set to: ${decision.toUpperCase()}`);
      fetchPending();
      setTimeout(() => setSuccess(''), 2000);
    } catch (err: any) {
      setError(err.message || 'Error processing registration decision.');
    }
  };

  const handleRoleChange = (id: string, newRole: string) => {
    setAdjustedRoles(prev => ({
      ...prev,
      [id]: newRole
    }));
  };

  // Guard clause for unauthorized role access
  if (currentUser.role !== 'admin') {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', border: '1px solid var(--color-red)' }}>
        <ShieldAlert size={48} style={{ color: 'var(--color-red)', marginBottom: '16px' }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', color: 'var(--color-red)' }}>
          FIREWALL ACCESS BLOCK // RESTRICTED AREA
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', maxWidth: '460px', margin: '0 auto' }}>
          This operations matrix contains personal identity credentials and access override keys. Only System Administrators have privileges to review approvals.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
          VETTING QUEUE // <span className="text-glow-purple" style={{ color: 'var(--color-purple)' }}>PENDING APPROVALS</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Review pending agent requests. Approve credentials to grant system access, set specific RLS roles, or decline unauthorized uplinks.
        </p>
      </div>

      {success && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid var(--color-green)', padding: '10px 14px', borderRadius: '6px', color: 'var(--color-green)', fontSize: '0.85rem' }}>
          {success}
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid var(--color-red)', padding: '10px 14px', borderRadius: '6px', color: 'var(--color-red)', fontSize: '0.85rem' }}>
          {error}
        </div>
      )}

      {/* Main Table Panel */}
      <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
          <Users size={18} style={{ color: 'var(--color-purple)' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>REGISTRATION REQUEST LEADERBOARD</h3>
        </div>

        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>Querying registration queue nodes...</div>
        ) : pendingList.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
            <UserCheck size={48} style={{ opacity: 0.15 }} />
            <span style={{ fontSize: '0.85rem' }}>The vetting queue is empty. All agent requests are resolved.</span>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(139,92,246,0.2)', color: 'var(--color-purple)', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                <th style={{ padding: '10px 12px' }}>AGENT DETAILS</th>
                <th style={{ padding: '10px 12px' }}>EMAIL ADDRESS</th>
                <th style={{ padding: '10px 12px' }}>REQUESTED ACCESS ROLE</th>
                <th style={{ padding: '10px 12px' }}>SUBMISSION TELEMETRY</th>
                <th style={{ padding: '10px 12px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {pendingList.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  {/* Name & Avatar */}
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid var(--border-glass)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--color-purple)'
                      }}>
                        {item.name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: '12px', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>
                    {item.email}
                  </td>

                  {/* Proposed Role */}
                  <td style={{ padding: '12px' }}>
                    <select 
                      className="cyber-input"
                      value={adjustedRoles[item.id] || item.role}
                      onChange={(e) => handleRoleChange(item.id, e.target.value)}
                      style={{ fontSize: '0.75rem', padding: '4px 8px', background: '#090d16', width: '180px' }}
                    >
                      <option value="sales">Sales Agent</option>
                      <option value="listing_melissa">Listing Master (Melissa)</option>
                      <option value="listing_intan">Listing Ads (Intan)</option>
                      <option value="coagency">Co-Agency Node (Jacqueen)</option>
                      <option value="admin">System Administrator</option>
                    </select>
                  </td>

                  {/* Date */}
                  <td style={{ padding: '12px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', height: '100%', fontFamily: 'JetBrains Mono', fontSize: '0.75rem' }}>
                    <Clock size={12} style={{ color: 'var(--color-purple)' }} />
                    {new Date(item.createdAt).toLocaleDateString()} {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>

                  {/* Action Buttons */}
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleDecision(item.id, 'approved')}
                        className="cyber-button"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(16,185,129,0.1)', border: '1px solid var(--color-green)', color: 'var(--color-green)' }}
                        title="Approve User Access"
                      >
                        <Check size={12} /> Approve
                      </button>
                      <button 
                        onClick={() => handleDecision(item.id, 'rejected')}
                        className="cyber-button"
                        style={{ padding: '4px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(244,63,94,0.1)', border: '1px solid var(--color-red)', color: 'var(--color-red)' }}
                        title="Decline User Access"
                      >
                        <X size={12} /> Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Advisory Panel */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)', padding: '14px', borderRadius: '8px' }}>
        <ShieldCheck size={18} style={{ color: 'var(--color-purple)' }} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <b>Security protocol:</b> Approving accounts grants instant decryption keys matching the specified RLS roles. Action is cataloged under Admin Audit Trail logs.
        </span>
      </div>

    </div>
  );
};
