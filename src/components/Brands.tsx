import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SpotlightScene from "./SpotlightScene";
import CupArt from "./CupArt";
import Reveal from "./Reveal";
import { CHILD_BRANDS, type Brand } from "../brands";
import { PANEL_SPOTLIGHT_R } from "../config";
import type { CursorPos } from "../hooks/useSmoothCursor";
import { useHasHover } from "../hooks/useHasHover";

interface BrandsProps {
  parent: Brand;
  cursor: CursorPos;
}

/**
 * The brand lockup, dim or lit.
 *
 * Both states use an identical box, down to the plate padding, because the
 * spotlight cross fades one over the other. Any difference in metrics shows up
 * as a doubled logo at the edge of the light.
 *
 * It sits above the cup rather than over it, so the lit cup stays readable.
 */
function LogoBlock({ brand, lit }: { brand: Brand; lit: boolean }) {
  return (
    <div className="absolute inset-0 flex items-start justify-center pointer-events-none px-8 pt-[9%]">
      <div
        className="rounded-xl px-7 sm:px-10 py-5 sm:py-7"
        style={
          lit
            ? {
                background: brand.plateBg,
                boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.45)",
              }
            : undefined
        }
      >
        <img
          src={brand.logo}
          alt=""
          className={`h-14 sm:h-16 md:h-20 w-auto ${lit ? "" : "opacity-40"}`}
          style={lit ? undefined : { filter: "brightness(0) invert(1)" }}
        />
      </div>
    </div>
  );
}

function Panel({
  brand,
  cursor,
  hasHover,
}: {
  brand: Brand;
  cursor: CursorPos;
  hasHover: boolean;
}) {
  return (
    <Link
      to={brand.path}
      className="group relative block overflow-hidden rounded-xl min-h-[58vh] sm:min-h-[66vh] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      aria-label={`Visit ${brand.name}`}
    >
      {hasHover ? (
        <SpotlightScene
          dim={brand.cupDim}
          lit={brand.cupLit}
          idPrefix={`panel-${brand.key}`}
          cursorX={cursor.x}
          cursorY={cursor.y}
          radius={PANEL_SPOTLIGHT_R}
          dimOverlay={<LogoBlock brand={brand} lit={false} />}
          litOverlay={<LogoBlock brand={brand} lit />}
        />
      ) : (
        /* No cursor to follow on touch, so the panel simply shows its lit self. */
        <div className="absolute inset-0 overflow-hidden">
          <CupArt
            variant="lit"
            palette={brand.cupLit}
            idPrefix={`panel-static-${brand.key}`}
            className="absolute inset-0 w-full h-full"
          />
          <LogoBlock brand={brand} lit />
        </div>
      )}

      {/* Scrim so the label stays readable whatever the light is doing. */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 flex items-end justify-between gap-4">
        <div>
          <p className="text-white text-2xl sm:text-3xl font-playfair italic leading-none">
            {brand.name}
          </p>
          <p className="mt-2 text-white/65 text-xs sm:text-sm">{brand.descriptor}</p>
        </div>
        <span
          className="shrink-0 flex items-center gap-2 text-xs sm:text-sm font-medium px-5 py-2.5 rounded-full transition-transform group-hover:translate-x-0.5"
          style={{ background: brand.accent, color: brand.accentText }}
        >
          Visit
          <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  );
}

export default function Brands({ parent, cursor }: BrandsProps) {
  const hasHover = useHasHover();

  return (
    <section
      id="brands"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: parent.ui.bgAlt }}
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p
            className="text-[11px] uppercase tracking-[0.22em] mb-6"
            style={{ color: parent.accent }}
          >
            Owned brands
          </p>
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 sm:mb-16">
          <Reveal delay={0.06}>
            <h2 className="leading-[1.0] tracking-[-0.03em]" style={{ color: parent.ui.text }}>
              <span className="block font-playfair italic text-4xl sm:text-6xl md:text-7xl">
                Two brands,
              </span>
              <span className="block text-4xl sm:text-6xl md:text-7xl tracking-[-0.05em]">
                both ours.
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="text-sm sm:text-[15px] leading-relaxed max-w-xs" style={{ color: parent.ui.textMuted }}>
              {hasHover
                ? "Run your cursor over either one. They light up in their own colours, which is roughly what happens when you walk in."
                : "Two brands under the group, each with its own room and its own regulars."}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
          {CHILD_BRANDS.map((brand, i) => (
            <Reveal key={brand.key} delay={0.1 + i * 0.08}>
              <Panel brand={brand} cursor={cursor} hasHover={hasHover} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
