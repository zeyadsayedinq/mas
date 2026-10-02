import { useSleepOffscreen } from "../hooks/useSleepOffscreen";
import { useEffect, useMemo } from "react";
import Nav from "../components/Nav";
import CovyHero from "../components/CovyHero";
import CovyTonight from "../components/CovyTonight";
import CovyEvening from "../components/CovyEvening";
import CovyWork from "../components/CovyWork";
import CovyMenu from "../components/CovyMenu";
import CovyVisit from "../components/CovyVisit";
import About from "../components/About";
import Contact from "../components/Contact";
import CovyFooter from "../components/CovyFooter";
import EveningClock from "../components/EveningClock";
import SparkleTrail from "../components/SparkleTrail";
import { useBrand } from "../localize";
import { useLang } from "../i18n";
import { BRANDS, type Brand } from "../brands";
import greigeWordmark from "../assets/brand/covy-wordmark-greige.webp";
import "../styles/covy.css";

interface BrandPageProps {
  brandKey: "covy";
}

/**
 * COVY, the evening room. Navy and greige bands alternate down the page
 * (the four colours of COVY's identity sheet and nothing else), and the page
 * keeps two dials on its root: --cv-light, the dimmer in the hero, and
 * --cv-dusk, which follows the scroll so the greige deepens a touch as the
 * evening clock runs from 19:00 to 02:00.
 *
 * The palette lives here, so the group page and COVY's card on it keep
 * using COVY's light tokens from brands.ts.
 */
const PALETTE = {
  navy: "#262D3F",
  greige: "#DCD4CF",
  mocha: "#765F4D",
  blue: "#7E98AE",
};

/**
 * Greige that takes on up to 7% navy as the evening goes on. Text on it is
 * set so body copy stays above 4.5:1 even at the deepest point.
 */
const DUSK_GREIGE = `color-mix(in srgb, ${PALETTE.greige}, ${PALETTE.navy} calc(var(--cv-dusk, 0) * 7%))`;

type Tr = (en: string, ar: string) => string;

/** Sections on the brand navy: greige type, dusty blue for the accents. */
function navyBrand(base: Brand, tr: Tr): Brand {
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
      textMuted: "rgba(220,212,207,0.78)",
      textFaint: "rgba(220,212,207,0.58)",
      line: "rgba(220,212,207,0.18)",
      onHero: PALETTE.greige,
      onHeroMuted: "rgba(220,212,207,0.78)",
    },
    accent: PALETTE.blue,
    accentHover: "#93aabd",
    accentText: PALETTE.navy,
    nav: [
      { label: tr("The room", "المكان"), target: "top" },
      { label: tr("Tonight", "الليلة"), target: "tonight" },
      { label: tr("Private evenings", "سهرات خاصة"), target: "private" },
      { label: tr("Menu", "المنيو"), target: "menu" },
      { label: tr("Visit", "الزيارة"), target: "visit" },
      { label: tr("Reserve", "احجز"), target: "contact" },
    ],
  };
}

/**
 * Sections on the brand greige: navy type, mocha for the accents. The mocha
 * is taken a shade deeper here so small labels hold 4.5:1 on greige, dusk
 * included.
 */
function greigeBrand(base: Brand): Brand {
  return {
    ...base,
    ui: {
      ...base.ui,
      scheme: "light",
      bg: DUSK_GREIGE,
      bgAlt: DUSK_GREIGE,
      bgSoft: "#E9E4E1",
      text: PALETTE.navy,
      textMuted: "rgba(38,45,63,0.8)",
      textFaint: "rgba(38,45,63,0.64)",
      line: "rgba(38,45,63,0.16)",
      onHero: PALETTE.navy,
      onHeroMuted: "rgba(38,45,63,0.8)",
    },
    accent: "#65503F",
    accentHover: "#574435",
    accentText: "#F5F1EE",
  };
}

export default function BrandPage({ brandKey }: BrandPageProps) {
  useSleepOffscreen();
  const base = useBrand(brandKey);
  const { tr } = useLang();
  const brand = useMemo(() => navyBrand(base, tr), [base, tr]);
  const day = useMemo(() => greigeBrand(base), [base]);

  useEffect(() => {
    window.scrollTo(0, 0);
    // Keep the overscroll area and the browser bar on the same navy.
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const prevMeta = meta?.content;
    const prevBg = document.body.style.background;
    document.body.style.background = PALETTE.navy;
    if (meta) meta.content = PALETTE.navy;
    return () => {
      document.body.style.background = prevBg;
      if (meta && prevMeta) meta.content = prevMeta;
    };
  }, []);

  // The three facts move up into the hero, so About keeps only the story.
  const aboutBrand = useMemo<Brand>(() => ({ ...brand, about: { ...brand.about, facts: [] } }), [brand]);

  return (
    <div data-covy-root className="cv-root covy-type min-h-screen" style={{ background: brand.ui.bg }}>
      <Nav brand={brand} showParentLink onLight />
      <main>
        <CovyHero brand={brand} palette={PALETTE} ctaTarget="contact" />
        <CovyTonight brand={day} palette={PALETTE} />
        <About brand={aboutBrand} showPlate={false} />
        <CovyEvening brand={day} />
        <CovyWork brand={brand} />
        <CovyMenu brand={day} />
        <CovyVisit brand={brand} />
        <Contact brand={day} defaultSubject={BRANDS[brandKey].name} />
      </main>
      <CovyFooter brand={brand} />
      <div aria-hidden className="cv-warmth" />
      <EveningClock />
      <SparkleTrail />
    </div>
  );
}
