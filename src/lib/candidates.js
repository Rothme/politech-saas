import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

// Fetch a candidate by their URL slug (e.g. "tinubu-delivers").
export async function getCandidateBySlug(slug) {
  const snap = await getDoc(doc(db, 'candidates', slug));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// Fetch approved items for a candidate, optionally filtered by contentType
// ("achievement" | "manifesto") and a set of tag matches (e.g. { sector: "Health" }).
// Only used for contentSource !== "ai_generated" candidates.
export async function getApprovedItems(candidateId, { contentType, tags } = {}) {
  const itemsRef = collection(db, 'candidates', candidateId, 'items');
  const clauses = [where('approvalStatus', '==', 'approved')];
  if (contentType) clauses.push(where('contentType', '==', contentType));

  const q = query(itemsRef, ...clauses);
  const snap = await getDocs(q);
  let items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Tag filtering happens client-side since Firestore doesn't support
  // arbitrary nested-field multi-match queries without composite indexes
  // per combination — fine at this scale, revisit if item counts grow large.
  if (tags) {
    items = items.filter((item) =>
      Object.entries(tags).every(([key, value]) => !value || item.tags?.[key] === value)
    );
  }

  return items;
}

