/**
 * One config drives all three pages.
 *
 * MAS Egypt is the parent. Aroma Lounge and COVY sit under it.
 * All three share the same layout, type and motion. Only these tokens change.
 *
 * All three now run on a clean white ground with a shared sage green accent,
 * refreshed from their previous brand-specific palettes. Same system, one
 * surface, which is why every component reads its colours from `ui` rather
 * than hardcoding white.
 *
 * Colours come from the MAS palette:
 *   3E2723 espresso   A1663A caramel   D9C3A5 sand
 *   F5EFE6 cream      4F6F52 sage
 */

import aromaLogo from "./assets/brand/aroma-logo.png";
import aromaMark from "./assets/brand/aroma-icon.png";
import covyLogo from "./assets/brand/covy-wordmark.png";
import covyMark from "./assets/brand/covy-mark.png";
import masWordmark from "./assets/brand/mas-wordmark-cocoa.svg";
import masWordmarkCream from "./assets/brand/mas-wordmark-cream.svg";
import masStone from "./assets/brand/mas-stone-copper.svg";
import masSeal from "./assets/brand/mas-seal-copper.svg";

export type BrandKey = "mas" | "aroma" | "covy";

/** Colours for the unlit cup, the state a dark page rests in. */
export interface CupDimPalette {
  bgTop: string;
  bgMid: string;
  bgBot: string;
  tableTop: string;
  tableBot: string;
  ambient: string;
  cupA: string;
  cupB: string;
  cupC: string;
  saucerOuter: string;
  saucerInner: string;
  rim: string;
  coffee: string;
  steam: string;
}

/** Colours for the lit cup. Also used for Aroma's daylight scene. */
export interface CupLitPalette {
  bgTop: string;
  bgMid: string;
  bgBot: string;
  tableTop: string;
  tableBot: string;
  glowCore: string;
  glowMid: string;
  cupA: string;
  cupB: string;
  cupC: string;
  rimFill: string;
  coffeeTop: string;
  coffeeBot: string;
  crema: string;
  cremaDeep: string;
  saucerOuter: string;
  saucerInner: string;
  stripe: string;
  steam: string;
}

/** Surface and text colours. Every shared component reads these. */
export interface UiTokens {
  scheme: "dark" | "light";
  /**
   * Which display face headings run on.
   *   "display"  Playfair italic, the two consumer brands.
   *   "modern"   Archivo set heavy and tight. Archivo is one of the five
   *              faces in the MAS pack, so the group page stays inside its own
   *              type system while reading as a current product site rather
   *              than an editorial one. Cormorant stays in the system for
   *              print and signage, where an old-style face belongs.
   *   "sans"     no display face at all.
   */
  headingFont: "display" | "modern" | "sans";
  bg: string;
  bgAlt: string;
  bgSoft: string;
  text: string;
  textMuted: string;
  textFaint: string;
  line: string;
  /** Colour for text and icons sitting on top of the hero scene. */
  onHero: string;
  onHeroMuted: string;
}

export interface Brand {
  key: BrandKey;
  path: string;
  name: string;
  nameAr: string;
  descriptor: string;

  logo?: string;
  /** Reversed artwork for the same mark, for dark grounds. */
  logoReversed?: string;
  mark?: string;
  /** MAS only. The solid diamond, used as punctuation in layout. */
  seal?: string;
  plateBg?: string;

  ui: UiTokens;

  accent: string;
  accentHover: string;
  accentText: string;
  /** Primary button ground, where the accent is too light to carry text. */
  button?: string;
  buttonText?: string;
  /** MAS only. Lifted values for the sections that invert onto a dark ground. */
  accentOnDark?: string;
  sageOnDark?: string;
  dark?: string;

  cupDim: CupDimPalette;
  cupLit: CupLitPalette;
  /** Aroma only. The bright version of the scene used on its light hero. */
  cupDay?: CupLitPalette;

  nav: { label: string; target: string }[];
  navCta: string;

  hero: {
    line1: string;
    line2: string;
    aside: string;
    prompt: string;
    cta: string;
  };

