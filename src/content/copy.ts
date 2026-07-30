/**
 * Single source of truth for page copy.
 *
 * Mirrors `copy/mycem-concept-page.md`. If the deck changes, change it
 * here — no section component should hold prose of its own.
 *
 * Unresolved values are typed, not stringly. `verify` means the figure
 * exists but its source is stale; `supply` means the client owns it and
 * it has deliberately not been invented. Neither is allowed to render as
 * a plausible-looking placeholder number.
 */

export type OpenItem = {
  kind: "verify" | "supply";
  /** What specifically is needed, and from whom. */
  note: string;
};

export const brand = {
  name: "Mycem",
  parent: "Heidelberg Materials India",
  eyebrow: "Mycem Cement · Heidelberg Materials India",
  throughLine: "Strong for every season. Responsible for the next.",
  signOff: "Built to last. Made to answer for itself.",
} as const;

/* ---------------------------------------------------------------- 01 */

export type Season = {
  id: "summer" | "monsoon" | "desert" | "winter";
  name: string;
  /** The stressor. Always first. */
  stressor: string;
  /** The answer. Always second. */
  answer: string;
  /** Saturated ramp — artwork tint and marker bars only, never text. */
  tint: string;
  /** Darkened ramp — safe for small labels on paper. */
  textTint: string;
  artNote: string;
};

export const hero = {
  eyebrow: brand.eyebrow,
  headline: ["Strong for every season.", "Responsible for the next."],
  subhead:
    "India doesn't build in one climate. It builds in all of them — and asks the same bag of cement to hold in every one.",
  scrollCue: "Scroll through the year",
  seasons: [
    {
      id: "summer",
      name: "Summer",
      stressor: "Forty-plus on the terrace.",
      answer: "Slabs that hold their line.",
      tint: "var(--season-summer)",
      textTint: "var(--season-summer-text)",
      artNote: "House + valley, high sun, bleached midday light",
    },
    {
      id: "monsoon",
      name: "Monsoon",
      stressor: "Four months of water.",
      answer: "Walls that keep it outside.",
      tint: "var(--season-monsoon)",
      textTint: "var(--season-monsoon-text)",
      artNote: "Same house + valley, heavy rain, saturated greens",
    },
    {
      id: "desert",
      name: "Desert",
      stressor: "Scorching by day, cold by night.",
      answer: "Structures that don't flinch.",
      tint: "var(--season-desert)",
      textTint: "var(--season-desert-text)",
      artNote: "Same house + valley, arid, low raking light",
    },
    {
      id: "winter",
      name: "Winter",
      stressor: "Frost, thaw, frost again.",
      answer: "Foundations that stay put.",
      tint: "var(--season-winter)",
      textTint: "var(--season-winter-text)",
      artNote: "Same house + valley, frost, cold flat light",
    },
  ] satisfies Season[],
} as const;

/* ---------------------------------------------------------------- 02 */

export const theTurn = {
  label: "Why it matters",
  headline: "The weather tests every wall you build.",
  body: [
    "A home is the largest thing most families will ever pay for, and it spends every day of its life outdoors. Heat expands it. Water looks for a way in. Cold pulls it apart and lets it settle back. None of this happens on the day you build — it happens across the thirty years afterwards, quietly, in the places nobody inspects.",
    "Cement is the one decision that sits underneath all of it. Get it right and nothing happens, for decades. That is the whole point.",
  ],
  demands: [
    {
      id: "heat",
      title: "Heat",
      body: "Concrete cures fast in Indian summers — sometimes faster than it should. Consistency in the mix is what keeps strength predictable when the temperature isn't.",
    },
    {
      id: "water",
      title: "Water",
      body: "Monsoon doesn't test a wall once. It tests it every year, and finds whatever was left imperfect. Density and finish do more for a home than any coat of paint.",
    },
    {
      id: "time",
      title: "Time",
      body: "Thermal movement, settlement, load. A structure is never finished being tested. Material quality is the only variable you fix permanently, on day one.",
    },
  ],
  transition:
    "Getting that right, every batch, in every season, is a hundred and fifty years of work.",
} as const;

/* ---------------------------------------------------------------- 03 */

export type Stat = {
  /** null when the client still owes us the number. */
  figure: string | null;
  label: string;
  status: string;
  open?: OpenItem;
};

