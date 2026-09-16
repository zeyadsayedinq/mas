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
