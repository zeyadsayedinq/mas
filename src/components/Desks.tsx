import { useEffect, useRef, useState } from "react";
import { Wifi, Plug, Volume2, Clock, Coffee, UtensilsCrossed } from "lucide-react";
import Reveal from "./Reveal";
import Kinetic from "./Kinetic";
import TiltCard from "./TiltCard";
import Magnetic from "./Magnetic";
import { useLang } from "../i18n";
import type { Brand } from "../brands";
import "../styles/aroma-content.css";

interface DesksProps {
  brand: Brand;
}

/**
 * A palette local to this section: white with a soft green lift, and the
 * brand's light green for the icons and the one action (the button).
 */
const MORNING = {
  bg: "linear-gradient(180deg, #FFFFFF 0%, #FBFCF8 60%, #F6F9EF 100%)",
  glow1: "radial-gradient(circle, rgba(130,165,65,0.10) 0%, rgba(130,165,65,0) 70%)",
  glow2: "radial-gradient(circle, rgba(130,165,65,0.14) 0%, rgba(130,165,65,0) 70%)",
  text: "#23301A",
  textMuted: "rgba(35,48,26,0.70)",
  cardBg: "#FFFFFF",
  cardBorder: "rgba(35,48,26,0.10)",
  cardShadow: "0 12px 34px -18px rgba(35,48,26,0.22)",
  green: "#82A541",
  greenDeep: "#5d7a2b",
  greenSoft: "rgba(130,165,65,0.14)",
  greenHover: "#6c8a35",
};

const FEATURES = [
  { icon: Wifi, en: ["Wifi that holds", "Good enough for calls, so a morning deadline never waits on a spinner."], ar: ["واي فاي يعتمد عليه", "ينفع للكول والرفع، فالديدلاين بتاع الصبح مش هيستنى علامة التحميل."] },
  { icon: Plug, en: ["Power by the desks", "Sockets where you sit, so nobody is hunting for a wall."], ar: ["كهربا جنب المكاتب", "فيشة جنبك، فمحدش بيدوّر على حيطة."] },
  { icon: Volume2, en: ["A quieter half", "The desk area sits away from the terrace, calm enough to hear yourself think."], ar: ["ركن أهدى", "منطقة المكاتب بعيدة عن التراس، هادية كفاية إنك تركّز."] },
  { icon: Clock, en: ["Stay as long as you like", "No timers, no two hour limit, no polite hovering."], ar: ["اقعد براحتك", "مفيش تايمر، ولا حد ساعتين، ولا حد واقف فوق دماغك."] },
  { icon: Coffee, en: ["Coffee within reach", "Order another cup without giving up your seat."], ar: ["القهوة قريبة منك", "اطلب كوباية كمان من غير ما تسيب مكانك."] },
  { icon: UtensilsCrossed, en: ["Lunch without packing up", "The full kitchen runs all day, so a break doesn't mean moving."], ar: ["غدا من غير ما تقوم", "المطبخ كله شغال طول اليوم، فالبريك مش معناه إنك تتنقل."] },
] as const;

/**
 * Students, freelancers and remote workers are a different customer with a
 * different reason to come, so this gets its own section rather than a menu
 * line. On a phone the six cards become one swipeable rail instead of a long
 * stack; on a pointer device each card tilts toward the cursor.
 */
