import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import type { Brand } from "../brands";
import { useGroup } from "../localize";
import { useLang } from "../i18n";

/**
 * Selected work. Hidden until MAS confirms the case studies
 * (useGroup().cases is empty until then). A swipe rail on a phone, three
 * columns from a tablet up.
 */
export default function MasWork({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const { tr } = useLang();
  const { cases } = useGroup();
  if (!cases.length) return null;

  return (
    <section id="work" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow brand={brand} className="mb-6">{tr("Our work", "أعمالنا")}</Eyebrow>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal delay={0.06}>
            <h2 className="text-[2.3rem] sm:text-5xl md:text-6xl font-semibold leading-[1.02] tracking-[-0.045em]" style={{ color: ui.text }}>
              {tr("Rooms we took on,", "أماكن تولّيناها،")}
              <br />
              <span style={{ color: ui.textFaint }}>{tr("and what changed.", "وما الذي تغيّر.")}</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
              {tr(
                "Named clients on request. Where an owner has asked to stay unnamed, the venue is described rather than identified.",
                "أسماء العملاء عند الطلب. وحين يطلب المالك عدم ذكر اسمه، نصف المكان دون أن نسمّيه.",
              )}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
        <div
          className="-mx-5 px-5 sm:mx-0 sm:px-0 flex md:grid md:grid-cols-3 gap-4 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar overscroll-x-contain scroll-px-5"
          role="list"
        >
          {cases.map((c) => (
            <div key={c.key} role="listitem" className="snap-start shrink-0 w-[84%] sm:w-[60%] md:w-auto">
                <article className="h-full flex flex-col rounded-2xl border p-6 sm:p-8" style={{ borderColor: ui.line, background: ui.bgSoft }}>
                  <span
                    className="self-start text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full mb-5 tracking-[0.16em]"
                    style={{ color: brand.accent, background: "rgba(79,111,82,0.1)" }}
                  >
                    {c.service}
                  </span>
                  <h3 className="text-xl font-semibold tracking-[-0.03em] mb-5" style={{ color: ui.text }}>{c.client}</h3>

                  <p className="text-[10px] font-semibold uppercase mb-2 tracking-[0.2em]" style={{ color: ui.textFaint }}>
                    {tr("The problem", "المشكلة")}
                  </p>
                  <p className="text-[14px] leading-relaxed mb-5" style={{ color: ui.textMuted }}>{c.challenge}</p>

                  <p className="text-[10px] font-semibold uppercase mb-2 tracking-[0.2em]" style={{ color: ui.textFaint }}>
                    {tr("What we did", "ما فعلناه")}
                  </p>
                  <p className="text-[14px] leading-relaxed mb-7" style={{ color: ui.textMuted }}>{c.did}</p>

                  <div className="mt-auto grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: ui.line }}>
                    {c.results.map((r) => (
                      <div key={r.label} className="min-w-0">
                        <p className="text-xl font-semibold tracking-[-0.04em] mb-1" style={{ color: brand.accent }}>{r.value}</p>
                        <p className="text-[10px] leading-tight uppercase tracking-[0.12em]" style={{ color: ui.textFaint }}>{r.label}</p>
                      </div>
                    ))}
                  </div>
                </article>
            </div>
          ))}
        </div>
        </Reveal>
      </div>
    </section>
  );
}
