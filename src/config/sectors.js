// Default sector list for the "sector" dimension. This is an editorial list
// (not derived from any external dataset, unlike states/LGAs/wards), so it's
// kept here as an editable config rather than fetched reference data.
//
// NOTE: this is a reasonable starting set mirroring common Nigerian federal/
// state achievement-reporting categories. Verify/adjust against the exact
// set used in the live Tinubu Delivers app if pixel-exact parity of the
// sector grid (icons/labels) is required.

export const SECTORS = [
  { id: 'infrastructure', label: 'Infrastructure', icon: '🛣️' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'health', label: 'Health', icon: '🏥' },
  { id: 'economy', label: 'Economy & Jobs', icon: '💼' },
  { id: 'agriculture', label: 'Agriculture', icon: '🌾' },
  { id: 'power', label: 'Power', icon: '⚡' },
  { id: 'security', label: 'Security', icon: '🛡️' },
  { id: 'social_investment', label: 'Social Investment', icon: '🤝' },
  { id: 'transport', label: 'Rail & Transport', icon: '🚆' },
  { id: 'housing', label: 'Housing', icon: '🏠' },
  { id: 'youth_sports', label: 'Youth & Sports', icon: '⚽' },
  { id: 'women_affairs', label: 'Women Affairs', icon: '👩' },
];

