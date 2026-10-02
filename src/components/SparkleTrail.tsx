import { useEffect, useRef } from "react";
import "../styles/covy.css";

const POOL = 18;
const STAR = "M12 0C12.9 7.2 16.8 11.1 24 12C16.8 12.9 12.9 16.8 12 24C11.1 16.8 7.2 12.9 0 12C7.2 11.1 11.1 7.2 12 0Z";
const COLORS = ["#7E98AE", "#DCD4CF", "#7E98AE", "#765F4D"];

/**
 * A few tiny sparkles that trail the cursor and fade, desktop only. A fixed
 * pool of nodes is reused round-robin, each animated with the Web Animations
 * API on transform and opacity. Work only happens on a pointer move (one rAF
 * per frame at most), so an idle or hidden page does nothing at all.
 */
export default function SparkleTrail() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const ok =
      window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      typeof el.animate === "function";
    if (!ok) return;

    const nodes = Array.from({ length: POOL }, (_, i) => {
      const s = document.createElement("span");
      const size = 6 + (i % 4) * 2;
      s.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${COLORS[i % COLORS.length]}"><path d="${STAR}"/></svg>`;
      el.appendChild(s);
      return s;
    });

    let i = 0, x = 0, y = 0, lx = -1e4, ly = -1e4, last = 0, raf = 0;
    const tick = (now: number) => {
      raf = 0;
      if (document.hidden) return;
      const dx = x - lx, dy = y - ly;
      if (dx * dx + dy * dy < 26 * 26 || now - last < 50) return;
      last = now; lx = x; ly = y;
      const n = nodes[i++ % POOL];
      const drift = (Math.random() - 0.5) * 26;
      const fall = 14 + Math.random() * 18;
      const turn = Math.random() > 0.5 ? 90 : -90;
      n.getAnimations().forEach((a) => a.cancel());
      n.animate(
        [
          { transform: `translate3d(${x}px, ${y}px, 0) scale(.2) rotate(0deg)`, opacity: 0 },
          { transform: `translate3d(${x + drift * 0.3}px, ${y + fall * 0.2}px, 0) scale(1) rotate(${turn * 0.3}deg)`, opacity: 0.95, offset: 0.2 },
          { transform: `translate3d(${x + drift}px, ${y + fall}px, 0) scale(.1) rotate(${turn}deg)`, opacity: 0 },
        ],
        { duration: 900 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.3,1)" },
      );
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX - 5; y = e.clientY - 5;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      nodes.forEach((n) => n.remove());
    };
  }, []);

  return <div ref={host} className="cv-trail" aria-hidden />;
}
