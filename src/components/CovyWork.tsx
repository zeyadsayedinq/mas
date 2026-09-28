import { Wifi, Plug, Moon, Coffee, Printer, Clock, ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import type { Brand } from "../brands";

interface CovyWorkProps {
  brand: Brand;
}

const GREIGE = "#DCD4CF";

const FEATURES = [
  { icon: Wifi, title: "Wifi that holds", body: "Fibre throughout, steady enough for a call at midnight." },
  { icon: Plug, title: "Power at every seat", body: "Sockets built into the tables, not just the counter." },
  { icon: Moon, title: "Low light, low noise", body: "Booths built for focus once the room quiets down." },
  { icon: Coffee, title: "The bar stays open", body: "Coffee, tea or something stronger, whenever you need it." },
  { icon: Printer, title: "Print and scan", body: "Ask the floor team, any hour we're open." },
  { icon: Clock, title: "Stay as late as you like", body: "COVY keeps evening hours. Nobody rushes the last table." },
];

/**
 * COVY's answer to Aroma's desk section: the same underlying offer — wifi,
 * power, coffee, a quiet seat — but built as a horizontal rail rather than a
 * fixed grid, and pitched at the evening rather than the morning, which is
 * where COVY actually lives. Cards keep COVY's own navy/mocha/greige, never
 * Aroma's green.
 */
export default function CovyWork({ brand }: CovyWorkProps) {
  const ui = brand.ui;

  return (
    <section id="work" className="relative py-24 sm:py-32" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-10 md:px-14">
        <div className="grid lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-10 lg:gap-16 items-end mb-14">
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
                Work from COVY
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: ui.text }}>
                <span className="block font-playfair italic text-4xl sm:text-5xl">The quiet hours,</span>
                <span className="block text-4xl sm:text-5xl tracking-[-0.04em]">are yours to work in.</span>
              </h2>
            </Reveal>
          </div>

          <Reveal delay={0.12}>
            <div className="flex flex-col gap-6">
              <p className="text-[15px] leading-relaxed max-w-lg" style={{ color: ui.textMuted }}>
                Before the evening crowd settles in and long after most rooms
                have gone quiet, COVY keeps a corner open for people who still
                have something to finish. Full wifi, power within reach, and a
                bar that never really closes.
              </p>
              <button
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="self-start inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                style={{ background: brand.accent, color: brand.accentText }}
              >
                Reserve a corner
                <ArrowRight size={15} />
              </button>
            </div>
          </Reveal>
        </div>

        {/* A horizontal rail instead of a grid: drag or scroll sideways
            through the offer rather than scanning a fixed block of tiles. */}
        <Reveal delay={0.16}>
          <div className="relative -mx-5 sm:-mx-10 md:-mx-14 px-5 sm:px-10 md:px-14">
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar snap-x snap-mandatory">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="snap-start shrink-0 w-[240px] sm:w-[260px] rounded-2xl p-6"
                  style={{ background: ui.bgAlt, border: `1px solid ${GREIGE}` }}
                >
                  <span
                    className="inline-flex items-center justify-center h-11 w-11 rounded-full mb-5"
                    style={{ background: `${brand.accent}15`, color: brand.accent }}
                  >
                    <f.icon size={19} />
                  </span>
                  <p className="text-[15px] font-medium mb-1.5" style={{ color: ui.text }}>
                    {f.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: ui.textMuted }}>
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
            <div
              aria-hidden
              className="pointer-events-none absolute top-0 right-0 bottom-4 w-16 hidden sm:block"
              style={{ background: `linear-gradient(to right, transparent, ${ui.bg})` }}
            />
          </div>
        </Reveal>
        <p className="mt-4 text-xs" style={{ color: ui.textFaint }}>
          Scroll for the rest →
        </p>
      </div>
    </section>
  );
}
