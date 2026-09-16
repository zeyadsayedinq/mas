/**
 * Products for the pinned scroll showcase. Drawn on transparent ground so
 * they sit on whatever the section background is, and inline so they recolour
 * with the brand rather than shipping as images.
 */

interface ArtProps {
  accent: string;
  className?: string;
}

export function CoffeeCup({ accent, className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="pa-cup" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="48%" stopColor="#F8F4EC" />
          <stop offset="100%" stopColor="#DCD2BF" />
        </linearGradient>
        <linearGradient id="pa-coffee" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A4B28" />
          <stop offset="100%" stopColor="#3E2418" />
        </linearGradient>
        <filter id="pa-shadow">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="pa-steam">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* steam */}
      <g stroke="#ffffff" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.5" filter="url(#pa-steam)">
        <path d="M168,132 C152,96 186,76 170,42" />
        <path d="M200,134 C216,98 184,78 200,38" />
        <path d="M232,132 C216,98 248,80 232,48" />
      </g>

      {/* drop shadow under the saucer */}
      <ellipse cx="200" cy="336" rx="132" ry="20" fill="#3E2418" opacity="0.18" filter="url(#pa-shadow)" />

      {/* saucer */}
      <ellipse cx="200" cy="322" rx="126" ry="24" fill="#EBE1CE" />
      <ellipse cx="200" cy="317" rx="112" ry="19" fill="#FFFFFF" />
      <ellipse cx="200" cy="317" rx="112" ry="19" fill="none" stroke={accent} strokeWidth="2" opacity="0.45" />

      {/* handle */}
      <path
        d="M292,204 C336,204 344,264 296,278"
        fill="none"
        stroke="#F4EFE5"
        strokeWidth="19"
        strokeLinecap="round"
      />

      {/* body */}
      <path d="M116,186 C110,232 126,282 142,310 L258,310 C274,282 290,232 284,186 Z" fill="url(#pa-cup)" />

      {/* brand stripe */}
      <path
        d="M120,198 C116,238 128,282 140,304"
        fill="none"
        stroke={accent}
        strokeWidth="5"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* rim and coffee */}
      <ellipse cx="200" cy="186" rx="84" ry="21" fill="#F8F4EC" />
      <ellipse cx="200" cy="186" rx="72" ry="16" fill="url(#pa-coffee)" />
      <path d="M148,183 C172,170 228,170 252,183 C228,194 172,194 148,183 Z" fill="#C79A63" opacity="0.85" />
      <path d="M176,183 C190,178 210,178 224,183 C210,188 190,188 176,183 Z" fill="#8E5E34" opacity="0.65" />
    </svg>
  );
}

export function Feteer({ accent, className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="pa-f-body" cx="42%" cy="36%" r="68%">
          <stop offset="0%" stopColor="#F5D9A2" />
          <stop offset="55%" stopColor="#E3B96F" />
          <stop offset="100%" stopColor="#C08F45" />
        </radialGradient>
        <filter id="pa-f-shadow">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>

      <ellipse cx="200" cy="300" rx="146" ry="22" fill="#8E5E34" opacity="0.2" filter="url(#pa-f-shadow)" />

      {/* plate */}
      <ellipse cx="200" cy="268" rx="158" ry="44" fill="#FFFFFF" />
      <ellipse cx="200" cy="264" rx="158" ry="44" fill="#F6F1E7" />
      <ellipse cx="200" cy="264" rx="140" ry="37" fill="none" stroke={accent} strokeWidth="2" opacity="0.4" />

      {/* layered pastry, stacked discs so the edges read as flaky layers */}
      <ellipse cx="200" cy="250" rx="132" ry="38" fill="#C08F45" />
      <ellipse cx="200" cy="240" rx="134" ry="38" fill="#D3A257" />
      <ellipse cx="200" cy="230" rx="136" ry="39" fill="#E3B96F" />
      <ellipse cx="200" cy="218" rx="134" ry="38" fill="url(#pa-f-body)" />

      {/* folded ridges */}
      <g stroke="#B98440" strokeWidth="2.5" fill="none" opacity="0.5">
        <path d="M88,212 C120,196 170,190 200,190 C232,190 282,196 312,212" />
        <path d="M104,228 C136,214 170,208 200,208 C232,208 266,214 296,228" />
        <path d="M128,240 C152,232 176,228 200,228 C226,228 250,232 274,240" />
      </g>

      {/* toasted highlights */}
      <ellipse cx="160" cy="200" rx="30" ry="11" fill="#F7E4B8" opacity="0.55" />
      <ellipse cx="246" cy="208" rx="24" ry="9" fill="#F7E4B8" opacity="0.4" />
      <ellipse cx="204" cy="186" rx="18" ry="7" fill="#FCF0CF" opacity="0.5" />

      {/* honey drizzle */}
      <path
        d="M152,178 C176,166 226,166 250,180"
        stroke="#E8A33C"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );
}

