export function FooterHorizon() {
  const horizonSize = {
    width: "240vw",
    height: "400vw",
    bottom: "-375vw",
  } as const;

  const edgeFadeMask =
    "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.08) 18%, black 40%, black 60%, rgba(0,0,0,0.08) 82%, transparent 100%)";

  const brightCoreMask =
    "linear-gradient(to right, transparent 35%, rgba(0,0,0,0.3) 42%, black 48%, black 52%, rgba(0,0,0,0.3) 58%, transparent 65%)";

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          width: "70vw",
          height: "42vw",
          bottom: "20vw",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(230,215,255,0.32) 0%, rgba(180,140,240,0.16) 22%, rgba(139,92,246,0.06) 48%, transparent 68%)",
          filter: "blur(18px)",
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          width: "32vw",
          height: "20vw",
          bottom: "22vw",
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(255,245,255,0.4) 0%, rgba(222,200,255,0.18) 30%, transparent 60%)",
          filter: "blur(8px)",
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          ...horizonSize,
          border: "1.5px solid rgba(255,255,255,0.75)",
          WebkitMaskImage: edgeFadeMask,
          maskImage: edgeFadeMask,
        }}
      />

      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[50%]"
        style={{
          ...horizonSize,
          border: "2px solid rgba(255,255,255,1)",
          boxShadow:
            "0 0 14px rgba(255,255,255,0.55), 0 0 32px rgba(236,221,255,0.32)",
          WebkitMaskImage: brightCoreMask,
          maskImage: brightCoreMask,
        }}
      />
    </div>
  );
}
