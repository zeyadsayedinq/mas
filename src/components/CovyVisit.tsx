import { useEffect, useRef, useState } from "react";
import { ArrowRight, MessageCircle, Phone, MapPin, Clock, AtSign, Navigation } from "lucide-react";
import Reveal from "./Reveal";
import Kinetic from "./Kinetic";
import Magnetic from "./Magnetic";
import Sparkle from "./Sparkle";
import CovyAmbient from "./CovyAmbient";
import { CovyCandle } from "./CovyArt";
import { COVY_VENUE, SOCIAL, live } from "../config";
import { useLang } from "../i18n";
import { track } from "../track";
import type { Brand } from "../brands";

/** Google Maps, mounted only once the section is near the screen. */
function LazyMap({ query, title, line }: { query: string; title: string; line: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") { setShow(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setShow(true); io.disconnect(); } }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border" style={{ borderColor: line, background: "#2F3649" }}>
      {show && (
        <iframe
          title={title}
          src={`https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full"
          style={{ border: 0, filter: "grayscale(.35) contrast(.95)" }}
        />
      )}
    </div>
  );
}

/**
 * Where and when. COVY's address, hours and numbers are not confirmed yet
 * (see COVY_VENUE in config.ts), so until they are this is a quiet "details
 * are on their way" card with a candle. Flip `confirmed` and fill the fields
 * and the full version appears: address, hours, WhatsApp, call and a map.
 */
export default function CovyVisit({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const { tr, ar } = useLang();
  const v = COVY_VENUE;
  const confirmed = live(v.confirmed);
  const insta = SOCIAL.covy.instagram;

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const area = ar ? v.areaAr || v.area : v.area;
  const address = ar ? v.addressAr || v.address : v.address;
  const mapQuery = v.mapQuery || [v.address, v.area].filter(Boolean).join(", ");

  const heading = (
    <>
      <Reveal>
        <p className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
          <Sparkle size={10} color={brand.accent} />
          {tr("Visit", "الزيارة")}
        </p>
      </Reveal>
      <h2 className="leading-[1.02] tracking-[-0.03em]" style={{ color: ui.text }}>
        <Kinetic variant="curtain" stagger={0.05} text={tr("Where", "أين")} className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl" />
        <Kinetic variant="curtain" stagger={0.05} delay={0.16} text={tr("and when.", "ومتى.")} className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.045em]" />
      </h2>
    </>
  );

  return (
    <section id="visit" className="relative overflow-hidden px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bg }}>
      <CovyAmbient color={brand.accent} lamp={false} sparse />
      <div className="relative mx-auto max-w-6xl grid gap-12 lg:gap-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
        {confirmed ? (
          <>
            <div>
              {heading}
              <Reveal delay={0.1}>
                <div className="mt-10 grid gap-6">
                  {(area || address) && (
                    <div className="flex gap-4">
                      <MapPin size={18} className="mt-1 shrink-0" style={{ color: brand.accent }} aria-hidden />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: ui.textFaint }}>{tr("Address", "العنوان")}</p>
                        <div className="text-[15px] leading-relaxed" style={{ color: ui.text }}>
                          {area && <span className="block font-playfair italic text-2xl mb-1">{area}</span>}
                          {address}
                        </div>
                      </div>
                    </div>
                  )}
                  {v.open && (
                    <div className="flex gap-4">
                      <Clock size={18} className="mt-1 shrink-0" style={{ color: brand.accent }} aria-hidden />
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.22em] mb-1" style={{ color: ui.textFaint }}>{tr("Hours", "المواعيد")}</p>
                        <div className="text-[15px]" style={{ color: ui.text }}>
                          {tr(`From ${v.open} until late`, `من ${v.open} وحتى آخر الليل`)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="mt-10 flex flex-wrap gap-3">
                  {v.whatsapp && (
                    <Magnetic>
                      <a
                        href={`https://wa.me/${v.whatsapp}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => track("whatsapp_click", { brand: "covy" })}
                        className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full"
                        style={{ background: brand.accent, color: brand.accentText }}
                      >
                        <MessageCircle size={16} />
                        {tr("WhatsApp", "واتساب")}
                      </a>
                    </Magnetic>
                  )}
                  {v.phone && (
                    <a
                      href={`tel:${v.phone.replace(/\s/g, "")}`}
                      onClick={() => track("call_click", { brand: "covy" })}
                      className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border"
                      style={{ borderColor: ui.line, color: ui.text }}
                    >
                      <Phone size={15} />
                      {tr("Call", "اتصل")}
                    </a>
                  )}
                  {mapQuery && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track("directions_click", { brand: "covy" })}
                      className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border"
                      style={{ borderColor: ui.line, color: ui.text }}
                    >
                      <Navigation size={15} />
                      {tr("Directions", "الاتجاهات")}
                    </a>
                  )}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              {mapQuery ? (
                <LazyMap query={mapQuery} title={tr("COVY on the map", "كوفي على الخريطة")} line={ui.line} />
              ) : (
                <CovyCandle className="mx-auto w-28 h-auto" />
              )}
            </Reveal>
          </>
        ) : (
          <>
            <div>
              {heading}
              <Reveal delay={0.1}>
                <p className="mt-7 max-w-md text-[15px] leading-relaxed" style={{ color: ui.textMuted }}>
                  {tr(
                    "Details are on their way. The address, opening hours and a number to call will be here as soon as they are confirmed. Until then, the enquiry form reaches the team directly.",
                    "التفاصيل في الطريق. العنوان ومواعيد العمل ورقم للاتصال ستكون هنا فور تأكيدها. وحتى ذلك الحين، يصل نموذج التواصل إلى الفريق مباشرة.",
                  )}
                </p>
              </Reveal>
              <Reveal delay={0.16}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Magnetic>
                    <button
                      onClick={() => go("contact")}
                      className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-7 py-3 rounded-full transition-transform hover:scale-[1.03] active:scale-95"
                      style={{ background: brand.accent, color: brand.accentText }}
                    >
                      {tr("Ask us directly", "اسألنا مباشرة")}
                      <ArrowRight size={15} className="rtl:-scale-x-100" />
                    </button>
                  </Magnetic>
                  {insta && (
                    <a
                      href={`https://instagram.com/${insta}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => track("instagram_click", { brand: "covy" })}
                      className="min-h-[44px] inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full border"
                      style={{ borderColor: ui.line, color: ui.text }}
                    >
                      <AtSign size={15} />
                      {tr("Follow for the opening news", "تابعنا لأخبار الافتتاح")}
                    </a>
                  )}
                </div>
              </Reveal>
            </div>

            {/* A place card, still waiting for its details. */}
            <Reveal delay={0.12}>
              <div
                className="relative mx-auto w-full max-w-[440px] rounded-[22px] px-8 sm:px-10 py-10 sm:py-12 text-center"
                style={{ background: "#2F3649", border: `1px solid ${ui.line}` }}
              >
                <div className="absolute inset-3 rounded-[16px] border pointer-events-none" style={{ borderColor: ui.line }} />
                <CovyCandle className="relative mx-auto w-20 sm:w-24 h-auto" />
                <p className="relative mt-6 font-playfair italic text-2xl sm:text-3xl" style={{ color: ui.text }}>
                  {tr("Details are on their way", "التفاصيل في الطريق")}
                </p>
                <dl className="relative mt-8 grid gap-4 text-start">
                  {[
                    { icon: MapPin, k: tr("Where", "المكان"), v: tr("To be announced", "يُعلن قريبًا") },
                    { icon: Clock, k: tr("When", "المواعيد"), v: tr("Evenings, until late", "مساءً، وحتى آخر الليل") },
                  ].map((row) => (
                    <div key={row.k} className="flex items-center gap-4 border-t pt-4" style={{ borderColor: ui.line }}>
                      <dt className="flex items-center gap-4 text-[10px] uppercase tracking-[0.22em] w-28 shrink-0" style={{ color: ui.textFaint }}>
                        <row.icon size={16} aria-hidden style={{ color: brand.accent }} />
                        {row.k}
                      </dt>
                      <dd className="text-[15px]" style={{ color: ui.textMuted }}>{row.v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
