import Reveal from "./Reveal";
import { GROUP_STATS, type Brand } from "../brands";

/**
 * The figures band.
 *
 * Near-universal on group sites, and the labels are doing the real work: they
 * count years, rooms, team and hours rather than brands, because a portfolio
 * of two is the one number that works against a group this size.
 */
export default function MasStats({ brand }: { brand: Brand }) {
  const ui = brand.ui;

  return (
    <section className="relative px-5 sm:px-10 md:px-14 pb-4" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4 border-t" style={{ borderColor: ui.line, background: ui.line }}>
          {GROUP_STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="min-w-0 h-full py-8 sm:py-10 sm:pr-8" style={{ background: ui.bg }}>
                <p className="text-4xl sm:text-5xl font-semibold tracking-[-0.05em] mb-3" style={{ color: brand.accent }}>
                  {s.value}
                </p>
                <p className="text-[10px] font-semibold uppercase mb-2" style={{ letterSpacing: "0.22em", color: ui.text }}>
                  {s.label}
                </p>
                <p className="text-[13px] leading-snug" style={{ color: ui.textFaint }}>
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