export function Ribeye({ accent, className }: ArtProps) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="pa-s-meat" cx="42%" cy="38%" r="70%">
          <stop offset="0%" stopColor="#8E4A33" />
          <stop offset="55%" stopColor="#6E3422" />
          <stop offset="100%" stopColor="#4A2016" />
        </radialGradient>
        <linearGradient id="pa-s-board" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A5A34" />
          <stop offset="100%" stopColor="#5E3A1F" />
        </linearGradient>
        <filter id="pa-s-shadow">
          <feGaussianBlur stdDeviation="10" />
        </filter>
        <filter id="pa-s-steam">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* steam off the rested steak */}
      <g stroke="#ffffff" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.32" filter="url(#pa-s-steam)">
        <path d="M156,150 C142,116 172,98 158,68" />
        <path d="M204,146 C218,112 190,94 204,62" />
        <path d="M250,152 C236,118 264,102 250,74" />
      </g>

      <ellipse cx="200" cy="330" rx="150" ry="22" fill="#2A1410" opacity="0.22" filter="url(#pa-s-shadow)" />

      {/* board */}
      <ellipse cx="200" cy="286" rx="150" ry="30" fill="#6B4523" />
      <ellipse cx="200" cy="280" rx="150" ry="30" fill="url(#pa-s-board)" />
      <ellipse cx="200" cy="280" rx="132" ry="24" fill="none" stroke="#C99A63" strokeWidth="2" opacity="0.35" />

      {/* steak body */}
      <path
        d="M96,236 C74,214 84,180 112,166 C134,155 150,168 176,160 C204,151 214,170 246,166 C286,161 316,178 314,206 C312,236 280,258 236,262 C186,267 124,264 96,236 Z"
        fill="url(#pa-s-meat)"
      />

      {/* fat cap along the top edge */}
      <path
        d="M112,168 C136,156 152,169 178,161 C206,152 216,171 248,167 C276,163 300,172 310,190"
        fill="none"
        stroke="#E8D3A8"
        strokeWidth="13"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* marbling */}
      <g stroke="#B9724F" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.5">
        <path d="M136,206 C152,196 168,208 184,200" />
        <path d="M196,222 C214,212 228,224 246,214" />
        <path d="M150,232 C168,226 180,236 198,230" />
        <path d="M244,192 C260,184 274,194 288,188" />
      </g>

      {/* grill marks */}
      <g stroke="#2E1109" strokeWidth="9" strokeLinecap="round" opacity="0.5">
        <path d="M128,190 L176,246" />
        <path d="M166,178 L216,240" />
        <path d="M208,176 L256,234" />
        <path d="M250,180 L290,226" />
      </g>

      {/* herb sprig in the brand green */}
      <g stroke={accent} strokeWidth="5" fill="none" strokeLinecap="round">
        <path d="M286,244 C300,232 308,218 310,202" />
        <path d="M296,236 C306,238 314,234 318,226" />
        <path d="M302,224 C312,224 320,218 324,210" />
      </g>

      {/* cracked pepper */}
      <g fill="#2A140C" opacity="0.65">
        <circle cx="150" cy="188" r="3" />
        <circle cx="206" cy="198" r="2.6" />
        <circle cx="262" cy="206" r="3" />
        <circle cx="182" cy="228" r="2.4" />
        <circle cx="236" cy="236" r="2.8" />
      </g>
    </svg>
  );
}
