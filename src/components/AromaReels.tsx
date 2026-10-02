import { ArrowRight } from "lucide-react";
import VideoBand from "./VideoBand";
import Kinetic from "./Kinetic";
import Magnetic from "./Magnetic";
import { useLang } from "../i18n";
import type { Brand } from "../brands";

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function Cta({ brand, to, children }: { brand: Brand; to: string; children: string }) {
  return (
    <Magnetic>
      <button
        type="button"
        onClick={() => go(to)}
        className="group inline-flex items-center gap-2 text-sm font-medium px-7 py-3.5 rounded-full transition-transform hover:scale-[1.04] active:scale-95"
        style={{ background: brand.accent, color: brand.accentText }}
      >
        {children}
        <ArrowRight size={16} aria-hidden className="rtl:-scale-x-100 transition-transform group-hover:translate-x-0.5" />
      </button>
    </Magnetic>
  );
}

/** Three bands of real footage from the room, dropped between the sections. */
export function ReelIntro({ brand }: { brand: Brand }) {
  const { tr } = useLang();
  return (
    <VideoBand src="/video/aroma-reel.mp4" poster="/video/aroma-reel.webp" className="min-h-[80svh] flex items-end">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-10 md:px-14 pb-14 sm:pb-20 pt-40">
        <p className="text-[11px] uppercase tracking-[0.24em] font-semibold mb-4" style={{ color: "#C8DA9E" }}>
          {tr(`Inside ${brand.name}`, `جوّه ${brand.name}`)}
        </p>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.02] max-w-3xl">
          <Kinetic text={tr("Vibe, drink,", "جوّ، ومشروب،")} className="block" variant="curtain" />
          <Kinetic text={tr("and everything in between.", "وكل اللي بينهم.")} className="block italic font-normal" variant="curtain" delay={0.18} />
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">
          {tr(
            "Espresso bar, open grill and a room that stays lively well into the night.",
            "بار إسبريسو، وشوّاية مفتوحة، ومكان فاضل مليان حياة لحد آخر الليل.",
          )}
        </p>
      </div>
    </VideoBand>
  );
}

export function ReelSpace({ brand }: { brand: Brand }) {
  const { tr } = useLang();
  return (
    <VideoBand src="/video/aroma-space.mp4" poster="/video/aroma-space.webp" align="center" className="min-h-[70svh] flex items-center">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-10 py-24 text-center">
        <h2 className="text-4xl sm:text-6xl leading-[1.05]">
          <Kinetic text={tr("Come for the coffee,", "تعالى عشان القهوة،")} className="block" />
          <Kinetic text={tr("stay for the evening.", "وخليك للسهرة.")} className="block italic font-normal" delay={0.2} />
        </h2>
        <div className="mt-8">
          <Cta brand={brand} to="branches">{tr("Find your branch", "اختار فرعك")}</Cta>
        </div>
      </div>
    </VideoBand>
  );
}

export function ReelTable({ brand }: { brand: Brand }) {
  const { tr } = useLang();
  return (
    <VideoBand src="/video/aroma-table.mp4" poster="/video/aroma-table.webp" className="min-h-[80svh] flex items-end">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-10 md:px-14 pb-14 sm:pb-20 pt-40 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.02] max-w-2xl">
          <Kinetic text={tr("Saved a table?", "حجزت ترابيزة؟")} className="block" variant="curtain" />
          <Kinetic text={tr("We'll keep it warm.", "هنستناك.")} className="block italic font-normal" variant="curtain" delay={0.2} />
        </h2>
        <div className="self-start lg:self-end">
          <Cta brand={brand} to="reserve">{tr("Reserve a table", "احجز ترابيزة")}</Cta>
        </div>
      </div>
    </VideoBand>
  );
}
