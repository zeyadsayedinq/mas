import { useEffect, useRef } from "react";
import { FileDown } from "lucide-react";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import type { Brand } from "../brands";
import { useGroup } from "../localize";
import { useLang } from "../i18n";
import { track } from "../track";

type Pair = [string, string];

const STEPS: { title: Pair; body: Pair }[] = [
  {
    title: ["We read the room", "نقرأ المكان"],
    body: [
      "The numbers first, then the kitchen and the floor. Nothing changes until we know why the room trades the way it does.",
      "الأرقام أولًا، ثم المطبخ والصالة. لا نغيّر شيئًا قبل أن نفهم لماذا يعمل المكان بالشكل الذي يعمل به.",
    ],
  },
  {
    title: ["We plan", "نخطّط"],
    body: [
      "The concept, a menu costed against real food cost, and the team the room actually needs.",
      "الفكرة، ومنيو محسوب على تكلفة الطعام الفعلية، والفريق الذي يحتاجه المكان فعلًا.",
    ],
  },
  {
    title: ["We set it up", "نجهّز"],
    body: [
      "Hiring and training, supplier lines, prep systems and the opening itself.",
      "التعيين والتدريب، وخطوط التوريد، وأنظمة التحضير، ثم الافتتاح نفسه.",
    ],
  },
  {
    title: ["We run it and report", "نشغّل ونرفع التقارير"],
    body: [
      "Day to day operation, with a monthly report on covers, spend per head, waste and payroll that you can actually read.",
      "التشغيل اليومي، مع تقرير شهري واضح بعدد الضيوف ومتوسط إنفاق الفرد والهدر والرواتب.",
    ],
  },
];

/**
 * How an engagement runs, in four steps. A thin sage line draws between the
 * steps as the section scrolls through (horizontal on desktop, vertical on a
 * phone). The scroll handler only runs while the section is on screen, writes
 * transforms directly, and the line is simply drawn in full with motion
 * reduced.
 */
