import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { lazy, Suspense, useLayoutEffect, useRef, useState } from "react";

// Each page is its own bundle, so the group page never downloads Aroma's
// menu or COVY's art, and the other way round.
const Home = lazy(() => import("./pages/Home"));
const AromaPage = lazy(() => import("./pages/AromaPage"));
const BrandPage = lazy(() => import("./pages/BrandPage"));
import { LangProvider, basePath, type Lang } from "./i18n";
import { usePageMeta } from "./hooks/usePageMeta";

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

function Shell({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  usePageMeta();
  return (
    <LangProvider lang={lang}>
      <Suspense fallback={<div className="min-h-screen" />}>{children}</Suspense>
    </LangProvider>
  );
}

const routes = (lang: Lang, prefix: string) => [
  <Route key={`${lang}-home`} path={prefix || "/"} element={<Shell lang={lang}><Home /></Shell>} />,
  <Route key={`${lang}-aroma`} path={`${prefix}/aroma`} element={<Shell lang={lang}><AromaPage /></Shell>} />,
  <Route key={`${lang}-madinaty`} path={`${prefix}/aroma/madinaty`} element={<Shell lang={lang}><AromaPage focus="madinaty" /></Shell>} />,
  <Route key={`${lang}-covy`} path={`${prefix}/covy`} element={<Shell lang={lang}><BrandPage brandKey="covy" /></Shell>} />,
];

export default function App() {
  return (
    <BrowserRouter>
      <RouteCurtain />
      <Routes>
        {routes("en", "")}
        {routes("ar", "/ar")}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
