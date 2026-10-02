import { useEffect, useRef, useState, type ReactNode } from "react";
import { X, ArrowRight, MousePointerClick } from "lucide-react";
import type { MenuItem } from "../menu";
import { useMediaQuery } from "../hooks/useMediaQuery";

export interface ShowcaseFeature {
  label: string;
  /** Corner the pill flies in from. */
  corner: "tl" | "tr" | "bl" | "br";
  icon: ReactNode;
}

interface ScrollShowcaseProps {
  /** Rendered pinned in the centre while the section scrolls past. */
  children: ReactNode;
  heading: string;
  headingItalic: string;
  features: ShowcaseFeature[];
  bg: string;
  text: string;
  textMuted: string;
  accent: string;
  accentText: string;
  pillBg: string;
  cardBg: string;
  line: string;
  /** Real menu items shown when the product is clicked. */
  items: MenuItem[];
  /** Label on the button that jumps to the full menu. */
  menuLabel: string;
  /** How tall the scroll track is, in viewport heights. */
  track?: number;
}

const CORNER_CLASS: Record<ShowcaseFeature["corner"], string> = {
  tl: "left-0 top-[30%] sm:left-[4%] md:left-[8%] items-center flex-row",
  tr: "right-0 top-[30%] sm:right-[4%] md:right-[8%] items-center flex-row-reverse",
  bl: "left-0 bottom-[24%] sm:left-[4%] md:left-[8%] items-center flex-row",
  br: "right-0 bottom-[24%] sm:right-[4%] md:right-[8%] items-center flex-row-reverse",
};

const CORNER_OFFSET: Record<ShowcaseFeature["corner"], number> = {
  tl: -36,
  tr: 36,
  bl: -36,
  br: 36,
};

/**
 * The pinned product pattern. The product holds the centre of a sticky
 * viewport while the section scrolls, growing slightly, and the feature pills
 * fly in one after another as scroll progress passes each threshold.
 *
 * The product is also a button. Clicking it opens the real menu items for that
 * part of the kitchen, and a way through to the full menu.
 */
