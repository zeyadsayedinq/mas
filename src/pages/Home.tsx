import { useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import About from "../components/About";
import Brands from "../components/Brands";
import Management from "../components/Management";
import Locations from "../components/Locations";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { BRANDS } from "../brands";
import { useSmoothCursor } from "../hooks/useSmoothCursor";

/**
 * MAS Egypt, the parent. Hero, about, the owned brands, the venues it runs for
 * other owners, where to find everything, then contact.
 */
export default function Home() {
  const brand = BRANDS.mas;
  const cursor = useSmoothCursor();

  useEffect(() => {
    document.title = `${brand.name} | ${brand.descriptor}`;
  }, [brand]);

  return (
    <div
      className="min-h-screen tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif", background: brand.ui.bg }}
    >
      <Nav brand={brand} />
      <Hero brand={brand} cursor={cursor} ctaTarget="brands" />
      <About brand={brand} />
      <Brands parent={brand} cursor={cursor} />
      <Management brand={brand} />
      <Locations brand={brand} />
      <Contact brand={brand} />
      <Footer brand={brand} />
    </div>
  );
}
