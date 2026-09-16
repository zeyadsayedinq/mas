import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpLeft, AtSign } from "lucide-react";
import type { Brand } from "../brands";

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

function scrollToSection(id: string) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Nav({ brand, showParentLink = false, onLight }: NavProps) {
  const [open, setOpen] = useState(false);
  const light = onLight ?? brand.ui.scheme === "light";

  // On a light page the logo keeps its real colours. On a dark one it is
  // reversed to white, the way a brand's own dark version would be.
  const logoFilter = light || brand.key === "mas" ? undefined : "brightness(0) invert(1)";
  const fg = light ? brand.ui.text : "#ffffff";
  const fgMuted = light ? brand.ui.textMuted : "rgba(255,255,255,0.8)";
  const pillBg = light ? "rgba(35,48,26,0.06)" : "rgba(255,255,255,0.2)";
  const pillLine = light ? "rgba(35,48,26,0.12)" : "rgba(255,255,255,0.3)";

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (target: string) => {
    setOpen(false);
    scrollToSection(target);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Link to={brand.path} className="flex items-center gap-2" style={{ color: fg }} aria-label={brand.name}>
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="h-8 sm:h-10 w-auto" style={{ filter: logoFilter }} />
            ) : brand.mark ? (
              <img src={brand.mark} alt={brand.name} className="h-8 sm:h-10 w-auto" style={{ filter: logoFilter }} />
            ) : (
              <span className="text-xl sm:text-2xl font-playfair italic">{brand.name}</span>
            )}
          </Link>

          {showParentLink && (
            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] transition-opacity hover:opacity-100 opacity-60 border-l pl-3 ml-1"
              style={{ color: fg, borderColor: pillLine }}
            >
              <ArrowUpLeft size={13} />
              MAS Egypt
            </Link>
          )}
        </div>

        <div
          className="hidden md:flex absolute left-1/2 -translate-x-1/2 backdrop-blur-md border rounded-full px-2 py-2 items-center gap-1"
          style={{ background: pillBg, borderColor: pillLine }}
        >
          {brand.nav.map((item, i) => (
            <button
              key={item.label}
              onClick={() => go(item.target)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors hover:opacity-100"
              style={{ color: i === 0 ? fg : fgMuted }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-2">
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
            onClick={() => go(brand.key === "aroma" ? "reserve" : "contact")}
            className="text-sm font-semibold px-6 py-2.5 rounded-full transition-transform hover:scale-[1.02]"
            style={
              light
                ? { background: brand.accent, color: brand.accentText }
                : { background: "#ffffff", color: "#111827" }
            }
          >
            {brand.navCta}
          </button>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden p-2 rounded-full"
          style={{ color: fg }}
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu size={22} />
        </button>
      </nav>

      {open && (
        <div
          className="fixed inset-0 z-[110] backdrop-blur-sm md:hidden flex flex-col"
          style={{ background: light ? "rgba(250,246,239,0.97)" : "rgba(0,0,0,0.94)" }}
        >
          <div className="flex items-center justify-between p-4">
            <span className="flex items-center gap-2" style={{ color: fg }}>
              {brand.logo ? (
                <img src={brand.logo} alt={brand.name} className="h-8 w-auto" style={{ filter: logoFilter }} />
              ) : brand.mark ? (
                <img src={brand.mark} alt={brand.name} className="h-8 w-auto" style={{ filter: logoFilter }} />
              ) : (
                <span className="text-xl font-playfair italic">{brand.name}</span>
              )}
            </span>
            <button onClick={() => setOpen(false)} className="p-2 rounded-full" style={{ color: fg }} aria-label="Close menu">
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-2 px-7 pb-24">
            {brand.nav.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.target)}
                className="text-left text-3xl font-playfair italic py-2.5 border-b"
                style={{ color: fg, borderColor: pillLine }}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => go(brand.key === "aroma" ? "reserve" : "contact")}
              className="mt-6 self-start text-sm font-semibold px-7 py-3 rounded-full"
              style={{ background: brand.accent, color: brand.accentText }}
            >
              {brand.navCta}
            </button>

            <div className="mt-6 flex items-center gap-5">
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
                  to="/"
                  onClick={() => setOpen(false)}
                  className="text-xs uppercase tracking-[0.16em]"
                  style={{ color: fgMuted }}
                >
                  Back to MAS Egypt
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
