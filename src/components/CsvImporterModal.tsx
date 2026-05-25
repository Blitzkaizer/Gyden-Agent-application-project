import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, AlertTriangle, ArrowRight, ArrowLeft, Loader2, Sparkles, FileSpreadsheet } from 'lucide-react';
import { dbService } from '../services/db';
import type { User, ListingNew, MasterListing } from '../services/db';

interface CsvImporterModalProps {
  currentUser: User;
  onClose: () => void;
  onImportComplete: () => void;
}

// Database fields mapping targets
interface DbMappingField {
  key: string;
  label: string;
  required: boolean;
  suggestions: string[];
}

const DB_MAPPING_FIELDS: DbMappingField[] = [
  { key: 'title', label: 'Property Title', required: true, suggestions: ['title', 'property', 'name', 'listing', 'project', 'unit'] },
  { key: 'price', label: 'Price (RM)', required: true, suggestions: ['price', 'requested price', 'asking price', 'selling price', 'amount', 'rate', 'cost'] },
  { key: 'owner_name', label: 'Owner Name', required: true, suggestions: ['owner', 'owner name', 'proprietor', 'landlord', 'seller', 'client'] },
  { key: 'owner_contact', label: 'Owner Contact', required: true, suggestions: ['contact', 'phone', 'mobile', 'tel', 'owner contact', 'owner phone', 'owner number'] },
  { key: 'address', label: 'Address', required: false, suggestions: ['address', 'location', 'site', 'street', 'where'] },
  { key: 'raw_wa_template', label: 'Raw WA Template', required: false, suggestions: ['raw wa', 'whatsapp template', 'raw template', 'whatsapp'] },
  { key: 'market_rating', label: 'Market Rating', required: false, suggestions: ['rating', 'market rating', 'grade'] },
  { key: 'sale_rent', label: 'Sale/Rent', required: false, suggestions: ['sale/rent', 'sale or rent', 'deal type', 'mode'] },
  { key: 'state', label: 'State', required: false, suggestions: ['state', 'region', 'area'] },
  { key: 'property_type', label: 'Property Type', required: false, suggestions: ['property type', 'type', 'category', 'class'] },
  { key: 'rooms_remarks', label: 'Rooms / Remarks', required: false, suggestions: ['rooms', 'remarks', 'rooms/remarks', 'room'] },
  { key: 'unit_no', label: 'Unit No', required: false, suggestions: ['unit', 'unit no', 'unit number'] },
  { key: 'size', label: 'Size', required: false, suggestions: ['size', 'area', 'sqft', 'sqm'] },
  { key: 'gdrive_link', label: 'GDrive Link', required: false, suggestions: ['drive', 'gdrive', 'google drive', 'link'] },
  { key: 'final_wa_template', label: 'Final WA Template', required: false, suggestions: ['final wa', 'final whatsapp'] },
  { key: 'private_notes', label: 'Private Notes', required: false, suggestions: ['private notes', 'notes', 'private'] }
];

// Helper parser to split CSV with quotes support
function parseCSV(text: string): string[][] {
  const result: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        row.push(cell.trim());
        cell = '';
      } else if (char === '\r' || char === '\n') {
        row.push(cell.trim());
        cell = '';
        if (row.length > 0 && row.some(c => c !== '')) {
          result.push(row);
        }
        row = [];
        if (char === '\r' && nextChar === '\n') {
          i++; // Skip \n
        }
      } else {
        cell += char;
      }
    }
  }

  if (cell !== '' || row.length > 0) {
    row.push(cell.trim());
    if (row.some(c => c !== '')) {
      result.push(row);
    }
  }

  return result;
}

