import { Starfield } from "./ui/starfield-1";

export function StarfieldBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-black">
      <Starfield
        starColor="rgba(255,255,255,1)"
        bgColor="rgba(0,0,0,1)"
        speed={0.6}
        quantity={500}
      />
    </div>
  );
}
