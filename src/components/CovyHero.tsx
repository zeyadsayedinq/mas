import SpotlightScene from "./SpotlightScene";
import type { Brand } from "../brands";
import { SPOTLIGHT_R } from "../config";
import type { CursorPos } from "../hooks/useSmoothCursor";

interface CovyHeroProps {
  brand: Brand;
  cursor: CursorPos;
  /** Section id the primary button scrolls to. */
  ctaTarget: string;
}

/**
 * COVY's own hero shape: a true split screen rather than the full-bleed,
 * centred hero the other two brands use. Text sits in a fixed panel on one
 * side; the cursor-lit room lives in the other. Nothing overlaps, which is
 * the point — it should read as a different piece of architecture from
 * Aroma's hero and MAS's, not a recolour of either.
 */
export default function CovyHero({ brand, cursor, ctaTarget }: CovyHeroProps) {
  const ui = brand.ui;

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="top" className="relative w-full" style={{ background: ui.bg }}>
      <div className="grid lg:grid-cols-[1fr_1.1fr]">
        {/* Text panel comes first in source order on every breakpoint, so the
            light panel (not the dark scene) sits under the nav bar on
            mobile, where the two stack instead of sitting side by side. */}
        <div className="relative z-10 flex flex-col justify-center px-6 sm:px-10 md:px-14 py-20 lg:py-0 lg:h-screen">
          <p
            className="hero-anim hero-fade flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] mb-7"
            style={{ color: brand.accent, animationDelay: "0.05s" }}
          >
            <span aria-hidden className="inline-block w-2 h-2 rotate-45" style={{ background: brand.accent }} />
            Cairo · Evening lounge and late kitchen
          </p>

          <h1 className="leading-[0.95]" style={{ color: ui.text }}>
            <span
              className="hero-anim hero-reveal block font-playfair italic font-normal text-5xl sm:text-6xl md:text-7xl tracking-[-0.03em]"
              style={{ animationDelay: "0.2s" }}
            >
              {brand.hero.line1}
            </span>
            <span
              className="hero-anim hero-reveal block font-normal text-5xl sm:text-6xl md:text-7xl -mt-1 tracking-[-0.04em]"
              style={{ animationDelay: "0.36s" }}
            >
              {brand.hero.line2}
            </span>
          </h1>

          <p
            className="hero-anim hero-fade mt-7 max-w-md text-[15px] sm:text-base leading-relaxed"
            style={{ color: ui.textMuted, animationDelay: "0.5s" }}
          >
            {brand.hero.aside}
          </p>

          <div
            className="hero-anim hero-fade mt-9 flex flex-wrap items-center gap-4"
            style={{ animationDelay: "0.62s" }}
          >
            <button
              onClick={() => go(ctaTarget)}
              className="text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95"
              style={{ background: brand.accent, color: brand.accentText }}
              onMouseEnter={(e) => (e.currentTarget.style.background = brand.accentHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = brand.accent)}
            >
              {brand.hero.cta}
            </button>
            <button
              onClick={() => go("work")}
              className="text-sm font-medium px-7 py-3 rounded-full border transition-colors"
              style={{ borderColor: ui.line, color: ui.text }}
            >
              Work from here
            </button>
          </div>

          <p
            className="hero-anim hero-fade mt-10 text-xs max-w-xs leading-relaxed"
            style={{ color: ui.textFaint, animationDelay: "0.75s" }}
          >
            {brand.hero.prompt}
          </p>
        </div>

        {/* The room. Same cursor-lit cup scene as before, contained to its
            own half instead of running full-bleed behind the type. */}
        <div className="relative h-[52vh] sm:h-[60vh] lg:h-screen overflow-hidden bg-black">
          <SpotlightScene
            dim={brand.cupDim}
            lit={brand.cupLit}
            idPrefix={`hero-${brand.key}`}
            cursorX={cursor.x}
            cursorY={cursor.y}
            radius={SPOTLIGHT_R}
            baseClassName="hero-zoom"
          />
        </div>
      </div>
    </section>
  );
}
