import { useEffect, useState } from "react";
import { Coffee, Leaf, Croissant, Flame, Clock, Users, Beef, ChefHat } from "lucide-react";
import Nav from "../components/Nav";
import AromaHero from "../components/AromaHero";
import ScrollShowcase from "../components/ScrollShowcase";
import { CoffeeCup, Feteer, Ribeye } from "../components/ProductArt";
import About from "../components/About";
import MenuExplorer from "../components/MenuExplorer";
import Desks from "../components/Desks";
import Branches from "../components/Branches";
import Reservation from "../components/Reservation";
import InstagramGrid from "../components/InstagramGrid";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { BRANDS } from "../brands";
import { MENU } from "../menu";

/** Pull real items out of the menu so the showcase cards never drift from it. */
function pick(sectionKey: string, categoryKey: string, count = 4) {
  const section = MENU.find((s) => s.key === sectionKey);
  const category = section?.categories.find((c) => c.key === categoryKey);
  return category?.items.slice(0, count) ?? [];
}

/**
 * Aroma runs light and has its own structure. No cursor spotlight, three
 * pinned product showcases instead, and reserve rather than contact as the
 * main action. Same design system with the surface inverted.
 */
export default function AromaPage() {
  const brand = BRANDS.aroma;
  const ui = brand.ui;
  const [navOnLight, setNavOnLight] = useState(true);

  useEffect(() => {
    document.title = `${brand.name} | ${brand.descriptor}`;
    window.scrollTo(0, 0);
  }, [brand]);

  // The coffee and grill showcases run on a dark ground, so the fixed nav has
  // to flip to its reversed treatment while either is behind it.
  useEffect(() => {
    const onScroll = () => {
      const dark = ["showcase-coffee", "showcase-grill"]
        .map((id) => document.getElementById(id))
        .filter(Boolean) as HTMLElement[];
      const overDark = dark.some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= 80 && r.bottom >= 80;
      });
      setNavOnLight(!overDark);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = {
    bg: "#1a1512",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.82)",
    pillBg: "rgba(255,255,255,0.1)",
    cardBg: "rgba(32,26,22,0.97)",
    line: "rgba(255,255,255,0.18)",
  };

  return (
    <div
      className="min-h-screen tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif", background: ui.bg }}
    >
      <Nav brand={brand} showParentLink onLight={navOnLight} />

      <AromaHero brand={brand} />

      <About brand={brand} showPlate={false} />

      {/* Lavazza, on a dark ground so the cup carries the section. */}
      <div id="showcase-coffee">
        <ScrollShowcase
          headingItalic="Lavazza,"
          heading="pulled to order."
          {...dark}
          accent={brand.accent}
          accentText={brand.accentText}
          items={pick("beverages", "hot")}
          menuLabel="See all drinks"
          features={[
            { label: "Lavazza beans, ground per cup", corner: "tl", icon: <Coffee size={18} /> },
            { label: "Hot, iced, matcha and frappe", corner: "tr", icon: <Leaf size={18} /> },
            { label: "Same recipe every shift", corner: "bl", icon: <Clock size={18} /> },
            { label: "Served from open to close", corner: "br", icon: <Users size={18} /> },
          ]}
        >
          <CoffeeCup accent={brand.accent} className="w-full h-auto" />
        </ScrollShowcase>
      </div>

      {/* The grill, which is the half of the kitchen the coffee hides. */}
      <div id="showcase-grill">
        <ScrollShowcase
          headingItalic="Rib eye,"
          heading="off the grill."
          {...dark}
          accent={brand.accent}
          accentText={brand.accentText}
          items={pick("food", "main-course")}
          menuLabel="See the main course"
          features={[
            { label: "Premium Angus rib eye and brisket", corner: "tl", icon: <Beef size={18} /> },
            { label: "Fillet, osso buco and stroganoff", corner: "tr", icon: <ChefHat size={18} /> },
            { label: "Grilled to order", corner: "bl", icon: <Flame size={18} /> },
            { label: "Chicken, salmon and seafood too", corner: "br", icon: <Users size={18} /> },
          ]}
        >
          <Ribeye accent={brand.accent} className="w-full h-auto" />
        </ScrollShowcase>
      </div>

      {/* Feteer, back on the light ground. */}
      <ScrollShowcase
        headingItalic="Feteer,"
        heading="made to order."
        bg={ui.bgAlt}
        text={ui.text}
        textMuted={ui.textMuted}
        accent={brand.accent}
        accentText={brand.accentText}
        pillBg="rgba(255,255,255,0.75)"
        cardBg="#FFFFFF"
        line={ui.line}
        items={pick("food", "feteer")}
        menuLabel="See all feteer"
        features={[
          { label: "Layered and folded by hand", corner: "tl", icon: <Croissant size={18} /> },
          { label: "Sweet or savoury", corner: "tr", icon: <Leaf size={18} /> },
          { label: "Straight from the oven", corner: "bl", icon: <Flame size={18} /> },
          { label: "Cut to share", corner: "br", icon: <Users size={18} /> },
        ]}
      >
        <Feteer accent={brand.accent} className="w-full h-auto" />
      </ScrollShowcase>

      <MenuExplorer brand={brand} />
      <Desks brand={brand} />
      <Branches brand={brand} />
      <Reservation brand={brand} />
      <InstagramGrid brand={brand} />
      <Contact brand={brand} defaultSubject={brand.name} />
      <Footer brand={brand} />
    </div>
  );
}
