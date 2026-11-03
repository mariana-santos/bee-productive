/**
 * Marca do Bee Productive: um favo (hexágono) com um check dentro.
 * As cores vêm dos tokens do globals.css, então mudam junto com o tema.
 */

type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 34, className }: LogoMarkProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        fill="var(--color-honey)"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12.2l2.4 2.4 4.6-4.8"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Marca + nome. O SVG é decorativo (aria-hidden); o texto já dá o nome acessível.
export function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      <LogoMark />
      <span className="font-display text-title-sm font-semibold">Bee Productive</span>
    </span>
  );
}
