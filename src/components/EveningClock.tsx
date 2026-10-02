import { useEffect, useRef } from "react";
import Sparkle from "./Sparkle";
import "../styles/covy.css";

const START = 19 * 60; // 19:00
const SPAN = 7 * 60; // to 02:00

const fmt = (mins: number) => {
  const m = ((mins % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

/**
 * The evening, told by the scroll bar: a small pill in the bottom corner whose
 * time runs from 19:00 at the top of the page to 02:00 at the bottom. It also
 * writes --cv-dusk (0..1) on the page root, which the greige sections read to
 * deepen a touch as the night goes on. Decorative, so hidden from assistive
 * tech; it fades in once the hero is behind you and steps aside on a phone
 * while the enquiry form is on screen.
 */
export default function EveningClock() {
  const pill = useRef<HTMLDivElement>(null);
  const time = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = pill.current;
    const t = time.current;
    const root = document.querySelector<HTMLElement>("[data-covy-root]");
    if (!el || !t) return;
    // Everything that reads --cv-dusk: the greige sections and the moon.
    const duskTargets = root
      ? [...root.querySelectorAll<HTMLElement>('[style*="--cv-dusk"]'), ...el.querySelectorAll<HTMLElement | SVGElement>(".cv-clock-moon")]
      : [];
    let raf = 0;
    let lastDusk = -1;
    let lastTime = "";
    let formInView = false;
    const phone = window.matchMedia("(max-width: 639px)");

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    // Page and hero heights are measured when they change, not on every
    // scroll frame, so scrolling never forces a layout.
    let max = 1;
    let heroH = 400 / 0.6;
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const hero = document.getElementById("top");
      if (hero) heroH = hero.offsetHeight;
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => { measure(); onScroll(); }) : null;
    ro?.observe(document.body);

    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      const past = window.scrollY > heroH * 0.6;
      // Five-minute steps read like a clock and keep the updates rare.
      const label = fmt(START + Math.round((p * SPAN) / 5) * 5);
      if (label !== lastTime) {
        t.textContent = label;
        lastTime = label;
      }
      const dusk = Math.round(p * 20) / 20;
      if (dusk !== lastDusk) {
        for (const d of duskTargets) (d as HTMLElement).style.setProperty("--cv-dusk", String(dusk));
        lastDusk = dusk;
      }
      el.classList.toggle("is-on", past && !(phone.matches && formInView));
    };

    const form = document.getElementById("contact");
    const io = form
      ? new IntersectionObserver(([e]) => {
          formInView = e.isIntersecting;
          onScroll();
        }, { rootMargin: "0px 0px -20% 0px" })
      : null;
    if (form && io) io.observe(form);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={pill} className="cv-clock" aria-hidden>
      <div
        className="flex items-center gap-2 h-9 ps-2.5 pe-3.5 rounded-full"
        style={{ background: "rgba(38,45,63,.94)", border: "1px solid rgba(220,212,207,.2)", color: "#DCD4CF", boxShadow: "0 10px 24px -14px rgba(0,0,0,.5)" }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" className="cv-clock-moon" aria-hidden>
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" fill="#DCD4CF" />
        </svg>
        <span ref={time} className="text-[13px] font-medium tabular-nums tracking-[0.06em]" dir="ltr">
          19:00
        </span>
        <Sparkle size={8} color="#7E98AE" className="covy-twinkle" />
      </div>
    </div>
  );
}