export const CsvImporterModal: React.FC<CsvImporterModalProps> = ({ currentUser, onClose, onImportComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Data states
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvRows, setCsvRows] = useState<string[][]>([]);
  const [fileName, setFileName] = useState('');
  
  // Field mappings: maps database field key to CSV header index (or empty string if unmapped)
  const [mappings, setMappings] = useState<Record<string, string>>({});
  
  // Target destination settings
  const defaultDestination = currentUser.role === 'sales' ? 'staging' : 'master';
  const [destination, setDestination] = useState<'staging' | 'master'>(defaultDestination);
  
  // Validation, Loading & Error flags
  const [parsedItems, setParsedItems] = useState<any[]>([]);
  const [validationReport, setValidationReport] = useState<{ total: number; valid: number; warnings: number; errors: number; details: string[] }>({
    total: 0, valid: 0, warnings: 0, errors: 0, details: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-detection of columns
  const autoMapColumns = (headers: string[]) => {
    const initialMap: Record<string, string> = {};
    DB_MAPPING_FIELDS.forEach(field => {
      // Find a header that matches any of the suggestions
      const foundIdx = headers.findIndex(h => {
        const cleaned = h.toLowerCase().trim();
        return field.suggestions.some(s => cleaned.includes(s) || s.includes(cleaned));
      });
      if (foundIdx !== -1) {
        initialMap[field.key] = foundIdx.toString();
      } else {
        initialMap[field.key] = '';
      }
    });
    setMappings(initialMap);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setError('');
    if (!file.name.endsWith('.csv')) {
      setError('Unsupported file type. Please upload a standard comma-separated value (.csv) text file.');
      return;
    }

    setFileName(file.name);
    setLoading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          throw new Error('CSV file is empty.');
        }

        const headers = parsed[0];
        const rows = parsed.slice(1);

        if (headers.length === 0) {
          throw new Error('No headers found in the uploaded CSV file.');
        }

        setCsvHeaders(headers);
        setCsvRows(rows);
        autoMapColumns(headers);
        
        // Go to column mapper
        setStep(2);
      } catch (err: any) {
        setError(err.message || 'Error reading or parsing the CSV file.');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('FileReader failed to process the chosen file.');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  // Build rows data based on mappings and perform validation
  useEffect(() => {
    if (step !== 3) return;

    let validCount = 0;
    let warningCount = 0;
    let errorCount = 0;
    const details: string[] = [];
    const items: any[] = [];

    csvRows.forEach((row, rowIdx) => {
      const item: Record<string, any> = {};
      let rowWarnings = 0;
      let rowErrors = 0;

      // Extract values based on mapping indices
      DB_MAPPING_FIELDS.forEach(field => {
        const mapIdxStr = mappings[field.key];
        let val = '';
        if (mapIdxStr !== '') {
          const idx = parseInt(mapIdxStr, 10);
          val = row[idx] || '';
        }
        item[field.key] = val;
      });

      // Apply row checking
      const title = item.title?.trim() || '';
      const priceRaw = item.price?.replace(/[^\d.-]/g, '') || '';
      const price = parseFloat(priceRaw) || 0;
      const ownerName = item.owner_name?.trim() || '';
      const ownerContact = item.owner_contact?.trim() || '';
      
      // Basic validations
      if (!title) {
        rowErrors++;
        details.push(`Row ${rowIdx + 1}: Missing Property Title.`);
      }
      if (price <= 0) {
        rowErrors++;
        details.push(`Row ${rowIdx + 1}: Price must be a positive number (Got: "${item.price}").`);
      }
      if (!ownerName) {
        rowWarnings++;
        details.push(`Row ${rowIdx + 1}: Missing Owner Name.`);
      }
      if (!ownerContact) {
        rowWarnings++;
        details.push(`Row ${rowIdx + 1}: Missing Owner Contact details.`);
      }

      if (rowErrors > 0) {
        errorCount++;
      } else if (rowWarnings > 0) {
        warningCount++;
        validCount++; // Warnings still allow import, but display alert
      } else {
        validCount++;
      }

      // Format target parameters matching local database models
      const propertyId = `G-${1000 + Math.floor(Math.random() * 9000)}`;

      if (destination === 'staging') {
        const stagingItem: Omit<ListingNew, 'id' | 'created_at'> = {
          property_id: propertyId,
          title: title || `Untitled Listing ${rowIdx + 1}`,
          address: item.address || 'Address Not Provided',
          price_requested: price,
          owner_name: ownerName || 'Unknown Owner',
          owner_contact: ownerContact || 'No Contact Number',
          photos: [],
          salesperson_id: currentUser.id,
          salesperson_name: currentUser.name,
          is_checklist_passed: !rowWarnings && !rowErrors, // checklist passes if clean
          verification_status: 'pending',
          raw_wa_template: item.raw_wa_template || '',
          market_rating: item.market_rating || '',
          sale_rent: item.sale_rent || 'sale',
          state: item.state || '',
          property_type: item.property_type || '',
          rooms_remarks: item.rooms_remarks || '',
          unit_no: item.unit_no || '',
          size: item.size || '',
          gdrive_link: item.gdrive_link || '',
          final_wa_template: item.final_wa_template || '',
          private_notes: item.private_notes || ''
        };
        items.push(stagingItem);
      } else {
        const masterItem: Omit<MasterListing, 'id' | 'created_at'> = {
          property_id: propertyId,
          title: title || `Untitled Listing ${rowIdx + 1}`,
          address: item.address || 'Address Not Provided',
          price: price,
          status: 'active',
          photos: [],
          salesperson_id: currentUser.id,
          salesperson_name: currentUser.name,
          verified_by: currentUser.name,
          owner_name: ownerName || 'Unknown Owner',
          owner_contact: ownerContact || 'No Contact Number',
          raw_wa_template: item.raw_wa_template || '',
          market_rating: item.market_rating || '',
          sale_rent: item.sale_rent || 'sale',
          state: item.state || '',
          property_type: item.property_type || '',
          rooms_remarks: item.rooms_remarks || '',
          unit_no: item.unit_no || '',
          size: item.size || '',
          gdrive_link: item.gdrive_link || '',
          final_wa_template: item.final_wa_template || '',
          private_notes: item.private_notes || ''
        };
        items.push(masterItem);
      }
    });

    setParsedItems(items);
    setValidationReport({
      total: csvRows.length,
      valid: validCount,
      warnings: warningCount,
      errors: errorCount,
      details: details.slice(0, 8) // Cap visual details at 8 items
    });
  }, [step, mappings, destination, csvRows]);

  const handleExecuteImport = async () => {
    setLoading(true);
    setError('');
    try {
      if (destination === 'staging') {
        await dbService.bulkInsertStagingListings(parsedItems);
      } else {
        await dbService.bulkInsertMasterListings(parsedItems);
      }
      setStep(4);
    } catch (err: any) {
      setError(err.message || 'Import transaction failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldMapChange = (fieldKey: string, headerIdx: string) => {
    setMappings(prev => ({
      ...prev,
      [fieldKey]: headerIdx
    }));
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel cyber-scanner-container" style={{
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '12px',
        padding: '0px',
        overflow: 'hidden',
        border: '1px solid var(--border-glass)',
        background: 'rgba(15, 23, 42, 0.95)'
      }}>
        {/* Modal Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(6,182,212,0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(0,0,0,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileSpreadsheet className="text-glow-cyan" style={{ color: 'var(--color-cyan)' }} size={20} />
            <span style={{ fontWeight: 700, letterSpacing: '1px', fontFamily: 'JetBrains Mono', fontSize: '0.95rem' }}>
              BULK DATA IMPORT TELEMETRY
            </span>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
            className="hover-bright"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Steps */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {error && (
            <div style={{
              background: 'rgba(244,63,94,0.1)',
              border: '1px solid var(--color-red)',
              borderRadius: '6px',
              color: 'var(--color-red)',
              padding: '12px 16px',
              marginBottom: '16px',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Stepper Progress */}
          {step < 4 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 8px' }}>
              {[1, 2, 3].map((s) => (
                <React.Fragment key={s}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: step === s ? 'var(--color-cyan)' : step > s ? 'var(--color-green)' : 'rgba(255,255,255,0.1)',
                      color: step >= s ? '#000' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      fontFamily: 'JetBrains Mono'
                    }}>
                      {step > s ? <Check size={12} /> : s}
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: step === s ? 600 : 400,
                      color: step === s ? 'var(--color-cyan)' : 'var(--text-secondary)'
                    }}>
                      {s === 1 ? 'UPLOAD CSV' : s === 2 ? 'MAP COLUMNS' : 'VALIDATE & IMPORT'}
                    </span>
                  </div>
                  {s < 3 && <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0 16px' }} />}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* STEP 1: Drag & Drop File */}
          {step === 1 && (
            <div 
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              style={{
                border: dragActive ? '2px dashed var(--color-cyan)' : '2px dashed rgba(255,255,255,0.15)',
                background: dragActive ? 'rgba(6,182,212,0.05)' : 'rgba(0,0,0,0.15)',
                borderRadius: '8px',
                padding: '48px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                ref={fileInputRef}
                type="file" 
                accept=".csv" 
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                  <Loader2 size={36} className="animate-spin" style={{ color: 'var(--color-cyan)' }} />
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Parsing telemetry spreadsheet...</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: 'rgba(6,182,212,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-cyan)'
                  }}>
                    <Upload size={24} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '6px' }}>Drag and Drop your CSV spreadsheet</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Supports files exported from Google Sheets, Microsoft Excel, or LibreOffice.
                    </p>
                  </div>
                  <button type="button" className="cyber-button" style={{ fontSize: '0.8rem', padding: '8px 20px' }}>
                    Select CSV File
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: MAPPING COLUMNS */}
          {step === 2 && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Active file: <b style={{ color: 'var(--color-cyan)' }}>{fileName}</b> ({csvRows.length} properties detected)
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-purple)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={12} /> Smart Auto-Mapping Active
                </span>
              </div>

              <div className="glass-panel" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                  Map the database fields on the left to your CSV headers. Required fields must be mapped to proceed.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {DB_MAPPING_FIELDS.map(field => {
                    const mappedVal = mappings[field.key] || '';
                    
                    return (
                      <div key={field.key} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '6px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{field.label}</span>
                          {field.required && <span style={{ color: 'var(--color-red)', fontSize: '0.8rem' }}>*</span>}
                        </div>

                        <select 
                          className="cyber-input"
                          value={mappedVal}
                          onChange={(e) => handleFieldMapChange(field.key, e.target.value)}
                          style={{ width: '220px', padding: '6px', fontSize: '0.75rem', background: '#090d16' }}
                        >
                          <option value="">[ Unmapped / Blank ]</option>
                          {csvHeaders.map((header, idx) => (
                            <option key={idx} value={idx.toString()}>
                              CSV: {header}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PREVIEW & DESTINATION SELECT */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Destination Selector governed by RBAC */}
              <div className="glass-panel" style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-cyan)' }}>
                  TARGET DATABASE DESTINATION
                </h4>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <select 
                    className="cyber-input"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value as any)}
                    disabled={currentUser.role === 'sales'}
                    style={{ flex: 1, padding: '8px', fontSize: '0.85rem', background: '#090d16' }}
                  >
                    <option value="staging">STAGING INTAKE (LISTING_NEW) - Requires Verification</option>
                    {currentUser.role !== 'sales' && (
                      <option value="master">MASTER DATABASE (MASTER) - Direct Verified Promotion</option>
                    )}
                  </select>
                  
                  {currentUser.role === 'sales' && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertTriangle size={12} /> Locked to Staging (Sales Role restriction)
                    </span>
                  )}
                </div>
              </div>

              {/* Validation Summary Report */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
                gap: '12px'
              }}>
                <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>TOTAL DETECTED</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'JetBrains Mono' }}>{validationReport.total}</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid var(--color-green)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-green)' }}>READY TO IMPORT</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--color-green)' }}>{validationReport.valid}</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid var(--color-purple)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-purple)' }}>WARNING ROWS</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--color-purple)' }}>{validationReport.warnings}</div>
                </div>
                <div className="glass-panel" style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid var(--color-red)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--color-red)' }}>ERROR ROWS (SKIPPED)</span>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'JetBrains Mono', color: 'var(--color-red)' }}>{validationReport.errors}</div>
                </div>
              </div>

              {/* Warnings details */}
              {validationReport.details.length > 0 && (
                <div className="glass-panel" style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', maxHeight: '180px', overflowY: 'auto' }}>
                  <h5 style={{ fontSize: '0.75rem', color: 'var(--color-purple)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <AlertTriangle size={12} /> COMPLIANCE SCANNER SUMMARY REPORT
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.75rem', fontFamily: 'JetBrains Mono' }}>
                    {validationReport.details.map((d, i) => (
                      <span key={i} style={{ color: d.includes('Missing') ? 'var(--text-secondary)' : 'var(--color-red)' }}>
                        {d}
                      </span>
                    ))}
                    {validationReport.details.length >= 8 && (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontStyle: 'italic' }}>...And more warnings suppressed from feed.</span>
                    )}
                  </div>
                </div>
              )}

              {/* Sample Grid Preview */}
              <div className="glass-panel" style={{ padding: '16px', overflowX: 'auto' }}>
                <h5 style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>FIRST 3 DATASET TELEMETRY PREVIEWS</h5>
                <table style={{ width: '100%', fontSize: '0.75rem', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--color-cyan)', fontFamily: 'JetBrains Mono' }}>
                      <th style={{ padding: '6px' }}>TITLE</th>
                      <th style={{ padding: '6px' }}>PRICE (RM)</th>
                      <th style={{ padding: '6px' }}>OWNER</th>
                      <th style={{ padding: '6px' }}>CONTACT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedItems.slice(0, 3).map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '6px', fontWeight: 600 }}>{item.title}</td>
                        <td style={{ padding: '6px', fontFamily: 'JetBrains Mono' }}>
                          {destination === 'staging' ? item.price_requested.toLocaleString() : item.price.toLocaleString()}
                        </td>
                        <td style={{ padding: '6px' }}>{item.owner_name}</td>
                        <td style={{ padding: '6px', fontFamily: 'JetBrains Mono' }}>{item.owner_contact}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS ANIMATION */}
          {step === 4 && (
            <div style={{ textAlign: 'center', padding: '36px 12px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(16,185,129,0.1)',
                border: '2px solid var(--color-green)',
                color: 'var(--color-green)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px'
              }} className="pulse-cyan">
                <Check size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px' }}>BULK UPLINK COMPLETE</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 24px' }}>
                Successfully parsed telemetry and uploaded properties into the active {destination === 'staging' ? 'Staging Intake' : 'Master Ledger'} database.
              </p>
              <button 
                type="button" 
                className="cyber-button" 
                onClick={() => { onImportComplete(); onClose(); }}
                style={{ padding: '10px 24px' }}
              >
                Return to Command Center
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer (Control buttons) */}
        {step < 4 && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(6,182,212,0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.2)'
          }}>
            {step === 1 ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Maximum size limit: 5MB (approx. 10,000 listings)
              </div>
            ) : (
              <button 
                type="button" 
                onClick={() => setStep((step - 1) as any)}
                className="cyber-button cyber-button-secondary"
                style={{ padding: '6px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <ArrowLeft size={14} /> Back
              </button>
            )}

            {step === 2 && (
              <button 
                type="button" 
                onClick={() => {
                  // Validate mapping requirements
                  const missingReq = DB_MAPPING_FIELDS.filter(f => f.required && !mappings[f.key]);
                  if (missingReq.length > 0) {
                    setError(`Mapping failed: You must map the required fields: ${missingReq.map(f => f.label).join(', ')}.`);
                    return;
                  }
                  setError('');
                  setStep(3);
                }}
                className="cyber-button"
                style={{ padding: '6px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                Validate Mapping <ArrowRight size={14} />
              </button>
            )}

            {step === 3 && (
              <button 
                type="button" 
                onClick={handleExecuteImport}
                disabled={loading || parsedItems.length === 0}
                className="cyber-button"
                style={{
                  padding: '6px 20px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(90deg, var(--color-cyan), var(--color-purple))'
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Uploading...
                  </>
                ) : (
                  <>
                    Execute Bulk Import <ArrowRight size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
