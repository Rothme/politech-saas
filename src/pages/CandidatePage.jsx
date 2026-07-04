import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CandidatePage.css';
import { getCandidateBySlug, getApprovedItems } from '../lib/candidates';
import { applyTheme } from '../themes';
import DimensionPicker from '../components/DimensionPicker';
import ResultCard from '../components/ResultCard';
import { generateContent } from '../lib/aiGenerate';
import { getDimensionById } from '../config/dimensions';
import { getOfficeById } from '../config/offices';

const SCREENS = { LOADING_CANDIDATE: 'loading_candidate', EXPLORE: 'explore', GENERATING: 'generating', RESULT: 'result', NOT_FOUND: 'not_found', ERROR: 'error' };

export default function CandidatePage() {
  const { slug } = useParams();
  const [screen, setScreen] = useState(SCREENS.LOADING_CANDIDATE);
  const [candidate, setCandidate] = useState(null);
  const [activeContentType, setActiveContentType] = useState(null);
  const [activeDimension, setActiveDimension] = useState(null);
  const [result, setResult] = useState(null);
  const [dimensionValue, setDimensionValue] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getCandidateBySlug(slug).then((c) => {
      if (cancelled) return;
      if (!c) {
        setScreen(SCREENS.NOT_FOUND);
        return;
      }
      applyTheme(c.themeId);
      setCandidate(c);

      const types = Object.entries(c.projectionConfig || {}).filter(([, cfg]) => cfg.enabled);
      if (types.length > 0) {
        const [type, cfg] = types[0];
        setActiveContentType(type);
        setActiveDimension(cfg.dimensions?.[0] || null);
      }
      setScreen(SCREENS.EXPLORE);
    });
    return () => { cancelled = true; };
  }, [slug]);

  async function handleDimensionSelect(dimensionLabel, value) {
    setDimensionValue(value);
    setScreen(SCREENS.GENERATING);
    try {
      if (candidate.contentSource === 'ai_generated') {
        const data = await generateContent({ candidate, dimensionLabel, dimensionValue: value });
        setResult(data);
      } else {
        const items = await getApprovedItems(candidate.id, {
          contentType: activeContentType,
          tags: { [activeDimension]: value },
        });
        setResult({
          headline: `${candidate.name} — ${value}`,
          achievements: items.map((i) => ({ title: i.title, detail: i.detail })),
          stats: [],
          progress: [],
        });
      }
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
          <div className="pt-hero">
            <div className="pt-hero-content">
              <p className="pt-hero-eyebrow">{candidate.office}</p>
              <h1 className="pt-hero-h1">{candidate.name} <em>Delivers</em></h1>
              <p className="pt-hero-sub">{candidate.slogan}</p>
            </div>
          </div>

          <div className="pt-body">
            {Object.entries(candidate.projectionConfig || {}).filter(([, c]) => c.enabled).length > 1 && (
              <div className="pt-tabs">
                {Object.entries(candidate.projectionConfig).filter(([, c]) => c.enabled).map(([type]) => (
                  <button
                    key={type}
                    className={activeContentType === type ? 'active' : ''}
                    onClick={() => {
                      setActiveContentType(type);
                      setActiveDimension(candidate.projectionConfig[type].dimensions?.[0]);
                    }}
                  >
                    {type === 'achievements' ? 'Achievements' : 'Manifesto'}
                  </button>
                ))}
              </div>
            )}

            {candidate.projectionConfig?.[activeContentType]?.dimensions?.length > 1 && (
              <div className="pt-tabs">
                {candidate.projectionConfig[activeContentType].dimensions.map((dimId) => (
                  <button
                    key={dimId}
                    className={activeDimension === dimId ? 'active' : ''}
                    onClick={() => setActiveDimension(dimId)}
                  >
                    {getDimensionById(getOfficeById(candidate.office)?.track || 'geographic', dimId)?.label || dimId}
                  </button>
                ))}
              </div>
            )}

            {activeDimension && (
              <DimensionPicker dimensionId={activeDimension} onSelect={handleDimensionSelect} />
            )}
          </div>
        </>
      )}

      {screen === SCREENS.GENERATING && (
        <div className="pt-loading-screen">
          <div className="pt-loader-ring" />
          <p className="pt-load-h">Compiling {dimensionValue}…</p>
          <p className="pt-load-p">Pulling from verified data</p>
        </div>
      )}

      {screen === SCREENS.RESULT && result && (
        <ResultCard
          candidate={candidate}
          dimensionValue={dimensionValue}
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

