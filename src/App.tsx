import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { IntakeView } from './components/IntakeView';
import { MasterLedgerView } from './components/MasterLedgerView';
import { AdsCoAgencyView } from './components/AdsCoAgencyView';
import { ResolvingView } from './components/ResolvingView';
import { CommissionsView } from './components/CommissionsView';
import { AuditLogView } from './components/AuditLogView';
import { ApprovalsView } from './components/ApprovalsView';
import { dbService, MOCK_USERS } from './services/db';
import type { User } from './services/db';
import { 
  Fingerprint, 
  Terminal, 
  Lock, 
  HelpCircle,
  Users,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStage, setAuthStage] = useState<'idle' | 'scanning' | 'decrypting' | 'authorized'>('idle');
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Login credentials
  const [emailInput, setEmailInput] = useState('admin@gyden.com');
  const [passwordInput, setPasswordInput] = useState('admin123');

  // Signup/Register states
  const [isSignup, setIsSignup] = useState(false);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<'sales' | 'listing_melissa' | 'listing_intan' | 'coagency'>('sales');
  const [pendingVetting, setPendingVetting] = useState(false);

  // Navigation states
  const [activeView, setActiveView] = useState('dashboard');
  
  // Impersonator state (developer mode)
  const [currentUser, setCurrentUser] = useState<User>(dbService.getCurrentUser());

  // Trigger sync navigation checks when user role changes
  useEffect(() => {
    // If the new role doesn't have access to the active admin pages, redirect back to dashboard
    const restrictedViews = ['resolving', 'commissions', 'approvals'];
    if (restrictedViews.includes(activeView) && currentUser.role !== 'admin') {
      setActiveView('dashboard');
    }
  }, [currentUser, activeView]);

  // Biometrics authenticating simulator
  const handleBiometricLogin = () => {
    setIsAuthenticating(true);
    setAuthError('');
    setAuthStage('scanning');

    setTimeout(() => {
      setAuthStage('decrypting');
      
      setTimeout(() => {
        setAuthStage('authorized');
        
        setTimeout(() => {
          setIsAuthenticated(true);
          setIsAuthenticating(false);
          dbService.logAction('LOGIN', `${currentUser.name} authenticated via biometric fingerprint scan.`);
        }, 800);

      }, 1500);

    }, 1500);
  };

  // Form login submission
  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMsg('');

    if (!emailInput.trim() || !passwordInput.trim()) {
      setAuthError('Authentication tokens cannot be empty.');
      return;
    }

    try {
      setIsAuthenticating(true);
      setAuthStage('decrypting');

      const matchedAccount = await dbService.authenticatePortalAccount(emailInput.trim(), passwordInput.trim());

      setTimeout(() => {
        if (!matchedAccount) {
          setAuthError('Invalid credentials. Identity signature not found.');
          setIsAuthenticating(false);
          setAuthStage('idle');
          return;
        }

        if (matchedAccount.status === 'pending_approval') {
          // Block login and show vetting screen
          setPendingVetting(true);
          setIsAuthenticating(false);
          setAuthStage('idle');
          return;
        }

        if (matchedAccount.status === 'rejected') {
          setAuthError('Access Denied: This registration request was rejected by administration.');
          setIsAuthenticating(false);
          setAuthStage('idle');
          return;
        }

        // Approved
        const sessionUser: User = {
          id: matchedAccount.id,
          name: matchedAccount.name,
          email: matchedAccount.email,
          role: matchedAccount.role,
          avatarUrl: matchedAccount.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
        };

        dbService.setCurrentUser(sessionUser.id);
        setCurrentUser(sessionUser);
        setIsAuthenticated(true);
        setIsAuthenticating(false);
        dbService.logAction('LOGIN', `${sessionUser.name} authenticated using password encryption.`);
      }, 1200);

    } catch (err: any) {
      setAuthError(err.message || 'Login node authentication failed.');
      setIsAuthenticating(false);
      setAuthStage('idle');
    }
  };

  // Form signup submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSuccessMsg('');

    if (!signupName.trim() || !signupEmail.trim() || !signupPassword.trim()) {
      setAuthError('All registration credentials must be provided.');
      return;
    }

    try {
      setIsAuthenticating(true);
      await dbService.registerPortalAccount(
        signupName.trim(),
        signupEmail.trim(),
        signupPassword.trim(),
        signupRole as any
      );

      setIsAuthenticating(false);
      setSuccessMsg('Request Submitted! Your account is currently in the Admin vetting queue. Please contact Navin to activate.');
      setIsSignup(false);
      // Populate email login field for ease of testing
      setEmailInput(signupEmail.trim());
      setPasswordInput(signupPassword.trim());
    } catch (err: any) {
      setAuthError(err.message || 'Registration request failed.');
      setIsAuthenticating(false);
    }
  };

  // Switch identity selector handler
  const handleIdentitySwitch = (userId: string) => {
    const updatedUser = dbService.setCurrentUser(userId);
    setCurrentUser(updatedUser);
  };

  // Render vetting block overlay if user is pending admin approval
  if (pendingVetting) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative'
      }} className="cyber-scanline">
        
        {/* Animated Cyber Grid backdrop */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(rgba(18, 24, 38, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 24, 38, 0.25) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          animation: 'grid-scroll 20s linear infinite',
          zIndex: -1
        }} />

        <div className="glass-panel-cyan" style={{
          width: '100%',
          maxWidth: '440px',
          padding: '40px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          border: '1px solid var(--color-purple)',
          background: 'rgba(15, 23, 42, 0.95)'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            border: '2px solid var(--color-purple)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            color: 'var(--color-purple)',
            animation: 'pulse-cyan 2s infinite'
          }}>
            <Lock size={40} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h3 className="text-glow-purple" style={{ fontSize: '1.25rem', color: 'var(--color-purple)', fontWeight: 700, letterSpacing: '0.1em' }}>
              VETTING IN PROGRESS
            </h3>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Your portal uplink credentials request is currently queued in the <b>Administrator Vetting Queue</b>.
            </span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
              Only approved personnel can establish secure data streams. Please contact Commander Navin (Admin) to review and activate your clearance code.
            </p>
          </div>

          <button 
            onClick={() => setPendingVetting(false)}
            className="cyber-button cyber-button-secondary"
            style={{ width: '100%' }}
          >
            Return to Login Panel
          </button>
        </div>
      </div>
    );
  }

  // Render Login view if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative'
      }} className="cyber-scanline">
        
        {/* Animated Cyber Grid backdrop */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(rgba(18, 24, 38, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 24, 38, 0.25) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          animation: 'grid-scroll 20s linear infinite',
          zIndex: -1
        }} />

        {isAuthenticating ? (
          /* High tech login scanning overlay */
          <div className="glass-panel-cyan cyber-scanner" style={{
            width: '100%',
            maxWidth: '420px',
            padding: '40px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 0 30px var(--color-cyan-glow)'
          }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              border: '2px solid var(--color-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              color: 'var(--color-cyan)',
              animation: 'pulse-cyan 1s infinite'
            }}>
              <Fingerprint size={48} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h3 className="text-glow-cyan" style={{ fontSize: '1.2rem', color: 'var(--color-cyan)', fontWeight: 700, letterSpacing: '0.15em' }}>
                {authStage === 'scanning' && 'BIOMETRIC SCANNING'}
                {authStage === 'decrypting' && 'DECRYPTING ACCESS NODES'}
                {authStage === 'authorized' && 'AUTHENTICATION GRANTED'}
              </h3>
              <span style={{ fontSize: '0.8rem', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>
                {authStage === 'scanning' && 'Hold position. Scanning retina and fingerprint indexes...'}
                {authStage === 'decrypting' && 'Resolving cryptokeys against decentralised directory...'}
                {authStage === 'authorized' && 'Agent signatures verified. Unlocking dashboard...'}
              </span>
            </div>

            {/* Simulated bar */}
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginTop: '10px' }}>
              <div style={{ 
                width: authStage === 'scanning' ? '45%' : authStage === 'decrypting' ? '80%' : '100%', 
                height: '100%', 
                backgroundColor: 'var(--color-cyan)',
                boxShadow: '0 0 10px var(--color-cyan)',
                transition: 'width 1s ease'
              }} />
            </div>
          </div>
        ) : (
          /* Main login panel */
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '440px',
            padding: '36px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}>
            {/* Header branding */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', textAlign: 'center' }}>
              <Terminal size={32} style={{ color: 'var(--color-cyan)', filter: 'drop-shadow(0 0 6px var(--color-cyan))' }} />
              <h2 className="text-glow-cyan" style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-cyan)', letterSpacing: '0.1em', marginTop: '10px' }}>
                GYDEN UPLINK PORTAL
              </h2>
              <span style={{ fontSize: '0.7rem', fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>
                GYDEN PROPERTY DATABASE SYSTEM v2.0
              </span>
            </div>

            {authError && (
              <div style={{ 
                background: 'rgba(244, 63, 94, 0.1)', 
                border: '1px solid var(--color-red)', 
                padding: '10px 14px', 
                borderRadius: '6px', 
                color: 'var(--color-red)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldAlert size={16} />
                <span>{authError}</span>
              </div>
            )}

            {successMsg && (
              <div style={{ 
                background: 'rgba(16, 185, 129, 0.1)', 
                border: '1px solid var(--color-green)', 
                padding: '10px 14px', 
                borderRadius: '6px', 
                color: 'var(--color-green)',
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <ShieldCheck size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            {!isSignup ? (
              /* Custom Login Form */
              <form onSubmit={handleFormLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Node Identity (Email)
                  </label>
                  <input 
                    type="email" 
                    className="cyber-input" 
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Cryptokey (Password)
                  </label>
                  <input 
                    type="password" 
                    className="cyber-input" 
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                  />
                </div>

                <button type="submit" className="cyber-button" style={{ width: '100%', marginTop: '6px' }}>
                  <Lock size={14} /> Authenticate Session
                </button>
              </form>
            ) : (
              /* Custom Signup Registration Form */
              <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Full Agent Name
                  </label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    placeholder="e.g. John Doe"
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Email Identity
                  </label>
                  <input 
                    type="email" 
                    className="cyber-input" 
                    placeholder="e.g. john@gyden.com"
                    value={signupEmail}
                    onChange={e => setSignupEmail(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Clearance Password
                  </label>
                  <input 
                    type="password" 
                    className="cyber-input" 
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Proposed Security Role
                  </label>
                  <select 
                    className="cyber-input"
                    value={signupRole}
                    onChange={e => setSignupRole(e.target.value as any)}
                    style={{ fontSize: '0.85rem', background: '#090d16', padding: '8px' }}
                  >
                    <option value="sales">Sales Agent</option>
                    <option value="listing_melissa">Listing Team (Melissa)</option>
                    <option value="listing_intan">Listing Advertising Team (Intan)</option>
                    <option value="coagency">Co-Agency Broker (Jacqueen)</option>
                  </select>
                </div>

                <button type="submit" className="cyber-button" style={{ width: '100%', marginTop: '6px', background: 'linear-gradient(90deg, var(--color-purple), var(--color-cyan))' }}>
                  <Users size={14} /> Request Uplink Access
                </button>
              </form>
            )}

            <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
              <span style={{ padding: '0 12px', fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                {isSignup ? 'OR LOGIN' : 'OR BYPASS'}
              </span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
            </div>

            {!isSignup ? (
              <>
                {/* Quick biometric scan shortcut */}
                <button 
                  className="cyber-button cyber-button-purple" 
                  style={{ width: '100%' }}
                  type="button"
                  onClick={handleBiometricLogin}
                >
                  <Fingerprint size={14} /> Biometrics Node Bypass
                </button>

                <button 
                  className="cyber-button cyber-button-secondary"
                  style={{ width: '100%', fontSize: '0.75rem' }}
                  type="button"
                  onClick={() => { setIsSignup(true); setAuthError(''); setSuccessMsg(''); }}
                >
                  Request Agent Access Code
                </button>
              </>
            ) : (
              <button 
                className="cyber-button cyber-button-secondary"
                style={{ width: '100%', fontSize: '0.75rem' }}
                type="button"
                onClick={() => { setIsSignup(false); setAuthError(''); setSuccessMsg(''); }}
              >
                Back to Authentication Panel
              </button>
            )}

            {/* Helper tips */}
            <div style={{ 
              background: 'rgba(255,255,255,0.01)', 
              border: '1px solid var(--border-glass)', 
              padding: '12px', 
              borderRadius: '6px',
              fontSize: '0.75rem',
              display: 'flex',
              gap: '8px',
              color: 'var(--text-secondary)'
            }}>
              <HelpCircle size={16} style={{ color: 'var(--color-cyan)', flexShrink: 0 }} />
              <div>
                {isSignup ? (
                  <span>Submit registration. Your node starts as <b>Pending Approval</b> in Navin's verification ledger.</span>
                ) : (
                  <span>Local Node Preview: Try mock logins (e.g. <b>admin@gyden.com</b> / <b>admin123</b>) or submit a vetting request.</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render Dashboard Layout if authenticated
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 1. TOP STICKY DEVELOPER TOOLBAR */}
      <header className="impersonator-bar">
        <div className="impersonator-title">
          <Terminal size={14} style={{ color: 'var(--color-cyan)' }} />
          <span>RBAC SIMULATOR TOOLBAR</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <Users size={14} style={{ color: 'var(--color-purple)' }} />
            <span>Switch Identity Role:</span>
          </div>
          
          <select 
            className="impersonator-select"
            value={currentUser.id}
            onChange={e => handleIdentitySwitch(e.target.value)}
          >
            {MOCK_USERS.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role.toUpperCase()})
              </option>
            ))}
          </select>

          <span style={{ 
            fontSize: '0.65rem', 
            background: 'rgba(16,185,129,0.1)', 
            border: '1px solid rgba(16,185,129,0.3)', 
            padding: '2px 8px', 
            borderRadius: '4px',
            color: 'var(--color-green)',
            fontWeight: 600
          }}>
            SIMULATION LIVE
          </span>
        </div>
      </header>

      {/* 2. MAIN LAYOUT GRID (Sidebar + Content View) */}
      <div className="dashboard-grid" style={{ flex: 1 }}>
        
        {/* Sidebar */}
        <Sidebar 
          activeView={activeView} 
          setActiveView={(view) => setActiveView(view)} 
          currentUser={currentUser}
          onLogout={() => {
            setIsAuthenticated(false);
            localStorage.removeItem('gyden2_current_user_id');
            setEmailInput('');
            setPasswordInput('');
            setAuthStage('idle');
            setPendingVetting(false);
          }}
        />

        {/* View content panel */}
        <main className="main-content">
          
          {activeView === 'dashboard' && (
            <DashboardView 
              currentUser={currentUser}
              onNavigate={(view) => setActiveView(view)}
            />
          )}

          {activeView === 'intake' && (
            <IntakeView 
              currentUser={currentUser}
              onNavigateToMaster={() => setActiveView('master')}
            />
          )}

          {activeView === 'master' && (
            <MasterLedgerView 
              currentUser={currentUser}
            />
          )}

          {activeView === 'ads' && (
            <AdsCoAgencyView 
              currentUser={currentUser}
            />
          )}

          {activeView === 'coagency' && (
            <AdsCoAgencyView 
              currentUser={currentUser}
            />
          )}

          {activeView === 'resolving' && (
            <ResolvingView 
              currentUser={currentUser}
            />
          )}

          {activeView === 'commissions' && (
            <CommissionsView 
              currentUser={currentUser}
            />
          )}

          {activeView === 'approvals' && (
            <ApprovalsView 
              currentUser={currentUser}
            />
          )}

          {activeView === 'audit' && (
            <AuditLogView />
          )}
          
        </main>
      </div>

    </div>
  );
}

export default App;
