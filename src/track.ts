import { ANALYTICS } from "./config";

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Campaign tags from the landing URL, kept for the session so every event carries them. */
function campaign(): Params {
  try {
    const saved = sessionStorage.getItem("mas-utm");
    if (saved) return JSON.parse(saved);
    const q = new URLSearchParams(window.location.search);
    const utm: Params = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
      const v = q.get(k);
      if (v) utm[k] = v;
    }
    sessionStorage.setItem("mas-utm", JSON.stringify(utm));
    return utm;
  } catch {
    return {};
  }
}

/**
 * Report an action to whichever analytics are configured. Does nothing when
 * none are, so it is safe to call anywhere.
 */
export function track(event: string, params: Params = {}) {
  const payload = { ...campaign(), ...params, page: window.location.pathname };
  window.gtag?.("event", event, payload);
  const meta: Record<string, string> = {
    reserve_submit: "Schedule",
    whatsapp_click: "Contact",
    call_click: "Contact",
    directions_click: "FindLocation",
    contact_submit: "Lead",
  };
  if (window.fbq) {
    if (meta[event]) window.fbq("track", meta[event], payload);
    else window.fbq("trackCustom", event, payload);
  }
}

/** Load GA4 and/or the Meta Pixel if their ids are set in config.ts. */
export function initAnalytics() {
  campaign();
  if (ANALYTICS.ga4) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS.ga4}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", ANALYTICS.ga4);
  }
  if (ANALYTICS.metaPixel) {
    /* Standard Meta Pixel bootstrap, trimmed. */
    if (!window.fbq) {
      const q: unknown[] = [];
      const fbq = Object.assign((...a: unknown[]) => { q.push(a); }, { queue: q, loaded: true, version: "2.0" });
      window.fbq = fbq;
      const s = document.createElement("script");
      s.async = true;
      s.src = "https://connect.facebook.net/en_US/fbevents.js";
      document.head.appendChild(s);
    }
    window.fbq!("init", ANALYTICS.metaPixel);
    window.fbq!("track", "PageView");
  }
}
