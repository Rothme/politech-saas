import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';
import { QrCode, Smartphone, MessageCircle, Award, Phone, ShieldCheck, MapPin, Map } from 'lucide-react';
import './PlatformHome.css';
import logo from '../assets/brand/politech-logo.png';

const NAV_LINKS = [
  { href: '#how', label: 'How it works' },
  { href: '#reach', label: 'Reach' },
  { href: '#trust', label: 'Live now' },
];

const OFFICES_GEO = ['President', 'Governor', 'Senator', 'House of Reps', 'State Assembly', 'LG Chairman', 'Councilor'];
const OFFICES_ORG = ['Student Union President', 'Faculty Officer', 'Association Officer', 'Club Chairman'];

const STEPS = [
  { n: '1', title: 'Sticker deployed', body: 'A field agent receives a batch of identical stickers, each with one QR code and blank space for a location code.' },
  { n: '2', title: 'Location registered', body: 'At deployment, the agent writes a unique code on the sticker and logs its ward and address in the field portal.' },
  { n: '3', title: 'Citizen scans', body: 'Anyone can scan the code to see achievements or a manifesto for their sector, ward, or LGA. No app required.' },
  { n: '4', title: 'Record verified', body: 'Every claim shown has passed through Capitaro or campaign-team approval before it goes live.' },
  { n: '5', title: 'Presence proven', body: 'The admin dashboard shows exactly where the campaign has reached, and where it has not.' },
];

const FEATURES = [
  { Icon: QrCode, title: 'QR Access', body: 'Scan a code on a sticker, poster, or merch item straight to a verified record. No typing a URL.' },
  { Icon: Smartphone, title: 'USSD Reach', body: 'Works on any phone, no internet required, built for wards where data is scarce.' },
  { Icon: MessageCircle, title: 'WhatsApp Verify', body: "Plain-language Q&A about a candidate's record, sourced from the same verified data." },
  { Icon: Map, title: 'Ward Mapping', body: 'Coverage is tracked down to the ward level, not just the state or LGA.' },
  { Icon: ShieldCheck, title: 'Neutral Approval', body: 'Every claim is reviewed by Capitaro or the campaign team before it goes live.' },
  { Icon: Award, title: 'Trackable Merch', body: 'Badges, keychains, and fridge magnets carry a code, so a giveaway becomes measurable.' },
];

const HERO_HEADLINE = ['Infrastructure for', 'accountable campaigns.'];

const HERO_PILLS = [
  { Icon: Phone, label: 'No smartphone required' },
  { Icon: ShieldCheck, label: 'Verified by campaign teams' },
  { Icon: MapPin, label: 'Mapped to every ward' },
];

const LIVE_TENANTS = [
  { name: 'Tinubu Delivers', desc: 'Presidential achievement scorecard, by sector and state', slug: 'tinubu-delivers', mono: 'TD' },
  { name: 'The ARK Scorecard', desc: 'Lagos State House of Assembly, Ikeja Constituency II', slug: null, mono: 'ARK' },
  { name: 'The Wadada Way', desc: 'Nasarawa State governorship, ward-level hostility map', slug: null, mono: 'WW' },
];

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

function CountUp({ value }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(shouldReduceMotion ? value.toLocaleString('en-US') : '0');

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v).toLocaleString('en-US')),
    });
    return () => controls.stop();
  }, [isInView, shouldReduceMotion, value]);

  return <span ref={ref}>{display}</span>;
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};
const nodePop = {
  hidden: { scale: 0.4, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};
const lineDraw = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 } },
};

