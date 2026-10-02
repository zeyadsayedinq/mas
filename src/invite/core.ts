/**
 * Invitations: a card someone builds on the site and sends to someone else.
 *
 * The link carries only the choices (mood, time, day, two first names), never
 * free text for the card itself, so a link can not be used to put arbitrary
 * words on a branded card. It travels in the URL fragment, which browsers do
 * not send to the server.
 */
export interface InviteData {
  /** brand */
  b: "covy" | "aroma";
  /** what kind of occasion: a key the brand's card writer understands */
  m: string;
  /** guests */
  g?: number;
  /** time, e.g. "21:00" or "late" */
  a?: string;
  /** day, YYYY-MM-DD */
  d?: string;
  /** branch key (Aroma) */
  br?: string;
  /** who it is for, and who it is from */
  to?: string;
  from?: string;
}

const clean = (s: unknown, max = 24) =>
  typeof s === "string" ? s.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max) : undefined;

export function encodeInvite(d: InviteData): string {
  const json = JSON.stringify(d);
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((x) => (bin += String.fromCharCode(x)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeInvite(raw: string): InviteData | null {
  try {
    const b64 = raw.replace(/-/g, "+").replace(/_/g, "/");
    const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
    const o = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
    if (!o || (o.b !== "covy" && o.b !== "aroma") || typeof o.m !== "string") return null;
    const g = Number(o.g);
    return {
      b: o.b,
      m: clean(o.m, 16)!,
      g: Number.isFinite(g) ? Math.max(1, Math.min(20, Math.round(g))) : undefined,
      a: clean(o.a, 8),
      d: /^\d{4}-\d{2}-\d{2}$/.test(o.d) ? o.d : undefined,
      br: clean(o.br, 16),
      to: clean(o.to),
      from: clean(o.from),
    };
  } catch {
    return null;
  }
}

/** The invitation in the current address, if there is one for this brand. */
export function readInvite(brand: InviteData["b"]): InviteData | null {
  const m = /[#&]invite=([\w-]+)/.exec(window.location.hash);
  const d = m ? decodeInvite(m[1]) : null;
  return d && d.b === brand ? d : null;
}

export function inviteUrl(d: InviteData): string {
  return `${window.location.origin}${window.location.pathname}#invite=${encodeInvite(d)}`;
}

/* ------------------------------------------------------------------ dates */

export const isoDay = (offset = 0) => {
  const t = new Date();
  t.setDate(t.getDate() + offset);
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
};

/** "Friday 9 October", or "Tonight" / "Tomorrow" when it is. */
export function dayLabel(iso: string | undefined, ar: boolean, evening = true): string {
  if (!iso) return "";
  if (iso === isoDay(0)) return ar ? (evening ? "الليلة" : "النهارده") : evening ? "Tonight" : "Today";
  if (iso === isoDay(1)) return ar ? "بكرة" : "Tomorrow";
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(ar ? "ar-EG-u-nu-latn" : "en-GB", { weekday: "long", day: "numeric", month: "long" }).format(new Date(y, m - 1, d));
}

/* ----------------------------------------------------------------- canvas */

export const CARD_W = 1080;
export const CARD_H = 1350;

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((ok, fail) => {
    const im = new Image();
    im.decoding = "async";
    im.onload = () => ok(im);
    im.onerror = fail;
    im.src = src;
  });
}

/** Make sure the faces the card is set in are actually loaded before drawing. */
export async function fontsReady(specs: string[], sample: string) {
  if (!document.fonts?.load) return;
  await Promise.all(specs.map((s) => document.fonts.load(s, sample).catch(() => [])));
}

export function roundRect(x: CanvasRenderingContext2D, l: number, t: number, w: number, h: number, r: number) {
  x.beginPath();
  x.moveTo(l + r, t);
  x.arcTo(l + w, t, l + w, t + h, r);
  x.arcTo(l + w, t + h, l, t + h, r);
  x.arcTo(l, t + h, l, t, r);
  x.arcTo(l, t, l + w, t, r);
  x.closePath();
}

/** The four-point star, centred, radius r. */
export function star(x: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  const k = r / 12;
  x.save();
  x.translate(cx, cy);
  x.scale(k, k);
  x.fill(new Path2D("M0,-12C.9,-4.8 4.8,-.9 12,0C4.8,.9 .9,4.8 0,12C-.9,4.8 -4.8,.9 -12,0C-4.8,-.9 -.9,-4.8 0,-12Z"));
  x.restore();
}

export function spaced(x: CanvasRenderingContext2D, px: number) {
  (x as unknown as { letterSpacing: string }).letterSpacing = `${px}px`;
}

/** Break text into lines no wider than `max`. */
export function wrap(x: CanvasRenderingContext2D, text: string, max: number): string[] {
  const out: string[] = [];
  let line = "";
  for (const w of text.split(/\s+/)) {
    const next = line ? `${line} ${w}` : w;
    if (line && x.measureText(next).width > max) {
      out.push(line);
      line = w;
    } else line = next;
  }
  if (line) out.push(line);
  return out;
}

/** Draw centred, wrapped text and return the y after the last line. */
export function paragraph(x: CanvasRenderingContext2D, text: string, cx: number, y: number, max: number, lh: number): number {
  for (const l of wrap(x, text, max)) {
    x.fillText(l, cx, y);
    y += lh;
  }
  return y;
}

export const canvasBlob = (c: HTMLCanvasElement) =>
  new Promise<Blob>((ok, fail) => c.toBlob((b) => (b ? ok(b) : fail(new Error("no image"))), "image/png"));

/* ------------------------------------------------------------------ share */

/** Can this device hand an image to its own share sheet (WhatsApp, Instagram, Messages, Snapchat...)? */
export function canShareImage(): boolean {
  try {
    const f = new File([new Blob(["x"], { type: "image/png" })], "x.png", { type: "image/png" });
    return !!navigator.canShare && navigator.canShare({ files: [f] });
  } catch {
    return false;
  }
}

/** Open the device's share sheet with the card image. Resolves false if the person backed out. */
export async function shareImage(blob: Blob, name: string, text: string, url: string): Promise<boolean> {
  const file = new File([blob], name, { type: "image/png" });
  try {
    await navigator.share({ files: [file], text: `${text}\n${url}` });
    return true;
  } catch {
    return false;
  }
}

export function saveImage(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

export const whatsappLink = (text: string, url: string) => `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;

export async function copyText(s: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(s);
    return true;
  } catch {
    return false;
  }
}
