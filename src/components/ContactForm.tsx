import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Check, AlertCircle, Loader2, Mail, Info } from "lucide-react";
import Reveal from "./Reveal";
import { BRANDS, type Brand, buttonColors } from "../brands";
import { CONFIRMED, CONTACT_DETAILS, FORMSPREE_ENDPOINT, live } from "../config";
import { useLang } from "../i18n";
import { track } from "../track";
import "../styles/aroma-content.css";

interface ContactFormProps {
  /** Already localised by the caller. */
  brand: Brand;
  /** Preselects the subject dropdown on a brand page. */
  defaultSubject?: string;
  /** Listen for `mas:prefill`. Turn off when a parent handles it instead. */
  listen?: boolean;
}

/** Detail of the `mas:prefill` window event. */
export interface PrefillDetail {
  message?: string;
  subject?: string;
  branch?: string;
}

type Status = "idle" | "sending" | "sent" | "offline" | "error";

/**
 * The shared enquiry form. With a Formspree endpoint set in config.ts it
 * posts there. Without one it says so plainly rather than pretending to
 * send, and offers an email hand-off when the group address is confirmed.
 *
 * Other sections can fill it with
 *   window.dispatchEvent(new CustomEvent("mas:prefill", { detail: { message, subject } }))
 */
export default function ContactForm({ brand, defaultSubject, listen = true }: ContactFormProps) {
  const { tr, ar } = useLang();
  // Aroma speaks casual Cairo Arabic; the group and COVY stay plainer.
  const casual = brand.key === "aroma";
  const trb = (en: string, arCasual: string, arPlain: string) => tr(en, casual ? arCasual : arPlain);
  const uid = useId().replace(/:/g, "");
  const ui = brand.ui;
  const formRef = useRef<HTMLFormElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const subjects = [
    ar ? BRANDS.mas.nameAr : BRANDS.mas.name,
    ar ? BRANDS.aroma.nameAr : BRANDS.aroma.name,
    ar ? BRANDS.covy.nameAr : BRANDS.covy.name,
    ...(casual ? [tr("Groups and events", "مجموعات ومناسبات"), tr("Coffee beans in bulk", "بن بالجملة")] : []),
    tr("Venue management", "إدارة الأماكن"),
    trb("Something else", "حاجة تانية", "موضوع آخر"),
  ];
  const initialSubject = defaultSubject ?? subjects[0];
  if (!subjects.includes(initialSubject)) subjects.unshift(initialSubject);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [draftName, setDraftName] = useState("");
  const options = subjects.includes(subject) ? subjects : [subject, ...subjects];

  useEffect(() => {
    setSubject(defaultSubject ?? subjects[0]);
  }, [defaultSubject, ar]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!listen) return;
    const on = (e: Event) => {
      const d = (e as CustomEvent<PrefillDetail>).detail ?? {};
      if (d.message) setMessage(d.message);
      if (d.subject) setSubject(d.subject);
      setStatus("idle");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const target = formRef.current?.closest("section") ?? formRef.current;
      target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      window.setTimeout(() => msgRef.current?.focus({ preventScroll: true }), reduce ? 0 : 700);
    };
    window.addEventListener("mas:prefill", on);
    return () => window.removeEventListener("mas:prefill", on);
  }, [listen]);

  const inputClass =
    "w-full bg-transparent border-b outline-none text-base sm:text-[15px] py-3 transition-colors focus:border-current";
  const inputStyle = { borderColor: ui.line, color: ui.text };
  const labelClass = "block text-[10px] uppercase tracking-[0.2em] mb-1";
  const labelStyle = { color: ui.textFaint };
  const emailLive = live(CONFIRMED.email);
  const phoneLive = live(CONFIRMED.phone);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Nothing to send to yet. Say so, and keep what they typed.
    if (!FORMSPREE_ENDPOINT) {
      setDraftName(String(data.get("name") ?? ""));
      setStatus("offline");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data });
      if (res.ok) {
        track("contact_submit", { subject: String(data.get("subject") ?? ""), brand: brand.key });
        setStatus("sent");
        setMessage("");
        form.reset();
        return;
      }
      const body = await res.json().catch(() => null);
      setError(body?.errors?.[0]?.message ?? trb("That did not go through. Try again in a moment.", "الرسالة ما وصلتش. جرّب تاني بعد شوية.", "تعذّر الإرسال. حاول مرة أخرى بعد قليل."));
      setStatus("error");
    } catch {
      setError(trb("Network error. Check your connection and try again.", "فيه مشكلة في الاتصال. اتأكد من النت وجرّب تاني.", "خطأ في الاتصال. تحقّق من الشبكة وحاول مرة أخرى."));
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border rounded-xl p-8 sm:p-10 flex items-start gap-4" style={{ borderColor: ui.line }} role="status">
        <span className="ac-pop shrink-0 mt-0.5 rounded-full p-2" style={buttonColors(brand)}>
          <Check size={16} />
        </span>
        <div>
          <p className="text-lg font-medium" style={{ color: ui.text }}>
            {trb("Message received.", "رسالتك وصلت.", "وصلتنا رسالتك.")}
          </p>
          <p className="text-sm mt-1.5 leading-relaxed" style={{ color: ui.textMuted }}>
            {trb("Someone from the team will come back to you.", "حد من الفريق هيرد عليك.", "سيتواصل معك أحد أفراد الفريق.")}
            {phoneLive && (
              <>
                {" "}
                {trb("If it is urgent, call", "لو الموضوع مستعجل، كلّمنا على", "للأمور العاجلة اتصل على")}{" "}
                <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`} dir="ltr" className="underline underline-offset-4" onClick={() => track("call_click", { from: "contact" })}>
                  {CONTACT_DETAILS.phone}
                </a>
                .
              </>
            )}
          </p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-5 min-h-[44px] text-xs uppercase tracking-[0.16em] opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: ui.textMuted }}
          >
            {trb("Send another", "ابعت رسالة تانية", "أرسل رسالة أخرى")}
          </button>
        </div>
      </div>
    );
  }

  const mailto = `mailto:${CONTACT_DETAILS.email}?subject=${encodeURIComponent(subject || brand.name)}&body=${encodeURIComponent(
    `${message}\n\n${draftName}`,
  )}`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="grid gap-7 sm:gap-8">
      <input type="hidden" name="_page" value={brand.name} />
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      <Reveal>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-8">
          <div>
            <label className={labelClass} style={labelStyle} htmlFor={`${uid}-name`}>
              {tr("Name", "الاسم")}
            </label>
            <input id={`${uid}-name`} name="name" required autoComplete="name" placeholder={tr("Your name", "اسمك")} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle} htmlFor={`${uid}-email`}>
              {trb("Email", "الإيميل", "البريد الإلكتروني")}
            </label>
            <input id={`${uid}-email`} name="email" type="email" required autoComplete="email" placeholder="you@example.com" dir="ltr" className={`${inputClass} rtl:text-right`} style={inputStyle} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-8">
          <div>
            <label className={labelClass} style={labelStyle} htmlFor={`${uid}-phone`}>
              {trb("Phone", "الموبايل", "الهاتف")}
            </label>
            <input id={`${uid}-phone`} name="phone" type="tel" autoComplete="tel" placeholder={tr("Optional", "اختياري")} className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className={labelClass} style={labelStyle} htmlFor={`${uid}-subject`}>
              {tr("This is about", "بخصوص")}
            </label>
            <select
              id={`${uid}-subject`}
              name="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
              style={inputStyle}
            >
              {options.map((opt) => (
                <option key={opt} value={opt} style={{ background: ui.bgSoft, color: ui.text }}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div>
          <label className={labelClass} style={labelStyle} htmlFor={`${uid}-message`}>
            {tr("Message", "رسالتك")}
          </label>
          <textarea
            ref={msgRef}
            id={`${uid}-message`}
            name="message"
            required
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={trb("Tell us what you need", "قولّنا محتاج إيه", "أخبرنا بما تحتاجه")}
            className={`${inputClass} resize-none`}
            style={inputStyle}
          />
        </div>
      </Reveal>

      {status === "offline" && (
        <div className="ac-step rounded-xl border p-5 sm:p-6" style={{ borderColor: `${brand.accent}55`, background: `${brand.accent}0d` }} role="status">
          <p className="flex items-center gap-2.5 text-[15px] font-medium" style={{ color: ui.text }}>
            <Info size={17} aria-hidden className="shrink-0" style={{ color: brand.accent }} />
            {trb("Online messages aren't connected yet.", "الرسايل أونلاين لسه مش متوصّلة.", "الرسائل عبر الموقع غير مفعّلة بعد.")}
          </p>
          <p className="text-sm mt-2 leading-relaxed" style={{ color: ui.textMuted }}>
            {emailLive
              ? trb("Nothing was sent from this page. Your message is ready to go by email instead.", "مفيش حاجة اتبعتت من هنا. رسالتك جاهزة تتبعت بالإيميل بدل كده.", "لم يُرسل شيء من هذه الصفحة. رسالتك جاهزة للإرسال بالبريد الإلكتروني.")
              : trb("Nothing was sent from this page. What you wrote is still here.", "مفيش حاجة اتبعتت من هنا. اللي كتبته لسه موجود.", "لم يُرسل شيء من هذه الصفحة. ما كتبته ما زال محفوظًا هنا.")}
          </p>
          {emailLive && (
            <a
              href={mailto}
              onClick={() => track("contact_submit", { method: "email", brand: brand.key })}
              className="mt-5 inline-flex items-center gap-2 text-sm font-medium px-6 min-h-[48px] rounded-full"
              style={buttonColors(brand)}
            >
              <Mail size={15} aria-hidden />
              {trb("Send by email", "ابعتها بالإيميل", "أرسلها بالبريد")}
            </a>
          )}
        </div>
      )}

      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-red-600" role="alert">
          <AlertCircle size={15} aria-hidden />
          {error}
        </p>
      )}

      <Reveal delay={0.14}>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 text-sm font-medium px-8 min-h-[48px] rounded-full transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={buttonColors(brand)}
        >
          {status === "sending" && <Loader2 size={15} className="animate-spin" aria-hidden />}
          {status === "sending" ? trb("Sending", "بيتبعت", "جارٍ الإرسال") : trb("Send message", "ابعت الرسالة", "أرسل الرسالة")}
        </button>
      </Reveal>
    </form>
  );
}
