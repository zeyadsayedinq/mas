import { useState, type FormEvent } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import Reveal from "./Reveal";
import { BRANDS, type Brand } from "../brands";
import { FORMSPREE_ENDPOINT } from "../config";

interface ContactFormProps {
  brand: Brand;
  /** Preselects the brand dropdown on a brand page. */
  defaultSubject?: string;
}

type Status = "idle" | "sending" | "sent" | "error";

const SUBJECT_OPTIONS = [
  BRANDS.mas.name,
  BRANDS.aroma.name,
  BRANDS.covy.name,
  "Something else",
];

export default function ContactForm({ brand, defaultSubject }: ContactFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const inputClass =
    "w-full bg-transparent border-b border-white/20 focus:border-white/70 outline-none text-white placeholder-white/35 text-[15px] py-3 transition-colors";
  const labelClass = "block text-[10px] uppercase tracking-[0.2em] text-white/45 mb-1";

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = Object.fromEntries(data.entries());
    setStatus("sending");
    setError("");

    // No endpoint configured yet. Keep the form usable and show what it would
    // have sent, so the page can be demoed before Formspree is wired up.
    if (!FORMSPREE_ENDPOINT) {
      console.warn(
        "[contact] FORMSPREE_ENDPOINT is empty in src/config.ts. Payload that would have been sent:",
        payload,
      );
      window.setTimeout(() => {
        setStatus("sent");
        form.reset();
      }, 600);
      return;
    }

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }

      const body = await res.json().catch(() => null);
      setError(
        body?.errors?.[0]?.message ??
          "That did not go through. Try again, or email us directly.",
      );
      setStatus("error");
    } catch {
      setError("Network error. Check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <Reveal>
        <div className="border border-white/15 rounded-xl p-8 sm:p-10 flex items-start gap-4">
          <span
            className="shrink-0 mt-0.5 rounded-full p-2"
            style={{ background: brand.accent, color: brand.accentText }}
          >
            <Check size={16} />
          </span>
          <div>
            <p className="text-white text-lg font-medium">Message received.</p>
            <p className="text-white/60 text-sm mt-1.5 leading-relaxed">
              Someone from the group office will come back to you. If it is
              urgent, call the number in the footer.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-5 text-xs uppercase tracking-[0.16em] text-white/50 hover:text-white/85 transition-colors"
            >
              Send another
            </button>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-7 sm:gap-8">
      <input type="hidden" name="_page" value={brand.name} />

      <Reveal>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-8">
          <div>
            <label className={labelClass} htmlFor="cf-name">
              Name
            </label>
            <input
              id="cf-name"
              name="name"
              required
              autoComplete="name"
              placeholder="Your name"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="cf-email">
              Email
            </label>
            <input
              id="cf-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="grid gap-7 sm:grid-cols-2 sm:gap-8">
          <div>
            <label className={labelClass} htmlFor="cf-phone">
              Phone
            </label>
            <input
              id="cf-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Optional"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="cf-subject">
              This is about
            </label>
            <select
              id="cf-subject"
              name="subject"
              defaultValue={defaultSubject ?? BRANDS.mas.name}
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              {SUBJECT_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-neutral-900 text-white">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div>
          <label className={labelClass} htmlFor="cf-message">
            Message
          </label>
          <textarea
            id="cf-message"
            name="message"
            required
            rows={4}
            placeholder="Tell us what you need"
            className={`${inputClass} resize-none`}
          />
        </div>
      </Reveal>

      {status === "error" && (
        <p className="flex items-center gap-2 text-sm text-red-300">
          <AlertCircle size={15} />
          {error}
        </p>
      )}

      <Reveal delay={0.14}>
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex items-center gap-2 text-sm font-medium px-8 py-3.5 rounded-full transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: brand.accent, color: brand.accentText }}
        >
          {status === "sending" && <Loader2 size={15} className="animate-spin" />}
          {status === "sending" ? "Sending" : "Send message"}
        </button>
      </Reveal>
    </form>
  );
}
