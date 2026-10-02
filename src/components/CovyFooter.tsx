import { Link } from "../router";
import { AtSign } from "lucide-react";
import Sparkle from "./Sparkle";
import { CONFIRMED, CONTACT_DETAILS, SOCIAL, live } from "../config";
import { useLang } from "../i18n";
import { track } from "../track";
import monogram from "../assets/brand/covy-monogram-greige.webp";
import type { Brand } from "../brands";

/**
 * COVY's footer: a closing page. Centred, hairline-ruled, a single monogram
 * sinking into the bottom edge. Contact lines only appear once confirmed in
 * config.ts.
 */
export default function CovyFooter({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const { tr, href } = useLang();
  const go = (id: string) =>
    id === "top"
      ? window.scrollTo({ top: 0, behavior: "smooth" })
      : document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const email = live(CONFIRMED.email) ? CONTACT_DETAILS.email : "";
  const phone = live(CONFIRMED.phone) ? CONTACT_DETAILS.phone : "";
  const insta = SOCIAL.covy.instagram;
  const details = [
    email && (
      <a key="e" href={`mailto:${email}`} className="hover:opacity-100 opacity-90" dir="ltr">
        {email}
      </a>
    ),
    phone && (
      <a key="p" href={`tel:${phone.replace(/\s/g, "")}`} onClick={() => track("call_click", { brand: "covy" })} className="hover:opacity-100 opacity-90" dir="ltr">
        {phone}
      </a>
    ),
    insta && (
      <a key="i" href={`https://instagram.com/${insta}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:opacity-100 opacity-90">
        <AtSign size={14} />
        {insta}
      </a>
    ),
  ].filter(Boolean);

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

      <div className="relative mx-auto max-w-4xl px-5 sm:px-10 pt-20 sm:pt-28 pb-24 sm:pb-12 flex flex-col items-center text-center">
        <div className="flex items-center gap-5 w-full max-w-md mb-10">
          <span className="h-px flex-1" style={{ background: ui.line }} />
          <Sparkle size={16} color={brand.accent} className="covy-twinkle" />
          <span className="h-px flex-1" style={{ background: ui.line }} />
        </div>

        <img src={brand.logoReversed ?? brand.logo} alt={tr("COVY", "كوفي")} className="h-14 sm:h-20 w-auto" />
        <p className="mt-6 font-playfair italic text-2xl sm:text-3xl" style={{ color: ui.text }}>
          {tr("Lounge and late kitchen", "لاونج ومطبخ لآخر الليل")}
        </p>
        <p className="mt-2 text-sm" style={{ color: ui.textFaint }}>
          {tr("كوفي", "COVY")}
        </p>

        <nav aria-label={tr("Footer", "روابط الصفحة")} className="mt-10 flex flex-wrap justify-center gap-x-7 gap-y-1">
          {brand.nav.map((n) => (
            <button
              key={n.target}
              onClick={() => go(n.target)}
              className="min-h-[44px] text-[11px] uppercase tracking-[0.26em] transition-opacity opacity-75 hover:opacity-100"
              style={{ color: ui.text }}
            >
              {n.label}
            </button>
          ))}
        </nav>

        {details.length > 0 && (
          <div className="mt-8 flex flex-col sm:flex-row items-center gap-x-8 gap-y-2 text-sm" style={{ color: ui.textMuted }}>
            {details}
          </div>
        )}

        <Link
          to={href("/")}
          className="mt-10 min-h-[44px] inline-flex items-center text-[10px] uppercase tracking-[0.3em] opacity-80 hover:opacity-100 transition-opacity"
          style={{ color: ui.textMuted }}
        >
          {tr("A MAS Egypt brand", "إحدى علامات ماس مصر")}
        </Link>

        <p className="mt-12 sm:mt-20 text-xs" style={{ color: ui.textFaint }}>
          © {new Date().getFullYear()} {tr("MAS Egypt. All rights reserved.", "ماس مصر. جميع الحقوق محفوظة.")}
        </p>
      </div>
    </footer>
  );
}
