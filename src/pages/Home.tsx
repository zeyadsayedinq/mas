import { useSleepOffscreen } from "../hooks/useSleepOffscreen";
import { useEffect, useState } from "react";
import Nav from "../components/Nav";
import MasHero from "../components/MasHero";
import MasAudience from "../components/MasAudience";
import About from "../components/About";
import MasStats from "../components/MasStats";
import MasBrands from "../components/MasBrands";
import MasServices from "../components/MasServices";
import MasProcess from "../components/MasProcess";
import MasWork from "../components/MasWork";
import MasNow from "../components/MasNow";
import Locations from "../components/Locations";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { useBrand } from "../localize";
import "../styles/mas.css";

/**
 * MAS Egypt, the group page, which is also the about page.
 *
 * A B2B page for venue owners, landlords, suppliers and partners rather than
 * diners. White and grey grounds, cocoa type, sage as the one colour. Motion is
 * kept to entrances and a single scroll-drawn line in the process section; the
 * interactive parts are the ones that help a visitor find their engagement.
 */
export default function Home() {
  useSleepOffscreen();
  const brand = useBrand("mas");

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
    <div className="mas-type min-h-screen tracking-[-0.015em] overflow-x-clip" style={{ background: brand.ui.bg }}>
      <Nav brand={brand} onLight={navOnLight} />
      <main>
        <MasHero brand={brand} />
        <MasAudience brand={brand} />
        <MasStats brand={brand} />
        <About brand={brand} showPlate={false} />
        <MasBrands parent={brand} />
        <MasServices brand={brand} />
        <MasProcess brand={brand} />
        <MasWork brand={brand} />
        <MasNow brand={brand} />
        <Locations brand={brand} />
        <Contact brand={brand} />
      </main>
      <Footer brand={brand} />
    </div>
  );
}
