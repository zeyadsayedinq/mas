import Reveal from "./Reveal";
import type { Brand } from "../brands";

interface AboutProps {
  brand: Brand;
  /** Aroma keeps its lockup elsewhere, so it can turn the plate off here. */
  showPlate?: boolean;
}

export default function About({ brand, showPlate = true }: AboutProps) {
  const { about, ui } = brand;

  return (
    <section
      id="about"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: ui.bg }}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            {about.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="leading-[1.0] tracking-[-0.03em] max-w-3xl" style={{ color: ui.text }}>
            <span className="block font-playfair italic text-4xl sm:text-6xl md:text-7xl">
              {about.headingItalic}
            </span>
            <span className="block text-4xl sm:text-6xl md:text-7xl tracking-[-0.05em]">
              {about.heading}
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 sm:mt-16 grid gap-8 md:grid-cols-2 md:gap-14 max-w-4xl">
          {about.body.map((para, i) => (
            <Reveal key={i} delay={0.1 + i * 0.07}>
              <p className="text-[15px] sm:text-base leading-relaxed" style={{ color: ui.textMuted }}>
                {para}
              </p>
            </Reveal>
          ))}
        </div>

        {/* The supplied lockup shown once in its real colours, on the light
            plate it was drawn for. */}
        {showPlate && brand.logo && brand.plateBg && (
          <Reveal delay={0.16}>
            <div className="mt-14 sm:mt-20 flex">
              <div
                className="rounded-2xl px-10 sm:px-16 py-10 sm:py-12 flex items-center justify-center w-full sm:w-auto"
                style={{ background: brand.plateBg }}
              >
                <img src={brand.plateLogo ?? brand.logo} alt={`${brand.name} logo`} className="h-16 sm:h-20 w-auto" />
              </div>
            </div>
          </Reveal>
        )}

        {about.facts.length > 0 && (
          <div
            className="mt-16 sm:mt-20 grid gap-px sm:grid-cols-3 rounded-lg overflow-hidden"
            style={{ background: ui.line }}
          >
            {about.facts.map((fact, i) => (
              <Reveal key={fact.label} delay={0.12 + i * 0.06}>
                <div className="h-full px-6 py-7 sm:py-9" style={{ background: ui.bgSoft }}>
                  <p className="text-[10px] uppercase tracking-[0.2em] mb-2.5" style={{ color: brand.accent }}>
                    {fact.label}
                  </p>
                  <p className="text-[15px] leading-snug" style={{ color: ui.text }}>
                    {fact.value}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
