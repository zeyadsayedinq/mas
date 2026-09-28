import { ArrowRight } from "lucide-react";
import { buttonColors, type Brand } from "../brands";

interface MasHeroProps {
  brand: Brand;
}

/**
 * The group opener. No cursor spotlight, no canvas, no zoom.
 *
 * This page sells to venue owners, landlords, suppliers and investors, not to
 * diners, so it states what the group is and gets out of the way. The only
 * motion is the entrance fade the rest of the site already uses.
 *
 * The stone sits behind the headline at low opacity. The manual keeps the
 * wordmark and the stone out of the same lockup, and this is not a lockup: it
 * is a ground, set well outside the mark's clear space.
 */
export default function MasHero({ brand }: MasHeroProps) {
  const ui = brand.ui;

  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="top" className="relative overflow-hidden px-5 sm:px-10 md:px-14" style={{ background: ui.bg }}>
      {/* A quiet green wash in the corner, the freshest touch on an otherwise
          restrained white ground. Kept faint enough to read as light rather
          than as a colour block. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full"
        style={{ background: `radial-gradient(circle, ${brand.accent}1a 0%, transparent 70%)` }}
      />

      {/* the stone, as a ground rather than a mark */}
      {brand.mark && (
        /* The fade lives on the wrapper. Putting it on the image would let the
           animation's own opacity override the tint and print the stone solid. */
        <div
          aria-hidden
          className="hero-anim hero-fade pointer-events-none absolute -right-24 sm:-right-10 top-28 sm:top-32"
          style={{ animationDelay: "0.55s" }}
        >
          <img src={brand.mark} alt="" className="h-[300px] sm:h-[420px] md:h-[500px] w-auto" style={{ opacity: 0.055 }} />
        </div>
      )}

      <div className="relative mx-auto max-w-6xl pt-32 sm:pt-44 pb-20 sm:pb-28">
        <p
          className="hero-anim hero-fade flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] mb-8"
          style={{ color: brand.accent, animationDelay: "0.05s" }}
        >
          <span aria-hidden className="inline-block w-2 h-2 rotate-45" style={{ background: brand.accent }} />
          Cairo · Food and beverage group
        </p>

        <h1
          className="hero-anim hero-fade max-w-4xl text-[3rem] sm:text-7xl md:text-[5.5rem] font-semibold leading-[0.95] tracking-[-0.05em]"
          style={{ color: ui.text, animationDelay: "0.14s" }}
        >
          {brand.hero.line1}
          <br />
          <span style={{ color: ui.textFaint }}>{brand.hero.line2}</span>
        </h1>

        <p
          className="hero-anim hero-fade mt-8 max-w-xl text-[16px] sm:text-[17px] leading-relaxed"
          style={{ color: ui.textMuted, animationDelay: "0.24s" }}
        >
          {brand.hero.aside}
        </p>

        <div className="hero-anim hero-fade mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.32s" }}>
          <button
            onClick={() => go("services")}
            className="inline-flex items-center gap-2 text-sm font-semibold px-7 py-3.5 rounded-full transition-transform hover:scale-[1.02]"
            style={buttonColors(brand)}
          >
            {brand.hero.cta}
            <ArrowRight size={15} />
          </button>
          <button
            onClick={() => go("brands")}
            className="text-sm font-semibold px-7 py-3.5 rounded-full border transition-colors"
            style={{ borderColor: ui.line, color: ui.text }}
          >
            Our brands
          </button>
        </div>
      </div>

    </section>
  );
}
