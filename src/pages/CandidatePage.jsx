import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CandidatePage.css';
import { getCandidateBySlug, getApprovedItems } from '../lib/candidates';
import { applyTheme } from '../themes';
import { SECTORS } from '../config/sectors';
import { getStates } from '../lib/geography';
import ResultCard from '../components/ResultCard';
import { generateContent } from '../lib/aiGenerate';
import tinubuHero from '../assets/tinubu/hero.jpg';
import tinubuPortrait from '../assets/tinubu/portrait.webp';

// Static local fallback images, bundled directly into the app (same approach
// as the original standalone build, which embedded these inline) — used when
// a candidate document doesn't specify a hosted heroImageUrl/photoUrl.
const LOCAL_IMAGES = {
  'tinubu-delivers': { hero: tinubuHero, portrait: tinubuPortrait },
};

const SCREENS = {
  LOADING_CANDIDATE: 'loading_candidate',
  EXPLORE: 'explore',
  GENERATING: 'generating',
  RESULT: 'result',
  NOT_FOUND: 'not_found',
  ERROR: 'error',
};

export default function CandidatePage() {
  const { slug } = useParams();
  const [screen, setScreen] = useState(SCREENS.LOADING_CANDIDATE);
  const [candidate, setCandidate] = useState(null);
  const [tab, setTab] = useState('sector'); // 'sector' | 'state' — mirrors original two-tab pattern
  const [selectedSector, setSelectedSector] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [result, setResult] = useState(null);
  const [activeLabel, setActiveLabel] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCandidateBySlug(slug).then((c) => {
      if (cancelled) return;
      if (!c) { setScreen(SCREENS.NOT_FOUND); return; }
      applyTheme(c.themeId);
      setCandidate(c);
      setScreen(SCREENS.EXPLORE);
    });
    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    if (tab === 'state' && states.length === 0) {
      getStates().then(setStates);
    }
  }, [tab, states.length]);

  async function runGenerate(dimensionLabel, value, icon) {
    setActiveLabel({ value, icon });
    setScreen(SCREENS.GENERATING);
    try {
      let data;
      if (candidate.contentSource === 'ai_generated') {
        data = await generateContent({ candidate, dimensionLabel, dimensionValue: value });
      } else {
        const items = await getApprovedItems(candidate.id, {
          contentType: 'achievements',
          tags: { [dimensionLabel.toLowerCase()]: value },
        });
        data = {
          headline: `${candidate.name} — ${value}`,
          stats: [],
          achievements: items.map((i) => ({ title: i.title, detail: i.detail })),
          progress: [],
        };
      }
      setResult(data);
      setScreen(SCREENS.RESULT);
    } catch (e) {
      console.error(e);
      setError(e.message);
      setScreen(SCREENS.ERROR);
    }
  }

  if (screen === SCREENS.LOADING_CANDIDATE) {
    return <div className="pt-app"><p className="pt-loading-text">Loading…</p></div>;
  }
  if (screen === SCREENS.NOT_FOUND) {
    return <div className="pt-app"><p className="pt-loading-text">This page does not exist.</p></div>;
  }

  return (
    <div className="pt-app">
      {screen === SCREENS.EXPLORE && (
        <>
          <div className="pt-explore-hero">
            {(candidate.heroImageUrl || LOCAL_IMAGES[candidate.slug]?.hero) && (
              <img
                className="pt-hero-bg"
                src={candidate.heroImageUrl || LOCAL_IMAGES[candidate.slug]?.hero}
                alt={candidate.name}
              />
            )}
            <div className="pt-hero-overlay" />
            <div className="pt-hero-curve" />
            <div className="pt-hero-content">
              {(candidate.photoUrl || LOCAL_IMAGES[candidate.slug]?.portrait) && (
                <div className="pt-pbat-circle">
                  <img src={candidate.photoUrl || LOCAL_IMAGES[candidate.slug]?.portrait} alt={candidate.name} />
                </div>
              )}
              <p className="pt-hero-eyebrow">Federal Republic of Nigeria · 2023–2027</p>
              <h1 className="pt-hero-h1">{candidate.name.split(' ').slice(-1)} <em>Delivers</em></h1>
              <p className="pt-hero-sub">Select a sector or state to explore what this administration has achieved.</p>
            </div>
          </div>

          <div className="pt-explore-body">
            <div className="pt-tab-row">
              <button className={`pt-tab-btn ${tab === 'sector' ? 'active' : ''}`} onClick={() => setTab('sector')}>By Sector</button>
              <button className={`pt-tab-btn ${tab === 'state' ? 'active' : ''}`} onClick={() => setTab('state')}>By State</button>
            </div>

            {tab === 'sector' && (
              <div>
                <p className="pt-section-label">Choose a sector</p>
                <div className="pt-sector-grid">
                  {SECTORS.map((s) => (
                    <div
                      key={s.id}
                      className={`pt-sector-card ${selectedSector === s.id ? 'sel' : ''}`}
                      onClick={() => setSelectedSector(s.id)}
                    >
                      <div className="pt-sc-check">✓</div>
                      <span className="pt-sc-icon">{s.icon}</span>
                      <span className="pt-sc-name">{s.label}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="pt-gen-btn"
                  disabled={!selectedSector}
                  onClick={() => {
                    const s = SECTORS.find((x) => x.id === selectedSector);
                    runGenerate('Sector', s.label, s.icon);
                  }}
                >
                  {selectedSector
                    ? `Generate: ${SECTORS.find((x) => x.id === selectedSector).label} Achievements`
                    : 'Select a sector to continue'}
                </button>
              </div>
            )}

            {tab === 'state' && (
              <div className="pt-geo-picker">
                <select value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                  <option value="">— Choose a state —</option>
                  {states.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  className="pt-gen-btn"
                  disabled={!selectedState}
                  onClick={() => runGenerate('State', selectedState, '🗺️')}
                >
                  {selectedState ? `Generate: ${selectedState} Delivery Report` : 'Select a state to continue'}
                </button>
              </div>
            )}
          </div>

          <div className="pt-footer">
            <div className="pt-footer-flag">
              <div className="pt-f-stripe" /><div className="pt-f-stripe w" /><div className="pt-f-stripe" />
            </div>
            <p className="pt-footer-text">politech.com.ng/{candidate.slug} &nbsp;·&nbsp; Scan the QR to share</p>
          </div>
        </>
      )}

      {screen === SCREENS.GENERATING && (
        <div className="pt-loading-screen">
          <div className="pt-loader-ring" />
          <h2 className="pt-load-h">Compiling {activeLabel?.value} achievements…</h2>
          <p className="pt-load-p">Pulling from verified government data</p>
        </div>
      )}

      {screen === SCREENS.RESULT && result && (
        <ResultCard
          candidate={candidate}
          icon={activeLabel?.icon}
          dimensionValue={activeLabel?.value}
          data={result}
          onBack={() => setScreen(SCREENS.EXPLORE)}
        />
      )}

      {screen === SCREENS.ERROR && (
        <div className="pt-loading-screen">
          <p className="pt-load-h">Something went wrong</p>
          <p className="pt-load-p">{error}</p>
          <button className="pt-gen-btn" onClick={() => setScreen(SCREENS.EXPLORE)}>Try again</button>
        </div>
      )}
    </div>
  );
}

