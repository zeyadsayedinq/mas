import { NightSpread } from "./FoodBevArt";
import LeafArt from "./LeafArt";
import Sparkle from "./Sparkle";
import CovyAmbient from "./CovyAmbient";
import Magnetic from "./Magnetic";
import type { Brand } from "../brands";

interface CovyHeroProps {
  brand: Brand;
  /** Brand palette values the artwork is drawn from. */
  palette: { navy: string; blue: string; mocha: string };
  /** Section id the primary button scrolls to. */
  ctaTarget: string;
}

/**
 * COVY is the evening room, so its hero is set on the brand navy, laid out as
 * a split: the headline on one side, the table on the other, on a tile of the
 * identity sheet's blue and mocha botanical. Aroma's hero is centred and white with the logo over the food;
 * this one puts the type first and the food beside it, and closes on the
 * three facts that describe the room.
 */
export default function CovyHero({ brand, palette, ctaTarget }: CovyHeroProps) {
  const ui = brand.ui;

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="top" className="relative w-full overflow-hidden" style={{ background: ui.bg }}>
      <CovyAmbient color={brand.accent} />
      <div className="mx-auto max-w-7xl min-h-[100dvh] flex flex-col">
        <div className="flex-1 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-6 lg:gap-10 px-5 sm:px-10 md:px-14 pt-28 sm:pt-32 pb-10">
          <div className="relative z-10">
            <p
              className="hero-anim hero-fade flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] mb-7"
              style={{ color: brand.accent, animationDelay: "0.05s" }}
            >
              <Sparkle size={11} color={brand.accent} />
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
              className="hero-anim hero-fade mt-9 flex flex-wrap items-center gap-3"
              style={{ animationDelay: "0.62s" }}
            >
              <Magnetic>
                <button
                  onClick={() => go(ctaTarget)}
                  className="text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ background: brand.accent, color: brand.accentText }}
                >
                  Reserve a table
                </button>
              </Magnetic>
              <button
                onClick={() => go("tonight")}
                className="text-sm font-medium px-7 py-3 rounded-full border transition-colors"
                style={{ borderColor: ui.line, color: ui.text }}
              >
                {brand.hero.cta}
              </button>
            </div>
          </div>

          {/* The table, on a tile of the identity sheet's botanical: dusty blue
              ground, mocha leaves, blue veins. */}
          <div
            className="hero-anim hero-fade relative rounded-[28px] overflow-hidden"
            style={{ animationDelay: "0.45s", background: palette.blue }}
          >
            <LeafArt mocha={palette.mocha} blue={palette.blue} className="absolute inset-0 w-full h-full covy-drift" />
            <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="covy-sweep absolute inset-y-0 -left-1/3 w-1/3" style={{ background: "linear-gradient(90deg, transparent, rgba(245,241,238,.28), transparent)" }} />
            </div>
            <div className="relative pt-32 sm:pt-44 pb-6 px-3 sm:px-6">
              <NightSpread accent={palette.mocha} shadow={palette.navy} className="w-full h-auto fb-float" />
            </div>
          </div>
        </div>

        {/* What the room is, in three lines. */}
        <div
          className="hero-anim hero-fade grid sm:grid-cols-3 mx-5 sm:mx-10 md:mx-14 mb-8 border-t"
          style={{ borderColor: ui.line, animationDelay: "0.8s" }}
        >
          {brand.about.facts.map((f, i) => (
            <div
              key={f.label}
              className={`py-5 sm:py-6 sm:px-6 first:sm:pl-0 ${i > 0 ? "sm:border-l border-t sm:border-t-0" : ""}`}
              style={{ borderColor: ui.line }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] mb-1.5 font-archivo font-semibold" style={{ color: brand.accent }}>
                {f.label}
              </p>
              <p className="text-[15px]" style={{ color: ui.text }}>
                {f.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
