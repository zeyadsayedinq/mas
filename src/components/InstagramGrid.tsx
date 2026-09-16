import { AtSign } from "lucide-react";
import Reveal from "./Reveal";
import type { Brand } from "../brands";

interface InstagramGridProps {
  brand: Brand;
}

/**
 * Nine hand picked tiles rather than a live feed.
 *
 * A real feed needs the Instagram API or a paid widget, and both bring a token
 * that expires. Drop nine image URLs into `IMAGES` below, or point them at
 * files in /public, and this becomes the real thing with no integration.
 *
 * Until then it renders on brand placeholders so the section looks intentional
 * rather than broken.
 */
const IMAGES: string[] = [];

const PLACEHOLDER_CAPTIONS = [
  "Morning bar",
  "Feteer counter",
  "On the grill",
  "Terrace at dusk",
  "Desk corner",
  "Lavazza pour",
  "Weekend service",
  "The room",
  "Late shisha",
];

export default function InstagramGrid({ brand }: InstagramGridProps) {
  const ui = brand.ui;
  const handle = brand.instagram;
  const profileUrl = handle ? `https://instagram.com/${handle}` : undefined;

  return (
    <section
      className="relative px-5 sm:px-10 md:px-14 py-20 sm:py-28"
      style={{ background: ui.bg }}
    >
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
          <Reveal>
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] mb-4" style={{ color: brand.accent }}>
                Instagram
              </p>
              <h2 className="text-3xl sm:text-4xl tracking-[-0.04em]" style={{ color: ui.text }}>
                What the room actually looks like.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <a
              href={profileUrl ?? "#"}
              target={profileUrl ? "_blank" : undefined}
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-full transition-transform hover:scale-[1.02]"
              style={{ background: brand.accent, color: brand.accentText }}
            >
              <AtSign size={16} />
              {handle ? `@${handle}` : "Follow us"}
            </a>
          </Reveal>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {Array.from({ length: 9 }).map((_, i) => {
            const src = IMAGES[i];
            return (
              <Reveal key={i} delay={Math.min(0.32, i * 0.035)}>
                <a
                  href={profileUrl ?? "#"}
                  target={profileUrl ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-lg"
                  style={{ aspectRatio: "1 / 1", background: ui.bgAlt }}
                >
                  {src ? (
                    <img
                      src={src}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(${135 + i * 24}deg, ${brand.accent}1f, transparent 62%)`,
                        }}
                      />
                      <span
                        className="relative text-[10px] sm:text-[11px] uppercase tracking-[0.14em] px-2 text-center"
                        style={{ color: ui.textFaint }}
                      >
                        {PLACEHOLDER_CAPTIONS[i]}
                      </span>
                    </span>
                  )}
                </a>
              </Reveal>
            );
          })}
        </div>

        {IMAGES.length === 0 && (
          <p className="mt-5 text-xs" style={{ color: ui.textFaint }}>
            Placeholder tiles. Add nine image paths to IMAGES in
            src/components/InstagramGrid.tsx to swap in the real posts.
          </p>
        )}
      </div>
    </section>
  );
}
