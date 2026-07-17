import { useEffect, useRef, useState } from 'react';
import './PlatformHome.css';
import logo from '../assets/brand/politech-logo.png';

const OFFICES_GEO = ['President', 'Governor', 'Senator', 'House of Reps', 'State Assembly', 'LG Chairman', 'Councilor'];
const OFFICES_ORG = ['Student Union President', 'Faculty Officer', 'Association Officer', 'Club Chairman'];

const STEPS = [
  { n: '1', title: 'Sticker deployed', body: 'A field agent receives a batch of identical stickers, each with one QR code and blank space for a location code.' },
  { n: '2', title: 'Location registered', body: 'At deployment, the agent writes a unique code on the sticker and logs its ward and address in the field portal.' },
  { n: '3', title: 'Citizen scans', body: 'Anyone can scan the code to see achievements or a manifesto for their sector, ward, or LGA — no app required.' },
  { n: '4', title: 'Record verified', body: 'Every claim shown has passed through Capitaro or campaign-team approval before it goes live.' },
  { n: '5', title: 'Presence proven', body: 'The admin dashboard shows exactly where the campaign has reached — and where it hasn\u2019t.' },
];

const CHANNELS = [
  { icon: 'qr', title: 'QR codes', body: 'Stickers, posters, and merchandise link straight to a verified record — no typing a URL.' },
  { icon: 'ussd', title: 'USSD', body: 'Reaches any phone, no internet required \u2014 built for wards where data is scarce.' },
  { icon: 'chat', title: 'WhatsApp', body: 'Answers plain-language questions about a candidate\u2019s record, sourced from the same verified data.' },
  { icon: 'badge', title: 'Physical merch', body: 'Badges, keychains, and fridge magnets carry a trackable code \u2014 so a giveaway becomes measurable.' },
];

function Icon({ name }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
  if (name === 'qr') return (
    <svg {...common}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><path d="M14 14h3v3h-3zM19 14h2v2h-2zM14 19h2v2h-2zM19 19h2v2h-2z" /></svg>
  );
  if (name === 'ussd') return (
    <svg {...common}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M9 18h6" /><circle cx="9" cy="7" r=".6" fill="currentColor" /><circle cx="12" cy="7" r=".6" fill="currentColor" /><circle cx="15" cy="7" r=".6" fill="currentColor" /></svg>
  );
  if (name === 'chat') return (
    <svg {...common}><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" /></svg>
  );
  return (
    <svg {...common}><circle cx="12" cy="8" r="5" /><path d="M9 12.5 6 21l6-3 6 3-3-8.5" /></svg>
  );
}

function SignalGrid() {
  const dots = [
    { x: 18, y: 22, state: 'v', delay: 0 }, { x: 42, y: 14, state: 'v', delay: .3 },
    { x: 66, y: 26, state: 'v', delay: .6 }, { x: 84, y: 16, state: 'a', delay: 0 },
    { x: 14, y: 48, state: 'v', delay: .9 }, { x: 38, y: 42, state: 'v', delay: .2 },
    { x: 60, y: 50, state: 'v', delay: .5 }, { x: 82, y: 46, state: 'v', delay: .8 },
    { x: 24, y: 72, state: 'v', delay: .4 }, { x: 48, y: 68, state: 'v', delay: .7 },
    { x: 70, y: 76, state: 'v', delay: .1 }, { x: 90, y: 70, state: 'v', delay: .6 },
  ];
  return (
    <svg className="ph-signal-grid" viewBox="0 0 100 90" aria-hidden="true">
      {dots.map((d, i) => (
        <g key={i} className={`ph-node ph-node-${d.state}`} style={{ animationDelay: `${d.delay}s` }}>
          <circle cx={d.x} cy={d.y} r="5.5" className="ph-node-ring" />
          <circle cx={d.x} cy={d.y} r="2.2" className="ph-node-core" />
        </g>
      ))}
    </svg>
  );
}

