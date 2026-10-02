import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import type { Brand } from "../brands";
import { useGroup } from "../localize";
import { useLang } from "../i18n";

/**
 * The figures band. Renders nothing until MAS confirms the numbers
 * (useGroup().stats is empty until then).
 */
export default function MasStats({ brand }: { brand: Brand }) {
  const { stats } = useGroup();
  const { tr } = useLang();
  const ui = brand.ui;
  if (!stats.length) return null;

  return (
    <section
      aria-label={tr("The group in figures", "المجموعة بالأرقام")}
      className="relative px-5 sm:px-10 md:px-14 pt-10 pb-4"
      style={{ background: ui.bg }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px border-t" style={{ borderColor: ui.line, background: ui.line }}>
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="h-full">
              <div className="min-w-0 h-full py-7 sm:py-10 px-4 sm:px-6" style={{ background: ui.bg }}>
                <p className="text-[2rem] sm:text-5xl font-semibold tracking-[-0.05em] mb-2.5 tabular-nums" style={{ color: brand.accent }}>
                  <CountUp value={s.value} />
                </p>
                <p className="text-[10px] font-semibold uppercase mb-1.5 tracking-[0.2em]" style={{ color: ui.text }}>
                  {s.label}
                </p>
                <p className="text-[12.5px] sm:text-[13px] leading-snug" style={{ color: ui.textFaint }}>
                  {s.note}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Counts a figure up the first time it is seen. Years stay as they are, since
 * counting to 2018 says nothing. Leading zeros and suffixes are kept.
 */
function CountUp({ value }: { value: string }) {
  const m = value.match(/^(\d+)(.*)$/);
  const target = m ? parseInt(m[1], 10) : NaN;
  const width = m ? m[1].length : 0;
  const isYear = m && width === 4 && target >= 1900;
  const animate = !!m && !isYear;
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState<number | null>(animate ? 0 : null);

  useEffect(() => {
    const el = ref.current;
    if (!animate || !el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(null);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 1100;
        const step = (t: number) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          setN(Math.round(target * eased));
          if (p < 1) raf = requestAnimationFrame(step);
          else setN(null);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [animate, target]);

  const shown = n === null || !m ? value : String(n).padStart(width, "0") + m[2];
  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden>{shown}</span>
    </span>
  );
}
