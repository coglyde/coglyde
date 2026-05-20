export function FooterHorizon() {
  const horizonStyle = {
    width: "240vw",
    height: "400vw",
    bottom: "calc(-400vw + 400px)",
  } as const;

  const edgeFadeMask =
    "linear-gradient(to right, transparent 18%, rgba(0,0,0,0.28) 29%, rgba(0,0,0,0.7) 40%, black 48%, black 52%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.28) 71%, transparent 82%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          width: "46vw",
          height: "22vw",
          bottom: "400px",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(240,220,255,0.32) 0%, rgba(200,160,240,0.16) 26%, rgba(150,100,230,0.06) 52%, transparent 74%)",
          filter: "blur(26px)",
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          width: "14vw",
          height: "7vw",
          bottom: "400px",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.7) 0%, rgba(252,240,255,0.32) 26%, rgba(220,190,245,0.12) 52%, transparent 72%)",
          filter: "blur(6px)",
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          ...horizonStyle,
          border: "1.5px solid rgba(255,255,255,0.9)",
          WebkitMaskImage: edgeFadeMask,
          maskImage: edgeFadeMask,
        }}
      />
    </div>
  );
}