export const story = {
  label: "Who we are",
  headline: ["A hundred and fifty years of material science.", "Two decades building India."],
  body: [
    "Mycem is the Indian cement brand of Heidelberg Materials — one of the world's largest building-materials groups, and one of its oldest. That inheritance isn't a date on a letterhead. It's process control, laboratory discipline, and a research programme that has spent a century and a half learning what makes a material last.",
    "We brought it to India in 2006. Since then we've built plants in Madhya Pradesh, Uttar Pradesh and Karnataka, and supplied the homes, schools, roads and workplaces of central India through dealers who know their markets better than any brochure could.",
    "The next hundred and fifty years ask a harder question than the last: how do you make a material this essential, this durable, and this much lighter on the planet? That work is already underway.",
  ],
  /**
   * Deck note: four to six stats maximum. Six defined, and the two the
   * client owes are rendered as explicit gaps rather than dropped —
   * a dropped row is invisible in review, an empty one is not.
   */
  stats: [
    { figure: "~150", label: "Years of Heidelberg Materials expertise", status: "Group heritage" },
    { figure: "2006", label: "Mycem began production in India", status: "Confirmed" },
    {
      figure: "6.26 MT",
      label: "Annual cement capacity",
      status: "2020 figure",
      open: {
        kind: "verify",
        note: "Capacity is a 2020 number. Re-confirm against current published capacity before launch.",
      },
    },
    {
      figure: "3",
      label: "Manufacturing locations across India",
      status: "Pending re-count",
      open: {
        kind: "verify",
        note: "Confirm plant count — the July 2024 Himalaya Cement tie-up may change it.",
      },
    },
    {
      figure: null,
      label: "Dealers and retail partners nationwide",
      status: "Awaiting figure",
      open: { kind: "supply", note: "Dealer and retail partner count. Sales team." },
    },
    {
      figure: null,
      label: "Homes built with Mycem cement",
      status: "Awaiting figure",
      open: {
        kind: "supply",
        note: "Homes-built figure, with the basis for the estimate. Marketing.",
      },
    },
  ] satisfies Stat[],
  sustainability: {
    subhead: "Grey material. Green intent.",
    body: [
      "Cement is one of the hardest industries in the world to decarbonise, and pretending otherwise would insult anyone paying attention. What we can tell you is what we're actually doing: alternative fuels and raw materials in place of virgin inputs, clinker substitution to lower the carbon in every tonne, mine sites rehabilitated rather than abandoned, and a group-level investment programme in carbon capture that treats 2050 as a deadline rather than an aspiration.",
      "Heidelberg Materials has set its Sustainability Commitments for 2030 and submitted an Energy Compact that became part of India's national submission to the United Nations. We would rather show you the number than the adjective.",
    ],
    proofHeading: "Proof points",
    proofNote: "All independently awarded, all verifiable.",
    awarded: [
      {
        title: "Five-Star HSE Excellence Award 2021–22",
        detail: "National Safety Council (Madhya Pradesh Chapter) — Narsingarh plant, third consecutive year",
      },
      {
        title: "Gold Award, cement sector",
        detail: "Apex India Foundation — Jhansi unit",
      },
      {
        title: "Star Rating for Sustainable Development Framework 2020–21",
        detail: "Indian Bureau of Mines — Diamond Limestone Mines, Patharia",
      },
    ],
    pending: [
      { label: "CO₂ intensity per tonne, current versus baseline", kind: "supply" as const },
      { label: "Alternative fuel substitution rate", kind: "supply" as const },
      { label: "Water positive / recycled material figures", kind: "supply" as const },
    ],
    pendingNote:
      "Three quantified claims are held back until the numbers arrive. Specific, quantified, verifiable — or omitted.",
  },
} as const;

/* ---------------------------------------------------------------- 04 */

export type Product = {
  id: string;
  name: string;
  role: string;
  body: string;
  tags: string[];
  claim: OpenItem;
};

export const products = {
  label: "The range",
  headline: "Four cements. One standard.",
  subhead:
    "Different jobs ask for different chemistry. What doesn't change is the process control behind every bag.",
  items: [
    {
      id: "mycem",
      name: "mycem",
      role: "The everyday cement.",
      body: "For the walls, plaster and brickwork that make up most of a build.",
      tags: ["Masonry", "Plaster", "General construction"],
      claim: { kind: "supply", note: "Grade and BIS standard." },
    },
    {
      id: "power",
      name: "mycem Power",
      role: "Built for structure.",
      body: "Where load matters — columns, beams, slabs and the parts of a home you never see again once it's finished.",
      tags: ["Slabs", "Columns", "Beams", "RCC"],
      claim: { kind: "supply", note: "Grade, strength profile, setting characteristics." },
    },
    {
      id: "primo",
      name: "mycem Primo",
      role: "The premium mix.",
      body: "For builders who want a finer finish and tighter consistency from the first bag to the last.",
      tags: ["Finish", "Consistency", "Premium application"],
      claim: { kind: "supply", note: "Differentiating attribute versus mycem Power." },
    },
    {
      id: "power-shield",
      name: "mycem Power Shield",
      role: "Made to resist.",
      body: "For structures that face the harder end of the weather — moisture, chemical exposure, aggressive ground conditions.",
      tags: ["Durability", "Moisture resistance", "Aggressive environments"],
      claim: { kind: "supply", note: "What specifically it resists, and the test basis." },
    },
  ] satisfies Product[],
  footer: {
    question: "Not sure which one your build needs?",
    cta: "Talk to our technical team",
  },
} as const;

/* ---------------------------------------------------------------- 05 */

