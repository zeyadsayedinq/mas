import Reveal from "./Reveal";
import { BRANCHES } from "../branches";
import { ALL_ITEMS } from "../menu";
import type { Brand } from "../brands";

/**
 * A quiet strip of proof under the hero. Every figure comes from data already
 * on the site (the Google rating on the branch listings, the branch count and
 * the published menu) so nothing here is a claim that has to be kept up by
 * hand. Opening hours are left out on purpose: they are still placeholders.
 */
export default function AromaHighlights({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  // "1.5K" and "80" both appear, so read the K before comparing.
  const count = (r?: string) => (r ? parseFloat(r) * (/k$/i.test(r) ? 1000 : 1) : 0);
  const top = BRANCHES.reduce((a, b) => (count(b.reviews) > count(a.reviews) ? b : a), BRANCHES[0]);
  const stats = [
    { value: `${top.rating}`, suffix: "/ 5", label: `on Google, ${top.reviews} reviews at ${top.area}` },
    { value: `${BRANCHES.length}`, suffix: "", label: "branches across New Cairo" },
    { value: `${ALL_ITEMS.length}`, suffix: "", label: "dishes and drinks on the menu" },
    { value: "All day", suffix: "", label: "coffee, grill, feteer and desks" },
  ];

  return (
    <section className="relative px-5 sm:px-10 md:px-14 py-10 sm:py-12" style={{ background: ui.bg, borderTop: `1px solid ${ui.line}`, borderBottom: `1px solid ${ui.line}` }}>
      <div className="mx-auto max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-y-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06}>
            <div className={`px-4 sm:px-6 ${i % 2 === 1 ? "border-l" : ""} ${i > 0 ? "lg:border-l" : ""} ${i === 2 ? "lg:border-l" : ""}`} style={{ borderColor: ui.line }}>
              <p className="italic text-4xl sm:text-5xl leading-none" style={{ fontFamily: "Fraunces, Georgia, serif", color: ui.text }}>
                {s.value}
                {s.suffix && <span className="ml-1 text-base not-italic font-sans" style={{ color: ui.textFaint }}>{s.suffix}</span>}
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
