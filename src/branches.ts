/**
 * Aroma Lounge branches.
 *
 * PLACEHOLDERS TO REPLACE: `address`, `hours`, `phone` and `whatsapp` are
 * stand-ins. Everything else comes from the live Google listings. Ratings go
 * stale, so either refresh them when you update the site or drop `rating` and
 * `reviews` from a branch and the card will hide that row.
 *
 * `x` and `y` are positions on the stylised map, 0 to 100, not coordinates.
 * Madinaty sits north east of Mivida, which is what the map shows.
 */

export interface DayHours {
  /** 24h, e.g. "09:00". */
  open: string;
  /** 24h. A value smaller than `open` means it closes after midnight. */
  close: string;
}

export interface Branch {
  key: string;
  name: string;
  area: string;
  address: string;
  /** Index 0 is Sunday, matching Date.getDay(). */
  hours: DayHours[];
  phone: string;
  /** International format, digits only, for the WhatsApp deep link. */
  whatsapp: string;
  priceRange: string;
  rating?: number;
  reviews?: string;
  tags: string[];
  /** Position on the stylised map, 0 to 100. */
  x: number;
  y: number;
}

const ALL_WEEK = (open: string, close: string): DayHours[] =>
  Array.from({ length: 7 }, () => ({ open, close }));

export const BRANCHES: Branch[] = [
  {
    key: "mivida",
    name: "Aroma Lounge Mivida",
    area: "New Cairo 1",
    address: "Mivida Boulevard, New Cairo 1", // PLACEHOLDER
    hours: ALL_WEEK("08:00", "02:00"), // PLACEHOLDER
    phone: "+20 000 000 0000", // PLACEHOLDER
    whatsapp: "200000000000", // PLACEHOLDER
    priceRange: "EGP 200 to 1,200",
    rating: 4.7,
    reviews: "1.5K",
    tags: ["Restaurant", "Terrace", "Shisha", "Desks"],
    x: 30,
    y: 64,
  },
  {
    key: "madinaty",
    name: "Aroma Lounge Madinaty",
    area: "Second New Cairo",
    address: "Madinaty, Second New Cairo", // PLACEHOLDER
    hours: ALL_WEEK("09:00", "01:00"), // PLACEHOLDER
    phone: "+20 000 000 0000", // PLACEHOLDER
    whatsapp: "200000000000", // PLACEHOLDER
    priceRange: "EGP 400 to 600",
    rating: 4.9,
    reviews: "80",
    tags: ["Family friendly", "Terrace", "Shisha"],
    x: 71,
    y: 33,
  },
];

export function mapsUrl(branch: Branch): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    branch.name,
  )}`;
}

export function whatsappUrl(branch: Branch, message: string): string {
  return `https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(message)}`;
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export interface OpenState {
  open: boolean;
  /** "Closes at 2:00" or "Opens at 8:00". */
  label: string;
}

/**
 * Whether a branch is open right now, in the visitor's own clock. Handles a
 * close time after midnight, which most of these have.
 */
export function openState(branch: Branch, now = new Date()): OpenState {
  const day = now.getDay();
  const mins = now.getHours() * 60 + now.getMinutes();

  const today = branch.hours[day];
  const yesterday = branch.hours[(day + 6) % 7];

  const fmt = (hhmm: string) => {
    const [h, m] = hhmm.split(":").map(Number);
    const suffix = h < 12 ? "am" : "pm";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return m === 0 ? `${hour12}${suffix}` : `${hour12}:${String(m).padStart(2, "0")}${suffix}`;
  };

  // Yesterday's session may still be running if it closed after midnight.
  const yOpen = toMinutes(yesterday.open);
  const yClose = toMinutes(yesterday.close);
  if (yClose < yOpen && mins < yClose) {
    return { open: true, label: `Closes at ${fmt(yesterday.close)}` };
  }

  const tOpen = toMinutes(today.open);
  const tClose = toMinutes(today.close);
  const closesTomorrow = tClose < tOpen;

  if (mins < tOpen) {
    return { open: false, label: `Opens at ${fmt(today.open)}` };
  }
  if (closesTomorrow || mins < tClose) {
    return { open: true, label: `Closes at ${fmt(today.close)}` };
  }
  return { open: false, label: `Opens at ${fmt(branch.hours[(day + 1) % 7].open)}` };
}
