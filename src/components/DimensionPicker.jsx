import { useEffect, useState } from 'react';
import { SECTORS } from '../config/sectors';
import { getStates, getLgasForState, getWardsForLga } from '../lib/geography';

// Renders the appropriate picker UI for a given dimension id, and calls
// onSelect(dimensionLabel, value) once the user has made a complete selection.
export default function DimensionPicker({ dimensionId, onSelect }) {
  if (dimensionId === 'sector') {
    return <SectorGrid onSelect={(v) => onSelect('Sector', v)} />;
  }
  if (dimensionId === 'state') {
    return <GeoDropdown level="state" onSelect={onSelect} />;
  }
  if (dimensionId === 'lga') {
    return <GeoDropdown level="lga" onSelect={onSelect} />;
  }
  if (dimensionId === 'ward') {
    return <GeoDropdown level="ward" onSelect={onSelect} />;
  }
  // Organizational-track and loosely-curated dimensions (senatorialDistrict,
  // federalConstituency, faculty, etc.) fall back to a free-text input until
  // their own curated option lists are built.
  return <FreeTextPicker onSelect={(v) => onSelect(dimensionId, v)} />;
}

function SectorGrid({ onSelect }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      <p className="pt-section-label">Choose a sector</p>
      <div className="pt-sector-grid">
        {SECTORS.map((s) => (
          <div
            key={s.id}
            className={`pt-sector-card ${selected === s.id ? 'sel' : ''}`}
            onClick={() => setSelected(s.id)}
          >
            <span className="pt-sc-icon">{s.icon}</span>
            <span className="pt-sc-name">{s.label}</span>
          </div>
        ))}
      </div>
      <button
        className="pt-gen-btn"
        disabled={!selected}
        onClick={() => onSelect(SECTORS.find((s) => s.id === selected).label)}
      >
        Generate Report
      </button>
    </div>
  );
}

function GeoDropdown({ level, onSelect }) {
  const [state, setState] = useState('');
  const [lga, setLga] = useState('');
  const [ward, setWard] = useState('');
  const [states, setStates] = useState([]);
  const [lgas, setLgas] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    getStates().then(setStates);
  }, []);

  useEffect(() => {
    if (state && (level === 'lga' || level === 'ward')) {
      getLgasForState(state).then(setLgas);
    }
  }, [state, level]);

  useEffect(() => {
    if (state && lga && level === 'ward') {
      getWardsForLga(state, lga).then(setWards);
    }
  }, [state, lga, level]);

  const ready =
    level === 'state' ? !!state : level === 'lga' ? !!state && !!lga : !!state && !!lga && !!ward;

  const handleGenerate = () => {
    if (level === 'state') onSelect('State', state);
    if (level === 'lga') onSelect('Local Government Area', lga);
    if (level === 'ward') onSelect('Ward', ward);
  };

  return (
    <div className="pt-geo-picker">
      <select value={state} onChange={(e) => { setState(e.target.value); setLga(''); setWard(''); }}>
        <option value="">Select State</option>
        {states.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {(level === 'lga' || level === 'ward') && state && (
        <select value={lga} onChange={(e) => { setLga(e.target.value); setWard(''); }}>
          <option value="">Select LGA</option>
          {lgas.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      )}

      {level === 'ward' && lga && (
        <select value={ward} onChange={(e) => setWard(e.target.value)}>
          <option value="">Select Ward</option>
          {wards.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      )}

      <button className="pt-gen-btn" disabled={!ready} onClick={handleGenerate}>
        Generate Report
      </button>
    </div>
  );
}

function FreeTextPicker({ onSelect }) {
  const [value, setValue] = useState('');
  return (
    <div className="pt-geo-picker">
      <input
        type="text"
        placeholder="Enter value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button className="pt-gen-btn" disabled={!value} onClick={() => onSelect(value)}>
        Generate Report
      </button>
    </div>
  );
}

