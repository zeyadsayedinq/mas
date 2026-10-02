import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";

export type Lang = "en" | "ar";

const LangContext = createContext<Lang>("en");

/**
 * The language comes from the URL: `/ar`, `/ar/aroma`, `/ar/covy` are the
 * Arabic pages, everything else is English. That keeps each version linkable
 * and indexable on its own rather than hidden behind a toggle.
 */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);
  return <LangContext.Provider value={lang}>{children}</LangContext.Provider>;
}

/** Strip the `/ar` prefix, so a path can be re-prefixed for either language. */
export function basePath(pathname: string): string {
  if (pathname === "/ar") return "/";
  return pathname.startsWith("/ar/") ? pathname.slice(3) : pathname;
}

export function useLang() {
  const lang = useContext(LangContext);
  return useMemo(() => {
    const ar = lang === "ar";
    return {
      lang,
      ar,
      dir: (ar ? "rtl" : "ltr") as "rtl" | "ltr",
      /** Pick the string for the current language. */
      tr: (en: string, arabic: string) => (ar ? arabic : en),
      /** Prefix an internal path for the current language. */
      href: (path: string) => (ar ? (path === "/" ? "/ar" : `/ar${path}`) : path),
      /** The same page in the other language. */
      swap: (pathname: string) => {
        const base = basePath(pathname);
        return ar ? base : base === "/" ? "/ar" : `/ar${base}`;
      },
      /** Western digits read fine in Egyptian Arabic UI; keep them. */
      num: (n: number | string) => String(n),
    };
  }, [lang]);
}
