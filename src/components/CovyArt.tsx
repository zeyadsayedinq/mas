import { useEffect, useId, useRef } from "react";
import "./covy-art.css";

/**
 * COVY's own drawings: the evening table, the bar, the kitchen, the room and
 * a candle. Flat shapes with fine line detail in the four colours of the
 * identity sheet only, lit by a lamp glow taken from the greige. Every piece
 * has a transparent ground so it can sit on the dusty blue tiles.
 */

const NAVY = "#262D3F";
const GREIGE = "#DCD4CF";
const MOCHA = "#765F4D";
const BLUE = "#7E98AE";
/** Lamp light: the greige lifted toward white, still warm. */
const GLOW = "#F4EFEB";

/** The four point star from the monogram, centred on 0,0 with radius 12. */
const STAR = "M0,-12C.9,-4.8 4.8,-.9 12,0C4.8,.9 .9,4.8 0,12C-.9,4.8 -4.8,.9 -12,0C-4.8,-.9 -.9,-4.8 0,-12Z";

export interface CovyArtProps {
  className?: string;
  /** Flame, glow, steam and glint motion. Defaults to true. */
  animate?: boolean;
}

/** A per-instance id prefix, safe inside url(#...). */
function useUid() {
  return "ca" + useId().replace(/[^a-zA-Z0-9_-]/g, "");
}

/**
 * SVG animation runs on the main thread, so a drawing that is off screen is
 * frozen until it comes back. One shared observer covers every drawing.
 */
let artObserver: IntersectionObserver | null = null;
function useOffscreenPause() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    artObserver ??= new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle("ca-off", !e.isIntersecting)),
      { rootMargin: "80px 0px" },
    );
    artObserver.observe(el);
    return () => artObserver?.unobserve(el);
  }, []);
  return ref;
}

/** Class name only when motion is on. */
const motion = (on: boolean) => (c: string) => (on ? c : undefined);

/** Soft radial light for lamp and candle, plus the flatter pool it throws. */
function Lights({ id }: { id: string }) {
  return (
    <>
      <radialGradient id={`${id}g`}>
        <stop offset="0" stopColor={GLOW} stopOpacity=".9" />
        <stop offset=".35" stopColor={GREIGE} stopOpacity=".38" />
        <stop offset="1" stopColor={GREIGE} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={`${id}p`}>
        <stop offset="0" stopColor={GLOW} stopOpacity=".34" />
        <stop offset=".6" stopColor={GREIGE} stopOpacity=".12" />
        <stop offset="1" stopColor={GREIGE} stopOpacity="0" />
      </radialGradient>
    </>
  );
}

function Star({ x, y, r, color = GLOW, cls, delay, opacity }: { x: number; y: number; r: number; color?: string; cls?: string; delay?: number; opacity?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${r / 12})`}>
      <path d={STAR} fill={color} className={cls} opacity={opacity} style={delay ? { animationDelay: `${delay}s` } : undefined} />
    </g>
  );
}

/** Candle flame with its blue root. Origin is the wick tip. */
function Flame({ cls }: { cls: (c: string) => string | undefined }) {
  return (
    <g className={cls("ca-flame")}>
      <path d="M0,-24C5,-15 7,-8 0,0C-7,-8 -5,-15 0,-24Z" fill={GLOW} />
      <path d="M0,-12C2.4,-7 3,-3.5 0,0C-3,-3.5 -2.4,-7 0,-12Z" fill={GREIGE} />
      <ellipse cx="0" cy="-2" rx="1.8" ry="2.4" fill={BLUE} />
    </g>
  );
}

/** Pillar candle standing on 0,0: `h` tall, 24 wide. */
function Pillar({ h, id, cls }: { h: number; id: string; cls: (c: string) => string | undefined }) {
  return (
    <g>
      <g className="ca-candle">
        <circle cx="0" cy={-h - 14} r="34" fill={`url(#${id}g)`} className={cls("ca-halo")} />
      </g>
      <ellipse cx="0" cy="0" rx="19" ry="4.5" fill={MOCHA} />
      <path d={`M-12,0V${-h}H12V0Z`} fill={GREIGE} />
      <path d={`M5,0V${-h}H12V0Z`} fill={MOCHA} opacity=".16" />
      <path d={`M-12,${-h}V${-h + 9}q2,5 4,0V${-h + 4}`} fill={GLOW} />
      <ellipse cx="0" cy={-h} rx="12" ry="3" fill={GLOW} />
      <path d={`M0,${-h}v-5`} stroke={NAVY} strokeWidth="1.4" strokeLinecap="round" />
      <g transform={`translate(0 ${-h - 5})`}>
        <Flame cls={cls} />
      </g>
    </g>
  );
}

