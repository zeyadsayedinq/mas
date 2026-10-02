import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageFor, jsonLd } from "../seo";
import { SITE_URL } from "../config";

function setMeta(attr: "name" | "property", key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = value;
}
function setLink(rel: string, href: string, extra?: Record<string, string>) {
  const sel = `link[rel="${rel}"]${extra?.hreflang ? `[hreflang="${extra.hreflang}"]` : ""}`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (extra) for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  el.href = href;
}

/**
 * Keeps the head in step with in-app navigation. The first load already has
 * the right tags baked in by the build (see vite.config.ts); this covers
 * moving between pages without a reload.
 */
export function usePageMeta() {
  const { pathname } = useLocation();
  useEffect(() => {
    const p = pageFor(pathname);
    const site = SITE_URL || window.location.origin;
    document.title = p.title;
    setMeta("name", "description", p.description);
    setMeta("property", "og:title", p.title);
    setMeta("property", "og:description", p.description);
    setMeta("property", "og:image", site + p.image);
    setMeta("property", "og:url", site + p.path);
    setMeta("property", "og:locale", p.lang === "ar" ? "ar_EG" : "en_US");
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "theme-color", p.themeColor);
    setLink("icon", p.icon);
    setLink("canonical", site + p.path);
    let ld = document.getElementById("ld-json") as HTMLScriptElement | null;
    if (!ld) {
      ld = document.createElement("script");
      ld.type = "application/ld+json";
      ld.id = "ld-json";
      document.head.appendChild(ld);
    }
    ld.textContent = JSON.stringify(jsonLd(p, site));
  }, [pathname]);
}