export default function MasProcess({ brand }: { brand: Brand }) {
  const ui = brand.ui;
  const { tr, ar } = useLang();
  const { cases } = useGroup();
  const listRef = useRef<HTMLOListElement>(null);
  const fillH = useRef<HTMLSpanElement>(null);
  const fillV = useRef<HTMLSpanElement>(null);
  const railV = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const steps = Array.from(list.querySelectorAll<HTMLElement>(".mas-step"));
    // The phone rail runs from the first dot to the last, whatever the copy length.
    const fitRail = () => {
      const dots = list.querySelectorAll<HTMLElement>(".mas-step-dot");
      const rail = railV.current;
      if (!rail || dots.length < 2) return;
      const top = (dots[0].offsetParent as HTMLElement).offsetTop + dots[0].offsetTop + 7;
      const last = dots[dots.length - 1];
      const bottom = (last.offsetParent as HTMLElement).offsetTop + last.offsetTop + 7;
      rail.style.top = `${top}px`;
      rail.style.height = `${Math.max(0, bottom - top)}px`;
    };
    fitRail();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(fitRail) : null;
    ro?.observe(list);
    const set = (p: number) => {
      if (fillH.current) fillH.current.style.transform = `scaleX(${p})`;
      if (fillV.current) fillV.current.style.transform = `scaleY(${p})`;
      steps.forEach((s, i) => s.classList.toggle("is-on", p >= (i === 0 ? 0.001 : i / (steps.length - 1)) - 0.02));
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || typeof IntersectionObserver === "undefined") {
      set(1);
      return () => ro?.disconnect();
    }

    let frame = 0;
    let onScreen = false;
    const measure = () => {
      frame = 0;
      const r = list.getBoundingClientRect();
      const vh = window.innerHeight;
      // Starts as the list's top reaches 85% of the viewport, complete as its
      // bottom passes 55%.
      const start = vh * 0.85;
      const end = vh * 0.55;
      const p = (start - r.top) / Math.max(1, r.height + start - end);
      set(Math.max(0, Math.min(1, p)));
    };
    const onScroll = () => {
      if (!onScreen || frame) return;
      frame = requestAnimationFrame(measure);
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) onScroll();
    });
    io.observe(list);
    set(0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      ro?.disconnect();
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="process" className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32" style={{ background: ui.bg }}>
      {/* "Our work" in the nav lands here until case studies are confirmed. */}
      {cases.length === 0 && <span id="work" aria-hidden className="absolute top-0" />}
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <Eyebrow brand={brand} className="mb-6">{tr("The process", "طريقة العمل")}</Eyebrow>
        </Reveal>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 sm:mb-16">
          <Reveal delay={0.06}>
            <h2 className="text-[2.3rem] sm:text-5xl md:text-6xl font-semibold leading-[1.02] tracking-[-0.045em]" style={{ color: ui.text }}>
              {tr("How an engagement runs.", "كيف يسير التعاون معنا.")}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
              {tr(
                "Four stages. Where we start depends on where your room is, and we agree that before anything is signed.",
                "أربع مراحل. من أين نبدأ يتوقف على وضع مكانك، ونتفق على ذلك قبل توقيع أي شيء.",
              )}
            </p>
          </Reveal>
        </div>

        <ol ref={listRef} className="relative grid gap-10 md:gap-8 md:grid-cols-4 ps-10 md:ps-0 md:pt-12">
          {/* horizontal line, desktop */}
          <span aria-hidden className="hidden md:block absolute top-[6.5px] start-[7px] end-[calc(25%-31px)] h-[2px]" style={{ background: ui.line }}>
            <span ref={fillH} className="mas-rail-fill absolute inset-0" style={{ background: brand.accent, transform: "scaleX(0)" }} />
          </span>
          {/* vertical line, phone */}
          <span ref={railV} aria-hidden className="md:hidden absolute top-2 h-0 start-[6.5px] w-[2px]" style={{ background: ui.line }}>
            <span ref={fillV} className="mas-rail-fill-v absolute inset-0" style={{ background: brand.accent, transform: "scaleY(0)" }} />
          </span>

          {STEPS.map((s, i) => (
            <li key={i} className="mas-step relative min-w-0">
              <span
                aria-hidden
                className="mas-step-dot absolute -start-10 top-1 md:start-0 md:-top-12 md:mt-0 w-[15px] h-[15px] rounded-full border-2"
              />
              <p className="mas-step-num text-[12px] font-semibold tabular-nums mb-3">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="text-[20px] sm:text-[22px] font-semibold tracking-[-0.025em] leading-snug mb-2.5" style={{ color: ui.text }}>
                {ar ? s.title[1] : s.title[0]}
              </h3>
              <p className="text-[14.5px] leading-relaxed" style={{ color: ui.textMuted }}>
                {ar ? s.body[1] : s.body[0]}
              </p>
            </li>
          ))}
        </ol>

        <Reveal delay={0.1}>
          <div
            className="mt-16 sm:mt-20 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 rounded-2xl border p-6 sm:p-7"
            style={{ borderColor: ui.line, background: ui.bgAlt }}
          >
            <div className="min-w-0">
              <p className="text-[16px] font-semibold tracking-[-0.02em]" style={{ color: ui.text }}>
                {tr("Want it on paper?", "تفضّلها مكتوبة؟")}
              </p>
              <p className="text-[14px] leading-relaxed mt-1" style={{ color: ui.textMuted }}>
                {tr(
                  "Two pages on who we are, what we do and how we work. Easy to forward to a partner.",
                  "صفحتان عن هويتنا وما نقدّمه وطريقة عملنا، سهلة المشاركة مع شريكك. (بالإنجليزية)",
                )}
              </p>
            </div>
            <a
              href="/mas-capabilities.pdf"
              target="_blank"
              rel="noopener"
              onClick={() => track("capabilities_download")}
              className="shrink-0 w-full sm:w-auto justify-center inline-flex min-h-[48px] items-center gap-2.5 text-center text-sm font-semibold px-6 py-3 rounded-full transition-colors"
              style={{ background: brand.button ?? brand.accent, color: brand.buttonText ?? "#fff" }}
            >
              <FileDown size={16} aria-hidden />
              {tr("Download the capabilities overview (PDF)", "حمّل نظرة عامة على خدماتنا (PDF)")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
