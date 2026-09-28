/**
 * Aroma's hero still life: what the room actually serves. An iced latte, a
 * coffee, a feteer, a grilled steak and fresh orange juice, drawn on a
 * transparent ground so it sits on the white page. Inline SVG so the green
 * follows the brand accent rather than shipping as a picture.
 *
 * Two arrangements. The wide one lines all five up for tablets and desktops.
 * The compact one keeps three, larger, so a phone still reads the food.
 */

interface FoodBevArtProps {
  accent: string;
  compact?: boolean;
  className?: string;
}

export type PieceKind = "latte" | "cup" | "feteer" | "steak" | "juice";

/** Everything stands on this line. */
export const FLOOR = 470;

/** Ground colour for the drop shadows and the glass edge, per surface. */
const SHADOW = { day: "#23301A", night: "#000000" };

export function Defs({ accent }: { accent: string }) {
  return (
    <defs>
      <filter id="fb-blur" x="-20%" y="-50%" width="140%" height="200%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
      <filter id="fb-blur-s" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="3" />
      </filter>
      <linearGradient id="fb-cup" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="48%" stopColor="#F8F4EC" />
        <stop offset="100%" stopColor="#DCD2BF" />
      </linearGradient>
      <linearGradient id="fb-coffee" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7A4B28" />
        <stop offset="100%" stopColor="#3E2418" />
      </linearGradient>
      <radialGradient id="fb-f-body" cx="42%" cy="36%" r="68%">
        <stop offset="0%" stopColor="#F5D9A2" />
        <stop offset="55%" stopColor="#E3B96F" />
        <stop offset="100%" stopColor="#C08F45" />
      </radialGradient>
      <radialGradient id="fb-s-meat" cx="42%" cy="38%" r="70%">
        <stop offset="0%" stopColor="#8E4A33" />
        <stop offset="55%" stopColor="#6E3422" />
        <stop offset="100%" stopColor="#4A2016" />
      </radialGradient>
      <linearGradient id="fb-s-board" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8A5A34" />
        <stop offset="100%" stopColor="#5E3A1F" />
      </linearGradient>
      <linearGradient id="fb-juice" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFC94D" />
        <stop offset="100%" stopColor="#F2801A" />
      </linearGradient>
      <linearGradient id="fb-milk" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FBF4E6" />
        <stop offset="100%" stopColor="#EBD9BC" />
      </linearGradient>
      <clipPath id="fb-latte-clip">
        <path d="M-48,-250 L-37,-14 Q0,-2 37,-14 L48,-250 Z" />
      </clipPath>
      <clipPath id="fb-juice-clip">
        <path d="M-42,-190 L-34,-14 Q0,-4 34,-14 L42,-190 Z" />
      </clipPath>
      <linearGradient id="fb-straw" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor={accent} />
        <stop offset="100%" stopColor={accent} />
      </linearGradient>
    </defs>
  );
}

const shadow = (rx: number) => (
  <ellipse cx="0" cy="2" rx={rx} ry="10" fill="currentColor" opacity="0.16" filter="url(#fb-blur)" />
);

/** Tall iced latte: milk over espresso, ice, green straw. Origin is the base. */
export function Latte({ x, night = false }: { x: number; night?: boolean }) {
  const edge = night ? "#8B93A8" : "#CFD8C0";
  return (
    <g transform={`translate(${x},${FLOOR})`}>
      {shadow(64)}
      <path d="M-48,-250 L-37,-14 Q0,-2 37,-14 L48,-250 Z" fill="#FFFFFF" fillOpacity={night ? 0.14 : 0.7} />
      <g clipPath="url(#fb-latte-clip)">
        <rect x="-60" y="-214" width="120" height="90" fill="url(#fb-milk)" />
        <path d="M-60,-142 C-34,-124 -12,-158 18,-140 C38,-128 50,-144 60,-140 L60,4 L-60,4 Z" fill="url(#fb-coffee)" />
        <path d="M-60,-142 C-34,-124 -12,-158 18,-140 C38,-128 50,-144 60,-140" fill="none" stroke="#C79A63" strokeWidth="3" opacity="0.8" />
        <g fill="#ffffff" fillOpacity="0.5" stroke="#ffffff" strokeOpacity="0.85" strokeWidth="2">
          <rect x="-34" y="-236" width="30" height="30" rx="7" transform="rotate(-14 -19 -221)" />
          <rect x="4" y="-226" width="28" height="28" rx="7" transform="rotate(12 18 -212)" />
          <rect x="-22" y="-196" width="28" height="28" rx="7" transform="rotate(-6 -8 -182)" />
        </g>
        <rect x="-40" y="-244" width="8" height="200" rx="4" fill="#ffffff" opacity="0.55" />
      </g>
      <path d="M-48,-250 L-37,-14 Q0,-2 37,-14 L48,-250" fill="none" stroke={edge} strokeWidth="2.5" />
      <ellipse cx="0" cy="-250" rx="48" ry="7" fill="none" stroke={edge} strokeWidth="2.5" />
      <path d="M16,-312 L-4,-150" stroke="url(#fb-straw)" strokeWidth="10" strokeLinecap="round" fill="none" />
    </g>
  );
}

