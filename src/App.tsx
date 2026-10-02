import { navigate, useLocation } from "./router";
import { lazy, Suspense, use, useLayoutEffect, useRef, useState } from "react";

// Each page is its own bundle, so the group page never downloads Aroma's
// menu or COVY's art, and the other way round.
const Home = lazy(() => import("./pages/Home"));
const AromaPage = lazy(() => import("./pages/AromaPage"));
const BrandPage = lazy(() => import("./pages/BrandPage"));
import { LangProvider, basePath, type Lang } from "./i18n";
import { usePageMeta } from "./hooks/usePageMeta";
import { ensureArabic } from "./ar";

/** Brand colour for the curtain that crosses between pages. */
const CURTAIN: Record<string, string> = { "/": "#3E2723", "/aroma": "#82A541", "/covy": "#262D3F" };

/**
 * A short wipe in the destination brand's colour whenever you move between
 * the group and a brand, so crossing from one world into another reads as a
 * moment rather than a reload.
 */
function RouteCurtain() {
  const { pathname } = useLocation();
  const first = useRef(true);
  const [run, setRun] = useState<{ key: number; color: string } | null>(null);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const base = basePath(pathname);
    const color = CURTAIN[base.startsWith("/aroma") ? "/aroma" : base.startsWith("/covy") ? "/covy" : "/"];
    setRun({ key: Date.now(), color });
    const t = setTimeout(() => setRun(null), 900);
    return () => clearTimeout(t);
  }, [pathname]);
  if (!run) return null;
  return <div key={run.key} aria-hidden className="route-curtain" style={{ background: run.color }} />;
}

/** Holds an Arabic page back until its copy has arrived. English never waits. */
function ArabicGate({ lang, menu, children }: { lang: Lang; menu: boolean; children: React.ReactNode }) {
  const waiting = lang === "ar" ? ensureArabic(menu) : null;
  if (waiting) use(waiting);
  return <>{children}</>;
}

function Shell({ lang, menu = false, children }: { lang: Lang; menu?: boolean; children: React.ReactNode }) {
  usePageMeta();
  return (
    <LangProvider lang={lang}>
      <Suspense fallback={<div className="min-h-screen" />}>
        <ArabicGate lang={lang} menu={menu}>{children}</ArabicGate>
      </Suspense>
    </LangProvider>
  );
}

/** Every address the site answers to. Anything else goes back to the group page. */
function Page({ path }: { path: string }) {
  const lang: Lang = path === "/ar" || path.startsWith("/ar/") ? "ar" : "en";
  const base = basePath(path);
  if (base === "/") return <Shell key={lang} lang={lang}><Home /></Shell>;
  if (base === "/aroma") return <Shell key={lang} lang={lang} menu><AromaPage /></Shell>;
  if (base === "/aroma/madinaty") return <Shell key={lang} lang={lang} menu><AromaPage focus="madinaty" /></Shell>;
  if (base === "/covy") return <Shell key={lang} lang={lang}><BrandPage brandKey="covy" /></Shell>;
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const known = ["/", "/aroma", "/aroma/madinaty", "/covy"].includes(basePath(pathname));
  useLayoutEffect(() => {
    if (!known) navigate("/", { replace: true });
  }, [known]);
  return (
    <>
      <RouteCurtain />
      <Page path={pathname} />
    </>
  );
}
