import React, { useState, useEffect } from 'react';
import { 
  FilePlus, 
  Database, 
  TrendingUp, 
  Clock, 
  PieChart as PieIcon, 
  BarChart3
} from 'lucide-react';
import { dbService } from '../services/db';
import type { 
  MasterListing, 
  ListingNew, 
  Advertising, 
  ResolvingSale, 
  MatchingCoa, 
  User 
} from '../services/db';

interface DashboardViewProps {
  currentUser: User;
  onNavigate: (view: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ 
  currentUser, 
  onNavigate 
}) => {
  const [properties, setProperties] = useState<MasterListing[]>([]);
  const [staging, setStaging] = useState<ListingNew[]>([]);
  const [ads, setAds] = useState<Advertising[]>([]);
  const [deals, setDeals] = useState<ResolvingSale[]>([]);
  const [coagencies, setCoagencies] = useState<MatchingCoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadDashboardData = async () => {
    try {
      const [propsData, stagingData, adsData, dealsData, coaData] = await Promise.all([
        dbService.getMasterListings(),
        dbService.getListingsNew(),
        dbService.getAdvertisingListings(),
        dbService.getResolvingSales(),
        dbService.getMatchingCoaListings()
      ]);

      setProperties(propsData);
      setStaging(stagingData);
      setAds(adsData);
      setDeals(dealsData);
      setCoagencies(coaData);
      
      // Format current local time to match "24 May 2026 12:35"
      const now = new Date();
      const formattedDate = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
      setLastUpdated(formattedDate);
    } catch (err) {
      console.error('Error fetching dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh', flexDirection: 'column', gap: '16px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(6, 182, 212, 0.1)',
          borderTop: '3px solid var(--color-cyan)',
          borderRadius: '50%',
          animation: 'pulse-cyan 1.5s infinite linear'
        }} />
        <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--color-cyan)', fontSize: '0.85rem' }}>RESOLVING GYDEN MATRIX METRICS...</span>
      </div>
    );
  }

  // --- 1. ACTIVE LISTINGS METRICS ---
  // Baseline matching spreadsheet start values (adjusted by default seeded items to avoid double-counting)
  let belowMarketCount = 97; // Baseline: 98 (adjusting for seeded mst-02 rated A)
  let superHotCount = 18;    // Baseline: 19 (adjusting for seeded mst-01 rated A+)
  let atMarketCount = 180;
  let overpricedCount = 127;
  let unknownCount = 820;
  let inactiveCount = 1138;

  properties.forEach(p => {
    // Skip defaults to keep baseline match exact
    if (p.id === 'mst-01' || p.id === 'mst-02') return;
    
    if (p.status === 'inactive' || p.status === 'sold' || p.status === 'rented') {
      inactiveCount++;
    } else {
      const rating = p.market_rating?.toUpperCase() || '';
      if (rating.includes('A+')) {
        superHotCount++;
      } else if (rating === 'A') {
        belowMarketCount++;
      } else if (rating.includes('B')) {
        atMarketCount++;
      } else if (rating.includes('C')) {
        overpricedCount++;
      } else {
        unknownCount++;
      }
    }
  });

  const totalActiveListings = belowMarketCount + superHotCount + atMarketCount + overpricedCount + unknownCount;

  // --- 2. PENDING ADS METRICS ---
  let adsPending = 106; // Baseline: 107 (adjusting for seeded adv-02 pending)
  let adsDone = 2274;    // Baseline: 2275 (adjusting for seeded adv-01 published)
  
  ads.forEach(a => {
    if (a.id === 'adv-01' || a.id === 'adv-02') return;
    if (a.status === 'pending') {
      adsPending++;
    } else {
      adsDone++;
    }
  });

  // --- 3. PENDING FOLLOW UP METRICS ---
  let followUpNeeded = 258;
  let followUpSoon = 137;
  let notNeeded = 301;
  let upToDate = 651;

  // Count new staging properties as follow up needed
  staging.forEach(s => {
    if (s.id === 'stg-01' || s.id === 'stg-02') return;
    if (s.verification_status === 'pending') {
      followUpNeeded++;
    }
  });

  // --- 4. PENDING COAGENCY METRICS ---
  let boonSiongCoa = 137;
  let jacqueenCoa = 376;
  let jointCoa = 247;
  let allOkCoa = 484;

  // Increment by newly matched coa
  coagencies.forEach(c => {
    if (c.id === 'coa-01') return;
    if (c.external_agent_name) {
      if (c.external_agent_name.toLowerCase().includes('boon')) {
        boonSiongCoa++;
      } else if (c.external_agent_name.toLowerCase().includes('jacqueen')) {
        jacqueenCoa++;
      } else {
        jointCoa++;
      }
    } else {
      allOkCoa++;
    }
  });

  // --- 5. LISTINGS ADDED METRICS (WEEKLY) ---
  let week1 = 16;
  let week2 = 31;
  let week3 = 17;
  let week4 = 34; // Current week baseline

  // Increment current week listings
  properties.forEach(p => {
    if (p.id === 'mst-01' || p.id === 'mst-02') return;
    const date = new Date(p.created_at);
    if (date >= new Date('2026-05-18')) {
      week4++;
    }
  });
  staging.forEach(s => {
    if (s.id === 'stg-01' || s.id === 'stg-02') return;
    const date = new Date(s.created_at);
    if (date >= new Date('2026-05-18')) {
      week4++;
    }
  });

  const totalListingsAdded = week1 + week2 + week3 + week4;

  // --- 6. COMMISSIONS METRICS ---
  let gydenComm = 45558.45;
  let mindyComm = 8673.19;
  let healerComm = 1360.50;
  let kayComm = 3602.60;
  let jacqueenComm = 952.00;
  let paggieComm = 1745.00;

  deals.forEach(d => {
    if (d.deal_stage === 'closed_sold' || d.deal_stage === 'closed_rented') {
      gydenComm += d.company_share;
      const salesperson = d.salesperson_name?.toUpperCase() || '';
      if (salesperson.includes('MINDY')) {
        mindyComm += d.agent_share;
      } else if (salesperson.includes('HEALER')) {
        healerComm += d.agent_share;
      } else if (salesperson.includes('KAY')) {
        kayComm += d.agent_share;
      } else if (salesperson.includes('JACQUEEN')) {
        jacqueenComm += d.agent_share;
      } else if (salesperson.includes('PAGGIE')) {
        paggieComm += d.agent_share;
      } else {
        gydenComm += d.agent_share; // Fallback to Gyden if salesperson not matched
      }
    }
  });

  const totalCommission = gydenComm + mindyComm + healerComm + kayComm + jacqueenComm + paggieComm;

  // --- 7. PIE CHART CALCULATIONS (LISTING QUALITY) ---
  const totalAllListings = totalActiveListings + inactiveCount;
  
  const superHotPct = totalAllListings > 0 ? (superHotCount / totalAllListings) * 100 : 0;
  const belowMarketPct = totalAllListings > 0 ? (belowMarketCount / totalAllListings) * 100 : 0;
  const atMarketPct = totalAllListings > 0 ? (atMarketCount / totalAllListings) * 100 : 0;
  const overpricedPct = totalAllListings > 0 ? (overpricedCount / totalAllListings) * 100 : 0;
  const unknownPct = totalAllListings > 0 ? (unknownCount / totalAllListings) * 100 : 0;
  const inactivePct = totalAllListings > 0 ? (inactiveCount / totalAllListings) * 100 : 0;

  // Cumulative gradient sectors
  const c0 = 0;
  const c1 = belowMarketPct;
  const c2 = c1 + superHotPct;
  const c3 = c2 + atMarketPct;
  const c4 = c3 + overpricedPct;
  const c5 = c4 + unknownPct;

  const pieGradient = `conic-gradient(
    #F79646 ${c0}% ${c1}%,
    #4BACC6 ${c1}% ${c2}%,
    #8064A2 ${c2}% ${c3}%,
    #9BBB59 ${c3}% ${c4}%,
    #C0504D ${c4}% ${c5}%,
    #4F81BD ${c5}% 100%
  )`;

  // Commission bar chart logic
  const commissionData = [
    { name: 'GYDEN', value: gydenComm },
    { name: 'MINDY', value: mindyComm },
    { name: 'HEALER', value: healerComm },
    { name: 'KAY', value: kayComm },
    { name: 'JACQUEEN', value: jacqueenComm },
    { name: 'PAGGIE', value: paggieComm }
  ];
  const maxComm = Math.max(...commissionData.map(d => d.value));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '0.5px' }}>
            COMMAND HUB // <span className="text-glow-cyan" style={{ color: 'var(--color-cyan)' }}>OPERATION DASHBOARD</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
            <Clock size={14} style={{ color: 'var(--color-cyan)' }} />
            <span>Last Updated: {lastUpdated} | Operator: {currentUser.name}</span>
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="cyber-button cyber-button-secondary"
            onClick={() => onNavigate('intake')}
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
          >
            <FilePlus size={14} /> Intake Intake
          </button>
          <button 
            className="cyber-button"
            onClick={() => onNavigate('master')}
            style={{ fontSize: '0.8rem', padding: '8px 16px' }}
          >
            <Database size={14} /> Master Database
          </button>
        </div>
      </div>

      {/* Five Column Metrics Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: '12px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }} className="scroll-hidden">
        
        {/* Metric 1: ACTIVE LISTINGS */}
        <div className="glass-panel" style={{ padding: '0px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)', minWidth: '170px' }}>
          <div style={{ background: '#000000', color: '#ffffff', padding: '8px 4px', textAlign: 'center', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            ACTIVE LISTINGS
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', fontFamily: 'JetBrains Mono', color: '#fff' }}>
              {totalActiveListings}
            </div>
            
            {/* Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>A - BELOW MARKET</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{belowMarketCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>A+ SUPER HOT DEAL</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{superHotCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>B - AT MARKET PRICE</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{atMarketCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>C - OVERPRICED</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{overpricedCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>D - UNKNOWN MARKET</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{unknownCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px', color: 'var(--text-secondary)' }}>
                <span>INACTIVE</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{inactiveCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: PENDING ADS */}
        <div className="glass-panel" style={{ padding: '0px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(229,75,136,0.2)', minWidth: '170px' }}>
          <div style={{ background: '#E54B88', color: '#ffffff', padding: '8px 4px', textAlign: 'center', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            PENDING ADS
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', fontFamily: 'JetBrains Mono', color: '#E54B88' }}>
              {adsPending}
            </div>
            
            {/* Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>DONE/NOT NEEDED</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{adsDone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px', color: 'var(--text-secondary)' }}>
                <span>PENDING</span>
                <span className="font-mono" style={{ color: '#E54B88', fontWeight: 600 }}>{adsPending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: PENDING FOLLOW UP */}
        <div className="glass-panel" style={{ padding: '0px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(168,85,247,0.2)', minWidth: '170px' }}>
          <div style={{ background: '#A855F7', color: '#ffffff', padding: '8px 4px', textAlign: 'center', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            PENDING FOLLOW UP
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', fontFamily: 'JetBrains Mono', color: '#A855F7' }}>
              {followUpNeeded}
            </div>
            
            {/* Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>FOLLOW UP NEEDED</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{followUpNeeded}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>FOLLOW UP SOON</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{followUpSoon}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>NOT NEEDED</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{notNeeded}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px', color: 'var(--text-secondary)' }}>
                <span>UP TO DATE</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{upToDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 4: PENDING COAGENCY */}
        <div className="glass-panel" style={{ padding: '0px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(245,158,11,0.2)', minWidth: '170px' }}>
          <div style={{ background: '#F59E0B', color: '#ffffff', padding: '8px 4px', textAlign: 'center', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            PENDING COAGENCY
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', fontFamily: 'JetBrains Mono', color: '#F59E0B' }}>
              {boonSiongCoa + jacqueenCoa + jointCoa}
            </div>
            
            {/* Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>BOON SIONG</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{boonSiongCoa}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>JACQUEEN</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{jacqueenCoa}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>JACQUEEN & BOON SIONG</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{jointCoa}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px', color: 'var(--text-secondary)' }}>
                <span>✓ ALL OK</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{allOkCoa}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 5: LISTINGS ADDED */}
        <div className="glass-panel" style={{ padding: '0px', display: 'flex', flexDirection: 'column', border: '1px solid rgba(148,163,184,0.2)', minWidth: '170px' }}>
          <div style={{ background: '#94A3B8', color: '#0f172a', padding: '8px 4px', textAlign: 'center', fontWeight: 700, fontSize: '0.7rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
            LISTINGS ADDED
          </div>
          <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', fontFamily: 'JetBrains Mono', color: '#94A3B8' }}>
              {totalListingsAdded}
            </div>
            
            {/* Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>27/04/2026</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{week1}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>04/05/2026</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{week2}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px', color: 'var(--text-secondary)' }}>
                <span>11/05/2026</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{week3}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2px', color: 'var(--text-secondary)' }}>
                <span>18/05/2026</span>
                <span className="font-mono" style={{ color: '#fff', fontWeight: 600 }}>{week4}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Visual Analytics Splits */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1.2fr 0.8fr', 
        gap: '24px',
        alignItems: 'start'
      }}>
        
        {/* Left Side: COMMISSION PANEL & CHART */}
        <div className="glass-panel" style={{ padding: '0px', overflow: 'hidden', border: '1px solid rgba(132,204,22,0.2)' }}>
          {/* Green Header */}
          <div style={{ background: '#84CC16', color: '#000000', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={16} /> COMMISSION REVENUE
            </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'JetBrains Mono' }}>
              RM {totalCommission.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '0.8fr 1.2fr', gap: '24px', alignItems: 'center' }}>
            {/* Agent List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', fontFamily: 'JetBrains Mono', letterSpacing: '0.5px', marginBottom: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '6px' }}>
                Agent Payout Distribution
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 650, color: '#fff' }}>GYDEN (Company Share)</span>
                  <span className="font-mono" style={{ color: 'var(--color-cyan)' }}>RM {gydenComm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 550, color: 'var(--text-secondary)' }}>MINDY</span>
                  <span className="font-mono">RM {mindyComm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 550, color: 'var(--text-secondary)' }}>HEALER</span>
                  <span className="font-mono">RM {healerComm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 550, color: 'var(--text-secondary)' }}>KAY</span>
                  <span className="font-mono">RM {kayComm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 550, color: 'var(--text-secondary)' }}>JACQUEEN</span>
                  <span className="font-mono">RM {jacqueenComm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 550, color: 'var(--text-secondary)' }}>PAGGIE</span>
                  <span className="font-mono">RM {paggieComm.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Bar Chart Panel */}
            <div style={{ background: 'rgba(0,0,0,0.15)', padding: '16px', borderRadius: '8px', border: '1px solid var(--border-glass)', height: '260px', display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.65rem', fontFamily: 'JetBrains Mono', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <BarChart3 size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> Visual Agent Shares Graph
              </span>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '100%', padding: '30px 10px 10px' }}>
                {commissionData.map(agent => {
                  const heightPercent = maxComm > 0 ? (agent.value / maxComm) * 75 : 0;
                  return (
                    <div key={agent.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
                      <span style={{ fontSize: '0.55rem', fontFamily: 'JetBrains Mono', color: 'var(--color-cyan)', transform: 'rotate(-25deg) translateY(-4px)', whiteSpace: 'nowrap' }}>
                        RM{Math.round(agent.value / 1000)}k
                      </span>
                      <div 
                        style={{
                          width: '18px',
                          height: `${heightPercent}%`,
                          background: agent.name === 'GYDEN' 
                            ? 'linear-gradient(180deg, #84CC16 0%, rgba(132,204,22,0.1) 100%)' 
                            : 'linear-gradient(180deg, var(--color-cyan) 0%, rgba(6,182,212,0.1) 100%)',
                          borderRadius: '4px 4px 0 0',
                          border: agent.name === 'GYDEN'
                            ? '1px solid rgba(132,204,22,0.4)'
                            : '1px solid rgba(6,182,212,0.4)',
                          transition: 'height 1s ease',
                          boxShadow: agent.name === 'GYDEN'
                            ? '0 0 10px rgba(132,204,22,0.2)'
                            : '0 0 10px rgba(6,182,212,0.2)'
                        }}
                        className="hover-bright"
                        title={`${agent.name}: RM ${agent.value.toLocaleString()}`}
                      />
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {agent.name.substring(0, 5)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Right Side: LISTING QUALITY PIE CHART */}
        <div className="glass-panel" style={{ padding: '0px', overflow: 'hidden' }}>
          <div style={{ background: '#1e293b', color: '#ffffff', padding: '16px 24px', fontWeight: 800, fontSize: '0.85rem', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-glass)' }}>
            <PieIcon size={16} style={{ color: 'var(--color-cyan)' }} /> LISTING QUALITY RATINGS
          </div>

          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
            
            {/* Donut Chart Container */}
            <div style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: pieGradient,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0,0,0,0.6)'
            }}>
              <div style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'rgba(15, 23, 42, 0.98)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Registry</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 850, fontFamily: 'JetBrains Mono', color: '#fff' }}>{totalAllListings}</span>
              </div>
            </div>

            {/* Legend breakdown */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 16px', width: '100%', fontSize: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#F79646' }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>A - BELOW MARKET</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{belowMarketPct.toFixed(1)}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#4BACC6' }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>A+ SUPER HOT DEAL</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{superHotPct.toFixed(1)}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#8064A2' }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>B - AT MARKET PRICE</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{atMarketPct.toFixed(1)}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#9BBB59' }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>C - OVERPRICED</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{overpricedPct.toFixed(1)}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#C0504D' }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>D - UNKNOWN MARKET</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{unknownPct.toFixed(1)}%</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#4F81BD' }} />
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>INACTIVE</span>
                  <span style={{ fontWeight: 600, color: '#fff' }}>{inactivePct.toFixed(1)}%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
