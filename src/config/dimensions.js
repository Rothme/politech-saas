// PoliTech Dimension Vocabulary
// A "dimension" is a way of slicing a candidate's content (Achievements and/or Manifesto).
// Two tracks, two vocabularies. Geographic dimensions carry hierarchy metadata so the
// UI knows which dimensions nest under which (State -> LGA -> Ward), and which are
// "loose" (Senatorial District / Federal Constituency select per-state but don't
// nest cleanly under LGA).

export const GEOGRAPHIC_DIMENSIONS = [
  {
    id: 'sector',
    label: 'Sector',
    hierarchyLevel: null, // not part of the geo hierarchy, always independently selectable
  },
  {
    id: 'state',
    label: 'State',
    hierarchyLevel: 1,
    parent: null,
  },
  {
    id: 'senatorialDistrict',
    label: 'Senatorial District',
    hierarchyLevel: 2,
    parent: 'state',
    strictNesting: false, // curated list per state, not derived from LGA data
  },
  {
    id: 'federalConstituency',
    label: 'Federal Constituency',
    hierarchyLevel: 2,
    parent: 'state',
    strictNesting: false, // curated list per state, not derived from LGA data
  },
  {
    id: 'lga',
    label: 'Local Government Area (LGA)',
    hierarchyLevel: 2,
    parent: 'state',
    strictNesting: true, // enforced via reference/geography dataset
  },
  {
    id: 'ward',
    label: 'Ward',
    hierarchyLevel: 3,
    parent: 'lga',
    strictNesting: true, // enforced via reference/geography dataset
  },
];

export const ORGANIZATIONAL_DIMENSIONS = [
  { id: 'faculty', label: 'Faculty' },
  { id: 'department', label: 'Department' },
  { id: 'hall', label: 'Hall of Residence' },
  { id: 'committee', label: 'Committee' },
  { id: 'chapter', label: 'Chapter / Branch' },
  { id: 'portfolioArea', label: 'Portfolio Area' },
];

export function getDimensionVocabulary(track) {
  return track === 'organizational' ? ORGANIZATIONAL_DIMENSIONS : GEOGRAPHIC_DIMENSIONS;
}

export function getDimensionById(track, id) {
  return getDimensionVocabulary(track).find((d) => d.id === id) || null;
}

