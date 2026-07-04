import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

export default function ResultCard({ candidate, icon, dimensionValue, data, onBack }) {
  const cardRef = useRef(null);
  const [cachedPng, setCachedPng] = useState(null);
  const [busyBtn, setBusyBtn] = useState(null);

  async function capturePng() {
    if (cachedPng) return cachedPng;
    const canvas = await html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#f3f6f0',
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
      const shareText = `🇳🇬 ${dimensionValue}: ${data.headline}\n\n#${candidate.slug.replace(/-/g, '')}`;
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
    <div>
      <div className="pt-info-hero">
        <div className="pt-info-hero-inner">
          <button className="pt-back-btn" onClick={onBack}>← Back</button>
          <div className="pt-info-hero-row">
            <div className="pt-info-badge">{icon}</div>
            <div>
              <p className="pt-info-eyebrow">Presidential Achievement</p>
              <h2 className="pt-info-name">{dimensionValue}</h2>
              <p className="pt-info-tagline">{data.headline}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-info-body">
        <div ref={cardRef} id="pt-infographic-card">
          {data.stats?.length > 0 && (
            <div className="pt-stats-grid">
              {data.stats.map((s, i) => (
                <div key={i} className="pt-stat-box">
                  <div className="pt-stat-val">{s.value}</div>
                  <div className="pt-stat-lbl">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          <p className="pt-block-label">Key Achievements</p>
          <div className="pt-achiev-list">
            {data.achievements?.map((a, i) => (
              <div key={i} className="pt-achiev-item">
                <div className="pt-achiev-num">{i + 1}</div>
                <div className="pt-achiev-text"><strong>{a.title}:</strong> {a.detail}</div>
              </div>
            ))}
          </div>

          {data.progress?.length > 0 && (
            <>
              <p className="pt-block-label">Progress Tracker</p>
              <div className="pt-progress-section">
                {data.progress.map((p, i) => (
                  <div key={i} className="pt-prog-item">
                    <div className="pt-prog-row"><span>{p.label}</span><span className="pt-prog-pct">{p.percent}%</span></div>
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
          <p className="pt-share-title">Share as image</p>
          <div className="pt-share-grid">
            <button className="pt-sh-btn pt-sh-wa" disabled={busyBtn === 'whatsapp'} onClick={() => share('whatsapp')}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.556 4.127 1.528 5.864L0 24l6.305-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.854 0-3.6-.498-5.1-1.366l-.367-.215-3.741.981.999-3.651-.237-.381A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
              WhatsApp
            </button>
            <button className="pt-sh-btn pt-sh-x" disabled={busyBtn === 'twitter'} onClick={() => share('twitter')}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              X / Twitter
            </button>
            <button className="pt-sh-btn pt-sh-tg" disabled={busyBtn === 'telegram'} onClick={() => share('telegram')}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram
            </button>
          </div>
          <div className="pt-share-grid" style={{ marginTop: 8 }}>
            <button className="pt-sh-btn pt-sh-dl" disabled={busyBtn === 'download'} onClick={() => share('download')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

