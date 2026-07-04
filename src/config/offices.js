// PoliTech Office Registry
// Each office belongs to a "track" (geographic or organizational) which determines
// which dimension vocabulary is available to it, and carries a suggested default
// set of dimensions that onboarding pre-fills (campaign can still override).

export const TRACKS = {
  GEOGRAPHIC: 'geographic',
  ORGANIZATIONAL: 'organizational',
};

export const OFFICES = [
  {
    id: 'president',
    label: 'President',
    track: TRACKS.GEOGRAPHIC,
    defaultDimensions: ['sector', 'state'],
  },
  {
    id: 'governor',
    label: 'Governor',
    track: TRACKS.GEOGRAPHIC,
    defaultDimensions: ['sector', 'lga', 'senatorialDistrict'],
  },
  {
    id: 'senator',
    label: 'Senator',
    track: TRACKS.GEOGRAPHIC,
    defaultDimensions: ['sector', 'lga'],
  },
  {
    id: 'house_of_reps',
    label: 'Member, House of Representatives',
    track: TRACKS.GEOGRAPHIC,
    defaultDimensions: ['sector', 'lga', 'ward'],
  },
  {
    id: 'state_assembly',
    label: 'Member, State House of Assembly',
    track: TRACKS.GEOGRAPHIC,
    defaultDimensions: ['sector', 'ward'],
  },
  {
    id: 'lg_chairman',
    label: 'Local Government Chairman',
    track: TRACKS.GEOGRAPHIC,
    defaultDimensions: ['sector', 'ward'],
  },
  {
    id: 'councilor',
    label: 'Councilor',
    track: TRACKS.GEOGRAPHIC,
    defaultDimensions: ['ward'],
  },
  {
    id: 'student_union_president',
    label: 'Student Union President',
    track: TRACKS.ORGANIZATIONAL,
    defaultDimensions: ['faculty', 'committee'],
  },
  {
    id: 'school_body_officer',
    label: 'School Body Officer',
    track: TRACKS.ORGANIZATIONAL,
    defaultDimensions: ['department', 'committee'],
  },
  {
    id: 'association_officer',
    label: 'Association Officer',
    track: TRACKS.ORGANIZATIONAL,
    defaultDimensions: ['chapter', 'portfolioArea'],
  },
  {
    id: 'other',
    label: 'Other',
    track: TRACKS.GEOGRAPHIC,
    defaultDimensions: [],
  },
];

export function getOfficeById(id) {
  return OFFICES.find((o) => o.id === id) || null;
}

export function getOfficesByTrack(track) {
  return OFFICES.filter((o) => o.track === track);
}

