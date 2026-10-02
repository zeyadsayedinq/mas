import { useSleepOffscreen } from "../hooks/useSleepOffscreen";
import { useEffect } from "react";
import Nav from "../components/Nav";
import AromaHero from "../components/AromaHero";
import AromaHighlights from "../components/AromaHighlights";
import StickyReserve from "../components/StickyReserve";
import About from "../components/About";
import AromaStory from "../components/AromaStory";
import AromaRoulette from "../components/AromaRoulette";
import MenuExplorer from "../components/MenuExplorer";
import AromaInvite from "../components/AromaInvite";
import ScrollMarquee from "../components/ScrollMarquee";
import Desks from "../components/Desks";
import Branches from "../components/Branches";
import Reservation from "../components/Reservation";
import InstagramGrid from "../components/InstagramGrid";
import { ReelIntro, ReelSpace, ReelTable } from "../components/AromaReels";
import AromaFooter from "../components/AromaFooter";
import AromaCursor from "../components/AromaCursor";
import { useBrand } from "../localize";

/**
 * Aroma runs light and has its own structure: a live 3D still life up top,
 * one pinned scroll story through the bar, the grill and the feteer counter,
 * a slot machine for the undecided, and reserve as the main action.
 * `/aroma/madinaty` is the same page, led by the Madinaty branch.
 */
export default function AromaPage({ focus }: { focus?: "madinaty" } = {}) {
  useSleepOffscreen();
  const brand = useBrand("aroma");
  const ui = brand.ui;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="aroma-type min-h-screen tracking-[-0.01em]" style={{ background: ui.bg }}>
      <Nav brand={brand} showParentLink onLight />

      <AromaHero brand={brand} focus={focus} />
      <AromaHighlights brand={brand} />
      <ReelIntro brand={brand} />
      <About brand={brand} showPlate={false} />
      <AromaStory brand={brand} />
      <AromaRoulette brand={brand} />
      <MenuExplorer brand={brand} />
      <AromaInvite brand={brand} defaultBranch={focus ?? "madinaty"} />
      <ScrollMarquee brand={brand} />
      <ReelSpace brand={brand} />
      <Desks brand={brand} />
      <Branches brand={brand} />
      <ReelTable brand={brand} />
      <Reservation brand={brand} defaultBranch={focus ?? "madinaty"} />
      <InstagramGrid brand={brand} />
      <AromaFooter brand={brand} />
      <StickyReserve brand={brand} />
      <AromaCursor />
    </div>
  );
}
