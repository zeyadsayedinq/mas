/**
 * Everything that needs filling in before launch lives in this file.
 */

/**
 * PASTE YOUR FORMSPREE ENDPOINT HERE.
 *
 * 1. Create a free account at https://formspree.io
 * 2. Make a new form. Formspree gives you a URL like:
 *      https://formspree.io/f/xdorwkgy
 * 3. Replace the empty string below with that full URL.
 *
 * Until this is filled in, the contact form still validates and shows its
 * success state, and logs the payload it would have sent to the console.
 */
export const FORMSPREE_ENDPOINT = "";

/**
 * PLACEHOLDER CONTACT DETAILS for the group. Replace before launch.
 * Branch level phone numbers live in `src/branches.ts`.
 */
export const CONTACT_DETAILS = {
  email: "hello@masegypt.com",
  phone: "+20 000 000 0000",
  address: "Cairo, Egypt",
};

/* ---------------------------------------------------------------------------
   LAUNCH SAFETY

   Anything not yet confirmed by MAS is kept off the live site, so nobody is
   shown a made-up phone number, opening hours or statistic. Replace a value,
   then flip its flag to true and it appears.

   SHOW_PLACEHOLDERS = true shows everything, placeholders included, which is
   useful for reviewing layout. Keep it false for anything public.
--------------------------------------------------------------------------- */
export const SHOW_PLACEHOLDERS = false;

export const CONFIRMED = {
  /** Group email and phone above. */
  email: false,
  phone: false,
  /** GROUP_STATS in brands.ts (2018 / 04 / 140 / 18h). */
  groupStats: false,
  /** CASE_STUDIES in brands.ts. */
  caseStudies: false,
};

/** True when a value may be shown on the site. */
export const live = (confirmed: boolean) => SHOW_PLACEHOLDERS || confirmed;

/**
 * The public address of the site, e.g. "https://masegypt.com", used for share
 * previews and search. Netlify and Vercel builds fill it in automatically;
 * set it here if you host somewhere else.
 */
export const SITE_URL = "";

/**
 * Analytics. Paste a GA4 measurement id ("G-XXXXXXX") and/or a Meta Pixel id
 * and the site starts reporting reservation, WhatsApp, directions and menu
 * clicks. Empty means nothing is loaded.
 */
export const ANALYTICS = { ga4: "", metaPixel: "" };

/** The Aroma branch the site leads with. Madinaty is the growth priority. */
export const DEFAULT_BRANCH = "madinaty";

/**
 * COVY's venue details. Nothing here is known yet, so the visit section shows
 * "details coming soon" until these are filled in and confirmed.
 */
export const COVY_VENUE = {
  area: "",
  areaAr: "",
  address: "",
  addressAr: "",
  /** e.g. "19:00" to "02:00". */
  open: "",
  close: "",
  phone: "",
  /** International format, digits only. */
  whatsapp: "",
  /** What to search for on Google Maps, e.g. "COVY Lounge New Cairo". */
  mapQuery: "",
  confirmed: false,
};

/**
 * PLACEHOLDER SOCIAL HANDLES. Put the real ones in without the @ and the links
 * appear in the nav and footer. Leave a value empty and that link is hidden.
 */
export const SOCIAL = {
  mas: { instagram: "" },
  aroma: { instagram: "" },
  covy: { instagram: "" },
};

/** Radius of the cursor spotlight on the dark pages, in pixels. */
export const SPOTLIGHT_R = 260;

/** Radius of the smaller spotlight used on the brand split panels. */
export const PANEL_SPOTLIGHT_R = 300;

/**
 * The reservation form is a front end mockup. Nothing is stored.
 *
 * On submit it shows a confirmation with a reference code, and hands off to
 * WhatsApp with the booking prefilled, which is how most people in Cairo
 * actually confirm a table. Wire it to a real booking system later by
 * replacing the submit handler in `src/components/Reservation.tsx`.
 */
export const RESERVATION = {
  /** Slots offered, in 24h. */
  slots: [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
  ],
  maxPartySize: 12,
  /** How many days ahead the date picker offers. */
  daysAhead: 14,
};