  about: {
    eyebrow: string;
    headingItalic: string;
    heading: string;
    body: string[];
    facts: { label: string; value: string }[];
  };

  contact: {
    eyebrow: string;
    headingItalic: string;
    heading: string;
    blurb: string;
  };

  /** Instagram handle without the @. Empty until the real one is supplied. */
  instagram: string;
}

const MAS: Brand = {
  key: "mas",
  path: "/",
  name: "MAS Egypt",
  nameAr: "ماس مصر",
  descriptor: "Food and beverage group",

  logo: masWordmark,
  logoReversed: masWordmarkCream,
  mark: masStone,
  seal: masSeal,
  plateBg: "#F5EFE6",

  // The manual's own light scheme. Cream replaces white everywhere, Cocoa
  // carries the type at 12.09:1, and a Kraft tint over Cream gives the second
  // ground that a screen needs without opening a sixth colour.
  ui: {
    scheme: "light",
    headingFont: "modern",
    bg: "#FFFFFF",
    bgAlt: "#F6F7F5",
    bgSoft: "#FFFFFF",
    text: "#3E2723",
    textMuted: "rgba(62,39,35,0.72)",
    textFaint: "rgba(62,39,35,0.52)",
    line: "rgba(62,39,35,0.12)",
    onHero: "#3E2723",
    onHeroMuted: "rgba(62,39,35,0.72)",
  },

  // Refreshed onto a clean white ground with a sage green accent in place of
  // the old copper. It carries the marks, the rules and the active states;
  // the primary button takes white on sage, the site's new strongest pairing.
  accent: "#4F6F52",
  accentHover: "#3f5a42",
  accentText: "#FFFFFF",
  button: "#4F6F52",
  buttonText: "#FFFFFF",
  /** Digital-only lifted tints, which the manual supplies for dark interfaces. */
  accentOnDark: "#7E9C7F",
  sageOnDark: "#7E9C7F",
  dark: "#1C1311",

  cupDim: {
    bgTop: "#1c1512",
    bgMid: "#141010",
    bgBot: "#0b0807",
    tableTop: "#241a15",
    tableBot: "#0e0a08",
    ambient: "#2a1f18",
    cupA: "#2e2320",
    cupB: "#261d1a",
    cupC: "#1a1310",
    saucerOuter: "#241b17",
    saucerInner: "#2b211c",
    rim: "#1f1714",
    coffee: "#0a0706",
    steam: "#4a3a30",
  },
  cupLit: {
    bgTop: "#7a5232",
    bgMid: "#4a3018",
    bgBot: "#2a1a0c",
    tableTop: "#8a5c35",
    tableBot: "#3a2612",
    glowCore: "#ffcf8c",
    glowMid: "#ffb066",
    cupA: "#fffaf0",
    cupB: "#F5EFE6",
    cupC: "#D9C3A5",
    rimFill: "#efe4cd",
    coffeeTop: "#6b4023",
    coffeeBot: "#2e1a0d",
    crema: "#c99a5f",
    cremaDeep: "#8a5a30",
    saucerOuter: "#e9dcc4",
    saucerInner: "#F5EFE6",
    stripe: "#A1663A",
    steam: "#fff4e2",
  },

  nav: [
    { label: "About", target: "about" },
    { label: "Brands", target: "brands" },
    { label: "What we do", target: "services" },
    { label: "Our work", target: "work" },
    { label: "Contact", target: "contact" },
  ],
  navCta: "Contact the group",

  hero: {
    line1: "We build the room,",
    line2: "then we run it.",
    aside:
      "MAS Egypt develops and operates food and beverage brands in Cairo, and runs venues for owners who hold the site and the capital but not the operating team.",
    prompt: "",
    cta: "What we do",
  },

  about: {
    eyebrow: "The group",
    headingItalic: "MAS is the operator,",
    heading: "not the sign above the door.",
    body: [
      "We build and run food and beverage brands in Cairo. Each one carries its own name, colour and voice; the group backs it, guarantees it, and stays one step back. What we sell is not a logo on a fascia but the thing a single restaurant cannot buy for itself.",
      "That runs upstream as well as down. Green coffee and raw produce are bought direct, roasted and prepared in our own production, and sent out to houses we staff and train ourselves. The margin and the quality ceiling both live above the kitchen, so that is where we start.",
      "Alongside the brands we own, the group operates venues for owners who hold the room and the capital but not the operating team. Same standard, same reporting, and the name over the door stays theirs.",
    ],
    facts: [
      { label: "Own the source", value: "Green coffee and raw produce bought direct, not finished product" },
      { label: "Fire and time", value: "Roast curves, proof times, reduction. The parts that cannot be hurried" },
      { label: "The same at 7am and 11pm", value: "Consistency is what a group sells that a single restaurant cannot" },
    ],
  },

  contact: {
    eyebrow: "Contact",
    headingItalic: "Talk to",
    heading: "the group office.",
    blurb:
      "MAS appears directly on contracts, supply, job postings and investor material. Venue management, partnership, wholesale or press \u2014 tell us which and it reaches the right desk.",
  },

  instagram: "",
};

