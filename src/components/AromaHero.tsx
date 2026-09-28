import FoodBevArt from "./FoodBevArt";
import { Hero3D } from "./Aroma3D";
import { OpenNowBadge } from "./Branches";
import { BRANCHES } from "../branches";
import { useMediaQuery } from "../hooks/useMediaQuery";
import type { Brand } from "../brands";

interface AromaHeroProps {
  brand: Brand;
}

/**
 * Aroma is the daytime brand, so its hero runs on plain white. The logo is
 * drawn in two greens and a grey, and it only reads properly on a clean
 * ground, so nothing tinted sits behind it. The picture underneath is what
 * the kitchen and the bar actually serve: coffee, feteer, grill and juice.
 *
 * Laid out as a column (logo, picture, actions) rather than absolutely placed
 * pieces, so it holds together from a phone to an iPad in either orientation.
 */
export default function AromaHero({ brand }: AromaHeroProps) {
  const ui = brand.ui;
  const compact = useMediaQuery("(max-width: 1023px)");

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

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

      <div className="relative z-10 h-full flex flex-col items-center px-5 sm:px-10 md:px-14 pt-20 sm:pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-[max(2.25rem,env(safe-area-inset-bottom))]">
        <h1 className="sr-only">{brand.name}</h1>
        <img
          src={brand.logo}
          alt={brand.name}
          className="hero-anim hero-reveal shrink-0 h-24 sm:h-28 md:h-32 w-auto max-w-[80vw]"
          style={{ animationDelay: "0.25s" }}
        />

        <div
          className="hero-anim hero-fade flex-1 min-h-0 w-full max-w-[1280px] mt-2 flex items-center justify-center [&>div]:h-full"
          style={{ animationDelay: "0.5s" }}
        >
          <Hero3D
            accent={brand.accent}
            onPick={(k) => go(k === "steak" ? "showcase-grill" : k === "feteer" ? "showcase-feteer" : "showcase-coffee")}
            fallback={<FoodBevArt accent={brand.accent} compact={compact} className="w-full h-auto max-h-full" />}
          />
        </div>

        <div
          className="hero-anim hero-fade shrink-0 w-full max-w-6xl mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-8"
          style={{ animationDelay: "0.8s" }}
        >
          <div className="hidden sm:block max-w-[270px]">
            <p className="text-sm leading-relaxed" style={{ color: ui.onHeroMuted }}>
              {brand.hero.aside}
            </p>
            <div className="mt-3">
              <OpenNowBadge branch={BRANCHES[0]} brand={brand} />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3">
            <button
              onClick={() => go("reserve")}
              className="flex-1 sm:flex-none text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
              style={{ background: brand.accent, color: brand.accentText }}
            >
              Reserve a table
            </button>
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