/** Coffee on a saucer. */
export function Cup({ x, scale, accent, steam = false }: { x: number; scale: number; accent: string; steam?: boolean }) {
  return (
    <g transform={`translate(${x},${FLOOR}) scale(${scale}) translate(-200,-346)`}>
      <ellipse cx="200" cy="344" rx="132" ry="20" fill="currentColor" opacity="0.16" filter="url(#fb-blur)" />
      {steam && (
        <g fill="none" stroke="#B7C39B" strokeWidth="8" strokeLinecap="round" filter="url(#fb-blur-s)">
          <path className="fb-steam" d="M172,150 C158,124 184,110 170,84" />
          <path className="fb-steam" style={{ animationDelay: "1.2s" }} d="M204,150 C218,122 192,108 206,80" />
          <path className="fb-steam" style={{ animationDelay: "2.3s" }} d="M234,150 C222,126 246,112 234,90" />
        </g>
      )}
      <ellipse cx="200" cy="322" rx="126" ry="24" fill="#E6EBDD" />
      <ellipse cx="200" cy="317" rx="112" ry="19" fill="#FFFFFF" />
      <ellipse cx="200" cy="317" rx="112" ry="19" fill="none" stroke={accent} strokeWidth="2" opacity="0.55" />
      <path d="M292,204 C336,204 344,264 296,278" fill="none" stroke="#EFEADD" strokeWidth="19" strokeLinecap="round" />
      <path d="M116,186 C110,232 126,282 142,310 L258,310 C274,282 290,232 284,186 Z" fill="url(#fb-cup)" />
      <path d="M120,198 C116,238 128,282 140,304" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
      <ellipse cx="200" cy="186" rx="84" ry="21" fill="#F8F4EC" />
      <ellipse cx="200" cy="186" rx="72" ry="16" fill="url(#fb-coffee)" />
      <path d="M148,183 C172,170 228,170 252,183 C228,194 172,194 148,183 Z" fill="#C79A63" opacity="0.85" />
      <path d="M176,183 C190,178 210,178 224,183 C210,188 190,188 176,183 Z" fill="#8E5E34" opacity="0.65" />
    </g>
  );
}

/** Layered feteer with a honey drizzle. The centrepiece. */
export function Feteer({ x, scale, accent }: { x: number; scale: number; accent: string }) {
  return (
    <g transform={`translate(${x},${FLOOR}) scale(${scale}) translate(-200,-308)`}>
      <ellipse cx="200" cy="304" rx="150" ry="20" fill="currentColor" opacity="0.16" filter="url(#fb-blur)" />
      <ellipse cx="200" cy="268" rx="158" ry="44" fill="#E9EEE0" />
      <ellipse cx="200" cy="264" rx="158" ry="44" fill="#FFFFFF" />
      <ellipse cx="200" cy="264" rx="140" ry="37" fill="none" stroke={accent} strokeWidth="2" opacity="0.55" />
      <ellipse cx="200" cy="250" rx="132" ry="38" fill="#C08F45" />
      <ellipse cx="200" cy="240" rx="134" ry="38" fill="#D3A257" />
      <ellipse cx="200" cy="230" rx="136" ry="39" fill="#E3B96F" />
      <ellipse cx="200" cy="218" rx="134" ry="38" fill="url(#fb-f-body)" />
      <g stroke="#B98440" strokeWidth="2.5" fill="none" opacity="0.5">
        <path d="M88,212 C120,196 170,190 200,190 C232,190 282,196 312,212" />
        <path d="M104,228 C136,214 170,208 200,208 C232,208 266,214 296,228" />
        <path d="M128,240 C152,232 176,228 200,228 C226,228 250,232 274,240" />
      </g>
      <ellipse cx="160" cy="200" rx="30" ry="11" fill="#F7E4B8" opacity="0.55" />
      <ellipse cx="246" cy="208" rx="24" ry="9" fill="#F7E4B8" opacity="0.4" />
      <path d="M152,178 C176,166 226,166 250,180" stroke="#E8A33C" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
      {/* a sprig of mint on the pastry */}
      <g fill={accent}>
        <ellipse cx="214" cy="190" rx="14" ry="6" transform="rotate(-28 214 190)" />
        <ellipse cx="230" cy="194" rx="13" ry="5.5" transform="rotate(14 230 194)" />
      </g>
    </g>
  );
}

