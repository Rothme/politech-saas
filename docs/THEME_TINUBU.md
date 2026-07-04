# Theme: Tinubu Classic (extracted from existing Tinubu Delivers build)

Source: `/delivers` page of the current standalone Tinubu Delivers app
(tinubu-delivers.pages.dev). Extracted for exact visual mirroring under
PoliTech's shared multi-tenant renderer.

## Colors
```js
{
  green:  '#008751',  // primary — Nigerian flag green
  dark:   '#0a1a0a',  // near-black backgrounds (info hero)
  gold:   '#c8a84b',  // accent — eyebrow labels, borders
  light:  '#f3f6f0',  // page background
  accent: '#005c38',  // darker green, hover states
  white:  '#ffffff',
  text:   '#1a2e1a',
  muted:  '#5a6e5a',
  border: '#dde8dd',
}
```

## Typography
- Heading font: `Playfair Display` (weights 700, 900) — serif, used for hero
  titles and section heads
- Body/UI font: `DM Sans` (weights 400, 500, 600) — sans-serif, everything else
- Google Fonts import, preconnect for performance

## Layout signature
- Mobile-first, `max-width: 480px` centered app shell
- Screen-based transitions (explore -> loading -> info/share), fade+slide-up
  animation on screen change
- Hero: full-width image, dark gradient overlay (top 20% opacity -> bottom 75%),
  curved bottom edge via `clip-path: ellipse(55% 100% at 50% 100%)` — this curve
  is a distinctive, reusable visual signature worth keeping as a selectable
  hero style in the shared theme system, not just a Tinubu-only quirk
- Sector/dimension picker: 3-column grid of rounded cards, icon + label,
  selection state = green border + circular checkmark badge
- Dynamic content card (`#infographic-card`): stats grid, comparison table,
  achievement list, progress bars, closing quote block

## Share mechanism
- Client-side screenshot via `html2canvas` (score: scale 2x, transparent-safe
  background using theme's `--light` color)
- Native `navigator.share` where available (mobile), falls back to explicit
  share-intent URLs for WhatsApp / X (Twitter) / Instagram / Facebook / Telegram
- Download-as-PNG always available

## Notes for the shared renderer
This should be implemented as `themeId: "tinubu-classic"` — a CSS variable set
+ layout component selection — NOT as separate per-candidate code. Any future
candidate can select this theme, or a new one, from the same component library.

