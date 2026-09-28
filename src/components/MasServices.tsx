import { useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import { SERVICES, type Brand, type Service } from "../brands";

/**
 * What the group sells, made selectable.
 *
 * This is the ONE interactive element on the page, and it sits here rather
 * than on the portfolio because this is the half of the business that gives a
 * two brand group any scale at all. Four engagements, one panel: a landlord
 * with an empty room and an owner losing money on the plate arrive wanting
 * different things, and neither should have to read the other's section to
 * find theirs.
 *
 * It inverts onto the group's dark ground, which is what gives the page its
 * break. The manual supplies the two lifted screen tints for exactly this and
 * marks them digital only, so they appear here and nowhere in print.
 *
 * A proper tablist on the keyboard. With motion reduced it stops animating and
 * still works.
 */
export default function MasServices({ brand }: { brand: Brand }) {
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const service = SERVICES[active];

  const ground = brand.dark ?? "#1C1311";
  const accent = brand.accentOnDark ?? brand.accent;
  const fg = "#F5EFE6";
  const fgMuted = "rgba(245,239,230,0.72)";
  const fgFaint = "rgba(245,239,230,0.5)";
  const line = "rgba(245,239,230,0.14)";

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = SERVICES.length - 1;
    let next = active;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section id="services" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ground }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] mb-7" style={{ color: accent }}>
            <span aria-hidden className="inline-block w-2 h-2 rotate-45" style={{ background: accent }} />
            What we do
          </p>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-14">
          <Reveal delay={0.06}>
            <h2 className="text-[2.5rem] sm:text-5xl md:text-6xl font-semibold leading-[1.0] tracking-[-0.045em]" style={{ color: fg }}>
              Owning a venue and
              <br />
              <span style={{ color: fgFaint }}>running one are different jobs.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[15px] leading-relaxed max-w-xs" style={{ color: fgMuted }}>
              When the second one is not yours, the group takes it. Pick the
              engagement that matches where your room is.
            </p>
          </Reveal>
        </div>

        <div
          role="tablist"
          aria-label="What MAS Egypt does"
          onKeyDown={onKeyDown}
          className="flex overflow-x-auto no-scrollbar border-b"
          style={{ borderColor: line }}
        >
          {SERVICES.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.key}
                ref={(el) => { tabsRef.current[i] = el; }}
                role="tab"
                id={`svc-tab-${s.key}`}
                aria-selected={on}
                aria-controls={`svc-panel-${s.key}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(i)}
                className="relative shrink-0 px-5 sm:px-7 first:pl-0 pb-4 pt-1 text-left"
              >
                <span
                  className="block text-base sm:text-lg font-semibold tracking-[-0.02em] whitespace-nowrap transition-colors"
                  style={{ color: on ? fg : fgFaint }}
                >
                  {s.title}
                </span>
                <span
                  aria-hidden
                  className="absolute left-0 right-0 sm:left-5 sm:right-5 first:left-0 -bottom-px h-[2px] transition-all duration-300"
                  style={{ background: accent, opacity: on ? 1 : 0, transform: on ? "scaleX(1)" : "scaleX(0.4)" }}
                />
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`svc-panel-${service.key}`}
          aria-labelledby={`svc-tab-${service.key}`}
          tabIndex={0}
          className="pt-10 sm:pt-12"
        >
          {/* keyed so the panel fades in on change rather than snapping */}
          <div key={service.key} className="scroll-reveal is-in">
            <Panel service={service} colors={{ fg, fgMuted, fgFaint, line, accent }} />
          </div>
        </div>
      </div>
    </section>
  );
}

interface C { fg: string; fgMuted: string; fgFaint: string; line: string; accent: string }

function Panel({ service, colors }: { service: Service; colors: C }) {
  const { fg, fgMuted, fgFaint, line, accent } = colors;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase mb-4" style={{ letterSpacing: "0.2em", color: accent }}>
          {service.audience}
        </p>
        <p className="text-[16px] sm:text-[17px] leading-relaxed mb-8" style={{ color: fgMuted }}>
          {service.body}
        </p>
        <div className="flex items-start gap-3 rounded-xl border p-5" style={{ borderColor: line }}>
          <span className="shrink-0 mt-0.5" style={{ color: accent }}>
            <Check size={17} />
          </span>
          <p className="text-[15px] font-semibold tracking-[-0.01em]" style={{ color: fg }}>
            {service.outcome}
          </p>
        </div>
        <button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-transform hover:scale-[1.02]"
          style={{ background: "#F5EFE6", color: "#1C1311" }}
        >
          Talk to us about this
          <ArrowRight size={15} />
        </button>
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase mb-5" style={{ letterSpacing: "0.22em", color: fgFaint }}>
          What is included
        </p>
        <ul>
          {service.includes.map((line2, i) => (
            <li
              key={line2}
              className="flex items-baseline gap-4 py-4 text-[15px] leading-relaxed"
              style={{ color: fgMuted, borderTop: i ? `1px solid ${line}` : undefined }}
            >
              <span className="shrink-0 text-[11px] font-semibold tabular-nums" style={{ color: accent }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {line2}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
