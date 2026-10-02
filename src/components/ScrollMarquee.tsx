import { Fragment, useEffect, useRef } from "react";
import { useLang } from "../i18n";
import type { Brand } from "../brands";
import "../styles/aroma-3d.css";

/**
 * A big band of type that runs with the scroll: it drifts on its own, speeds
 * up and leans the faster you scroll, and turns round when you scroll back
 * up. Two rows, the second outlined and running the other way. Still for
 * reduced motion.
 */
export default function ScrollMarquee({ brand }: { brand: Brand }) {
  const { tr } = useLang();
  const box = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);

  const words = [
    tr("Espresso", "إسبريسو"),
    tr("Feteer", "فطير"),
    tr("Grill", "مشويات"),
    tr("Fresh juice", "عصير فريش"),
    tr("Desks", "مساحة عمل"),
    tr("Shisha", "شيشة"),
  ];

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, running = false, last = performance.now();
    let lastY = window.scrollY;
    let vel = 0, dirn = 1, x = 0;
    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const y = window.scrollY;
      const dy = y - lastY; lastY = y;
      const inst = dt > 0 ? dy / dt : 0;
      vel += (inst - vel) * 0.12;
      if (Math.abs(vel) > 40) dirn = vel > 0 ? 1 : -1;
      const speed = 40 + Math.min(1400, Math.abs(vel)) * 0.45;
      x += speed * dirn * dt;
      const skew = Math.max(-10, Math.min(10, vel * -0.006));
      rows.current.forEach((r, i) => {
        if (!r) return;
        const half = r.scrollWidth / 2 || 1;
        const off = i === 0 ? x : -x * 0.8;
        const m = ((off % half) + half) % half;
        r.style.transform = `translate3d(${-m}px,0,0) skewX(${(i === 0 ? skew : -skew).toFixed(2)}deg)`;
      });
      if (running) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !running) { running = true; last = performance.now(); lastY = window.scrollY; raf = requestAnimationFrame(frame); }
      else if (!e.isIntersecting) { running = false; cancelAnimationFrame(raf); }
    });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  const line = (outline: boolean) => (
    <>
      {[0, 1].map((copy) => (
        <span key={copy} className="aro-mq-item" aria-hidden={copy === 1 || undefined}>
          {words.map((w, i) => (
            <Fragment key={i}>
              <span className={`px-4 sm:px-7 ${outline ? "aro-mq-outline" : ""}`}>{w}</span>
              {brand.mark ? (
                <img src={brand.mark} alt="" aria-hidden className="h-[0.62em] w-auto shrink-0" style={{ opacity: outline ? 0.55 : 1 }} />
              ) : (
                <span aria-hidden>·</span>
              )}
            </Fragment>
          ))}
        </span>
      ))}
    </>
  );

  return (
    <section ref={box} className="aro-marquee relative py-10 sm:py-16 select-none" style={{ background: "#FFFFFF" }} aria-label={words.join(", ")}>
      <div dir="ltr" aria-hidden>
        <div
          ref={(e) => { rows.current[0] = e; }}
          className="aro-mq-track text-[56px] sm:text-[96px] lg:text-[128px] leading-[1.05] font-medium"
          style={{ color: brand.ui.text }}
        >
          {line(false)}
        </div>
        <div
          ref={(e) => { rows.current[1] = e; }}
          className="aro-mq-track aro-mq-italic mt-1 text-[56px] sm:text-[96px] lg:text-[128px] leading-[1.05] font-medium"
          style={{ color: brand.accent }}
        >
          {line(true)}
        </div>
      </div>
    </section>
  );
}
