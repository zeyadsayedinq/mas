import { useEffect, useState } from "react";
import { CalendarCheck, UtensilsCrossed, Phone } from "lucide-react";
import { useLang } from "../i18n";
import { useBranches, branchLive } from "../localize";
import { track } from "../track";
import type { Brand } from "../brands";

/**
 * A slim action bar for phones and iPads in portrait. It stays out of the way
 * while the hero is on screen, again once the booking form itself is visible,
 * and over the footer, and sits above the iPhone home bar. A call button joins
 * it once the lead branch's phone number is confirmed.
 */
export default function StickyReserve({ brand }: { brand: Brand }) {
  const { tr } = useLang();
  const lead = useBranches()[0];
  const canCall = branchLive(lead, "phone");
  const [pastHero, setPastHero] = useState(false);
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        setPastHero(window.scrollY > window.innerHeight * 0.8);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Hide over the form and over the footer, where the same actions already are.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const els = [document.getElementById("reserve"), document.querySelector<HTMLElement>("footer")].filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) =>
        setHidden((h) => {
          const next = { ...h };
          for (const e of entries) next[e.target.id || "footer"] = e.isIntersecting;
          return next;
        }),
      { threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const show = pastHero && !Object.values(hidden).some(Boolean);
  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div
      className="lg:hidden fixed inset-x-0 bottom-0 z-[90] px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-2.5"
      style={{
        background: "rgba(255,255,255,0.97)",
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
        className="flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium px-5 min-h-[48px] rounded-full active:scale-95 transition-transform"
        style={{ background: brand.accent, color: brand.accentText }}
      >
        <CalendarCheck size={16} aria-hidden />
        {tr("Reserve a table", "احجز ترابيزة")}
      </button>
      <button
        onClick={() => go("menu")}
        tabIndex={show ? 0 : -1}
        className="inline-flex items-center justify-center gap-2 text-sm font-medium px-5 min-h-[48px] rounded-full border active:scale-95 transition-transform"
        style={{ borderColor: `${brand.accent}88`, color: brand.ui.text, background: "#FFFFFF" }}
      >
        <UtensilsCrossed size={16} aria-hidden />
        {tr("Menu", "المنيو")}
      </button>
      {canCall && (
        <a
          href={`tel:${lead.phone.replace(/\s/g, "")}`}
          tabIndex={show ? 0 : -1}
          onClick={() => track("call_click", { branch: lead.key, from: "sticky" })}
          aria-label={tr(`Call ${lead.name}`, `اتصل بـ ${lead.name}`)}
          className="inline-flex items-center justify-center h-12 w-12 shrink-0 rounded-full border active:scale-95 transition-transform"
          style={{ borderColor: `${brand.accent}88`, color: brand.ui.text, background: "#FFFFFF" }}
        >
          <Phone size={17} aria-hidden />
        </a>
      )}
    </div>
  );
}
