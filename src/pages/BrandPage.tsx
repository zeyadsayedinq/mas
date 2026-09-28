import { useEffect, useMemo } from "react";
import Nav from "../components/Nav";
import CovyHero from "../components/CovyHero";
import CovyTonight from "../components/CovyTonight";
import CovyWork from "../components/CovyWork";
import CovyMenu from "../components/CovyMenu";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { BRANDS, type Brand } from "../brands";
import greigeWordmark from "../assets/brand/covy-wordmark-greige.png";

interface BrandPageProps {
  brandKey: "covy";
}

/**
 * COVY, the evening room. It covers the same ground as Aroma (the room, the
 * bar, the kitchen, somewhere to work, the menu, a way to book) but is
 * dressed and ordered differently: the four colours from COVY's identity sheet
 * (navy, greige, mocha and dusty blue) alternating in bands instead of Aroma's
 * white and green, a split hero instead of a centred one,
 * a row of three cards instead of three pinned scenes, and the work section
 * ahead of the menu.
 *
 * The palette lives here, so the group page and COVY's card on it keep
 * using COVY's light tokens from brands.ts.
 */
/** The four colours on COVY's identity sheet. Nothing else is introduced. */
const PALETTE = {
  navy: "#262D3F",
  greige: "#DCD4CF",
  mocha: "#765F4D",
  blue: "#7E98AE",
};

/** Sections on the brand navy: greige type, dusty blue for the accents. */
function navyBrand(base: Brand): Brand {
  return {
    ...base,
    logoReversed: greigeWordmark,
    ui: {
      ...base.ui,
      scheme: "dark",
      bg: PALETTE.navy,
      bgAlt: "#2F3649",
      bgSoft: "#343C50",
      text: PALETTE.greige,
      textMuted: "rgba(220,212,207,0.76)",
      textFaint: "rgba(220,212,207,0.5)",
      line: "rgba(220,212,207,0.18)",
      onHero: PALETTE.greige,
      onHeroMuted: "rgba(220,212,207,0.76)",
    },
    accent: PALETTE.blue,
    accentHover: "#93aabd",
    accentText: PALETTE.navy,
    nav: [
      { label: "The room", target: "top" },
      { label: "Tonight", target: "tonight" },
      { label: "Work here", target: "work" },
      { label: "Menu", target: "menu" },
      { label: "Reserve", target: "contact" },
    ],
  };
}

/** Sections on the brand greige: navy type, mocha for the accents. */
function greigeBrand(base: Brand): Brand {
  return {
    ...base,
    ui: {
      ...base.ui,
      scheme: "light",
      bg: PALETTE.greige,
      bgAlt: PALETTE.greige,
      bgSoft: "#E9E4E1",
      text: PALETTE.navy,
      textMuted: "rgba(38,45,63,0.74)",
      textFaint: "rgba(38,45,63,0.52)",
      line: "rgba(38,45,63,0.16)",
      onHero: PALETTE.navy,
      onHeroMuted: "rgba(38,45,63,0.74)",
    },
    accent: PALETTE.mocha,
    accentHover: "#5f4c3e",
    accentText: "#F5F1EE",
  };
}

export default function BrandPage({ brandKey }: BrandPageProps) {
  const brand = useMemo(() => navyBrand(BRANDS[brandKey]), [brandKey]);
  const day = useMemo(() => greigeBrand(BRANDS[brandKey]), [brandKey]);

  useEffect(() => {
    document.title = `${brand.name} | ${brand.descriptor}`;
    window.scrollTo(0, 0);
    // Keep the overscroll area and the browser bar on the same navy.
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const prevMeta = meta?.content;
    const prevBg = document.body.style.background;
    document.body.style.background = brand.ui.bg;
    if (meta) meta.content = brand.ui.bg;
    return () => {
      document.body.style.background = prevBg;
      if (meta && prevMeta) meta.content = prevMeta;
    };
  }, [brand]);

  // The three facts move up into the hero, so About keeps only the story.
  const aboutBrand = useMemo<Brand>(() => ({ ...brand, about: { ...brand.about, facts: [] } }), [brand]);

  return (
    <div
      className="min-h-screen tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif", background: brand.ui.bg }}
    >
      <Nav brand={brand} showParentLink onLight />
      <CovyHero brand={brand} palette={PALETTE} ctaTarget="contact" />
      <CovyTonight brand={day} palette={PALETTE} />
      <About brand={aboutBrand} showPlate={false} />
      <CovyWork brand={day} />
      <CovyMenu brand={brand} />
      <Contact brand={day} defaultSubject={brand.name} />
      <Footer brand={brand} />
    </div>
  );
}
