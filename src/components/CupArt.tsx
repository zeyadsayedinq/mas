import type { CupDimPalette, CupLitPalette } from "../brands";

/**
 * The cup illustration, drawn inline as SVG rather than loaded as an image.
 *
 * Two reasons it is inline:
 *  - it recolours per brand from theme tokens, so all three pages share one
 *    drawing instead of shipping six near identical pictures
 *  - Vite inlines small SVG imports as percent encoded data URIs and does not
 *    escape parentheses, so an SVG containing url(#someGradient) breaks the
 *    outer CSS url() wrapper and the browser silently drops the background
 *
 * Geometry is identical between the dim and lit variants so the spotlight
 * reveals the same cup in the same place, only warmer.
 *
 * `idPrefix` must be unique per instance. Gradient and filter ids are global
 * in a document, so two cups sharing a prefix would fight over them.
 */

const VIEW_BOX = "0 0 1280 800";

interface DimProps {
  variant: "dim";
  palette: CupDimPalette;
  idPrefix: string;
  className?: string;
}

interface LitProps {
  variant: "lit";
  palette: CupLitPalette;
  idPrefix: string;
  className?: string;
}

export type CupArtProps = DimProps | LitProps;

export default function CupArt(props: CupArtProps) {
  const { idPrefix, className } = props;
  const id = (name: string) => `${idPrefix}-${name}`;
  const ref = (name: string) => `url(#${id(name)})`;

  if (props.variant === "dim") {
    const c = props.palette;
    return (
      <svg
        className={className}
        viewBox={VIEW_BOX}
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.bgTop} />
            <stop offset="60%" stopColor={c.bgMid} />
            <stop offset="100%" stopColor={c.bgBot} />
          </linearGradient>
          <linearGradient id={id("table")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c.tableTop} />
            <stop offset="100%" stopColor={c.tableBot} />
          </linearGradient>
          <radialGradient id={id("vignette")} cx="50%" cy="46%" r="65%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0" />
            <stop offset="75%" stopColor="#000000" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.75" />
          </radialGradient>
          <linearGradient id={id("cup")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.cupA} />
            <stop offset="55%" stopColor={c.cupB} />
            <stop offset="100%" stopColor={c.cupC} />
          </linearGradient>
          <filter id={id("blurSoft")}>
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id={id("blurSteam")}>
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <rect x="0" y="0" width="1280" height="800" fill={ref("bg")} />
        <rect x="0" y="470" width="1280" height="330" fill={ref("table")} />

        {/* ambient horizon light, barely there */}
        <ellipse
          cx="640"
          cy="430"
          rx="520"
          ry="180"
          fill={c.ambient}
          opacity="0.18"
          filter={ref("blurSoft")}
        />

        {/* saucer shadow */}
        <ellipse
          cx="640"
          cy="576"
          rx="240"
          ry="34"
          fill="#000000"
          opacity="0.5"
          filter={ref("blurSoft")}
        />

        {/* saucer */}
        <ellipse cx="640" cy="556" rx="214" ry="40" fill={c.saucerOuter} />
        <ellipse cx="640" cy="551" rx="196" ry="33" fill={c.saucerInner} />

        {/* steam, nearly invisible */}
        <g
          stroke={c.steam}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          opacity="0.1"
          filter={ref("blurSteam")}
        >
          <path d="M602,360 C588,320 620,300 606,262 C594,228 622,206 610,172" />
          <path d="M640,362 C654,322 624,298 638,260 C650,224 622,202 636,166" />
          <path d="M678,360 C664,322 694,300 680,264 C668,230 696,208 682,174" />
        </g>

        {/* cup handle */}
        <path
          d="M754,404 C806,404 818,468 762,486"
          fill="none"
          stroke={c.cupB}
          strokeWidth="24"
          strokeLinecap="round"
        />

        {/* cup body */}
        <path
          d="M520,388 C512,442 528,500 544,540 L736,540 C752,500 768,442 760,388 Z"
          fill={ref("cup")}
        />

        {/* rim and coffee surface */}
        <ellipse cx="640" cy="388" rx="120" ry="29" fill={c.rim} />
        <ellipse cx="640" cy="388" rx="106" ry="23" fill={c.coffee} />
        <ellipse cx="622" cy="382" rx="46" ry="10" fill={c.coffee} opacity="0.6" />

        <rect x="0" y="0" width="1280" height="800" fill={ref("vignette")} />
      </svg>
    );
  }

  const c = props.palette;
  return (
    <svg
      className={className}
      viewBox={VIEW_BOX}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={id("bg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.bgTop} />
          <stop offset="55%" stopColor={c.bgMid} />
          <stop offset="100%" stopColor={c.bgBot} />
        </linearGradient>
        <linearGradient id={id("table")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.tableTop} />
          <stop offset="100%" stopColor={c.tableBot} />
        </linearGradient>
        <radialGradient id={id("glow")} cx="50%" cy="44%" r="42%">
          <stop offset="0%" stopColor={c.glowCore} stopOpacity="0.85" />
          <stop offset="55%" stopColor={c.glowMid} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.glowMid} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("cup")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.cupA} />
          <stop offset="45%" stopColor={c.cupB} />
          <stop offset="100%" stopColor={c.cupC} />
        </linearGradient>
        <linearGradient id={id("coffee")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.coffeeTop} />
          <stop offset="100%" stopColor={c.coffeeBot} />
        </linearGradient>
        <filter id={id("blurSoft")}>
          <feGaussianBlur stdDeviation="14" />
        </filter>
        <filter id={id("blurSteam")}>
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <rect x="0" y="0" width="1280" height="800" fill={ref("bg")} />
      <rect x="0" y="470" width="1280" height="330" fill={ref("table")} />

      {/* warm ambient wash across the table */}
      <ellipse cx="640" cy="440" rx="560" ry="210" fill={ref("glow")} />

      {/* steam, gently rising and visible */}
      <g
        stroke={c.steam}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
        filter={ref("blurSteam")}
      >
        <path d="M602,358 C586,316 622,296 606,256 C592,220 624,198 608,160" />
        <path d="M640,360 C656,318 622,294 638,254 C652,216 620,196 636,152" />
        <path d="M678,358 C662,318 696,298 680,260 C666,224 698,204 682,168" />
      </g>

      {/* saucer shadow */}
      <ellipse
        cx="640"
        cy="580"
        rx="250"
        ry="34"
        fill="#1c0f04"
        opacity="0.55"
        filter={ref("blurSoft")}
      />

      {/* saucer */}
      <ellipse cx="640" cy="556" rx="214" ry="40" fill={c.saucerOuter} />
      <ellipse cx="640" cy="550" rx="196" ry="33" fill={c.saucerInner} />
      <ellipse
        cx="640"
        cy="550"
        rx="196"
        ry="33"
        fill="none"
        stroke={c.stripe}
        strokeWidth="2.5"
        opacity="0.55"
      />

      {/* cup handle */}
      <path
        d="M754,404 C812,404 826,470 764,490"
        fill="none"
        stroke={c.rimFill}
        strokeWidth="24"
        strokeLinecap="round"
      />

      {/* cup body */}
      <path
        d="M520,388 C512,442 528,500 544,540 L736,540 C752,500 768,442 760,388 Z"
        fill={ref("cup")}
      />

      {/* brand stripe down the cup */}
      <path
        d="M523,402 C517,448 530,498 544,532"
        fill="none"
        stroke={c.stripe}
        strokeWidth="4"
        opacity="0.7"
        strokeLinecap="round"
      />

      {/* rim wall */}
      <ellipse cx="640" cy="388" rx="120" ry="29" fill={c.rimFill} />

      {/* coffee surface and crema */}
      <ellipse cx="640" cy="388" rx="106" ry="23" fill={ref("coffee")} />
      <path
        d="M566,384 C600,368 680,368 714,384 C680,398 600,398 566,384 Z"
        fill={c.crema}
        opacity="0.85"
      />
      <path
        d="M600,384 C620,378 660,378 680,384 C660,390 620,390 600,384 Z"
        fill={c.cremaDeep}
        opacity="0.7"
      />
      <circle cx="640" cy="384" r="4.5" fill={c.glowCore} />

      <rect
        x="0"
        y="0"
        width="1280"
        height="800"
        fill={ref("glow")}
        opacity="0.25"
      />
    </svg>
  );
}
