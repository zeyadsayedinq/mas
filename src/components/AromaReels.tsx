import VideoBand from "./VideoBand";
import type { Brand } from "../brands";

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/** Three bands of real footage from the room, dropped between the sections. */
export function ReelIntro({ brand }: { brand: Brand }) {
  return (
    <VideoBand src="/video/aroma-reel.mp4" poster="/video/aroma-reel.jpg" className="min-h-[80svh] flex items-end">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-10 md:px-14 pb-14 sm:pb-20 pt-40">
        <p className="text-[11px] uppercase tracking-[0.24em] font-semibold mb-4" style={{ color: "#C8DA9E" }}>Inside {brand.name}</p>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.02] max-w-3xl">
          <em>Vibe,</em> drink, and everything in between.
        </h2>
        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/75">
          Espresso bar, open grill and a room that stays lively well into the night.
        </p>
      </div>
    </VideoBand>
  );
}

export function ReelSpace({ brand }: { brand: Brand }) {
  return (
    <VideoBand src="/video/aroma-space.mp4" poster="/video/aroma-space.jpg" align="center" className="min-h-[70svh] flex items-center">
      <div className="mx-auto w-full max-w-3xl px-5 sm:px-10 py-24 text-center">
        <h2 className="text-4xl sm:text-6xl leading-[1.05]">
          Come for the coffee, <em>stay for the evening.</em>
        </h2>
        <button
          onClick={() => go("branches")}
          className="mt-8 text-sm font-medium px-7 py-3.5 rounded-full transition-transform hover:scale-[1.04] active:scale-95"
          style={{ background: brand.accent, color: brand.accentText }}
        >
          Find your branch
        </button>
      </div>
    </VideoBand>
  );
}

export function ReelTable({ brand }: { brand: Brand }) {
  return (
    <VideoBand src="/video/aroma-table.mp4" poster="/video/aroma-table.jpg" className="min-h-[80svh] flex items-end">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-10 md:px-14 pb-14 sm:pb-20 pt-40 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl leading-[1.02] max-w-2xl">
          Saved a table? <em>We'll keep it warm.</em>
        </h2>
        <button
          onClick={() => go("reserve")}
          className="self-start text-sm font-medium px-7 py-3.5 rounded-full transition-transform hover:scale-[1.04] active:scale-95"
          style={{ background: brand.accent, color: brand.accentText }}
        >
          Reserve a table
        </button>
      </div>
    </VideoBand>
  );
}
