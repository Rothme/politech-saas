// One-time seed script: loads src/data/geography/states-lgas-wards.json
// into Firestore at /reference/geography, and mirrors the flat states list
// at /reference/geography_states for cheap top-level dropdown reads.
//
// Usage:
//   node scripts/seedGeography.js
//
// Requires: FIREBASE_SERVICE_ACCOUNT_KEY env var (path to service account JSON)
// or default application credentials configured in the environment.

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const credentialPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

initializeApp({
  credential: credentialPath ? cert(JSON.parse(readFileSync(credentialPath, 'utf8'))) : applicationDefault(),
});

const db = getFirestore();

async function seed() {
  const dataPath = path.join(__dirname, '../src/data/geography/states-lgas-wards.json');
  const geography = JSON.parse(readFileSync(dataPath, 'utf8'));
  const states = Object.keys(geography).sort();

  console.log(`Seeding ${states.length} states, ${
    states.reduce((acc, s) => acc + Object.keys(geography[s]).length, 0)
  } LGAs...`);

  // Firestore documents have a 1MB size limit. The full nested dataset (with
  // ~8,800 wards) may approach that. We split by state to stay safe and to
  // make cascading reads cheap (fetch one state's LGA/ward doc, not everything).
  const batch = db.batch();
  const statesRef = db.collection('reference').doc('geography');
  batch.set(statesRef, { states, updatedAt: new Date().toISOString() });

  for (const state of states) {
    const stateDocRef = db
      .collection('reference')
      .doc('geography')
      .collection('states')
      .doc(state);
    batch.set(stateDocRef, { lgas: geography[state] });
  }

  await batch.commit();
  console.log('Geography reference data seeded successfully.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

