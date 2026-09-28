import type { Brand } from "../brands";

interface CovyMenuProps {
  brand: Brand;
}

/**
 * Placeholder. COVY's menu is not ready to publish yet, so this holds the
 * section's place in the nav and the page flow without inventing dishes or
 * prices. Swap the panel below for the real menu (or a MenuExplorer instance,
 * once COVY has its own MENU data) when it's ready.
 */
export default function CovyMenu({ brand }: CovyMenuProps) {
  const ui = brand.ui;

  return (
    <section id="menu" className="relative py-24 sm:py-32" style={{ background: ui.bgAlt }}>
      <div className="mx-auto max-w-3xl px-5 sm:px-10 md:px-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] mb-6" style={{ color: brand.accent }}>
          Menu
        </p>
        <h2 className="leading-[1.05] tracking-[-0.03em] mb-6" style={{ color: ui.text }}>
          <span className="block font-playfair italic text-3xl sm:text-4xl">The COVY menu</span>
          <span className="block text-3xl sm:text-4xl tracking-[-0.04em]">is still being written.</span>
        </h2>
        <div
          className="mx-auto max-w-md rounded-2xl border border-dashed px-8 py-12"
          style={{ borderColor: ui.line, color: ui.textMuted }}
        >
          <p className="text-sm leading-relaxed">
            We're finalising what's on it. Check back soon, or ask the floor
            team what's on tonight when you visit.
          </p>
        </div>
      </div>
    </section>
  );
}
