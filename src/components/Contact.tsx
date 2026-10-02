import { Mail, Phone } from "lucide-react";
import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import Kinetic from "./Kinetic";
import ContactForm from "./ContactForm";
import { displayClass, headingFace, headingTracking, type Brand } from "../brands";
import { CONFIRMED, CONTACT_DETAILS, live } from "../config";
import { track } from "../track";

interface ContactProps {
  /** Already localised by the caller. */
  brand: Brand;
  defaultSubject?: string;
}

export default function Contact({ brand, defaultSubject }: ContactProps) {
  const { contact, ui } = brand;
  const display = displayClass(ui);
  const tight = headingTracking(ui);
  const face = headingFace(ui);
  const variant = brand.key === "aroma" ? "rise" : "curtain";
  const email = live(CONFIRMED.email);
  const phone = live(CONFIRMED.phone);

  return (
    <section
      id="contact"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32 scroll-mt-16"
      style={{ background: ui.bgAlt }}
    >
      <div className="mx-auto max-w-6xl grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="min-w-0">
          <Reveal>
            <Eyebrow brand={brand} className="mb-6">{contact.eyebrow}</Eyebrow>
          </Reveal>

          <h2 className="leading-[1.05]" style={{ color: ui.text }}>
            <span className={`block text-4xl sm:text-5xl md:text-6xl ${display}`}>
              <Kinetic text={contact.headingItalic} variant={variant} />
            </span>
            <span className={`block text-4xl sm:text-5xl md:text-6xl ${tight} ${face}`}>
              <Kinetic text={contact.heading} variant={variant} delay={0.18} />
            </span>
          </h2>

          <Reveal delay={0.12}>
            <p className="mt-7 text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
              {contact.blurb}
            </p>
          </Reveal>

          {(email || phone) && (
            <Reveal delay={0.16}>
              <ul className="mt-8 space-y-3 text-[15px]">
                {email && (
                  <li className="flex items-center gap-2.5">
                    <Mail size={16} aria-hidden style={{ color: brand.accent }} />
                    <a href={`mailto:${CONTACT_DETAILS.email}`} style={{ color: ui.text }} dir="ltr">
                      {CONTACT_DETAILS.email}
                    </a>
                  </li>
                )}
                {phone && (
                  <li className="flex items-center gap-2.5">
                    <Phone size={16} aria-hidden style={{ color: brand.accent }} />
                    <a
                      href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`}
                      onClick={() => track("call_click", { from: "contact" })}
                      style={{ color: ui.text }}
                      dir="ltr"
                    >
                      {CONTACT_DETAILS.phone}
                    </a>
                  </li>
                )}
              </ul>
            </Reveal>
          )}
        </div>

        <div className="min-w-0">
          <ContactForm brand={brand} defaultSubject={defaultSubject} />
        </div>
      </div>
    </section>
  );
}
