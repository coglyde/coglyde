type PageAmbientBackgroundProps = {
  className?: string;
};

export function PageAmbientBackground({
  className = "",
}: PageAmbientBackgroundProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 64vw 58vh at -2% -6%, rgba(70, 92, 196, 0.26), transparent 58%),
            radial-gradient(ellipse 38vw 40vh at 4% -2%, rgba(214, 198, 226, 0.15), transparent 56%),
            radial-gradient(ellipse 64vw 58vh at 102% -6%, rgba(78, 98, 206, 0.26), transparent 58%),
            radial-gradient(ellipse 38vw 40vh at 96% -2%, rgba(150, 174, 246, 0.15), transparent 56%),
            linear-gradient(180deg, rgba(10, 14, 34, 0.5) 0%, transparent 42%, transparent 100%),
            #000000
          `,
        }}
      />

      <div
        className="absolute inset-0 mix-blend-soft-light opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}
