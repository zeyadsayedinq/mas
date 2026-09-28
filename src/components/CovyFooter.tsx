import { Link } from "react-router-dom";
import Sparkle from "./Sparkle";
import { BRANDS } from "../brands";
import { CONTACT_DETAILS } from "../config";
import monogram from "../assets/brand/covy-monogram-greige.png";
import type { Brand } from "../brands";

/**
 * COVY's footer. Aroma's is a loud, coloured send-off; this is a closing
 * page: centred, hairline-ruled, a single monogram rising out of the bottom
 * edge, and nothing that moves.
 */
export default function CovyFooter({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <footer className="relative overflow-hidden" style={{ background: ui.bg }}>
      {/* the monogram, half sunk into the floor */}
      <img
        src={monogram}
        alt=""
        aria-hidden
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[38%] w-[420px] sm:w-[560px] max-w-none"
        style={{ opacity: 0.07 }}
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-10 pt-20 sm:pt-28 pb-10 flex flex-col items-center text-center">
        <div className="flex items-center gap-5 w-full max-w-md mb-10">
          <span className="h-px flex-1" style={{ background: ui.line }} />
          <Sparkle size={16} color={brand.accent} className="covy-twinkle" />
          <span className="h-px flex-1" style={{ background: ui.line }} />
        </div>

        <img src={brand.logoReversed ?? brand.logo} alt={brand.name} className="h-14 sm:h-20 w-auto" />
        <p className="mt-6 font-playfair italic text-2xl sm:text-3xl" style={{ color: ui.text }}>
          Lounge and late kitchen
        </p>
        <p className="mt-2 font-almarai text-sm" style={{ color: ui.textFaint }}>
          {brand.nameAr}
        </p>

        <nav aria-label="Footer" className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-3">
          {brand.nav.map((n) => (
            <button
              key={n.label}
              onClick={() => go(n.target)}
              className="text-[11px] uppercase tracking-[0.26em] transition-opacity opacity-75 hover:opacity-100"
              style={{ color: ui.text }}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-x-8 gap-y-2 text-sm" style={{ color: ui.textMuted }}>
          <a href={`mailto:${CONTACT_DETAILS.email}`}>{CONTACT_DETAILS.email}</a>
          <span aria-hidden className="hidden sm:inline" style={{ color: ui.textFaint }}>·</span>
          <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`}>{CONTACT_DETAILS.phone}</a>
          <span aria-hidden className="hidden sm:inline" style={{ color: ui.textFaint }}>·</span>
          <span>{CONTACT_DETAILS.address}</span>
        </div>

        <Link
          to="/"
          className="mt-10 text-[10px] uppercase tracking-[0.3em] opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: ui.textFaint }}
        >
          A {BRANDS.mas.name} brand
        </Link>

        <p className="mt-16 sm:mt-24 text-xs" style={{ color: ui.textFaint }}>
          © {new Date().getFullYear()} {BRANDS.mas.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
