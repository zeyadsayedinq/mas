import { useEffect, useRef, useState, type ReactNode } from "react";
import Reveal from "./Reveal";
import { BRANCHES } from "../branches";
import { ALL_ITEMS } from "../menu";
import { useBranches } from "../localize";
import { useLang } from "../i18n";
import type { Brand } from "../brands";
import "../styles/aroma-3d.css";

/** Counts from zero to the value the first time it is seen. Plain value for reduced motion. */
function CountUp({ to, decimals = 0, duration = 1400 }: { to: number; decimals?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setV(0);
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t: number) => {
        const u = Math.min(1, (t - t0) / duration);
        setV(to * (1 - Math.pow(1 - u, 4)));
        if (u < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, duration]);
  return <span ref={ref} className="aro-count">{v.toFixed(decimals)}</span>;
}

/**
 * A quiet strip of proof under the hero. Every figure comes from data already
 * on the site (the Google rating on the branch listings, the branch count and
 * the published menu) so nothing here is a claim that has to be kept up by
 * hand. Opening hours are left out on purpose: they are still placeholders.
 */
export default function AromaHighlights({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const { tr } = useLang();
  const local = useBranches();
  // "1.5K" and "80" both appear, so read the K before comparing.
  const count = (r?: string) => (r ? parseFloat(r) * (/k$/i.test(r) ? 1000 : 1) : 0);
  const top = BRANCHES.reduce((a, b) => (count(b.reviews) > count(a.reviews) ? b : a), BRANCHES[0]);
  const topArea = local.find((b) => b.key === top.key)?.area ?? top.area;

  const stats: { value: ReactNode; suffix?: string; label: string }[] = [
    ...(top.rating
      ? [{
          value: <CountUp to={top.rating} decimals={1} />,
          suffix: "/ 5",
          label: top.reviews
            ? tr(`on Google, ${top.reviews} reviews at ${topArea}`, `على جوجل، ${top.reviews} تقييم في ${topArea}`)
            : tr(`on Google at ${topArea}`, `على جوجل في ${topArea}`),
        }]
      : []),
    { value: <CountUp to={BRANCHES.length} duration={900} />, label: tr("branches across New Cairo", "فروع في القاهرة الجديدة") },
    { value: <CountUp to={ALL_ITEMS.length} />, label: tr("dishes and drinks on the menu", "صنف أكل ومشروب في المنيو") },
    { value: tr("All day", "طول اليوم"), label: tr("coffee, grill, feteer and desks", "قهوة ومشويات وفطير ومساحة شغل") },
  ];

  return (
    <section className="relative px-5 sm:px-10 md:px-14 py-10 sm:py-12" style={{ background: ui.bg, borderTop: `1px solid ${ui.line}`, borderBottom: `1px solid ${ui.line}` }}>
      <div className="mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-y-8">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.06}>
            <div className={`px-4 sm:px-6 ${i % 2 === 1 ? "border-s" : ""} ${i > 0 ? "lg:border-s" : ""}`} style={{ borderColor: ui.line }}>
              <p className="aro-num italic rtl:not-italic text-4xl sm:text-5xl leading-none" style={{ color: ui.text }}>
                <span dir={s.suffix ? "ltr" : undefined} className="inline-block">
                  {s.value}
                  {s.suffix && <span className="ms-1 text-base not-italic" style={{ color: ui.textFaint }}>{s.suffix}</span>}
                </span>
              </p>
              <p className="mt-3 text-[13px] leading-snug max-w-[200px]" style={{ color: ui.textMuted }}>
                {s.label}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
