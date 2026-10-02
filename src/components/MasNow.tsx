import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import type { Brand } from "../brands";
import { useGroup } from "../localize";
import { useLang } from "../i18n";

/**
 * What is happening right now. Only confirmed items appear (useGroup().now),
 * and the strip disappears altogether if there are none.
 */
export default function MasNow({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const { tr } = useLang();
  const { now } = useGroup();
  if (!now.length) return null;

  const tone: Record<string, string> = {
    Opening: brand.accent,
    "In build": ui.textMuted,
    Hiring: brand.accent,
    Group: ui.textMuted,
  };

  return (
    <section id="now" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-28" style={{ background: ui.bgAlt }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow brand={brand} className="mb-5">{tr("Happening now", "الآن")}</Eyebrow>
          <h2 className="text-[2rem] sm:text-4xl md:text-5xl font-semibold leading-[1.04] tracking-[-0.045em] mb-10" style={{ color: ui.text }}>
            {tr("Where the group is now.", "أين المجموعة الآن.")}
          </h2>
        </Reveal>

        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: ui.line, background: ui.bgSoft }}>
          {now.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <article
                className="grid gap-x-6 gap-y-2 p-6 sm:p-7 md:grid-cols-[130px_150px_minmax(0,1fr)] md:items-baseline"
                style={{ borderTop: i ? `1px solid ${ui.line}` : undefined }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: ui.textFaint }}>
                  {item.date}
                </span>
                <span
                  className="justify-self-start text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full tracking-[0.14em]"
                  style={{ color: tone[item.kind] ?? ui.textMuted, border: `1px solid ${ui.line}` }}
                >
                  {item.kindLabel}
                </span>
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold tracking-[-0.02em] mb-1" style={{ color: ui.text }}>{item.title}</h3>
                  <p className="text-[14px] leading-relaxed" style={{ color: ui.textMuted }}>{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
