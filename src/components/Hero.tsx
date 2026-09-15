import SpotlightScene from "./SpotlightScene";
import type { Brand } from "../brands";
import { SPOTLIGHT_R } from "../config";
import type { CursorPos } from "../hooks/useSmoothCursor";

interface HeroProps {
  brand: Brand;
  cursor: CursorPos;
  /** Section id the hero button scrolls to. */
  ctaTarget: string;
}

export default function Hero({ brand, cursor, ctaTarget }: HeroProps) {
  const go = () =>
    document
      .getElementById(ctaTarget)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section
      id="top"
      className="relative w-full overflow-hidden h-screen bg-black"
      style={{ height: "100dvh" }}
    >
      <div className="absolute inset-0 z-10">
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

      <div className="absolute top-[14%] left-0 right-0 z-50 flex flex-col items-center text-center px-5 pointer-events-none">
        <h1 className="text-white leading-[0.95]">
          <span
            className="hero-anim hero-reveal block font-playfair italic font-normal text-5xl sm:text-7xl md:text-8xl"
            style={{ letterSpacing: "-0.05em", animationDelay: "0.25s" }}
          >
            {brand.hero.line1}
          </span>
          <span
            className="hero-anim hero-reveal block font-normal text-5xl sm:text-7xl md:text-8xl -mt-1"
            style={{ letterSpacing: "-0.08em", animationDelay: "0.42s" }}
          >
            {brand.hero.line2}
          </span>
        </h1>
      </div>

      <div
        className="hero-anim hero-fade hidden sm:block absolute bottom-14 left-10 md:left-14 max-w-[260px] z-50"
        style={{ animationDelay: "0.7s" }}
      >
        <p className="text-sm text-white/80 leading-relaxed">{brand.hero.aside}</p>
      </div>

      <div
        className="hero-anim hero-fade absolute bottom-10 sm:bottom-24 left-5 right-5 sm:left-auto sm:right-10 md:right-14 max-w-full sm:max-w-[260px] flex flex-col items-start gap-4 sm:gap-5 z-50"
        style={{ animationDelay: "0.85s" }}
      >
        <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
          {brand.hero.prompt}
        </p>
        <button
          onClick={go}
          className="text-sm font-medium px-7 py-3 rounded-full transition-all hover:scale-[1.03] active:scale-95 hover:shadow-lg pointer-events-auto"
          style={{
            background: brand.accent,
            color: brand.accentText,
            boxShadow: "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = brand.accentHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = brand.accent;
          }}
        >
          {brand.hero.cta}
        </button>
      </div>
    </section>
  );
}
