# Open Items — deferred until further conceptual decisions or next campaign onboarding

These are known gaps, intentionally deferred per the decision to scaffold now
and revisit conceptual details when the next campaign (beyond Tinubu Delivers)
is being onboarded.

1. **Senatorial District / Federal Constituency reference data.**
   Not available as a clean open dataset (confirmed via research — they don't
   map 1:1 onto LGA boundaries). Needs manual compilation from INEC's official
   constituency delineation documents. Not required for Tinubu Delivers
   (President -> Sector + State only), so not blocking initial build.

2. **AI-extraction guardrails for campaign-provided manifestos.**
   When campaigns opt into AI-assisted extraction (pulling structured
   achievements/manifesto points from an uploaded document), the guardrail
   needed is different from Tinubu Delivers' "positivity filter" — it should
   prevent fabrication/embellishment beyond what's in the source document,
   not enforce positivity (campaigns control their own positivity by what
   they choose to submit). Needs its own prompt design, not a reuse of the
   Tinubu Delivers prompt.

3. **Unified admin dashboard UX.** One admin view across all candidates
   (approval queues, live/pending status) — not yet designed. Needed before
   onboarding any second candidate.

4. **Onboarding flow UI** (registration -> office/status selection ->
   dimension picker -> upload -> QR generation). Data model supports it;
   UI not yet built.

5. **Theme picker / multiple design options.** Only one theme (Tinubu
   Classic) exists so far. Future campaigns need a gallery of theme options
   to choose from at onboarding.

6. **Hierarchical enforcement UI** for State -> LGA -> Ward cascading
   selection in the actual item-tagging form (the data + validation helper
   exist in `src/lib/geography.js`; the form component doesn't yet).

7. **Domain/hosting cutover** — registering and connecting `politech.com.ng`,
   deciding path-based routing implementation (single Pages project with
   internal routing, chosen over Worker-proxy per earlier discussion).