/** Grilled rib eye on a board. */
export function Steak({ x, scale, accent }: { x: number; scale: number; accent: string }) {
  return (
    <g transform={`translate(${x},${FLOOR}) scale(${scale}) translate(-200,-316)`}>
      <ellipse cx="200" cy="312" rx="150" ry="20" fill="currentColor" opacity="0.18" filter="url(#fb-blur)" />
      <ellipse cx="200" cy="286" rx="150" ry="30" fill="#6B4523" />
      <ellipse cx="200" cy="280" rx="150" ry="30" fill="url(#fb-s-board)" />
      <ellipse cx="200" cy="280" rx="132" ry="24" fill="none" stroke="#C99A63" strokeWidth="2" opacity="0.35" />
      <path
        d="M96,236 C74,214 84,180 112,166 C134,155 150,168 176,160 C204,151 214,170 246,166 C286,161 316,178 314,206 C312,236 280,258 236,262 C186,267 124,264 96,236 Z"
        fill="url(#fb-s-meat)"
      />
      <path
        d="M112,168 C136,156 152,169 178,161 C206,152 216,171 248,167 C276,163 300,172 310,190"
        fill="none" stroke="#E8D3A8" strokeWidth="13" strokeLinecap="round" opacity="0.85"
      />
      <g stroke="#B9724F" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5">
        <path d="M136,206 C152,196 168,208 184,200" />
        <path d="M196,222 C214,212 228,224 246,214" />
        <path d="M150,232 C168,226 180,236 198,230" />
      </g>
      <g stroke="#2E1109" strokeWidth="9" strokeLinecap="round" opacity="0.5">
        <path d="M128,190 L176,246" />
        <path d="M166,178 L216,240" />
        <path d="M208,176 L256,234" />
        <path d="M250,180 L290,226" />
      </g>
      <g stroke={accent} strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M286,244 C300,232 308,218 310,202" />
        <path d="M296,236 C310,236 318,230 322,222" />
      </g>
    </g>
  );
}

/** Fresh orange juice with an orange slice on the rim. */
export function Juice({ x }: { x: number }) {
  return (
    <g transform={`translate(${x},${FLOOR})`}>
      {shadow(54)}
      <path d="M-42,-190 L-34,-14 Q0,-4 34,-14 L42,-190 Z" fill="#FFFFFF" fillOpacity="0.7" />
      <g clipPath="url(#fb-juice-clip)">
        <rect x="-50" y="-160" width="100" height="170" fill="url(#fb-juice)" />
        <ellipse cx="0" cy="-160" rx="44" ry="6" fill="#FFD98A" opacity="0.9" />
        <circle cx="-12" cy="-96" r="5" fill="#ffffff" opacity="0.3" />
        <circle cx="10" cy="-60" r="4" fill="#ffffff" opacity="0.3" />
        <circle cx="-6" cy="-30" r="3" fill="#ffffff" opacity="0.3" />
        <rect x="-32" y="-184" width="7" height="160" rx="3.5" fill="#ffffff" opacity="0.5" />
      </g>
      <path d="M-42,-190 L-34,-14 Q0,-4 34,-14 L42,-190" fill="none" stroke="#CFD8C0" strokeWidth="2.5" />
      <ellipse cx="0" cy="-190" rx="42" ry="6" fill="none" stroke="#CFD8C0" strokeWidth="2.5" />
      {/* mint and the orange wheel */}
      <g fill="#82A541">
        <ellipse cx="-14" cy="-206" rx="14" ry="6" transform="rotate(-38 -14 -206)" />
        <ellipse cx="2" cy="-210" rx="14" ry="6" transform="rotate(-8 2 -210)" />
      </g>
      <g transform="translate(34,-186)">
        <circle r="27" fill="#F79A1E" />
        <circle r="22" fill="#FFB84D" />
        <g stroke="#FFE2A6" strokeWidth="2.5" strokeLinecap="round">
          <path d="M0,-18 L0,18" />
          <path d="M-16,-9 L16,9" />
          <path d="M-16,9 L16,-9" />
        </g>
        <circle r="4" fill="#FFE2A6" />
      </g>
    </g>
  );
}

