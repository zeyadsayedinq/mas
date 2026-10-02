import { useEffect, useState } from "react";
import { CovyNightTable } from "./CovyArt";
import LeafArt from "./LeafArt";
import Sparkle from "./Sparkle";
import CovyAmbient from "./CovyAmbient";
import CovyDimmer, { DEFAULT_LIGHT, applyLight } from "./CovyDimmer";
import Magnetic from "./Magnetic";
import Kinetic from "./Kinetic";
import { useLang } from "../i18n";
import { track } from "../track";
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
 * identity sheet's blue and mocha botanical. The room has a dimmer: the range
 * on the tile (or a tap on the lamp itself) sets --cv-light for the whole
 * page, which the lamp, the stars and the candle warmth all read.
 */
export default function CovyHero({ brand, palette, ctaTarget }: CovyHeroProps) {
  const ui = brand.ui;
  const { tr } = useLang();
  const [light, setLight] = useState(DEFAULT_LIGHT);

  useEffect(() => applyLight(light), [light]);

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const lampOn = light >= 0.5;
  const toggleLamp = () => {
    const next = lampOn ? 0.12 : 0.92;
    setLight(next);
    track("dimmer", { level: Math.round(next * 100), via: "lamp" });
  };

  return (
    <section id="top" className="relative w-full overflow-hidden" style={{ background: ui.bg }}>
      <CovyAmbient color={brand.accent} />
      <div className="mx-auto max-w-7xl min-h-[100dvh] flex flex-col">
        <div className="flex-1 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] items-center gap-8 lg:gap-10 px-5 sm:px-10 md:px-14 pt-28 sm:pt-32 pb-10">
          <div className="relative z-10">
            <p
              className="hero-anim hero-fade flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] mb-7"
              style={{ color: brand.accent, animationDelay: "0.05s" }}
            >
              <Sparkle size={11} color={brand.accent} />
              {tr("Cairo · Evening lounge and late kitchen", "القاهرة · لاونج مسائي ومطبخ لآخر الليل")}
            </p>

            <h1 className="leading-[0.98]" style={{ color: ui.text }}>
              <Kinetic
                text={brand.hero.line1}
                variant="curtain"
                delay={0.15}
                stagger={0.05}
                className="block font-playfair italic font-normal text-5xl sm:text-6xl md:text-7xl tracking-[-0.03em]"
              />
              <Kinetic
                text={brand.hero.line2}
                variant="curtain"
                delay={0.4}
                stagger={0.05}
                className="block font-normal text-5xl sm:text-6xl md:text-7xl mt-1 tracking-[-0.04em]"
              />
            </h1>

            <p
              className="hero-anim hero-fade mt-7 max-w-md text-[15px] sm:text-base leading-relaxed"
              style={{ color: ui.textMuted, animationDelay: "0.6s" }}
            >
              {brand.hero.aside}
            </p>

            <div className="hero-anim hero-fade mt-9 flex flex-wrap items-center gap-3" style={{ animationDelay: "0.72s" }}>
              <Magnetic>
                <button
                  onClick={() => go(ctaTarget)}
                  className="min-h-[44px] text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ background: brand.accent, color: brand.accentText }}
                >
                  {tr("Reserve a table", "احجز طاولة")}
                </button>
              </Magnetic>
              <button
                onClick={() => go("evening")}
                className="min-h-[44px] text-sm font-medium px-7 py-3 rounded-full border transition-colors hover:bg-white/5"
                style={{ borderColor: ui.line, color: ui.text }}
              >
                {tr("Plan your evening", "خطّط لسهرتك")}
              </button>
            </div>
          </div>

          {/* The table, on a tile of the identity sheet's botanical: dusty blue
              ground, mocha leaves, blue veins. */}
          <div
            className="hero-anim hero-fade relative w-full max-w-[620px] lg:max-w-none rounded-[28px] overflow-hidden"
            style={{ animationDelay: "0.45s", background: palette.blue }}
          >
            <LeafArt mocha={palette.mocha} blue={palette.blue} className="absolute inset-0 w-full h-full covy-drift" />
            {/* The tile itself dims with the room. */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{ background: palette.navy, opacity: "calc((1 - var(--cv-light)) * 0.5)" }}
            />
            <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="covy-sweep absolute inset-y-0 -left-1/3 w-1/3" style={{ background: "linear-gradient(90deg, transparent, rgba(245,241,238,.28), transparent)" }} />
            </div>

            <CovyDimmer value={light} onChange={setLight} className="absolute z-10 top-4 inset-x-4 sm:inset-x-auto sm:end-5 sm:top-5 sm:w-[330px]" />

            <div className="relative pt-36 sm:pt-44 pb-6 px-3 sm:px-6">
              {/* Physical positions: the drawing is the same in both languages. */}
              <div className="relative fb-float" dir="ltr">
                <CovyNightTable className="block w-full h-auto" />
                <button
                  type="button"
                  onClick={toggleLamp}
                  aria-pressed={lampOn}
                  aria-label={lampOn ? tr("Turn the lamp down", "اخفض ضوء المصباح") : tr("Turn the lamp up", "ارفع ضوء المصباح")}
                  title={lampOn ? tr("Turn the lamp down", "اخفض ضوء المصباح") : tr("Turn the lamp up", "ارفع ضوء المصباح")}
                  className="cv-lampbtn absolute"
                  style={{ left: "10%", top: "30%", width: "18%", height: "48%", minWidth: 44, minHeight: 44 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* What the room is, in three lines. */}
        <div
          className="hero-anim hero-fade grid sm:grid-cols-3 mx-5 sm:mx-10 md:mx-14 mb-8 border-t"
          style={{ borderColor: ui.line, animationDelay: "0.9s" }}
        >
          {brand.about.facts.map((f, i) => (
            <div
              key={f.label}
              className={`py-5 sm:py-6 sm:px-6 sm:first:ps-0 ${i > 0 ? "sm:border-s border-t sm:border-t-0" : ""}`}
              style={{ borderColor: ui.line }}
            >
              <p className="text-[10px] uppercase tracking-[0.2em] mb-1.5 font-semibold" style={{ color: brand.accent }}>
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
