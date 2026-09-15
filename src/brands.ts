/**
 * One config drives all three pages.
 *
 * MAS Egypt is the parent. Aroma Lounge and COVY sit under it.
 * All three share the same layout, type and motion. Only these tokens change.
 *
 * Colours come from the MAS palette:
 *   3E2723 espresso   A1663A caramel   D9C3A5 sand
 *   F5EFE6 cream      4F6F52 sage
 */

import aromaLogo from "./assets/brand/aroma-logo.png";
import aromaMark from "./assets/brand/aroma-icon.png";
import covyLogo from "./assets/brand/covy-wordmark.png";
import covyMark from "./assets/brand/covy-mark.png";

export type BrandKey = "mas" | "aroma" | "covy";

/** Colours for the unlit cup, the state the page rests in. */
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

/** Colours for the lit cup, revealed inside the cursor spotlight. */
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

export interface Brand {
  key: BrandKey;
  /** Route this brand lives at. */
  path: string;
  name: string;
  nameAr: string;
  /** Short line under the wordmark in the footer. */
  descriptor: string;

  /**
   * The supplied lockup, used as designed and never recoloured. MAS has no
   * supplied logo of its own yet, so it falls back to the cup mark.
   */
  logo?: string;
  /** Icon only, for tight spaces. */
  mark?: string;
  /**
   * The light plate the lockup is designed to sit on. The dark pages show the
   * logo reversed to white; wherever the real colours matter, it goes on this.
   */
  plateBg?: string;

  /** Button and accent colour. */
  accent: string;
  accentHover: string;
  /** Text colour that sits on the accent. */
  accentText: string;

  cupDim: CupDimPalette;
  cupLit: CupLitPalette;

  /** Nav links. `target` is the id of a section on the same page. */
  nav: { label: string; target: string }[];
  /** Label on the primary nav button, which jumps to the contact form. */
  navCta: string;

  hero: {
    /** Rendered in Playfair Display italic. */
    line1: string;
    /** Rendered in Inter. */
    line2: string;
    /** Bottom left, hidden on small screens. */
    aside: string;
    /** Bottom right, above the button. */
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
}

const MAS: Brand = {
  key: "mas",
  path: "/",
  name: "MAS Egypt",
  nameAr: "ماس مصر",
  descriptor: "Food and beverage group",

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
    { label: "Contact", target: "contact" },
  ],
  navCta: "Work with us",

  hero: {
    line1: "We build places",
    line2: "people come back to.",
    aside:
      "MAS Egypt owns and operates restaurants, lounges and cafés. Two brands under one roof, run to the same standard by the same people.",
    prompt:
      "Move your cursor across the room. Every space we run starts dark and empty, then somebody makes it warm.",
    cta: "See our brands",
  },

  about: {
    eyebrow: "About",
    headingItalic: "One group,",
    heading: "two front doors.",
    body: [
      "MAS Egypt is a food and beverage group. We own the places we run, which means we are there for the slow Tuesday afternoon as well as the full Thursday night.",
      "The group works across restaurants, lounges and cafés. Different rooms, different crowds, the same standards behind the pass. Sourcing we can defend, service that does not need a script, and a kitchen that runs the same whether or not anyone is watching.",
      "Two brands sit under the group today. Each has its own room and its own regulars. Both answer to the same house.",
    ],
    facts: [
      { label: "Two brands", value: "Aroma Lounge and COVY" },
      { label: "Full service", value: "Restaurants, lounges and cafés" },
      { label: "Owned and run", value: "We operate what we own" },
    ],
  },

  contact: {
    eyebrow: "Contact",
    headingItalic: "Tell us",
    heading: "what you need.",
    blurb:
      "Bookings, partnerships, supply, press or a question about one of the brands. It reaches the group office either way.",
  },
};

const AROMA: Brand = {
  key: "aroma",
  path: "/aroma",
  name: "Aroma Lounge",
  nameAr: "أروما لاونج",
  descriptor: "Specialty coffee and bakery",

  logo: aromaLogo,
  mark: aromaMark,
  plateBg: "#F5EFE6",

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

  nav: [
    { label: "The room", target: "top" },
    { label: "About", target: "about" },
    { label: "Visit", target: "contact" },
  ],
  navCta: "Reserve a table",

  hero: {
    line1: "Slow mornings,",
    line2: "start with coffee.",
    aside:
      "Every cup is pulled to order, from single origin beans roasted in small batches and brewed the same careful way, morning after morning.",
    prompt:
      "Move your cursor across the cup to see how we get every pour right, from bean to your table.",
    cta: "See the menu",
  },

  about: {
    eyebrow: "About Aroma Lounge",
    headingItalic: "Coffee first,",
    heading: "everything else after.",
    body: [
      "Aroma Lounge is the daytime room in the group. Specialty coffee, a bakery counter that starts before the doors open, and enough space to sit for three hours without anyone looking at your table.",
      "Beans are roasted in small batches so nothing sits long enough to go flat. The bar runs on the same recipe every shift, which is less romantic than it sounds and the only reason a flat white tastes the same in March and in August.",
    ],
    facts: [
      { label: "Roast", value: "Small batch, single origin" },
      { label: "Kitchen", value: "Bakery from early morning" },
      { label: "Room", value: "Built to sit in, not pass through" },
    ],
  },

  contact: {
    eyebrow: "Visit",
    headingItalic: "Book a table",
    heading: "or just ask.",
    blurb:
      "Reservations, large groups, beans by the bag, or a question about what is on the bar this week.",
  },
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
};

export const BRANDS: Record<BrandKey, Brand> = {
  mas: MAS,
  aroma: AROMA,
  covy: COVY,
};

/** The two brands that sit under the group, in the order they appear. */
export const CHILD_BRANDS: Brand[] = [AROMA, COVY];
