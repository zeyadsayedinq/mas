import { Link } from "react-router-dom";
import { AtSign, ArrowUpRight, Phone, Mail } from "lucide-react";
import { OpenNowBadge } from "./Branches";
import { BRANCHES, mapsUrl } from "../branches";
import { BRANDS } from "../brands";
import { CONTACT_DETAILS } from "../config";
import type { Brand } from "../brands";

const WORDS = ["Coffee", "Feteer", "Grill", "Fresh juice", "Shisha", "Desks with wifi"];

/**
 * Aroma's footer. Where COVY's is a quiet centred closing page, this one is a
 * last, cheerful push: a wavy edge, a script sign-off, a call to book, the
 * branches with their live open state, and a ribbon of the things on offer
 * that keeps moving underneath.
 */
export default function AromaFooter({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const tint = "#EEF4E1";
  const go = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <footer className="relative" style={{ background: ui.bg }}>
      {/* the wavy edge */}
      <svg aria-hidden viewBox="0 0 1440 90" preserveAspectRatio="none" className="block w-full h-[46px] sm:h-[70px]" style={{ background: ui.bg }}>
        <path d="M0,50 C120,10 240,10 360,44 C480,78 600,80 720,48 C840,16 960,12 1080,42 C1200,72 1320,74 1440,40 L1440,90 L0,90 Z" fill={tint} />
      </svg>

      <div style={{ background: tint }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-10 md:px-14 pt-6 pb-10">
          {/* sign-off and call to book */}
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-end pb-12 sm:pb-16 border-b" style={{ borderColor: ui.line }}>
            <div>
              <p className="font-playfair text-4xl sm:text-5xl -rotate-2 origin-left mb-1" style={{ color: "#6c8a35" }}>
                see you soon
              </p>
              <h2 className="text-4xl sm:text-6xl leading-[1.02] tracking-[-0.03em]" style={{ color: ui.text }}>
                Come hungry.
                <br />
                Stay for the wifi.
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button
                onClick={() => go("reserve")}
                className="text-sm font-medium px-7 py-3.5 rounded-full transition-transform hover:scale-[1.04] active:scale-95"
                style={{ background: brand.accent, color: brand.accentText, boxShadow: "0 12px 26px -12px rgba(108,138,53,0.7)" }}
              >
                Reserve a table
              </button>
              <button
                onClick={() => go("menu")}
                className="text-sm font-medium px-7 py-3.5 rounded-full border bg-white transition-transform hover:scale-[1.04] active:scale-95"
                style={{ borderColor: `${brand.accent}88`, color: ui.text }}
              >
                See the menu
              </button>
            </div>
          </div>

          {/* columns */}
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(0,1fr)] pt-12">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] mb-5 font-semibold" style={{ color: "#6c8a35" }}>
                Two rooms
              </p>
              <ul className="space-y-5">
                {BRANCHES.map((b) => (
                  <li key={b.key} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="min-w-[180px]">
                      <p className="text-[17px] font-semibold leading-tight" style={{ color: ui.text }}>
                        {b.name}
                      </p>
                      <p className="text-sm mt-0.5" style={{ color: ui.textMuted }}>
                        {b.area}
                      </p>
                    </div>
                    <OpenNowBadge branch={b} brand={brand} />
                    <a
                      href={mapsUrl(b)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium"
                      style={{ color: "#6c8a35" }}
                    >
                      Directions <ArrowUpRight size={14} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] mb-5 font-semibold" style={{ color: "#6c8a35" }}>
                Around the room
              </p>
              <ul className="space-y-2.5">
                {brand.nav.map((n) => (
                  <li key={n.label}>
                    <button onClick={() => go(n.target === "top" ? "top" : n.target)} className="text-[15px] hover:underline underline-offset-4" style={{ color: ui.text }}>
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] mb-5 font-semibold" style={{ color: "#6c8a35" }}>
                Say hello
              </p>
              <ul className="space-y-3 text-[15px]">
                <li className="flex items-center gap-2.5">
                  <Mail size={16} style={{ color: brand.accent }} />
                  <a href={`mailto:${CONTACT_DETAILS.email}`} style={{ color: ui.text }}>{CONTACT_DETAILS.email}</a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={16} style={{ color: brand.accent }} />
                  <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`} style={{ color: ui.text }}>{CONTACT_DETAILS.phone}</a>
                </li>
                {brand.instagram && (
                  <li className="flex items-center gap-2.5">
                    <AtSign size={16} style={{ color: brand.accent }} />
                    <a href={`https://instagram.com/${brand.instagram}`} target="_blank" rel="noreferrer" style={{ color: ui.text }}>@{brand.instagram}</a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* the ribbon */}
        <div className="overflow-hidden py-4 select-none" style={{ background: brand.accent }} aria-hidden>
          <div className="marquee-track flex w-max items-center">
            {[0, 1].map((k) => (
              <div key={k} className="flex items-center shrink-0">
                {WORDS.map((w) => (
                  <span key={`${k}-${w}`} className="flex items-center">
                    <span className="font-playfair text-2xl sm:text-3xl px-6 text-white">{w}</span>
                    {brand.mark && <img src={brand.mark} alt="" className="h-7 w-7 object-contain" style={{ filter: "brightness(0) invert(1)" }} />}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-10 md:px-14 py-10 flex flex-col items-center text-center">
          <img src={brand.logo} alt={brand.name} className="h-24 sm:h-32 w-auto" />
          <div className="mt-6 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs" style={{ color: ui.textFaint }}>
            <p>© {new Date().getFullYear()} {BRANDS.mas.name}. All rights reserved.</p>
            <Link to="/" className="uppercase tracking-[0.18em] hover:opacity-100 opacity-80">
              An {BRANDS.mas.name} brand
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
