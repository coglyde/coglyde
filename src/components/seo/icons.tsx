// Line icons for the SEO/GEO service page. Stroke-based, inherit color.
type IconProps = { className?: string };

const base = (className?: string) =>
  `h-6 w-6 ${className ?? ""}`;

export function LeafIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 9-5 13-9 13Z" />
      <path d="M4 20c2-4 5-7 9-9" />
    </svg>
  );
}

export function CoinIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <circle cx="12" cy="12" r="8" />
      <path d="M14.5 9.5A2.5 2 0 0 0 12 8c-1.4 0-2.5.8-2.5 2s1.1 1.8 2.5 1.8 2.5.8 2.5 2-1.1 2-2.5 2a2.5 2 0 0 1-2.5-1.5" />
      <path d="M12 6.5v1.5M12 16v1.5" />
    </svg>
  );
}

export function SparkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
      <path d="M12 8c.6 2.2 1.8 3.4 4 4-2.2.6-3.4 1.8-4 4-.6-2.2-1.8-3.4-4-4 2.2-.6 3.4-1.8 4-4Z" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function GaugeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="m13 14 3-3" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function DocIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <path d="M7 3h7l4 4v14H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4M9 12h6M9 16h6" />
    </svg>
  );
}

export function LinkIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <path d="M9 14a4 4 0 0 0 5.7.3l3-3A4 4 0 0 0 12 6l-1.5 1.5" />
      <path d="M15 10a4 4 0 0 0-5.7-.3l-3 3A4 4 0 0 0 12 18l1.5-1.5" />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={base(className)}>
      <path d="M4 19V5M4 19h16" />
      <path d="m7 15 3-3 3 2 5-6" />
    </svg>
  );
}