const AROMA: Brand = {
  key: "aroma",
  path: "/aroma",
  name: "Aroma Lounge",
  nameAr: "أروما لاونج",
  descriptor: "Coffee, kitchen and desks",

  logo: aromaLogo,
  mark: aromaMark,
  plateBg: "#F5EFE6",

  // The daytime brand, so the whole page runs light while the group and COVY
  // stay dark. Same type and motion, inverted surface.
  ui: {
    scheme: "light",
    headingFont: "display",
    bg: "#FFFFFF",
    bgAlt: "#F6F7F5",
    bgSoft: "#FFFFFF",
    text: "#23301A",
    textMuted: "rgba(35,48,26,0.70)",
    textFaint: "rgba(35,48,26,0.45)",
    line: "rgba(35,48,26,0.12)",
    onHero: "#23301A",
    onHeroMuted: "rgba(35,48,26,0.72)",
  },

  // Sampled from the supplied lockup: icon #90C63D, wordmark #82A541.
  accent: "#82A541",
  accentHover: "#6c8a35",
  accentText: "#ffffff",

  cupDim: {
    bgTop: "#181f14",
    bgMid: "#10150d",
    bgBot: "#0a0d08",
    tableTop: "#1c2317",
    tableBot: "#0c0f09",
    ambient: "#232c19",
    cupA: "#2a3320",
    cupB: "#222a1a",
    cupC: "#161c10",
    saucerOuter: "#20261a",
    saucerInner: "#262e1c",
    rim: "#1c2314",
    coffee: "#0c0906",
    steam: "#4c5a3f",
  },
  cupLit: {
    bgTop: "#6b4a2c",
    bgMid: "#4a3018",
    bgBot: "#2a1a0c",
    tableTop: "#7a5230",
    tableBot: "#3a2612",
    glowCore: "#ffcf8c",
    glowMid: "#ffb066",
    cupA: "#fffaf0",
    cupB: "#f5efe0",
    cupC: "#d8cbaf",
    rimFill: "#efe4cd",
    coffeeTop: "#6b4023",
    coffeeBot: "#2e1a0d",
    crema: "#c99a5f",
    cremaDeep: "#8a5a30",
    saucerOuter: "#e9dcc4",
    saucerInner: "#f6ecd8",
    stripe: "#90C63D",
    steam: "#fff4e2",
  },
  /** Morning light on a cream table. This is Aroma's hero. */
  cupDay: {
    bgTop: "#FDFAF4",
    bgMid: "#F4ECDD",
    bgBot: "#E7DAC4",
    tableTop: "#E8D9BE",
    tableBot: "#CFB894",
    glowCore: "#FFF8E8",
    glowMid: "#F3E1B8",
    cupA: "#FFFFFF",
    cupB: "#FBF8F2",
    cupC: "#E2D9C7",
    rimFill: "#F8F4EC",
    coffeeTop: "#7A4B28",
    coffeeBot: "#3E2418",
    crema: "#C79A63",
    cremaDeep: "#8E5E34",
    saucerOuter: "#EBE1CE",
    saucerInner: "#FFFFFF",
    stripe: "#82A541",
    steam: "#BFAE8A",
  },

  nav: [
    { label: "The room", target: "top" },
    { label: "Menu", target: "menu" },
    { label: "Desks", target: "desks" },
    { label: "Branches", target: "branches" },
    { label: "Reserve", target: "reserve" },
  ],
  navCta: "Reserve a table",

  hero: {
    line1: "Aroma",
    line2: "Lounge",
    aside:
      "A full bar of coffee, juice and cold drinks, a grill and a feteer counter in the kitchen, shisha on the terrace, and tables built for people who came to work.",
    prompt: "",
    cta: "See the menu",
  },

  about: {
    eyebrow: "About Aroma Lounge",
    headingItalic: "Open early,",
    heading: "useful all day.",
    body: [
      "Aroma Lounge is the daytime room in the group. A bar that runs premium coffee, fresh juice and cold drinks all day, a kitchen that runs feteer and grill side by side, and a terrace where the shisha lives.",
      "It is also where a good part of New Cairo works. There are desks with power and proper wifi, and nobody moves you on for staying past your second cup. Students before exams, freelancers on deadline, remote teams who needed a room for the morning.",
    ],
    facts: [],
  },

  contact: {
    eyebrow: "Say hello",
    headingItalic: "Questions,",
    heading: "groups, or bulk beans.",
    blurb:
      "For a table use the reservation form above. For anything else, large groups, events, or beans by the bag, this reaches the team.",
  },

  instagram: "",
};