/**
 * The hero vignette: a round table at night with a small lamp, a coupe, a
 * rocks glass with one clear cube, a single bite on a plate and a candle.
 * The upper half is left open for the tile behind it.
 */
export function CovyNightTable({ className, animate = true }: CovyArtProps) {
  const art = useOffscreenPause();
  const id = useUid();
  const m = motion(animate);
  return (
    <svg viewBox="0 0 600 420" ref={art} className={className} aria-hidden="true" focusable="false">
      <defs>
        <Lights id={id} />
      </defs>

      {/* Lamp light in the air. The outer group follows the page dimmer. */}
      <g className="ca-lamp">
        <g className={m("ca-breathe")}>
          <circle cx="118" cy="178" r="114" fill={`url(#${id}g)`} />
          <path d="M78,206H158L214,330H22Z" fill={GLOW} opacity=".09" />
        </g>
      </g>
      <Star x={402} y={118} r={9} cls={m("ca-twinkle")} />
      <Star x={452} y={172} r={5} cls={m("ca-twinkle")} delay={1.8} />
      <Star x={214} y={92} r={4} cls={m("ca-twinkle")} delay={3.1} />

      {/* Table: a round top, its lit lip and the edge below. */}
      <path d="M300,420V390" stroke={NAVY} strokeWidth="46" />
      <path d="M8,342A292,62 0 0 0 592,342V358A292,62 0 0 1 8,358Z" fill={NAVY} />
      <path d="M8,342A292,62 0 0 0 592,342V358A292,62 0 0 1 8,358Z" fill={MOCHA} opacity=".35" />
      <ellipse cx="300" cy="342" rx="292" ry="62" fill={NAVY} />
      <ellipse cx="300" cy="342" rx="276" ry="54" fill="none" stroke={MOCHA} strokeWidth="1" opacity=".7" />
      <path d="M8,342A292,62 0 0 0 592,342" fill="none" stroke={GREIGE} strokeWidth="1.2" opacity=".55" />
      <g className="ca-lamp">
        <g className={m("ca-breathe")}>
          <ellipse cx="160" cy="338" rx="180" ry="44" fill={`url(#${id}p)`} />
        </g>
      </g>
      <g className="ca-candle">
        <ellipse cx="524" cy="326" rx="64" ry="14" fill={`url(#${id}p)`} />
      </g>

      {/* Lamp. */}
      <ellipse cx="136" cy="324" rx="30" ry="5" fill={NAVY} opacity=".7" />
      <path d="M118,208V312" stroke={NAVY} strokeWidth="3" />
      <path d="M96,324Q96,306 118,304Q140,306 140,324Z" fill={NAVY} />
      <path d="M100,318Q102,309 114,307" fill="none" stroke={GLOW} strokeWidth="1.2" opacity=".6" />
      <path d="M92,150H144L162,206H74Z" fill={GREIGE} />
      <path d="M126,150H144L162,206H140Z" fill={MOCHA} opacity=".16" />
      <path d="M92,150H144L162,206H74Z" fill={NAVY} className="ca-shade-dim" />
      <g stroke={MOCHA} strokeWidth=".8" opacity=".3">
        <path d="M101,150L90,206M110,150L104,206M126,150L132,206M135,150L146,206" />
      </g>
      <ellipse cx="118" cy="206" rx="44" ry="6" fill={GLOW} className="ca-bulb" />
      <ellipse cx="118" cy="150" rx="26" ry="3.5" fill={GLOW} />
      <path d="M118,146V140" stroke={NAVY} strokeWidth="2" strokeLinecap="round" />
      <circle cx="118" cy="138" r="2.6" fill={NAVY} />

      {/* Candle, back right. */}
      <g transform="translate(524 322)">
        <Pillar h={44} id={id} cls={m} />
      </g>

      {/* Rocks glass with one clear cube. */}
      <g>
        <ellipse cx="346" cy="355" rx="38" ry="5" fill={NAVY} opacity=".8" />
        <path d="M306,286L310,352Q340,358 370,352L374,286Z" fill={GREIGE} opacity=".12" />
        <path d="M307.8,314L309.4,338Q340,344 370.6,338L372.2,314Z" fill={MOCHA} />
        <ellipse cx="340" cy="314" rx="32.2" ry="4.4" fill={MOCHA} />
        <ellipse cx="340" cy="314" rx="32.2" ry="4.4" fill={GREIGE} opacity=".28" />
        <g transform="rotate(-8 338 308)">
          <rect x="318" y="290" width="40" height="36" rx="7" fill={GLOW} opacity=".24" />
          <rect x="318" y="290" width="40" height="36" rx="7" fill="none" stroke={GLOW} strokeWidth="1.4" opacity=".9" />
          <rect x="324" y="296" width="28" height="24" rx="4" fill="none" stroke={GLOW} strokeWidth=".8" opacity=".45" />
          <path d="M323,302L331,294" stroke={GLOW} strokeWidth="1.6" strokeLinecap="round" opacity=".8" />
        </g>
        <path d="M309.4,338Q340,344 370.6,338L370,352Q340,358 310,352Z" fill={GREIGE} opacity=".32" />
        <path d="M306,286L310,352Q340,358 370,352L374,286" fill="none" stroke={GREIGE} strokeWidth="1.6" />
        <ellipse cx="340" cy="286" rx="34" ry="5" fill="none" stroke={GREIGE} strokeWidth="1.4" />
        <path d="M312,294L315,344" stroke={GLOW} strokeWidth="2" strokeLinecap="round" opacity=".55" />
        <Star x={324} y={294} r={7} cls={m("ca-glint")} opacity={animate ? undefined : 0.8} />
      </g>

      {/* Coupe. */}
      <g>
        <ellipse cx="242" cy="367" rx="36" ry="5" fill={NAVY} opacity=".8" />
        <path d="M190,238Q194,262 236,264Q278,262 282,238Z" fill={MOCHA} />
        <ellipse cx="236" cy="238" rx="46" ry="6" fill={MOCHA} />
        <ellipse cx="236" cy="238" rx="46" ry="6" fill={GREIGE} opacity=".28" />
        <path d="M186,226Q188,264 236,266Q284,264 286,226Z" fill={GREIGE} opacity=".12" />
        <path d="M186,226Q188,264 236,266Q284,264 286,226" fill="none" stroke={GREIGE} strokeWidth="1.6" />
        <ellipse cx="236" cy="226" rx="50" ry="7" fill="none" stroke={GREIGE} strokeWidth="1.4" />
        <path d="M236,266V362" stroke={GREIGE} strokeWidth="2.4" />
        <path d="M233,272Q236,269 239,272" fill="none" stroke={GREIGE} strokeWidth="2" />
        <ellipse cx="236" cy="364" rx="28" ry="5" fill={GREIGE} opacity=".3" />
        <ellipse cx="236" cy="364" rx="28" ry="5" fill="none" stroke={GREIGE} strokeWidth="1.4" />
        <path d="M194,236Q198,252 214,258" fill="none" stroke={GLOW} strokeWidth="2" strokeLinecap="round" opacity=".75" />
        <path d="M272,224C282,212 294,218 288,228C284,236 294,244 302,238" fill="none" stroke={GREIGE} strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* One bite on a small plate. */}
      <g transform="translate(446 368)">
        <ellipse cx="0" cy="3.5" rx="58" ry="13" fill={GREIGE} opacity=".55" />
        <ellipse cx="0" cy="0" rx="58" ry="13" fill={GREIGE} />
        <ellipse cx="0" cy=".5" rx="40" ry="8" fill="none" stroke={MOCHA} strokeWidth=".9" opacity=".35" />
        <path d="M-36,4Q-4,11 34,1" fill="none" stroke={NAVY} strokeWidth="2.6" strokeLinecap="round" opacity=".85" />
        <path d="M-20,1C-18,-12 12,-15 22,-5C20,4 -10,6 -20,1Z" fill={MOCHA} />
        <path d="M-13,-7C-5,-12 8,-12 15,-8" fill="none" stroke={GLOW} strokeWidth="1.1" opacity=".6" />
        <path d="M2,-12q3,-8 12,-9q-2,8 -12,9Z" fill={BLUE} />
        <path d="M2,-12q5,-5 12,-9" fill="none" stroke={GLOW} strokeWidth=".6" opacity=".7" />
        <circle cx="-42" cy="1" r="1.8" fill={BLUE} />
        <circle cx="-48" cy="3" r="1.2" fill={BLUE} />
        <circle cx="40" cy="-2" r="1.5" fill={BLUE} />
      </g>

      {/* Folded napkin with the monogram star. */}
      <g>
        <path d="M98,366L164,358L180,376L112,385Z" fill={GREIGE} />
        <path d="M131,362L164,358L180,376L146,381Z" fill={MOCHA} opacity=".12" />
        <path d="M131,362L146,381" stroke={GLOW} strokeWidth="1" opacity=".8" />
        <path d="M103,369L113,381" stroke={MOCHA} strokeWidth=".6" opacity=".35" />
        <g transform="translate(120 373) scale(.42 .3)">
          <path d={STAR} fill={MOCHA} />
        </g>
      </g>
    </svg>
  );
}

