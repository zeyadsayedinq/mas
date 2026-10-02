import { useEffect, useMemo, useState } from "react";
import "../styles/aroma-content.css";

/** A coffee bean, drawn small. */
function Bean() {
  return (
    <svg viewBox="0 0 20 20" width="100%" height="100%" aria-hidden>
      <ellipse cx="10" cy="10" rx="6.2" ry="8.4" fill="#6B4226" />
      <path d="M10 2.4c-2.4 2.6-2.4 12.6 0 15.2" stroke="#3E2418" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** A little green leaf in the brand's greens. */
function Leaf({ tone }: { tone: string }) {
  return (
    <svg viewBox="0 0 20 20" width="100%" height="100%" aria-hidden>
      <path d="M3 17C3 8 9 3 17 3c0 8-5 14-14 14z" fill={tone} />
      <path d="M4 16L14 6" stroke="#ffffff" strokeOpacity=".55" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

interface ConfettiProps {
  /** Change this number to fire a burst. 0 never fires. */
  fire: number;
  count?: number;
}

/**
 * A short, one-off burst of coffee beans and leaves (about 1.2s), for a moment
 * that deserves it. Pure DOM with CSS transforms, removed once it lands.
 * Renders nothing at all under reduced motion. Place it inside a
 * `position: relative` box; it bursts from that box's centre.
 */
export default function Confetti({ fire, count = 26 }: ConfettiProps) {
  const [shown, setShown] = useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!fire || reduce) return;
    setShown(fire);
    const t = window.setTimeout(() => setShown(0), 1400);
    return () => window.clearTimeout(t);
  }, [fire, reduce]);

  const bits = useMemo(() => {
    // Seeded from the burst number, so each burst differs but a render does not.
    let seed = (fire || 1) * 9301 + 49297;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2 + rnd() * 0.5;
      const dist = 90 + rnd() * 150;
      return {
        kind: i % 3 === 0 ? "bean" : "leaf",
        tone: i % 2 ? "#82A541" : "#9BC45A",
        dx: Math.cos(angle) * dist,
        // A little extra drop, so it reads as falling rather than exploding.
        dy: Math.sin(angle) * dist * 0.8 + 50 + rnd() * 40,
        r: (rnd() - 0.5) * 540,
        size: 10 + rnd() * 9,
        delay: rnd() * 0.12,
      };
    });
  }, [fire, count]);

  if (!shown || reduce) return null;
  return (
    <div className="ac-confetti" aria-hidden key={shown}>
      {bits.map((b, i) => (
        <span
          key={i}
          style={
            {
              width: b.size,
              height: b.size,
              marginLeft: -b.size / 2,
              marginTop: -b.size / 2,
              animationDelay: `${b.delay}s`,
              "--dx": `${b.dx.toFixed(1)}px`,
              "--dy": `${b.dy.toFixed(1)}px`,
              "--r": `${b.r.toFixed(0)}deg`,
            } as React.CSSProperties
          }
        >
          {b.kind === "bean" ? <Bean /> : <Leaf tone={b.tone} />}
        </span>
      ))}
    </div>
  );
}
