// Generates achievement/manifesto content live via Claude, for candidates
// with contentSource === "ai_generated" (Tinubu Delivers' original pattern).
//
// Generalized from the original sector-only / state-only prompts into a single
// dimension-aware builder, so any future ai_generated candidate can reuse this
// without a new prompt being hand-written per dimension.

const PROXY = import.meta.env.VITE_CLAUDE_PROXY_URL;

function buildPrompt({ candidateName, office, dimensionLabel, dimensionValue, positivityFilter }) {
  const guardrail = positivityFilter
    ? `CRITICAL: ALL content must be POSITIVE and show IMPROVEMENT. Only select metrics where the administration shows clear increases and improvement. All change values must be positive increases (e.g. +X%). Never include metrics showing decline, reduction, or negative change. Frame all statistics, achievements, and comparisons in the most favourable and optimistic light. This is a campaign platform — only present wins, progress, and investment in ${dimensionValue}.`
    : `Present achievements and progress factually and proportionately, including areas of ongoing work alongside completed wins. Do not fabricate figures; only use information consistent with the source material provided.`;

  return `You are producing factual content for a Nigerian campaign platform called "${candidateName} Delivers", for ${candidateName}, running for ${office}. Generate achievement data specifically for ${dimensionLabel}: ${dimensionValue}.

Return ONLY valid JSON (no markdown, no backticks, no preamble):
{"headline":"Bold 8-word headline on ${dimensionValue}","stats":[{"value":"X","label":"desc"},{"value":"X","label":"desc"},{"value":"X","label":"desc"},{"value":"X","label":"desc"}],"achievements":[{"title":"T","detail":"One sentence about ${dimensionValue}."},{"title":"T","detail":"..."},{"title":"T","detail":"..."},{"title":"T","detail":"..."},{"title":"T","detail":"..."}],"progress":[{"label":"Category","percent":70}],"quote":"Policy statement relevant to ${dimensionValue}","source":"Source, Year"}

Rules: achievements=exactly 5. ${guardrail}`;
}

export async function generateContent({ candidate, dimensionLabel, dimensionValue }) {
  if (!PROXY) {
    throw new Error(
      'VITE_CLAUDE_PROXY_URL is not set. Deploy the Cloudflare Worker in workers/claude-proxy.js and point this env var at it.'
    );
  }

  const prompt = buildPrompt({
    candidateName: candidate.name,
    office: candidate.office,
    dimensionLabel,
    dimensionValue,
    positivityFilter: candidate.aiGuardrails?.positivityFilter ?? false,
  });

  const res = await fetch(PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) throw new Error(`Proxy request failed: ${res.status}`);

  const data = await res.json();
  const text = data.content.map((c) => c.text || '').join('');
  return JSON.parse(text.replace(/```json|```/g, '').trim());
}