const COVY: Brand = {
  key: "covy",
  path: "/covy",
  name: "COVY",
  nameAr: "كوفي",
  descriptor: "Lounge and late kitchen",

  logo: covyLogo,
  mark: covyMark,
  plateBg: "#DCD4CF",

  // Rebased onto white, in line with the rest of the site, but COVY keeps its
  // own identity rather than the shared sage green: navy carries the type,
  // and mocha (from the supplied assets, already used in the cup art below)
  // carries the accent. bgAlt runs a warm greige rather than the generic
  // off-white the other two brands use, so COVY still reads as its own room.
  ui: {
    scheme: "light",
    headingFont: "display",
    bg: "#FFFFFF",
    bgAlt: "#F1ECE6",
    bgSoft: "#FFFFFF",
    text: "#262D3F",
    textMuted: "rgba(38,45,63,0.70)",
    textFaint: "rgba(38,45,63,0.45)",
    line: "rgba(38,45,63,0.12)",
    onHero: "#262D3F",
    onHeroMuted: "rgba(38,45,63,0.72)",
  },

  // Sampled from the supplied assets: navy #262D3F, greige #DCD4CF, mocha
  // #765F4D. Mocha carries the accent, greige is the secondary surface tone
  // used in the work section's cards.
  accent: "#765F4D",
  accentHover: "#5f4c3e",
  accentText: "#F7F3EE",

  cupDim: {
    bgTop: "#1a2030",
    bgMid: "#141926",
    bgBot: "#0d111a",
    tableTop: "#1c2333",
    tableBot: "#0f131d",
    ambient: "#232b3e",
    cupA: "#262D3F",
    cupB: "#1f2532",
    cupC: "#161b26",
    saucerOuter: "#1d2330",
    saucerInner: "#232a38",
    rim: "#1a2030",
    coffee: "#090b10",
    steam: "#3d465c",
  },
  cupLit: {
    bgTop: "#3a4560",
    bgMid: "#2a3245",
    bgBot: "#1a2030",
    tableTop: "#4a5573",
    tableBot: "#222a3a",
    glowCore: "#f2e9df",
    glowMid: "#a89279",
    cupA: "#f7f3ee",
    cupB: "#DCD4CF",
    cupC: "#b9aea4",
    rimFill: "#e6ded7",
    coffeeTop: "#765F4D",
    coffeeBot: "#3a2c22",
    crema: "#a98a6d",
    cremaDeep: "#6b5340",
    saucerOuter: "#cfc6bd",
    saucerInner: "#DCD4CF",
    stripe: "#765F4D",
    steam: "#f2e9df",
  },

  nav: [
    { label: "The room", target: "top" },
    { label: "Work here", target: "work" },
    { label: "Menu", target: "menu" },
    { label: "About", target: "about" },
    { label: "Reserve", target: "contact" },
  ],
  navCta: "Reserve a table",

  hero: {
    line1: "Quiet rooms,",
    line2: "late conversations.",
    aside:
      "A lounge that keeps its own hours. The kitchen stays open after most others have closed, and nobody rushes the last table of the night.",
    prompt:
      "Move your cursor across the room to see it warm up, the way it does around nine.",
    cta: "See the room",
  },

  about: {
    eyebrow: "About COVY",
    headingItalic: "The room gets",
    heading: "better after dark.",
    body: [
      "COVY is the evening half of the group. Low light, a long bar, and a kitchen that does not start winding down when the rest of the street does.",
      "It is built for the second half of the night. Dinner that runs late, a table you can keep, and a room quiet enough that you can hear the person across from you.",
    ],
    facts: [
      { label: "Kitchen", value: "Open late, every night" },
      { label: "Bar", value: "Full service, unhurried" },
      { label: "Room", value: "Low light, no rush" },
    ],
  },

  contact: {
    eyebrow: "Reserve",
    headingItalic: "Hold a table",
    heading: "for the evening.",
    blurb:
      "Reservations, private hire, large groups and events. Tell us the night and how many.",
  },

  instagram: "",
};

