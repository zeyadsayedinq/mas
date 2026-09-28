import type { Brand } from "../brands";

interface EyebrowProps {
  brand: Brand;
  children: React.ReactNode;
  className?: string;
}

/**
 * A section label.
 *
 * On the group page the identity manual puts small functional text in Archivo
 * and reserves copper for the mark and for rules, because copper on cream is
 * 4.10:1 and only clears for text at 24px and up. So the label itself runs
 * cocoa and the seal beside it carries the colour, which is the manual's own
 * use for it: the diamond as punctuation in layout.
 */
export default function Eyebrow({ brand, children, className = "" }: EyebrowProps) {
  const isGroup = brand.key === "mas";

  if (!isGroup) {
    return (
      <p
        className={`text-[11px] uppercase tracking-[0.22em] ${className}`}
        style={{ color: brand.accent }}
      >
        {children}
      </p>
    );
  }

  return (
    <p
      className={`font-archivo flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.3em] ${className}`}
      style={{ color: brand.ui.textMuted }}
    >
      {brand.seal && <img src={brand.seal} alt="" aria-hidden className="h-[9px] w-auto" />}
      {children}
    </p>
  );
}
