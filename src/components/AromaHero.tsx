import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import FoodBevArt from "./FoodBevArt";
import Kinetic from "./Kinetic";
import Magnetic from "./Magnetic";
import { Hero3D } from "./Aroma3D";
import { OpenNowBadge } from "./Branches";
import { STAGE_OF, goToStage } from "./AromaStory";
import { BRANCHES } from "../branches";
import { branchLive } from "../localize";
import { useLang } from "../i18n";
import { track } from "../track";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Brand } from "../brands";
import type { Kind } from "../three/models";
import "../styles/aroma-3d.css";

interface AromaHeroProps {
  brand: Brand;
  focus?: "madinaty";
}

/**
 * Aroma is the daytime brand, so its hero runs on plain white: the logo, the
 * still life of what the bar and kitchen actually serve, and the two actions.
 * Every piece in the still life is live: tap one and it hops, says what it is,
 * and takes you to its part of the story below.
 */
export default function AromaHero({ brand, focus }: AromaHeroProps) {
  const ui = brand.ui;
  const { tr } = useLang();
  const compact = useMediaQuery("(max-width: 1023px)");
  const [chip, setChip] = useState<{ id: number; text: string; x: number; y: number } | null>(null);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const names: Record<Kind, string> = {
    iced: tr("Iced coffee", "آيس كوفي"),
    cup: tr("Coffee", "قهوة"),
    juice: tr("Fresh juice", "عصير فريش"),
    steak: tr("Rib eye", "ريب آي"),
    feteer: tr("Feteer", "فطير"),
  };

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const onPick = (k: Kind, at: { x: number; y: number }) => {
    track("hero_pick", { item: k });
    setChip({ id: Date.now(), text: names[k], x: at.x, y: at.y });
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => goToStage(STAGE_OF[k] ?? 0), 700);
  };

  const madinaty = BRANCHES.find((b) => b.key === "madinaty");
  const badgeBranch = (focus && BRANCHES.find((b) => b.key === focus)) || BRANCHES.find((b) => b.key === "madinaty") || BRANCHES[0];
  const showBadge = branchLive(badgeBranch, "hours");
  const aside =
    focus === "madinaty"
      ? tr(
          `Our Madinaty branch: family friendly, a terrace with shisha, coffee, grill and feteer all day${madinaty?.rating ? `, and ${madinaty.rating} on Google` : ""}.`,
          `فرعنا في مدينتي: مناسب للعائلات، وتراس فيه شيشة، وقهوة ومشويات وفطير طول اليوم${madinaty?.rating ? `، و${madinaty.rating} على جوجل` : ""}.`,
        )
      : brand.hero.aside;

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh", minHeight: 620, background: "#FFFFFF" }}
    >
      {/* the faintest green lift under the food, so it does not float on nothing */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(60% 42% at 50% 72%, ${brand.accent}14 0%, #FFFFFF 70%)` }}
      />

      <div className="relative z-10 h-full flex flex-col items-center px-5 sm:px-10 md:px-14 pt-[88px] sm:pt-24 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-[max(2.25rem,env(safe-area-inset-bottom))]">
        <h1 className="sr-only">{brand.name}</h1>
        <img
          src={brand.logo}
          alt=""
          aria-hidden
          className="hero-anim hero-reveal shrink-0 h-[72px] sm:h-28 md:h-32 w-auto max-w-[80vw]"
          style={{ animationDelay: "0.25s" }}
        />
        <p className="shrink-0 mt-2 text-[11px] sm:text-xs uppercase tracking-[0.22em] font-semibold" style={{ color: ui.textFaint }}>
          <Kinetic text={brand.descriptor} variant="curtain" delay={0.6} stagger={0.08} />
        </p>
        {focus === "madinaty" && (
          <p
            className="hero-anim hero-fade shrink-0 mt-3 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold"
            style={{ animationDelay: "0.9s", background: `${brand.accent}1a`, color: ui.text, border: `1px solid ${brand.accent}40` }}
          >
            <span aria-hidden className="aro-pill-dot w-2 h-2 rounded-full" style={{ background: brand.accent }} />
            {tr("Now in Madinaty", "الآن في مدينتي")}
          </p>
        )}

        <div
          className="hero-anim hero-fade relative flex-1 min-h-0 w-full max-w-[1280px] mt-1 sm:mt-2 flex items-center justify-center [&>div]:h-full"
          style={{ animationDelay: "0.5s" }}
          data-cursor={tr("Tap", "دوس")}
        >
          <Hero3D
            accent={brand.accent}
            onPick={onPick}
            labels={names}
            label={tr(
              "Iced coffee, coffee, feteer, a rib eye steak and fresh juice. Tap one to jump to it.",
              "آيس كوفي وقهوة وفطير وستيك ريب آي وعصير فريش. دوس على أي واحد عشان تروحله.",
            )}
            fallback={<FoodBevArt accent={brand.accent} compact={compact} className="w-full h-auto max-h-full" />}
          />
          {chip && (
            <span
              key={chip.id}
              aria-hidden
              className="aro-pickchip inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold shadow-lg"
              style={{ left: chip.x, top: chip.y, background: brand.accent, color: brand.accentText }}
            >
              {chip.text}
              <ArrowRight size={14} className="rtl:-scale-x-100" />
            </span>
          )}
          <p
            aria-hidden
            className="aro-taphint font-playfair pointer-events-none absolute top-[2%] end-[4%] sm:end-[8%] text-[19px] sm:text-[22px]"
            style={{ color: brand.accent }}
          >
            {tr("tap a plate", "دوس على أي طبق")} ↓
          </p>
        </div>

        {/* keyboard route into the story, visible on focus */}
        <div className="sr-only focus-within:not-sr-only focus-within:flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <button key={i} type="button" onClick={() => goToStage(i)} className="text-sm underline px-2 py-1" style={{ color: ui.text }}>
              {[tr("Jump to drinks", "روح للمشروبات"), tr("Jump to the grill", "روح للمشويات"), tr("Jump to feteer", "روح للفطير")][i]}
            </button>
          ))}
        </div>

        <div
          className="hero-anim hero-fade shrink-0 w-full max-w-6xl mt-3 sm:mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="hidden sm:block max-w-[300px]">
            <p className="text-sm leading-relaxed" style={{ color: ui.onHeroMuted }}>
              {aside}
            </p>
            {showBadge && (
              <div className="mt-3">
                <OpenNowBadge branch={badgeBranch} brand={brand} />
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            <Magnetic>
              <button
                onClick={() => go("reserve")}
                className="flex-1 sm:flex-none text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                style={{ background: brand.accent, color: brand.accentText }}
              >
                {tr("Reserve a table", "احجز ترابيزة")}
              </button>
            </Magnetic>
            <button
              onClick={() => go("menu")}
              className="flex-1 sm:flex-none text-sm font-medium px-7 py-3 rounded-full border transition-colors"
              style={{ borderColor: `${brand.accent}88`, color: ui.text, background: "#FFFFFF" }}
            >
              {brand.hero.cta}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
