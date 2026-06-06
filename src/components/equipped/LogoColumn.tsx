import type { CSSProperties } from "react";
import { LOGOS } from "./logos";

type LogoColumnProps = {
  names: string[];
  direction: "up" | "down";
  durationSec: number;
};

function LogoTile({ name }: { name: string }) {
  return (
    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] sm:h-28 sm:w-28">
      <span className="block h-11 w-11 sm:h-12 sm:w-12">{LOGOS[name]}</span>
    </div>
  );
}

// One vertically-scrolling column. The set is duplicated so a -50% translate
// loops without a seam; per-tile bottom margin (not flex gap) keeps the two
// halves the exact same height. Pauses for reduced-motion users.
export function LogoColumn({ names, direction, durationSec }: LogoColumnProps) {
  const doubled = [...names, ...names];
  const animClass = direction === "up" ? "logo-col-up" : "logo-col-down";

  return (
    <div
      className={`flex flex-col ${animClass}`}
      style={{ "--logo-dur": `${durationSec}s` } as CSSProperties}
    >
      {doubled.map((name, index) => (
        <LogoTile key={`${name}-${index}`} name={name} />
      ))}
    </div>
  );
}
