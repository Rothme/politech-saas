# PoliTech SaaS (Capitaro)

A multi-tenant platform for political/organizational campaigns to project
their achievements and/or manifestos, dynamically configured per candidate —
no per-candidate code, one shared engine.

First tenant: Tinubu Delivers (migrated from standalone build, see
`docs/THEME_TINUBU.md` for exact visual mirroring spec).

## Structure

```
src/
  config/
    offices.js       — office registry (President, Governor, ... Student Union President, ...)
    dimensions.js     — dimension vocabularies for Geographic vs Organizational tracks
  data/
    geography/        — Nigeria states/LGA/ward reference dataset (MIT licensed,
                         source: temikeezy/nigeria-geojson-data)
  lib/
    firebase.js        — Firebase client init
    geography.js        — cascading State -> LGA -> Ward lookup + validation helpers
scripts/
  seedGeography.js     — one-time Firestore seed for /reference/geography
docs/
  DATA_MODEL.md         — full Firestore schema
  THEME_TINUBU.md        — extracted design tokens from the existing Tinubu Delivers build
  OPEN_ITEMS.md           — deferred decisions, tracked for next campaign onboarding
```

## Setup

```bash
npm install
cp .env.example .env    # fill in Firebase project config
node scripts/seedGeography.js   # one-time: seed geography reference data
npm run dev
```

## Key design decisions (see full discussion history for reasoning)

- **One shared renderer, per-candidate config** — no per-candidate codebases.
- **Two dimension tracks**: Geographic (political offices) vs Organizational
  (student unions, associations) — separate vocabularies, same mechanics.
- **Enforced geography hierarchy** (State -> LGA -> Ward) validated against a
  reference dataset, to prevent data-entry errors going live on a public
  campaign page.
- **Content approval workflow**: everything (campaign-submitted or
  Capitaro-researched) passes through a `pending -> approved` gate before
  publishing, supporting the platform's neutral-infrastructure positioning.
- **URL structure**: `politech.com.ng/{candidate-slug}` — path-based, not
  subdomain-based.