export default function Desks(_props: DesksProps) {
  const { tr, ar } = useLang();
  const rail = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  // Which card is centred on the phone rail, for the dots underneath.
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const first = el.firstElementChild as HTMLElement | null;
        if (!first) return;
        const step = first.offsetWidth + 10;
        setSlide(Math.min(FEATURES.length - 1, Math.max(0, Math.round(Math.abs(el.scrollLeft) / step))));
      });
    };
    el.addEventListener("scroll", on, { passive: true });
    return () => {
      el.removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  const reserveDesk = () => {
    window.dispatchEvent(new CustomEvent("aroma:reserve", { detail: { seating: "desk" } }));
    document.getElementById("reserve")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="desks"
      className="relative overflow-hidden px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: MORNING.bg }}
    >
      <div aria-hidden className="pointer-events-none absolute -top-40 -start-24 h-[480px] w-[480px] rounded-full" style={{ background: MORNING.glow1 }} />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -end-24 h-[420px] w-[420px] rounded-full" style={{ background: MORNING.glow2 }} />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
          <div className="min-w-0">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: MORNING.green }}>
                {tr("Morning at Aroma", "الصبح في أروما")}
              </p>
            </Reveal>

            <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: MORNING.text }}>
              <span className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl">
                <Kinetic text={tr("Start your morning right.", "ابدأ يومك صح.")} />
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.05em]">
                <Kinetic text={tr("Warm coffee, quiet focus.", "قهوة سخنة وتركيز هادي.")} delay={0.2} />
              </span>
            </h2>

            <Reveal delay={0.12}>
              <p className="mt-7 text-[15px] leading-relaxed max-w-md" style={{ color: MORNING.textMuted }}>
                {tr(
                  "Come early, while the light is still soft and the room is still quiet. A section built for people who came to work: proper desks, proper chairs, coffee within reach, and enough calm to actually get through the list. Students before exams, freelancers on deadline, remote teams who needed somewhere better than home to start the day.",
                  "تعالى بدري، والنور لسه هادي والمكان لسه ساكت. ركن معمول للي جاي يشتغل: مكاتب بجد، وكراسي مريحة، وقهوة قريبة منك، وهدوء كفاية إنك تخلّص اللي وراك. طلبة قبل الامتحانات، وفريلانسرز قبل التسليم، وفرق شغالة أونلاين محتاجة مكان أحسن من البيت تبدأ منه يومها.",
                )}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div
                className="mt-9 rounded-xl p-6 sm:p-7"
                style={{ border: `1px solid ${MORNING.cardBorder}`, background: MORNING.cardBg, boxShadow: MORNING.cardShadow }}
              >
                <p className="text-[11px] uppercase tracking-[0.18em] mb-3" style={{ color: MORNING.greenDeep }}>
                  {tr("Working from here", "لو جاي تشتغل")}
                </p>
                <p className="text-[15px] leading-relaxed mb-5" style={{ color: MORNING.textMuted }}>
                  {tr(
                    "Take a desk for the day. Ask at the bar when you arrive, or pick “Work desk” when you plan your table.",
                    "خد مكتب لليوم كله. اسأل على البار أول ما توصل، أو اختار «مكتب شغل» وانت بتحجز.",
                  )}
                </p>
                <Magnetic>
                  <button
                    onClick={reserveDesk}
                    className="text-sm font-medium px-7 min-h-[48px] rounded-full transition-colors"
                    style={{ background: MORNING.green, color: "#FFFFFF", boxShadow: "0 10px 24px -12px rgba(130,165,65,0.6)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = MORNING.greenHover)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = MORNING.green)}
                  >
                    {tr("Reserve a desk", "احجز مكتب")}
                  </button>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08} className="min-w-0 self-start">
            <div
              ref={rail}
              className="rail ac-desk-rail pb-2 sm:pb-0"
              role="list"
              aria-label={tr("What the desks come with", "مميزات مساحة الشغل")}
            >
              {FEATURES.map((f) => {
                const [title, body] = ar ? f.ar : f.en;
                return (
                  <div key={f.en[0]} role="listitem" className="h-auto">
                    <TiltCard className="h-full">
                      <div
                        className="h-full px-6 py-7 rounded-xl"
                        style={{ border: `1px solid ${MORNING.cardBorder}`, background: MORNING.cardBg, boxShadow: MORNING.cardShadow }}
                      >
                        <span
                          aria-hidden
                          className="inline-flex items-center justify-center h-10 w-10 rounded-full mb-3.5"
                          style={{ background: MORNING.greenSoft, color: MORNING.greenDeep }}
                        >
                          <f.icon size={18} />
                        </span>
                        <p className="text-[15px] font-medium mb-1.5" style={{ color: MORNING.text }}>
                          {title}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: MORNING.textMuted }}>
                          {body}
                        </p>
                      </div>
                    </TiltCard>
                  </div>
                );
              })}
            </div>
            <div className="ac-rail-dots mt-4 sm:hidden" aria-hidden>
              {FEATURES.map((f, i) => (
                <span key={f.en[0]} className={i === slide ? "on" : ""} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
