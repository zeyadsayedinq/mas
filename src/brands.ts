/**
 * One config drives all three pages.
 *
 * MAS Egypt is the parent. Aroma Lounge and COVY sit under it.
 * All three share the same layout, type and motion. Only these tokens change.
 *
 * MAS and COVY are dark. Aroma is the daytime brand, so it runs light. Same
 * system, inverted palette, which is why every component reads its colours
 * from `ui` rather than hardcoding white.
 *
 * Colours come from the MAS palette:
 *   3E2723 espresso   A1663A caramel   D9C3A5 sand
 *   F5EFE6 cream      4F6F52 sage
 */

import masLogo from "./assets/brand/mas-wordmark-cream.svg";
import masPlateLogo from "./assets/brand/mas-wordmark-cocoa.svg";
import masMark from "./assets/brand/mas-stone-cream.svg";
import aromaLogo from "./assets/brand/aroma-logo.png";
import aromaMark from "./assets/brand/aroma-icon.png";
import covyLogo from "./assets/brand/covy-wordmark.png";
import covyMark from "./assets/brand/covy-mark.png";

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
  mark?: string;
  plateLogo?: string;
  plateBg?: string;

  ui: UiTokens;

  accent: string;
  accentHover: string;
  accentText: string;

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

const DARK_UI = (bg: string, bgAlt: string, bgSoft: string): UiTokens => ({
  scheme: "dark",
  bg,
  bgAlt,
  bgSoft,
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.68)",
  textFaint: "rgba(255,255,255,0.42)",
  line: "rgba(255,255,255,0.12)",
  onHero: "#ffffff",
  onHeroMuted: "rgba(255,255,255,0.8)",
});

const MAS: Brand = {
  key: "mas",
  path: "/",
  name: "MAS Egypt",
  nameAr: "ماس مصر",
  descriptor: "Food and beverage group",

  logo: masLogo,
  mark: masMark,
  plateLogo: masPlateLogo,
  plateBg: "#D9C3A5",

  ui: DARK_UI("#0b0807", "#141010", "#1c1512"),

  accent: "#A1663A",
  accentHover: "#8a5530",
  accentText: "#F5EFE6",

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
    { label: "Group", target: "top" },
    { label: "About", target: "about" },
    { label: "Brands", target: "brands" },
    { label: "Management", target: "management" },
    { label: "Contact", target: "contact" },
  ],
  navCta: "Work with us",

  hero: {
    line1: "We build places",
    line2: "people come back to.",
    aside:
      "MAS Egypt owns and operates restaurants, lounges and cafés, and runs venues for owners who would rather hand the floor to someone who does this properly.",
    prompt:
      "Move your cursor across the room. Every space we run starts dark and empty, then somebody makes it warm.",
    cta: "See our brands",
  },

  about: {
    eyebrow: "About",
    headingItalic: "One group,",
    heading: "two ways in.",
    body: [
      "MAS Egypt is a food and beverage group. We own and run our own brands, and we operate venues for people who own the room but not the expertise to run it.",
      "The group works across restaurants, lounges and cafés. Different rooms, different crowds, the same standards behind the pass. Sourcing we can defend, service that does not need a script, and a kitchen that runs the same whether or not anyone is watching.",
      "Two brands sit under the group today. Alongside them we manage venues that carry someone else's name, on the same operating standard as our own.",
    ],
    facts: [
      { label: "Owned brands", value: "Aroma Lounge and COVY" },
      { label: "Managed venues", value: "Run for third party owners" },
      { label: "Formats", value: "Restaurants, lounges and cafés" },
    ],
  },

  contact: {
    eyebrow: "Contact",
    headingItalic: "Tell us",
    heading: "what you need.",
    blurb:
      "Bookings, management enquiries, partnerships, supply or press. It reaches the group office either way.",
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
    bg: "#FAF6EF",
    bgAlt: "#F2EBDF",
    bgSoft: "#FFFFFF",
    text: "#23301A",
    textMuted: "rgba(35,48,26,0.70)",
    textFaint: "rgba(35,48,26,0.45)",
    line: "rgba(35,48,26,0.14)",
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
      "Lavazza on the bar, a grill and a feteer counter in the kitchen, shisha on the terrace, and tables built for people who came to work.",
    prompt: "",
    cta: "See the menu",
  },

  about: {
    eyebrow: "About Aroma Lounge",
    headingItalic: "Open early,",
    heading: "useful all day.",
    body: [
      "Aroma Lounge is the daytime room in the group. Lavazza coffee on the bar, a kitchen that runs feteer and grill side by side, and a terrace where the shisha lives.",
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

  ui: DARK_UI("#0d111a", "#141926", "#1a2030"),

  // Sampled from the supplied assets: navy #262D3F, greige #DCD4CF, mocha #765F4D.
  accent: "#DCD4CF",
  accentHover: "#c6bdb6",
  accentText: "#262D3F",

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
