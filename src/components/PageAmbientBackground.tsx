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
            radial-gradient(ellipse 85vw 120vh at -10% 25%, rgba(70, 95, 195, 0.22), transparent 55%),
            radial-gradient(ellipse 50vw 85vh at -4% 22%, rgba(115, 145, 235, 0.20), transparent 60%),
            radial-gradient(ellipse 24vw 55vh at 0% 22%, rgba(180, 200, 255, 0.18), transparent 65%),
            radial-gradient(ellipse 60vw 80vh at 108% 65%, rgba(135, 85, 215, 0.12), transparent 60%),
            radial-gradient(ellipse 50vw 60vh at 95% 95%, rgba(40, 50, 110, 0.18), transparent 55%),
            linear-gradient(180deg, rgba(15, 18, 40, 0.55) 0%, transparent 22%, transparent 78%, rgba(0, 0, 0, 0.6) 100%),
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
