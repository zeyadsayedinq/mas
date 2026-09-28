import { useEffect } from "react";
import { Coffee, Leaf, Croissant, Flame, Clock, Users, Beef, ChefHat } from "lucide-react";
import Nav from "../components/Nav";
import AromaHero from "../components/AromaHero";
import AromaHighlights from "../components/AromaHighlights";
import StickyReserve from "../components/StickyReserve";
import ScrollShowcase from "../components/ScrollShowcase";
import { CoffeeCup, Feteer, Ribeye } from "../components/ProductArt";
import { Model3D } from "../components/Aroma3D";
import About from "../components/About";
import MenuExplorer from "../components/MenuExplorer";
import Desks from "../components/Desks";
import Branches from "../components/Branches";
import Reservation from "../components/Reservation";
import InstagramGrid from "../components/InstagramGrid";
import Contact from "../components/Contact";
import { ReelIntro, ReelSpace, ReelTable } from "../components/AromaReels";
import AromaFooter from "../components/AromaFooter";
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

  useEffect(() => {
    document.title = `${brand.name} | ${brand.descriptor}`;
    window.scrollTo(0, 0);
  }, [brand]);

  // The bar and the grill used to run on a dark ground. Aroma is the daytime
  // room, so they now sit on clean white with a whisper of the brand green.
  const dark = {
    bg: "#FFFFFF",
    text: ui.text,
    textMuted: ui.textMuted,
    pillBg: "rgba(255,255,255,0.9)",
    cardBg: "#FFFFFF",
    line: ui.line,
  };

  return (
    <div
      className="aroma-type min-h-screen tracking-[-0.01em]"
      style={{ background: ui.bg }}
    >
      <Nav brand={brand} showParentLink onLight />

      <AromaHero brand={brand} />
      <AromaHighlights brand={brand} />
      <ReelIntro brand={brand} />

      <About brand={brand} showPlate={false} />

      {/* The bar: coffee, but also everything else poured here. Dark ground so
          the glass carries the section. */}
      <div id="showcase-coffee">
        <ScrollShowcase
          headingItalic="Beverage,"
          heading="poured to order."
          {...dark}
          accent={brand.accent}
          accentText={brand.accentText}
          items={pick("beverages", "hot")}
          menuLabel="See the full drinks list"
          features={[
            { label: "Espresso bar, beans ground per cup", corner: "tl", icon: <Coffee size={18} /> },
            { label: "Fresh juice, smoothies and mojitos", corner: "tr", icon: <Leaf size={18} /> },
            { label: "Tea, matcha, frappe and milkshakes", corner: "bl", icon: <Clock size={18} /> },
            { label: "Hot or iced, from open to close", corner: "br", icon: <Users size={18} /> },
          ]}
        >
          <Model3D kind="iced" accent={brand.accent} label="Iced coffee, turning as you scroll" fallback={<CoffeeCup accent={brand.accent} className="w-full h-auto" />} />
        </ScrollShowcase>
      </div>

      {/* The grill, which is the half of the kitchen the coffee hides. */}
      <div id="showcase-grill">
        <ScrollShowcase
          headingItalic="Food,"
          heading="off the grill."
          {...dark}
          bg={ui.bgAlt}
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
          <Model3D kind="steak" accent={brand.accent} label="Grilled steak, turning as you scroll" fallback={<Ribeye accent={brand.accent} className="w-full h-auto" />} />
        </ScrollShowcase>
      </div>

      {/* Feteer, on white. */}
      <div id="showcase-feteer">
      <ScrollShowcase
        headingItalic="Feteer & Pizza,"
        heading="made to order."
        bg="#FFFFFF"
        text={ui.text}
        textMuted={ui.textMuted}
        accent={brand.accent}
        accentText={brand.accentText}
        pillBg="rgba(255,255,255,0.9)"
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
        <Model3D kind="feteer" accent={brand.accent} label="Feteer, turning as you scroll" fallback={<Feteer accent={brand.accent} className="w-full h-auto" />} />
      </ScrollShowcase>
      </div>

      <MenuExplorer brand={brand} />
      <ReelSpace brand={brand} />
      <Desks brand={brand} />
      <Branches brand={brand} />
      <ReelTable brand={brand} />
      <Reservation brand={brand} />
      <InstagramGrid brand={brand} />
      <Contact brand={brand} defaultSubject={brand.name} />
      <AromaFooter brand={brand} />
      <StickyReserve brand={brand} />
    </div>
  );
}