/** "The bar": a coupe with a thin twist beside a layered highball. */
export function CovyBarGlass({ className, animate = true }: CovyArtProps) {
  const art = useOffscreenPause();
  const m = motion(animate);
  const still = animate ? undefined : 0.8;
  return (
    <svg viewBox="0 0 320 220" ref={art} className={className} aria-hidden="true" focusable="false">
      <ellipse cx="116" cy="212" rx="44" ry="4.5" fill={NAVY} opacity=".3" />
      <ellipse cx="230" cy="212" rx="36" ry="4.5" fill={NAVY} opacity=".3" />

      {/* Coupe. */}
      <path d="M50,108Q56,140 112,144Q168,140 174,108Z" fill={MOCHA} />
      <ellipse cx="112" cy="108" rx="62" ry="8.5" fill={MOCHA} />
      <ellipse cx="112" cy="108" rx="62" ry="8.5" fill={GREIGE} opacity=".26" />
      <path d="M48,96Q51,144 112,147Q173,144 176,96Z" fill={GREIGE} opacity=".14" />
      <path d="M48,96Q51,144 112,147Q173,144 176,96" fill="none" stroke={GREIGE} strokeWidth="1.8" />
      <ellipse cx="112" cy="96" rx="64" ry="9" fill="none" stroke={GREIGE} strokeWidth="1.6" />
      <path d="M112,147V206" stroke={GREIGE} strokeWidth="2.8" />
      <path d="M108,153Q112,149 116,153" fill="none" stroke={GREIGE} strokeWidth="2.2" />
      <ellipse cx="112" cy="208" rx="34" ry="5.5" fill={GREIGE} opacity=".3" />
      <ellipse cx="112" cy="208" rx="34" ry="5.5" fill="none" stroke={GREIGE} strokeWidth="1.6" />
      <path d="M56,112Q62,132 84,140" fill="none" stroke={GLOW} strokeWidth="2.4" strokeLinecap="round" opacity=".8" />
      <path d="M64,94C52,78 34,84 40,98C44,108 32,118 20,110" fill="none" stroke={GREIGE} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M63,93C52,80 36,86 41,97" fill="none" stroke={MOCHA} strokeWidth=".9" opacity=".6" />

      {/* Highball: tonic over a dark pour, three cubes, a navy straw. */}
      <path d="M252,26L226,178" stroke={NAVY} strokeWidth="3.4" strokeLinecap="round" />
      <path d="M200.6,74L203.5,150H252.5L255.4,74Z" fill={GREIGE} opacity=".32" />
      <path d="M203.5,150L204,206Q228,211 252,206L252.5,150Z" fill={MOCHA} />
      <path d="M203.5,150Q228,156 252.5,150" fill="none" stroke={GREIGE} strokeWidth="1" opacity=".5" />
      <ellipse cx="228" cy="74" rx="27.4" ry="4" fill={GLOW} opacity=".35" />
      <g fill={GLOW} fillOpacity=".2" stroke={GLOW} strokeWidth="1.3" strokeOpacity=".85">
        <rect x="208" y="70" width="24" height="23" rx="5" transform="rotate(-10 220 81)" />
        <rect x="226" y="92" width="23" height="22" rx="5" transform="rotate(12 237 103)" />
        <rect x="207" y="112" width="23" height="22" rx="5" transform="rotate(-4 218 123)" />
      </g>
      <g fill={GLOW} opacity=".7">
        <circle cx="222" cy="142" r="1.3" /><circle cx="241" cy="132" r="1" /><circle cx="236" cy="160" r="1.1" />
        <circle cx="214" cy="170" r=".9" /><circle cx="244" cy="184" r="1.2" /><circle cx="218" cy="192" r="1" />
      </g>
      <path d="M204,198Q228,203 252,198L252,206Q228,211 204,206Z" fill={GREIGE} opacity=".3" />
      <path d="M200,48L204,206Q228,211 252,206L256,48" fill="none" stroke={GREIGE} strokeWidth="1.8" />
      <ellipse cx="228" cy="48" rx="28" ry="4.5" fill="none" stroke={GREIGE} strokeWidth="1.6" />
      <path d="M206,56L209,196" stroke={GLOW} strokeWidth="2.4" strokeLinecap="round" opacity=".5" />

      <Star x={160} y={92} r={8} cls={m("ca-glint")} opacity={still} />
      <Star x={214} y={74} r={6} cls={m("ca-glint")} delay={3.4} opacity={still} />
      <Star x={290} y={40} r={5} cls={m("ca-twinkle")} delay={1.2} />
    </svg>
  );
}

