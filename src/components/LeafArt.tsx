/**
 * The botanical from COVY's identity sheet, redrawn as line and fill: a broad
 * leaf in mocha with dusty blue veins, sitting on a blue ground. Two leaves,
 * overlapping, cropped by whatever frames them.
 */
function Leaf({ mocha, blue }: { mocha: string; blue: string }) {
  const veins = Array.from({ length: 9 }, (_, i) => {
    const y = 60 + i * 34;
    const spread = Math.sin(((y - 20) / 380) * Math.PI) * 110;
    return (
      <g key={i}>
        <path d={`M150,${y + 26} C${150 - spread * 0.5},${y + 6} ${150 - spread * 0.85},${y - 6} ${150 - spread},${y - 28}`} />
        <path d={`M150,${y + 26} C${150 + spread * 0.5},${y + 6} ${150 + spread * 0.85},${y - 6} ${150 + spread},${y - 28}`} />
      </g>
    );
  });
  return (
    <g>
      <path d="M150,0 C268,96 306,230 150,400 C-6,230 32,96 150,0Z" fill={mocha} />
      <g fill="none" stroke={blue} strokeWidth="4" strokeLinecap="round">
        <path d="M150,14 L150,430" strokeWidth="6" />
        {veins}
      </g>
    </g>
  );
}

export default function LeafArt({ mocha, blue, className }: { mocha: string; blue: string; className?: string }) {
  return (
    <svg viewBox="0 0 600 500" preserveAspectRatio="xMidYMin slice" className={className} aria-hidden="true">
      <rect width="600" height="500" fill={blue} />
      <g transform="translate(250,-60) rotate(18 150 200) scale(1.25)">
        <Leaf mocha={mocha} blue={blue} />
      </g>
      <g transform="translate(-60,60) rotate(-24 150 200) scale(0.95)" opacity="0.92">
        <Leaf mocha={mocha} blue={blue} />
      </g>
    </svg>
  );
}
