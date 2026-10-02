import type { ComponentType } from "react";
import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import Magnetic from "./Magnetic";
import Kinetic from "./Kinetic";
import Sparkle from "./Sparkle";
import { CovyBarGlass, CovyKitchenPlate, CovyRoomLamp, type CovyArtProps } from "./CovyArt";
import { useLang } from "../i18n";
import type { Brand } from "../brands";

interface CovyTonightProps {
  brand: Brand;
  palette: { navy: string; blue: string; mocha: string };
}

type Card = {
  Art: ComponentType<CovyArtProps>;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  action: { label: string; target: string };
};

/**
 * What COVY does after dark, in three cards: the bar, the kitchen, the room.
 * One compact row that swipes on a phone and sits three across on a desktop.
 * The copy stays with what is known about COVY and carries no dishes or
 * prices.
 */
export default function CovyTonight({ brand, palette }: CovyTonightProps) {
  const ui = brand.ui;
  const { tr } = useLang();
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const cards: Card[] = [
    {
      Art: CovyBarGlass,
      eyebrow: tr("The bar", "البار"),
      title: tr("Full service, unhurried.", "خدمة كاملة، على مهل."),
      body: tr(
        "A long bar that keeps the evening going. Whatever the table wants next, poured when it wants it.",
        "بار طويل يُبقي السهرة ممتدة. ما تطلبه الطاولة بعد ذلك، يُقدَّم حين تطلبه.",
      ),
      points: [
        tr("A full bar", "بار كامل"),
        tr("Poured at your pace", "على إيقاعك أنت"),
        tr("Nobody rushes the last table", "لا أحد يستعجل آخر طاولة"),
      ],
      action: { label: tr("Reserve a table", "احجز طاولة"), target: "contact" },
    },
    {
      Art: CovyKitchenPlate,
      eyebrow: tr("The kitchen", "المطبخ"),
      title: tr("Open late, every night.", "مفتوح لوقت متأخر، كل ليلة."),
      body: tr(
        "The kitchen does not start winding down when the rest of the street does. Dinner can run as long as the conversation.",
        "المطبخ لا يبدأ في الهدوء حين يهدأ باقي الشارع. العشاء يمتد ما امتد الحديث.",
      ),
      points: [
        tr("A late kitchen", "مطبخ لآخر الليل"),
        tr("Dinner that can run late", "عشاء يمتد لوقت متأخر"),
        tr("A table you can keep", "طاولة تبقى لك"),
      ],
      action: { label: tr("Plan a late dinner", "رتّب عشاءً متأخرًا"), target: "evening" },
    },
    {
      Art: CovyRoomLamp,
      eyebrow: tr("The rooms", "الغرف"),
      title: tr("Low light, no rush.", "إضاءة خافتة، ولا استعجال."),
      body: tr(
        "Quiet enough to hear the person across from you. And when the evening is yours alone, a room can be too.",
        "هادئ بما يكفي لتسمع من يجلس أمامك. وحين تكون السهرة لك وحدك، يمكن أن تكون الغرفة لك أيضًا.",
      ),
      points: [
        tr("Quiet rooms", "غرف هادئة"),
        tr("Low light all evening", "إضاءة خافتة طوال السهرة"),
        tr("Private hire and events", "حجز خاص ومناسبات"),
      ],
      action: { label: tr("Private evenings", "السهرات الخاصة"), target: "private" },
    },
  ];

  return (
    <section id="tonight" className="relative px-5 sm:px-10 md:px-14 py-20 sm:py-28" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            <Sparkle size={10} color={brand.accent} />
            {tr("Tonight at COVY", "الليلة في كوفي")}
          </p>
        </Reveal>
        <h2 className="leading-[1.02] tracking-[-0.03em] mb-10 sm:mb-14" style={{ color: ui.text }}>
          <Kinetic
            variant="curtain"
            text={tr("Three reasons", "ثلاثة أسباب")}
            stagger={0.04}
            className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl"
          />
          <Kinetic
            variant="curtain"
            text={tr("to stay for the second half.", "لتبقى للنصف الثاني من الليل.")}
            delay={0.18}
            stagger={0.04}
            className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.045em]"
          />
        </h2>

        <div className="rail md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:m-0 md:p-0 items-stretch pb-2">
          {cards.map((c, i) => (
            <div key={c.eyebrow} className="w-[82%] sm:w-[52%] md:w-auto">
              <Reveal delay={0.08 + i * 0.07} className="h-full">
                <TiltCard className="h-full">
                  <article
                    className="h-full rounded-2xl overflow-hidden flex flex-col"
                    style={{ background: ui.bgSoft, border: `1px solid ${ui.line}` }}
                  >
                    <div
                      className="relative flex items-end justify-center h-52 sm:h-56 pt-6 overflow-hidden"
                      style={{ background: palette.blue }}
                    >
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{ background: `radial-gradient(80% 70% at 50% 100%, rgba(244,239,235,.22), transparent 70%)` }}
                      />
                      <div aria-hidden className="absolute inset-x-0 bottom-0 h-10" style={{ background: `linear-gradient(to top, ${palette.navy}33, transparent)` }} />
                      <c.Art className="relative h-full w-auto max-w-[92%]" />
                    </div>
                    <div className="p-6 sm:p-7 flex flex-col flex-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] mb-2 font-semibold" style={{ color: brand.accent }}>
                        {c.eyebrow}
                      </p>
                      <h3 className="font-playfair italic text-2xl leading-tight mb-3" style={{ color: ui.text }}>
                        {c.title}
                      </h3>
                      <p className="text-sm leading-relaxed mb-5" style={{ color: ui.textMuted }}>
                        {c.body}
                      </p>
                      <ul className="text-sm space-y-2 mb-7" style={{ color: ui.text }}>
                        {c.points.map((p) => (
                          <li key={p} className="flex gap-2.5">
                            <Sparkle size={10} color={brand.accent} className="mt-[5px]" />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <Magnetic>
                        <button
                          onClick={() => go(c.action.target)}
                          className="mt-auto self-start min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                          style={{ background: brand.accent, color: brand.accentText }}
                        >
                          {c.action.label}
                          <ArrowRight size={15} className="rtl:-scale-x-100" />
                        </button>
                      </Magnetic>
                    </div>
                  </article>
                </TiltCard>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
