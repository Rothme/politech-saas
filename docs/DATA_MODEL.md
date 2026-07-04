# PoliTech SaaS — Data Model

Single Firestore project, multi-tenant by `candidateId`. One shared rendering
engine consumes this data for every candidate page at `politech.com.ng/{slug}`.

---

## `/candidates/{candidateId}`

```
{
  slug: "tinubu-delivers",          // used in URL: politech.com.ng/tinubu-delivers
  name: "Bola Ahmed Tinubu",
  office: "president",              // references config/offices.js id
  status: "incumbent",              // "incumbent" | "aspirant"
  slogan: "Renewed Hope",
  photoUrl: "...",
  themeId: "tinubu-classic",        // references /themes/{themeId}
  contentSource: "ai_generated" | "campaign_provided" | "capitaro_researched",

  projectionConfig: {
    achievements: {
      enabled: true,
      capacityLabel: null,          // e.g. "as Commissioner for Works" — used when
                                     // an aspirant projects achievements from a
                                     // different prior office than the one they're
                                     // currently seeking
      dimensions: ["sector", "state"]   // ids from config/dimensions.js
    },
    manifesto: {
      enabled: false,
      dimensions: []
    }
  },

  aiGuardrails: {
    // only relevant when contentSource === "ai_generated"
    // (i.e., no campaign-provided source material — Capitaro's AI is filling the gap)
    positivityFilter: true,     // Tinubu Delivers-style: suppress unverified negative claims
    sourceRequired: true
  },

  approvalStatus: "pending" | "approved" | "live",
  createdAt, updatedAt
}
```

## `/candidates/{candidateId}/items/{itemId}`

One document per achievement or manifesto entry.

```
{
  contentType: "achievement" | "manifesto",
  title: "...",
  detail: "...",
  media: ["url1", "url2"],

  tags: {
    sector: "Education",
    state: "Kwara",              // must exist in reference geography dataset
    lga: "Ilorin West",          // must exist under tags.state in reference data
    ward: "Ajikobi",             // must exist under tags.lga in reference data
    senatorialDistrict: null,    // curated list, not hierarchy-enforced
    federalConstituency: null,

    // organizational track equivalents (mutually exclusive with geo tags in practice)
    faculty: null,
    department: null,
    hall: null,
    committee: null,
    chapter: null,
    portfolioArea: null
  },

  approvalStatus: "pending" | "approved",
  approvedBy: null,
  createdAt, updatedAt
}
```

## `/reference/geography` (platform-level, shared across all candidates)

Seeded once from `src/data/geography/states-lgas-wards.json`
(source: temikeezy/nigeria-geojson-data, MIT licensed).

```
states-lgas-wards.json structure:
{
  "Kwara": {
    "Ilorin West": ["Ajikobi", "Abele", ...],
    "Ilorin East": [...],
    ...
  },
  ...
}
```

Senatorial Districts / Federal Constituencies are NOT in this dataset — they
require a separate, manually-curated reference table (see
`docs/OPEN_ITEMS.md`) since they don't map cleanly 1:1 onto LGA boundaries.

## `/admin/reviewers/{uid}`

Unified admin — one dashboard reviews approval queues across ALL candidates,
not per-candidate. Simple role doc:

```
{ role: "capitaro_admin" | "capitaro_reviewer", email, name }
```

## `/themes/{themeId}`

Visual theme config, decoupled from candidate data so any candidate can select
any theme. See `docs/THEME_TINUBU.md` for the first theme extracted from the
existing Tinubu Delivers build.

```
{
  name: "Tinubu Classic",
  colors: { primary, dark, gold, light, accent, white, text, muted, border },
  fonts: { heading: "Playfair Display", body: "DM Sans" },
  heroStyle: "image-overlay-curve",
  shareEnabled: true
}
```

