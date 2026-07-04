import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function ResultCard({ candidate, dimensionValue, data, onBack }) {
  const cardRef = useRef(null);
  const [cachedPng, setCachedPng] = useState(null);
  const [busyBtn, setBusyBtn] = useState(null);

  async function capturePng() {
    if (cachedPng) return cachedPng;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--pt-light') || '#f3f6f0',
      logging: false,
    });
    const png = canvas.toDataURL('image/png');
    setCachedPng(png);
    return png;
  }

  async function share(platform) {
    setBusyBtn(platform);
    try {
      const dataUrl = await capturePng();
      if (platform === 'download') {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `${candidate.slug}-${dimensionValue}.png`;
        a.click();
        return;
      }
      const shareText = `${candidate.name}: ${data.headline}\n\n#${candidate.slug.replace(/-/g, '')}`;
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `${candidate.slug}.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: candidate.name, text: shareText, files: [file] });
        return;
      }

      const text = encodeURIComponent(shareText);
      const urls = {
        whatsapp: `https://wa.me/?text=${text}`,
        twitter: `https://twitter.com/intent/tweet?text=${text}`,
        telegram: `https://t.me/share/url?url=https://politech.com.ng/${candidate.slug}&text=${text}`,
      };
      if (urls[platform]) window.open(urls[platform], '_blank');
    } catch (e) {
      if (e.name !== 'AbortError') alert('Could not share. Try Download instead.');
    } finally {
      setBusyBtn(null);
    }
  }

  return (
    <div className="pt-info-screen">
      <button className="pt-back-btn" onClick={onBack}>&larr; Back</button>

      <div ref={cardRef} className="pt-infographic-card">
        <p className="pt-info-eyebrow">{candidate.name}</p>
        <h2 className="pt-info-headline">{data.headline}</h2>

        <div className="pt-stats-grid">
          {data.stats?.map((s, i) => (
            <div key={i} className="pt-stat">
              <div className="pt-stat-value">{s.value}</div>
              <div className="pt-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <p className="pt-block-label">Key Achievements</p>
        <div className="pt-achiev-list">
          {data.achievements?.map((a, i) => (
            <div key={i} className="pt-achiev-item">
              <div className="pt-achiev-num">{i + 1}</div>
              <div><strong>{a.title}:</strong> {a.detail}</div>
            </div>
          ))}
        </div>

        {data.progress?.length > 0 && (
          <>
            <p className="pt-block-label">Progress Tracker</p>
            <div className="pt-progress-section">
              {data.progress.map((p, i) => (
                <div key={i} className="pt-prog-item">
                  <div className="pt-prog-row"><span>{p.label}</span><span>{p.percent}%</span></div>
                  <div className="pt-prog-track"><div className="pt-prog-fill" style={{ width: `${p.percent}%` }} /></div>
                </div>
              ))}
            </div>
          </>
        )}

        {data.quote && (
          <div className="pt-quote-block">
            <p className="pt-quote-txt">"{data.quote}"</p>
            <p className="pt-quote-src">— {data.source}</p>
          </div>
        )}
      </div>

      <div className="pt-share-section">
        <button disabled={busyBtn === 'whatsapp'} onClick={() => share('whatsapp')}>WhatsApp</button>
        <button disabled={busyBtn === 'twitter'} onClick={() => share('twitter')}>X</button>
        <button disabled={busyBtn === 'telegram'} onClick={() => share('telegram')}>Telegram</button>
        <button disabled={busyBtn === 'download'} onClick={() => share('download')}>Download</button>
      </div>
    </div>
  );
}