export default function PlatformHome() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="ph-root">
      <header className={`ph-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="ph-nav-inner">
          <img src={logo} alt="PoliTech" className="ph-nav-logo" />
          <a href="#request" className="ph-nav-cta">Request access</a>
        </div>
      </header>

      <section className="ph-hero">
        <div className="ph-hero-inner">
          <div className="ph-hero-text">
            <p className="ph-eyebrow">Capitaro PoliTech</p>
            <h1 className="ph-h1">Infrastructure for<br /><span>accountable campaigns.</span></h1>
            <p className="ph-hero-sub">
              Every candidate gets a verified record of what they've done and what they promise \u2014
              reachable by QR code, USSD, WhatsApp, and merchandise. Ward by ward, LGA by LGA.
            </p>
            <div className="ph-hero-actions">
              <a href="#request" className="ph-btn-primary">Request access</a>
              <a href="/tinubu-delivers" className="ph-btn-ghost">See it live <span aria-hidden="true">&rarr;</span></a>
            </div>
            <div className="ph-hero-stats">
              <div><span className="ph-stat-num">37</span><span className="ph-stat-lbl">states covered</span></div>
              <div><span className="ph-stat-num">774</span><span className="ph-stat-lbl">LGAs mapped</span></div>
              <div><span className="ph-stat-num">8,809</span><span className="ph-stat-lbl">wards tracked</span></div>
            </div>
          </div>
          <div className="ph-hero-visual">
            <SignalGrid />
            <p className="ph-visual-caption">Live scan coverage \u2014 verified in green, unreached in red.</p>
          </div>
        </div>
      </section>

      <section className="ph-section">
        <p className="ph-section-eyebrow">How it works</p>
        <h2 className="ph-h2">From a sticker to a verified record.</h2>
        <div className="ph-steps">
          {STEPS.map((s) => (
            <div className="ph-step" key={s.n}>
              <span className="ph-step-n">{s.n}</span>
              <h3 className="ph-step-title">{s.title}</h3>
              <p className="ph-step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ph-section ph-section-dark">
        <p className="ph-section-eyebrow">Built for every mandate</p>
        <h2 className="ph-h2">Not just presidents and governors.</h2>
        <p className="ph-section-sub">One platform serves political offices and organizational ones \u2014 each with its own reporting structure.</p>
        <div className="ph-office-cols">
          <div>
            <p className="ph-office-col-label">Geographic</p>
            <div className="ph-chips">
              {OFFICES_GEO.map((o) => <span className="ph-chip" key={o}>{o}</span>)}
            </div>
          </div>
          <div>
            <p className="ph-office-col-label">Organizational</p>
            <div className="ph-chips">
              {OFFICES_ORG.map((o) => <span className="ph-chip" key={o}>{o}</span>)}
            </div>
          </div>
        </div>
      </section>

      <section className="ph-section">
        <p className="ph-section-eyebrow">Reach beyond the smartphone</p>
        <h2 className="ph-h2">Every channel, one verified source.</h2>
        <div className="ph-channels">
          {CHANNELS.map((c) => (
            <div className="ph-channel" key={c.title}>
              <div className="ph-channel-icon"><Icon name={c.icon} /></div>
              <h3 className="ph-channel-title">{c.title}</h3>
              <p className="ph-channel-body">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="ph-section ph-neutral">
        <div className="ph-neutral-inner">
          <p className="ph-section-eyebrow">Where we stand</p>
          <h2 className="ph-h2">We don't run campaigns. We run the infrastructure.</h2>
          <p className="ph-neutral-body">
            Every fact on PoliTech is provided or approved by the candidate's own team. We don't editorialize,
            take sides, or decide what counts as an achievement \u2014 we build the rails, and the campaign
            supplies the record.
          </p>
        </div>
      </section>

      <section className="ph-section ph-request" id="request">
        <h2 className="ph-h2">Bring your campaign to PoliTech.</h2>
        <p className="ph-section-sub">Tell us about your candidate or organization, and we'll set up your onboarding.</p>
        <a href="mailto:hello@politech.com.ng" className="ph-btn-primary">Request access</a>
      </section>

      <footer className="ph-footer">
        <img src={logo} alt="PoliTech" className="ph-footer-logo" />
        <p className="ph-footer-text">A Capitaro product &middot; politech.com.ng</p>
      </footer>
    </div>
  );
}

