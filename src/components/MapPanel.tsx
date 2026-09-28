import type { Branch } from "../branches";
import type { Brand } from "../brands";

interface MapPanelProps {
  brand: Brand;
  branches: Branch[];
  activeKey: string;
  onSelect: (key: string) => void;
}

/**
 * A stylised locator, not a survey map. Pin positions are relative, so
 * Madinaty reads north east of Mivida the way it actually sits, but nothing
 * here is to scale. The real navigation is the "Open in Maps" button on the
 * branch card, which deep links to the live listing.
 *
 * Swap this for a Mapbox map if you want a draggable one that still matches
 * the palette. Google's embed works without a key but brings its own look.
 */
export default function MapPanel({ brand, branches, activeKey, onSelect }: MapPanelProps) {
  const ui = brand.ui;
  const light = ui.scheme === "light";

  const land = light ? "#F2F4EE" : "#161d16";
  const block = light ? "#E7EBDF" : "#1c241b";
  const green = light ? "#DCEBC4" : "#1b2a1a";
  const road = light ? "#FFFFFF" : "#242e23";
  const roadMinor = light ? "#F8F9F5" : "#1f2a1f";

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl border"
      style={{ borderColor: ui.line, background: land, aspectRatio: "4 / 3" }}
    >
      <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full" aria-hidden="true">
        <rect x="0" y="0" width="400" height="300" fill={land} />

        {/* green belts */}
        <ellipse cx="120" cy="90" rx="70" ry="42" fill={green} opacity="0.75" />
        <ellipse cx="300" cy="210" rx="86" ry="50" fill={green} opacity="0.6" />
        <ellipse cx="60" cy="240" rx="55" ry="34" fill={green} opacity="0.5" />

        {/* ring roads */}
        <path
          d="M-10,215 C70,190 140,205 200,170 C260,136 320,120 410,96"
          stroke={road}
          strokeWidth="11"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M-10,120 C80,132 150,96 230,104 C300,111 350,150 410,158"
          stroke={road}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M150,-10 C160,70 130,150 168,310" stroke={roadMinor} strokeWidth="5" fill="none" />
        <path d="M280,-10 C268,80 300,160 276,310" stroke={roadMinor} strokeWidth="5" fill="none" />
        <path d="M-10,60 L410,44" stroke={roadMinor} strokeWidth="3.5" fill="none" />
        <path d="M-10,268 L410,252" stroke={roadMinor} strokeWidth="3.5" fill="none" />

        {/* blocks */}
        {[
          [36, 24, 46, 26], [96, 150, 40, 24], [216, 36, 52, 22], [330, 60, 44, 28],
          [40, 176, 36, 20], [246, 250, 56, 24], [180, 224, 40, 22], [340, 176, 40, 26],
        ].map(([x, y, w, h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} rx="3" fill={block} opacity="0.85" />
        ))}
      </svg>

      {branches.map((b) => {
        const active = b.key === activeKey;
        return (
          <button
            key={b.key}
            onClick={() => onSelect(b.key)}
            className="absolute -translate-x-1/2 -translate-y-full focus:outline-none group"
            style={{ left: `${b.x}%`, top: `${b.y}%` }}
            aria-label={`Show ${b.name}`}
            aria-pressed={active}
          >
            <span className="flex flex-col items-center">
              <span
                className="whitespace-nowrap text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full mb-1.5 transition-all"
                style={{
                  background: active ? brand.accent : ui.bgSoft,
                  color: active ? brand.accentText : ui.textMuted,
                  boxShadow: active ? "0 6px 18px -6px rgba(0,0,0,0.45)" : "none",
                  border: `1px solid ${active ? "transparent" : ui.line}`,
                }}
              >
                {b.area}
              </span>
              <span className="relative flex items-center justify-center">
                {active && (
                  <span
                    className="absolute w-8 h-8 rounded-full animate-ping"
                    style={{ background: brand.accent, opacity: 0.25 }}
                  />
                )}
                <span
                  className="relative block rounded-full transition-all group-hover:scale-110"
                  style={{
                    width: active ? 16 : 12,
                    height: active ? 16 : 12,
                    background: active ? brand.accent : ui.textFaint,
                    boxShadow: `0 0 0 3px ${ui.bgSoft}`,
                  }}
                />
              </span>
            </span>
          </button>
        );
      })}

      <p
        className="absolute bottom-2.5 right-3 text-[9px] uppercase tracking-[0.14em]"
        style={{ color: ui.textFaint }}
      >
        Locator, not to scale
      </p>
    </div>
  );
}
