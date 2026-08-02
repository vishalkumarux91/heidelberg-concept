# heidelberg-concept

Concept work for the Mycem Cement website redesign — Mycem is the Indian
cement brand of Heidelberg Materials.

## Contents

- [`copy/mycem-concept-page.md`](copy/mycem-concept-page.md) — the copy deck:
  hero scroll sequence, the argument section, brand story and sustainability,
  product carousel, presence map, lead capture, plus build notes.
- `src/` — the concept page built in Next.js. All six sections, live.

## Running it

```bash
npm install
npm run dev     # http://localhost:3000
```

`npm run build` for a production build, `npx eslint .` to lint.

## How it is put together

- **Next.js 16 (App Router) + React 19 + Tailwind v4.** Server components
  throughout except the four sections that need interaction — hero, products,
  presence, lead capture.
- **`src/content/copy.ts` is the single source of truth for prose.** No section
  component holds copy of its own, so a deck revision is one file. Unresolved
  values are typed (`OpenItem`), not stringly — a missing figure is `null` and
  renders as an em-dash, never as a plausible-looking number.
- **`src/app/globals.css` holds the design tokens.** The Heidelberg Materials
  brand system per `DESIGN_INSTRUCTIONS`: Deep Green `#004E2B` and Sandy Grey
  `#E6E6DF` (exact, from the guide), derived tints for UI depth, weather-state
  colours confined to the hero HUD. Plus Jakarta Sans for display and body
  (a visually-matched stand-in — the guide has no type page), JetBrains Mono
  for eyebrows, labels and stat units only.
- **Motion:** Lenis smooth scroll + a scroll-driven pinned weather hero
  (mask wipes with per-transition direction, particle canvas where effects
  lead the image). Below 768px the hero is a swipeable carousel — no
  scroll-jacking on mobile. Under `prefers-reduced-motion` Lenis is never
  started and the hero renders statically.

## Assets

| Location | State |
|---|---|
| `public/hero/` | **Real.** AVIF + WebP at 1080 / 1600 / 2560 / 3840, cut from the supplied 5504×3072 masters with identical encoder settings per frame, so no texture variation shows during crossfades. |
| `hero-masters/` | The four 5504×3072 originals. Kept outside `public/` — Next copies `public/` verbatim, and serving 36MB of unused masters would wreck the budget. Re-cut from here. |
| `public/brand/logo.png` | **Real.** HeidelbergCement India, positive colourway, transparent PNG. |
| `public/products/` | **Placeholder.** AI bag renders on white, pending supplied photography. Same filenames swap straight in. |

To re-cut the hero derivatives after replacing a master, use `sharp` (already
present as a Next dependency) at widths 1080/1600/2560/3840, AVIF q52 + WebP
q80 — that lands each 2560 frame at roughly 230–340KB AVIF.

### Two brand notes on the logo

Both are decisions for the client, not blockers:

1. **The box is White, not Deep Green.** The supplied asset is the positive
   (green) colourway, which would be invisible on Deep Green, and recolouring
   the mark is not permitted. White is one of the four approved box colours.
   If the mono white colourway is supplied, the box can move to Deep Green —
   it is one class name in `Hero.tsx`.
2. **It is the full lockup and reads "HeidelbergCement India".** The guide
   specifies the *compact* logo, and the group now trades as Heidelberg
   Materials. Worth confirming which mark and wordmark this concept should
   carry before it is shown.

## Review mode

The bar at the bottom of the page toggles **annotation mode**, which reveals
every `[VERIFY]` and `[SUPPLY]` slot inline, where it sits on the page, rather
than in a separate list nobody cross-references. It is a review affordance, not
a production component — delete `src/components/ReviewBar.tsx` and the two
`[data-annotations]` rules in `globals.css` once the open items are closed.

### Verification key

Two markers run through the copy. Neither is decorative — both block sign-off.

- `[VERIFY]` — the figure exists but the source data is stale and must be
  re-confirmed before it ships.
- `[SUPPLY]` — the client has to provide it. Deliberately left blank rather
  than estimated; do not fill these with plausible-looking numbers.

## Known gaps

Tracked in full by the review bar. The two that constrain the build itself:

- **The India map has no base asset.** An outline has deliberately not been
  drawn or approximated — an inaccurate national boundary on an India-facing
  site is a legal and reputational exposure, not a design detail. Selection,
  filtering and marker placement are all live, and the frame is the real
  coordinate space, so a licensed boundary-accurate asset drops in without
  repositioning.
- **The enquiry endpoint validates but does not deliver.** Where enquiries
  route — central team or nearest dealer — is an open question in the deck, and
  wiring a destination before it is answered would drop real leads into a void
  that looks like it works. See `src/app/api/enquiry/route.ts`.

## Accessibility

Audited with axe-core at desktop, mobile, reduced-motion and annotations-on:
no violations. Worth preserving as the design changes:

- Under `prefers-reduced-motion` the hero abandons the pinned scroll sequence
  entirely rather than merely shortening it, and lays the four weather states
  out as a static grid.
- Each season has two colour ramps. The saturated one tints artwork and marker
  bars; the darkened `-text` one carries small labels. The saturated ramp fails
  4.5:1 on paper — don't use it for type.
- The oxide accent is too dark for the ink-backed product section;
  `--color-oxide-light` is its counterpart there.
