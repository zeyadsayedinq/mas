import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { useLang } from "../i18n";
import type { Branch } from "../branches";
import type { Brand } from "../brands";
import "../styles/aroma-content.css";

interface MapPanelProps {
  brand: Brand;
  branch: Branch;
}

export const mapEmbedUrl = (q: string, lang: string) =>
  `https://www.google.com/maps?q=${encodeURIComponent(q)}&hl=${lang}&z=15&output=embed`;

/**
 * The live Google map for one branch. The iframe is heavy, so it only mounts
 * once the panel is close to the viewport; until then a light placeholder in
 * the brand's colours holds the space. Switching branch swaps the embed and
 * fades the new one in over the placeholder.
 */
export default function MapPanel({ brand, branch }: MapPanelProps) {
  const { tr, lang } = useLang();
  const ui = brand.ui;
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [loadedKey, setLoadedKey] = useState("");

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const loaded = loadedKey === branch.key;

  return (
    <div
      ref={box}
      className="relative w-full overflow-hidden rounded-xl border aspect-[4/5] sm:aspect-[4/3]"
      style={{ borderColor: ui.line, background: "#F2F5EC" }}
    >
      {/* Placeholder, visible until the map has painted. */}
      <div aria-hidden className="absolute inset-0 ac-map-grid flex items-center justify-center">
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-70">
          <path d="M-10,215 C70,190 140,205 200,170 C260,136 320,120 410,96" stroke="#fff" strokeWidth="11" fill="none" strokeLinecap="round" />
          <path d="M-10,120 C80,132 150,96 230,104 C300,111 350,150 410,158" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" />
          <ellipse cx="110" cy="80" rx="70" ry="40" fill="#DCEBC4" opacity="0.7" />
          <ellipse cx="300" cy="220" rx="80" ry="46" fill="#DCEBC4" opacity="0.55" />
        </svg>
        <div className="relative flex flex-col items-center gap-3">
          <span className="relative flex items-center justify-center">
            <span className="absolute h-10 w-10 rounded-full ac-pulse" style={{ background: brand.accent }} />
            <span
              className="relative ac-pin-bob flex h-11 w-11 items-center justify-center rounded-full shadow-lg"
              style={{ background: brand.accent, color: brand.accentText }}
            >
              <MapPin size={20} />
            </span>
          </span>
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/90" style={{ color: ui.textMuted }}>
            {near ? tr("Loading the map…", "الخريطة بتحمّل…") : tr("Map loads as you scroll", "الخريطة هتظهر وانت نازل")}
          </span>
        </div>
      </div>

      {near && (
        <iframe
          key={branch.key}
          title={tr(`Map of ${branch.name}`, `خريطة ${branch.name}`)}
          src={mapEmbedUrl(branch.mapQuery, lang)}
          className="ac-map-frame absolute inset-0 h-full w-full border-0"
          style={{ opacity: loaded ? 1 : 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={() => setLoadedKey(branch.key)}
          allowFullScreen
        />
      )}
    </div>
  );
}
