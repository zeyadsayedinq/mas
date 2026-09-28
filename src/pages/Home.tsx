import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import MasHero from "../components/MasHero";
import About from "../components/About";
import MasStats from "../components/MasStats";
import MasBrands from "../components/MasBrands";
import MasServices from "../components/MasServices";
import MasWork from "../components/MasWork";
import MasNow from "../components/MasNow";
import Locations from "../components/Locations";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { BRANDS } from "../brands";

/**
 * MAS Egypt, the group page.
 *
 * This is a B2B page: it speaks to venue owners, partners and suppliers rather
 * than to diners, so it runs the group's own restrained scheme: cream and kraft
 * grounds, cocoa type, and copper spent only on the marks, the rules and the
 * active states. It carries none of
 * the cursor and canvas work the two consumer pages use; its one interactive
 * element is the What we do selector, which is there because a landlord with an
 * empty room and an owner losing money on the plate arrive wanting different
 * things and neither should have to read the other's section.
 *
 * The home page is the about page.
 */
export default function Home() {
  const brand = BRANDS.mas;

  // The services section inverts onto the dark ground, so the fixed nav has to
  // reverse while it is under it.
  const [navOnLight, setNavOnLight] = useState(true);

  useEffect(() => {
    document.title = `${brand.name} | ${brand.descriptor}`;
  }, [brand]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = document.getElementById("services");
        if (!el) return;
        const r = el.getBoundingClientRect();
        setNavOnLight(!(r.top <= 72 && r.bottom >= 72));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="mas-type min-h-screen tracking-[-0.015em]"
      style={{ background: brand.ui.bg }}
    >
      <Nav brand={brand} onLight={navOnLight} />
      <MasHero brand={brand} />
      <MasStats brand={brand} />
      <About brand={brand} showPlate={false} />
      <MasBrands parent={brand} />
      <MasServices brand={brand} />
      <MasWork brand={brand} />
      <MasNow brand={brand} />
      <Locations brand={brand} />
      <Contact brand={brand} />
      <Footer brand={brand} />
    </div>
  );
}
