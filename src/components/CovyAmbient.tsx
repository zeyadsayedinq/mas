import { useEffect, useRef, type CSSProperties } from "react";
import Sparkle from "./Sparkle";
import "../styles/covy.css";

/**
 * Fixed scatter, so it looks placed rather than random and never reflows.
 * `t` is the dimmer level below which a star comes out: the lower the room
 * lights, the more of the sky shows. Anything over 1 is always there.
 */
const STARS: { x: number; y: number; s: number; d: number; t: number }[] = [
  { x: 6, y: 18, s: 12, d: 0, t: 1.3 }, { x: 44, y: 9, s: 9, d: 1.4, t: 1.3 }, { x: 92, y: 12, s: 10, d: 0.8, t: 1.3 },
  { x: 52, y: 66, s: 14, d: 2.6, t: 0.95 }, { x: 30, y: 80, s: 8, d: 3.1, t: 0.85 }, { x: 70, y: 88, s: 11, d: 1.9, t: 0.8 },
  { x: 14, y: 52, s: 8, d: 2.2, t: 0.72 }, { x: 96, y: 58, s: 9, d: 3.6, t: 0.66 }, { x: 22, y: 30, s: 6, d: 0.4, t: 0.58 },
  { x: 62, y: 22, s: 7, d: 2.9, t: 0.52 }, { x: 80, y: 40, s: 5, d: 1.1, t: 0.46 }, { x: 36, y: 46, s: 6, d: 3.4, t: 0.4 },
  { x: 4, y: 74, s: 7, d: 2.4, t: 0.35 }, { x: 86, y: 76, s: 6, d: 0.2, t: 0.3 }, { x: 48, y: 34, s: 4, d: 1.7, t: 0.26 },
  { x: 74, y: 6, s: 5, d: 3.8, t: 0.22 }, { x: 18, y: 92, s: 5, d: 0.9, t: 0.18 }, { x: 58, y: 94, s: 4, d: 2.1, t: 0.14 },
  { x: 28, y: 4, s: 4, d: 1.3, t: 0.1 }, { x: 98, y: 32, s: 4, d: 3.2, t: 0.08 },
];

interface CovyAmbientProps {
  color: string;
  /** The lamp of light that follows the cursor. Off for quieter sections. */
  lamp?: boolean;
  /** Fewer stars for sections that only want a hint of night. */
  sparse?: boolean;
}

/**
 * Night-room atmosphere: a lamp of light that follows the cursor (or rests
 * at the top right on touch screens), a candle-warm glow from below, and a
 * scatter of sparkles. All three answer to the hero's dimmer through
 * --cv-light: lights up and the lamp strengthens, lights down and the candle
 * warms while more stars come out. Sits behind the copy and never takes a
 * click.
 */
export default function CovyAmbient({ color, lamp = true, sparse = false }: CovyAmbientProps) {
  const lampRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lampRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const host = el.parentElement!.parentElement!;
    let tx = 0.7, ty = 0.3, x = tx, y = ty, raf = 0, on = false, idle = 0;
    const tick = () => {
      x += (tx - x) * 0.06; y += (ty - y) * 0.06;
      el.style.transform = `translate3d(${x * 100 - 50}%, ${y * 100 - 50}%, 0)`;
      // Settle, then stop until the pointer moves again.
      if (Math.abs(tx - x) + Math.abs(ty - y) < 0.001) idle++;
      else idle = 0;
      raf = on && idle < 30 ? requestAnimationFrame(tick) : 0;
    };
    const move = (e: PointerEvent) => {
      if (!on) return;
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height;
      idle = 0;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      if (!on) { cancelAnimationFrame(raf); raf = 0; }
    });
    io.observe(host);
    window.addEventListener("pointermove", move, { passive: true });
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("pointermove", move); };
  }, []);

  const stars = sparse ? STARS.filter((_, i) => i % 2 === 0) : STARS;

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      {lamp && (
        <div className="cv-lamp absolute inset-0">
          <div
            ref={lampRef}
            className="absolute left-1/2 top-1/2 w-[70vmax] h-[70vmax] -ml-[35vmax] -mt-[35vmax] rounded-full covy-breathe"
            style={{ background: `radial-gradient(closest-side, ${color}38, ${color}00 70%)`, transform: "translate3d(20%, -20%, 0)", willChange: "transform" }}
          />
        </div>
      )}
      <div
        className="cv-candle-glow absolute inset-x-0 bottom-0 h-2/3"
        style={{ background: "radial-gradient(70% 90% at 50% 100%, rgba(118,95,77,.34), rgba(118,95,77,0) 70%)" }}
      />
      {stars.map((s, i) => (
        <span key={i} className="cv-star absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, "--t": s.t } as CSSProperties}>
          <span className="block covy-twinkle" style={{ animationDelay: `${s.d}s`, animationDuration: `${4 + (i % 3)}s`, color }}>
            <Sparkle size={s.s} color="currentColor" />
          </span>
        </span>
      ))}
    </div>
  );
}
