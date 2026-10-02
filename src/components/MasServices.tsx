import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import type { Brand, Service } from "../brands";
import { useGroup } from "../localize";
import { useLang } from "../i18n";
import { track } from "../track";

/**
 * What the group sells, made selectable. Four engagements, one panel: a
 * landlord with an empty room and an owner losing money on the plate want
 * different things and neither should have to read the other's section.
 *
 * Other parts of the page open a tab here by dispatching
 *   window.dispatchEvent(new CustomEvent("mas:service", { detail: { key } }))
 * which selects that engagement and scrolls the section into view.
 *
 * Inverts onto the group's dark ground, which gives the page its one break.
 * A proper tablist on the keyboard, direction-aware in Arabic.
 */
export default function MasServices({ brand }: { brand: Brand }) {
  const { services } = useGroup();
  const { tr, ar } = useLang();
  const [active, setActive] = useState(0);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const service = services[active] ?? services[0];

  // Keep the chosen tab visible in the sideways-scrolling row on a phone.
  // Scroll the row itself, never the page, so this cannot fight a page scroll.
  useEffect(() => {
    const tab = tabsRef.current[active];
    const row = tab?.parentElement;
    if (!tab || !row || row.scrollWidth <= row.clientWidth) return;
    const t = tab.getBoundingClientRect();
    const r = row.getBoundingClientRect();
    const delta = t.left + t.width / 2 - (r.left + r.width / 2);
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    row.scrollBy({ left: delta, behavior: smooth ? "smooth" : "auto" });
  }, [active]);

  // Open a tab from elsewhere on the page.
  useEffect(() => {
    const onPick = (e: Event) => {
      const key = (e as CustomEvent<{ key?: string }>).detail?.key;
      const i = services.findIndex((s) => s.key === key);
      if (i < 0) return;
      setActive(i);
      const el = sectionRef.current;
      if (!el) return;
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      // Hand keyboard focus to the chosen tab without a second scroll.
      window.setTimeout(() => tabsRef.current[i]?.focus({ preventScroll: true }), smooth ? 700 : 0);
    };
    window.addEventListener("mas:service", onPick);
    return () => window.removeEventListener("mas:service", onPick);
  }, [services]);

  const select = (i: number) => {
    setActive(i);
    track("service_tab", { key: services[i].key });
  };

  const ground = brand.dark ?? "#1C1311";
  const accent = brand.accentOnDark ?? brand.accent;
  const fg = "#F5EFE6";
  const fgMuted = "rgba(245,239,230,0.74)";
  const fgFaint = "rgba(245,239,230,0.52)";
  const line = "rgba(245,239,230,0.14)";

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = services.length - 1;
    const fwd = ar ? "ArrowLeft" : "ArrowRight";
    const back = ar ? "ArrowRight" : "ArrowLeft";
    let next = active;
    if (e.key === fwd || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    else if (e.key === back || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    select(next);
    tabsRef.current[next]?.focus();
  };

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      // Land flush with the top (cancelling the global 64px scroll padding) so
      // the nav is fully over the dark ground and inverts cleanly.
      style={{ background: ground, scrollMarginTop: "-64px" }}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] mb-7" style={{ color: accent }}>
            <span aria-hidden className="inline-block w-2 h-2 rotate-45" style={{ background: accent }} />
            {tr("What we do", "خدماتنا")}
          </p>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12 sm:mb-14">
          <Reveal delay={0.06}>
            <h2 className="text-[2.3rem] sm:text-5xl md:text-6xl font-semibold leading-[1.02] tracking-[-0.045em]" style={{ color: fg }}>
              {tr("Owning a venue and", "امتلاك مكان وإدارته")}
              <br />
              <span style={{ color: fgFaint }}>{tr("running one are different jobs.", "مهمتان مختلفتان.")}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[15px] leading-relaxed max-w-xs" style={{ color: fgMuted }}>
              {tr(
                "When the second one is not yours, the group takes it. Pick the engagement that matches where your room is.",
                "وحين لا تكون الثانية مهمتك، تتولّاها المجموعة. اختر نوع التعاون الذي يناسب وضع مكانك.",
              )}
            </p>
          </Reveal>
        </div>

        <div
          role="tablist"
          aria-label={tr("What MAS Egypt does", "ما تقدّمه ماس مصر")}
          onKeyDown={onKeyDown}
          className="flex overflow-x-auto no-scrollbar border-b overscroll-x-contain"
          style={{ borderColor: line }}
        >
          {services.map((s, i) => {
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
                onClick={() => select(i)}
                className="group relative shrink-0 min-h-[48px] px-5 sm:px-7 first:ps-0 pb-4 pt-1 text-start focus-visible:outline-none"
              >
                <span
                  className="block text-base sm:text-lg font-semibold tracking-[-0.02em] whitespace-nowrap transition-colors group-focus-visible:underline underline-offset-8"
                  style={{ color: on ? fg : fgFaint }}
                >
                  {s.title}
                </span>
                <span
                  aria-hidden
                  className="absolute start-5 end-5 sm:start-7 sm:end-7 group-first:start-0 sm:group-first:start-0 -bottom-px h-[2px] transition-[opacity,transform] duration-300"
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
          className="pt-10 sm:pt-12 focus-visible:outline-none"
        >
          <div key={service.key} className="mas-swap">
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
  const { tr } = useLang();

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase mb-4 tracking-[0.2em]" style={{ color: accent }}>
          {service.audience}
        </p>
        <p className="text-[16px] sm:text-[17px] leading-relaxed mb-8" style={{ color: fgMuted }}>
          {service.body}
        </p>
        <div className="flex items-start gap-3 rounded-xl border p-5" style={{ borderColor: line }}>
          <span className="shrink-0 mt-0.5" style={{ color: accent }}>
            <Check size={17} aria-hidden />
          </span>
          <p className="text-[15px] font-semibold tracking-[-0.01em]" style={{ color: fg }}>
            {service.outcome}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            track("service_contact", { key: service.key });
            const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            document.getElementById("contact")?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
          }}
          className="mt-8 inline-flex min-h-[48px] items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full transition-opacity hover:opacity-90"
          style={{ background: "#F5EFE6", color: "#1C1311" }}
        >
          {tr("Talk to us about this", "تحدّث معنا بخصوص هذا")}
          <ArrowRight size={15} aria-hidden className="rtl:-scale-x-100" />
        </button>
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase mb-5 tracking-[0.22em]" style={{ color: fgFaint }}>
          {tr("What is included", "ما يشمله")}
        </p>
        <ul>
          {service.includes.map((item, i) => (
            <li
              key={item}
              className="flex items-baseline gap-4 py-4 text-[15px] leading-relaxed"
              style={{ color: fgMuted, borderTop: i ? `1px solid ${line}` : undefined }}
            >
              <span className="shrink-0 text-[11px] font-semibold tabular-nums" style={{ color: accent }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