export default function ScrollShowcase({
  children,
  heading,
  headingItalic,
  features,
  bg,
  text,
  textMuted,
  accent,
  accentText,
  pillBg,
  cardBg,
  line,
  items,
  menuLabel,
  track = 3,
}: ScrollShowcaseProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  // Phones and every iPad orientation up to 1279px wide. The four corner pills
  // need a desktop-wide stage; anything narrower gets the grid under the product.
  const isPhone = useMediaQuery("(max-width: 1279px)");
  const isTouch = useMediaQuery("(hover: none)");
  const isPortrait = useMediaQuery("(orientation: portrait)");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        setProgress(1);
        return;
      }
      setProgress(Math.min(1, Math.max(0, -rect.top / total)));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  // Close the card when this section scrolls away, so it is never left hanging.
  useEffect(() => {
    if (open && (progress < 0.05 || progress > 0.97)) setOpen(false);
  }, [progress, open]);

  const intro = Math.min(1, progress / 0.32);
  const scale = 0.82 + intro * 0.28;
  const lift = (1 - intro) * 40;
  const headingShift = Math.min(1, progress / 0.5);

  const goToMenu = () => {
    setOpen(false);
    document.getElementById("menu")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={trackRef} style={{ height: `${(isPhone ? track * 0.8 : track) * 100}vh`, background: bg }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ height: "100dvh" }}>
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="absolute inset-x-0 text-center px-5 pointer-events-none"
            style={{
              // Never higher than the nav bar, however short the screen is.
              top: `max(5.25rem, ${10 + (1 - headingShift) * 6}%)`,
              opacity: (0.25 + headingShift * 0.75) * (open ? 0.25 : 1),
              transition: "opacity 250ms ease",
            }}
          >
            <h2 className="leading-[0.95] tracking-[-0.04em]" style={{ color: text }}>
              <span className="block font-playfair italic text-4xl sm:text-6xl md:text-7xl">
                {headingItalic}
              </span>
              <span className="block text-4xl sm:text-6xl md:text-7xl">{heading}</span>
            </h2>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={`${headingItalic} ${heading}. Show menu items`}
            className="relative rounded-full transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99] focus:outline-none focus-visible:ring-2 w-[min(76vw,44dvh)] max-w-[560px] sm:w-[min(54vw,46dvh)] xl:w-[min(42vw,58dvh)] xl:max-w-[500px]"
            style={{
              transform: `translateY(${lift - (open ? 90 : isPhone ? 60 : 26)}px) scale(${scale * (open ? 0.72 : 1)})`,
              transition: "transform 420ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {children}
          </button>

          {/* click affordance, fades out once the card is open */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] pointer-events-none"
            style={{
              // In portrait the reserve bar sits along the bottom, so the hint rides above it.
              bottom: isPhone ? (isPortrait ? "calc(env(safe-area-inset-bottom) + 88px)" : "4%") : "10%",
              color: textMuted,
              opacity: open ? 0 : Math.min(1, Math.max(0, (progress - 0.32) / 0.12)),
              transition: "opacity 250ms ease",
            }}
          >
            <MousePointerClick size={14} />
            {isTouch ? "Tap to see the menu" : "Click to see the menu"}
          </div>

          {features.map((f, i) => {
            const start = 0.3 + i * 0.13;
            const t = Math.min(1, Math.max(0, (progress - start) / 0.13));
            if (isPhone) return null;
            return (
              <div
                key={f.label}
                className={`absolute flex gap-3 ${CORNER_CLASS[f.corner]}`}
                style={{
                  opacity: t * (open ? 0.18 : 1),
                  transform: `translateX(${(1 - t) * CORNER_OFFSET[f.corner]}px)`,
                  transition: "opacity 250ms ease",
                }}
              >
                <span
                  className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: accent, color: accentText }}
                >
                  {f.icon}
                </span>
                <span
                  className="text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl backdrop-blur-sm max-w-[42vw] sm:max-w-none"
                  style={{ background: pillBg, color: textMuted, border: `1px solid ${line}` }}
                >
                  {f.label}
                </span>
              </div>
            );
          })}

          {/* On a phone the four corners are too tight to hold a pill each, so the
              features stack as a two by two grid under the product instead. */}
          {isPhone && (
            <div
              className="absolute left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-[min(680px,92vw)] landscape:sm:w-[min(1080px,94vw)] grid grid-cols-2 landscape:sm:grid-cols-4 gap-2.5 sm:gap-3 pointer-events-none"
              style={{ bottom: "calc(env(safe-area-inset-bottom) + 15%)" }}
            >
              {features.map((f, i) => {
                const start = 0.3 + i * 0.13;
                const t = Math.min(1, Math.max(0, (progress - start) / 0.13));
                return (
                  <div
                    key={f.label}
                    className="flex items-center gap-2.5 sm:gap-3 rounded-xl p-2 sm:p-2.5 backdrop-blur-sm"
                    style={{
                      background: pillBg,
                      border: `1px solid ${line}`,
                      opacity: t * (open ? 0.18 : 1),
                      transform: `translateY(${(1 - t) * 14}px)`,
                      transition: "opacity 250ms ease",
                    }}
                  >
                    <span
                      className="shrink-0 w-9 h-9 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center"
                      style={{ background: accent, color: accentText }}
                    >
                      {f.icon}
                    </span>
                    <span className="text-[11px] sm:text-sm leading-snug font-medium" style={{ color: textMuted }}>
                      {f.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* the menu card. Positioning lives on the wrapper so the open/close
              transform below never fights the centring translate. */}
          <div
            className="absolute left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bottom-6 sm:bottom-10 sm:w-[min(620px,90vw)]"
            style={{ pointerEvents: open ? "auto" : "none", marginBottom: "env(safe-area-inset-bottom)" }}
          >
          <div
            className="rounded-2xl p-5 sm:p-7 shadow-2xl"
            style={{
              background: cardBg,
              border: `1px solid ${line}`,
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(18px)",
              transition: "opacity 300ms ease, transform 420ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <p className="text-lg sm:text-xl font-playfair italic" style={{ color: text }}>
                {headingItalic} {heading}
              </p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="shrink-0 p-2.5 -m-1 rounded-full transition-colors"
                style={{ color: textMuted }}
              >
                <X size={18} />
              </button>
            </div>

            <ul className="space-y-3 mb-6">
              {items.map((item) => (
                <li key={item.name}>
                  <span className="text-sm sm:text-[15px]" style={{ color: text }}>
                    {item.name}
                  </span>
                </li>
              ))}
            </ul>

            <button
              onClick={goToMenu}
              className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full transition-transform hover:scale-[1.02]"
              style={{ background: accent, color: accentText }}
            >
              {menuLabel}
              <ArrowRight size={15} />
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
