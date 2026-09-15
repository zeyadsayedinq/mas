import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ArrowUpLeft } from "lucide-react";
import type { Brand } from "../brands";

interface NavProps {
  brand: Brand;
  /** Brand pages show a link back up to the group. */
  showParentLink?: boolean;
}

/** Cup mark. The group identity reads as food and drink, not as an abstract glyph. */
function Mark({ size = 26 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M64 112c0-8.8 7.2-16 16-16h96c8.8 0 16 7.2 16 16v8c0 30-24 54-54 54h-20c-30 0-54-24-54-54z"
        fill="currentColor"
      />
      <path
        d="M192 120h10a22 22 0 0 1 0 44h-14"
        stroke="currentColor"
        strokeWidth={12}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M96 40c0 10-12 10-12 20s12 10 12 20"
        stroke="currentColor"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M132 40c0 10-12 10-12 20s12 10 12 20"
        stroke="currentColor"
        strokeWidth={10}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function scrollToSection(id: string) {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Nav({ brand, showParentLink = false }: NavProps) {
  const [open, setOpen] = useState(false);

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
          <Link
            to={brand.path}
            className="flex items-center gap-2 text-white"
            aria-label={brand.name}
          >
            {brand.logo ? (
              /* The supplied lockup, reversed to white the way a brand's own
                 dark-background version would be. True colours appear on the
                 light plate further down the page. */
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-8 sm:h-10 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            ) : (
              <>
                <Mark />
                <span className="text-white text-xl sm:text-2xl font-playfair italic">
                  {brand.name}
                </span>
              </>
            )}
          </Link>

          {showParentLink && (
            <Link
              to="/"
              className="hidden lg:flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-white/55 hover:text-white/90 transition-colors border-l border-white/20 pl-3 ml-1"
            >
              <ArrowUpLeft size={13} />
              MAS Egypt
            </Link>
          )}
        </div>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-md border border-white/30 rounded-full px-2 py-2 items-center gap-1">
          {brand.nav.map((item, i) => (
            <button
              key={item.label}
              onClick={() => go(item.target)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                i === 0
                  ? "text-white"
                  : "text-white/80 hover:bg-white/20 hover:text-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => go("contact")}
          className="hidden md:block bg-white text-gray-900 text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
        >
          {brand.navCta}
        </button>

        <button
          onClick={() => setOpen(true)}
          className="md:hidden text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Open menu"
          aria-expanded={open}
        >
          <Menu size={22} />
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 z-[110] bg-black/92 backdrop-blur-sm md:hidden flex flex-col">
          <div className="flex items-center justify-between p-4">
            <span className="flex items-center gap-2 text-white">
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-7 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              ) : (
                <>
                  <Mark size={24} />
                  <span className="text-xl font-playfair italic">{brand.name}</span>
                </>
              )}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-white p-2 rounded-full hover:bg-white/10"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-2 px-7 pb-24">
            {brand.nav.map((item) => (
              <button
                key={item.label}
                onClick={() => go(item.target)}
                className="text-left text-white/90 text-3xl font-playfair italic py-2.5 border-b border-white/10 hover:text-white"
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => go("contact")}
              className="mt-6 self-start text-sm font-semibold px-7 py-3 rounded-full"
              style={{ background: brand.accent, color: brand.accentText }}
            >
              {brand.navCta}
            </button>

            {showParentLink && (
              <Link
                to="/"
                onClick={() => setOpen(false)}
                className="mt-6 text-xs uppercase tracking-[0.16em] text-white/50"
              >
                Back to MAS Egypt
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
