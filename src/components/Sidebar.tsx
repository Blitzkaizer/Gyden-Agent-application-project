import React from 'react';
import { 
  LayoutDashboard, 
  FilePlus, 
  Database, 
  Megaphone, 
  Users, 
  Handshake, 
  TrendingUp, 
  ShieldCheck,
  ShieldAlert,
  Server,
  LogOut
} from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabaseClient';
import type { User } from '../services/db';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentUser: User;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, currentUser, onLogout }) => {
  // Define menu items and map roles that can see them
  const allMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'listing_melissa', 'listing_intan', 'coagency', 'sales'] },
    { id: 'intake', label: 'Intake (New)', icon: FilePlus, roles: ['admin', 'listing_melissa', 'listing_intan', 'coagency', 'sales'] },
    { id: 'master', label: 'Master Database', icon: Database, roles: ['admin', 'listing_melissa', 'listing_intan', 'coagency', 'sales'] },
    { id: 'ads', label: 'Advertising Link', icon: Megaphone, roles: ['admin', 'listing_melissa', 'listing_intan', 'coagency', 'sales'] },
    { id: 'coagency', label: 'Co-Agency Match', icon: Users, roles: ['admin', 'listing_melissa', 'listing_intan', 'coagency', 'sales'] },
    { id: 'resolving', label: 'Resolving (Deals)', icon: Handshake, roles: ['admin'] },
    { id: 'commissions', label: 'Commissions', icon: TrendingUp, roles: ['admin'] },
    { id: 'approvals', label: 'Approvals Queue', icon: ShieldCheck, roles: ['admin'] },
    { id: 'audit', label: 'System Ledger', icon: Server, roles: ['admin', 'listing_melissa', 'listing_intan', 'coagency', 'sales'] }
  ];

  // Filter menu items based on active user's roles (Sales/coagency shouldn't see Admin transaction folders)
  const menuItems = allMenuItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="glass-panel" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      borderRadius: '0', 
      borderTop: 'none', 
      borderBottom: 'none', 
      borderLeft: 'none', 
      borderRight: '1px solid var(--border-glass)',
      padding: '24px 16px',
      gap: '24px',
      zIndex: 10
    }}>
      {/* Brand logo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h1 className="text-glow-cyan" style={{ 
          fontSize: '1.35rem', 
          fontWeight: 800, 
          letterSpacing: '0.12em', 
          color: 'var(--color-cyan)',
          textTransform: 'uppercase'
        }}>
          Gyden System
        </h1>
        <div style={{ 
          fontFamily: 'JetBrains Mono, monospace', 
          fontSize: '0.65rem', 
          color: 'var(--text-secondary)',
          letterSpacing: '0.05em'
        }}>
          DATABASE // RBAC V2.0
        </div>
      </div>

      {/* User profile */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px', 
        padding: '10px', 
        borderRadius: '8px', 
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.04)',
        overflow: 'hidden'
      }}>
        <img 
          src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
          alt={currentUser.name} 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '50%', 
            objectFit: 'cover', 
            border: '2px solid var(--color-purple)' 
          }} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {currentUser.name.split(' ')[0]}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ 
              display: 'inline-block', 
              width: '5px', 
              height: '5px', 
              borderRadius: '50%', 
              backgroundColor: currentUser.role === 'admin' ? 'var(--color-red)' : currentUser.role === 'sales' ? 'var(--color-purple)' : 'var(--color-cyan)' 
            }} />
            {currentUser.role.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '10px 14px',
                background: isActive ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.12) 0%, transparent 100%)' : 'transparent',
                border: 'none',
                borderLeft: isActive ? '3px solid var(--color-cyan)' : '3px solid transparent',
                borderRadius: '0 6px 6px 0',
                color: isActive ? 'var(--color-cyan)' : 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: isActive ? 600 : 400,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                outline: 'none'
              }}
            >
              <Icon size={16} style={{ 
                color: isActive ? 'var(--color-cyan)' : 'var(--text-secondary)',
                filter: isActive ? 'drop-shadow(0 0 3px var(--color-cyan-glow))' : 'none'
              }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Database Connection Status */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '6px', 
        fontSize: '0.7rem', 
        padding: '10px', 
        borderRadius: '6px', 
        background: 'rgba(0,0,0,0.2)',
        border: '1px solid var(--border-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <Server size={10} />
          <span>Database Uplink:</span>
        </div>
        {isSupabaseConfigured ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-green)' }}>
            <ShieldCheck size={12} />
            <span style={{ fontWeight: 600 }}>Supabase Core</span>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-amber)' }}>
            <ShieldAlert size={12} />
            <span style={{ fontWeight: 600 }}>Local Mock (Offline)</span>
          </div>
        )}
      </div>

      {/* Logout Action trigger */}
      <button
        onClick={onLogout}
        className="cyber-button cyber-button-secondary"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          width: '100%',
          padding: '10px 14px',
          fontSize: '0.85rem',
          color: 'var(--color-red)',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          background: 'rgba(244, 63, 94, 0.03)',
          cursor: 'pointer',
          borderRadius: '6px',
          outline: 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <LogOut size={16} />
        Log Out Session
      </button>
    </aside>
  );
};
