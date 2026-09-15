import Reveal from "./Reveal";
import ContactForm from "./ContactForm";
import type { Brand } from "../brands";

interface ContactProps {
  brand: Brand;
  defaultSubject?: string;
}

export default function Contact({ brand, defaultSubject }: ContactProps) {
  const { contact } = brand;

  return (
    <section
      id="contact"
      className="relative px-5 sm:px-10 md:px-14 py-24 sm:py-32"
      style={{ background: brand.cupDim.bgTop }}
    >
      <div className="mx-auto max-w-6xl grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div>
          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.22em] mb-6"
              style={{ color: brand.accent }}
            >
              {contact.eyebrow}
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="text-white leading-[1.0] tracking-[-0.03em]">
              <span className="block font-playfair italic text-4xl sm:text-5xl md:text-6xl">
                {contact.headingItalic}
              </span>
              <span className="block text-4xl sm:text-5xl md:text-6xl tracking-[-0.05em]">
                {contact.heading}
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-7 text-white/60 text-[15px] leading-relaxed max-w-sm">
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
