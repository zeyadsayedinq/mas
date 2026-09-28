import { useEffect } from "react";
import Nav from "../components/Nav";
import CovyHero from "../components/CovyHero";
import CovyWork from "../components/CovyWork";
import CovyMenu from "../components/CovyMenu";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { BRANDS } from "../brands";
import { useSmoothCursor } from "../hooks/useSmoothCursor";

interface BrandPageProps {
  brandKey: "covy";
}

/**
 * COVY. Adapted from Aroma's "come work here" idea — wifi, power, coffee, a
 * quiet seat — but built as its own page rather than a recolour: a split
 * hero instead of a full-bleed one, a horizontal-scroll rail instead of a
 * fixed grid for the feature set, and the menu left as an honest placeholder
 * until COVY has one to publish. Colours stay COVY's own navy and mocha
 * throughout; nothing here borrows Aroma's green.
 */
export default function BrandPage({ brandKey }: BrandPageProps) {
  const brand = BRANDS[brandKey];
  const cursor = useSmoothCursor();

  useEffect(() => {
    document.title = `${brand.name} | ${brand.descriptor}`;
    window.scrollTo(0, 0);
  }, [brand]);

  return (
    <div
      className="min-h-screen tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif", background: brand.ui.bg }}
    >
      <Nav brand={brand} showParentLink />
      <CovyHero brand={brand} cursor={cursor} ctaTarget="contact" />
      <CovyWork brand={brand} />
      <CovyMenu brand={brand} />
      <About brand={brand} />
      <Contact brand={brand} defaultSubject={brand.name} />
      <Footer brand={brand} />
    </div>
  );
}
