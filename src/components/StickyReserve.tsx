import { useEffect, useState } from "react";
import { CalendarCheck, UtensilsCrossed } from "lucide-react";
import type { Brand } from "../brands";

/**
 * A slim action bar for phones and iPads in portrait. It stays out of the way
 * while the hero is on screen and again once the booking form itself is
 * visible, and sits above the iPhone home bar.
 */
export default function StickyReserve({ brand }: { brand: Brand }) {
  const [pastHero, setPastHero] = useState(false);
  const [atForm, setAtForm] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("reserve");
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setAtForm(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const show = pastHero && !atForm;
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-[90] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-3 backdrop-blur-md"
      style={{
        background: "rgba(255,255,255,0.92)",
        borderTop: `1px solid ${brand.ui.line}`,
        transform: show ? "translateY(0)" : "translateY(110%)",
        transition: "transform 350ms cubic-bezier(0.16,1,0.3,1)",
        pointerEvents: show ? "auto" : "none",
      }}
      aria-hidden={!show}
    >
      <button
        onClick={() => go("reserve")}
        tabIndex={show ? 0 : -1}
        className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-full active:scale-95 transition-transform"
        style={{ background: brand.accent, color: brand.accentText }}
      >
        <CalendarCheck size={16} />
        Reserve a table
      </button>
      <button
        onClick={() => go("menu")}
        tabIndex={show ? 0 : -1}
        className="inline-flex items-center justify-center gap-2 text-sm font-medium px-5 py-3 rounded-full border active:scale-95 transition-transform"
        style={{ borderColor: `${brand.accent}88`, color: brand.ui.text, background: "#FFFFFF" }}
      >
        <UtensilsCrossed size={16} />
        Menu
      </button>
    </div>
  );
}
