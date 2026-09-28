import { ArrowRight } from "lucide-react";
import Reveal from "./Reveal";
import TiltCard from "./TiltCard";
import Magnetic from "./Magnetic";
import { FoodBevPiece, type PieceKind } from "./FoodBevArt";
import Sparkle from "./Sparkle";
import type { Brand } from "../brands";

interface CovyTonightProps {
  brand: Brand;
  palette: { navy: string; blue: string; mocha: string };
}

/**
 * What COVY does after dark, in three cards. Aroma shows its bar, grill and
 * feteer as three full-screen pinned scenes; COVY has no menu of its own yet,
 * so this is one compact row of cards that swipes on a phone and sits three
 * across on a desktop. The copy is taken from COVY's own about text and
 * carries no dishes or prices.
 */
const CARDS: {
  kind: PieceKind;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  action: { label: string; target: string };
}[] = [
  {
    kind: "latte",
    eyebrow: "The bar",
    title: "Full service, unhurried.",
    body: "A long bar that stays open. Coffee, tea or something stronger, poured whenever the table wants another.",
    points: ["Full service bar", "Coffee and tea until close", "Nobody rushes the last table"],
    action: { label: "Reserve a table", target: "contact" },
  },
  {
    kind: "steak",
    eyebrow: "The kitchen",
    title: "Open late, every night.",
    body: "The kitchen does not start winding down when the rest of the street does. Dinner can run as long as the conversation.",
    points: ["Kitchen open late", "Dinner that runs late", "A table you can keep"],
    action: { label: "Ask about tonight", target: "contact" },
  },
  {
    kind: "cup",
    eyebrow: "The room",
    title: "Low light, no rush.",
    body: "Quiet enough to hear the person across from you, and set up for the ones who still have something to finish.",
    points: ["Wifi that holds", "Power at every seat", "Stay as late as you like"],
    action: { label: "Work from COVY", target: "work" },
  },
];

export default function CovyTonight({ brand, palette }: CovyTonightProps) {
  const ui = brand.ui;
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <section id="tonight" className="relative px-5 sm:px-10 md:px-14 py-20 sm:py-28" style={{ background: ui.bg }}>
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
            Tonight at COVY
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="leading-[1.0] tracking-[-0.03em] mb-10 sm:mb-14" style={{ color: ui.text }}>
            <span className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl">Three reasons</span>
            <span className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.045em]">to stay for the second half.</span>
          </h2>
        </Reveal>

        <div className="rail md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:m-0 md:p-0 items-stretch">
          {CARDS.map((c, i) => (
            <div key={c.title} className="w-[80%] sm:w-[52%] md:w-auto">
              <Reveal delay={0.08 + i * 0.07} className="h-full">
                <TiltCard className="h-full">
                <article
                  className="h-full rounded-2xl overflow-hidden flex flex-col"
                  style={{ background: ui.bgSoft, border: `1px solid ${ui.line}` }}
                >
                  <div
                    className="flex items-end justify-center h-52 sm:h-56 pt-6"
                    style={{ background: palette.blue }}
                  >
                    <FoodBevPiece kind={c.kind} accent={palette.mocha} shadow={palette.navy} className="h-full w-auto" />
                  </div>
                  <div className="p-6 sm:p-7 flex flex-col flex-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] mb-2 font-archivo font-semibold" style={{ color: brand.accent }}>
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
                        className="mt-auto self-start inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                        style={{ background: brand.accent, color: brand.accentText }}
                      >
                        {c.action.label}
                        <ArrowRight size={15} />
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