function Reveal({ children, className, delay = 0, x, y = 24 }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function RevealGroup({ children, className }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

const cardHover = { y: -6, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } };

function DashboardMock() {
  return (
    <div className="ph-dash-mock" aria-hidden="true">
      <div className="ph-dash-topbar">
        <div className="ph-dash-dot" /><div className="ph-dash-dot" /><div className="ph-dash-dot" />
        <span className="ph-dash-url">politech.com.ng/admin</span>
      </div>
      <div className="ph-dash-body">
        <div className="ph-dash-stats">
          <div className="ph-dash-stat"><span className="ph-dash-num">312</span><span className="ph-dash-lbl">Locations registered</span></div>
          <div className="ph-dash-stat"><span className="ph-dash-num ok">278</span><span className="ph-dash-lbl">Verified this week</span></div>
          <div className="ph-dash-stat"><span className="ph-dash-num warn">34</span><span className="ph-dash-lbl">Zero-scan zones</span></div>
        </div>
        <div className="ph-dash-map">
          {[...Array(24)].map((_, i) => (
            <span key={i} className={`ph-dash-pin ${i % 7 === 0 ? 'warn' : 'ok'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FooterSignup() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent('Notify me about new PoliTech campaigns');
    const body = encodeURIComponent(`Please add ${email} to the update list.`);
    window.location.href = `mailto:hello@politech.com.ng?subject=${subject}&body=${body}`;
  };

  return (
    <form className="ph-footer-signup" onSubmit={handleSubmit}>
      <p className="ph-footer-heading">Stay in the loop</p>
      <p className="ph-footer-signup-copy">Get updates when we onboard a new campaign.</p>
      <div className="ph-footer-signup-row">
        <input
          type="email"
          required
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="ph-footer-input"
          aria-label="Email address"
        />
        <button type="submit" className="ph-footer-signup-btn">Notify me</button>
      </div>
    </form>
  );
}

export default function PlatformHome() {
  const [scrolled, setScrolled] = useState(false);
  const shouldReduceMotion = useReducedMotion();
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
          <nav className="ph-nav-links">
            {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
          </nav>
          <a href="#request" className="ph-nav-cta">Request access</a>
        </div>
      </header>

      <section className="ph-hero">
        <div className="ph-hero-inner">
          <motion.div
            className="ph-hero-text"
            variants={staggerContainer}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="show"
          >
            <motion.p className="ph-eyebrow" variants={fadeUpItem}>Capitaro PoliTech</motion.p>
            <h1 className="ph-h1">
              {HERO_HEADLINE.map((line, i) => (
                <span className="ph-h1-line-mask" key={line}>
                  <motion.span
                    className="ph-h1-line"
                    initial={shouldReduceMotion ? false : { y: '110%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.13 }}
                  >
                    {i === 1 ? <span className="ph-h1-accent">{line}</span> : line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p className="ph-hero-sub" variants={fadeUpItem}>
              Every candidate gets a verified record of what they have done and what they promise,
              reachable by QR code, USSD, WhatsApp, and merchandise. Ward by ward, LGA by LGA.
            </motion.p>
            <motion.div className="ph-hero-actions" variants={fadeUpItem}>
              <a href="#request" className="ph-btn-primary">Request access</a>
              <a href="/tinubu-delivers" className="ph-btn-ghost">See it live <span aria-hidden="true">&rarr;</span></a>
            </motion.div>
            <motion.div className="ph-hero-pills" variants={fadeUpItem}>
              {HERO_PILLS.map((p) => (
                <span className="ph-hero-pill" key={p.label}>
                  <p.Icon size={15} strokeWidth={1.8} />
                  {p.label}
                </span>
              ))}
            </motion.div>
            <motion.div className="ph-hero-stats" variants={fadeUpItem}>
              <div><span className="ph-stat-num"><CountUp value={37} /></span><span className="ph-stat-lbl">states covered</span></div>
              <div><span className="ph-stat-num"><CountUp value={774} /></span><span className="ph-stat-lbl">LGAs mapped</span></div>
              <div><span className="ph-stat-num"><CountUp value={8809} /></span><span className="ph-stat-lbl">wards tracked</span></div>
            </motion.div>
          </motion.div>
          <motion.div
            className="ph-hero-visual"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          >
            <div className="ph-hero-visual-panel">
              <SignalGrid />
            </div>
            <p className="ph-visual-caption">Live scan coverage. Verified in green, unreached in red.</p>
          </motion.div>
        </div>
      </section>

      <section className="ph-trust" id="trust">
        <Reveal y={12}><p className="ph-trust-label">Live on PoliTech infrastructure</p></Reveal>
        <RevealGroup className="ph-trust-row">
          {LIVE_TENANTS.map((t) => (
            t.slug ? (
              <motion.a key={t.name} href={`/${t.slug}`} className="ph-trust-item" variants={fadeUpItem} whileHover={cardHover}>
                <span className="ph-trust-mono">{t.mono}</span>
                <span className="ph-trust-text">
                  <span className="ph-trust-name">{t.name}</span>
                  <span className="ph-trust-desc">{t.desc}</span>
                </span>
              </motion.a>
            ) : (
              <motion.div key={t.name} className="ph-trust-item" variants={fadeUpItem} whileHover={cardHover}>
                <span className="ph-trust-mono">{t.mono}</span>
                <span className="ph-trust-text">
                  <span className="ph-trust-name">{t.name}</span>
                  <span className="ph-trust-desc">{t.desc}</span>
                </span>
              </motion.div>
            )
          ))}
        </RevealGroup>
      </section>

      <section className="ph-section" id="reach">
        <Reveal>
          <p className="ph-section-eyebrow">What PoliTech does</p>
          <h2 className="ph-h2">Reach, verify, and prove — in one platform.</h2>
        </Reveal>
        <RevealGroup className="ph-features">
          {FEATURES.map((f) => (
            <motion.div className="ph-feature" key={f.title} variants={fadeUpItem} whileHover={cardHover}>
              <div className="ph-feature-icon"><f.Icon size={22} strokeWidth={1.6} /></div>
              <h3 className="ph-feature-title">{f.title}</h3>
              <p className="ph-feature-body">{f.body}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      <section className="ph-section ph-section-white">
        <Reveal>
          <p className="ph-section-eyebrow">Built for every mandate</p>
          <h2 className="ph-h2">Not just presidents and governors.</h2>
          <p className="ph-section-sub">One platform serves political offices and organizational ones, each with its own reporting structure.</p>
        </Reveal>
        <div className="ph-office-cols">
          <div>
            <p className="ph-office-col-label">Geographic</p>
            <RevealGroup className="ph-chips">
              {OFFICES_GEO.map((o) => (
                <motion.span className="ph-chip" key={o} variants={fadeUpItem} whileHover={{ y: -3, scale: 1.05 }}>{o}</motion.span>
              ))}
            </RevealGroup>
          </div>
          <div>
            <p className="ph-office-col-label">Organizational</p>
            <RevealGroup className="ph-chips">
              {OFFICES_ORG.map((o) => (
                <motion.span className="ph-chip" key={o} variants={fadeUpItem} whileHover={{ y: -3, scale: 1.05 }}>{o}</motion.span>
              ))}
            </RevealGroup>
          </div>
        </div>
      </section>

      <section className="ph-section" id="how">
        <Reveal>
          <p className="ph-section-eyebrow">How it works</p>
          <h2 className="ph-h2">From a sticker to a verified record.</h2>
        </Reveal>
        <RevealGroup className="ph-steps">
          {STEPS.map((s, i) => (
            <motion.div className="ph-step" key={s.n} variants={fadeUpItem}>
              <div className="ph-step-node-row">
                <motion.span className="ph-step-node" variants={nodePop}>{s.n}</motion.span>
                {i < STEPS.length - 1 && <motion.span className="ph-step-line" variants={lineDraw} style={{ transformOrigin: 'left' }} />}
              </div>
              <h3 className="ph-step-title">{s.title}</h3>
              <p className="ph-step-body">{s.body}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </section>

      <section className="ph-section ph-section-white">
        <div className="ph-split">
          <Reveal className="ph-split-text" x={-20} y={0}>
            <p className="ph-section-eyebrow">See it in action</p>
            <h2 className="ph-h2">Know exactly where a campaign has reached.</h2>
            <p className="ph-section-sub">
              The admin dashboard tracks every registered location in real time, flagging wards with
              zero scans after seven days so field teams know exactly where to focus next.
            </p>
          </Reveal>
          <Reveal x={20} y={0} delay={0.1}>
            <DashboardMock />
          </Reveal>
        </div>
      </section>

      <section className="ph-neutral">
        <Reveal className="ph-neutral-inner">
          <span className="ph-neutral-mark" aria-hidden="true">&ldquo;</span>
          <p className="ph-section-eyebrow">Where we stand</p>
          <h2 className="ph-h2">We do not run campaigns. We run the infrastructure.</h2>
          <p className="ph-neutral-body">
            Every fact on PoliTech is provided or approved by the candidate's own team. We do not editorialize,
            take sides, or decide what counts as an achievement. We build the rails, and the campaign
            supplies the record.
          </p>
        </Reveal>
      </section>

      <section className="ph-section ph-request" id="request">
        <Reveal>
          <h2 className="ph-h2">Bring your campaign to PoliTech.</h2>
          <p className="ph-section-sub">Tell us about your candidate or organization, and we will set up your onboarding.</p>
          <a href="mailto:hello@politech.com.ng" className="ph-btn-primary">Request access</a>
        </Reveal>
      </section>

      <footer className="ph-footer">
        <Reveal className="ph-footer-inner" y={12}>
          <div className="ph-footer-brand">
            <img src={logo} alt="PoliTech" className="ph-footer-logo" />
            <p className="ph-footer-tag">Infrastructure for accountable campaigns.</p>
          </div>
          <div className="ph-footer-col">
            <p className="ph-footer-heading">Product</p>
            <a href="#how">How it works</a>
            <a href="#reach">Reach</a>
            <a href="#trust">Live now</a>
          </div>
          <div className="ph-footer-col">
            <p className="ph-footer-heading">Company</p>
            <a href="mailto:hello@politech.com.ng">Contact</a>
            <a href="#request">Request access</a>
          </div>
          <FooterSignup />
        </Reveal>
        <div className="ph-footer-bottom">
          <p className="ph-footer-text">A Capitaro product &middot; politech.com.ng</p>
        </div>
      </footer>
    </div>
  );
}

