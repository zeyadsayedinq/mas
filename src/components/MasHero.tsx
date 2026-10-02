import { ArrowRight } from "lucide-react";
import Kinetic from "./Kinetic";
import { buttonColors, type Brand } from "../brands";
import { useBrand } from "../localize";
import { useLang } from "../i18n";

interface MasHeroProps {
  brand: Brand;
}

/**
 * The group opener. States what the group is and gets out of the way.
 *
 * The headline arrives with the quiet curtain reveal, nothing else moves. The
 * right half carries a small "the group" card that answers the first question
 * a partner has, which is what MAS owns and what it runs for other people.
 *
 * The stone sits behind at low opacity as a ground, not a lockup.
 */
export default function MasHero({ brand }: MasHeroProps) {
  const ui = brand.ui;
  const { tr } = useLang();
  const aroma = useBrand("aroma");
  const covy = useBrand("covy");

  const go = (id: string) => {
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById(id)?.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  return (
    <section id="top" className="relative overflow-hidden px-5 sm:px-10 md:px-14" style={{ background: ui.bg }}>
      {/* the stone, as a ground rather than a mark */}
      {brand.mark && (
        <div
          aria-hidden
          className="hero-anim hero-fade pointer-events-none absolute -end-28 sm:-end-10 top-[430px] sm:top-32"
          style={{ animationDelay: "0.55s" }}
        >
          <img src={brand.mark} alt="" className="h-[260px] sm:h-[420px] md:h-[500px] w-auto" style={{ opacity: 0.05 }} />
        </div>
      )}

      <div className="relative mx-auto max-w-6xl pt-32 sm:pt-40 lg:pt-44 pb-16 sm:pb-24 grid gap-12 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.8fr)] lg:gap-14 lg:items-end">
        <div className="min-w-0">
          <p
            className="hero-anim hero-fade flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] mb-7 sm:mb-8"
            style={{ color: brand.accent, animationDelay: "0.05s" }}
          >
            <span aria-hidden className="inline-block w-2 h-2 rotate-45" style={{ background: brand.accent }} />
            {tr("Cairo · Food and beverage group", "القاهرة · مجموعة أغذية ومشروبات")}
          </p>

          <h1 className="mas-h1 font-semibold leading-[1.0] tracking-[-0.045em]" style={{ color: ui.text }}>
            <Kinetic text={brand.hero.line1} variant="curtain" delay={0.1} stagger={0.07} />
            <Kinetic text={brand.hero.line2} variant="curtain" delay={0.3} stagger={0.07} style={{ color: ui.textFaint }} />
          </h1>

          <p
            className="hero-anim hero-fade mt-7 sm:mt-8 max-w-xl text-[16px] sm:text-[17px] leading-relaxed"
            style={{ color: ui.textMuted, animationDelay: "0.45s" }}
          >
            {brand.hero.aside}
          </p>

          <div className="hero-anim hero-fade mt-9 sm:mt-10 flex flex-wrap gap-3" style={{ animationDelay: "0.55s" }}>
            <button
              onClick={() => go("services")}
              className="inline-flex min-h-[48px] items-center gap-2 text-sm font-semibold px-7 py-3.5 rounded-full transition-colors"
              style={buttonColors(brand)}
            >
              {brand.hero.cta}
              <ArrowRight size={15} className="rtl:-scale-x-100" aria-hidden />
            </button>
            <button
              onClick={() => go("brands")}
              className="min-h-[48px] text-sm font-semibold px-7 py-3.5 rounded-full border transition-colors hover:bg-black/[0.03]"
              style={{ borderColor: ui.line, color: ui.text }}
            >
              {tr("Our brands", "علاماتنا")}
            </button>
          </div>
        </div>

        {/* The group at a glance: owned versus operated, the one distinction
            a partner needs before anything else. */}
        <aside
          aria-label={tr("The group at a glance", "المجموعة باختصار")}
          className="mas-panel min-w-0 rounded-2xl border p-6 sm:p-7 lg:mb-2"
          style={{ borderColor: ui.line, background: "rgba(255,255,255,0.86)", backdropFilter: "blur(6px)" }}
        >
          <p className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.26em] mb-5" style={{ color: ui.textMuted }}>
            <span aria-hidden className="inline-block w-1.5 h-1.5 rotate-45" style={{ background: brand.accent }} />
            {tr("The group", "المجموعة")}
          </p>

          <dl>
            <div className="pb-5">
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: brand.accent }}>
                {tr("Owned", "علامات نملكها")}
              </dt>
              <dd className="text-[19px] font-semibold tracking-[-0.02em]" style={{ color: ui.text }}>
                {aroma.name}
                <span aria-hidden className="mx-2" style={{ color: ui.textFaint }}>·</span>
                {covy.name}
              </dd>
              <dd className="mt-1 text-[13px] leading-snug" style={{ color: ui.textFaint }}>
                {tr("Built, branded and run by the group.", "بنتها المجموعة وتحمل اسمها وتديرها.")}
              </dd>
            </div>
            <div className="pt-5 border-t" style={{ borderColor: ui.line }}>
              <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: brand.accent }}>
                {tr("Operated for owners", "نديرها لملّاكها")}
              </dt>
              <dd className="text-[19px] font-semibold tracking-[-0.02em]" style={{ color: ui.text }}>
                {tr("Your venue, our team", "مكانك، وفريقنا")}
              </dd>
              <dd className="mt-1 text-[13px] leading-snug" style={{ color: ui.textFaint }}>
                {tr("The name over the door stays yours. Venue list on request.", "يبقى الاسم على الباب اسمك. قائمة الأماكن عند الطلب.")}
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
