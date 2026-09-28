import { Wifi, Plug, Volume2, Clock, Coffee, Printer } from "lucide-react";
import Reveal from "./Reveal";
import type { Brand } from "../brands";

interface DesksProps {
  brand: Brand;
}

/**
 * A palette local to this section: white with a soft green lift, and the
 * brand's light green for the icons and the one action (the button).
 */
const MORNING = {
  bg: "linear-gradient(180deg, #FFFFFF 0%, #FBFCF8 60%, #F6F9EF 100%)",
  glow1: "radial-gradient(circle, rgba(130,165,65,0.10) 0%, rgba(130,165,65,0) 70%)",
  glow2: "radial-gradient(circle, rgba(130,165,65,0.14) 0%, rgba(130,165,65,0) 70%)",
  text: "#23301A",
  textMuted: "rgba(35,48,26,0.70)",
  cardBg: "#FFFFFF",
  cardBorder: "rgba(35,48,26,0.10)",
  cardShadow: "0 12px 34px -18px rgba(35,48,26,0.22)",
  amber: "#82A541",
  amberSoft: "rgba(130,165,65,0.14)",
  sage: "#82A541",
  sageHover: "#6c8a35",
};

const FEATURES = [
  { icon: Wifi, title: "Wifi that holds", body: "Fibre on both floors, so a morning deadline never waits on a spinner." },
  { icon: Plug, title: "Power at the table", body: "A socket at every seat, so nobody is hunting for a wall." },
  { icon: Volume2, title: "A quieter half", body: "The desk area sits away from the terrace, calm enough to hear yourself think." },
  { icon: Clock, title: "Stay as long as you like", body: "No timers, no two hour limit, no polite hovering." },
  { icon: Coffee, title: "Fresh coffee, always brewing", body: "A cup at your elbow without giving up your seat." },
  { icon: Printer, title: "Print and scan", body: "Ask the floor team. Useful the week a thesis is due." },
];

/**
 * Students, freelancers and remote workers are a different customer with a
 * different reason to come, so this gets its own section rather than a menu
 * line. It stays on the same white ground as the rest of the page.
 */
export default function Desks(_props: DesksProps) {
  return (
    <section
      id="desks"
      className="relative overflow-hidden px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: MORNING.bg }}
    >
      {/* Sunrise glow, upper left, and a faint answering sage glow lower right. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-24 h-[480px] w-[480px] rounded-full"
        style={{ background: MORNING.glow1 }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[420px] rounded-full"
        style={{ background: MORNING.glow2 }}
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: MORNING.amber }}>
                Morning at Aroma
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: MORNING.text }}>
                <span className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl">Start your morning right.</span>
                <span className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.05em]">warm coffee, quiet focus.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 text-[15px] leading-relaxed max-w-md" style={{ color: MORNING.textMuted }}>
                Come early, while the light is still soft and the room is still
                quiet. A section built for people who came to work: proper desks,
                proper chairs, fresh brewed coffee within reach, and enough calm
                to actually get through the list. Students before exams,
                freelancers on deadline, remote teams who needed somewhere
                better than home to start the day.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div
                className="mt-9 rounded-xl p-6 sm:p-7 backdrop-blur-md"
                style={{ border: `1px solid ${MORNING.cardBorder}`, background: MORNING.cardBg, boxShadow: MORNING.cardShadow }}
              >
                <p className="text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: MORNING.amber }}>
                  Day pass
                </p>
                <p className="text-[15px] leading-relaxed mb-5" style={{ color: MORNING.textMuted }}>
                  A desk for the working day, with your first coffee included, right
                  as the morning light comes in. Ask at the bar or reserve one with
                  your table.
                </p>
                <button
                  onClick={() =>
                    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ background: MORNING.sage, color: "#FFFFFF", boxShadow: "0 10px 24px -12px rgba(130,165,65,0.6)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = MORNING.sageHover)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = MORNING.sage)}
                >
                  Reserve a desk
                </button>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 self-start">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={0.08 + i * 0.05}>
                <div
                  className="h-full px-6 py-7 rounded-xl backdrop-blur-md transition-transform hover:-translate-y-0.5"
                  style={{ border: `1px solid ${MORNING.cardBorder}`, background: MORNING.cardBg, boxShadow: MORNING.cardShadow }}
                >
                  <span
                    className="inline-flex items-center justify-center h-10 w-10 rounded-full mb-3.5"
                    style={{ background: MORNING.amberSoft, color: MORNING.amber }}
                  >
                    <f.icon size={18} />
                  </span>
                  <p className="text-[15px] font-medium mb-1.5" style={{ color: MORNING.text }}>
                    {f.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: MORNING.textMuted }}>
                    {f.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