export const BRANDS: Record<BrandKey, Brand> = {
  mas: MAS,
  aroma: AROMA,
  covy: COVY,
};

/** The two brands MAS owns, in the order they appear. */
export const CHILD_BRANDS: Brand[] = [AROMA, COVY];

/**
 * What MAS does for owners who hold the lease but not the operation. Kept as
 * capabilities rather than a client roster until real managed venues are
 * cleared to be named.
 */
export const MANAGEMENT = {
  eyebrow: "Management",
  headingItalic: "We also run rooms",
  heading: "that are not ours.",
  blurb:
    "Owning a venue and running one are different jobs. When the second is not yours, the group takes the floor, the kitchen and the numbers, and the name over the door stays yours.",
  services: [
    {
      title: "Concept and positioning",
      body: "What the room is for, who it is for, and what it should cost to sit in it. Built before the first wall goes up where possible, retrofitted where not.",
    },
    {
      title: "Kitchen and menu",
      body: "Menu engineering against real food cost, supplier lines, prep systems and the standards that keep a dish identical on a quiet Monday and a full Friday.",
    },
    {
      title: "Floor and service",
      body: "Hiring, training and the service model. Staff who know the menu and the room, on a rota that holds together when somebody calls in sick.",
    },
    {
      title: "Numbers and reporting",
      body: "Covers, spend per head, waste, payroll against revenue. Monthly reporting the owner can actually read, not a spreadsheet nobody opens.",
    },
  ],
  /** Set to true and fill the roster once clients are cleared to be named. */
  showRoster: false,
  rosterNote: "Managed venue list available on request.",
};

/**
 * Heading tracking.
 *
 * The two consumer brands set their display face tight. Cormorant wants the
 * opposite: the manual asks for +2% at display sizes, and an old-style face
 * set negative closes its thins up.
 */
export function headingTracking(ui: UiTokens): string {
  return ui.headingFont === "modern" ? "tracking-[-0.045em]" : "tracking-[-0.05em]";
}

/**
 * The face for the second, non-italic line of a two-part heading.
 *
 * The consumer brands deliberately drop out of Playfair there, which is what
 * gives their headings their two-voice look. MAS has no italic voice: its
 * heading is one sentence in one face, so both lines stay on Cormorant.
 */
export function headingFace(ui: UiTokens): string {
  return ui.headingFont === "modern" ? "font-semibold" : "";
}

/** The display face class for a brand's headings. */
export function displayClass(ui: UiTokens): string {
  if (ui.headingFont === "display") return "font-playfair italic";
  if (ui.headingFont === "modern") return "font-semibold";
  return "";
}

