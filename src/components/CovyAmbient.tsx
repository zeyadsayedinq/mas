import { useEffect, useRef } from "react";
import Sparkle from "./Sparkle";

/** Fixed scatter, so it looks placed rather than random and never reflows. */
const STARS: { x: number; y: number; s: number; d: number }[] = [
  { x: 6, y: 18, s: 12, d: 0 }, { x: 44, y: 9, s: 9, d: 1.4 }, { x: 52, y: 66, s: 14, d: 2.6 },
  { x: 92, y: 12, s: 10, d: 0.8 }, { x: 30, y: 80, s: 8, d: 3.1 }, { x: 70, y: 88, s: 11, d: 1.9 },
  { x: 14, y: 52, s: 8, d: 2.2 }, { x: 96, y: 58, s: 9, d: 3.6 },
];

/**
 * Night-room atmosphere for the hero: a lamp of light that follows the cursor
 * (or rests at the top right on touch screens) and a few sparkles that come
 * and go. Sits behind the copy and never takes a click.
 */
export default function CovyAmbient({ color }: { color: string }) {
  const lamp = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = lamp.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    const host = el.parentElement!;
    let tx = 0.7, ty = 0.3, x = tx, y = ty, raf = 0, on = true;
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height;
    };
    const tick = () => {
      x += (tx - x) * 0.05; y += (ty - y) * 0.05;
      el.style.transform = `translate3d(${x * 100 - 50}%, ${y * 100 - 50}%, 0)`;
      if (on) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(tick);
    });
    io.observe(host);
    window.addEventListener("pointermove", move, { passive: true });
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener("pointermove", move); };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        ref={lamp}
        className="absolute left-1/2 top-1/2 w-[70vmax] h-[70vmax] -ml-[35vmax] -mt-[35vmax] rounded-full covy-breathe"
        style={{ background: `radial-gradient(closest-side, ${color}30, ${color}00 70%)`, transform: "translate3d(20%, -20%, 0)", willChange: "transform" }}
      />
      {STARS.map((s, i) => (
        <span key={i} className="absolute covy-twinkle" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s`, animationDuration: `${4 + (i % 3)}s`, color }}>
          <Sparkle size={s.s} color="currentColor" />
        </span>
      ))}
    </div>
  );
}
