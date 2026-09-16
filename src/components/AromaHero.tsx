import CupArt from "./CupArt";
import { OpenNowBadge } from "./Branches";
import { BRANCHES } from "../branches";
import type { Brand } from "../brands";

interface AromaHeroProps {
  brand: Brand;
}

/**
 * Aroma is the daytime brand, so its hero runs light and skips the cursor
 * spotlight that MAS and COVY use. Same type scale, same entrance animations,
 * opposite surface. The room is already lit here, which is the point.
 */
export default function AromaHero({ brand }: AromaHeroProps) {
  const ui = brand.ui;
  const day = brand.cupDay ?? brand.cupLit;

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden h-screen"
      style={{ height: "100dvh", background: ui.bg }}
    >
      <div className="absolute inset-0 z-10 hero-zoom">
        <CupArt variant="lit" palette={day} idPrefix="aroma-day" className="absolute inset-0 w-full h-full" />
      </div>

      {/* Softens the top of the scene so the nav and headline stay readable. */}
      <div
        className="absolute inset-x-0 top-0 h-2/5 z-20 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, ${ui.bg}, transparent)` }}
      />

      <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
        <h1 className="leading-[0.95]" style={{ color: ui.onHero }}>
          <span
            className="hero-anim hero-reveal block font-playfair italic font-normal text-[2.6rem] sm:text-7xl md:text-8xl"
            style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
          >
            {brand.hero.line1}
          </span>
          <span
            className="hero-anim hero-reveal block font-normal text-[2rem] sm:text-5xl md:text-6xl -mt-1 sm:mt-1"
            style={{ letterSpacing: "-0.05em", animationDelay: "0.42s" }}
          >
            {brand.hero.line2}
          </span>
        </h1>

        <div
          className="hero-anim hero-fade mt-6 flex flex-wrap items-center justify-center gap-2"
          style={{ animationDelay: "0.6s" }}
        >
          {["Lavazza coffee", "Feteer", "Grill", "Shisha", "Work desks"].map((t) => (
            <span
              key={t}
              className="text-[11px] sm:text-xs font-medium px-3.5 py-1.5 rounded-full backdrop-blur-sm"
              style={{ background: "rgba(255,255,255,0.72)", color: ui.text, border: `1px solid ${ui.line}` }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div
        className="hero-anim hero-fade hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[270px] z-50"
        style={{ animationDelay: "0.7s" }}
      >
        <p className="text-sm leading-relaxed" style={{ color: ui.onHeroMuted }}>
          {brand.hero.aside}
        </p>
        <div className="mt-4">
          <OpenNowBadge branch={BRANCHES[0]} brand={brand} />
        </div>
      </div>

      <div
        className="hero-anim hero-fade absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 sm:max-w-none flex flex-col items-start sm:items-end gap-4 z-50"
        style={{ animationDelay: "0.85s" }}
      >
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => go("reserve")}
            className="text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
            style={{ background: brand.accent, color: brand.accentText }}
          >
            Reserve a table
          </button>
          <button
            onClick={() => go("menu")}
            className="text-sm font-medium px-7 py-3 rounded-full border transition-colors"
            style={{ borderColor: ui.line, color: ui.text, background: "rgba(255,255,255,0.6)" }}
          >
            {brand.hero.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
