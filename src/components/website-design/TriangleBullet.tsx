type Props = {
  className?: string;
};

export function TriangleBullet({ className }: Props) {
  return (
    <svg
      viewBox="0 0 12 12"
      aria-hidden
      className={className}
      fill="currentColor"
    >
      <path d="M6 2 L11 10 L1 10 Z" />
    </svg>
  );
}
