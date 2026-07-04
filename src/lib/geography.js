import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Cascading geography lookups against /reference/geography in Firestore.
// Used by both the candidate onboarding form (tagging items) and any future
// candidate-facing selector that needs State -> LGA -> Ward navigation.

let statesCache = null;
const lgaCache = new Map(); // state -> { lgaName: [wardNames] }

export async function getStates() {
  if (statesCache) return statesCache;
  const snap = await getDoc(doc(db, 'reference', 'geography'));
  statesCache = snap.exists() ? snap.data().states : [];
  return statesCache;
}

export async function getLgasForState(state) {
  if (lgaCache.has(state)) return Object.keys(lgaCache.get(state));
  const snap = await getDoc(doc(db, 'reference', 'geography', 'states', state));
  const lgas = snap.exists() ? snap.data().lgas : {};
  lgaCache.set(state, lgas);
  return Object.keys(lgas);
}

export async function getWardsForLga(state, lga) {
  if (!lgaCache.has(state)) {
    await getLgasForState(state);
  }
  const lgas = lgaCache.get(state) || {};
  return lgas[lga] || [];
}

// Validation helper — used before saving an item's geo tags, to catch
// mismatched State/LGA/Ward combinations before they go live.
export async function isValidGeoTag({ state, lga, ward }) {
  if (state) {
    const states = await getStates();
    if (!states.includes(state)) return false;
  }
  if (lga) {
    const lgas = await getLgasForState(state);
    if (!lgas.includes(lga)) return false;
  }
  if (ward) {
    const wards = await getWardsForLga(state, lga);
    if (!wards.includes(ward)) return false;
  }
  return true;
}

