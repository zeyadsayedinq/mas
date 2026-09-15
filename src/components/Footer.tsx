import { Link } from "react-router-dom";
import { BRANDS, CHILD_BRANDS, type Brand } from "../brands";
import { CONTACT_DETAILS } from "../config";

interface FooterProps {
  brand: Brand;
}

export default function Footer({ brand }: FooterProps) {
  const isParent = brand.key === "mas";

  return (
    <footer
      className="px-5 sm:px-10 md:px-14 pt-16 pb-10 border-t border-white/10"
      style={{ background: brand.cupDim.bgBot }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            {brand.logo ? (
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-9 w-auto"
                style={{ filter: "brightness(0) invert(1)", opacity: 0.85 }}
              />
            ) : (
              <p className="text-white text-2xl font-playfair italic">{brand.name}</p>
            )}
            <p className="mt-3 text-white/45 text-sm">{brand.descriptor}</p>
            <p className="mt-1 text-white/30 text-sm">{brand.nameAr}</p>

            {!isParent && (
              <Link
                to="/"
                className="mt-5 inline-block text-[11px] uppercase tracking-[0.18em] text-white/40 hover:text-white/75 transition-colors"
              >
                A {BRANDS.mas.name} brand
              </Link>
            )}
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-4">
              Group
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/"
                  className="text-white/65 hover:text-white text-sm transition-colors"
                >
                  {BRANDS.mas.name}
                </Link>
              </li>
              {CHILD_BRANDS.map((b) => (
                <li key={b.key}>
                  <Link
                    to={b.path}
                    className="text-white/65 hover:text-white text-sm transition-colors"
                  >
                    {b.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/35 mb-4">
              Contact
            </p>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${CONTACT_DETAILS.email}`}
                  className="text-white/65 hover:text-white transition-colors"
                >
                  {CONTACT_DETAILS.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, "")}`}
                  className="text-white/65 hover:text-white transition-colors"
                >
                  {CONTACT_DETAILS.phone}
                </a>
              </li>
              <li className="text-white/45">{CONTACT_DETAILS.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-white/30 text-xs">
            {new Date().getFullYear()} {BRANDS.mas.name}. All rights reserved.
          </p>
          <p className="text-white/25 text-xs">
            Restaurants, lounges and cafés.
          </p>
        </div>
      </div>
    </footer>
  );
}
