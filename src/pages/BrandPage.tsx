import { useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { BRANDS, type BrandKey } from "../brands";
import { useSmoothCursor } from "../hooks/useSmoothCursor";

interface BrandPageProps {
  brandKey: Extract<BrandKey, "aroma" | "covy">;
}

/**
 * Aroma Lounge and COVY run through this one component. Same layout and same
 * motion as the parent page, different tokens and different copy.
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
      style={{ fontFamily: "'Inter', sans-serif", background: brand.cupDim.bgBot }}
    >
      <Nav brand={brand} showParentLink />
      <Hero brand={brand} cursor={cursor} ctaTarget="about" />
      <About brand={brand} />
      <Contact brand={brand} defaultSubject={brand.name} />
      <Footer brand={brand} />
    </div>
  );
}
