import { Compass, ChefHat, Users, LineChart } from "lucide-react";
import Reveal from "./Reveal";
import { MANAGEMENT, type Brand } from "../brands";

const ICONS = [Compass, ChefHat, Users, LineChart];

interface ManagementProps {
  brand: Brand;
}

/**
 * The other half of the group story. Owned brands get the spotlight panels
 * above this; venues MAS runs for other owners get this.
 */
export default function Management({ brand }: ManagementProps) {
  const ui = brand.ui;

  return (
    <section
      id="management"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: ui.bg }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
                {MANAGEMENT.eyebrow}
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: ui.text }}>
                <span className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl">
                  {MANAGEMENT.headingItalic}
                </span>
                <span className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.05em]">
                  {MANAGEMENT.heading}
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 text-[15px] sm:text-base leading-relaxed max-w-md" style={{ color: ui.textMuted }}>
                {MANAGEMENT.blurb}
              </p>
            </Reveal>

            {!MANAGEMENT.showRoster && (
              <Reveal delay={0.16}>
                <p
                  className="mt-8 text-[11px] uppercase tracking-[0.18em] border-l-2 pl-4 py-1"
                  style={{ color: ui.textFaint, borderColor: brand.accent }}
                >
                  {MANAGEMENT.rosterNote}
                </p>
              </Reveal>
            )}

            <Reveal delay={0.2}>
              <button
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="mt-9 text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                style={{ background: brand.accent, color: brand.accentText }}
              >
                Talk to us about your venue
              </button>
            </Reveal>
          </div>

          <div className="grid gap-px rounded-lg overflow-hidden self-start" style={{ background: ui.line }}>
            {MANAGEMENT.services.map((service, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <Reveal key={service.title} delay={0.1 + i * 0.06}>
                  <div className="flex gap-4 px-6 sm:px-7 py-6 sm:py-7" style={{ background: ui.bgSoft }}>
                    <span className="shrink-0 mt-0.5" style={{ color: brand.accent }}>
                      <Icon size={19} />
                    </span>
                    <div>
                      <p className="text-[15px] font-medium mb-1.5" style={{ color: ui.text }}>
                        {service.title}
                      </p>
                      <p className="text-sm leading-relaxed" style={{ color: ui.textMuted }}>
                        {service.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
