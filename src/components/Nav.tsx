import { useEffect, useState } from "react";
import { Link, useLocation } from "../router";
import { useLang } from "../i18n";
import { track } from "../track";
import { Menu, X, ArrowUpLeft, AtSign } from "lucide-react";
import { buttonColors, displayClass, type Brand } from "../brands";

interface NavProps {
  brand: Brand;
  /** Brand pages show a link back up to the group. */
  showParentLink?: boolean;
  /**
   * Light pages need dark nav text. Defaults to the brand's own scheme, but
   * Aroma's hero is bright at the top so it overrides this itself.
   */
  onLight?: boolean;
}

/**
 * The group lockup: the drawn wordmark with the Archivo descriptor under it.
 *
 * The identity manual sets the descriptor in Archivo 500 tracked +0.3em, at 9%
 * of the wordmark's width, aligned to its left edge. The mark itself is drawn
 * artwork and is never re-set from a font, so it ships as SVG and is only ever
 * swapped between the supplied colourways, never recoloured.
 */
function Lockup({
  src,
  color,
  small = false,
  descriptor = true,
}: {
  src: string;
  color: string;
  small?: boolean;
  descriptor?: boolean;
}) {
  const { tr } = useLang();
  return (
    <span className="flex flex-col items-start gap-1">
      <img src={src} alt="MAS Egypt" className={small ? "h-5 w-auto" : "h-6 sm:h-7 w-auto"} />
      {descriptor && (
        <span
          className="font-archivo hidden sm:block text-[7px] font-medium uppercase whitespace-nowrap"
          style={{ color, opacity: 0.7, letterSpacing: "0.3em" }}
        >
          {tr("Egypt · Food & Beverage Group", "مصر · مجموعة أغذية ومشروبات")}
        </span>
      )}
    </span>
  );
}

/** Hex to rgba, so translucent grounds can follow the brand's own surface. */
function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function scrollToSection(id: string) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** EN | ع switch, pointing at the same page in the other language. */
function LangSwitch({ color, bg, big = false }: { color: string; bg: string; big?: boolean }) {
  const { ar, swap } = useLang();
  const { pathname, hash } = useLocation();
  return (
    <Link
      to={swap(pathname) + hash}
      onClick={() => track("language_switch", { to: ar ? "en" : "ar" })}
      className={big ? "text-sm font-semibold px-5 py-2.5 rounded-full border" : "text-[13px] font-semibold w-10 h-10 grid place-items-center rounded-full"}
      style={{ color, background: big ? "transparent" : bg, borderColor: big ? color : undefined }}
      lang={ar ? "en" : "ar"}
      aria-label={ar ? "English version" : "النسخة العربية"}
    >
      {ar ? "EN" : big ? "العربية" : "ع"}
    </Link>
  );
}

