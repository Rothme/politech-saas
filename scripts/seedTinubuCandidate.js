// One-time seed: creates the /candidates/tinubu-delivers document, matching
// the original standalone app's behavior (ai_generated content, Sector +
// State dimensions, positivity guardrail — since there is no campaign-
// provided source material for this one, per earlier discussion).
//
// Usage: FIREBASE_SERVICE_ACCOUNT_KEY=./serviceAccountKey.json node scripts/seedTinubuCandidate.js

import { initializeApp, cert, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'fs';

const credentialPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

initializeApp({
  credential: credentialPath ? cert(JSON.parse(readFileSync(credentialPath, 'utf8'))) : applicationDefault(),
});

const db = getFirestore();

async function seed() {
  const now = new Date().toISOString();

  await db.collection('candidates').doc('tinubu-delivers').set({
    slug: 'tinubu-delivers',
    name: 'Bola Ahmed Tinubu',
    office: 'president',
    status: 'incumbent',
    slogan: 'Renewed Hope',
    themeId: 'tinubu-classic',
    contentSource: 'ai_generated',

    projectionConfig: {
      achievements: {
        enabled: true,
        capacityLabel: null,
        dimensions: ['sector', 'state'],
      },
      manifesto: {
        enabled: false,
        dimensions: [],
      },
    },

    aiGuardrails: {
      positivityFilter: true,
      sourceRequired: true,
    },

    approvalStatus: 'approved',
    createdAt: now,
    updatedAt: now,
  });

  console.log('Tinubu Delivers candidate document seeded.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