/**
 * Colour for small uppercase labels.
 *
 * The two consumer brands use their accent. MAS cannot: copper on cream is
 * 4.10:1, which its own manual clears only at 24px and up, so its labels run
 * cocoa and the copper seal beside them carries the colour instead.
 */
export function labelColor(brand: Brand): string {
  return brand.key === "mas" ? brand.ui.textMuted : brand.accent;
}

/** Ground and text for a primary button. */
export function buttonColors(brand: Brand): { background: string; color: string } {
  return { background: brand.button ?? brand.accent, color: brand.buttonText ?? brand.accentText };
}

/* ---------------------------------------------------------------------------
   Group content
   ---------------------------------------------------------------------------
   MAS is a hybrid: it owns two brands and it operates venues for third party
   owners. On a group site that second half is the part that carries weight,
   because a two brand portfolio will lose a size comparison against anyone.
   So the service business gets the centre of the page and the portfolio sits
   beside it rather than above it.
--------------------------------------------------------------------------- */

/**
 * The figures band.
 *
 * PLACEHOLDER VALUES. Every `value` below has to be confirmed with MAS before
 * this goes live. The labels are the part that matters: they count the things
 * an operator can be proud of at this size rather than a brand count, which is
 * the number that would work against the group.
 */
export const GROUP_STATS: { value: string; label: string; note: string }[] = [
  { value: "2018", label: "Operating since", note: "First room opened in New Cairo" },
  { value: "04", label: "Venues run", note: "Owned brands and managed rooms" },
  { value: "140", label: "On the team", note: "Kitchen, floor and group office" },
  { value: "18h", label: "Open a day", note: "Morning service through to close" },
];

export interface Service {
  key: string;
  title: string;
  /** The one line that says who this is for. */
  audience: string;
  body: string;
  includes: string[];
  /** What the owner is actually left holding. */
  outcome: string;
}

/**
 * What the group sells. This is the one interactive block on the page: four
 * engagements, one panel, because a landlord and a brand owner arrive wanting
 * different things and neither should have to read the other's section.
 */
export const SERVICES: Service[] = [
  {
    key: "operate",
    title: "We operate",
    audience: "For owners who have the room but not the team",
    body:
      "The group takes the floor, the kitchen and the numbers, and the name over the door stays yours. We hire and train the team, set the menu against real food cost, and run the service to the same standard we hold our own brands to.",
    includes: [
      "Floor and kitchen hiring, training and rota",
      "Menu engineering against real food cost",
      "Supplier lines and prep systems",
      "Monthly covers, spend per head, waste and payroll reporting",
    ],
    outcome: "A room that runs without you in it.",
  },
  {
    key: "build",
    title: "We build",
    audience: "For a site that has not opened yet",
    body:
      "What the room is for, who it is for, and what it should cost to sit in it, decided before the first wall goes up. Concept, positioning, menu architecture and the operating model, handed over as something that can actually be run rather than a deck.",
    includes: [
      "Concept and positioning",
      "Menu architecture and pricing",
      "Kitchen layout and equipment brief",
      "Opening team structure and launch plan",
    ],
    outcome: "An opening that was designed to be operated.",
  },
  {
    key: "fix",
    title: "We fix",
    audience: "For a room that is trading below what it should",
    body:
      "A short engagement on a venue that is open and underperforming. We read the numbers first, then the kitchen and the floor, and come back with the three or four changes that move the line rather than a list of forty that nobody will do.",
    includes: [
      "Food and labour cost audit",
      "Menu rework and supplier renegotiation",
      "Service model and rota rebuild",
      "Ninety day plan with the owner in the room",
    ],
    outcome: "A shorter list, in the order it should be done.",
  },
  {
    key: "supply",
    title: "We supply",
    audience: "For kitchens outside the group",
    body:
      "Coffee, bakery and the prepared items the group already makes for its own rooms, sold on to kitchens that would rather buy them than build a production line. Specified, consistent, and delivered on a standing order.",
    includes: [
      "Coffee programme and roast to spec",
      "Bakery and prepared items",
      "Standing order and delivery",
      "Quality control on every line",
    ],
    outcome: "One less thing your kitchen has to make.",
  },
];