export default function Nav({ brand, showParentLink = false, onLight }: NavProps) {
  const [open, setOpen] = useState(false);
  const { tr, href } = useLang();
  const light = onLight ?? brand.ui.scheme === "light";

  // On a light page the logo keeps its real colours. On a dark one it is
  // reversed to white, the way a brand's own dark version would be.
  // A dark page keeps the reversed logo even though its nav bar is solid.
  const darkUi = brand.ui.scheme === "dark";
  // A brand that ships its own reversed artwork uses it; otherwise the mark is
  // turned white, the way a dark version would be.
  const ownReversed = darkUi && !!brand.logoReversed;
  const logoSrc = ownReversed ? brand.logoReversed : brand.logo;
  const logoFilter = ownReversed || (light && !darkUi) ? undefined : "brightness(0) invert(1)";
  const fg = light ? brand.ui.text : "#ffffff";
  const fgMuted = light ? brand.ui.textMuted : "rgba(255,255,255,0.8)";
  const pillBg = darkUi ? "rgba(255,255,255,0.08)" : light ? "rgba(0,0,0,0.045)" : "rgba(255,255,255,0.2)";
  const pillLine = light ? brand.ui.line : "rgba(255,255,255,0.3)";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Rotating an iPad into landscape switches to the full bar, so the overlay
  // must not be left open behind it with the page locked.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const go = (target: string) => {
    setOpen(false);
    scrollToSection(target);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:px-6 sm:py-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]"
        style={light ? { background: hexToRgba(brand.ui.bg, 0.97), borderBottom: `1px solid ${brand.ui.line}` } : undefined}
      >
        <div className="flex items-center gap-3">
          <Link to={href(brand.path)} className="flex items-center gap-2" style={{ color: fg }} aria-label={brand.name}>
            {brand.key === "mas" ? (
              <Lockup src={light ? brand.logo! : brand.logoReversed ?? brand.logo!} color={fg} />
            ) : (
              <img src={logoSrc} alt={brand.name} className="h-8 sm:h-10 w-auto" style={{ filter: logoFilter }} />
            )}
          </Link>

          {showParentLink && (
            <Link
              to={href("/")}
              className="hidden xl:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] transition-opacity hover:opacity-100 opacity-60 border-s ps-3 ms-1"
              style={{ color: fg, borderColor: pillLine }}
            >
              <ArrowUpLeft size={13} className="rtl:-scale-x-100" />
              {tr("MAS Egypt", "ماس مصر")}
            </Link>
          )}
        </div>

        <div
          className="hidden lg:flex absolute left-1/2 -translate-x-1/2 border rounded-full px-2 py-2 items-center gap-1"
          style={{ background: pillBg, borderColor: pillLine }}
        >
          {brand.nav.map((item, i) => (
            <button
              key={item.label}
              onClick={() => go(item.target)}
              className="font-archivo px-4 py-1.5 rounded-full text-[13px] font-medium whitespace-nowrap transition-colors hover:opacity-100"
              style={{ color: i === 0 ? fg : fgMuted }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <LangSwitch color={fg} bg={pillBg} />
          {brand.instagram && (
            <a
              href={`https://instagram.com/${brand.instagram}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`${brand.name} on Instagram`}
              className="p-2.5 rounded-full transition-colors"
              style={{ color: fg, background: pillBg }}
            >
              <AtSign size={17} />
            </a>
          )}
          <button
            onClick={() => { track("nav_cta", { brand: brand.key }); go(brand.key === "aroma" ? "reserve" : "contact"); }}
            className="font-archivo text-[13px] font-semibold px-6 py-2.5 rounded-full transition-transform hover:scale-[1.02]"
            style={light ? buttonColors(brand) : { background: "#ffffff", color: "#111827" }}
          >
            {brand.navCta}
          </button>
        </div>

        <div className="lg:hidden flex items-center gap-1">
          <LangSwitch color={fg} bg="transparent" />
          <button
            onClick={() => setOpen(true)}
            className="p-3 -me-2 rounded-full"
            style={{ color: fg }}
            aria-label={tr("Open menu", "افتح القائمة")}
            aria-expanded={open}
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {open && (
        <div
          className="fixed inset-0 z-[110] lg:hidden flex flex-col overflow-y-auto overscroll-contain safe-top safe-bottom"
          style={{ background: light ? hexToRgba(brand.ui.bg, 0.97) : "rgba(0,0,0,0.94)" }}
        >
          <div className="flex items-center justify-between p-4">
            <span className="flex items-center gap-2" style={{ color: fg }}>
              {brand.key === "mas" ? (
                <Lockup src={light ? brand.logo! : brand.logoReversed ?? brand.logo!} color={fg} small descriptor={false} />
              ) : (
                <img src={logoSrc} alt={brand.name} className="h-8 w-auto" style={{ filter: logoFilter }} />
              )}
            </span>
            <button onClick={() => setOpen(false)} className="p-3 -me-2 rounded-full" style={{ color: fg }} aria-label={tr("Close menu", "اقفل القائمة")}>
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-2 px-7 pb-16 sm:px-12 max-w-xl w-full mx-auto">
            {brand.nav.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.target)}
                className={`text-start text-3xl py-3 border-b ${displayClass(brand.ui) || "font-medium tracking-[-0.02em]"}`}
                style={{ color: fg, borderColor: pillLine }}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => { track("nav_cta", { brand: brand.key }); go(brand.key === "aroma" ? "reserve" : "contact"); }}
              className="mt-6 self-start text-sm font-semibold px-7 py-3 rounded-full"
              style={buttonColors(brand)}
            >
              {brand.navCta}
            </button>

            <div className="mt-6 flex flex-wrap items-center gap-5">
              <LangSwitch color={fg} bg="transparent" big />
              {brand.instagram && (
                <a
                  href={`https://instagram.com/${brand.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs uppercase tracking-[0.16em]"
                  style={{ color: fgMuted }}
                >
                  <AtSign size={15} />
                  Instagram
                </a>
              )}
              {showParentLink && (
                <Link
                  to={href("/")}
                  onClick={() => setOpen(false)}
                  className="text-xs uppercase tracking-[0.16em]"
                  style={{ color: fgMuted }}
                >
                  {tr("Back to MAS Egypt", "رجوع لماس مصر")}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
