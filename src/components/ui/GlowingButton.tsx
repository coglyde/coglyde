import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  // Link mode (default): pass href (+ optional target/rel).
  href?: string;
  target?: string;
  rel?: string;
  // Button mode: omit href and pass onClick / type / disabled.
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

// Conic-gradient "comet" tuned to match the live coglyde.com glowing-wrapper
// button: a single soft purple arc that sweeps around the border.
const BORDER_GRADIENT =
  "conic-gradient(from 0deg at 50% 50%, rgba(112,124,255,0.7) 0deg, rgba(112,124,255,0) 60deg, rgba(112,124,255,0) 300deg, rgba(112,124,255,0.7) 360deg)";

// The animated border + fill + label, shared by the link and button forms.
function GlowingContents({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Spinning conic-gradient layer. Sized to 2x the button's longest side
          (via aspect-square + w-[200%]) so the rotating gradient still
          covers the full button when it spins. A faint `bg-white/12` sits
          under the conic so the dim half of the arc always falls back to a
          subtle static outline. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl bg-white/[0.12] transition-colors duration-300 group-hover:bg-white/[0.2]"
      >
        <span className="absolute left-1/2 top-1/2 aspect-square w-[200%] -translate-x-1/2 -translate-y-1/2">
          <span
            className="absolute inset-0 animate-[glowing-border-turn_6s_linear_infinite] transition-[filter] duration-300 ease-out group-hover:brightness-150 group-hover:saturate-150"
            style={{ backgroundImage: BORDER_GRADIENT }}
          />
        </span>
      </span>

      {/* Inner fill: sits 1.5px inside the gradient layer to leave a thin ring
          visible. A touch lighter on hover so the button reads as "lifted". */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-[1.5px] rounded-2xl bg-[#0a0a0c]/95 transition-colors duration-300 group-hover:bg-[#121218]/95"
      />

      <span className="relative px-6 py-4 text-[0.88rem] font-medium leading-[1.42] tracking-[-0.01em] text-white/90 transition-colors duration-300 group-hover:text-white">
        {children}
      </span>
    </>
  );
}

export function GlowingButton({
  children,
  className,
  href,
  target,
  rel,
  type,
  onClick,
  disabled,
}: Props) {
  const shared = [
    "group relative inline-flex items-center justify-center rounded-2xl",
    "transition-[transform,box-shadow] duration-300 ease-out",
    "hover:-translate-y-px hover:shadow-[0_0_38px_-6px_rgba(112,124,255,0.55)]",
    disabled ? "pointer-events-none opacity-50" : "",
    className ?? "",
  ].join(" ");

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={shared}>
        <GlowingContents>{children}</GlowingContents>
      </a>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={shared}>
      <GlowingContents>{children}</GlowingContents>
    </button>
  );
}
