/**
 * The four point star from inside the COVY monogram, used as the brand's own
 * punctuation in place of a bullet or a dot.
 */
export default function Sparkle({ size = 10, color = "currentColor", className = "" }: { size?: number; color?: string; className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" width={size} height={size} className={`shrink-0 ${className}`} fill={color}>
      <path d="M12 0 C12.9 7.2 16.8 11.1 24 12 C16.8 12.9 12.9 16.8 12 24 C11.1 16.8 7.2 12.9 0 12 C7.2 11.1 11.1 7.2 12 0Z" />
    </svg>
  );
}
