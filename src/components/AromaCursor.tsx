import { useEffect, useRef, useState } from "react";
import "../styles/aroma-3d.css";

const LINKISH = "a, button, [role='button'], [role='tab'], label, summary, select";

/**
 * Desktop-only cursor for Aroma: a small green dot that tracks the pointer
 * and a ring that eases behind it. The ring grows over anything clickable
 * and reads out a word over elements that carry `data-cursor` ("Drag",
 * "Spin", a dish name from the 3D hero). It never takes pointer events, and
 * the native cursor is only hidden while it is actually running.
 */
export default function AromaCursor() {
  const [on, setOn] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const check = () => setOn(fine.matches && !calm.matches);
    check();
    fine.addEventListener("change", check);
    calm.addEventListener("change", check);
    return () => { fine.removeEventListener("change", check); calm.removeEventListener("change", check); };
  }, []);

  useEffect(() => {
    if (!on) return;
    const d = dot.current!, r = ring.current!, l = label.current!;
    const html = document.documentElement;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0, seen = false, idle = 0;
    let lastTarget: Element | null = null;

    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      r.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`;
      // stop the loop once the ring has caught up
      if (Math.abs(x - rx) + Math.abs(y - ry) < 0.3) { idle++; } else idle = 0;
      raf = idle > 4 ? 0 : requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf) { idle = 0; raf = requestAnimationFrame(loop); } };

    const classify = (t: Element | null) => {
      if (t === lastTarget) return;
      lastTarget = t;
      const tagged = t?.closest<HTMLElement>("[data-cursor]");
      const text = tagged?.dataset.cursor;
      const link = !!t?.closest(LINKISH);
      const field = !!t?.closest("input, textarea, select, [contenteditable='true']");
      r.classList.toggle("is-label", !!text);
      d.classList.toggle("is-label", !!text);
      r.classList.toggle("is-link", !text && link);
      d.classList.toggle("is-hidden", field);
      r.classList.toggle("is-hidden", field);
      if (text && l.textContent !== text) l.textContent = text;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX; y = e.clientY;
      if (!seen) { seen = true; rx = x; ry = y; html.classList.add("aro-cursor-on"); d.parentElement!.classList.remove("is-hidden"); }
      // labels set on the fly (the 3D canvas) need a fresh look each move
      lastTarget = null;
      classify(e.target as Element);
      kick();
    };
    const onLeave = () => { seen = false; html.classList.remove("aro-cursor-on"); d.parentElement!.classList.add("is-hidden"); };
    const onDown = () => r.classList.add("is-down");
    const onUp = () => r.classList.remove("is-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      html.classList.remove("aro-cursor-on");
    };
  }, [on]);

  if (!on) return null;
  return (
    <div aria-hidden className="is-hidden" style={{ pointerEvents: "none" }}>
      <div ref={ring} className="aro-cur aro-cur-ring">
        <div className="aro-cur-ring-i"><span ref={label} className="aro-cur-label" /></div>
      </div>
      <div ref={dot} className="aro-cur aro-cur-dot" />
    </div>
  );
}