export interface CaseStudy {
  key: string;
  /** Left unbranded until the client clears the name. */
  client: string;
  service: string;
  challenge: string;
  did: string;
  results: { value: string; label: string }[];
}

/**
 * Selected work.
 *
 * PLACEHOLDER. These are the shape of the case studies, not real engagements.
 * Replace the copy and the figures with MAS's own before launch, and get the
 * client's written sign off before naming any of them.
 */
export const CASE_STUDIES: CaseStudy[] = [
  {
    key: "one",
    client: "Casual dining, New Cairo",
    service: "We operate",
    challenge:
      "An owner with a finished room, a full fit out and no operating team. Two soft openings had already been pulled.",
    did:
      "Took the floor and the kitchen end to end. Rebuilt the menu against real food cost, hired and trained the team, and opened on the third attempt with a service model the owner had not had to write.",
    results: [
      { value: "—", label: "Covers a week" },
      { value: "—", label: "Food cost" },
      { value: "—", label: "Months to break even" },
    ],
  },
  {
    key: "two",
    client: "Café and bakery, Madinaty",
    service: "We fix",
    challenge:
      "Open for a year, busy on the floor, losing money on the plate. Food cost was running well above where the pricing had been set.",
    did:
      "Audited food and labour first, then cut the menu by a third, renegotiated two supplier lines and rebuilt the rota around the actual trading curve rather than the one on the roster.",
    results: [
      { value: "—", label: "Food cost moved" },
      { value: "—", label: "Menu lines cut" },
      { value: "—", label: "Weeks to effect" },
    ],
  },
  {
    key: "three",
    client: "Lounge, Fifth Settlement",
    service: "We build",
    challenge:
      "A site secured before anyone had decided what it was for, with a kitchen brief that did not match the menu anybody wanted to serve.",
    did:
      "Set the concept, the positioning and the price point, reworked the kitchen layout around the real menu, and handed over an opening team structure and a launch plan.",
    results: [
      { value: "—", label: "Weeks to open" },
      { value: "—", label: "Opening team" },
      { value: "—", label: "Spend per head" },
    ],
  },
];

export interface NowItem {
  /** Only confirmed items show on the live site. */
  confirmed?: boolean;
  date: string;
  kind: "Opening" | "In build" | "Group" | "Hiring";
  title: string;
  body: string;
}

/**
 * What is happening right now.
 *
 * The two branch entries are real. The rest are PLACEHOLDER and are here to
 * show the shape of the strip. MAS should be able to add to this without a
 * developer, so it stays a plain array rather than anything clever.
 */
export const NOW: NowItem[] = [
  {
    confirmed: true,
    date: "Now open",
    kind: "Opening",
    title: "Aroma Lounge, Madinaty",
    body: "The second Aroma room, running the full kitchen, the terrace and the desk floor from morning through to close.",
  },
  {
    confirmed: true,
    date: "Now open",
    kind: "Opening",
    title: "Aroma Lounge, Mivida",
    body: "The original room. Coffee bar, feteer counter, grill and work desks, open late seven days.",
  },
  {
    date: "This quarter",
    kind: "In build",
    title: "COVY, second site",
    body: "A second evening room in build, opening to the same late kitchen and bar programme.",
  },
  {
    date: "Open now",
    kind: "Hiring",
    title: "Kitchen and floor, both branches",
    body: "Line cooks, baristas and floor team across Mivida and Madinaty. Trained in house, no agency.",
  },
];

/** The three lines each owned brand gets on the group page. */
export const BRAND_DETAIL: Record<string, string[]> = {
  aroma: [
    "Specialty coffee, a full drinks bar and a kitchen running feteer, grill and breakfast",
    "Two branches in New Cairo, open morning through to late",
    "Work desks for students, freelancers and remote teams",
  ],
  covy: [
    "Evening lounge with a late kitchen and a full bar",
    "Built for the second half of the night",
    "Private hire and events",
  ],
};