export type Plant = {
  id: string;
  name: string;
  state: string;
  stateCode: string;
  type: string;
  body: string;
  /** Percentage coordinates within the map frame, for marker placement. */
  position: { x: number; y: number };
};

export const presence = {
  label: "Where we are",
  headline: ["Cement is a local decision.", "So we built locally."],
  body: "Nobody ships cement across a country if they can help it. It's heavy, it's time-sensitive, and the person who recommends it is usually standing on your site. So our plants sit close to the markets they serve, and our dealers are the people your mason already trusts.",
  mapPrompt: "Select a state to see plants and dealer coverage",
  allLabel: "All India",
  plants: [
    {
      id: "narsingarh",
      name: "Narsingarh",
      state: "Madhya Pradesh",
      stateCode: "MP",
      type: "Integrated cement plant",
      body: "Central India's production base, supported by our Patharia limestone mines.",
      position: { x: 40, y: 47 },
    },
    {
      id: "jhansi",
      name: "Jhansi",
      state: "Uttar Pradesh",
      stateCode: "UP",
      type: "Grinding unit",
      body: "Serving Uttar Pradesh and the northern belt.",
      position: { x: 45, y: 40 },
    },
    {
      id: "ammasandra",
      name: "Ammasandra",
      state: "Karnataka",
      stateCode: "KA",
      type: "Southern operations",
      body: "Serving Karnataka and neighbouring markets.",
      position: { x: 38, y: 76 },
    },
  ] satisfies Plant[],
  plantsOpen: {
    kind: "verify",
    note: "Confirm plant classifications, and whether the Himalaya Cement manufacturing tie-up (announced July 2024) adds locations to display.",
  } satisfies OpenItem,
  mapOpen: {
    kind: "supply",
    note: "Boundary-accurate India map asset. Must be a licensed or officially sourced outline — an approximated national boundary is a legal and reputational exposure on an India-facing site, so nothing has been drawn here.",
  } satisfies OpenItem,
  dealerDataOpen: {
    kind: "supply",
    note: "Geocoded dealer data if the map is to show density. Without it, state selection filters plants only.",
  } satisfies OpenItem,
  lab: {
    heading: "The laboratory comes to your site.",
    body: "Our Mobile Technical Lab tests materials where the building is actually happening — sand, aggregate, water, mix. It's free, it takes an afternoon, and it catches the problems that are expensive to find later.",
    cta: "Request a site visit",
  },
  dealer: {
    heading: "Find a dealer near you",
    body: "Mycem is sold only through authorised dealers, stockists and retailers. They hold stock, they know local conditions, and they can tell you what's working on sites around you right now.",
  },
} as const;

/* ---------------------------------------------------------------- 06 */

export const leadCapture = {
  label: "Get in touch",
  headline: "Tell us what you're building.",
  subhead:
    "Product guidance, a dealer near you, or a technical visit to your site. One message is enough — we'll take it from there.",
  fields: {
    name: { label: "Your name", placeholder: "Ramesh Kumar" },
    phone: { label: "Mobile number", placeholder: "98765 43210" },
    email: { label: "Email", placeholder: "ramesh@example.com" },
    project: { label: "What are you building?", placeholder: "A two-storey house in Damoh" },
  },
  submit: "Send enquiry",
  submitting: "Sending…",
  whatsapp: {
    prompt: "Prefer to message?",
    body: 'Send us a "Hi" on WhatsApp',
    number: "7236955555",
  },
  trust: {
    heading: "Before you send anything",
    body: "We sell only through authorised dealers. We never take payment online and never ask for advance transfers. If anyone contacts you claiming otherwise, it isn't us.",
  },
  privacy:
    "We'll use your details to answer your enquiry and connect you with a dealer nearby. Nothing else.",
  states: {
    success: "Got it. Someone from the Mycem team will call you within one working day.",
    errorPhone: "That doesn't look like a ten-digit mobile number.",
    errorGeneral: "That didn't send. Try again, or message us on WhatsApp.",
    /**
     * Not in the deck — the deck specifies only the phone and general
     * errors, but a three-field form needs a message per field. Written to
     * match the register; worth a copy review before launch.
     */
    errorName: "We'll need a name to call you by.",
    errorEmail: "That email address looks incomplete.",
  },
  routingOpen: {
    kind: "supply",
    note: "Where enquiries route: central team or nearest dealer. The endpoint validates and returns success but does not yet deliver anywhere.",
  } satisfies OpenItem,
} as const;

/* ---------------------------------------------------------------- meta */

export const openItemsSummary = [
  "Product differentiation attributes for all four cements, with test basis",
  "Current, verified capacity and plant count",
  "Quantified sustainability figures — or confirmation that only the awards are available",
  "Dealer count and geocoded dealer data, if the map is to show coverage",
  "Where enquiries route: central team or nearest dealer",
  "Boundary-accurate India map asset",
  "Hero photography: one house and valley across four weather states",
] as const;
