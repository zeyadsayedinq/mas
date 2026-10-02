import { Link } from "react-router-dom";
import { AtSign } from "lucide-react";
import type { Brand } from "../brands";
import { CONFIRMED, CONTACT_DETAILS, SOCIAL, live } from "../config";
import { useBrand } from "../localize";
import { useLang } from "../i18n";

interface FooterProps {
  brand: Brand;
}

/**
 * The group footer. Email and phone only appear once confirmed in config.ts;
 * until then the contact column points at the form.
 */
export default function Footer({ brand }: FooterProps) {
  const ui = brand.ui;
  const { tr, href } = useLang();
  const mas = useBrand("mas");
  const children = [useBrand("aroma"), useBrand("covy")];
  const isParent = brand.key === "mas";
  const instagram = brand.instagram || SOCIAL[brand.key]?.instagram;
  const showEmail = live(CONFIRMED.email);
  const showPhone = live(CONFIRMED.phone);

  const toContact = (e: React.MouseEvent) => {
    const el = document.getElementById("contact");
    if (!el) return;
    e.preventDefault();
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  };

  const linkCls = "inline-flex min-h-[32px] items-center text-sm transition-opacity hover:opacity-100 opacity-80";
  const headCls = "text-[10px] font-semibold uppercase tracking-[0.2em] mb-4";

  return (
    <footer className="px-5 sm:px-10 md:px-14 pt-16 pb-10 border-t" style={{ background: ui.bg, borderColor: ui.line }}>
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            {isParent ? (
              /* The bilingual stacked lockup: Arabic in Aref Ruqaa under the
                 wordmark, separated by a hairline the width of the Arabic. */
              <span className="inline-flex flex-col items-start">
                <img src={brand.logo!} alt={mas.name} className="h-9 w-auto" />
                <span
                  className="font-archivo mt-1.5 text-[7px] font-medium uppercase"
                  style={{ color: ui.text, opacity: 0.7, letterSpacing: "0.3em" }}
                  lang="en"
                >
                  Egypt · Food &amp; Beverage Group
                </span>
                <span className="mt-4 inline-flex flex-col items-stretch">
                  <span className="h-px w-full" style={{ background: brand.accent, opacity: 0.7 }} />
                  <span className="font-ruqaa mt-3 text-2xl text-center" style={{ color: ui.text, lineHeight: 1.8 }} lang="ar">
                    {brand.nameAr}
                  </span>
                </span>
              </span>
            ) : (
              <img src={brand.logo} alt={brand.name} className="h-9 w-auto" />
            )}
            <p className="mt-4 text-sm" style={{ color: ui.textFaint }}>{brand.descriptor}</p>

            {instagram && (
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm transition-opacity hover:opacity-100 opacity-75"
                style={{ color: ui.textMuted }}
              >
                <AtSign size={15} aria-hidden />
                <span dir="ltr">@{instagram}</span>
              </a>
            )}
          </div>

          <nav aria-label={tr("Group", "المجموعة")}>
            <p className={headCls} style={{ color: ui.textFaint }}>{tr("Group", "المجموعة")}</p>
            <ul className="space-y-1.5">
              <li>
                <Link to={href("/")} className={linkCls} style={{ color: ui.textMuted }}>{mas.name}</Link>
              </li>
              {children.map((b) => (
                <li key={b.key}>
                  <Link to={href(b.path)} className={linkCls} style={{ color: ui.textMuted }}>{b.name}</Link>
                </li>
              ))}
              <li>
                <Link
                  to={`${href("/")}#services`}
                  onClick={(e) => {
                    const el = document.getElementById("services");
                    if (!el) return;
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className={linkCls}
                  style={{ color: ui.textMuted }}
                >
                  {tr("Venue management", "إدارة الأماكن")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className={headCls} style={{ color: ui.textFaint }}>{tr("Contact", "تواصل")}</p>
            <ul className="space-y-1.5 text-sm">
              {showEmail && (
                <li>
                  <a href={`mailto:${CONTACT_DETAILS.email}`} className={linkCls} style={{ color: ui.textMuted }} dir="ltr">
                    {CONTACT_DETAILS.email}
                  </a>
                </li>
              )}
              {showPhone && (
                <li>
                  <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`} className={linkCls} style={{ color: ui.textMuted }} dir="ltr">
                    {CONTACT_DETAILS.phone}
                  </a>
                </li>
              )}
              {!showEmail && !showPhone && (
                <li>
                  <a href="#contact" onClick={toContact} className={linkCls} style={{ color: ui.textMuted }}>
                    {tr("Use the contact form", "استخدم نموذج التواصل")}
                  </a>
                </li>
              )}
              <li className="pt-1" style={{ color: ui.textFaint }}>{tr("Cairo, Egypt", "القاهرة، مصر")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3" style={{ borderColor: ui.line }}>
          <p className="text-xs" style={{ color: ui.textFaint }}>
            © {new Date().getFullYear()} {mas.name}. {tr("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
          <p className="text-xs" style={{ color: ui.textFaint }}>
            {tr("Owned brands, and venues operated for their owners.", "علامات نملكها، وأماكن نشغّلها لملّاكها.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
