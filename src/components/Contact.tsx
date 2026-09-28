import Reveal from "./Reveal";
import Eyebrow from "./Eyebrow";
import ContactForm from "./ContactForm";
import { displayClass, headingFace, headingTracking, type Brand } from "../brands";

interface ContactProps {
  brand: Brand;
  defaultSubject?: string;
}

export default function Contact({ brand, defaultSubject }: ContactProps) {
  const { contact, ui } = brand;
  const display = displayClass(ui);
  const tight = headingTracking(ui);
  const face = headingFace(ui);

  return (
    <section
      id="contact"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: ui.bgAlt }}
    >
      <div className="mx-auto max-w-6xl grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow brand={brand} className="mb-6">{contact.eyebrow}</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="leading-[1.05]" style={{ color: ui.text }}>
              <span className={`block text-4xl sm:text-5xl md:text-6xl ${display}`}>
                {contact.headingItalic}
              </span>
              <span className={`block text-4xl sm:text-5xl md:text-6xl ${tight} ${face}`}>
                {contact.heading}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 text-[15px] leading-relaxed max-w-sm" style={{ color: ui.textMuted }}>
              {contact.blurb}
            </p>
          </Reveal>
        </div>

        <div>
          <ContactForm brand={brand} defaultSubject={defaultSubject} />
        </div>
      </div>
    </section>
  );
}
