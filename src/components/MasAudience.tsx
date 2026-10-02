import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import type { Brand } from "../brands";
import { useLang } from "../i18n";
import { track } from "../track";

/** Tell MasServices which engagement to open, then bring it into view. */
export function pickService(key: string) {
  window.dispatchEvent(new CustomEvent("mas:service", { detail: { key } }));
}

interface Door {
  key: string;
  n: string;
  title: [string, string];
  body: [string, string];
  cta: [string, string];
  alt?: { key: string; label: [string, string] };
}

const DOORS: Door[] = [
  {
    key: "fix",
    n: "01",
    title: ["I own a venue that should be doing better", "أملك مكانًا يستطيع أن يحقق أكثر"],
    body: [
      "Open and trading, but the numbers do not match the room. We find the few changes that move the line.",
      "مفتوح وشغّال، لكن الأرقام لا تليق بالمكان. نحدّد التغييرات القليلة التي تحرّك النتيجة.",
    ],
    cta: ["See how we fix it", "كيف نُصلحه"],
  },
  {
    key: "operate",
    n: "02",
    title: ["I have a site and need an operator", "لديّ موقع وأحتاج إلى مشغّل"],
    body: [
      "You hold the room and the capital. We bring the team, the kitchen and the reporting, and your name stays on the door.",
      "المكان ورأس المال عندك. نحن نأتي بالفريق والمطبخ والتقارير، ويبقى اسمك على الباب.",
    ],
    cta: ["See how we operate", "كيف نشغّله"],
    alt: { key: "build", label: ["Not open yet? Start with We build", "لم يُفتتح بعد؟ ابدأ من «نبني»"] },
  },
  {
    key: "supply",
    n: "03",
    title: ["I buy for a kitchen", "أشتري لمطبخ"],
    body: [
      "Coffee, bakery and prepared items from the group's own production, on a standing order.",
      "قهوة ومخبوزات وأصناف مجهّزة من إنتاج المجموعة نفسها، بطلب دائم.",
    ],
    cta: ["See what we supply", "ماذا نورّد"],
  },
];

/**
 * "Which one are you?" A three way entry right under the hero, so an owner,
 * a landlord and a buyer each land on their own engagement in the services
 * selector without reading the others.
 */
export default function MasAudience({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const { tr, ar } = useLang();
  const pick = (key: string) => {
    track("audience_pick", { key });
    pickService(key);
  };
  const t = (p: [string, string]) => (ar ? p[1] : p[0]);

  return (
    <section
      id="audience"
      aria-labelledby="mas-aud-h"
      className="relative px-5 sm:px-10 md:px-14 py-16 sm:py-20"
      style={{ background: ui.bgAlt }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-9 sm:mb-10">
          <Reveal>
            <Eyebrow brand={brand} className="mb-4">{tr("Start here", "ابدأ من هنا")}</Eyebrow>
            <h2 id="mas-aud-h" className="text-[1.9rem] sm:text-4xl font-semibold leading-[1.05] tracking-[-0.04em]" style={{ color: ui.text }}>
              {tr("Which one are you?", "أيّها يصفك؟")}
            </h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
              {tr(
                "Pick the line that sounds like you and we will open the part of the page written for you.",
                "اختر الجملة الأقرب إلى وضعك، ونفتح لك الجزء المكتوب لك من الصفحة.",
              )}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {DOORS.map((d, i) => (
            <Reveal key={d.key} delay={0.05 + i * 0.06} className="h-full">
              <article
                className="mas-aud relative h-full flex flex-col rounded-2xl border p-6 sm:p-7"
                style={{ borderColor: ui.line, background: ui.bgSoft }}
              >
                <span className="text-[11px] font-semibold tabular-nums mb-5" style={{ color: brand.accent }}>
                  {d.n}
                </span>
                <h3 className="text-[20px] sm:text-[21px] font-semibold leading-snug tracking-[-0.025em] mb-3" style={{ color: ui.text }}>
                  {t(d.title)}
                </h3>
                <p className="text-[14px] leading-relaxed mb-6" style={{ color: ui.textMuted }}>
                  {t(d.body)}
                </p>

                <div className="mt-auto flex flex-col items-start gap-1">
                  {d.alt && (
                    <button
                      type="button"
                      onClick={() => pick(d.alt!.key)}
                      className="relative z-10 min-h-[44px] text-start text-[13px] underline underline-offset-4 decoration-1 transition-colors"
                      style={{ color: ui.textMuted, textDecorationColor: ui.line }}
                    >
                      {t(d.alt.label)}
                    </button>
                  )}
                  {/* The whole card is the target for the main action. */}
                  <button
                    type="button"
                    onClick={() => pick(d.key)}
                    className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-offset-2"
                    style={{ color: brand.accent, ["--tw-ring-color" as string]: brand.accent }}
                  >
                    {t(d.cta)}
                    <ArrowRight size={15} aria-hidden className="mas-aud-arrow rtl:-scale-x-100" />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