export default function FoodBevArt({ accent, compact = false, className }: FoodBevArtProps) {
  return (
    <svg
      viewBox={compact ? "0 110 600 390" : "0 110 1330 390"}
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ color: SHADOW.day }}
      role="img"
      aria-label="Iced latte, coffee, feteer, grilled steak and fresh orange juice"
    >
      <Defs accent={accent} />
      {compact ? (
        <>
          <g className="fb-float"><Latte x={92} /></g>
          <g className="fb-float" style={{ animationDelay: "-2s" }}><Feteer x={292} scale={1.1} accent={accent} /></g>
          <g className="fb-float" style={{ animationDelay: "-4s" }}><Cup x={470} scale={0.7} accent={accent} steam /></g>
        </>
      ) : (
        <>
          <g className="fb-float"><Latte x={140} /></g>
          <g className="fb-float" style={{ animationDelay: "-1.5s" }}><Cup x={385} scale={0.8} accent={accent} steam /></g>
          <g className="fb-float" style={{ animationDelay: "-3s" }}><Feteer x={690} scale={1.15} accent={accent} /></g>
          <g className="fb-float" style={{ animationDelay: "-4.5s" }}><Steak x={1010} scale={0.9} accent={accent} /></g>
          <g className="fb-float" style={{ animationDelay: "-2.2s" }}><Juice x={1215} /></g>
        </>
      )}
    </svg>
  );
}

/**
 * One dish or drink on its own, for cards. Same drawing as the spread, framed
 * tightly so it fills a square-ish tile.
 */
export function FoodBevPiece({
  kind,
  accent,
  night = false,
  shadow,
  className,
}: {
  kind: PieceKind;
  accent: string;
  night?: boolean;
  /** Overrides the shadow colour, e.g. the brand navy on a blue tile. */
  shadow?: string;
  className?: string;
}) {
  const box: Record<PieceKind, string> = {
    latte: "-75 145 150 350",
    cup: "30 245 340 255",
    feteer: "0 285 400 205",
    steak: "5 255 390 245",
    juice: "-75 250 150 250",
  };
  // The cup, feteer and steak are drawn at the origin of a 400 frame, so they
  // are placed at x=200 to sit in the middle of their boxes.
  const x = kind === "latte" || kind === "juice" ? 0 : 200;
  return (
    <svg
      viewBox={box[kind]}
      className={className}
      style={{ color: shadow ?? (night ? SHADOW.night : SHADOW.day) }}
      aria-hidden="true"
    >
      <Defs accent={accent} />
      {kind === "latte" && <Latte x={x} night={night} />}
      {kind === "juice" && <Juice x={x} />}
      {kind === "cup" && <Cup x={x} scale={1.15} accent={accent} />}
      {kind === "feteer" && <Feteer x={x} scale={1.2} accent={accent} />}
      {kind === "steak" && <Steak x={x} scale={1.25} accent={accent} />}
    </svg>
  );
}

/**
 * The evening still life for COVY: a coffee, the grill and a tall cold drink,
 * drawn to sit on a tile of the brand's dusty blue.
 */
export function NightSpread({ accent, shadow, className }: { accent: string; shadow?: string; className?: string }) {
  return (
    <svg
      viewBox="0 110 640 390"
      preserveAspectRatio="xMidYMid meet"
      className={className}
      style={{ color: shadow ?? SHADOW.night }}
      role="img"
      aria-label="Coffee, a grilled steak and a tall iced drink"
    >
      <Defs accent={accent} />
      <Cup x={112} scale={0.76} accent={accent} />
      <Steak x={330} scale={1.15} accent={accent} />
      <Latte x={568} />
    </svg>
  );
}
