import { useEffect, useRef, useState, type ReactNode } from "react";
import { X, ArrowRight, MousePointerClick } from "lucide-react";
import type { MenuItem } from "../menu";

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
  tl: "left-0 top-[18%] sm:left-[4%] md:left-[8%] items-center flex-row",
  tr: "right-0 top-[18%] sm:right-[4%] md:right-[8%] items-center flex-row-reverse",
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
    <div ref={trackRef} style={{ height: `${track * 100}vh`, background: bg }}>
      <div className="sticky top-0 h-screen overflow-hidden" style={{ height: "100dvh" }}>
        <div className="relative w-full h-full flex items-center justify-center">
          <div
            className="absolute inset-x-0 text-center px-5 pointer-events-none"
            style={{
              top: `${10 + (1 - headingShift) * 6}%`,
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
            className="relative rounded-full transition-transform duration-300 hover:scale-[1.03] active:scale-[0.99] focus:outline-none focus-visible:ring-2 w-[76vw] max-w-[500px] sm:w-[50vw] md:w-[42vw]"
            style={{
              transform: `translateY(${lift - (open ? 90 : 26)}px) scale(${scale * (open ? 0.72 : 1)})`,
              transition: "transform 420ms cubic-bezier(0.16,1,0.3,1)",
            }}
          >
            {children}
          </button>

          {/* click affordance, fades out once the card is open */}
          <div
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] pointer-events-none"
            style={{
              bottom: "10%",
              color: textMuted,
              opacity: open ? 0 : Math.min(1, Math.max(0, (progress - 0.32) / 0.12)),
              transition: "opacity 250ms ease",
            }}
          >
            <MousePointerClick size={14} />
            Click to see the menu
          </div>

          {features.map((f, i) => {
            const start = 0.3 + i * 0.13;
            const t = Math.min(1, Math.max(0, (progress - start) / 0.13));
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

          {/* the menu card. Positioning lives on the wrapper so the open/close
              transform below never fights the centring translate. */}
          <div
            className="absolute left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 bottom-6 sm:bottom-10 sm:w-[min(620px,90vw)]"
            style={{ pointerEvents: open ? "auto" : "none" }}
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
                className="shrink-0 p-1.5 rounded-full transition-colors"
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
