import { Wifi, Plug, Volume2, Clock, Coffee, Printer } from "lucide-react";
import Reveal from "./Reveal";
import type { Brand } from "../brands";

interface DesksProps {
  brand: Brand;
}

const FEATURES = [
  { icon: Wifi, title: "Wifi that holds", body: "Fibre on both floors, and it does not drop when the room fills up." },
  { icon: Plug, title: "Power at the table", body: "Sockets at every desk seat, so nobody is hunting for a wall." },
  { icon: Volume2, title: "A quieter half", body: "The desk area sits away from the terrace and the pass." },
  { icon: Clock, title: "Stay as long as you like", body: "No timers, no two hour limit, no polite hovering." },
  { icon: Coffee, title: "Lavazza on tap", body: "Refills at the bar without giving up your seat." },
  { icon: Printer, title: "Print and scan", body: "Ask the floor team. Useful the week a thesis is due." },
];

/**
 * Students, freelancers and remote workers are a different customer with a
 * different reason to come, so this gets its own section rather than a menu
 * line. It is the part of the offer nobody nearby is presenting properly.
 */
export default function Desks({ brand }: DesksProps) {
  const ui = brand.ui;

  return (
    <section
      id="desks"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: ui.bgAlt }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
                Work from Aroma
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: ui.text }}>
                <span className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl">Bring the laptop.</span>
                <span className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.05em]">Stay the day.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 text-[15px] leading-relaxed max-w-md" style={{ color: ui.textMuted }}>
                A section of the room is built for people who came to work. Proper
                desks, proper chairs, power and wifi, and a kitchen you do not have
                to leave the building for. Students before exams, freelancers on
                deadline, remote teams who needed somewhere better than home.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div
                className="mt-9 rounded-xl border p-6 sm:p-7"
                style={{ borderColor: ui.line, background: ui.bgSoft }}
              >
                <p className="text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: brand.accent }}>
                  Day pass
                </p>
                <p className="text-[15px] leading-relaxed mb-5" style={{ color: ui.textMuted }}>
                  A desk for the working day, with your first coffee included. Ask at
                  the bar or reserve one with your table.
                </p>
                <button
                  onClick={() =>
                    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className="text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                  style={{ background: brand.accent, color: brand.accentText }}
                >
                  Reserve a desk
                </button>
              </div>
            </Reveal>
          </div>

          <div className="grid gap-px sm:grid-cols-2 rounded-lg overflow-hidden self-start" style={{ background: ui.line }}>
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={0.08 + i * 0.05}>
                <div className="h-full px-6 py-7" style={{ background: ui.bgSoft }}>
                  <span className="block mb-3.5" style={{ color: brand.accent }}>
                    <f.icon size={20} />
                  </span>
                  <p className="text-[15px] font-medium mb-1.5" style={{ color: ui.text }}>
                    {f.title}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: ui.textMuted }}>
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
