import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import Magnetic from "./Magnetic";
import Kinetic from "./Kinetic";
import Sparkle from "./Sparkle";
import CovyAmbient from "./CovyAmbient";
import { CovyCandle } from "./CovyArt";
import { sendToCovy } from "./CovyEvening";
import { useLang } from "../i18n";
import { track } from "../track";
import type { Brand } from "../brands";

interface CovyWorkProps {
  brand: Brand;
}

/**
 * "Private evenings": private hire, birthdays, business dinners and group
 * bookings, on the navy. Four cards and three plain steps, each card able to
 * start the enquiry with its own occasion already written in. No capacities,
 * packages or prices, since none are confirmed.
 */
export default function CovyWork({ brand }: CovyWorkProps) {
  const ui = brand.ui;
  const { tr } = useLang();

  const kinds = [
    {
      n: "I",
      key: "private_hire",
      title: tr("Private hire", "حجز خاص"),
      body: tr(
        "One of the quiet rooms, or more, kept for your guests alone. Tell us the night and we plan it with you.",
        "إحدى الغرف الهادئة، أو أكثر، محجوزة لضيوفك وحدهم. قل لنا الليلة ونرتّبها معك.",
      ),
    },
    {
      n: "II",
      key: "birthday",
      title: tr("Birthdays", "أعياد الميلاد"),
      body: tr(
        "A table that feels like the occasion. A late dinner, the bar at your pace, and nobody hurrying the cake.",
        "طاولة على قدر المناسبة. عشاء متأخر، والبار على إيقاعك، ولا أحد يستعجل الكعكة.",
      ),
    },
    {
      n: "III",
      key: "business_dinner",
      title: tr("Business dinners", "عشاء عمل"),
      body: tr(
        "Quiet enough to talk properly, with a kitchen that stays open when the meeting runs over.",
        "هادئ بما يكفي لحديث حقيقي، ومطبخ يبقى مفتوحًا حين يطول الاجتماع.",
      ),
    },
    {
      n: "IV",
      key: "group",
      title: tr("Group bookings", "حجوزات المجموعات"),
      body: tr(
        "Friends, family or the whole team. Tell us how many and we will set the tables to fit.",
        "أصدقاء أو عائلة أو الفريق كله. قل لنا العدد ونجهّز الطاولات على قدركم.",
      ),
    },
  ];

  const steps = [
    tr("Tell us the night, the occasion and how many.", "قل لنا الليلة والمناسبة والعدد."),
    tr("We come back to you and talk it through.", "نعود إليك ونتحدث في التفاصيل."),
    tr("Arrive. The room is ready for you.", "تصل، والمكان جاهز لك."),
  ];

  const enquire = (kind?: { key: string; title: string }) => {
    track("private_enquiry", { kind: kind?.key ?? "general" });
    sendToCovy(
      [
        tr("Hello COVY,", "مرحبًا كوفي،"),
        kind
          ? tr(`I'd like to ask about a private evening: ${kind.title.toLowerCase()}.`, `أودّ السؤال عن سهرة خاصة: ${kind.title}.`)
          : tr("I'd like to ask about a private evening.", "أودّ السؤال عن سهرة خاصة."),
        "",
        `${tr("The night", "الليلة")}: `,
        `${tr("Guests", "عدد الضيوف")}: `,
      ].join("\n"),
    );
  };

  return (
    <section id="private" className="relative overflow-hidden px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bg }}>
      <CovyAmbient color={brand.accent} lamp={false} sparse />
      <div className="relative mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] gap-10 lg:gap-16 items-end mb-14 sm:mb-16">
          <div>
            <Reveal>
              <p className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
                <Sparkle size={10} color={brand.accent} />
                {tr("Private evenings", "السهرات الخاصة")}
              </p>
            </Reveal>
            <h2 className="leading-[1.02] tracking-[-0.03em]" style={{ color: ui.text }}>
              <Kinetic variant="curtain" stagger={0.04} text={tr("Some nights", "بعض الليالي")} className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl" />
              <Kinetic variant="curtain" stagger={0.04} delay={0.18} text={tr("should be yours alone.", "يجب أن تكون لك وحدك.")} className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.045em]" />
            </h2>
          </div>

          <Reveal delay={0.1}>
            <div className="flex items-end gap-6">
              <div className="flex flex-col gap-6">
                <p className="text-[15px] leading-relaxed max-w-md" style={{ color: ui.textMuted }}>
                  {tr(
                    "A birthday, a dinner with clients, the whole team after a long quarter. COVY takes private hire, groups and events, and plans each one with you.",
                    "عيد ميلاد، أو عشاء مع عملاء، أو الفريق كله بعد ربع سنة طويل. كوفي يستقبل الحجز الخاص والمجموعات والمناسبات، ويرتّب كل واحدة معك.",
                  )}
                </p>
                <Magnetic>
                  <button
                    onClick={() => enquire()}
                    className="self-start min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                    style={{ background: brand.accent, color: brand.accentText }}
                  >
                    {tr("Plan a private evening", "رتّب سهرة خاصة")}
                    <ArrowRight size={15} className="rtl:-scale-x-100" />
                  </button>
                </Magnetic>
              </div>
              <CovyCandle className="hidden sm:block shrink-0 w-16 h-auto -mb-1" />
            </div>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kinds.map((k, i) => (
            <Reveal key={k.key} delay={0.06 + i * 0.07} className="h-full">
              <TiltCard className="h-full">
                <article
                  className="group relative h-full rounded-2xl p-6 sm:p-7 flex flex-col overflow-hidden"
                  style={{ background: ui.bgSoft, border: `1px solid ${ui.line}` }}
                >
                  <div
                    aria-hidden
                    className="absolute -top-16 -end-16 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `radial-gradient(closest-side, ${brand.accent}40, transparent)` }}
                  />
                  <div className="relative flex items-center justify-between mb-8">
                    <span className="font-playfair italic text-4xl leading-none" style={{ color: brand.accent }} dir="ltr">
                      {k.n}
                    </span>
                    <Sparkle size={12} color={ui.textFaint} className="covy-twinkle" />
                  </div>
                  <h3 className="relative font-playfair italic text-2xl leading-tight mb-3" style={{ color: ui.text }}>
                    {k.title}
                  </h3>
                  <p className="relative text-sm leading-relaxed mb-6" style={{ color: ui.textMuted }}>
                    {k.body}
                  </p>
                  <button
                    onClick={() => enquire(k)}
                    className="relative mt-auto self-start min-h-[44px] inline-flex items-center gap-2 text-sm font-medium border-b transition-opacity hover:opacity-80"
                    style={{ color: ui.text, borderColor: ui.line }}
                    aria-label={tr(`Ask about ${k.title.toLowerCase()}`, `اسأل عن ${k.title}`)}
                  >
                    {tr("Ask about this", "اسأل عنها")}
                    <ArrowRight size={14} className="rtl:-scale-x-100" />
                  </button>
                </article>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <ol className="mt-14 sm:mt-16 grid gap-6 sm:grid-cols-3 border-t pt-8" style={{ borderColor: ui.line }}>
            {steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="font-playfair italic text-lg tabular-nums" style={{ color: brand.accent }}>
                  0{i + 1}
                </span>
                <span className="text-[15px] leading-relaxed" style={{ color: ui.textMuted }}>
                  {s}
                </span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
