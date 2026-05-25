import React, { useState, useEffect, useRef } from 'react';
import { ClipboardCheck, ArrowUpRight, Upload, X, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';
import { dbService } from '../services/db';
import type { ListingNew, User } from '../services/db';
import { CsvImporterModal } from './CsvImporterModal';

interface IntakeViewProps {
  currentUser: User;
  onNavigateToMaster: () => void;
}

export const IntakeView: React.FC<IntakeViewProps> = ({ currentUser, onNavigateToMaster }) => {
  const [stagingListings, setStagingListings] = useState<ListingNew[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImporter, setShowImporter] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerContact, setOwnerContact] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  
  // Spreadsheet integration fields
  const [rawWaTemplate, setRawWaTemplate] = useState('');
  const [marketRating, setMarketRating] = useState('');
  const [saleRent, setSaleRent] = useState('sale');
  const [state, setState] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [roomsRemarks, setRoomsRemarks] = useState('');
  const [unitNo, setUnitNo] = useState('');
  const [size, setSize] = useState('');
  const [gdriveLink, setGdriveLink] = useState('');
  const [finalWaTemplate, setFinalWaTemplate] = useState('');
  const [privateNotes, setPrivateNotes] = useState('');

  // Sub-panel tabs state
  const [formTab, setFormTab] = useState<'specs' | 'client' | 'wa'>('specs');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchStaging = async () => {
    try {
      const data = await dbService.getListingsNew();
      setStagingListings(data.filter(l => l.verification_status === 'pending'));
    } catch (err) {
      console.error('Error fetching staging listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaging();
  }, []);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const file = e.target.files[0];
        const dataUrl = await dbService.uploadPhoto(file);
        setPhotos(prev => [...prev, dataUrl]);
      } catch (err) {
        console.error('Photo upload failed:', err);
      }
    }
  };

  const removePhoto = (idx: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddStaging = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const parsedPrice = parseFloat(price.replace(/,/g, ''));
    if (!title || !address || isNaN(parsedPrice) || parsedPrice <= 0 || !ownerName || !ownerContact) {
      setError('Complete all mandatory staging data fields (Title, Address, Price, Owner Name, Owner Contact).');
      return;
    }

    try {
      setIsSubmitting(true);
      await dbService.createListingNew(
        title,
        address,
        parsedPrice,
        ownerName,
        ownerContact,
        photos,
        rawWaTemplate,
        marketRating,
        saleRent,
        state,
        propertyType,
        roomsRemarks,
        unitNo,
        size,
        gdriveLink,
        finalWaTemplate,
        privateNotes
      );
      setSuccess('Property uploaded successfully to Intake (Staging Area).');
      
      // Reset form
      setTitle('');
      setAddress('');
      setPrice('');
      setOwnerName('');
      setOwnerContact('');
      setPhotos([]);
      setRawWaTemplate('');
      setMarketRating('');
      setSaleRent('sale');
      setState('');
      setPropertyType('');
      setRoomsRemarks('');
      setUnitNo('');
      setSize('');
      setGdriveLink('');
      setFinalWaTemplate('');
      setPrivateNotes('');
      setFormTab('specs');

      fetchStaging();
    } catch (err: any) {
      setError(err.message || 'Intake upload failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleChecklist = async (id: string, currentStatus: boolean) => {
    try {
      await dbService.validateChecklist(id, !currentStatus);
      fetchStaging();
    } catch (err) {
      console.error('Failed to toggle checklist validation:', err);
    }
  };

  const handlePromote = async (id: string) => {
    setError('');
    setSuccess('');
    try {
      await dbService.verifyAndPromoteListing(id);
      setSuccess('Staging property verified and promoted to MASTER database successfully!');
      fetchStaging();
      setTimeout(() => {
        setSuccess('');
        onNavigateToMaster();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Promotion to MASTER failed.');
    }
  };

  // Resolve permission level
  const isMelissaOrAdmin = currentUser.role === 'listing_melissa' || currentUser.role === 'admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
            INTAKE TRACK // <span className="text-glow-cyan" style={{ color: 'var(--color-cyan)' }}>LISTING_NEW</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Intake staging area. Register property details. Listing Verification Team (Melissa) promotes verified files to the Master Database.
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
          <CheckCircle2 size={16} />
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

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1.1fr', 
        gap: '24px' 
      }}>
        
        {/* Left Column: Form to submit (available to ALL users) */}
        <form onSubmit={handleAddStaging} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'fit-content' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', color: 'var(--color-cyan)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>NEW PROPERTY INTAKE SHEET</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>(* REQUIRED)</span>
          </h3>

          {/* Futuristic Tab Selector */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
            <button 
              type="button" 
              onClick={() => setFormTab('specs')}
              style={{
                flex: 1,
                padding: '8px 8px',
                borderRadius: '6px',
                border: 'none',
                background: formTab === 'specs' ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
                color: formTab === 'specs' ? 'var(--color-cyan)' : 'var(--text-secondary)',
                fontSize: '0.7rem',
                fontFamily: 'JetBrains Mono',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: formTab === 'specs' ? '1px solid var(--color-cyan)' : 'none'
              }}
            >
              PRIMARY SPECS
            </button>
            <button 
              type="button" 
              onClick={() => setFormTab('client')}
              style={{
                flex: 1,
                padding: '8px 8px',
                borderRadius: '6px',
                border: 'none',
                background: formTab === 'client' ? 'rgba(168, 85, 247, 0.12)' : 'transparent',
                color: formTab === 'client' ? 'var(--color-purple)' : 'var(--text-secondary)',
                fontSize: '0.7rem',
                fontFamily: 'JetBrains Mono',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: formTab === 'client' ? '1px solid var(--color-purple)' : 'none'
              }}
            >
              CLIENT & PHOTOS
            </button>
            <button 
              type="button" 
              onClick={() => setFormTab('wa')}
              style={{
                flex: 1,
                padding: '8px 8px',
                borderRadius: '6px',
                border: 'none',
                background: formTab === 'wa' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                color: formTab === 'wa' ? 'var(--color-green)' : 'var(--text-secondary)',
                fontSize: '0.7rem',
                fontFamily: 'JetBrains Mono',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderBottom: formTab === 'wa' ? '1px solid var(--color-green)' : 'none'
              }}
            >
              WA TEMPLATES
            </button>
          </div>

          {/* TAB 1: Specs */}
          {formTab === 'specs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  Listing Title <span style={{ color: 'var(--color-red)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  placeholder="e.g. Cyberjaya Smarthome Condominium"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Price Requested (RM) <span style={{ color: 'var(--color-red)' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    placeholder="e.g. 550,000"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Sale / Rent
                  </label>
                  <select
                    className="cyber-input"
                    value={saleRent}
                    onChange={e => setSaleRent(e.target.value)}
                    disabled={isSubmitting}
                    style={{ background: '#090d16', color: 'white' }}
                  >
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Property Type
                  </label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    placeholder="e.g. Condominium, Semi-D"
                    value={propertyType}
                    onChange={e => setPropertyType(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    State
                  </label>
                  <select
                    className="cyber-input"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    disabled={isSubmitting}
                    style={{ background: '#090d16', color: 'white' }}
                  >
                    <option value="">Select State</option>
                    <option value="Selangor">Selangor</option>
                    <option value="Kuala Lumpur">Kuala Lumpur</option>
                    <option value="Johor">Johor</option>
                    <option value="Penang">Penang</option>
                    <option value="Perak">Perak</option>
                    <option value="Negeri Sembilan">Negeri Sembilan</option>
                    <option value="Melaka">Melaka</option>
                    <option value="Kedah">Kedah</option>
                    <option value="Pahang">Pahang</option>
                    <option value="Kelantan">Kelantan</option>
                    <option value="Terengganu">Terengganu</option>
                    <option value="Perlis">Perlis</option>
                    <option value="Sabah">Sabah</option>
                    <option value="Sarawak">Sarawak</option>
                    <option value="Labuan">Labuan</option>
                    <option value="Putrajaya">Putrajaya</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Unit No
                  </label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    placeholder="e.g. C-15-04"
                    value={unitNo}
                    onChange={e => setUnitNo(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Size
                  </label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    placeholder="e.g. 1,050 sqft"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  Rooms / Remarks
                </label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  placeholder="e.g. 3R 2B, High Floor"
                  value={roomsRemarks}
                  onChange={e => setRoomsRemarks(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  Property Address <span style={{ color: 'var(--color-red)' }}>*</span>
                </label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  placeholder="e.g. Block C, Level 15, Cyberjaya Residences"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* TAB 2: Client */}
          {formTab === 'client' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Owner Name <span style={{ color: 'var(--color-red)' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    placeholder="e.g. Dr. Evelyn"
                    value={ownerName}
                    onChange={e => setOwnerName(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                    Owner Contact <span style={{ color: 'var(--color-red)' }}>*</span>
                  </label>
                  <input 
                    type="text" 
                    className="cyber-input" 
                    placeholder="e.g. +6012-345-6789"
                    value={ownerContact}
                    onChange={e => setOwnerContact(e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  Market Rating
                </label>
                <input 
                  type="text" 
                  className="cyber-input" 
                  placeholder="e.g. A, B+, Hot Property"
                  value={marketRating}
                  onChange={e => setMarketRating(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  Google Drive Photos Folder Link
                </label>
                <input 
                  type="url" 
                  className="cyber-input" 
                  placeholder="e.g. https://drive.google.com/drive/..."
                  value={gdriveLink}
                  onChange={e => setGdriveLink(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {/* Photo upload component */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  Property Photos (At least 1 photo or GDrive link required)
                </label>
                
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {photos.map((url, idx) => (
                    <div key={idx} style={{ width: '50px', height: '50px', borderRadius: '4px', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-glass)' }}>
                      <img src={url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="prop" />
                      <button 
                        type="button"
                        onClick={() => removePhoto(idx)}
                        style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'var(--color-red)', padding: '2px', cursor: 'pointer' }}
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  
                  <button 
                    type="button"
                    className="cyber-button cyber-button-secondary"
                    onClick={() => fileInputRef.current?.click()}
                    style={{ width: '50px', height: '50px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Upload size={16} />
                  </button>
                  <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  Private Notes
                </label>
                <textarea 
                  className="cyber-input" 
                  rows={3}
                  placeholder="Confidential remarks, viewing code, agent commissions..."
                  value={privateNotes}
                  onChange={e => setPrivateNotes(e.target.value)}
                  disabled={isSubmitting}
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          )}

          {/* TAB 3: WA Templates */}
          {formTab === 'wa' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  Raw WhatsApp Template
                </label>
                <textarea 
                  className="cyber-input font-mono" 
                  rows={6}
                  placeholder="Paste the raw WhatsApp post text copy received..."
                  value={rawWaTemplate}
                  onChange={e => setRawWaTemplate(e.target.value)}
                  disabled={isSubmitting}
                  style={{ resize: 'vertical', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontFamily: 'JetBrains Mono' }}>
                  Final WhatsApp Template
                </label>
                <textarea 
                  className="cyber-input font-mono" 
                  rows={6}
                  placeholder="Copy of compiled final formatted WhatsApp sharing copy..."
                  value={finalWaTemplate}
                  onChange={e => setFinalWaTemplate(e.target.value)}
                  disabled={isSubmitting}
                  style={{ resize: 'vertical', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}
                />
              </div>
            </div>
          )}

          {/* Submit Button always visible */}
          <button 
            type="submit" 
            className="cyber-button"
            disabled={isSubmitting}
            style={{ width: '100%', marginTop: '6px', background: 'linear-gradient(90deg, var(--color-cyan), var(--color-purple))' }}
          >
            {isSubmitting ? 'Uploading to Intake...' : 'Submit Listing to Intake Staging'}
          </button>
        </form>

        {/* Right Column: Intake items list for promotion (Melissa view) */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px', color: 'var(--color-purple)' }}>
            STAGED INTAKE LISTINGS QUEUE ({stagingListings.length})
          </h3>

          {loading ? (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>Syncing queue...</div>
          ) : stagingListings.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <ClipboardCheck size={40} style={{ opacity: 0.2, alignSelf: 'center' }} />
              <span style={{ fontSize: '0.85rem' }}>No properties in staging queue.</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '550px', overflowY: 'auto', paddingRight: '4px' }}>
              {stagingListings.map(listing => {
                // Checklist constraints evaluate (Photos OR Google Drive photos link satisfies constraint)
                const isTitleOk = !!listing.title;
                const isAddressOk = !!listing.address;
                const isPriceOk = listing.price_requested > 0;
                const isOwnerOk = !!(listing.owner_name && listing.owner_contact);
                const isPhotosOrDriveOk = listing.photos.length > 0 || !!listing.gdrive_link;
                const totalPassed = [isTitleOk, isAddressOk, isPriceOk, isOwnerOk, isPhotosOrDriveOk].filter(Boolean).length;

                return (
                  <div 
                    key={listing.id}
                    style={{ 
                      padding: '16px', 
                      borderRadius: '8px', 
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{listing.title}</span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono' }}>
                          ID: {listing.property_id} // Sales: {listing.salesperson_name.split(' ')[0]}
                        </span>
                      </div>
                      <span className="cyber-badge cyber-badge-cyan" style={{ fontFamily: 'JetBrains Mono', fontSize: '0.65rem' }}>
                        RM {listing.price_requested.toLocaleString()}
                      </span>
                    </div>

                    {/* Staging verification checklist status indicators */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', fontSize: '0.75rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'JetBrains Mono', color: 'var(--text-secondary)' }}>MANDATORY CHECKLIST:</span>
                        <span style={{ fontWeight: 600, color: totalPassed === 5 ? 'var(--color-green)' : 'var(--color-amber)' }}>
                          {totalPassed}/5 Criteria
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4px', fontSize: '0.7rem' }}>
                        <span style={{ color: isTitleOk ? 'var(--color-green)' : 'var(--color-red)' }}>
                          {isTitleOk ? '✓' : '✗'} Title Info
                        </span>
                        <span style={{ color: isAddressOk ? 'var(--color-green)' : 'var(--color-red)' }}>
                          {isAddressOk ? '✓' : '✗'} Address Location
                        </span>
                        <span style={{ color: isPriceOk ? 'var(--color-green)' : 'var(--color-red)' }}>
                          {isPriceOk ? '✓' : '✗'} Base Price
                        </span>
                        <span style={{ color: isOwnerOk ? 'var(--color-green)' : 'var(--color-red)' }}>
                          {isOwnerOk ? '✓' : '✗'} Owner Data
                        </span>
                        <span style={{ color: isPhotosOrDriveOk ? 'var(--color-green)' : 'var(--color-red)' }}>
                          {isPhotosOrDriveOk ? '✓' : '✗'} Photos / GDrive Link
                        </span>
                      </div>
                    </div>

                    {/* Verification and promotion logic actions */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: isMelissaOrAdmin ? 'pointer' : 'default' }}>
                        <input 
                          type="checkbox"
                          checked={listing.is_checklist_passed}
                          disabled={!isMelissaOrAdmin}
                          onChange={() => handleToggleChecklist(listing.id, listing.is_checklist_passed)}
                          style={{ accentColor: 'var(--color-cyan)' }}
                        />
                        <span>Confirm Checklist Verified</span>
                      </label>

                      {/* Promote buttons */}
                      {isMelissaOrAdmin ? (
                        <button 
                          className="cyber-button"
                          onClick={() => handlePromote(listing.id)}
                          disabled={!listing.is_checklist_passed}
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          Verify & Promote <ArrowUpRight size={12} />
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          <ShieldAlert size={12} /> Verification Locked (Melissa)
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {showImporter && (
        <CsvImporterModal 
          currentUser={currentUser} 
          onClose={() => setShowImporter(false)} 
          onImportComplete={fetchStaging} 
        />
      )}

    </div>
  );
};