/** "The kitchen": a plated dish, the cloche just lifted, steam getting out. */
export function CovyKitchenPlate({ className, animate = true }: CovyArtProps) {
  const art = useOffscreenPause();
  const id = useUid();
  const m = motion(animate);
  const steam = (d: string, delay: number) => (
    <path d={d} fill="none" stroke={GLOW} strokeWidth="2" strokeLinecap="round" className={m("ca-steam")} opacity={animate ? undefined : 0.55} style={animate ? { animationDelay: `${delay}s` } : undefined} />
  );
  return (
    <svg viewBox="0 0 320 220" ref={art} className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${id}d`}>
          <path d="M122,128C122,72 278,72 278,128Z" />
        </clipPath>
      </defs>
      <ellipse cx="156" cy="190" rx="130" ry="20" fill={NAVY} opacity=".28" />

      {/* Plate, with a fine band at the rim. */}
      <ellipse cx="150" cy="181" rx="122" ry="30" fill={GREIGE} opacity=".6" />
      <ellipse cx="150" cy="176" rx="122" ry="30" fill={GREIGE} />
      <ellipse cx="150" cy="176" rx="113" ry="26" fill="none" stroke={MOCHA} strokeWidth=".9" opacity=".4" />
      <ellipse cx="150" cy="178" rx="80" ry="18" fill={GLOW} opacity=".55" />

      {/* A navy swoosh, the medallion, a few drops and a sprig. */}
      <path d="M86,182C106,196 176,198 206,182C180,192 116,192 86,182Z" fill={NAVY} opacity=".85" />
      <path d="M114,164V176A34,10 0 0 0 182,176V164Z" fill={MOCHA} />
      <path d="M164,164V176A34,10 0 0 1 150,184.6V174Z" fill={NAVY} opacity=".14" />
      <ellipse cx="148" cy="164" rx="34" ry="10" fill={MOCHA} />
      <ellipse cx="148" cy="164" rx="34" ry="10" fill={GREIGE} opacity=".2" />
      <ellipse cx="148" cy="164" rx="34" ry="10" fill="none" stroke={GLOW} strokeWidth=".9" opacity=".5" />
      <g stroke={NAVY} strokeWidth="1.2" strokeLinecap="round" opacity=".35">
        <path d="M128,166L138,158M140,169L152,158M154,170L165,160" />
      </g>
      <g fill={BLUE}>
        <circle cx="210" cy="176" r="2.4" /><circle cx="220" cy="180" r="1.6" /><circle cx="94" cy="174" r="1.8" />
      </g>
      <path d="M136,163q6,-12 20,-12q-6,12 -20,12Z" fill={BLUE} />
      <path d="M150,166q10,-4 20,2q-10,5 -20,-2Z" fill={BLUE} />
      <path d="M136,163q8,-6 20,-12M150,166q10,-1 20,2" fill="none" stroke={GLOW} strokeWidth=".7" opacity=".7" />

      {/* Cloche, hinged on the far rim. */}
      <g transform="rotate(16 200 128)">
        <path d="M122,128C122,72 278,72 278,128Z" fill={GREIGE} />
        <ellipse cx="300" cy="126" rx="64" ry="62" fill={MOCHA} opacity=".2" clipPath={`url(#${id}d)`} />
        <path d="M136,114C142,96 160,86 182,82" fill="none" stroke={GLOW} strokeWidth="3" strokeLinecap="round" opacity=".95" />
        <ellipse cx="200" cy="128" rx="78" ry="9" fill={MOCHA} opacity=".4" />
        <ellipse cx="200" cy="128" rx="78" ry="9" fill="none" stroke={GREIGE} strokeWidth="3" />
        <path d="M122,128A78,9 0 0 0 278,128" fill="none" stroke={GLOW} strokeWidth="1.2" opacity=".8" />
        <path d="M196,80V71H204V80Z" fill={GREIGE} />
        <ellipse cx="200" cy="68" rx="9" ry="5" fill={GREIGE} />
        <ellipse cx="198" cy="66.5" rx="4" ry="1.6" fill={GLOW} />
      </g>
      {/* Steam getting out under the lifted edge. */}
      {steam("M112,150c-6,-10 6,-16 0,-26s6,-16 2,-24", 0)}
      {steam("M128,146c-6,-10 6,-16 0,-26s6,-16 2,-22", 1.4)}
      {steam("M98,154c-5,-9 5,-14 0,-22s5,-12 2,-18", 2.8)}
      <Star x={276} y={60} r={6} cls={m("ca-twinkle")} delay={0.6} />
    </svg>
  );
}

/** "The room": an armchair in the corner and a floor lamp's pool of light. */
export function CovyRoomLamp({ className, animate = true }: CovyArtProps) {
  const art = useOffscreenPause();
  const id = useUid();
  const m = motion(animate);
  return (
    <svg viewBox="0 0 320 220" ref={art} className={className} aria-hidden="true" focusable="false">
      <defs>
        <Lights id={id} />
      </defs>

      {/* Light. */}
      <g className={m("ca-breathe")}>
        <circle cx="64" cy="62" r="62" fill={`url(#${id}g)`} />
        <path d="M38,78H90L176,210H8Z" fill={GLOW} opacity=".09" />
        <ellipse cx="124" cy="209" rx="114" ry="14" fill={`url(#${id}p)`} />
      </g>

      {/* Floor lamp. */}
      <ellipse cx="64" cy="211" rx="20" ry="4" fill={NAVY} />
      <path d="M64,209V76" stroke={NAVY} strokeWidth="2.6" />
      <path d="M44,42H84L94,78H34Z" fill={GREIGE} />
      <path d="M71,42H84L94,78H79Z" fill={MOCHA} opacity=".16" />
      <ellipse cx="64" cy="78" rx="30" ry="4.5" fill={GLOW} />
      <ellipse cx="64" cy="42" rx="20" ry="3" fill={GLOW} />

      {/* Armchair: channel back, rolled arms, a greige cushion. */}
      <ellipse cx="192" cy="211" rx="92" ry="5" fill={NAVY} opacity=".35" />
      <g fill={NAVY}>
        <path d="M122,196H133L130,211H125Z" />
        <path d="M251,196H262L259,211H254Z" />
      </g>
      <path d="M128,150V86Q128,62 152,60H232Q256,62 256,86V150Z" fill={MOCHA} />
      <g stroke={NAVY} strokeWidth="1.2" opacity=".28">
        <path d="M152,66V146M172,64V146M192,64V146M212,64V146M232,66V146" />
      </g>
      <path d="M131,146V88Q131,66 152,63" fill="none" stroke={GLOW} strokeWidth="1.4" opacity=".5" />
      <rect x="140" y="142" width="104" height="28" rx="8" fill={MOCHA} />
      <rect x="140" y="142" width="104" height="28" rx="8" fill={GREIGE} opacity=".14" />
      <rect x="116" y="166" width="152" height="32" rx="7" fill={MOCHA} />
      <rect x="116" y="166" width="152" height="32" rx="7" fill={NAVY} opacity=".14" />
      <path d="M122,172H262" stroke={GLOW} strokeWidth=".8" opacity=".3" />
      <rect x="110" y="110" width="34" height="86" rx="15" fill={MOCHA} />
      <path d="M113,190V125Q113,113 127,112" fill="none" stroke={GLOW} strokeWidth="1.6" strokeLinecap="round" opacity=".6" />
      <rect x="240" y="110" width="34" height="86" rx="15" fill={MOCHA} />
      <rect x="240" y="110" width="34" height="86" rx="15" fill={NAVY} opacity=".2" />
      <g transform="rotate(-12 170 130)">
        <rect x="148" y="112" width="44" height="36" rx="10" fill={GREIGE} />
        <path d="M156,116H184" stroke={GLOW} strokeWidth="1.2" opacity=".8" />
        <Star x={170} y={130} r={5} color={MOCHA} />
      </g>

      <Star x={120} y={30} r={5} cls={m("ca-twinkle")} delay={0.9} />
      <Star x={290} y={70} r={6} cls={m("ca-twinkle")} delay={2.6} />
    </svg>
  );
}

/** A small standalone candle for accents. */
export function CovyCandle({ className, animate = true }: CovyArtProps) {
  const art = useOffscreenPause();
  const id = useUid();
  const m = motion(animate);
  return (
    <svg viewBox="0 0 60 100" ref={art} className={className} aria-hidden="true" focusable="false">
      <defs>
        <Lights id={id} />
      </defs>
      <path d="M11,92L13,96Q30,100 47,96L49,92Z" fill={MOCHA} />
      <path d="M11,92L13,96Q30,100 47,96L49,92Z" fill={NAVY} opacity=".2" />
      <g transform="translate(30 92)">
        <Pillar h={44} id={id} cls={m} />
      </g>
    </svg>
  );
}

export default CovyNightTable;
