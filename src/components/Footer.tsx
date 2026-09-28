import { Link } from "react-router-dom";
import { AtSign } from "lucide-react";
import { BRANDS, CHILD_BRANDS, type Brand } from "../brands";
import { CONTACT_DETAILS } from "../config";

interface FooterProps {
  brand: Brand;
}

export default function Footer({ brand }: FooterProps) {
  const isParent = brand.key === "mas";
  const ui = brand.ui;
  const light = ui.scheme === "light";
  const logoFilter = light ? undefined : "brightness(0) invert(1)";

  return (
    <footer
      className="px-5 sm:px-10 md:px-14 pt-16 pb-10 border-t"
      style={{ background: ui.bg, borderColor: ui.line }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            {isParent ? (
              /* The bilingual stacked lockup: Arabic in Aref Ruqaa, centred
                 under the wordmark and separated by a hairline the width of
                 the Arabic. It never sits beside the mark on a line. */
              <span className="inline-flex flex-col items-start">
                <img
                  src={light ? brand.logo! : brand.logoReversed ?? brand.logo!}
                  alt={brand.name}
                  className="h-9 w-auto"
                />
                <span
                  className="font-archivo mt-1.5 text-[7px] font-medium uppercase"
                  style={{ color: ui.text, opacity: 0.7, letterSpacing: "0.3em" }}
                >
                  Egypt · Food &amp; Beverage Group
                </span>
                {/* The hairline takes the width of the Arabic, and the Arabic
                    sits under the mark rather than beside it: on a line the
                    laps make the pair read as broken. */}
                <span className="mt-4 inline-flex flex-col items-stretch">
                  <span className="h-px w-full" style={{ background: brand.accent, opacity: 0.7 }} />
                  <span
                    className="font-ruqaa mt-3 text-2xl text-center"
                    style={{ color: ui.text, lineHeight: 1.8 }}
                  >
                    {brand.nameAr}
                  </span>
                </span>
              </span>
            ) : (
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-9 w-auto"
                style={{ filter: logoFilter, opacity: light ? 1 : 0.85 }}
              />
            )}
            <p className="mt-4 text-sm" style={{ color: ui.textFaint }}>
              {brand.descriptor}
            </p>
            {!isParent && (
              <p className="mt-1 text-sm" style={{ color: ui.textFaint }}>
                {brand.nameAr}
              </p>
            )}

            {brand.instagram && (
              <a
                href={`https://instagram.com/${brand.instagram}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-100 opacity-75"
                style={{ color: ui.textMuted }}
              >
                <AtSign size={15} />@{brand.instagram}
              </a>
            )}

            {!isParent && (
              <Link
                to="/"
                className="mt-5 block text-[11px] uppercase tracking-[0.18em] transition-opacity hover:opacity-100 opacity-70"
                style={{ color: ui.textFaint }}
              >
                A {BRANDS.mas.name} brand
              </Link>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: ui.textFaint }}>
              Group
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm transition-opacity hover:opacity-100 opacity-80" style={{ color: ui.textMuted }}>
                  {BRANDS.mas.name}
                </Link>
              </li>
              {CHILD_BRANDS.map((b) => (
                <li key={b.key}>
                  <Link to={b.path} className="text-sm transition-opacity hover:opacity-100 opacity-80" style={{ color: ui.textMuted }}>
                    {b.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/#services"
                  className="text-sm transition-opacity hover:opacity-100 opacity-80"
                  style={{ color: ui.textMuted }}
                >
                  Venue management
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] mb-4" style={{ color: ui.textFaint }}>
              Contact
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href={`mailto:${CONTACT_DETAILS.email}`} className="transition-opacity hover:opacity-100 opacity-80" style={{ color: ui.textMuted }}>
                  {CONTACT_DETAILS.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`}
                  className="transition-opacity hover:opacity-100 opacity-80"
                  style={{ color: ui.textMuted }}
                >
                  {CONTACT_DETAILS.phone}
                </a>
              </li>
              <li style={{ color: ui.textFaint }}>{CONTACT_DETAILS.address}</li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          style={{ borderColor: ui.line }}
        >
          <p className="text-xs" style={{ color: ui.textFaint }}>
            © {new Date().getFullYear()} {BRANDS.mas.name}. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: ui.textFaint }}>
Owned brands and venues operated for third party owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
