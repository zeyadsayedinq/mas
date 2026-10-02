import { Link } from "react-router-dom";
import { AtSign, ArrowUpRight, Phone, Mail, MessageCircle, Users } from "lucide-react";
import { OpenNowBadge, directionsUrl } from "./Branches";
import { whatsappUrl } from "../branches";
import { BRANDS } from "../brands";
import { CONFIRMED, CONTACT_DETAILS, SOCIAL, live } from "../config";
import { useLang } from "../i18n";
import { useBrand, useBranches, branchLive } from "../localize";
import { track } from "../track";
import type { Brand } from "../brands";

const WORDS: [string, string][] = [
  ["Coffee", "قهوة"],
  ["Feteer", "فطير"],
  ["Grill", "مشويات"],
  ["Fresh juice", "عصير فريش"],
  ["Shisha", "شيشة"],
  ["Desks with wifi", "مكاتب بواي فاي"],
];

/**
 * Aroma's footer. A last, cheerful push: a wavy edge, a script sign-off, a
 * call to book, the branches (open state and phone only once confirmed), and a
 * ribbon of the things on offer that keeps moving underneath.
 */
export default function AromaFooter({ brand }: { brand: Brand }) {
  const { tr, ar, href } = useLang();
  const copy = useBrand("aroma");
  const branches = useBranches();
  const ui = brand.ui;
  const tint = "#EEF4E1";
  const deep = "#5d7a2b";
  const handle = SOCIAL.aroma.instagram || brand.instagram;
  const email = live(CONFIRMED.email);
  const phone = live(CONFIRMED.phone);

  const go = (id: string) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (id === "top") return window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  const writeToUs = () => {
    window.dispatchEvent(new CustomEvent("aroma:reserve", { detail: { tab: "other" } }));
    go("reserve");
  };

  return (
    <footer className="relative" style={{ background: ui.bg }}>
      <svg aria-hidden viewBox="0 0 1440 90" preserveAspectRatio="none" className="block w-full h-[46px] sm:h-[70px]" style={{ background: ui.bg }}>
        <path d="M0,50 C120,10 240,10 360,44 C480,78 600,80 720,48 C840,16 960,12 1080,42 C1200,72 1320,74 1440,40 L1440,90 L0,90 Z" fill={tint} />
      </svg>

      <div style={{ background: tint }}>
        <div className="mx-auto max-w-6xl px-5 sm:px-10 md:px-14 pt-6 pb-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] items-end pb-12 sm:pb-16 border-b" style={{ borderColor: ui.line }}>
            <div>
              <p className="font-playfair text-4xl sm:text-5xl -rotate-2 origin-left rtl:origin-right rtl:rotate-2 mb-1" style={{ color: deep }}>
                {tr("see you soon", "نشوفك قريب")}
              </p>
              <h2 className={`text-4xl ${ar ? "sm:text-5xl" : "sm:text-6xl"} leading-[1.02] tracking-[-0.03em]`} style={{ color: ui.text }}>
                {tr("Come hungry.", "تعالى جعان.")}
                <br />
                {tr("Stay for the wifi.", "وخليك عشان الواي فاي.")}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <button
                onClick={() => go("reserve")}
                className="text-sm font-medium px-7 min-h-[48px] rounded-full transition-transform hover:scale-[1.04] active:scale-95"
                style={{ background: brand.accent, color: brand.accentText, boxShadow: "0 12px 26px -12px rgba(108,138,53,0.7)" }}
              >
                {tr("Reserve a table", "احجز ترابيزة")}
              </button>
              <button
                onClick={() => go("menu")}
                className="text-sm font-medium px-7 min-h-[48px] rounded-full border bg-white transition-transform hover:scale-[1.04] active:scale-95"
                style={{ borderColor: `${brand.accent}88`, color: ui.text }}
              >
                {tr("See the menu", "شوف المنيو")}
              </button>
            </div>
          </div>

          <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)_minmax(0,1fr)] pt-12">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] mb-5 font-semibold" style={{ color: deep }}>
                {tr("Two rooms", "فرعين")}
              </p>
              <ul className="space-y-5">
                {branches.map((b) => (
                  <li key={b.key} className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div className="min-w-[180px]">
                      <p className="text-[17px] font-semibold leading-tight" style={{ color: ui.text }}>{b.name}</p>
                      <p className="text-sm mt-0.5" style={{ color: ui.textMuted }}>
                        {branchLive(b, "address") ? b.address : b.area}
                      </p>
                    </div>
                    <OpenNowBadge branch={b} brand={brand} />
                    <a
                      href={directionsUrl(b)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track("directions_click", { branch: b.key, from: "footer" })}
                      className="inline-flex items-center gap-1 text-sm font-medium min-h-[44px]"
                      style={{ color: deep }}
                    >
                      {tr("Directions", "الاتجاهات")} <ArrowUpRight size={14} aria-hidden className="rtl:-scale-x-100" />
                    </a>
                    {branchLive(b, "phone") && (
                      <a
                        href={`tel:${b.phone.replace(/\s/g, "")}`}
                        onClick={() => track("call_click", { branch: b.key, from: "footer" })}
                        className="inline-flex items-center gap-1.5 text-sm min-h-[44px]"
                        style={{ color: ui.text }}
                        dir="ltr"
                      >
                        <Phone size={14} aria-hidden style={{ color: brand.accent }} /> {b.phone}
                      </a>
                    )}
                    {branchLive(b, "whatsapp") && (
                      <a
                        href={whatsappUrl(b, tr(`Hi, I'd like to ask about ${b.name}.`, `أهلًا، عايز أسأل عن ${b.name}.`))}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => track("whatsapp_click", { branch: b.key, from: "footer" })}
                        aria-label={tr(`WhatsApp ${b.name}`, `واتساب ${b.name}`)}
                        className="inline-flex items-center justify-center h-11 w-11 rounded-full"
                        style={{ color: deep }}
                      >
                        <MessageCircle size={17} aria-hidden />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] mb-5 font-semibold" style={{ color: deep }}>
                {tr("Around the room", "في المكان")}
              </p>
              <ul className="space-y-1">
                {copy.nav.map((n) => (
                  <li key={n.target}>
                    <button onClick={() => go(n.target)} className="text-[15px] min-h-[40px] hover:underline underline-offset-4" style={{ color: ui.text }}>
                      {n.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] mb-5 font-semibold" style={{ color: deep }}>
                {tr("Say hello", "سلّم علينا")}
              </p>
              <ul className="space-y-3 text-[15px]">
                {email && (
                  <li className="flex items-center gap-2.5">
                    <Mail size={16} aria-hidden style={{ color: brand.accent }} />
                    <a href={`mailto:${CONTACT_DETAILS.email}`} style={{ color: ui.text }} dir="ltr">{CONTACT_DETAILS.email}</a>
                  </li>
                )}
                {phone && (
                  <li className="flex items-center gap-2.5">
                    <Phone size={16} aria-hidden style={{ color: brand.accent }} />
                    <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`} onClick={() => track("call_click", { from: "footer" })} style={{ color: ui.text }} dir="ltr">
                      {CONTACT_DETAILS.phone}
                    </a>
                  </li>
                )}
                {handle && (
                  <li className="flex items-center gap-2.5">
                    <AtSign size={16} aria-hidden style={{ color: brand.accent }} />
                    <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer" style={{ color: ui.text }} dir="ltr">@{handle}</a>
                  </li>
                )}
                <li>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: ui.textMuted }}>
                    {tr("Groups, events, or beans by the bag?", "مجموعات، مناسبات، أو بن بالكيس؟")}
                  </p>
                  <button
                    onClick={writeToUs}
                    className="inline-flex items-center gap-2 text-sm font-medium px-5 min-h-[44px] rounded-full border bg-white transition-transform hover:scale-[1.03] active:scale-95"
                    style={{ borderColor: `${brand.accent}88`, color: ui.text }}
                  >
                    <Users size={15} aria-hidden style={{ color: deep }} />
                    {tr("Write to us", "ابعتلنا")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* The ribbon. Kept left-to-right so the loop is seamless in Arabic too. */}
        <div className="overflow-hidden py-4 select-none" style={{ background: brand.accent }} aria-hidden dir="ltr">
          <div className="marquee-track flex w-max items-center">
            {[0, 1].map((k) => (
              <div key={k} className="flex items-center shrink-0">
                {WORDS.map(([en, arw]) => (
                  <span key={`${k}-${en}`} className="flex items-center">
                    <span className="font-playfair text-2xl sm:text-3xl px-6 text-white" dir={ar ? "rtl" : "ltr"}>{ar ? arw : en}</span>
                    {brand.mark && <img src={brand.mark} alt="" className="h-7 w-7 object-contain" style={{ filter: "brightness(0) invert(1)" }} />}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-5 sm:px-10 md:px-14 py-10 flex flex-col items-center text-center">
          <img src={brand.logo} alt={copy.name} className="h-24 sm:h-32 w-auto" />
          <div className="mt-6 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs" style={{ color: ui.textFaint }}>
            <p>
              © {new Date().getFullYear()} {ar ? BRANDS.mas.nameAr : BRANDS.mas.name}. {tr("All rights reserved.", "جميع الحقوق محفوظة.")}
            </p>
            <Link to={href("/")} className="uppercase tracking-[0.18em] hover:opacity-100 opacity-80 min-h-[44px] inline-flex items-center justify-center">
              {tr(`A ${BRANDS.mas.name} brand`, `إحدى علامات ${BRANDS.mas.nameAr}`)}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
